"use client";

import { Terminal } from "lucide-react";

export default function TopAnnouncementBar({ data }) {
  const batchStatus = data?.batchStatus || "[BATCH_2026 // OPEN]";
  const onlineText = data?.onlineText || "[ONLINE]";
  const marqueeText1 = data?.marqueeText1 || "⚡ KUOTA TERBATAS: MAKSIMAL 5 SISWA / KELAS";
  const marqueeText2 = data?.marqueeText2 || "1 SISWA 1 KOMPUTER — METODE PRAKTIK LANGSUNG DI TEMPAT";
  const marqueeText3 = data?.marqueeText3 || "DAFTAR SEGERA >_";
  const buttonText = data?.buttonText || "CEK SLOT >";
  const whatsappNumber = data?.whatsappNumber || "6280000000000";
  const whatsappMessage = data?.whatsappMessage || "Halo Admin GWA, saya ingin cek slot kelas terdekat.";

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-black text-amber-300 border-b-2 border-black font-mono text-xs py-2 px-4 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline font-bold tracking-wider text-emerald-400">{batchStatus}</span>
          <span className="sm:hidden font-bold text-emerald-400">{onlineText}</span>
        </div>

        {/* Center Marquee/Ticker message */}
        <div className="flex items-center gap-3 overflow-hidden text-center truncate justify-center text-[11px] sm:text-xs">
          {marqueeText1 && (
            <span className="font-bold text-white uppercase tracking-wide">
              {marqueeText1}
            </span>
          )}
          {marqueeText2 && (
            <>
              <span className="text-amber-400 font-bold hidden md:inline">//</span>
              <span className="text-amber-300 font-medium hidden md:inline">
                {marqueeText2}
              </span>
            </>
          )}
          {marqueeText3 && (
            <>
              <span className="text-amber-400 font-bold hidden lg:inline">//</span>
              <span className="text-cyan-300 font-bold hidden lg:inline">
                {marqueeText3}
              </span>
            </>
          )}
        </div>

        {/* Right CTA / Info */}
        <div className="flex items-center gap-2 shrink-0 text-[11px]">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-black bg-amber-400 hover:bg-amber-300 px-2 py-0.5 font-bold uppercase transition-colors"
          >
            <Terminal className="w-3 h-3" /> {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}
