"use client";

import { useRef, useState } from "react";
import { useSiswa } from "@/context/SiswaContext";
import {
  BarChart2,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  Terminal,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function NilaiPage() {
  const { currentSiswa } = useSiswa();
  const [showSertifikat, setShowSertifikat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const certRef = useRef(null);
  const [expandedModul, setExpandedModul] = useState(null);

  if (!currentSiswa) return null;

  const nilaiQuiz = currentSiswa.nilaiQuiz || [];
  const rata =
    nilaiQuiz.length > 0
      ? Math.round(
          nilaiQuiz.reduce((a, b) => a + (b.nilai || 0), 0) /
            nilaiQuiz.length
        )
      : 0;

  const kelulusan = currentSiswa.nilaiAkhir
    ? parseInt(currentSiswa.nilaiAkhir)
    : rata;

  const isLulus = currentSiswa.status === "Lulus";
  const tanggalLulusFormatted =
    currentSiswa.tanggalLulus ||
    currentSiswa.tanggal_lulus ||
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const mentorName = currentSiswa.mentor || "Instruktur GWA";
  const predikatLulus =
    currentSiswa.predikat ||
    (kelulusan >= 90 ? "Sangat Baik" : kelulusan >= 75 ? "Baik" : "Cukup");

  // Group nilai by modul secara aman
  const nilaiByModul = nilaiQuiz.reduce((acc, q) => {
    const modName =
      currentSiswa.modul || q.quiz?.materi?.modul_id || "Materi Kursus";
    if (!acc[modName]) acc[modName] = [];
    acc[modName].push(q);
    return acc;
  }, {});

  const generatePDF = async () => {
    if (!certRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(
        `Sertifikat_${(currentSiswa.nama || "Siswa").replace(/\s+/g, "_")}.pdf`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 border border-black inline-block"></span>
            <span>sys_transkrip_nilai.exe</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">[VERIFIED_ACADEMIC]</span>
        </div>

        <div className="p-5 sm:p-6 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-emerald-400 text-black font-mono text-xs font-black px-2 py-0.5 border border-black uppercase">
                  [REKAP_KOMPETENSI]
                </span>
                <span className="font-mono text-xs font-bold text-slate-600">
                  ID: {currentSiswa.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black uppercase tracking-tight">
                Transkrip Nilai & Sertifikat
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-700 font-bold mt-1">
                Rekapitulasi nilai evaluasi kuis, nilai akhir praktik, dan sertifikat resmi.
              </p>
            </div>

            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3 text-right shrink-0">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">
                STATUS_KELULUSAN
              </span>
              <span
                className={`font-heading font-black text-lg ${
                  isLulus ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {isLulus ? "🎓 TELAH LULUS" : "⏳ DALAM PROSES"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Kelulusan Banner ────────────────────────── */}
      {isLulus ? (
        <div className="bg-emerald-300 border-3 border-black shadow-[6px_6px_0px_0px_#000] p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-emerald-300 font-mono text-xs font-black uppercase">
                <Award className="w-3.5 h-3.5" /> [VERIFIED // GWA TECH COURSE]
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-black uppercase tracking-tight">
                🎓 SELAMAT, ANDA LULUS!
              </h2>
              <p className="font-mono text-xs sm:text-sm text-black font-bold">
                {currentSiswa.kelas} · Dinyatakan Lulus pada {tanggalLulusFormatted}
              </p>
            </div>

            {/* Score pill */}
            <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] p-4 text-center min-w-[160px]">
              <span className="font-mono text-[10px] font-bold text-slate-600 uppercase block">
                NILAI_AKHIR
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-emerald-600 mt-0.5">
                {currentSiswa.nilaiAkhir || rata}
              </div>
              <span className="inline-block mt-1 font-mono text-[11px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-black">
                {predikatLulus}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-black/20 flex flex-wrap gap-3">
            <button
              onClick={() => setShowSertifikat(!showSertifikat)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-slate-800 font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {showSertifikat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSertifikat ? "Sembunyikan E-Sertifikat" : "Lihat & Download E-Sertifikat"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500 uppercase block">
                PROGRESS_MENUNJU_KELULUSAN
              </span>
              <h3 className="font-heading font-black text-xl text-black uppercase mt-0.5">
                {currentSiswa.pertemuanSelesai || 0} /{" "}
                {currentSiswa.totalPertemuan || 10} Sesi Selesai
              </h3>
            </div>
            <span className="bg-amber-300 text-black px-2.5 py-1 font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {Math.max(0, (currentSiswa.totalPertemuan || 10) - (currentSiswa.pertemuanSelesai || 0))} SESI LAGI
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-slate-100 border-2 border-black p-0.5 overflow-hidden">
            <div
              className="h-full bg-orange-500 border-r border-black transition-all duration-500"
              style={{
                width: `${Math.round(
                  ((currentSiswa.pertemuanSelesai || 0) /
                    (currentSiswa.totalPertemuan || 10)) *
                    100
                )}%`,
              }}
            />
          </div>
          <p className="font-mono text-xs text-slate-600">
            E-Sertifikat kelulusan akan diterbitkan otomatis setelah Anda menyelesaikan seluruh sesi dan evaluasi modul.
          </p>
        </div>
      )}

      {/* ── Sertifikat Preview (Neobrutalism Frame) ───────── */}
      {showSertifikat && isLulus && (
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 inline-block"></span>
              <span>sys_certificate_compiler.exe</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-black uppercase border border-black shadow-[1.5px_1.5px_0px_0px_#fff] cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isGenerating ? "Compiling Certificate..." : "Download PDF Cetak"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-slate-200 overflow-x-auto flex justify-center">
            <div className="min-w-[720px] transform scale-[0.7] sm:scale-80 md:scale-90 lg:scale-100 origin-top my-2">
              <div
                ref={certRef}
                className="w-[1122px] h-[793px] bg-white relative p-16 shadow-2xl border-8 border-black font-sans"
              >
                {/* Neobrutalist Double Corners */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-orange-500" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-orange-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-orange-500" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-orange-500" />

                {/* Header */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 mx-auto bg-black text-amber-300 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center font-mono font-black text-3xl mb-3">
                    &gt;_
                  </div>
                  <h1 className="text-4xl font-heading font-black text-black tracking-wider uppercase">
                    SERTIFIKAT KOMPETENSI KOMPUTER
                  </h1>
                  <p className="font-mono text-sm font-bold text-slate-600 uppercase tracking-widest mt-1">
                    GWA TECH COURSE — LEMBAGA KURSUS DAN PELATIHAN
                  </p>
                  <div className="inline-block mt-2 px-3 py-0.5 bg-yellow-200 border-2 border-black font-mono text-xs font-bold">
                    NOMOR: {currentSiswa.id}/CERT/GWA/2026
                  </div>
                </div>

                {/* Body */}
                <div className="text-center space-y-4 mb-10">
                  <p className="font-mono text-sm uppercase text-slate-600 font-bold">
                    Diberikan Kepada Siswa Berprestasi:
                  </p>
                  <h2 className="text-4xl font-heading font-black text-black border-b-4 border-black inline-block px-12 pb-2 uppercase tracking-tight">
                    {currentSiswa.nama}
                  </h2>
                  <p className="text-lg text-slate-800 max-w-3xl mx-auto leading-relaxed mt-4 font-medium">
                    Telah menyelesaikan program pelatihan komputer praktik nyata modul{" "}
                    <strong className="text-black bg-yellow-300 px-1 border border-black">
                      {currentSiswa.modul}
                    </strong>{" "}
                    dan dinyatakan{" "}
                    <strong className="text-emerald-700 font-black">LULUS</strong> dengan predikat{" "}
                    <strong className="text-black">&quot;{predikatLulus}&quot;</strong> (Nilai Akhir:{" "}
                    {currentSiswa.nilaiAkhir || rata}).
                  </p>
                </div>

                {/* Footer Signatures */}
                <div className="absolute bottom-14 left-24 text-center font-mono">
                  <p className="text-xs font-bold text-slate-600 uppercase mb-16">
                    Instruktur Pembimbing
                  </p>
                  <div className="border-b-2 border-black w-48 mb-1" />
                  <p className="font-black text-black text-sm">{mentorName}</p>
                </div>

                <div className="absolute bottom-14 right-24 text-center font-mono">
                  <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                    Tanggal Terbit: {tanggalLulusFormatted}
                  </p>
                  <p className="text-xs font-bold text-slate-600 uppercase mb-12">
                    Pimpinan Lembaga GWA
                  </p>
                  <div className="border-b-2 border-black w-48 mb-1" />
                  <p className="font-black text-black text-sm">Gesit Widi Atmoko, S.Kom</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Metric Summary Cards ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            tag: "SYS_QUIZ_COUNT",
            label: "Total Quiz Diselesaikan",
            value: nilaiQuiz.length,
            icon: BarChart2,
            bg: "bg-cyan-100",
          },
          {
            tag: "AVG_EVAL_SCORE",
            label: "Rata-Rata Nilai Quiz",
            value: rata || "—",
            icon: Star,
            bg: "bg-amber-100",
          },
          {
            tag: "TOP_PERFORMANCE",
            label: "Nilai Tertinggi",
            value:
              nilaiQuiz.length > 0
                ? Math.max(...nilaiQuiz.map((q) => q.nilai))
                : "—",
            icon: TrendingUp,
            bg: "bg-emerald-100",
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`p-4 sm:p-5 ${s.bg} border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-4`}
            >
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                <Icon className="w-5 h-5 text-black" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase block">
                  [{s.tag}]
                </span>
                <p className="font-heading font-black text-2xl text-black truncate">
                  {s.value}
                </p>
                <p className="font-mono text-xs font-bold text-slate-800 truncate">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Nilai Per Modul (Accordion Grid) ────────── */}
      <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 inline-block"></span>
            <span>sys_modul_evaluasi.log</span>
          </div>
          <span className="text-[10px] text-amber-300">[RECAP_DATA]</span>
        </div>

        <div className="p-5">
          <h2 className="font-heading font-black text-base text-black uppercase mb-4">
            Rincian Nilai Evaluasi Per Modul
          </h2>

          {Object.keys(nilaiByModul).length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-300 font-mono text-xs text-slate-500 font-bold">
              [NO_RECORDS] Belum ada rekaman nilai quiz yang tercatat di sistem.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(nilaiByModul).map(([modul, items]) => {
                const avg = Math.round(
                  items.reduce((a, b) => a + b.nilai, 0) / items.length
                );
                const isOpen = expandedModul === modul;

                return (
                  <div
                    key={modul}
                    className="border-2 border-black shadow-[3px_3px_0px_0px_#000] overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 bg-amber-50/60 hover:bg-amber-100 transition-colors text-left cursor-pointer"
                      onClick={() => setExpandedModul(isOpen ? null : modul)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-300 border border-black flex items-center justify-center font-mono font-bold text-xs text-black">
                          &gt;_
                        </div>
                        <div>
                          <p className="font-heading font-black text-sm text-black uppercase">
                            {modul}
                          </p>
                          <p className="font-mono text-xs text-slate-600 font-bold">
                            {items.length} Evaluasi Kuis Dikerjakan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono font-black text-xs px-2.5 py-1 border border-black ${
                            avg >= 80
                              ? "bg-emerald-300 text-black"
                              : avg >= 60
                              ? "bg-amber-300 text-black"
                              : "bg-rose-300 text-black"
                          }`}
                        >
                          RATA-RATA: {avg}
                        </span>
                        <div className="p-1 bg-white border border-black">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-black" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-black" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t-2 border-black divide-y divide-black/10 bg-white">
                        {items.map((q, i) => (
                          <div
                            key={i}
                            className="p-3 sm:px-4 sm:py-3 flex items-center justify-between hover:bg-yellow-50 transition-colors"
                          >
                            <div>
                              <p className="font-heading font-bold text-xs sm:text-sm text-black">
                                {q.quiz?.judul ||
                                  q.judul ||
                                  `Quiz Pertemuan ${q.quiz?.materi?.pertemuan || i + 1}`}
                              </p>
                              <p className="font-mono text-[10px] text-slate-500 font-bold mt-0.5">
                                Sesi P{q.quiz?.materi?.pertemuan || q.pertemuan || i + 1} ·{" "}
                                {q.dikerjakan_pada
                                  ? new Date(q.dikerjakan_pada).toLocaleDateString("id-ID")
                                  : q.tanggal || "Terkini"}
                              </p>
                            </div>

                            <span
                              className={`px-3 py-1 font-mono font-black text-xs border border-black ${
                                (q.nilai || 0) >= 80
                                  ? "bg-emerald-300 text-black"
                                  : (q.nilai || 0) >= 60
                                  ? "bg-amber-300 text-black"
                                  : "bg-rose-300 text-black"
                              }`}
                            >
                              SKOR: {q.nilai}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
