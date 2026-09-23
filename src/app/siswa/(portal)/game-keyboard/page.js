"use client";

import Link from "next/link";
import GameKeyboardArena from "@/components/game-keyboard/GameKeyboardArena";
import { 
  ArrowLeft, 
  Sparkles, 
  Gamepad2, 
  Keyboard,
  Zap
} from "lucide-react";

export default function SiswaGameKeyboardPage() {
  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Navigation Badges ────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/siswa"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-amber-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Siswa</span>
            </Link>
            <Link
              href="/siswa/latihan-mengetik"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-cyan-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Latihan Mengetik 10 Jari</span>
            </Link>
            <Link
              href="/siswa/game-mouse"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-yellow-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Arena Game Mouse</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-300 border-2 border-black px-3 py-1.5 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000] rounded-md flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-black" />
              <span>Arena Game Penguasaan Keyboard Siswa</span>
            </span>
          </div>
        </div>

        {/* Page Main Banner */}
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-7 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-100/60 rounded-full border-2 border-black/10 pointer-events-none hidden sm:block"></div>

          <div className="max-w-3xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-300 border border-black rounded text-[11px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Arena Game Edukasi Keyboard Komputer</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-black tracking-tight leading-tight">
              Petualangan Penguasaan Keyboard Siswa 🐸🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Pelatihan reflek motorik jemari yang seru dan menantang untuk siswa dan pemula. Setiap game dirancang selesai dalam <strong>4–5 menit</strong> guna membentuk memori otot jempol pada tombol Spacebar, ketangkasan Enter, pemahaman arah kursor Backspace vs Delete, hingga kombinasi shortcut.
            </p>
          </div>
        </div>
      </div>

      {/* ── WAHANA GAME INTERAKTIF & KATALOG ────────────────── */}
      <GameKeyboardArena />
    </div>
  );
}
