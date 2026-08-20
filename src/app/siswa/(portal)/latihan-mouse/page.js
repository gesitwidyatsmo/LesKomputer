"use client";

import Link from "next/link";
import MouseTrainerGame from "@/components/mouse-trainer/MouseTrainerGame";
import MouseGuideCard from "@/components/mouse-trainer/MouseGuideCard";
import { 
  ArrowLeft, 
  MousePointer2, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Brain,
  Trophy
} from "lucide-react";

export default function SiswaLatihanMousePage() {
  return (
    <div className="space-y-6">
      {/* ── Top Header Bar ────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/siswa"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-amber-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Siswa</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="bg-amber-300 border-2 border-black px-3 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000] rounded-md flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-black" />
            <span>Mini Game Keterampilan Komputer</span>
          </span>
        </div>
      </div>

      {/* ── Welcome Banner ────────────────── */}
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-5 sm:p-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-300 border border-black rounded text-[11px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
            <span>🖱️ Ruang Latihan Interaktif</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-black tracking-tight leading-snug">
            Latihan Menggunakan Mouse Komputer
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            Latih kecepatan refleks kursor, kestabilan tangan, klik kanan, klik ganda, drag and drop, dan scroll roda mouse agar semakin mahir dan terbiasa mengoperasikan komputer!
          </p>
        </div>
      </div>

      {/* ── Main Game Component ────────────────── */}
      <section aria-label="Game Interaktif Mouse">
        <MouseTrainerGame />
      </section>

      {/* ── Guide Card ────────────────── */}
      <section aria-label="Panduan Penggunaan Mouse">
        <MouseGuideCard />
      </section>
    </div>
  );
}
