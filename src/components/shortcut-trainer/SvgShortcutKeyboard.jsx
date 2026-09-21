"use client";

import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Keyboard Visual Neobrutalism yang dioptimasi khusus untuk latihan kombinasi shortcut.
 * Menampilkan:
 * 1. Status Realtime tombol pengubah (Ctrl, Shift, Alt, Win) yang sedang ditekan
 * 2. Highlight tombol target kombinasi (warna kuning/oranye menyala)
 * 3. Kluster tombol navigasi (Home, End, Panah Arah, Backspace, Delete)
 */
export default function SvgShortcutKeyboard({
  activeModifiers = { ctrl: false, shift: false, alt: false, meta: false },
  pressedKeys = new Set(),
  targetKeys = { ctrl: false, shift: false, alt: false, meta: false, key: "" },
  fingerHint = "",
}) {
  const isKeyTarget = (k) => {
    if (!targetKeys) return false;
    const norm = (targetKeys.key || "").toLowerCase();
    return norm === k.toLowerCase();
  };

  const isKeyPressed = (k) => {
    return pressedKeys.has(k.toLowerCase()) || pressedKeys.has(k);
  };

  // Keyboard Rows layout
  const ROW_1 = [
    { code: "Escape", label: "ESC", width: "w-10 sm:w-12", isNav: true },
    { code: "1", label: "1" },
    { code: "2", label: "2" },
    { code: "3", label: "3" },
    { code: "4", label: "4" },
    { code: "5", label: "5" },
    { code: "6", label: "6" },
    { code: "7", label: "7" },
    { code: "8", label: "8" },
    { code: "9", label: "9" },
    { code: "0", label: "0" },
    { code: "-", label: "-" },
    { code: "=", label: "=" },
    { code: "Backspace", label: "⌫ Backspace", width: "w-16 sm:w-20", isSpecial: true },
  ];

  const ROW_2 = [
    { code: "Tab", label: "Tab", width: "w-12 sm:w-14", isSpecial: true },
    { code: "q", label: "Q" },
    { code: "w", label: "W" },
    { code: "e", label: "E" },
    { code: "r", label: "R" },
    { code: "t", label: "T" },
    { code: "y", label: "Y" },
    { code: "u", label: "U" },
    { code: "i", label: "I" },
    { code: "o", label: "O" },
    { code: "p", label: "P" },
    { code: "[", label: "[" },
    { code: "]", label: "]" },
    { code: "\\", label: "\\" },
  ];

  const ROW_3 = [
    { code: "CapsLock", label: "Caps", width: "w-14 sm:w-16", isSpecial: true },
    { code: "a", label: "A" },
    { code: "s", label: "S" },
    { code: "d", label: "D" },
    { code: "f", label: "F" },
    { code: "g", label: "G" },
    { code: "h", label: "H" },
    { code: "j", label: "J" },
    { code: "k", label: "K" },
    { code: "l", label: "L" },
    { code: ";", label: ";" },
    { code: "'", label: "'" },
    { code: "Enter", label: "↵ Enter", width: "w-16 sm:w-20", isSpecial: true },
  ];

  const ROW_4 = [
    { code: "ShiftLeft", label: "⇧ Shift", width: "w-16 sm:w-20", isModifier: "shift" },
    { code: "z", label: "Z" },
    { code: "x", label: "X" },
    { code: "c", label: "C" },
    { code: "v", label: "V" },
    { code: "b", label: "B" },
    { code: "n", label: "N" },
    { code: "m", label: "M" },
    { code: ",", label: "," },
    { code: ".", label: "." },
    { code: "/", label: "/" },
    { code: "ShiftRight", label: "⇧ Shift", width: "w-16 sm:w-20", isModifier: "shift" },
  ];

  const ROW_5 = [
    { code: "ControlLeft", label: "Ctrl", width: "w-12 sm:w-14", isModifier: "ctrl" },
    { code: "MetaLeft", label: "⊞ Win", width: "w-10 sm:w-12", isModifier: "meta" },
    { code: "AltLeft", label: "Alt", width: "w-10 sm:w-12", isModifier: "alt" },
    { code: " ", label: "Spacebar", width: "flex-1 min-w-[120px]" },
    { code: "AltRight", label: "Alt", width: "w-10 sm:w-12", isModifier: "alt" },
    { code: "ControlRight", label: "Ctrl", width: "w-12 sm:w-14", isModifier: "ctrl" },
  ];

  // Extra Navigation cluster
  const NAV_KEYS = [
    { code: "Home", label: "Home" },
    { code: "End", label: "End" },
    { code: "Delete", label: "Del" },
    { code: "ArrowLeft", label: "◀" },
    { code: "ArrowRight", label: "▶" },
    { code: "ArrowUp", label: "▲" },
    { code: "ArrowDown", label: "▼" },
  ];

  const getKeyStyling = (k) => {
    const isTargetMod = k.isModifier && targetKeys[k.isModifier];
    const isTargetNorm = isKeyTarget(k.code);
    const isTarget = isTargetMod || isTargetNorm;

    const isPressedMod = k.isModifier && activeModifiers[k.isModifier];
    const isPressedNorm = isKeyPressed(k.code);
    const isPressed = isPressedMod || isPressedNorm;

    // Active pressed
    if (isPressed && isTarget) {
      return "bg-emerald-400 text-emerald-950 border-black translate-x-0.5 translate-y-0.5 shadow-none ring-2 ring-emerald-500";
    }
    if (isPressed) {
      return "bg-cyan-300 text-slate-950 border-black translate-x-0.5 translate-y-0.5 shadow-none";
    }

    // Target key waiting to be pressed
    if (isTarget) {
      return "bg-amber-300 text-slate-950 border-black shadow-[3px_3px_0px_0px_#000] font-black animate-pulse ring-2 ring-orange-400";
    }

    // Modifier idle
    if (k.isModifier) {
      return "bg-slate-100 text-slate-900 border-black shadow-[2px_2px_0px_0px_#000] font-bold";
    }

    return "bg-white text-slate-800 border-black shadow-[2px_2px_0px_0px_#000]";
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black rounded-xl p-3 sm:p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
      {/* ── Status Bar Realtime Tombol Modifier ─────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black uppercase text-slate-700">
            Status Tuts Fisik:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-bold">
            <span
              className={`px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_#000] transition-colors ${
                activeModifiers.ctrl ? "bg-emerald-400 text-black font-black" : "bg-white text-slate-400"
              }`}
            >
              [CTRL {activeModifiers.ctrl ? "● ON" : "○"}]
            </span>
            <span
              className={`px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_#000] transition-colors ${
                activeModifiers.shift ? "bg-emerald-400 text-black font-black" : "bg-white text-slate-400"
              }`}
            >
              [SHIFT {activeModifiers.shift ? "● ON" : "○"}]
            </span>
            <span
              className={`px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_#000] transition-colors ${
                activeModifiers.alt ? "bg-emerald-400 text-black font-black" : "bg-white text-slate-400"
              }`}
            >
              [ALT {activeModifiers.alt ? "● ON" : "○"}]
            </span>
            <span
              className={`px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_#000] transition-colors ${
                activeModifiers.meta ? "bg-emerald-400 text-black font-black" : "bg-white text-slate-400"
              }`}
            >
              [WIN {activeModifiers.meta ? "● ON" : "○"}]
            </span>
          </div>
        </div>

        {fingerHint && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-black rounded text-[11px] font-mono text-amber-950 shadow-[1px_1px_0px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold">{fingerHint}</span>
          </div>
        )}
      </div>

      {/* ── Virtual Keyboard Display ─────────────── */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[640px] space-y-1.5 font-mono text-xs select-none">
          {/* Row 1 */}
          <div className="flex gap-1.5">
            {ROW_1.map((k) => (
              <div
                key={k.code}
                className={`h-9 sm:h-10 flex items-center justify-center border-2 rounded transition-all ${
                  k.width || "w-9 sm:w-10"
                } ${getKeyStyling(k)}`}
              >
                {k.label}
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-1.5">
            {ROW_2.map((k) => (
              <div
                key={k.code}
                className={`h-9 sm:h-10 flex items-center justify-center border-2 rounded transition-all ${
                  k.width || "w-9 sm:w-10"
                } ${getKeyStyling(k)}`}
              >
                {k.label}
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex gap-1.5">
            {ROW_3.map((k) => (
              <div
                key={k.code}
                className={`h-9 sm:h-10 flex items-center justify-center border-2 rounded transition-all ${
                  k.width || "w-9 sm:w-10"
                } ${getKeyStyling(k)}`}
              >
                {k.label}
              </div>
            ))}
          </div>

          {/* Row 4 */}
          <div className="flex gap-1.5">
            {ROW_4.map((k) => (
              <div
                key={k.code}
                className={`h-9 sm:h-10 flex items-center justify-center border-2 rounded transition-all ${
                  k.width || "w-9 sm:w-10"
                } ${getKeyStyling(k)}`}
              >
                {k.label}
              </div>
            ))}
          </div>

          {/* Row 5 */}
          <div className="flex gap-1.5">
            {ROW_5.map((k) => (
              <div
                key={k.code}
                className={`h-9 sm:h-10 flex items-center justify-center border-2 rounded transition-all ${
                  k.width || "w-9 sm:w-10"
                } ${getKeyStyling(k)}`}
              >
                {k.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation Cluster (Home, End, Arrows) ─────────────── */}
      <div className="pt-2 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 text-[11px]">Tuts Navigasi & Seleksi:</span>
          <div className="flex items-center gap-1.5">
            {NAV_KEYS.map((k) => (
              <div
                key={k.code}
                className={`px-2.5 py-1 min-w-[34px] text-center border-2 rounded text-[11px] font-bold transition-all ${getKeyStyling(
                  k
                )}`}
              >
                {k.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-300 border border-black rounded inline-block"></span>
            <span>Target Kombinasi</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-emerald-400 border border-black rounded inline-block"></span>
            <span>Ditekan Benar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
