"use client";

import Link from "next/link";
import { useSiswa } from "@/context/SiswaContext";
import {
  BookOpen,
  Calendar,
  Brain,
  BarChart2,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Star,
  Award,
  Terminal,
  MapPin,
  User,
  ExternalLink,
} from "lucide-react";

export default function SiswaDashboard() {
  const { currentSiswa } = useSiswa();
  if (!currentSiswa) return null;

  const nilaiQuiz = currentSiswa.nilaiQuiz || [];
  const kehadiran = currentSiswa.kehadiran || [];

  const pertemuanSelesai = currentSiswa.pertemuanSelesai || 0;
  const totalPertemuan = currentSiswa.totalPertemuan || 10;

  const progress =
    totalPertemuan > 0
      ? Math.round((pertemuanSelesai / totalPertemuan) * 100)
      : 0;

  const rataQuiz =
    nilaiQuiz.length > 0
      ? Math.round(
          nilaiQuiz.reduce((a, b) => a + (b.nilai || 0), 0) /
            nilaiQuiz.length
        )
      : 0;
  const hadirCount = kehadiran.filter((k) => k.status === "Hadir").length;
  const kehadiranPct =
    kehadiran.length > 0
      ? Math.round((hadirCount / kehadiran.length) * 100)
      : totalPertemuan > 0
      ? Math.round((hadirCount / totalPertemuan) * 100)
      : 0;

  const quickLinks = [
    {
      href: "/siswa/materi",
      label: "Lanjutkan Materi",
      icon: BookOpen,
      desc: `Sesi Pertemuan Ke-${pertemuanSelesai + 1}`,
      bg: "bg-cyan-300 hover:bg-cyan-200",
      tag: "#MODUL_READER",
    },
    {
      href: "/siswa/quiz",
      label: "Kerjakan Quiz",
      icon: Brain,
      desc: "Uji Pemahaman & Latihan Mandiri",
      bg: "bg-purple-300 hover:bg-purple-200",
      tag: "#QUIZ_TERMINAL",
    },
    {
      href: "/siswa/jadwal",
      label: "Jadwal & Presensi",
      icon: Calendar,
      desc: `${currentSiswa.jadwal || "Senin & Rabu"} • ${
        currentSiswa.waktu || "16.00"
      }`,
      bg: "bg-amber-300 hover:bg-amber-200",
      tag: "#SCHEDULE_LOG",
    },
    {
      href: "/siswa/nilai",
      label: "Rekap Nilai & Sertifikat",
      icon: BarChart2,
      desc: "Transkrip Kelulusan & E-Certificate",
      bg: "bg-emerald-300 hover:bg-emerald-200",
      tag: "#VERIFIED_CERT",
    },
  ];

  // Hitung jumlah blok indikator retro (10 blok total)
  const totalBlocks = 10;
  const filledBlocks = Math.min(
    totalBlocks,
    Math.round((progress / 100) * totalBlocks)
  );

  return (
    <div className="space-y-6">
      {/* ── Sys-Status Header (Retro Window Box) ─────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        {/* Retro Window Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
            </div>
            <span className="tracking-wide">sys_student_dashboard.exe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] text-emerald-400 font-mono">[PORTAL_ACTIVE]</span>
          </div>
        </div>

        {/* Header Main Content */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-yellow-50 via-white to-orange-50/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: User info */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-amber-300 font-mono text-[11px] font-bold uppercase border border-black">
                  <Terminal className="w-3 h-3" /> USER_ONLINE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-200 text-black font-mono text-[11px] font-bold border border-black">
                  ID: {currentSiswa.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase border border-black ${
                    currentSiswa.status === "Lulus"
                      ? "bg-emerald-300 text-black"
                      : "bg-amber-300 text-black"
                  }`}
                >
                  {currentSiswa.status === "Lulus" ? "🎓 STATUS: LULUS" : "⏳ STATUS: AKTIF BELAJAR"}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                  Halo, {currentSiswa.nama}! 👋
                </h1>
                <p className="font-mono text-xs sm:text-sm text-slate-700 font-bold mt-1">
                  KELAS: <span className="text-orange-600 font-black">{currentSiswa.kelas}</span> · MODUL:{" "}
                  <span className="text-slate-950 font-black">{currentSiswa.modul}</span>
                </p>
              </div>
            </div>

            {/* Right: Retro Block Progress */}
            <div className="w-full lg:w-80 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 shrink-0 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-black">
                <span className="uppercase text-slate-600">PROGRESS_KURSUS</span>
                <span className="bg-orange-500 text-black px-1.5 py-0.5 border border-black font-black">
                  {progress}%
                </span>
              </div>

              {/* Segmented retro blocks */}
              <div className="grid grid-cols-10 gap-1 py-1">
                {Array.from({ length: totalBlocks }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-4 border border-black ${
                      idx < filledBlocks ? "bg-orange-500" : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-slate-600 font-bold">
                <span>
                  Selesai: {pertemuanSelesai}/{totalPertemuan} Sesi
                </span>
                <span className="text-orange-600">
                  {Math.max(0, totalPertemuan - pertemuanSelesai)} Sesi Tersisa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            metricCode: "SYS_METRIC // 01",
            label: "Pertemuan Selesai",
            value: `${pertemuanSelesai}/${totalPertemuan}`,
            sub: `${progress}% Tercapai`,
            icon: CheckCircle2,
            stripColor: "bg-orange-500",
            iconBg: "bg-orange-300",
          },
          {
            metricCode: "SYS_METRIC // 02",
            label: "Rata-Rata Quiz",
            value: rataQuiz > 0 ? `${rataQuiz}` : "—",
            sub: `${nilaiQuiz.length} Quiz Dikerjakan`,
            icon: Star,
            stripColor: "bg-amber-400",
            iconBg: "bg-yellow-300",
          },
          {
            metricCode: "SYS_METRIC // 03",
            label: "Tingkat Kehadiran",
            value: `${kehadiranPct}%`,
            sub: `${hadirCount} Kali Hadir`,
            icon: TrendingUp,
            stripColor: "bg-emerald-500",
            iconBg: "bg-emerald-300",
          },
          {
            metricCode: "SYS_METRIC // 04",
            label: "Instruktur Kelas",
            value: (currentSiswa.mentor || "Instruktur GWA")
              .split(" ")
              .slice(0, 2)
              .join(" "),
            sub: currentSiswa.ruangan || "Lab Komputer",
            icon: Award,
            stripColor: "bg-purple-500",
            iconBg: "bg-purple-300",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-4 sm:p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Accent top strip */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.stripColor}`} />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    {stat.metricCode}
                  </span>
                  <p className="text-xs font-bold text-slate-700 uppercase mt-0.5 truncate">
                    {stat.label}
                  </p>
                  <h4 className="text-xl sm:text-2xl font-heading font-black text-black mt-1 truncate">
                    {stat.value}
                  </h4>
                </div>
                <div
                  className={`p-2 sm:p-2.5 ${stat.iconBg} border-2 border-black shadow-[2px_2px_0px_0px_#000] shrink-0`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t-2 border-dashed border-slate-200 flex items-center justify-between text-[11px] font-mono font-bold text-slate-600">
                <span className="truncate">{stat.sub}</span>
                <span className="text-slate-400">●</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Action Grid ──────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono font-black text-black bg-amber-300 px-2 py-0.5 border border-black text-xs">
            [NAV_DESK]
          </span>
          <h2 className="font-heading font-black text-lg text-black uppercase tracking-tight">
            Menu Navigasi Utama Siswa
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between ${link.bg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5">
                      {link.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base text-black uppercase leading-tight group-hover:underline">
                    {link.label}
                  </h3>
                  <p className="font-mono text-xs font-bold text-slate-800 mt-1">
                    {link.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/20 flex items-center justify-between font-mono text-xs font-black text-black">
                  <span>BUKA MENU &gt;</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Bottom OS Window Row ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Rutin Kelas */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden flex flex-col justify-between">
          <div>
            {/* Titlebar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 inline-block"></span>
                <span>sys_jadwal_rutin.exe</span>
              </div>
              <span className="text-[10px] text-cyan-300">[TIMETABLE]</span>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 bg-cyan-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-cyan-200 px-2 py-0.5 border border-black">
                    KELAS: {currentSiswa.kelas}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    MODUL: {currentSiswa.modul}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>
                      {currentSiswa.jadwal || "Senin & Rabu"} · {currentSiswa.waktu || "16.00 - 18.00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>{currentSiswa.ruangan || "Lab Komputer GWA (PC-Slot)"}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-black font-mono text-xs flex items-center justify-between">
                <span className="text-slate-600">Instruktur Pembimbing:</span>
                <span className="font-bold text-black bg-white px-2 py-0.5 border border-black">
                  {currentSiswa.mentor || "Instruktur GWA"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 pt-0">
            <Link
              href="/siswa/jadwal"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-amber-300 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>&gt;_ Buka Detail Jadwal & Kehadiran</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Nilai Quiz Terakhir */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden flex flex-col justify-between">
          <div>
            {/* Titlebar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 inline-block"></span>
                <span>sys_quiz_records.exe</span>
              </div>
              <span className="text-[10px] text-amber-300">[RECORDS]</span>
            </div>

            <div className="p-5">
              <div className="space-y-2.5">
                {nilaiQuiz.length === 0 ? (
                  <div className="text-center py-8 font-mono text-xs text-slate-500 border-2 border-dashed border-slate-300 p-4">
                    [NO_RECORDS] Belum ada quiz yang dikerjakan.
                  </div>
                ) : (
                  nilaiQuiz.slice(0, 3).map((q, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-heading font-black text-xs text-black uppercase truncate">
                          {q.quiz?.judul || q.judul || `Quiz Pertemuan ${q.quiz?.materi?.pertemuan || i + 1}`}
                        </p>
                        <p className="font-mono text-[10px] text-slate-600 font-bold mt-0.5">
                          {q.dikerjakan_pada
                            ? new Date(q.dikerjakan_pada).toLocaleDateString("id-ID")
                            : q.tanggal || "Terkini"}{" "}
                          · {currentSiswa.modul || "Kursus"}
                        </p>
                      </div>

                      <div
                        className={`px-3 py-1 font-mono font-black text-xs border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ${
                          (q.nilai || 0) >= 80
                            ? "bg-emerald-300 text-black"
                            : (q.nilai || 0) >= 60
                            ? "bg-amber-300 text-black"
                            : "bg-rose-300 text-black"
                        }`}
                      >
                        NILAI: {q.nilai}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="p-4 pt-0">
            <Link
              href="/siswa/nilai"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-emerald-300 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>&gt;_ Buka Transkrip Nilai Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Catatan Instruktur ─────────────────────────────── */}
      {currentSiswa.catatan && (
        <div className="bg-yellow-100 border-3 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 flex items-start gap-3.5">
          <div className="p-2 bg-amber-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] shrink-0">
            <Terminal className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-black text-yellow-300 px-2 py-0.5">
                [NOTICE // INSTRUKTUR_LOG]
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                Pesan Khusus Siswa
              </span>
            </div>
            <p className="text-sm font-medium text-slate-900 mt-1.5 leading-relaxed">
              {currentSiswa.catatan}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
