"use client";

import { useState, useMemo } from "react";
import {
  TYPING_UNITS,
  TYPING_LESSONS,
  getLessonsByUnit,
} from "@/data/typingCurriculum";
import {
  isLevelUnlocked,
  getOverallProgressStats,
  toggleBypassUnlock,
  resetTypingProgress,
} from "@/lib/typingProgressService";
import {
  Star,
  Lock,
  Play,
  Trophy,
  CheckCircle2,
  Sparkles,
  Zap,
  Flame,
  RotateCcw,
  Unlock,
  ChevronRight,
  Info,
  X,
  Target,
} from "lucide-react";
import Swal from "sweetalert2";

export default function TypingStageMap({
  progress,
  siswaId = "guest",
  onSelectLevel,
  activeLevelId = 1,
}) {
  const [selectedUnitId, setSelectedUnitId] = useState(() => {
    // Cari unit dari level aktif
    const activeLesson = TYPING_LESSONS.find((l) => l.id === activeLevelId);
    return activeLesson ? activeLesson.unitId : 1;
  });

  const [previewLevel, setPreviewLevel] = useState(null);

  const stats = useMemo(() => getOverallProgressStats(progress), [progress]);

  const activeUnit = useMemo(
    () => TYPING_UNITS.find((u) => u.id === selectedUnitId) || TYPING_UNITS[0],
    [selectedUnitId]
  );

  const unitLessons = useMemo(
    () => getLessonsByUnit(selectedUnitId),
    [selectedUnitId]
  );

  // Hitung progres unit aktif
  const unitStats = useMemo(() => {
    const total = unitLessons.length;
    let completed = 0;
    let stars = 0;
    unitLessons.forEach((l) => {
      const rec = progress?.completedLevels?.[l.id];
      if (rec?.passed) {
        completed++;
        stars += rec.stars || 0;
      }
    });
    return {
      total,
      completed,
      stars,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [unitLessons, progress]);

  // Handler klik level node
  const handleLevelClick = (lesson) => {
    const unlocked = isLevelUnlocked(progress, lesson.id);
    if (!unlocked) {
      Swal.fire({
        title: "Level Masih Terkunci! 🔒",
        text: `Selesaikan Level ${lesson.id - 1} terlebih dahulu untuk membuka level ini, atau aktifkan mode "Buka Semua Level" di atas.`,
        icon: "info",
        confirmButtonText: "Mengerti",
        customClass: {
          popup: "border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] font-sans bg-white",
          title: "font-heading font-black text-black text-lg sm:text-xl",
          htmlContainer: "text-xs sm:text-sm font-medium text-slate-700",
          confirmButton: "bg-amber-300 hover:bg-amber-400 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-5 py-2.5 cursor-pointer",
        },
        buttonsStyling: false,
      });
      return;
    }

    setPreviewLevel(lesson);
  };

  // Handler reset progres dengan konfirmasi
  const handleReset = async () => {
    const res = await Swal.fire({
      title: "Reset Semua Progres?",
      text: "Seluruh bintang, rekor WPM, dan level yang sudah Anda buka akan diatur ulang kembali ke Level 1.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Reset Semua",
      cancelButtonText: "Batal",
      customClass: {
        popup: "border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] font-sans bg-white",
        title: "font-heading font-black text-black text-lg sm:text-xl",
        htmlContainer: "text-xs sm:text-sm font-medium text-slate-700",
        confirmButton: "bg-rose-500 hover:bg-rose-600 text-white font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-4 py-2.5 cursor-pointer ml-2",
        cancelButton: "bg-slate-200 hover:bg-slate-300 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-4 py-2.5 cursor-pointer mr-2",
      },
      buttonsStyling: false,
    });

    if (res.isConfirmed) {
      resetTypingProgress(siswaId);
    }
  };

  // Handler toggle mode bypass
  const handleToggleBypass = () => {
    const nextState = toggleBypassUnlock(siswaId);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: nextState ? "Mode Pengajar Aktif: Semua Level Terbuka! 🔓" : "Mode Progres Normal Aktif 🔒",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <div className="space-y-4 select-none">
      {/* ── TOP STATS OVERVIEW CARD ────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] font-black text-black">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-base sm:text-lg text-black">
                  Peta Tahapan Mengetik (Course Map)
                </h2>
                <span className="bg-cyan-300 border border-black px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold shadow-[1px_1px_0px_0px_#000]">
                  Gaya EdClub
                </span>
              </div>
              <p className="text-xs text-slate-600 font-mono font-medium">
                Pilih level bertahap, kumpulkan 5 bintang di setiap latihan!
              </p>
            </div>
          </div>

          {/* Quick Actions (Bypass Guru & Reset) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBypass}
              title={
                progress?.bypassUnlocked
                  ? "Kunci kembali level sesuai alur"
                  : "Buka semua level untuk pengajar / coba bebas"
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black transition-all cursor-pointer ${
                progress?.bypassUnlocked
                  ? "bg-emerald-400 text-black hover:bg-emerald-300"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {progress?.bypassUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-black" />
                  <span>Semua Terbuka</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Buka Semua</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              title="Reset Progres Mengetik"
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-rose-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-rose-700 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Realtime Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Total Stars */}
          <div className="bg-amber-50 border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
              <Star className="w-4 h-4 fill-black text-black" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Total Bintang</div>
              <div className="font-heading font-black text-sm sm:text-base text-black font-mono">
                {stats.totalStars} <span className="text-xs text-slate-500">/ {stats.maxPossibleStars}</span>
              </div>
            </div>
          </div>

          {/* Levels Completed */}
          <div className="bg-emerald-50 border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
              <CheckCircle2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Level Lulus</div>
              <div className="font-heading font-black text-sm sm:text-base text-emerald-900 font-mono">
                {stats.completedCount} <span className="text-xs text-slate-500">/ {stats.totalLessons}</span>
              </div>
            </div>
          </div>

          {/* Average WPM */}
          <div className="bg-cyan-50 border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Rata-rata WPM</div>
              <div className="font-heading font-black text-sm sm:text-base text-cyan-950 font-mono">
                {stats.averageWpm} <span className="text-xs text-slate-500">WPM</span>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-purple-50 border-2 border-black p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-300 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
              <Target className="w-4 h-4 text-black" />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase">
                <span>Progres Kurikulum</span>
                <span className="text-black font-black">{stats.progressPct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full border border-black mt-1 overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-300"
                  style={{ width: `${stats.progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── UNIT SELECTION TABS ────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {TYPING_UNITS.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          // Hitung progres unit ini
          const uLessons = getLessonsByUnit(unit.id);
          const uCompleted = uLessons.filter(
            (l) => progress?.completedLevels?.[l.id]?.passed
          ).length;
          const uPct = Math.round((uCompleted / uLessons.length) * 100);

          return (
            <button
              key={unit.id}
              onClick={() => setSelectedUnitId(unit.id)}
              className={`p-2.5 sm:p-3 rounded-xl border-2 border-black text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? "bg-black text-white shadow-[4px_4px_0px_0px_#FF6B00] scale-[1.02]"
                  : "bg-white text-slate-900 hover:bg-amber-50 shadow-[2px_2px_0px_0px_#000]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{unit.icon}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    isSelected
                      ? "bg-amber-400 text-black border-white"
                      : "bg-slate-100 text-slate-700 border-black/20"
                  }`}
                >
                  Unit {unit.id}
                </span>
              </div>

              <div>
                <div className="font-heading font-black text-xs leading-tight line-clamp-1">
                  {unit.title.replace(`Unit ${unit.id}: `, "")}
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <span className={isSelected ? "text-slate-300" : "text-slate-500"}>
                    {uCompleted}/{uLessons.length} Lulus
                  </span>
                  <span className={`font-bold ${isSelected ? "text-amber-300" : "text-emerald-700"}`}>
                    {uPct}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── ACTIVE UNIT STAGE BANNER ────────────────── */}
      <div className="bg-gradient-to-r from-amber-200 via-cyan-100 to-emerald-100 border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-black text-amber-300 border border-black font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                {activeUnit.title}
              </span>
              <span className="font-heading font-black text-xs text-slate-700">
                {activeUnit.subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {activeUnit.desc}
            </p>
          </div>

          <div className="bg-white border-2 border-black px-3.5 py-2 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-3">
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Capaian Unit</div>
              <div className="font-heading font-black text-sm text-black">
                {unitStats.completed}/{unitStats.total} Selesai · ⭐ {unitStats.stars}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-black bg-amber-300 flex items-center justify-center font-heading font-black text-xs text-black">
              {unitStats.pct}%
            </div>
          </div>
        </div>
      </div>

      {/* ── LEVEL JOURNEY GRID (EdClub Style Level Nodes) ────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
          <h3 className="font-heading font-black text-sm sm:text-base text-black flex items-center gap-2">
            <span>Daftar Level Pembelajaran</span>
            <span className="text-xs font-mono text-slate-500 font-normal">
              (Klik level yang terbuka untuk mulai latihan)
            </span>
          </h3>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono font-bold">
            <span className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3" /> Terkunci
            </span>
            <span className="flex items-center gap-1 text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-black"></span> Aktif
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Lulus
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {unitLessons.map((lesson) => {
            const isUnlocked = isLevelUnlocked(progress, lesson.id);
            const record = progress?.completedLevels?.[lesson.id];
            const isCompleted = !!record?.passed;
            const stars = record?.stars || 0;
            const isCurrentFocus = isUnlocked && !isCompleted;

            return (
              <div
                key={lesson.id}
                onClick={() => handleLevelClick(lesson)}
                className={`group relative border-3 border-black rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[145px] sm:min-h-[155px] ${
                  isCompleted
                    ? "bg-emerald-50 hover:bg-emerald-100 shadow-[4px_4px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5"
                    : isCurrentFocus
                    ? "bg-cyan-100 hover:bg-cyan-200 shadow-[4px_4px_0px_0px_#FF6B00] ring-3 ring-orange-400 animate-pulse hover:animate-none hover:-translate-y-0.5"
                    : isUnlocked
                    ? "bg-white hover:bg-amber-50 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5"
                    : "bg-slate-100 text-slate-400 shadow-[2px_2px_0px_0px_#94a3b8] opacity-75 cursor-not-allowed"
                }`}
              >
                {/* Level Type / Test Badge */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span
                    className={`px-1.5 py-0.2 rounded border text-[9px] ${
                      lesson.type === "test"
                        ? "bg-rose-400 text-white border-black font-black"
                        : lesson.type === "words"
                        ? "bg-purple-200 text-purple-900 border-purple-400"
                        : "bg-slate-200 text-slate-700 border-slate-300"
                    }`}
                  >
                    {lesson.type === "test"
                      ? "🏆 UJIAN"
                      : lesson.type === "words"
                      ? "📝 KATA"
                      : "🎯 DRILL"}
                  </span>

                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                  )}
                </div>

                {/* Level Center Avatar / Number */}
                <div
                  className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center font-heading font-black text-lg transition-transform group-hover:scale-105 shadow-[2px_2px_0px_0px_#000] ${
                    isCompleted
                      ? "bg-emerald-400 text-black"
                      : isCurrentFocus
                      ? "bg-cyan-400 text-black"
                      : isUnlocked
                      ? "bg-amber-300 text-black"
                      : "bg-slate-200 text-slate-400 border-slate-400 shadow-none"
                  }`}
                >
                  {isUnlocked ? (
                    <span>{lesson.id}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Level Short Name */}
                <div className="mt-1.5 w-full">
                  <div className="font-heading font-black text-xs text-black truncate">
                    {lesson.shortName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    {lesson.keys.slice(0, 3).join(", ")}
                    {lesson.keys.length > 3 ? "..." : ""}
                  </div>
                </div>

                {/* 5-Star Rating or Action CTA */}
                <div className="mt-2 w-full pt-1.5 border-t border-black/10 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= stars
                                ? "text-amber-500 fill-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-800">
                        {record.bestWpm || 0} WPM
                      </span>
                    </div>
                  ) : isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-heading font-black px-2 py-0.5 bg-black text-white rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                      <Play className="w-2.5 h-2.5 fill-white text-white" />
                      <span>Mulai</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Terkunci
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LEVEL PREVIEW POPUP MODAL ────────────────── */}
      {previewLevel && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewLevel(null);
          }}
        >
          <div className="relative bg-white border-4 border-black shadow-[10px_10px_0px_0px_#000] rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewLevel(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 bg-white hover:bg-rose-500 hover:text-white text-black border-2 border-black rounded-lg flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Level Info */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-300 border-2 border-black flex items-center justify-center font-heading font-black text-xl text-black shadow-[3px_3px_0px_0px_#000] shrink-0">
                {previewLevel.id}
              </div>
              <div>
                <span className="bg-cyan-300 text-black border border-black font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] uppercase">
                  Unit {previewLevel.unitId} · {previewLevel.type.toUpperCase()}
                </span>
                <h3 className="font-heading font-black text-lg text-black mt-1">
                  {previewLevel.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#FFFDF5] border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000] text-xs text-slate-700 font-medium leading-relaxed">
              {previewLevel.desc}
            </div>

            {/* Focus Keys & Target Accuracy */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 border-2 border-black p-2 rounded-lg">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Target Huruf</div>
                <div className="font-black text-black font-mono mt-0.5 truncate">
                  {previewLevel.keys.join("  ")}
                </div>
              </div>
              <div className="bg-slate-50 border-2 border-black p-2 rounded-lg">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Syarat Lulus</div>
                <div className="font-black text-emerald-800 font-mono mt-0.5">
                  Min. {previewLevel.minAccuracy}% Akurasi
                </div>
              </div>
            </div>

            {/* Existing Record if completed */}
            {progress?.completedLevels?.[previewLevel.id] && (
              <div className="bg-emerald-50 border-2 border-black p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-700">Rekor Anda:</span>
                </div>
                <div className="flex items-center gap-2 font-black">
                  <span className="text-black">
                    {progress.completedLevels[previewLevel.id].bestWpm} WPM
                  </span>
                  <span>·</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= (progress.completedLevels[previewLevel.id].stars || 0)
                            ? "text-amber-500 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const targetId = previewLevel.id;
                  setPreviewLevel(null);
                  onSelectLevel(targetId);
                }}
                className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-sm border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Mulai Latihan Level {previewLevel.id}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
