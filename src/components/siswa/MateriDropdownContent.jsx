"use client";

import { Lightbulb, FileText, Brain, ChevronRight, Check } from "lucide-react";
import MateriViewer from "./MateriViewer";
import { useRouter } from "next/navigation";

export default function MateriDropdownContent({ materi }) {
  const router = useRouter();
  const topik = Array.isArray(materi.topik)
    ? materi.topik
    : JSON.parse(materi.topik || "[]");

  const showMateriSection =
    materi.tipe_konten !== "quiz_saja" &&
    materi.lampiran &&
    materi.lampiran.length > 0;
  const showQuizButton = materi.tipe_konten !== "materi_saja";

  return (
    <div className="p-5 sm:p-6 bg-white space-y-5 animate-in fade-in duration-150">
      {/* Deskripsi */}
      {materi.deskripsi && (
        <div className="p-4 bg-slate-50 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Rangkuman Materi:
          </span>
          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            {materi.deskripsi}
          </p>
        </div>
      )}

      {/* Topik & Tips Trik Grid */}
      {materi.tipe_konten !== "quiz_saja" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topik.length > 0 && (
            <div className="p-4 bg-cyan-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-1.5 font-heading text-xs font-black text-black uppercase mb-3 border-b border-black/20 pb-2">
                <span className="bg-cyan-300 px-2 py-0.5 border border-black rounded">
                  📌
                </span>
                <span>Topik yang Dipelajari</span>
              </div>
              <ul className="space-y-2">
                {topik.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-900"
                  >
                    <span className="w-4 h-4 bg-black text-cyan-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 rounded">
                      ✓
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {materi.tips && (
            <div className="p-4 bg-amber-100 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]">
              <div className="flex items-center gap-1.5 font-heading text-xs font-black text-black uppercase mb-2 border-b border-black/20 pb-2">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>Tips Cepat dari Guru</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {materi.tips}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lampiran Dokumen PDF */}
      {showMateriSection && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black border-b-2 border-black pb-2 font-heading">
            <FileText className="w-4 h-4 text-black" />
            <span>Dokumen Panduan & Latihan Belajar (.PDF)</span>
          </div>

          <div className="space-y-4">
            {materi.lampiran.map((lamp) => (
              <MateriViewer
                key={lamp.id}
                fileUrl={lamp.url_publik}
                fileName={lamp.nama_file}
                fileSize={lamp.ukuran_mb}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tombol Mulai Quiz */}
      {showQuizButton && (
        <div className="pt-3 border-t-2 border-dashed border-black flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
          <div>
            <span className="font-heading font-black text-xs sm:text-sm text-black block">
              🎮 Kuis Pemahaman Materi
            </span>
            <span className="text-slate-600 text-xs font-medium">
              Yuk coba kuis pilihan ganda untuk menguji apa yang sudah kamu pelajari!
            </span>
          </div>

          <button
            onClick={() => router.push(`/siswa/quiz?materi=${materi.id}`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wide border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
          >
            <Brain className="w-4 h-4" />
            <span>Mulai Kuis Pertemuan {materi.pertemuan}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
