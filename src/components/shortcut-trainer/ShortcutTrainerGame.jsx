"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Zap,
  RotateCcw,
  Volume2,
  VolumeX,
  Star,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Keyboard,
  Layers,
  Sparkles,
  Award,
  Clock,
  Compass,
  Laptop,
  CheckCircle2
} from "lucide-react";
import { SHORTCUT_CURRICULUM } from "@/data/shortcutCurriculum";
import { 
  getShortcutProgress, 
  saveShortcutResult 
} from "@/lib/shortcutProgressService";
import { shortcutAudio } from "@/lib/shortcutAudio";
import OfficeNinjaEngine from "./OfficeNinjaEngine";
import TextNavigatorEngine from "./TextNavigatorEngine";
import { useSiswa } from "@/context/SiswaContext";

export default function ShortcutTrainerGame() {
  const siswaContext = useSiswa?.() || null;
  const currentSiswa = siswaContext?.currentSiswa || null;
  const awardXp = siswaContext?.awardXp || null;

  const [activeMode, setActiveMode] = useState("officeNinja"); // officeNinja | textNavigator
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progress, setProgress] = useState({ completedLevels: {}, totalStars: 0 });
  const [showModal, setShowModal] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi perangkat mobile/layar sentuh
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Ambil data progres tersimpan
  useEffect(() => {
    const data = getShortcutProgress(currentSiswa?.id || "guest");
    setProgress(data);
  }, [currentSiswa?.id]);

  // Daftar level aktif berdasarkan mode
  const currentUnitList = useMemo(() => {
    return SHORTCUT_CURRICULUM[activeMode]?.units || [];
  }, [activeMode]);

  const allLevels = useMemo(() => {
    return currentUnitList.flatMap((u) => u.levels);
  }, [currentUnitList]);

  const activeLevel = useMemo(() => {
    return allLevels[currentLevelIndex] || allLevels[0];
  }, [allLevels, currentLevelIndex]);

  const isLastLevel = currentLevelIndex >= allLevels.length - 1;

  // Toggle mode
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setCurrentLevelIndex(0);
    setShowModal(false);
  };

  // Toggle audio
  const handleToggleSound = () => {
    const newState = shortcutAudio.toggleSound();
    setSoundEnabled(newState);
  };

  // Selesaikan level
  const handleLevelComplete = useCallback(
    (stats) => {
      const levelId = activeLevel.id;
      const res = saveShortcutResult(
        currentSiswa?.id || "guest",
        activeMode,
        levelId,
        currentLevelIndex,
        stats
      );

      setLastResult({
        ...res,
        reactionMs: stats.reactionMs,
        levelTitle: activeLevel.title,
      });

      // Update state progres
      const updated = getShortcutProgress(currentSiswa?.id || "guest");
      setProgress(updated);

      // Berikan XP jika login sebagai siswa
      if (awardXp && res?.isPassed) {
        awardXp(25, `Menyelesaikan Level Shortcut: ${activeLevel.title}`);
      }

      // Tampilkan confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF6B00", "#FACC15", "#10B981", "#06B6D4"],
        });
      } catch (e) {}

      setShowModal(true);
    },
    [activeLevel, activeMode, currentLevelIndex, currentSiswa?.id, awardXp]
  );

  const handleNextLevel = () => {
    setShowModal(false);
    if (currentLevelIndex < allLevels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    }
  };

  const handleRestartLevel = () => {
    setShowModal(false);
    // Trigger reset by re-setting currentLevelIndex
    setCurrentLevelIndex((prev) => prev);
  };

  return (
    <div className="space-y-6">
      {/* ── Mobile Alert Notice ────────────────── */}
      {isMobile && (
        <div className="p-3.5 bg-amber-100 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center gap-3 text-xs font-mono text-amber-950">
          <Laptop className="w-5 h-5 text-orange-600 shrink-0" />
          <span>
            <strong>Tips Belajar:</strong> Modul kombinasi shortcut (Ctrl, Alt, Shift) dirancang untuk keyboard fisik PC/Laptop. Sambungkan keyboard fisik untuk pengalaman bermain optimal.
          </span>
        </div>
      )}

      {/* ── Top Game Toolbar (Mode Switcher & Controls) ────────────────── */}
      <div className="bg-white border-3 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleModeChange("officeNinja")}
            className={`px-3.5 py-2 rounded-lg border-2 border-black font-mono text-xs font-black transition-all flex items-center gap-2 ${
              activeMode === "officeNinja"
                ? "bg-amber-300 text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-[1px_1px_0px_0px_#000]"
            }`}
          >
            <Zap className="w-4 h-4 text-orange-600" />
            <span>Mode 1: Office Ninja</span>
          </button>

          <button
            onClick={() => handleModeChange("textNavigator")}
            className={`px-3.5 py-2 rounded-lg border-2 border-black font-mono text-xs font-black transition-all flex items-center gap-2 ${
              activeMode === "textNavigator"
                ? "bg-cyan-300 text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-[1px_1px_0px_0px_#000]"
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-700" />
            <span>Mode 2: Text Navigator</span>
          </button>
        </div>

        {/* Level Stats & Audio Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 border-2 border-black rounded-lg text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000]">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{progress.totalStars || 0} Total Bintang</span>
          </div>

          <button
            onClick={handleToggleSound}
            className="p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
            title={soundEnabled ? "Matikan Efek Suara" : "Aktifkan Efek Suara"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>

          <button
            onClick={handleRestartLevel}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all font-mono text-xs font-bold"
            title="Mulai Ulang Level Ini"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ulangi</span>
          </button>
        </div>
      </div>

      {/* ── Level Navigation Strip (Pills) ────────────────── */}
      <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000] overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="font-mono text-xs font-black text-slate-700 mr-2 uppercase">
            Level {currentLevelIndex + 1} / {allLevels.length}:
          </span>

          {allLevels.map((lvl, index) => {
            const isCurrent = index === currentLevelIndex;
            const record = progress.completedLevels[lvl.id];
            const stars = record?.stars || 0;

            return (
              <button
                key={lvl.id}
                onClick={() => {
                  setCurrentLevelIndex(index);
                  setShowModal(false);
                }}
                className={`px-3 py-1.5 rounded-lg border-2 border-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-black text-white shadow-[2px_2px_0px_0px_#FF6B00]"
                    : stars > 0
                    ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-950 shadow-[1px_1px_0px_0px_#000]"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-[1px_1px_0px_0px_#000]"
                }`}
              >
                <span>{index + 1}</span>
                {stars > 0 && (
                  <span className="text-amber-500 text-[11px]">
                    {"★".repeat(stars)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Game Engine Canvas ────────────────── */}
      <main aria-label="Game Engine Active Level">
        {activeMode === "officeNinja" ? (
          <OfficeNinjaEngine
            key={activeLevel?.id}
            level={activeLevel}
            onComplete={handleLevelComplete}
            soundEnabled={soundEnabled}
          />
        ) : (
          <TextNavigatorEngine
            key={activeLevel?.id}
            level={activeLevel}
            onComplete={handleLevelComplete}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* ── Victory Celebration Modal (Neobrutalism) ────────────────── */}
      {showModal && lastResult && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FFFDF5] border-4 border-black shadow-[10px_10px_0px_0px_#000] rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black rounded-lg font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
              <Sparkles className="w-4 h-4 text-black" />
              <span>{isLastLevel ? "SEMUA LEVEL SELESAI!" : "MISI SELESAI!"}</span>
            </div>

            <h3 className="font-heading font-black text-2xl text-black">
              {isLastLevel ? "Selamat! Semua Level Tuntas!" : "Refleks Luar Biasa!"}
            </h3>

            {/* Stars evaluation */}
            <div className="flex justify-center items-center gap-2 py-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-10 h-10 ${
                    starIdx <= lastResult.stars
                      ? "fill-amber-400 text-amber-500 animate-bounce"
                      : "fill-slate-200 text-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Reaction metrics */}
            <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="font-mono text-[11px] text-slate-500 uppercase">
                  Kecepatan Respon:
                </span>
                <p className="font-heading font-black text-lg text-black">
                  {lastResult.reactionMs} ms
                </p>
              </div>
              <div>
                <span className="font-mono text-[11px] text-slate-500 uppercase">
                  Peringkat Refleks:
                </span>
                <p className="font-heading font-black text-base text-emerald-600">
                  {lastResult.stars === 3
                    ? "⚡ Super Ninja"
                    : lastResult.stars === 2
                    ? "🔥 Mahir"
                    : "👍 Berhasil"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleRestartLevel}
                className="w-full sm:w-1/2 py-3 bg-white hover:bg-slate-100 text-black border-2 border-black rounded-xl font-mono text-xs font-bold shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi</span>
              </button>

              {isLastLevel ? (
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-1/2 py-3 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black rounded-xl font-heading font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai</span>
                </button>
              ) : (
                <button
                  onClick={handleNextLevel}
                  className="w-full sm:w-1/2 py-3 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black rounded-xl font-heading font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Level Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
