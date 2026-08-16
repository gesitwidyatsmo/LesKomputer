"use client";

import { Lightbulb, FileText, Brain, ChevronRight, MessageCircle } from "lucide-react";
import MateriViewer from "./MateriViewer";
import { useRouter } from "next/navigation";
import { useSiswa } from "@/context/SiswaContext";
import { formatWhatsAppUrl } from "@/lib/landingService";

export default function MateriDropdownContent({ materi }) {
  const router = useRouter();
  const { currentSiswa } = useSiswa();

  const topik = Array.isArray(materi.topik)
    ? materi.topik
    : JSON.parse(materi.topik || "[]");

  const showMateriSection =
    materi.tipe_konten !== "quiz_saja" &&
    materi.lampiran &&
    materi.lampiran.length > 0;
  const showQuizButton = materi.tipe_konten !== "materi_saja";

  const waText = `Halo Guru/Instruktur GWA, saya ${currentSiswa?.nama || "Siswa"} (ID: ${
    currentSiswa?.id || "-"
  }) dari kelas ${
    currentSiswa?.kelas || "-"
  }. Saya ingin bertanya tentang materi: "${materi.judul}" (Pertemuan ${
    materi.pertemuan
  }).`;
  const waUrl = formatWhatsAppUrl("6280000000000", waText);

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

      {/* Action Footer: Tanya Guru via WhatsApp + Tombol Mulai Quiz */}
      <div className="pt-3 border-t-2 border-dashed border-black flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
        <div className="space-y-1">
          <span className="font-heading font-black text-xs sm:text-sm text-black block">
            🎮 Kuis & Bantuan Belajar
          </span>
          <p className="text-slate-600 text-xs font-medium">
            Ada materi atau rumus yang membingungkan? Langsung tanya gurumu ya!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Tombol Tanya Guru WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-heading text-xs font-bold border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-black" />
            <span>Tanya Guru</span>
          </a>

          {/* Tombol Mulai Kuis */}
          {showQuizButton && (
            <button
              onClick={() => router.push(`/siswa/quiz?materi=${materi.id}`)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wide border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
            >
              <Brain className="w-4 h-4" />
              <span>Mulai Kuis P{materi.pertemuan}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
