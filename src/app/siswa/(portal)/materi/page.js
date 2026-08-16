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
  FolderTree,
  Terminal,
} from "lucide-react";
import MateriDropdownContent from "@/components/siswa/MateriDropdownContent";

const STATUS_BADGE = {
  selesai: (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-300 text-black font-mono text-[11px] font-bold uppercase border border-black shadow-[1px_1px_0px_0px_#000]">
      <CheckCircle2 className="w-3 h-3 text-emerald-800" /> [SELESAI]
    </span>
  ),
  terbuka: (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-300 text-black font-mono text-[11px] font-bold uppercase border border-black shadow-[1px_1px_0px_0px_#000]">
      <BookOpen className="w-3 h-3 text-cyan-800" /> [TERBUKA]
    </span>
  ),
  terkunci: (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 text-slate-700 font-mono text-[11px] font-bold uppercase border border-black">
      <Lock className="w-3 h-3 text-slate-500" /> [TERKUNCI]
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
          // Default expand open first unlocked
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
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        {/* Retro Window Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 border border-black inline-block"></span>
            <span>sys_materi_directory.exe</span>
          </div>
          <span className="text-[10px] text-cyan-300 font-mono">[DIR_BROWSER]</span>
        </div>

        <div className="p-5 sm:p-6 bg-[#FFFDF5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-cyan-400 text-black font-mono text-xs font-black px-2 py-0.5 border border-black uppercase">
                  📁 DIRECTORY // MODUL
                </span>
                <span className="font-mono text-xs font-bold text-slate-600">
                  {currentSiswa.kelas}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black uppercase tracking-tight">
                Materi Pelatihan: {modulName}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-700 font-bold mt-1">
                Akses modul materi, silabus latihan kasus nyata, dan kuis uji pemahaman.
              </p>
            </div>

            {/* Progress Box */}
            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 shrink-0 min-w-[200px] space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs font-bold">
                <span className="text-slate-600 uppercase">MODUL_PROGRESS</span>
                <span className="bg-orange-500 text-black px-1.5 py-0.2 border border-black">
                  {progress}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 border border-black overflow-hidden">
                <div
                  className="h-full bg-orange-500 border-r border-black transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-mono text-[10px] font-bold text-slate-500 text-right">
                {selesaiCount}/{materiList.length} Sesi Diselesaikan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Legend & Filter Bar ────────────────────────────── */}
      <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-black">
          <FolderTree className="w-4 h-4 text-black" />
          <span className="uppercase">STRUKTUR DIREKTORI MATERI:</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 bg-emerald-200 border border-black font-bold text-black">
            [✓] SELESAI
          </span>
          <span className="px-2 py-0.5 bg-cyan-200 border border-black font-bold text-black">
            [📖] TERBUKA
          </span>
          <span className="px-2 py-0.5 bg-slate-200 border border-black font-bold text-slate-700">
            [🔒] TERKUNCI
          </span>
        </div>
      </div>

      {/* ── Materi Tree List ──────────────────────────────── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
            <p className="font-mono text-xs font-bold uppercase text-black">
              &gt;_ Membuka direktori modul materi...
            </p>
          </div>
        ) : materiList.length === 0 ? (
          <div className="p-10 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] font-mono text-xs text-slate-600 font-bold">
            [EMPTY_DIR] Belum ada file materi yang diunggah untuk modul ini.
          </div>
        ) : (
          materiList.map((materi) => {
            const status = getStatus(materi.id);
            const isOpen = expanded === materi.id;
            const isLocked = status === "terkunci";

            return (
              <div
                key={materi.id}
                className={`border-3 border-black transition-all ${
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
                      ? "bg-amber-100/70 border-b-2 border-black"
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
                      className={`w-10 h-10 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-mono font-black text-sm shrink-0 ${
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
                        <span className="font-heading font-black text-sm sm:text-base text-black uppercase truncate">
                          {materi.judul}
                        </span>
                        {STATUS_BADGE[status]}
                        {materi.tipe_konten === "quiz_saja" && (
                          <span className="font-mono text-[10px] font-bold bg-purple-300 text-black px-1.5 py-0.5 border border-black">
                            [E-QUIZ]
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 font-mono text-xs text-slate-600 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-black" />
                          {materi.durasi || "2 Jam Pembelajaran"}
                        </span>
                        <span>·</span>
                        <span>Sesi Pertemuan Ke-{materi.pertemuan}</span>
                      </div>
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="shrink-0 p-1 bg-white border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
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
