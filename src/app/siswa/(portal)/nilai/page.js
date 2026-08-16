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
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
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

  // Group nilai by modul
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
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span className="text-amber-300">Prestasi & Nilai Belajar</span>
          </div>
          <span className="text-[11px] text-emerald-400">● Hasil Belajar</span>
        </div>

        <div className="p-5 sm:p-7 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-emerald-400 text-black font-bold text-xs px-2.5 py-0.5 border border-black rounded">
                  Transkrip Nilai Siswa
                </span>
                <span className="text-xs font-bold text-slate-600">
                  ID Siswa: {currentSiswa.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                Nilai & Sertifikat Kelulusan 🎓
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Rekapitulasi nilai kuis latihan dan sertifikat kompetensi resmi dari GWA Tech Course.
              </p>
            </div>

            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-3.5 text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-500 block">
                STATUS KELULUSAN
              </span>
              <span
                className={`font-heading font-black text-lg ${
                  isLulus ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {isLulus ? "🎓 Sudah Lulus" : "⏳ Masih Belajar"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Kelulusan Banner ────────────────────────── */}
      {isLulus ? (
        <div className="bg-emerald-300 border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-emerald-300 font-heading text-xs font-black rounded-full">
                <Award className="w-4 h-4 text-emerald-400" /> Sertifikat Resmi Terbit
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-black tracking-tight">
                🎓 Selamat, Kamu Telah Lulus!
              </h2>
              <p className="text-xs sm:text-sm text-slate-950 font-bold">
                Kelas: {currentSiswa.kelas} · Dinyatakan Lulus pada {tanggalLulusFormatted}
              </p>
            </div>

            {/* Score box */}
            <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl p-4 text-center min-w-[170px]">
              <span className="text-xs font-bold text-slate-600 uppercase block">
                Nilai Akhir
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-emerald-600 mt-0.5">
                {currentSiswa.nilaiAkhir || rata}
              </div>
              <span className="inline-block mt-1 font-heading text-xs font-black bg-emerald-100 text-emerald-900 px-2.5 py-0.5 border border-black rounded">
                Predikat: {predikatLulus}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-black/20 flex flex-wrap gap-3">
            <button
              onClick={() => setShowSertifikat(!showSertifikat)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-slate-800 font-heading text-xs sm:text-sm font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {showSertifikat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSertifikat ? "Tutup Pratinjau Sertifikat" : "🏆 Buka & Download Sertifikat"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block">
                Progres Menuju Kelulusan
              </span>
              <h3 className="font-heading font-black text-xl text-black mt-0.5">
                {currentSiswa.pertemuanSelesai || 0} dari{" "}
                {currentSiswa.totalPertemuan || 10} Pertemuan Selesai
              </h3>
            </div>
            <span className="bg-amber-300 text-black px-3 py-1 font-heading font-black text-xs border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
              {Math.max(0, (currentSiswa.totalPertemuan || 10) - (currentSiswa.pertemuanSelesai || 0))} Pertemuan Lagi
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-slate-100 border-2 border-black rounded-full p-0.5 overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  ((currentSiswa.pertemuanSelesai || 0) /
                    (currentSiswa.totalPertemuan || 10)) *
                    100
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Sertifikat kelulusan kamu akan otomatis muncul di sini setelah seluruh materi dan kuis selesai kamu ikuti. Tetap semangat! ✨
          </p>
        </div>
      )}

      {/* ── Sertifikat Preview ────────────────────────────── */}
      {showSertifikat && isLulus && (
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-amber-300">Pratinjau E-Sertifikat Kelulusan</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading text-xs font-black uppercase border border-black rounded shadow-[1.5px_1.5px_0px_0px_#fff] cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isGenerating ? "Menyiapkan PDF..." : "Download PDF Cetak"}</span>
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
                  <div className="w-16 h-16 mx-auto bg-amber-300 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center text-3xl mb-3 rounded-lg">
                    💻
                  </div>
                  <h1 className="text-4xl font-heading font-black text-black tracking-wider uppercase">
                    SERTIFIKAT KOMPETENSI KOMPUTER
                  </h1>
                  <p className="font-mono text-sm font-bold text-slate-600 uppercase tracking-widest mt-1">
                    GWA TECH COURSE — LEMBAGA KURSUS DAN PELATIHAN
                  </p>
                  <div className="inline-block mt-2 px-3 py-0.5 bg-yellow-200 border-2 border-black font-mono text-xs font-bold rounded">
                    NOMOR: {currentSiswa.id}/CERT/GWA/2026
                  </div>
                </div>

                {/* Body */}
                <div className="text-center space-y-4 mb-10">
                  <p className="text-sm uppercase text-slate-600 font-bold font-heading">
                    Diberikan Kepada Siswa Berprestasi:
                  </p>
                  <h2 className="text-4xl font-heading font-black text-black border-b-4 border-black inline-block px-12 pb-2 uppercase tracking-tight">
                    {currentSiswa.nama}
                  </h2>
                  <p className="text-lg text-slate-800 max-w-3xl mx-auto leading-relaxed mt-4 font-medium">
                    Telah menyelesaikan program pelatihan komputer praktik nyata modul{" "}
                    <strong className="text-black bg-yellow-300 px-1 border border-black rounded">
                      {currentSiswa.modul}
                    </strong>{" "}
                    dan dinyatakan{" "}
                    <strong className="text-emerald-700 font-black">LULUS</strong> dengan predikat{" "}
                    <strong className="text-black">&quot;{predikatLulus}&quot;</strong> (Nilai Akhir:{" "}
                    {currentSiswa.nilaiAkhir || rata}).
                  </p>
                </div>

                {/* Footer Signatures */}
                <div className="absolute bottom-14 left-24 text-center font-heading">
                  <p className="text-xs font-bold text-slate-600 uppercase mb-16">
                    Instruktur Pembimbing
                  </p>
                  <div className="border-b-2 border-black w-48 mb-1" />
                  <p className="font-black text-black text-sm">{mentorName}</p>
                </div>

                <div className="absolute bottom-14 right-24 text-center font-heading">
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

      {/* ── 3 Stat Summary Cards ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Kuis Dikerjakan",
            value: `${nilaiQuiz.length} Kuis`,
            icon: BarChart2,
            bg: "bg-cyan-100",
          },
          {
            label: "Rata-Rata Nilai Kuis",
            value: rata > 0 ? `${rata}` : "—",
            icon: Star,
            bg: "bg-amber-100",
          },
          {
            label: "Nilai Tertinggi Kamu",
            value:
              nilaiQuiz.length > 0
                ? `${Math.max(...nilaiQuiz.map((q) => q.nilai))}`
                : "—",
            icon: TrendingUp,
            bg: "bg-emerald-100",
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`p-5 ${s.bg} border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl flex items-center gap-4`}
            >
              <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg shrink-0">
                <Icon className="w-6 h-6 text-black" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700 uppercase truncate">
                  {s.label}
                </p>
                <p className="font-heading font-black text-2xl text-black truncate mt-0.5">
                  {s.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Nilai Per Modul (Accordion Grid) ────────── */}
      <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>📊</span>
            <span>Rincian Nilai Kuis Per Modul</span>
          </div>
          <span className="text-[11px] text-amber-300">Rekap Nilai</span>
        </div>

        <div className="p-5">
          <h2 className="font-heading font-black text-base text-black mb-4">
            Daftar Nilai Kuis Berdasarkan Modul
          </h2>

          {Object.keys(nilaiByModul).length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl text-xs text-slate-500 font-medium">
              Belum ada rekaman nilai kuis yang tersimpan di sistem.
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
                    className="border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 transition-colors text-left cursor-pointer"
                      onClick={() => setExpandedModul(isOpen ? null : modul)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-cyan-300 border border-black rounded-lg flex items-center justify-center font-heading font-bold text-sm text-black">
                          📖
                        </div>
                        <div>
                          <p className="font-heading font-black text-sm text-black">
                            {modul}
                          </p>
                          <p className="text-xs text-slate-600 font-medium">
                            {items.length} Kuis Sudah Dikerjakan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`font-heading font-black text-xs px-3 py-1 border border-black rounded-md ${
                            avg >= 80
                              ? "bg-emerald-300 text-black"
                              : avg >= 60
                              ? "bg-amber-300 text-black"
                              : "bg-rose-300 text-black"
                          }`}
                        >
                          Rata-rata: {avg}
                        </span>
                        <div className="p-1 bg-white border border-black rounded">
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
                            className="p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between hover:bg-yellow-50 transition-colors"
                          >
                            <div>
                              <p className="font-heading font-bold text-xs sm:text-sm text-black">
                                {q.quiz?.judul ||
                                  q.judul ||
                                  `Kuis Pertemuan ${q.quiz?.materi?.pertemuan || i + 1}`}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Sesi Pertemuan {q.quiz?.materi?.pertemuan || q.pertemuan || i + 1} ·{" "}
                                {q.dikerjakan_pada
                                  ? new Date(q.dikerjakan_pada).toLocaleDateString("id-ID")
                                  : q.tanggal || "Terkini"}
                              </p>
                            </div>

                            <span
                              className={`px-3 py-1 font-heading font-black text-xs border border-black rounded-md ${
                                (q.nilai || 0) >= 80
                                  ? "bg-emerald-300 text-black"
                                  : (q.nilai || 0) >= 60
                                  ? "bg-amber-300 text-black"
                                  : "bg-rose-300 text-black"
                              }`}
                            >
                              Nilai: {q.nilai}
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
