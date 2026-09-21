"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  RotateCcw,
  HelpCircle,
  Laptop
} from "lucide-react";
import SvgShortcutKeyboard from "./SvgShortcutKeyboard";
import { shortcutAudio } from "@/lib/shortcutAudio";

export default function OfficeNinjaEngine({
  level,
  onComplete,
  soundEnabled = true,
}) {
  const [activeModifiers, setActiveModifiers] = useState({
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  });
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [status, setStatus] = useState("idle"); // idle | success | wrong
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const isCompletedRef = useRef(false);

  // Reset state saat level berganti
  useEffect(() => {
    isCompletedRef.current = false;
    setStatus("idle");
    setFeedbackMessage("");
    setStartTime(Date.now());
    setReactionTime(0);
    setAttempts(0);
    setPressedKeys(new Set());
    setActiveModifiers({ ctrl: false, shift: false, alt: false, meta: false });
  }, [level?.id]);

  // Evaluasi kecocokan tombol
  const checkShortcutMatch = useCallback(
    (e) => {
      if (!level || isCompletedRef.current) return;

      const target = level.keys;
      const needCtrl = !!target.ctrl;
      const needShift = !!target.shift;
      const needAlt = !!target.alt;
      const needMeta = !!target.meta;
      const targetKey = (target.key || "").toLowerCase();

      // Deteksi tombol fisik
      const hasCtrl = e.ctrlKey;
      const hasShift = e.shiftKey;
      const hasAlt = e.altKey;
      const hasMeta = e.metaKey;
      const pressedKey = (e.key || "").toLowerCase();

      // Kecocokan modifier
      const modMatch =
        needCtrl === hasCtrl &&
        needShift === hasShift &&
        needAlt === hasAlt &&
        needMeta === hasMeta;

      // Kecocokan primary key
      const keyMatch = pressedKey === targetKey || e.code.toLowerCase() === `key${targetKey}` || e.code.toLowerCase() === targetKey;

      if (modMatch && keyMatch) {
        // SUKSES
        isCompletedRef.current = true;
        const elapsed = Math.max(200, Date.now() - startTime);
        setReactionTime(elapsed);
        setStatus("success");
        setFeedbackMessage(level.simulatedAction || "Kombinasi tombol tepat!");
        if (soundEnabled) shortcutAudio.playSuccessChime();

        setTimeout(() => {
          if (onComplete) {
            onComplete({
              reactionMs: elapsed,
              isSuccess: true,
              attempts: attempts + 1,
            });
          }
        }, 1100);
      } else if (
        // Abaikan jika hanya menekan tombol modifier saja
        !["control", "shift", "alt", "meta"].includes(pressedKey)
      ) {
        // SALAH KOMBINASI
        setAttempts((prev) => prev + 1);
        setStatus("wrong");
        setFeedbackMessage(
          `Kombinasi belum pas! Anda menekan: ${hasCtrl ? "Ctrl + " : ""}${
            hasShift ? "Shift + " : ""
          }${hasAlt ? "Alt + " : ""}${pressedKey.toUpperCase()}. Seharusnya: ${level.targetDisplay}`
        );
        if (soundEnabled) shortcutAudio.playErrorBuzz();

        setTimeout(() => {
          setStatus((current) => (current === "wrong" ? "idle" : current));
        }, 1800);
      }
    },
    [level, startTime, attempts, soundEnabled, onComplete]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Selalu cegat kombinasi browser berbahaya/bawaan (Ctrl+S, Ctrl+P, Ctrl+F, Ctrl+A, Ctrl+Z, Ctrl+K, Ctrl+H, Ctrl+E, Ctrl+Enter, dll)
      if (
        (e.ctrlKey && ["s", "p", "f", "a", "z", "y", "b", "i", "u", "d", "k", "h", "e", "enter"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ["t", "s", "escape", "z"].includes(e.key.toLowerCase()))
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

      if (soundEnabled && !isCompletedRef.current) {
        shortcutAudio.playKeyClick();
      }

      checkShortcutMatch(e);
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
  }, [checkShortcutMatch, soundEnabled]);

  if (!level) return null;

  return (
    <div className="space-y-6">
      {/* ── Mission Narrative Card ────────────────── */}
      <div
        className={`border-3 border-black rounded-2xl p-5 sm:p-7 shadow-[8px_8px_0px_0px_#000] transition-all relative overflow-hidden ${
          status === "success"
            ? "bg-emerald-100 border-emerald-950"
            : status === "wrong"
            ? "bg-rose-50 border-rose-950 animate-shake"
            : "bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-300 border-2 border-black rounded font-mono text-[11px] font-black uppercase shadow-[2px_2px_0px_0px_#000]">
              ⚡ MISI OFFICE NINJA
            </span>
            <span className="px-2 py-0.5 bg-slate-100 border border-black rounded font-mono text-[11px] font-bold text-slate-700">
              {level.appContext}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Target Reaksi: &lt; 2.5 Detik</span>
          </div>
        </div>

        {/* Story Scenario */}
        <div className="space-y-3">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-black tracking-tight">
            {level.title}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed max-w-3xl">
            "{level.scenario}"
          </p>
        </div>

        {/* Target Shortcut Display Key */}
        <div className="my-6 p-4 sm:p-5 bg-amber-50 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider">
              Tekan Kombinasi Tombol Ini:
            </span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              {level.targetDisplay.split(" + ").map((part, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="font-mono font-black text-lg text-slate-400">+</span>}
                  <kbd className="px-3.5 py-2 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] font-mono font-black text-base sm:text-lg text-black inline-block">
                    {part}
                  </kbd>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-mono text-slate-600 mb-1">Status Respon:</div>
            {status === "success" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-400 border-2 border-black rounded-md font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000]">
                <CheckCircle2 className="w-4 h-4" />
                <span>SEMPURNA ({reactionTime}ms)</span>
              </span>
            ) : status === "wrong" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-400 border-2 border-black rounded-md font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="w-4 h-4" />
                <span>KOMBINASI SALAH</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-300 border-2 border-black rounded-md font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000] animate-pulse">
                <Zap className="w-4 h-4" />
                <span>MENUNGGU INPUT...</span>
              </span>
            )}
          </div>
        </div>

        {/* Feedback message / explanation */}
        {feedbackMessage && (
          <div
            className={`p-3 rounded-lg border-2 border-black font-mono text-xs font-bold shadow-[2px_2px_0px_0px_#000] ${
              status === "success"
                ? "bg-emerald-300 text-emerald-950"
                : "bg-rose-200 text-rose-950"
            }`}
          >
            {feedbackMessage}
          </div>
        )}

        {/* Footer info & tips */}
        <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{level.explanation}</span>
          </div>
        </div>
      </div>

      {/* ── Virtual Keyboard Display ────────────────── */}
      <SvgShortcutKeyboard
        activeModifiers={activeModifiers}
        pressedKeys={pressedKeys}
        targetKeys={level.keys}
        fingerHint={level.fingerHint}
      />
    </div>
  );
}
