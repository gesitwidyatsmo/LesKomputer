"use client";

import { useState, useEffect } from "react";
import { useSiswa } from "@/context/SiswaContext";
import { getMateriByModul } from "@/lib/materiService";
import {
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import MateriDropdownContent from "@/components/siswa/MateriDropdownContent";

const STATUS_BADGE = {
  selesai: (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-300 text-black text-xs font-bold border border-black rounded shadow-[1px_1px_0px_0px_#000]">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Selesai ✓
    </span>
  ),
  terbuka: (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-cyan-300 text-black text-xs font-bold border border-black rounded shadow-[1px_1px_0px_0px_#000]">
      <BookOpen className="w-3.5 h-3.5 text-cyan-800" /> Siap Dibaca
    </span>
  ),
  terkunci: (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold border border-black rounded">
      <Lock className="w-3.5 h-3.5 text-slate-500" /> Belum Terbuka
    </span>
  ),
};

export default function MateriPage() {
  const { currentSiswa, aksesMateri } = useSiswa();
  const [expanded, setExpanded] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMateri() {
      if (currentSiswa?.modul_id) {
        setIsLoading(true);
        const { data, error } = await getMateriByModul(currentSiswa.modul_id);
        if (!error && data) {
          setMateriList(data);
          const firstOpen = data.find(
            (m) => (aksesMateri[m.id] || "terkunci") === "terbuka"
          );
          if (firstOpen) {
            setExpanded(firstOpen.id);
          }
        }
        setIsLoading(false);
      }
    }
    loadMateri();
  }, [currentSiswa, aksesMateri]);

  if (!currentSiswa) return null;

  const getStatus = (materiId) => {
    return aksesMateri[materiId] || "terkunci";
  };

  const selesaiCount = materiList.filter(
    (m) => getStatus(m.id) === "selesai"
  ).length;
  const progress =
    materiList.length > 0
      ? Math.round((selesaiCount / materiList.length) * 100)
      : 0;

  const modulName = currentSiswa.modul || "Materi Pelatihan";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span>📖</span>
            <span className="text-amber-300">Modul Pembelajaran Siswa</span>
          </div>
          <span className="text-[11px] text-emerald-400">● Modul Aktif</span>
        </div>

        <div className="p-5 sm:p-7 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-cyan-400 text-black font-bold text-xs px-2.5 py-0.5 border border-black rounded">
                  Modul Praktik Komputer
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {currentSiswa.kelas}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                Materi Belajar: {modulName}
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Pilih pertemuan di bawah untuk membaca rangkuman materi, tips cepat, dan latihan tugas.
              </p>
            </div>

            {/* Progress Box */}
            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-4 shrink-0 min-w-[200px] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Progres Modul</span>
                <span className="bg-orange-500 text-black px-2 py-0.5 border border-black rounded font-black">
                  {progress}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 border-2 border-black rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
              <p className="text-xs font-bold text-slate-600 text-right">
                {selesaiCount} dari {materiList.length} Sesi Selesai
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Keterangan Bar ──────────────────────────── */}
      <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-black font-heading">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Status Pembelajaran:</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 bg-emerald-200 border border-black rounded text-black">
            ✓ Sudah Selesai
          </span>
          <span className="px-2.5 py-1 bg-cyan-200 border border-black rounded text-black">
            📖 Siap Dibaca
          </span>
          <span className="px-2.5 py-1 bg-slate-200 border border-black rounded text-slate-700">
            🔒 Belum Terbuka
          </span>
        </div>
      </div>

      {/* ── Materi List ───────────────────────────────────── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-black font-heading">
              Sedang menyiapkan daftar materi belajarmu... 📚
            </p>
          </div>
        ) : materiList.length === 0 ? (
          <div className="p-10 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl text-xs text-slate-600 font-bold">
            Belum ada materi yang diunggah untuk modul ini.
          </div>
        ) : (
          materiList.map((materi) => {
            const status = getStatus(materi.id);
            const isOpen = expanded === materi.id;
            const isLocked = status === "terkunci";

            return (
              <div
                key={materi.id}
                className={`border-3 border-black rounded-xl transition-all overflow-hidden ${
                  isLocked
                    ? "bg-slate-100/80 shadow-[2px_2px_0px_0px_#000] opacity-80"
                    : status === "terbuka"
                    ? "bg-cyan-50 shadow-[5px_5px_0px_0px_#000]"
                    : "bg-white shadow-[4px_4px_0px_0px_#000]"
                }`}
              >
                {/* Meeting Accordion Header */}
                <button
                  className={`w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left select-none cursor-pointer transition-colors ${
                    isLocked
                      ? "cursor-not-allowed"
                      : isOpen
                      ? "bg-amber-100/80 border-b-2 border-black"
                      : "hover:bg-yellow-50"
                  }`}
                  onClick={() =>
                    !isLocked && setExpanded(isOpen ? null : materi.id)
                  }
                  disabled={isLocked}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Pertemuan Index Box */}
                    <div
                      className={`w-11 h-11 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-heading font-black text-sm rounded-lg shrink-0 ${
                        status === "selesai"
                          ? "bg-emerald-300 text-black"
                          : status === "terbuka"
                          ? "bg-orange-500 text-black"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      P{materi.pertemuan}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading font-black text-sm sm:text-base text-black truncate">
                          {materi.judul}
                        </span>
                        {STATUS_BADGE[status]}
                        {materi.tipe_konten === "quiz_saja" && (
                          <span className="text-[11px] font-bold bg-purple-300 text-black px-2 py-0.5 border border-black rounded">
                            🎮 Kuis Khusus
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5 text-black" />
                          {materi.durasi || "2 Jam Belajar"}
                        </span>
                        <span>·</span>
                        <span>Pertemuan Ke-{materi.pertemuan}</span>
                      </div>
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="shrink-0 p-1.5 bg-white border-2 border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-black" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-black" />
                      )}
                    </div>
                  )}
                </button>

                {/* Expanded Content View */}
                {isOpen && !isLocked && (
                  <MateriDropdownContent materi={materi} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
