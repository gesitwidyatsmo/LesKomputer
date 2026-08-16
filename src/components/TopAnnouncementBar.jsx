"use client";

import { Sparkles, Terminal } from "lucide-react";

export default function TopAnnouncementBar() {
  return (
    <div className="bg-black text-amber-300 border-b-2 border-black font-mono text-xs py-2 px-4 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline font-bold tracking-wider text-emerald-400">[BATCH_2026 // OPEN]</span>
          <span className="sm:hidden font-bold text-emerald-400">[ONLINE]</span>
        </div>

        {/* Center Marquee/Ticker message */}
        <div className="flex items-center gap-3 overflow-hidden text-center truncate justify-center text-[11px] sm:text-xs">
          <span className="font-bold text-white uppercase tracking-wide">
            ⚡ KUOTA TERBATAS: MAKSIMAL 5 SISWA / KELAS
          </span>
          <span className="text-amber-400 font-bold hidden md:inline">//</span>
          <span className="text-amber-300 font-medium hidden md:inline">
            1 SISWA 1 KOMPUTER — METODE PRAKTIK LANGSUNG DI TEMPAT
          </span>
          <span className="text-amber-400 font-bold hidden lg:inline">//</span>
          <span className="text-cyan-300 font-bold hidden lg:inline">
            DAFTAR SEGERA &gt;_
          </span>
        </div>

        {/* Right CTA / Info */}
        <div className="flex items-center gap-2 shrink-0 text-[11px]">
          <a
            href="https://wa.me/6280000000000?text=Halo%20Admin%20GWA,%20saya%20ingin%20cek%20slot%20kelas%20terdekat."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-black bg-amber-400 hover:bg-amber-300 px-2 py-0.5 font-bold uppercase transition-colors"
          >
            <Terminal className="w-3 h-3" /> CEK SLOT &gt;
          </a>
        </div>
      </div>
    </div>
  );
}
