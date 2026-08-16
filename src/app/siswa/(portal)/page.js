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
  MapPin,
  Sparkles,
  Smile,
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
      label: "Buka Materi Belajar",
      icon: BookOpen,
      desc: `Lanjutkan materi pertemuan ke-${pertemuanSelesai + 1}`,
      bg: "bg-cyan-300 hover:bg-cyan-200",
      badge: "Materi Baru",
      badgeBg: "bg-cyan-100",
    },
    {
      href: "/siswa/quiz",
      label: "Main Kuis Seru",
      icon: Brain,
      desc: "Uji kemampuan kamu lewat kuis interaktif",
      bg: "bg-purple-300 hover:bg-purple-200",
      badge: "Kuis Pilihan",
      badgeBg: "bg-purple-100",
    },
    {
      href: "/siswa/jadwal",
      label: "Jadwal & Kehadiran",
      icon: Calendar,
      desc: `${currentSiswa.jadwal || "Senin & Rabu"} · Jam ${
        currentSiswa.waktu || "16.00"
      }`,
      bg: "bg-amber-300 hover:bg-amber-200",
      badge: "Info Kelas",
      badgeBg: "bg-amber-100",
    },
    {
      href: "/siswa/nilai",
      label: "Piala & Sertifikat",
      icon: BarChart2,
      desc: "Lihat hasil nilai dan sertifikat resmi kamu",
      bg: "bg-emerald-300 hover:bg-emerald-200",
      badge: "Prestasi",
      badgeBg: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner (Ramah & Hangat) ────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="font-heading text-xs font-bold text-amber-300">
              Ruang Belajar Siswa
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold font-mono">
            ● Status: Aktif Belajar
          </span>
        </div>

        {/* Banner Content */}
        <div className="p-5 sm:p-7 bg-gradient-to-br from-yellow-50 via-white to-orange-50/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left User Greeting */}
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-300 text-black text-xs font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                  ID Siswa: {currentSiswa.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] ${
                    currentSiswa.status === "Lulus"
                      ? "bg-emerald-300 text-black"
                      : "bg-cyan-200 text-black"
                  }`}
                >
                  {currentSiswa.status === "Lulus" ? "🎓 Sudah Lulus" : "🚀 Siswa Aktif"}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                  Halo, {currentSiswa.nama}! 👋
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-700 mt-1">
                  Kamu sedang belajar modul{" "}
                  <strong className="text-black bg-yellow-200 px-1.5 py-0.5 border border-black rounded">
                    {currentSiswa.modul}
                  </strong>{" "}
                  di kelas <strong className="text-orange-600 font-bold">{currentSiswa.kelas}</strong>.
                </p>
              </div>
            </div>

            {/* Right Progress Card */}
            <div className="w-full lg:w-80 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl p-4 shrink-0 space-y-2.5">
              <div className="flex items-center justify-between font-heading font-bold text-xs">
                <span className="text-slate-700">Kemajuan Belajarmu</span>
                <span className="bg-orange-500 text-black px-2 py-0.5 border border-black rounded font-black text-xs">
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-4 bg-slate-100 border-2 border-black rounded-full p-0.5 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>
                  Sudah Selesai: {pertemuanSelesai} dari {totalPertemuan} Sesi
                </span>
                <span className="text-orange-600">
                  {Math.max(0, totalPertemuan - pertemuanSelesai)} Sesi Lagi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Stat Cards (Sederhana & Mudah Dipahami) ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pertemuan Selesai",
            value: `${pertemuanSelesai}/${totalPertemuan}`,
            sub: `${progress}% Selesai`,
            icon: CheckCircle2,
            stripColor: "bg-orange-500",
            iconBg: "bg-orange-200",
          },
          {
            label: "Rata-Rata Kuis",
            value: rataQuiz > 0 ? `${rataQuiz}` : "—",
            sub: `${nilaiQuiz.length} Kuis Dikerjakan`,
            icon: Star,
            stripColor: "bg-amber-400",
            iconBg: "bg-yellow-200",
          },
          {
            label: "Kehadiran Kelas",
            value: `${kehadiranPct}%`,
            sub: `${hadirCount} Kali Hadir`,
            icon: TrendingUp,
            stripColor: "bg-emerald-500",
            iconBg: "bg-emerald-200",
          },
          {
            label: "Guru / Instruktur",
            value: (currentSiswa.mentor || "Instruktur GWA")
              .split(" ")
              .slice(0, 2)
              .join(" "),
            sub: currentSiswa.ruangan || "Lab Komputer",
            icon: Award,
            stripColor: "bg-purple-500",
            iconBg: "bg-purple-200",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-4 sm:p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.stripColor}`} />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-600 uppercase mt-0.5 truncate">
                    {stat.label}
                  </p>
                  <h4 className="text-xl sm:text-2xl font-heading font-black text-black mt-1 truncate">
                    {stat.value}
                  </h4>
                </div>
                <div
                  className={`p-2.5 ${stat.iconBg} border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg shrink-0`}
                >
                  <Icon className="w-5 h-5 text-black" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t-2 border-dashed border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="truncate">{stat.sub}</span>
                <span>✨</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4 Big Chunky Action Cards (Paling Mudah Diakses) ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h2 className="font-heading font-black text-lg text-black tracking-tight">
            Pilihan Menu Belajar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex flex-col justify-between ${link.bg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <span className="font-heading text-[11px] font-bold bg-white text-black px-2.5 py-0.5 border border-black rounded-full">
                      {link.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base text-black leading-snug group-hover:underline">
                    {link.label}
                  </h3>
                  <p className="text-xs font-medium text-slate-800 mt-1 leading-relaxed">
                    {link.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/20 flex items-center justify-between font-heading text-xs font-black text-black">
                  <span>Buka Sekarang &gt;</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Cards: Jadwal Rutin & Kuis Terakhir ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Belajar Kamu */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Jadwal Belajar Kelas</span>
              </div>
              <span className="text-[11px] text-cyan-300">Lab Komputer GWA</span>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 bg-cyan-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-cyan-200 px-2.5 py-0.5 border border-black rounded">
                    Kelas: {currentSiswa.kelas}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Modul: {currentSiswa.modul}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-black shrink-0" />
                    <span>
                      {currentSiswa.jadwal || "Senin & Rabu"} · Jam{" "}
                      {currentSiswa.waktu || "16.00 - 18.00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black shrink-0" />
                    <span>{currentSiswa.ruangan || "Lab Komputer (1 Siswa 1 PC)"}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-black rounded-lg text-xs font-medium flex items-center justify-between">
                <span className="text-slate-600">Guru / Instruktur Kamu:</span>
                <span className="font-bold text-black bg-white px-2.5 py-0.5 border border-black rounded">
                  {currentSiswa.mentor || "Instruktur GWA"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 pt-0">
            <Link
              href="/siswa/jadwal"
              className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-amber-300 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>Lihat Detail Jadwal & Kehadiran</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hasil Kuis Terakhir */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>Nilai Kuis Terakhir</span>
              </div>
              <span className="text-[11px] text-amber-300">Hasil Latihan</span>
            </div>

            <div className="p-5">
              <div className="space-y-2.5">
                {nilaiQuiz.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 border-2 border-dashed border-slate-300 rounded-lg p-4 font-medium">
                    Belum ada kuis yang kamu kerjakan. Yuk coba kuis pertamamu! 🎮
                  </div>
                ) : (
                  nilaiQuiz.slice(0, 3).map((q, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-heading font-black text-xs sm:text-sm text-black truncate">
                          {q.quiz?.judul || q.judul || `Kuis Pertemuan ${q.quiz?.materi?.pertemuan || i + 1}`}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {q.dikerjakan_pada
                            ? new Date(q.dikerjakan_pada).toLocaleDateString("id-ID")
                            : q.tanggal || "Terkini"}{" "}
                          · {currentSiswa.modul || "Kursus"}
                        </p>
                      </div>

                      <div
                        className={`px-3 py-1 font-heading font-black text-xs border-2 border-black rounded shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ${
                          (q.nilai || 0) >= 80
                            ? "bg-emerald-300 text-black"
                            : (q.nilai || 0) >= 60
                            ? "bg-amber-300 text-black"
                            : "bg-rose-300 text-black"
                        }`}
                      >
                        Nilai: {q.nilai}
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-emerald-300 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>Buka Semua Nilai & Sertifikat</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Catatan dari Guru / Instruktur ─────────────────── */}
      {currentSiswa.catatan && (
        <div className="bg-yellow-100 border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg shrink-0 text-xl">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-black bg-black text-yellow-300 px-2 py-0.5 rounded">
                Pesan dari Guru
              </span>
              <span className="text-xs font-bold text-slate-800">
                Catatan Belajar
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
