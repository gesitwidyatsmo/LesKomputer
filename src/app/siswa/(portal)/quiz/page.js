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
  AlertCircle,
  Loader2,
  Terminal,
  ArrowLeft,
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
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] p-8 text-center max-w-md mx-auto font-mono">
        <p className="font-bold text-slate-800">[EMPTY_QUIZ] Soal quiz belum tersedia untuk topik ini.</p>
      </div>
    );
  }

  if (done) {
    const passingScore = quiz?.passing_score ?? 70;
    const correct = answers.filter((a) => a.correct).length;
    const isPassed = score >= passingScore;

    return (
      <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden max-w-lg mx-auto animate-in zoom-in-95 duration-200">
        {/* Retro Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 inline-block"></span>
            <span>sys_quiz_result.exe</span>
          </div>
          <span className="text-[10px] text-amber-300">[EVAL_COMPLETE]</span>
        </div>

        <div className="p-6 sm:p-8 text-center space-y-6 bg-[#FFFDF5]">
          <div
            className={`w-20 h-20 mx-auto border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center ${
              isPassed ? "bg-emerald-300" : "bg-rose-300"
            }`}
          >
            <Trophy className="w-10 h-10 text-black" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 font-mono font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-2 bg-white">
              {isPassed ? "STATUS: LULUS // KOMPETEN" : "STATUS: PERLU REMEDIAL"}
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase text-black">
              {isPassed ? "Hasil Luar Biasa! 🎉" : "Terus Berlatih! 💪"}
            </h3>
            <p className="font-mono text-xs text-slate-700 font-bold mt-1">
              Kamu menjawab {correct} dari {totalQ} pertanyaan dengan tepat
            </p>
          </div>

          {/* Score box */}
          <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-1">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
              FINAL_SCORE_CALCULATED
            </span>
            <div
              className={`text-5xl sm:text-6xl font-heading font-black ${
                isPassed ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {score}
            </div>
            <p className="font-mono text-xs font-bold text-slate-600">
              Skor Minimum Kelulusan: {passingScore} Poin
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
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-amber-300 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden max-w-2xl mx-auto">
      {/* Retro Window Bar with Timer */}
      <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 inline-block"></span>
          <span>sys_quiz_terminal.exe</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {quiz.durasi_menit
              ? `${quiz.durasi_menit} MENIT`
              : "UNTIMED_MODE"}
          </span>
        </div>
      </div>

      {/* Progress meter */}
      <div className="bg-slate-100 border-b-2 border-black p-1 flex items-center justify-between px-4 font-mono text-xs font-bold text-black">
        <span>
          SOAL {currentIdx + 1} / {totalQ}
        </span>
        <span className="bg-orange-500 text-black px-2 py-0.2 border border-black text-[11px]">
          {Math.round(((currentIdx + 1) / totalQ) * 100)}%
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-6 bg-yellow-50/40">
        {/* Question Box */}
        <div className="p-4 sm:p-5 bg-yellow-100 border-2.5 border-black shadow-[3px_3px_0px_0px_#000]">
          <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5 mb-2 inline-block">
            PERTANYAAN #{currentIdx + 1}
          </span>
          <p className="text-base sm:text-lg font-heading font-black text-black leading-relaxed">
            {q.pertanyaan}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.pilihan?.map((p, i) => {
            const letter = ["A", "B", "C", "D"][i] || "-";
            let btnClass =
              "w-full text-left p-3.5 sm:p-4 border-2 border-black font-medium text-sm transition-all flex items-center gap-3.5 ";

            if (!isAnswered) {
              btnClass +=
                "bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer";
            } else if (i === correctIdx) {
              btnClass +=
                "bg-emerald-300 text-black font-bold shadow-[3px_3px_0px_0px_#000] border-emerald-950";
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
                  className={`w-7 h-7 border-2 border-black font-mono font-black text-xs flex items-center justify-center shrink-0 ${
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

        {/* Explanation callout */}
        {showExplain && q.penjelasan && (
          <div
            className={`p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex gap-3 animate-in fade-in duration-200 ${
              isCorrect ? "bg-emerald-100" : "bg-rose-100"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
            )}
            <div className="font-mono text-xs">
              <p
                className={`font-black uppercase ${
                  isCorrect ? "text-emerald-900" : "text-rose-900"
                }`}
              >
                {isCorrect ? "[✓ JAWABAN ANDA BENAR]" : "[✗ JAWABAN ANDA KURANG TEPAT]"}
              </p>
              <p className="text-slate-800 mt-1 leading-relaxed">
                {q.penjelasan}
              </p>
            </div>
          </div>
        )}

        {/* Next Question CTA */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span>
              {currentIdx + 1 < totalQ
                ? ">_ Soal Berikutnya"
                : ">_ Selesai & Lihat Skor"}
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
        title: "Belum Tersedia",
        text: "Quiz untuk materi ini belum tersedia di sistem.",
        customClass: {
          popup: "border-3 border-black shadow-[6px_6px_0px_0px_#000]",
          confirmButton: "bg-orange-500 border-2 border-black font-bold text-black",
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
        <div className="p-8 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
          <p className="font-mono text-xs font-bold uppercase text-black">
            &gt;_ Membuka Sistem Quiz Interaktif...
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-300 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Quiz</span>
          </button>
          <span className="font-mono text-xs font-bold bg-cyan-300 text-black px-2 py-1 border border-black">
            MODUL: {currentSiswa.modul}
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
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-purple-400 border border-black inline-block"></span>
            <span>sys_quiz_hub.exe</span>
          </div>
          <span className="text-[10px] text-purple-300 font-mono">[TERMINAL_READY]</span>
        </div>

        <div className="p-5 sm:p-6 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-purple-400 text-black font-mono text-xs font-black px-2 py-0.5 border border-black uppercase">
                  [EVALUASI_MANDIRI]
                </span>
                <span className="font-mono text-xs font-bold text-slate-600">
                  {currentSiswa.kelas}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black uppercase tracking-tight">
                Quiz & Ujian Pemahaman Mandiri
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-700 font-bold mt-1">
                Latihan soal pilihan ganda berbasis kasus nyata untuk mengasah kompetensi.
              </p>
            </div>

            <div className="bg-amber-100 border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3 text-right shrink-0">
              <span className="font-mono text-[10px] font-bold text-slate-600 uppercase block">
                TOTAL_SELESAI
              </span>
              <span className="font-heading font-black text-lg text-black">
                {riwayat.length} QUIZ DIAMBIL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Instruction */}
      <div className="p-4 bg-cyan-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
        <div className="p-1.5 bg-cyan-300 border border-black shrink-0">
          <Terminal className="w-4 h-4 text-black" />
        </div>
        <div className="font-mono text-xs space-y-1">
          <p className="font-black text-black uppercase">
            &gt;_ Petunjuk Pengerjaan Terminal Quiz:
          </p>
          <p className="text-slate-700 leading-relaxed">
            Pilih topik materi yang ingin Anda uji. Setiap pertanyaan memiliki penjelasan kunci jawaban yang muncul seketika untuk mendukung proses belajar aktif.
          </p>
        </div>
      </div>

      {/* Pilih Topik Quiz */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono font-black text-black bg-yellow-300 px-2 py-0.5 border border-black text-xs">
            [SELECT_TOPIC]
          </span>
          <h2 className="font-heading font-black text-lg text-black uppercase tracking-tight">
            Pilih Modul Soal Quiz
          </h2>
        </div>

        {materiList.length === 0 ? (
          <div className="p-8 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] text-center font-mono text-xs text-slate-600 font-bold">
            [NO_QUIZ] Belum ada materi kuis yang tersedia untuk modul ini.
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
                  className={`group p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between text-left cursor-pointer ${cardBg}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-mono font-bold text-xs text-black">
                        #{materi.pertemuan}
                      </div>
                      <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5">
                        SESI P{materi.pertemuan}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-sm text-black uppercase leading-tight group-hover:underline line-clamp-2">
                      {materi.judul}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/20 flex items-center justify-between font-mono text-xs font-black text-black">
                    <span>MULAI QUIZ &gt;</span>
                    <Brain className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Riwayat Nilai Quiz */}
      <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 inline-block"></span>
            <span>sys_quiz_history.log</span>
          </div>
          <span className="text-[10px] text-amber-300">[RECORDS]</span>
        </div>

        <div className="p-5">
          <h2 className="font-heading font-black text-base text-black uppercase mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-black" />
            Riwayat Pengerjaan Quiz
          </h2>

          {riwayat.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-slate-300 font-mono text-xs text-slate-500 font-bold">
              [NO_HISTORY] Belum ada quiz yang dikerjakan. Pilih salah satu modul di atas untuk memulai.
            </div>
          ) : (
            <div className="space-y-2.5">
              {riwayat.map((q, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-purple-300 border border-black flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-black" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-black text-xs text-black uppercase truncate">
                        {q.quiz?.judul || "Quiz Interaktif"}
                      </p>
                      <p className="font-mono text-[10px] text-slate-600 font-bold mt-0.5">
                        {new Date(q.dikerjakan_pada).toLocaleDateString("id-ID")}{" "}
                        · Status:{" "}
                        <span
                          className={
                            q.status === "lulus"
                              ? "text-emerald-700 font-black"
                              : "text-rose-700 font-black"
                          }
                        >
                          [{q.status === "lulus" ? "LULUS" : "REMEDIAL"}]
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 font-mono font-black text-xs border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ${
                      q.status === "lulus"
                        ? "bg-emerald-300 text-black"
                        : "bg-rose-300 text-black"
                    }`}
                  >
                    SKOR: {q.nilai}
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
        <div className="flex justify-center py-20 font-mono text-xs font-bold text-black">
          &gt;_ Memuat Halaman Quiz...
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
