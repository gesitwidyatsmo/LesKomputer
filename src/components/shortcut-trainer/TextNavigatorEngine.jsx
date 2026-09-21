"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  MousePointer2, 
  Sparkles, 
  Zap,
  HelpCircle 
} from "lucide-react";
import SvgShortcutKeyboard from "./SvgShortcutKeyboard";
import { shortcutAudio } from "@/lib/shortcutAudio";

export default function TextNavigatorEngine({
  level,
  onComplete,
  soundEnabled = true,
}) {
  const [text, setText] = useState(level?.initialText || "");
  const [cursor, setCursor] = useState(level?.initialCursor || 0);
  const [selection, setSelection] = useState(null); // [start, end] or null
  const [status, setStatus] = useState("idle"); // idle | success | wrong
  const [mouseWarning, setMouseWarning] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [reactionTime, setReactionTime] = useState(0);
  const [hintMsg, setHintMsg] = useState("");

  const [activeModifiers, setActiveModifiers] = useState({
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  });
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const isCompletedRef = useRef(false);

  // Inisialisasi setiap ganti level
  useEffect(() => {
    isCompletedRef.current = false;
    setText(level?.initialText || "");
    setCursor(level?.initialCursor || 0);
    setSelection(null);
    setStatus("idle");
    setMouseWarning(false);
    setHintMsg("");
    setStartTime(Date.now());
    setReactionTime(0);
    setPressedKeys(new Set());
    setActiveModifiers({ ctrl: false, shift: false, alt: false, meta: false });
  }, [level?.id, level?.initialText, level?.initialCursor]);

  // Helper untuk mencari batas kata ke depan (Ctrl + ➔)
  const findNextWordBoundary = (str, fromIndex) => {
    let i = fromIndex;
    const len = str.length;
    // Lewati spasi terdekat jika ada
    while (i < len && str[i] === " ") i++;
    // Lewati kata
    while (i < len && str[i] !== " ") i++;
    return Math.min(len, i);
  };

  // Helper untuk mencari batas kata ke belakang (Ctrl + ⬅)
  const findPrevWordBoundary = (str, fromIndex) => {
    let i = fromIndex;
    if (i <= 0) return 0;
    // Mundur lewati spasi
    while (i > 0 && str[i - 1] === " ") i--;
    // Mundur lewati kata
    while (i > 0 && str[i - 1] !== " ") i--;
    return Math.max(0, i);
  };

  // Verifikasi apakah goal tercapai
  const evaluateGoal = useCallback(
    (newText, newCursor, newSelection) => {
      if (!level || isCompletedRef.current) return;

      let isSuccess = false;
      const type = level.modeType;

      if (type === "jump-forward") {
        const target = level.targetCursor ?? newText.length;
        if (newCursor >= target) {
          isSuccess = true;
        }
      } else if (type === "jump-backward") {
        const target = level.targetCursor ?? 0;
        if (newCursor <= target) {
          isSuccess = true;
        }
      } else if (type === "jump-end") {
        if (newCursor >= newText.length) {
          isSuccess = true;
        }
      } else if (type === "jump-home") {
        if (newCursor <= 0) {
          isSuccess = true;
        }
      } else if (type === "select-word" || type === "select-end" || type === "select-home") {
        if (
          newSelection &&
          newSelection[0] === level.targetSelection[0] &&
          newSelection[1] === level.targetSelection[1]
        ) {
          isSuccess = true;
        }
      } else if (type === "delete-word-backward" || type === "delete-word-forward") {
        const cleanNew = newText.replace(/\s+/g, " ").trim();
        const cleanExpected = (level.expectedResultText || "").replace(/\s+/g, " ").trim();
        if (cleanNew === cleanExpected) {
          isSuccess = true;
        }
      }

      if (isSuccess) {
        isCompletedRef.current = true;
        const elapsed = Math.max(200, Date.now() - startTime);
        setReactionTime(elapsed);
        setStatus("success");
        if (soundEnabled) shortcutAudio.playSuccessChime();

        setTimeout(() => {
          if (onComplete) {
            onComplete({
              reactionMs: elapsed,
              isSuccess: true,
            });
          }
        }, 1100);
      }
    },
    [level, startTime, soundEnabled, onComplete]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cegat aksi browser untuk navigasi tombol
      if (
        ["ArrowLeft", "ArrowRight", "Home", "End", "Backspace", "Delete"].includes(e.key) ||
        (e.ctrlKey && ["ArrowLeft", "ArrowRight", "Backspace", "Delete"].includes(e.key))
      ) {
        e.preventDefault();
      }

      setActiveModifiers({
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      });

      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(e.key.toLowerCase());
        next.add(e.code.toLowerCase());
        return next;
      });

      if (isCompletedRef.current) return;

      let nextText = text;
      let nextCursor = cursor;
      let nextSelection = selection;

      // 1. Ctrl + ArrowRight (Lompat kata ke kanan)
      if (e.ctrlKey && !e.shiftKey && e.key === "ArrowRight") {
        nextCursor = findNextWordBoundary(text, cursor);
        nextSelection = null;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 2. Ctrl + ArrowLeft (Lompat kata ke kiri)
      else if (e.ctrlKey && !e.shiftKey && e.key === "ArrowLeft") {
        nextCursor = findPrevWordBoundary(text, cursor);
        nextSelection = null;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 3. End (Lompat ke akhir baris)
      else if (!e.ctrlKey && !e.shiftKey && e.key === "End") {
        nextCursor = text.length;
        nextSelection = null;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 4. Home (Lompat ke awal baris)
      else if (!e.ctrlKey && !e.shiftKey && e.key === "Home") {
        nextCursor = 0;
        nextSelection = null;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 5. Ctrl + Shift + ArrowRight (Seleksi kata ke kanan)
      else if (e.ctrlKey && e.shiftKey && e.key === "ArrowRight") {
        const boundary = findNextWordBoundary(text, cursor);
        const selStart = selection ? selection[0] : cursor;
        nextSelection = [selStart, boundary];
        nextCursor = boundary;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 6. Shift + End (Seleksi ke ujung baris)
      else if (!e.ctrlKey && e.shiftKey && e.key === "End") {
        const selStart = selection ? selection[0] : cursor;
        nextSelection = [selStart, text.length];
        nextCursor = text.length;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 7. Shift + Home (Seleksi ke awal baris)
      else if (!e.ctrlKey && e.shiftKey && e.key === "Home") {
        const selEnd = selection ? selection[1] : cursor;
        nextSelection = [0, selEnd];
        nextCursor = 0;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 8. Ctrl + Backspace (Hapus kata ke belakang)
      else if (e.ctrlKey && e.key === "Backspace") {
        const boundary = findPrevWordBoundary(text, cursor);
        nextText = text.slice(0, boundary) + text.slice(cursor);
        nextCursor = boundary;
        nextSelection = null;
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // 9. Ctrl + Delete (Hapus kata ke depan)
      else if (e.ctrlKey && e.key === "Delete") {
        const boundary = findNextWordBoundary(text, cursor);
        nextText = text.slice(0, cursor) + text.slice(boundary);
        nextCursor = cursor;
        nextSelection = null;
        setHintMsg("");
        if (soundEnabled) shortcutAudio.playKeyClick();
      }
      // Peringatan interaktif jika menekan tombol tanpa modifier yang diwajibkan
      else if (!e.ctrlKey && (e.key === "Backspace" || e.key === "Delete") && level.keys?.ctrl) {
        setHintMsg(`💡 Jangan tekan ${e.key} sendirian! Tahan tombol [Ctrl] lalu tekan [${e.key}]!`);
        if (soundEnabled) shortcutAudio.playErrorBuzz();
        setTimeout(() => setHintMsg(""), 3000);
      }
      else if (!e.ctrlKey && (e.key === "ArrowRight" || e.key === "ArrowLeft") && level.keys?.ctrl) {
        setHintMsg("💡 Tahan tombol [Ctrl] sambil menekan tombol panah untuk melompat per kata!");
        if (soundEnabled) shortcutAudio.playErrorBuzz();
        setTimeout(() => setHintMsg(""), 3000);
      }
      else if (!e.shiftKey && (e.key === "Home" || e.key === "End") && level.keys?.shift) {
        setHintMsg("💡 Tahan tombol [Shift] untuk memblok / menyeleksi teks!");
        if (soundEnabled) shortcutAudio.playErrorBuzz();
        setTimeout(() => setHintMsg(""), 3000);
      }

      setText(nextText);
      setCursor(nextCursor);
      setSelection(nextSelection);
      evaluateGoal(nextText, nextCursor, nextSelection);
    };

    const handleKeyUp = (e) => {
      setActiveModifiers({
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      });

      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        next.delete(e.code.toLowerCase());
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [text, cursor, selection, evaluateGoal, soundEnabled]);

  const handleMouseInterference = () => {
    setMouseWarning(true);
    if (soundEnabled) shortcutAudio.playErrorBuzz();
    setTimeout(() => setMouseWarning(false), 2200);
  };

  // Render teks dengan kursor dan seleksi visual
  const renderTextWithCursorAndSelection = () => {
    const chars = text.split("");

    return chars.map((char, index) => {
      const isCursorHere = cursor === index;
      const isSelected =
        selection &&
        index >= Math.min(selection[0], selection[1]) &&
        index < Math.max(selection[0], selection[1]);

      return (
        <span key={index} className="relative inline-block">
          {isCursorHere && (
            <span className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-red-600 animate-pulse z-10" />
          )}
          <span
            className={`${
              isSelected
                ? "bg-amber-300 text-slate-950 font-bold px-0.5 rounded-sm"
                : ""
            }`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      );
    });
  };

  if (!level) return null;

  return (
    <div className="space-y-6">
      {/* ── Main Speedrunner Card ────────────────── */}
      <div
        className={`border-3 border-black rounded-2xl p-5 sm:p-7 shadow-[8px_8px_0px_0px_#000] transition-all relative overflow-hidden ${
          status === "success"
            ? "bg-emerald-100 border-emerald-950"
            : mouseWarning
            ? "bg-rose-100 border-rose-950 animate-shake"
            : "bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cyan-300 border-2 border-black rounded font-mono text-[11px] font-black uppercase shadow-[2px_2px_0px_0px_#000]">
              🚀 TEXT NAVIGATOR
            </span>
            <span className="px-2 py-0.5 bg-slate-100 border border-black rounded font-mono text-[11px] font-bold text-slate-700">
              Tantangan Tanpa Mouse
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="hidden sm:inline px-2 py-0.5 bg-slate-100 border border-black rounded text-[11px] font-bold text-slate-700">
              Posisi Kursor: {cursor} / {text.length}
            </span>
            {mouseWarning ? (
              <span className="px-2 py-0.5 bg-rose-500 text-white font-black rounded border border-black animate-pulse">
                🚫 JANGAN SENTUH MOUSE!
              </span>
            ) : status === "success" ? (
              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4" /> LULUS ({reactionTime}ms)
              </span>
            ) : (
              <span className="text-slate-600">Gunakan Keyboard Kombinasi</span>
            )}
          </div>
        </div>

        {/* Level Title & Mission Goal */}
        <div className="space-y-2">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-black tracking-tight">
            {level.title}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-slate-800">
            🎯 Target: {level.instruction}
          </p>
        </div>

        {/* ── Mini Text Editor Canvas (Interactive) ─────────────── */}
        <div
          onClick={handleMouseInterference}
          className="my-5 p-5 sm:p-6 bg-slate-900 text-emerald-300 font-mono text-base sm:text-lg rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] cursor-not-allowed select-none relative overflow-hidden"
          title="Dilarang klik! Gunakan shortcut keyboard untuk berpindah kursor."
        >
          <div className="absolute top-2 right-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <MousePointer2 className="w-3 h-3 text-rose-400" />
            <span>Mouse Terkunci</span>
          </div>

          <div className="leading-loose tracking-wide break-words">
            {renderTextWithCursorAndSelection()}
            {cursor >= text.length && (
              <span className="inline-block w-[3px] h-5 bg-red-600 animate-pulse align-middle ml-0.5" />
            )}
          </div>
        </div>

        {/* ── Feedback & Alert Banners ─────────────── */}
        {hintMsg && (
          <div className="mb-4 p-3 bg-rose-100 border-2 border-black rounded-lg font-mono text-xs font-bold text-rose-950 shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{hintMsg}</span>
          </div>
        )}

        {status === "success" && (
          <div className="mb-4 p-3 bg-emerald-300 border-2 border-black rounded-lg font-mono text-xs font-bold text-emerald-950 shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-900 shrink-0" />
            <span>BERHASIL! Instruksi selesai dengan tepat ({reactionTime}ms). Beralih ke tahap berikutnya...</span>
          </div>
        )}

        {/* Target shortcut helper */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-amber-50 border-2 border-black rounded-lg text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Shortcut Target:</span>
            <kbd className="px-2.5 py-1 bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_#000] font-black text-black">
              {level.targetShortcut}
            </kbd>
          </div>

          <div className="text-slate-600 font-medium">
            💡 <span className="font-semibold text-slate-800">{level.hint}</span>
          </div>
        </div>
      </div>

      {/* ── Virtual Keyboard Display ────────────────── */}
      <SvgShortcutKeyboard
        activeModifiers={activeModifiers}
        pressedKeys={pressedKeys}
        targetKeys={level.keys}
        fingerHint={level.hint}
      />
    </div>
  );
}
