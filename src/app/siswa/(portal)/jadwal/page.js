"use client";

import { useState, useEffect } from "react";
import { useSiswa } from "@/context/SiswaContext";
import { getJadwalByKelas } from "@/lib/jadwalService";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  User2,
  ChevronRight,
  AlertCircle,
  Terminal,
} from "lucide-react";

function StatusBadge({ status }) {
  if (status === "Hadir")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-300 text-black px-2.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
        <CheckCircle2 className="w-3 h-3 text-emerald-800" /> [HADIR]
      </span>
    );
  if (status === "Tidak Hadir" || status === "Alpa")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-rose-300 text-black px-2.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
        <XCircle className="w-3 h-3 text-rose-800" /> [ALPA]
      </span>
    );
  if (status === "Izin" || status === "Sakit")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-cyan-300 text-black px-2.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
        <Clock className="w-3 h-3 text-cyan-800" /> [{status?.toUpperCase()}]
      </span>
    );
  if (status === "Libur" || status === "Libur / Batal")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-slate-200 text-slate-800 px-2.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
        [LIBUR]
      </span>
    );
  if (status === "Berlangsung")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-amber-300 text-black px-2.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000] animate-pulse">
        [BERLANGSUNG]
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-yellow-200 text-black px-2.5 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
      <Clock className="w-3 h-3 text-amber-800" /> [TERJADWAL]
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

  // Pertemuan mendatang terintegrasi dengan jadwal_pertemuan aktual kelas
  const sisaPertemuan = Math.max(0, totalPertemuan - pertemuanSelesai);
  const pertemuanMendatang = Array.from({ length: sisaPertemuan }, (_, i) => {
    const pNum = pertemuanSelesai + 1 + i;
    const sesiAsli = jadwalKelas.find((j) => j.pertemuan_ke === pNum);
    let tanggalDisplay = "Sesuai Jadwal Rutin";
    let waktuDisplay = `${currentSiswa.jadwal || "Jadwal Rutin"} · ${
      currentSiswa.waktu || "16.00"
    }`;
    let statusDisplay = "Terjadwal";

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
        waktuDisplay = `Pukul ${sesiAsli.jam_mulai} - ${sesiAsli.jam_selesai}`;
      }
      statusDisplay = sesiAsli.status || "Terjadwal";
    }

    return {
      pertemuan: pNum,
      tanggal: tanggalDisplay,
      waktu: waktuDisplay,
      status: statusDisplay,
      materi: `Materi Sesi Pertemuan ${pNum}`,
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-black inline-block"></span>
            <span>sys_jadwal_presensi.exe</span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono">[LIVE_TIMETABLE]</span>
        </div>

        <div className="p-5 sm:p-6 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-orange-500 text-black font-mono text-xs font-black px-2 py-0.5 border border-black uppercase">
                  [TIMETABLE & PRESENSI]
                </span>
                <span className="font-mono text-xs font-bold text-slate-600">
                  ID: {currentSiswa.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black uppercase tracking-tight">
                Jadwal & Riwayat Kehadiran
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-700 font-bold mt-1">
                KELAS: <span className="text-orange-600 font-black">{currentSiswa.kelas}</span> · MODUL:{" "}
                <span className="text-black font-black">{currentSiswa.modul}</span>
              </p>
            </div>

            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3 text-right shrink-0">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">
                MINIMAL_LULUS
              </span>
              <span className="font-heading font-black text-lg text-emerald-600">
                80% KEHADIRAN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sesi",
            value: totalPertemuan,
            tag: "SYS_TOTAL",
            bg: "bg-white",
            border: "border-slate-800",
            textColor: "text-black",
          },
          {
            label: "Hadir Tercatat",
            value: hadirCount,
            tag: "STATUS_OK",
            bg: "bg-emerald-100",
            border: "border-black",
            textColor: "text-emerald-800",
          },
          {
            label: "Tidak Hadir",
            value: tidakHadirCount,
            tag: "STATUS_ABS",
            bg: "bg-rose-100",
            border: "border-black",
            textColor: "text-rose-700",
          },
          {
            label: "Persentase",
            value: `${kehadiranPct}%`,
            tag: "ATTENDANCE_PCT",
            bg: kehadiranPct >= 80 ? "bg-amber-200" : "bg-orange-200",
            border: "border-black",
            textColor: "text-black",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`${s.bg} border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 text-center space-y-1`}
          >
            <span className="font-mono text-[10px] font-black uppercase text-slate-600 block">
              [{s.tag}]
            </span>
            <p className={`text-2xl sm:text-3xl font-heading font-black ${s.textColor}`}>
              {s.value}
            </p>
            <p className="font-mono text-xs font-bold text-black uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Progress Bar Kehadiran ────────────────────────── */}
      <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] p-5 space-y-3">
        <div className="flex items-center justify-between font-mono text-xs font-bold text-black">
          <span className="uppercase">
            [PROGRESS_BAR] TINGKAT KEHADIRAN KELAS
          </span>
          <span className="bg-black text-white px-2 py-0.5 font-mono font-black">
            {kehadiranPct}% / 100%
          </span>
        </div>

        <div className="w-full h-5 bg-slate-100 border-2 border-black p-0.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 border-r-2 border-black ${
              kehadiranPct >= 80 ? "bg-emerald-400" : "bg-orange-400"
            }`}
            style={{ width: `${Math.min(100, Math.max(5, kehadiranPct))}%` }}
          />
        </div>

        {kehadiranPct < 80 && (
          <div className="p-3 bg-amber-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 font-mono text-xs text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              [PERINGATAN] Kehadiran di bawah 80%. Pastikan mengikuti sesi kelas untuk syarat kelulusan kursus.
            </span>
          </div>
        )}
      </div>

      {/* ── Info Jadwal Rutin Kelas ───────────────────────── */}
      <div className="bg-cyan-100 border-3 border-black shadow-[5px_5px_0px_0px_#000] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-black text-cyan-300 font-mono text-xs font-bold">
              &gt;_
            </span>
            <h2 className="font-heading font-black text-black text-lg uppercase tracking-tight">
              Informasi Rutin Jadwal Belajar
            </h2>
          </div>
          <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 border border-black">
            1 SISWA 1 PC
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
            <div className="p-2 bg-amber-300 border border-black shrink-0">
              <Calendar className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                HARI_BELAJAR
              </p>
              <p className="font-heading font-black text-sm text-black">
                {currentSiswa.jadwal || "Senin & Rabu"}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
            <div className="p-2 bg-emerald-300 border border-black shrink-0">
              <Clock className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                WAKTU_BELAJAR
              </p>
              <p className="font-heading font-black text-sm text-black">
                {currentSiswa.waktu || "16.00 - 18.00 WIB"}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
            <div className="p-2 bg-purple-300 border border-black shrink-0">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                WORKSTATION / LAB
              </p>
              <p className="font-heading font-black text-sm text-black">
                {currentSiswa.ruangan || "Lab Komputer GWA"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border-2 border-black font-mono text-xs font-bold flex items-center justify-between">
          <span className="text-slate-600">Mentor Instruktur Penanggung Jawab:</span>
          <span className="text-black bg-yellow-200 px-2 py-0.5 border border-black">
            {currentSiswa.mentor || "Instruktur GWA"}
          </span>
        </div>
      </div>

      {/* ── Two Columns: Riwayat Kehadiran & Sesi Mendatang ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Riwayat Kehadiran */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <span>sys_riwayat_kehadiran.log</span>
            <span className="text-[10px] text-emerald-400">[LOG_PRESENSI]</span>
          </div>

          <div className="p-5">
            <h3 className="font-heading font-black text-base text-black uppercase mb-4">
              Riwayat Pertemuan Selesai
            </h3>

            {kehadiran.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-300 font-mono text-xs text-slate-500">
                [NO_DATA] Belum ada riwayat kehadiran tercatat.
              </div>
            ) : (
              <div className="space-y-2.5">
                {kehadiran.map((item) => (
                  <div
                    key={item.pertemuan}
                    className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-black text-white font-mono font-bold text-xs flex items-center justify-center border border-black shrink-0">
                        #{item.pertemuan}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-black text-xs text-black uppercase truncate">
                          {item.materi_judul ||
                            item.materi?.judul ||
                            (typeof item.materi === "string"
                              ? item.materi
                              : `Pertemuan Ke-${item.pertemuan}`)}
                        </p>
                        <p className="font-mono text-[10px] text-slate-600 font-bold mt-0.5">
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
        <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <span>sys_sesi_mendatang.exe</span>
            <span className="text-[10px] text-cyan-300">[UPCOMING_SESI]</span>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-base text-black uppercase">
                Jadwal Sesi Mendatang
              </h3>
              {isLoadingJadwal && (
                <span className="font-mono text-[10px] text-slate-500 animate-pulse">
                  Sinkronisasi...
                </span>
              )}
            </div>

            {pertemuanMendatang.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-heading font-black text-base text-black uppercase">
                  Semua Sesi Selesai!
                </p>
                <p className="font-mono text-xs text-slate-700">
                  Anda telah menyelesaikan seluruh pertemuan pada modul kursus ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pertemuanMendatang.map((item) => (
                  <div
                    key={item.pertemuan}
                    className="p-3 bg-cyan-50/50 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-cyan-400 text-black font-mono font-bold text-xs flex items-center justify-center border border-black shrink-0">
                        #{item.pertemuan}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-black text-xs text-black uppercase truncate">
                          {item.tanggal}
                        </p>
                        <p className="font-mono text-[10px] text-slate-600 font-bold mt-0.5">
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
