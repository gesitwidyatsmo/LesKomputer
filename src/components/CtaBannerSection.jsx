"use client";

import { ArrowRight, Terminal, CheckCircle2 } from "lucide-react";

export default function CtaBannerSection({ data }) {
  const badgeText = data?.badgeText || "[SYS_COMMAND // INITIALIZE_ENROLLMENT]";
  const titlePrefix = data?.titlePrefix || "SIAP MENJADI MAHIR";
  const titleHighlight = data?.titleHighlight || "DAN PERCAYA DIRI BEKERJA?";
  const description = data?.description || "Slot 5 siswa per kelas sangat cepat penuh. Segera konsultasikan modul yang Anda butuhkan dan amankan jadwal kelas terbaik Anda bersama mentor kami hari ini.";
  const badge1 = data?.badge1 || "Bebas Biaya Pendaftaran";
  const badge2 = data?.badge2 || "Modul & Praktik Lengkap";
  const buttonPrimaryText = data?.buttonPrimaryText || "DAFTAR VIA WHATSAPP SEKARANG";
  const buttonPrimaryMessage = data?.buttonPrimaryMessage || "Halo Admin GWA, saya siap mendaftar kelas kursus komputer.";
  const buttonSecondaryText = data?.buttonSecondaryText || "[#] Eksplor Modul Kursus Lainnya";
  const buttonSecondaryLink = data?.buttonSecondaryLink || "#program";

  const waLink = `https://wa.me/6280000000000?text=${encodeURIComponent(buttonPrimaryMessage)}`;

  return (
    <section className="py-20 lg:py-24 bg-orange-500 border-b-3 border-black text-black relative overflow-hidden">
      
      {/* Background Retro Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-retro-grid"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#FFFDF5] border-3 border-black shadow-[10px_10px_0px_0px_#000] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-2xl">
            {/* Tag */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-amber-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-6">
                <Terminal className="w-3.5 h-3.5" /> {badgeText}
              </div>
            )}

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black leading-tight mb-4 uppercase">
              {titlePrefix} <br />
              {titleHighlight && (
                <span className="bg-amber-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
                  {titleHighlight}
                </span>
              )}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed mb-6">
              {description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs font-bold text-slate-900">
              {badge1 && (
                <span className="flex items-center gap-1.5 bg-emerald-100 px-2.5 py-1 border border-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {badge1}
                </span>
              )}
              {badge2 && (
                <span className="flex items-center gap-1.5 bg-yellow-100 px-2.5 py-1 border border-black">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" /> {badge2}
                </span>
              )}
            </div>
          </div>

          {/* CTA Box */}
          <div className="w-full lg:w-auto flex flex-col gap-4 shrink-0">
            <a 
              href={waLink} 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-mono text-sm sm:text-base font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>&gt;_</span> {buttonPrimaryText}
              <ArrowRight className="w-5 h-5" />
            </a>

            {buttonSecondaryText && (
              <a 
                href={buttonSecondaryLink} 
                className="px-8 py-3.5 bg-white hover:bg-slate-100 text-black font-mono text-xs sm:text-sm font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center"
              >
                {buttonSecondaryText}
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
