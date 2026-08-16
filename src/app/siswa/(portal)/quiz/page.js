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
  RotateCcw,
  Trophy,
  Clock,
  Star,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

function QuizCard({ quiz, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplain, setShowExplain] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const soalList = quiz.soal || [];
  const q = soalList[currentIdx];
  const totalQ = soalList.length;
  const isAnswered = selected !== null;

  const correctIdx = q?.pilihan?.findIndex((p) => p.adalah_benar);
  const isCorrect = selected === correctIdx;

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    setShowExplain(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, { correct: selected === correctIdx }];
    if (currentIdx + 1 < totalQ) {
      setAnswers(newAnswers);
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowExplain(false);
    } else {
      setAnswers(newAnswers);
      const calculatedScore = Math.round(
        (newAnswers.filter((a) => a.correct).length / totalQ) * 100
      );
      setScore(calculatedScore);
      setDone(true);
      onFinish(calculatedScore);
    }
  };

  if (totalQ === 0) {
    return (
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-8 text-center max-w-md mx-auto">
        <p className="font-bold text-slate-800 text-sm">Soal kuis belum tersedia untuk materi ini.</p>
      </div>
    );
  }

  if (done) {
    const passingScore = quiz?.passing_score ?? 70;
    const correct = answers.filter((a) => a.correct).length;
    const isPassed = score >= passingScore;

    return (
      <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-xl overflow-hidden max-w-lg mx-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span className="text-amber-300">Hasil Kuis Selesai!</span>
          </div>
          <span className="text-[11px] text-emerald-400">● Selesai</span>
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
              Kamu berhasil menjawab {correct} dari {totalQ} soal dengan benar.
            </p>
          </div>

          {/* Score box */}
          <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              Nilai Akhir Kamu
            </span>
            <div
              className={`text-5xl sm:text-6xl font-heading font-black ${
                isPassed ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {score}
            </div>
            <p className="text-xs font-bold text-slate-600">
              (Batas Lulus: {passingScore} Poin)
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelected(null);
                setAnswers([]);
                setShowExplain(false);
                setDone(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs sm:text-sm font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Main Kuis Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden max-w-2xl mx-auto">
      {/* Top Header with Timer */}
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

      {/* Progress meter */}
      <div className="bg-slate-100 border-b-2 border-black p-2 flex items-center justify-between px-5 font-heading text-xs font-bold text-black">
        <span>
          Pertanyaan {currentIdx + 1} dari {totalQ}
        </span>
        <span className="bg-orange-500 text-black px-2.5 py-0.5 rounded border border-black text-xs font-black">
          {Math.round(((currentIdx + 1) / totalQ) * 100)}%
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-6 bg-yellow-50/30">
        {/* Question Box */}
        <div className="p-5 bg-yellow-100 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
          <span className="text-xs font-black bg-black text-white px-2.5 py-0.5 mb-2.5 inline-block rounded font-heading">
            Soal #{currentIdx + 1}
          </span>
          <p className="text-base sm:text-lg font-heading font-black text-black leading-relaxed">
            {q.pertanyaan}
          </p>
        </div>

        {/* Options A, B, C, D */}
        <div className="space-y-3">
          {q.pilihan?.map((p, i) => {
            const letter = ["A", "B", "C", "D"][i] || "-";
            let btnClass =
              "w-full text-left p-4 border-2 border-black rounded-xl font-medium text-sm transition-all flex items-center gap-3.5 ";

            if (!isAnswered) {
              btnClass +=
                "bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer";
            } else if (i === correctIdx) {
              btnClass +=
                "bg-emerald-300 text-black font-bold shadow-[3px_3px_0px_0px_#000]";
            } else if (i === selected && selected !== correctIdx) {
              btnClass +=
                "bg-rose-300 text-black font-bold shadow-[3px_3px_0px_0px_#000]";
            } else {
              btnClass +=
                "bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed shadow-none";
            }

            return (
              <button
                key={i}
                className={btnClass}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
              >
                <span
                  className={`w-8 h-8 border-2 border-black font-heading font-black text-xs flex items-center justify-center rounded-lg shrink-0 ${
                    !isAnswered
                      ? "bg-slate-100 text-black"
                      : i === correctIdx
                      ? "bg-emerald-600 text-white"
                      : i === selected
                      ? "bg-rose-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {letter}
                </span>
                <span className="font-heading font-bold text-sm text-black">
                  {p.teks}
                </span>
              </button>
            );
          })}
        </div>

        {/* Positive Explanations */}
        {showExplain && q.penjelasan && (
          <div
            className={`p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] flex gap-3 animate-in fade-in duration-200 ${
              isCorrect ? "bg-emerald-100" : "bg-rose-100"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm">
              <p
                className={`font-heading font-black uppercase ${
                  isCorrect ? "text-emerald-950" : "text-rose-950"
                }`}
              >
                {isCorrect ? "🎉 Hore! Jawabanmu Benar!" : "💡 Ups! Jawaban belum tepat."}
              </p>
              <p className="text-slate-800 mt-1 leading-relaxed font-medium">
                {q.penjelasan}
              </p>
            </div>
          </div>
        )}

        {/* Next Question CTA */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-sm uppercase tracking-wide border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span>
              {currentIdx + 1 < totalQ
                ? "Lanjut ke Soal Berikutnya"
                : "Lihat Hasil & Skor Kuis"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
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
            Cara Bermain Kuis:
          </p>
          <p className="text-slate-700 leading-relaxed font-medium">
            Pilih salah satu materi di bawah. Jawab setiap soal dengan teliti. Kamu akan langsung tahu jawaban mana yang benar beserta pembahasannya!
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
