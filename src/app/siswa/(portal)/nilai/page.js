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
import { BADGES } from "@/lib/gamificationService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";

export default function NilaiPage() {
  const { currentSiswa, gamification } = useSiswa();
  const [showSertifikat, setShowSertifikat] = useState(true);
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
        backgroundColor: "#FFFDF5",
        onclone: (clonedDoc) => {
          const elList = clonedDoc.querySelectorAll("*");
          elList.forEach((el) => {
            try {
              const cs = window.getComputedStyle(el);
              if (cs.backgroundColor && (cs.backgroundColor.includes("lab") || cs.backgroundColor.includes("oklch"))) {
                el.style.backgroundColor = "#ffffff";
              }
              if (cs.color && (cs.color.includes("lab") || cs.color.includes("oklch"))) {
                el.style.color = "#000000";
              }
              if (cs.borderColor && (cs.borderColor.includes("lab") || cs.borderColor.includes("oklch"))) {
                el.style.borderColor = "#000000";
              }
            } catch (e) {
              // ignore
            }
          });
        },
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

      Swal.fire({
        icon: "success",
        title: "Berhasil Diunduh! 🎉",
        text: "Sertifikat resmi kompetensi kamu telah berhasil disimpan.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Gagal cetak sertifikat:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunduh",
        text: "Terjadi kesalahan saat memproses sertifikat PDF: " + (err.message || ""),
      });
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
              onClick={generatePDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-slate-800 font-heading text-xs sm:text-sm font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGenerating ? "Menyiapkan PDF..." : "📥 Download PDF Sertifikat"}</span>
            </button>

            <button
              onClick={() => setShowSertifikat(!showSertifikat)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-yellow-100 font-heading text-xs sm:text-sm font-bold uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {showSertifikat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSertifikat ? "Sembunyikan Pratinjau" : "Buka Pratinjau Sertifikat"}</span>
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
                style={{
                  width: "1122px",
                  height: "793px",
                  backgroundColor: "#FFFDF5",
                  border: "8px solid #000000",
                  color: "#000000",
                  position: "relative",
                  padding: "64px",
                  boxSizing: "border-box",
                  fontFamily: "sans-serif",
                }}
                className="shadow-2xl select-none"
              >
                {/* Inner border */}
                <div style={{ position: "absolute", inset: "16px", border: "2px solid #000000", pointerEvents: "none" }} />

                {/* Corner Decorations */}
                <div style={{ position: "absolute", top: "24px", left: "24px", width: "64px", height: "64px", borderTop: "4px solid #FF6B00", borderLeft: "4px solid #FF6B00" }} />
                <div style={{ position: "absolute", top: "24px", right: "24px", width: "64px", height: "64px", borderTop: "4px solid #FF6B00", borderRight: "4px solid #FF6B00" }} />
                <div style={{ position: "absolute", bottom: "24px", left: "24px", width: "64px", height: "64px", borderBottom: "4px solid #FF6B00", borderLeft: "4px solid #FF6B00" }} />
                <div style={{ position: "absolute", bottom: "24px", right: "24px", width: "64px", height: "64px", borderBottom: "4px solid #FF6B00", borderRight: "4px solid #FF6B00" }} />

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <div style={{ width: "64px", height: "64px", margin: "0 auto 12px", backgroundColor: "#000000", color: "#FFFFFF", fontSize: "30px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #000000", boxShadow: "3px 3px 0px 0px #FF6B00" }}>
                    💻
                  </div>
                  <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#000000", letterSpacing: "2px", textTransform: "uppercase", margin: "0" }}>
                    SERTIFIKAT KOMPETENSI KOMPUTER
                  </h1>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#334155", letterSpacing: "1.5px", marginTop: "4px", textTransform: "uppercase" }}>
                    GWA TECH COURSE — LEMBAGA KURSUS DAN PELATIHAN
                  </p>
                  <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px", backgroundColor: "#FEF9C3", padding: "4px 12px", border: "1px solid #000000", display: "inline-block" }}>
                    NOMOR: {currentSiswa.id}/CERT/GWA/2026
                  </p>
                </div>

                {/* Body */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <p style={{ fontSize: "13px", textTransform: "uppercase", color: "#475569", fontWeight: "700", marginBottom: "8px" }}>
                    Diberikan Kepada Siswa Berprestasi:
                  </p>
                  <h2 style={{ fontSize: "36px", fontWeight: "900", color: "#000000", textTransform: "uppercase", borderBottom: "4px solid #000000", display: "inline-block", padding: "0 48px 4px", letterSpacing: "1px", margin: "0 0 16px" }}>
                    {currentSiswa.nama}
                  </h2>
                  <p style={{ fontSize: "16px", color: "#1E293B", maxWidth: "720px", margin: "16px auto 0", lineHeight: "1.6", fontWeight: "500" }}>
                    Telah menyelesaikan program pelatihan komputer praktik nyata modul{" "}
                    <strong style={{ color: "#000000", backgroundColor: "#FEF08A", padding: "2px 6px", border: "1px solid #000000" }}>
                      {currentSiswa.modul}
                    </strong>{" "}
                    dan dinyatakan{" "}
                    <strong style={{ color: "#047857", fontWeight: "900" }}>LULUS</strong> dengan predikat{" "}
                    <strong>&quot;{predikatLulus}&quot;</strong> (Nilai Akhir:{" "}
                    {currentSiswa.nilaiAkhir || rata}).
                  </p>
                </div>

                {/* Footer Signatures & QR Code Verification */}
                <div style={{ position: "absolute", bottom: "48px", left: "80px", textAlign: "center" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", marginBottom: "48px" }}>
                    Instruktur Pembimbing
                  </p>
                  <div style={{ borderBottom: "2px solid #000000", width: "180px", marginBottom: "4px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "#000000", margin: "0" }}>
                    {mentorName}
                  </p>
                </div>

                {/* QR Code Center Verification */}
                <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ padding: "8px", backgroundColor: "#FFFFFF", border: "2px solid #000000", boxShadow: "2px 2px 0px 0px #000000" }}>
                    <QRCodeCanvas
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/verifikasi?id=${currentSiswa.id}`}
                      size={72}
                      level="M"
                    />
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: "#1E293B", marginTop: "4px", textTransform: "uppercase" }}>
                    SCAN UNTUK VERIFIKASI
                  </span>
                  <span style={{ fontSize: "8px", color: "#64748B" }}>
                    ID: {currentSiswa.id}
                  </span>
                </div>

                <div style={{ position: "absolute", bottom: "48px", right: "80px", textAlign: "center" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", marginBottom: "4px" }}>
                    Tanggal Terbit: {tanggalLulusFormatted}
                  </p>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "#047857", textTransform: "uppercase", marginBottom: "32px" }}>
                    [OFFICIAL_VERIFIED ✓]
                  </p>
                  <div style={{ borderBottom: "2px solid #000000", width: "180px", marginBottom: "4px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "#000000", margin: "0" }}>
                    Gesit Widi Atmoko, S.Kom
                  </p>
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

      {/* ── Galeri Lencana & Prestasi (Badges Showcase) ─────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="text-amber-300">🏅</span>
            <span className="text-amber-300 uppercase tracking-wide">Galeri Lencana &amp; Pencapaian Siswa</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            {gamification?.badges?.length || 0} dari {BADGES.length} Terbuka
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-[#FFFDF5] space-y-5">
          <div>
            <h3 className="font-heading font-black text-base text-black">
              Koleksi Lencana Belajarmu
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Setiap aktivitas belajar, menyelesaikan misi praktik, dan kuis akan membuka lencana khusus serta memberikan bonus XP!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const isUnlocked = gamification?.badges?.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 border-2 border-black rounded-xl flex items-start gap-3.5 transition-all ${
                    isUnlocked
                      ? `${badge.color} shadow-[3px_3px_0px_0px_#000]`
                      : "bg-slate-100/70 border-dashed opacity-50"
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2 bg-white/80 border-2 border-black rounded-xl shadow-[1.5px_1.5px_0px_0px_#000]">
                    {badge.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-black text-sm text-black">
                        {badge.title}
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border border-black font-heading ${
                          isUnlocked ? "bg-black text-emerald-300" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isUnlocked ? "DIRAIH ✓" : "TERKUNCI 🔒"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
