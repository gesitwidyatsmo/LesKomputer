"use client";

import { useState, useEffect } from "react";
import { useSiswa } from "@/context/SiswaContext";
import { getJadwalByKelas } from "@/lib/jadwalService";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

function StatusBadge({ status }) {
  if (status === "Hadir")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-300 text-black px-2.5 py-1 border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Hadir ✓
      </span>
    );
  if (status === "Tidak Hadir" || status === "Alpa")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-300 text-black px-2.5 py-1 border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]">
        <XCircle className="w-3.5 h-3.5 text-rose-800" /> Tidak Hadir
      </span>
    );
  if (status === "Izin" || status === "Sakit")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-cyan-300 text-black px-2.5 py-1 border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]">
        <Clock className="w-3.5 h-3.5 text-cyan-800" /> {status}
      </span>
    );
  if (status === "Libur" || status === "Libur / Batal")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]">
        Libur Kelas
      </span>
    );
  if (status === "Berlangsung")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-300 text-black px-2.5 py-1 border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000] animate-pulse">
        Sedang Berlangsung
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-yellow-200 text-black px-2.5 py-1 border border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]">
      <Clock className="w-3.5 h-3.5 text-amber-800" /> Akan Datang
    </span>
  );
}

export default function JadwalPage() {
  const { currentSiswa } = useSiswa();
  const [jadwalKelas, setJadwalKelas] = useState([]);
  const [isLoadingJadwal, setIsLoadingJadwal] = useState(false);

  useEffect(() => {
    if (currentSiswa?.kelas_id) {
      setIsLoadingJadwal(true);
      getJadwalByKelas(currentSiswa.kelas_id)
        .then(({ data }) => {
          if (data) setJadwalKelas(data);
        })
        .finally(() => setIsLoadingJadwal(false));
    }
  }, [currentSiswa?.kelas_id]);

  if (!currentSiswa) return null;

  const kehadiran = currentSiswa.kehadiran || [];
  const totalPertemuan = currentSiswa.totalPertemuan || 10;
  const pertemuanSelesai =
    currentSiswa.pertemuanSelesai ??
    kehadiran.filter((k) => k.status === "Hadir").length;

  const hadirCount = kehadiran.filter((k) => k.status === "Hadir").length;
  const tidakHadirCount = kehadiran.filter((k) =>
    ["Tidak Hadir", "Alpa", "Sakit", "Izin"].includes(k.status)
  ).length;
  const kehadiranPct =
    kehadiran.length > 0
      ? Math.round((hadirCount / kehadiran.length) * 100)
      : totalPertemuan > 0
      ? Math.round((hadirCount / totalPertemuan) * 100)
      : 0;

  // Pertemuan mendatang
  const sisaPertemuan = Math.max(0, totalPertemuan - pertemuanSelesai);
  const pertemuanMendatang = Array.from({ length: sisaPertemuan }, (_, i) => {
    const pNum = pertemuanSelesai + 1 + i;
    const sesiAsli = jadwalKelas.find((j) => j.pertemuan_ke === pNum);
    let tanggalDisplay = "Sesuai Jadwal Rutin Kelas";
    let waktuDisplay = `${currentSiswa.jadwal || "Jadwal Rutin"} · Jam ${
      currentSiswa.waktu || "16.00"
    }`;
    let statusDisplay = "Akan Datang";

    if (sesiAsli) {
      if (sesiAsli.tanggal) {
        tanggalDisplay = new Date(sesiAsli.tanggal).toLocaleDateString(
          "id-ID",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
      }
      if (sesiAsli.jam_mulai && sesiAsli.jam_selesai) {
        waktuDisplay = `Pukul ${sesiAsli.jam_mulai} - ${sesiAsli.jam_selesai} WIB`;
      }
      statusDisplay = sesiAsli.status || "Terjadwal";
    }

    return {
      pertemuan: pNum,
      tanggal: tanggalDisplay,
      waktu: waktuDisplay,
      status: statusDisplay,
      materi: `Materi Belajar Sesi ${pNum}`,
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span className="text-amber-300">Jadwal & Presensi Belajar</span>
          </div>
          <span className="text-[11px] text-emerald-400">● Kelas Terjadwal</span>
        </div>

        <div className="p-5 sm:p-7 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-orange-500 text-black font-bold text-xs px-2.5 py-0.5 border border-black rounded">
                  Jadwal Kelas Siswa
                </span>
                <span className="text-xs font-bold text-slate-600">
                  ID Siswa: {currentSiswa.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                Jadwal & Kehadiran Kamu
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Kelas: <strong className="text-orange-600 font-bold">{currentSiswa.kelas}</strong> · Modul:{" "}
                <strong className="text-black font-bold">{currentSiswa.modul}</strong>
              </p>
            </div>

            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-3.5 text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-500 block">
                SYARAT KELULUSAN
              </span>
              <span className="font-heading font-black text-base sm:text-lg text-emerald-600">
                Minimal 80% Hadir
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Presensi ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pertemuan",
            value: totalPertemuan,
            tag: "Semua Sesi",
            bg: "bg-white",
            textColor: "text-black",
          },
          {
            label: "Kamu Hadir",
            value: hadirCount,
            tag: "Sesi Selesai",
            bg: "bg-emerald-100",
            textColor: "text-emerald-800",
          },
          {
            label: "Tidak Hadir / Izin",
            value: tidakHadirCount,
            tag: "Izin / Alpa",
            bg: "bg-rose-100",
            textColor: "text-rose-800",
          },
          {
            label: "Persentase Hadir",
            value: `${kehadiranPct}%`,
            tag: "Kehadiran",
            bg: kehadiranPct >= 80 ? "bg-amber-200" : "bg-orange-200",
            textColor: "text-black",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`${s.bg} border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl p-4 text-center space-y-1`}
          >
            <span className="text-[11px] font-bold uppercase text-slate-600 block">
              {s.tag}
            </span>
            <p className={`text-2xl sm:text-3xl font-heading font-black ${s.textColor}`}>
              {s.value}
            </p>
            <p className="text-xs font-bold text-black uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Progress Bar Kehadiran ────────────────────────── */}
      <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-black font-heading">
          <span>Tingkat Kehadiran Masuk Kelas</span>
          <span className="bg-black text-white px-2.5 py-0.5 rounded font-black text-xs">
            {kehadiranPct}% dari 100%
          </span>
        </div>

        <div className="w-full h-5 bg-slate-100 border-2 border-black rounded-full p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              kehadiranPct >= 80 ? "bg-emerald-400" : "bg-orange-400"
            }`}
            style={{ width: `${Math.min(100, Math.max(5, kehadiranPct))}%` }}
          />
        </div>

        {kehadiranPct < 80 && (
          <div className="p-3 bg-amber-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5 text-xs text-amber-950 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Yuk rajin hadir di setiap sesi belajar agar kehadiranmu mencapai minimal 80% untuk mendapatkan sertifikat kelulusan.
            </span>
          </div>
        )}
      </div>

      {/* ── Info Jadwal Rutin Kelas ───────────────────────── */}
      <div className="bg-cyan-100 border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💻</span>
            <h2 className="font-heading font-black text-black text-base sm:text-lg tracking-tight">
              Informasi Rutin Jadwal Belajar Kamu
            </h2>
          </div>
          <span className="text-xs font-bold bg-white px-2.5 py-0.5 border border-black rounded">
            1 Siswa 1 Komputer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-lg flex items-center gap-3">
            <div className="p-2.5 bg-amber-300 border border-black rounded-lg shrink-0">
              <Calendar className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">
                Hari Belajar
              </p>
              <p className="font-heading font-black text-sm text-black">
                {currentSiswa.jadwal || "Senin & Rabu"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-lg flex items-center gap-3">
            <div className="p-2.5 bg-emerald-300 border border-black rounded-lg shrink-0">
              <Clock className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">
                Waktu / Jam
              </p>
              <p className="font-heading font-black text-sm text-black">
                {currentSiswa.waktu || "16.00 - 18.00 WIB"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-white border-2 border-black rounded-lg text-xs font-bold flex items-center justify-between">
          <span className="text-slate-600">Guru / Instruktur Pendamping:</span>
          <span className="text-black bg-yellow-200 px-3 py-1 border border-black rounded">
            {currentSiswa.mentor || "Instruktur GWA"}
          </span>
        </div>
      </div>

      {/* ── Two Columns: Riwayat Kehadiran & Sesi Mendatang ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Riwayat Kehadiran */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
            <span>📝 Riwayat Sesi Selesai</span>
            <span className="text-[11px] text-emerald-400">Tercatat</span>
          </div>

          <div className="p-5">
            <h3 className="font-heading font-black text-sm sm:text-base text-black mb-4">
              Pertemuan yang Sudah Kamu Ikuti
            </h3>

            {kehadiran.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-300 rounded-lg text-xs text-slate-500 font-medium">
                Belum ada riwayat kehadiran tercatat.
              </div>
            ) : (
              <div className="space-y-2.5">
                {kehadiran.map((item) => (
                  <div
                    key={item.pertemuan}
                    className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-black text-white font-heading font-bold text-xs flex items-center justify-center rounded border border-black shrink-0">
                        #{item.pertemuan}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-black text-xs text-black truncate">
                          {item.materi_judul ||
                            item.materi?.judul ||
                            (typeof item.materi === "string"
                              ? item.materi
                              : `Pertemuan Ke-${item.pertemuan}`)}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {item.tanggal_hadir ||
                            item.tanggal ||
                            (item.status === "Hadir"
                              ? "Tercatat Hadir"
                              : "Sesuai Jadwal")}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Jadwal Sesi Mendatang */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
            <span>📅 Jadwal Sesi Mendatang</span>
            <span className="text-[11px] text-cyan-300">Berikutnya</span>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-sm sm:text-base text-black">
                Pertemuan Berikutnya
              </h3>
              {isLoadingJadwal && (
                <span className="text-[11px] text-slate-500 animate-pulse">
                  Sinkronisasi...
                </span>
              )}
            </div>

            {pertemuanMendatang.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-heading font-black text-base text-black">
                  Semua Sesi Selesai! 🎉
                </p>
                <p className="text-xs text-slate-700 font-medium">
                  Hebat! Kamu telah menyelesaikan seluruh sesi pertemuan di kursus ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pertemuanMendatang.map((item) => (
                  <div
                    key={item.pertemuan}
                    className="p-3 bg-cyan-50/60 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-cyan-400 text-black font-heading font-bold text-xs flex items-center justify-center rounded border border-black shrink-0">
                        #{item.pertemuan}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-black text-xs text-black truncate">
                          {item.tanggal}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {item.waktu}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
