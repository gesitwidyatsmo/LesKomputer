"use client";

import { useState, useEffect, Suspense } from "react";
import { useSiswa } from "@/context/SiswaContext";
import {
  getQuizByMateri,
  getQuizHasilSiswa,
  submitQuizHasil,
} from "@/lib/quizService";
import { getMateriByModul } from "@/lib/materiService";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Clock,
  Star,
  Loader2,
  ArrowLeft,
  Sparkles,
  Check,
  Send,
  Eye,
  EyeOff,
} from "lucide-react";
import confetti from "canvas-confetti";

function triggerCelebration(isPerfect = false) {
  try {
    if (isPerfect) {
      // Double big fireworks for 100 score
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#FACC15', '#10B981', '#06B6D4', '#8B5CF6']
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6B00', '#FACC15', '#10B981']
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06B6D4', '#8B5CF6', '#F43F5E']
        });
      }, 250);
    } else {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#FACC15', '#06B6D4']
      });
    }
  } catch (err) {
    console.error("Confetti error:", err);
  }
}

function QuizCard({ quiz, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIdx]: optionIdx }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const soalList = quiz.soal || [];
  const totalQ = soalList.length;
  const q = soalList[currentIdx];

  const currentSelectedOption = selectedAnswers[currentIdx];

  // Count answered questions
  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[k] !== undefined && selectedAnswers[k] !== null
  ).length;

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const processSubmission = () => {
    let correctCount = 0;
    soalList.forEach((soal, idx) => {
      const correctIdx = soal.pilihan?.findIndex((p) => p.adalah_benar);
      if (selectedAnswers[idx] === correctIdx) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQ) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    const passingScore = quiz?.passing_score ?? 70;
    if (calculatedScore >= passingScore) {
      triggerCelebration(calculatedScore === 100);
    }

    onFinish(calculatedScore);
  };

  const handleSubmitQuiz = () => {
    const unansweredCount = totalQ - answeredCount;

    if (unansweredCount > 0) {
      Swal.fire({
        title: "Ada Soal Belum Terjawab!",
        html: `Masih ada <b>${unansweredCount} dari ${totalQ} soal</b> yang belum kamu jawab.<br/><span class="text-xs text-slate-500 mt-2 block">Yakin ingin mengumpulkan kuis sekarang?</span>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Tetap Kumpulkan",
        cancelButtonText: "Periksa Lagi",
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#64748b",
        customClass: {
          popup: "border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]",
          confirmButton: "border-2 border-black font-bold text-black rounded-lg cursor-pointer",
          cancelButton: "border-2 border-black font-bold text-white rounded-lg cursor-pointer",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          processSubmission();
        }
      });
    } else {
      Swal.fire({
        title: "Kumpulkan Jawaban?",
        text: "Semua soal sudah kamu jawab! Apakah kamu sudah yakin untuk mengumpulkannya?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Kumpulkan Sekarang! 🚀",
        cancelButtonText: "Periksa Dulu",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#64748b",
        customClass: {
          popup: "border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]",
          confirmButton: "border-2 border-black font-bold text-black rounded-lg cursor-pointer",
          cancelButton: "border-2 border-black font-bold text-white rounded-lg cursor-pointer",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          processSubmission();
        }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setShowReview(false);
    setScore(0);
  };

  if (totalQ === 0) {
    return (
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-8 text-center max-w-md mx-auto">
        <p className="font-bold text-slate-800 text-sm">
          Soal kuis belum tersedia untuk materi ini.
        </p>
      </div>
    );
  }

  // --- SUBMITTED / RESULTS SCREEN ---
  if (isSubmitted) {
    const passingScore = quiz?.passing_score ?? 70;
    let correctCount = 0;
    soalList.forEach((soal, idx) => {
      const correctIdx = soal.pilihan?.findIndex((p) => p.adalah_benar);
      if (selectedAnswers[idx] === correctIdx) {
        correctCount++;
      }
    });
    const isPassed = score >= passingScore;

    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
        <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-amber-300">Hasil Kuis Selesai!</span>
            </div>
            <span className="text-[11px] text-emerald-400">● Selesai & Dinilai</span>
          </div>

          <div className="p-6 sm:p-8 text-center space-y-6 bg-[#FFFDF5]">
            <div
              className={`w-24 h-24 mx-auto border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl flex items-center justify-center text-5xl ${
                isPassed ? "bg-emerald-300" : "bg-amber-300"
              }`}
            >
              {isPassed ? "🏆" : "💪"}
            </div>

            <div>
              <div className="inline-block px-3 py-1 font-heading font-black text-xs uppercase border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] mb-2 bg-white">
                {isPassed ? "🎉 Kamu Lulus Kuis!" : "📖 Yuk Belajar Lagi!"}
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-black">
                {isPassed ? "Hebat Sekali! 🌟" : "Tetap Semangat! 🚀"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
                Kamu berhasil menjawab {correctCount} dari {totalQ} soal dengan benar.
              </p>
            </div>

            {/* Score box & stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl space-y-1 col-span-3 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Nilai Akhir
                </span>
                <div
                  className={`text-4xl sm:text-5xl font-heading font-black ${
                    isPassed ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {score}
                </div>
                <p className="text-[10px] font-bold text-slate-500">
                  (Batas: {passingScore})
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl space-y-1 col-span-1.5 sm:col-span-1 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Jawaban Benar
                </span>
                <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-700">
                  {correctCount}
                </div>
                <p className="text-[10px] font-bold text-emerald-600">Soal</p>
              </div>

              <div className="p-4 bg-rose-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl space-y-1 col-span-1.5 sm:col-span-1 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">
                  Jawaban Salah
                </span>
                <div className="text-2xl sm:text-3xl font-heading font-black text-rose-700">
                  {totalQ - correctCount}
                </div>
                <p className="text-[10px] font-bold text-rose-600">Soal</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => setShowReview((prev) => !prev)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-300 hover:bg-cyan-200 text-black font-heading text-xs sm:text-sm font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                {showReview ? (
                  <>
                    <EyeOff className="w-4 h-4" /> Sembunyikan Pembahasan
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> Lihat Pembahasan Soal
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs sm:text-sm font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Main Kuis Lagi
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Review Section */}
        {showReview && (
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <span>📖</span>
                <span className="text-cyan-300">Pembahasan Lengkap Semua Soal</span>
              </div>
              <span className="text-[11px] text-amber-300">{totalQ} Soal</span>
            </div>

            <div className="p-5 sm:p-7 space-y-8 bg-[#FFFDF5]">
              {soalList.map((item, idx) => {
                const studentAns = selectedAnswers[idx];
                const correctOptIdx = item.pilihan?.findIndex((p) => p.adalah_benar);
                const isItemCorrect = studentAns === correctOptIdx;
                const isItemUnanswered = studentAns === undefined || studentAns === null;

                return (
                  <div
                    key={idx}
                    className="p-5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] space-y-4"
                  >
                    {/* Soal header badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-black bg-black text-white px-2.5 py-0.5 rounded font-heading">
                        Soal #{idx + 1}
                      </span>
                      {isItemUnanswered ? (
                        <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 border border-black rounded-full">
                          ⚪ Tidak Dijawab
                        </span>
                      ) : isItemCorrect ? (
                        <span className="text-[11px] font-bold bg-emerald-200 text-emerald-950 px-2.5 py-0.5 border border-black rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Jawabanmu Benar (+100%)
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold bg-rose-200 text-rose-950 px-2.5 py-0.5 border border-black rounded-full flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-800" /> Jawabanmu Kurang Tepat
                        </span>
                      )}
                    </div>

                    {/* Question text & optional image */}
                    <p className="text-sm sm:text-base font-heading font-black text-black leading-relaxed">
                      {item.pertanyaan}
                    </p>
                    {item.gambar_url && (
                      <div className="mt-2 flex justify-start">
                        <img
                          src={item.gambar_url}
                          alt="Gambar Soal"
                          className="max-h-56 w-auto max-w-full object-contain rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]"
                        />
                      </div>
                    )}

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {item.pilihan?.map((opt, optIdx) => {
                        const letter = ["A", "B", "C", "D"][optIdx] || "-";
                        const isCorrectOption = opt.adalah_benar;
                        const isChosenByStudent = studentAns === optIdx;

                        let optClass = "p-3 rounded-lg border-2 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ";

                        if (isCorrectOption) {
                          optClass += "bg-emerald-100 border-emerald-600 text-emerald-950 font-bold";
                        } else if (isChosenByStudent && !isCorrectOption) {
                          optClass += "bg-rose-100 border-rose-600 text-rose-950 font-bold";
                        } else {
                          optClass += "bg-slate-50 border-slate-200 text-slate-600";
                        }

                        return (
                          <div key={optIdx} className={optClass}>
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-6 h-6 border rounded flex items-center justify-center font-heading font-bold text-xs shrink-0 ${
                                  isCorrectOption
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : isChosenByStudent
                                    ? "bg-rose-600 text-white border-rose-700"
                                    : "bg-slate-200 text-slate-700 border-slate-300"
                                }`}
                              >
                                {letter}
                              </span>
                              {opt.gambar_url && (
                                <img
                                  src={opt.gambar_url}
                                  alt={`Pilihan ${letter}`}
                                  className="w-10 h-10 object-contain rounded border border-black bg-white shrink-0 p-0.5"
                                />
                              )}
                              {opt.teks && <span>{opt.teks}</span>}
                            </div>

                            <div className="text-[11px] font-heading font-black shrink-0">
                              {isCorrectOption && isChosenByStudent && (
                                <span className="text-emerald-700 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Pilihanmu (Benar ✓)
                                </span>
                              )}
                              {isCorrectOption && !isChosenByStudent && (
                                <span className="text-emerald-700 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Kunci Jawaban
                                </span>
                              )}
                              {!isCorrectOption && isChosenByStudent && (
                                <span className="text-rose-700">
                                  ✗ Pilihanmu
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Penjelasan */}
                    {item.penjelasan && (
                      <div className="p-3.5 bg-yellow-50 border border-amber-300 rounded-lg text-xs space-y-1 text-slate-800">
                        <p className="font-heading font-bold text-amber-900 flex items-center gap-1.5">
                          <span>💡 Pembahasan:</span>
                        </p>
                        <p className="leading-relaxed">{item.penjelasan}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- QUIZ IN PROGRESS SCREEN ---
  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
        <div className="flex items-center gap-2">
          <span>🎮</span>
          <span className="text-amber-300">Kuis Belajar Interaktif</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {quiz.durasi_menit
              ? `Waktu: ${quiz.durasi_menit} Menit`
              : "Santai (Tanpa Batas Waktu)"}
          </span>
        </div>
      </div>

      {/* Progress & Quick Jump Palette */}
      <div className="bg-slate-100 border-b-2 border-black p-3 space-y-2.5">
        <div className="flex items-center justify-between font-heading text-xs font-bold text-black px-1 flex-wrap gap-2">
          <span>
            Soal {currentIdx + 1} dari {totalQ}
          </span>
          <span className="text-xs text-slate-600">
            Terjawab: <strong className="text-emerald-700 font-heading font-black">{answeredCount}</strong> / {totalQ}
          </span>
        </div>

        {/* Question number buttons grid */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {soalList.map((_, idx) => {
            const isCurrent = idx === currentIdx;
            const isAnswered = selectedAnswers[idx] !== undefined && selectedAnswers[idx] !== null;

            let btnClass = "w-7 h-7 sm:w-8 sm:h-8 font-heading text-xs rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer ";

            if (isCurrent && isAnswered) {
              // Sedang dibuka & sudah dijawab -> Hijau dengan ring hitam tebal + shadow
              btnClass += "bg-emerald-400 border-black text-black font-black scale-110 ring-3 ring-black shadow-[3px_3px_0px_0px_#000] z-10";
            } else if (isCurrent && !isAnswered) {
              // Sedang dibuka & belum dijawab -> Kuning dengan ring hitam tebal
              btnClass += "bg-amber-300 border-black text-black font-black scale-110 ring-3 ring-black shadow-[3px_3px_0px_0px_#000] z-10";
            } else if (isAnswered) {
              // Tidak sedang dibuka tapi sudah dijawab -> Hijau
              btnClass += "bg-emerald-400 border-black text-black font-bold shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-300";
            } else {
              // Belum dijawab -> Putih
              btnClass += "bg-white border-slate-300 text-slate-600 hover:border-black hover:text-black";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={btnClass}
                title={`Soal ${idx + 1}: ${isAnswered ? "Sudah Dijawab" : "Belum Dijawab"}${isCurrent ? " (Sedang Dibuka)" : ""}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Palette Legend */}
        <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-slate-600 border-t border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block" />
            <span>Belum dijawab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-400 border border-black inline-block" />
            <span>Sudah dijawab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-300 border border-black ring-1 ring-black inline-block" />
            <span>Sedang dibuka</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6 bg-yellow-50/30">
        {/* Question Box */}
        <div className="p-5 bg-yellow-100 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black bg-black text-white px-2.5 py-0.5 inline-block rounded font-heading">
              Soal #{currentIdx + 1}
            </span>
            {currentSelectedOption !== undefined && currentSelectedOption !== null && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-full">
                ✓ Sudah dipilih
              </span>
            )}
          </div>
          <p className="text-base sm:text-lg font-heading font-black text-black leading-relaxed">
            {q?.pertanyaan}
          </p>
          {q?.gambar_url && (
            <div className="mt-3 flex justify-center">
              <img
                src={q.gambar_url}
                alt="Gambar Soal"
                className="max-h-64 sm:max-h-80 w-auto max-w-full object-contain rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          )}
        </div>

        {/* Options A, B, C, D */}
        <div className="space-y-3">
          {q?.pilihan?.map((p, i) => {
            const letter = ["A", "B", "C", "D"][i] || "-";
            const isSelected = currentSelectedOption === i;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(i)}
                className={`w-full text-left p-4 border-2 border-black rounded-xl font-medium text-sm transition-all flex items-center justify-between gap-3.5 cursor-pointer ${
                  isSelected
                    ? "bg-amber-300 text-black font-bold shadow-[3px_3px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5 ring-1 ring-black"
                    : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-100/70 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 border-2 border-black font-heading font-black text-xs flex items-center justify-center rounded-lg shrink-0 ${
                      isSelected
                        ? "bg-black text-amber-300"
                        : "bg-slate-100 text-black"
                    }`}
                  >
                    {letter}
                  </span>
                  {p.gambar_url && (
                    <img
                      src={p.gambar_url}
                      alt={`Pilihan ${letter}`}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-md border border-black bg-white shrink-0 p-0.5"
                    />
                  )}
                  {p.teks && (
                    <span className="font-heading font-bold text-sm text-black">
                      {p.teks}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <span className="text-xs font-heading font-black bg-black text-amber-300 px-2 py-0.5 rounded shrink-0">
                    Pilihanmu ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-3">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => prev - 1)}
            className={`inline-flex items-center gap-1.5 px-4 py-3 font-heading font-bold text-xs uppercase border-2 border-black rounded-xl transition-all ${
              currentIdx === 0
                ? "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
                : "bg-white hover:bg-slate-100 text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Question Counter */}
          <div className="text-center font-heading font-bold text-xs text-slate-700">
            {currentIdx + 1} / {totalQ}
          </div>

          {/* Next / Submit Button */}
          {currentIdx < totalQ - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-yellow-300 hover:bg-yellow-200 text-black font-heading font-bold text-xs uppercase border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kumpulkan Jawaban</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizPageContent() {
  const { currentSiswa } = useSiswa();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeQuizData, setActiveQuizData] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentSiswa) return;

      setIsLoading(true);
      const { data: materiData } = await getMateriByModul(
        currentSiswa.modul_id
      );
      if (materiData) {
        setMateriList(materiData.filter((m) => m.tipe_konten !== "materi_saja"));
      }

      const { data: riwayatData } = await getQuizHasilSiswa(currentSiswa.id);
      if (riwayatData) {
        setRiwayat(riwayatData);
      }
      setIsLoading(false);

      const qMateri = searchParams.get("materi");
      if (qMateri) {
        handleStartQuiz(qMateri);
      }
    }
    loadData();
  }, [currentSiswa, searchParams]);

  const handleStartQuiz = async (materiId) => {
    setIsLoading(true);
    const { data } = await getQuizByMateri(materiId);
    if (data) {
      setActiveQuizId(materiId);
      setActiveQuizData(data);
    } else {
      Swal.fire({
        icon: "info",
        title: "Kuis Belum Tersedia",
        text: "Kuis untuk materi ini akan segera ditambahkan oleh guru ya!",
        customClass: {
          popup: "border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]",
          confirmButton: "bg-orange-500 border-2 border-black font-bold text-black rounded-lg",
        },
      });
    }
    setIsLoading(false);
  };

  const handleFinishQuiz = async (score) => {
    if (!currentSiswa || !activeQuizData) return;
    const status =
      score >= (activeQuizData.passing_score ?? 70) ? "lulus" : "tidak_lulus";
    await submitQuizHasil(currentSiswa.id, activeQuizData.id, score, status);

    const { data: riwayatData } = await getQuizHasilSiswa(currentSiswa.id);
    if (riwayatData) {
      setRiwayat(riwayatData);
    }
  };

  if (!currentSiswa) return null;

  if (isLoading && !activeQuizData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-8 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
          <p className="font-heading font-bold text-sm text-black">
            Sedang menyiapkan kuis seru untukmu... 🎮
          </p>
        </div>
      </div>
    );
  }

  // Active Quiz Terminal Session
  if (activeQuizData) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setActiveQuizId(null);
              setActiveQuizData(null);
              router.replace("/siswa/quiz");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-300 text-black font-heading text-xs font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Kuis</span>
          </button>
          <span className="text-xs font-bold bg-cyan-300 text-black px-3 py-1 border border-black rounded-full">
            Modul: {currentSiswa.modul}
          </span>
        </div>

        <QuizCard quiz={activeQuizData} onFinish={handleFinishQuiz} />
      </div>
    );
  }

  // Quiz Topic Selector & History Page
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>🎮</span>
            <span className="text-amber-300">Pusat Kuis & Latihan</span>
          </div>
          <span className="text-[11px] text-purple-300">● Kuis Interaktif</span>
        </div>

        <div className="p-5 sm:p-7 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-purple-400 text-black font-bold text-xs px-2.5 py-0.5 border border-black rounded">
                  Game & Kuis Siswa
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {currentSiswa.kelas}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                Kuis & Tantangan Belajar 🎮
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Ayo uji kemampuan kamu dengan kuis pilihan ganda yang seru dan asyik!
              </p>
            </div>

            <div className="bg-amber-100 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-3.5 text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">
                Total Kuis Selesai
              </span>
              <span className="font-heading font-black text-lg text-black">
                {riwayat.length} Kali Bermain
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Instruction */}
      <div className="p-4 bg-cyan-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
        <div className="p-2 bg-cyan-300 border border-black rounded-lg shrink-0 text-lg">
          💡
        </div>
        <div className="text-xs sm:text-sm space-y-1">
          <p className="font-heading font-bold text-black">
            Cara Mengerjakan Kuis:
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Pilih salah satu materi di bawah. Jawab semua soal dengan teliti dan leluasa. Kamu bisa berpindah antar-soal untuk memeriksa atau mengubah jawabanmu sebelum menekan tombol <strong>Kumpulkan Jawaban</strong> di akhir soal!
          </p>
        </div>
      </div>

      {/* Pilih Topik Quiz */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h2 className="font-heading font-black text-lg text-black tracking-tight">
            Pilih Topik Kuis yang Ingin Kamu Mainkan
          </h2>
        </div>

        {materiList.length === 0 ? (
          <div className="p-8 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-center text-xs text-slate-600 font-bold">
            Belum ada kuis yang tersedia untuk modul ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {materiList.map((materi, idx) => {
              const bgColors = [
                "bg-cyan-300 hover:bg-cyan-200",
                "bg-purple-300 hover:bg-purple-200",
                "bg-amber-300 hover:bg-amber-200",
                "bg-emerald-300 hover:bg-emerald-200",
                "bg-orange-300 hover:bg-orange-200",
              ];
              const cardBg = bgColors[idx % bgColors.length];

              return (
                <button
                  key={materi.id}
                  onClick={() => handleStartQuiz(materi.id)}
                  className={`group p-5 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between text-left cursor-pointer ${cardBg}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg flex items-center justify-center font-heading font-bold text-xs text-black">
                        #{materi.pertemuan}
                      </div>
                      <span className="text-[11px] font-bold bg-white text-black px-2.5 py-0.5 border border-black rounded-full">
                        Sesi Pertemuan {materi.pertemuan}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-sm text-black leading-snug group-hover:underline line-clamp-2">
                      {materi.judul}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/20 flex items-center justify-between font-heading text-xs font-black text-black">
                    <span>Mulai Main Kuis &gt;</span>
                    <Brain className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Riwayat Nilai Quiz */}
      <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span>Riwayat Hasil Kuis Kamu</span>
          </div>
          <span className="text-[11px] text-amber-300">Catatan Nilai</span>
        </div>

        <div className="p-5">
          <h2 className="font-heading font-black text-base text-black mb-4 flex items-center gap-2">
            <span>Daftar Nilai Kuis yang Pernah Dikerjakan</span>
          </h2>

          {riwayat.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-slate-300 rounded-xl text-xs text-slate-500 font-medium">
              Belum ada kuis yang kamu kerjakan. Yuk pilih kuis di atas untuk mulai!
            </div>
          ) : (
            <div className="space-y-2.5">
              {riwayat.map((q, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-purple-300 border border-black rounded-lg flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-black" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-black text-xs sm:text-sm text-black truncate">
                        {q.quiz?.judul || "Kuis Interaktif"}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {new Date(q.dikerjakan_pada).toLocaleDateString("id-ID")}{" "}
                        · Status:{" "}
                        <span
                          className={
                            q.status === "lulus"
                              ? "text-emerald-700 font-bold"
                              : "text-rose-700 font-bold"
                          }
                        >
                          {q.status === "lulus" ? "Lulus Kuis ✓" : "Perlu Belajar Lagi"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 font-heading font-black text-xs sm:text-sm border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ${
                      q.status === "lulus"
                        ? "bg-emerald-300 text-black"
                        : "bg-rose-300 text-black"
                    }`}
                  >
                    Skor: {q.nilai}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20 text-xs font-bold text-black font-heading">
          Sedang memuat kuis... 🎮
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
