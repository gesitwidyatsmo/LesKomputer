"use client";

import Link from "next/link";
import { MapPin, Clock, Phone, Terminal } from "lucide-react";
import { formatPhoneDisplay, formatWhatsAppUrl } from "@/lib/landingService";

export default function Footer({ data, globalSettings }) {
  const brandName = globalSettings?.brandName || data?.brandName || "GWA.TECH";
  const brandTagline = globalSettings?.brandTagline || data?.brandTagline || "// Gesit, Wawasan, Aplikatif";
  const brandDescription = globalSettings?.brandDescription || data?.brandDescription || "Lembaga kursus komputer terpercaya dengan pendekatan eksklusif 1-on-5 mentoring. Fokus pada efisiensi kerja, pemahaman logika rumus, dan studi kasus nyata.";
  const address = globalSettings?.address || data?.address || "Jl. Pendidikan No. 123, Kecamatan Ilmu, Kota Teknologi, Indonesia 12345";
  const workingHours = globalSettings?.workingHours || data?.workingHours || "Senin - Sabtu: 08.30 - 21.00 WIB";
  const whatsappNumber = globalSettings?.whatsappNumber || "6280000000000";
  const phoneDisplay = formatPhoneDisplay(whatsappNumber);
  const copyright = globalSettings?.copyright || data?.copyright || "GWA TECH COURSE. HAK CIPTA DILINDUNGI.";

  const showStatusStrip = (globalSettings?.showStatusStrip ?? data?.showStatusStrip) !== false;
  const showBrandInfo = (globalSettings?.showBrandInfo ?? data?.showBrandInfo) !== false;
  const showProgramsCol = (globalSettings?.showProgramsCol ?? data?.showProgramsCol) !== false;
  const showContactCol = (globalSettings?.showContactCol ?? data?.showContactCol) !== false;
  const footerProgramsTitle = globalSettings?.footerProgramsTitle || data?.footerProgramsTitle || "PROGRAM MODUL";

  const defaultFooterPrograms = [
    { isVisible: true, label: "Microsoft Word Master", link: "/#program" },
    { isVisible: true, label: "Microsoft Excel Expert", link: "/#program" },
    { isVisible: true, label: "Microsoft PowerPoint Pro", link: "/#program" },
    { isVisible: true, label: "Paket Mahir 3-in-1 Kantor", link: "/#program" }
  ];

  const rawFooterPrograms = globalSettings?.footerPrograms || data?.footerPrograms || defaultFooterPrograms;
  const footerPrograms = rawFooterPrograms.filter((it) => it.isVisible !== false);

  const waLink = formatWhatsAppUrl(whatsappNumber, "Halo Admin GWA Tech Course, saya ingin konsultasi.");

  return (
    <footer className="bg-black text-white border-t-3 border-black selection:bg-amber-300 selection:text-black">
      
      {/* Retro Status Strip */}
      {showStatusStrip && (
        <div className="border-b-2 border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-400 select-none">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-bold">[SYS_STATUS: 100% OPERATIONAL]</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="hidden sm:inline text-slate-300">{brandName} // LKP LES KOMPUTER</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-amber-400 font-bold">1 SISWA 1 KOMPUTER</span>
              <span>•</span>
              <span className="text-cyan-300 font-bold">MAKS 5 SISWA / KELAS</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: Brand Info (5 cols) */}
          {showBrandInfo && (
            <div className={`${showProgramsCol && showContactCol ? "md:col-span-5" : "md:col-span-6"} space-y-4`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-300 text-black border-2 border-white shadow-[2px_2px_0px_0px_#FFF] flex items-center justify-center font-mono font-black text-xl">
                  &gt;_
                </div>
                <span className="font-heading font-black text-2xl text-white tracking-tight">
                  {brandName.includes(".") ? (
                    <>
                      {brandName.split(".")[0]}<span className="text-orange-500">.</span>{brandName.split(".")[1]}
                    </>
                  ) : (
                    brandName
                  )}
                </span>
              </div>
              {brandTagline && (
                <p className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {brandTagline}
                </p>
              )}
              {brandDescription && (
                <p className="text-sm text-slate-300 leading-relaxed font-medium max-w-sm">
                  {brandDescription}
                </p>
              )}
            </div>
          )}

          {/* Col 2: Program Kursus (3 cols) */}
          {showProgramsCol && footerPrograms.length > 0 && (
            <div className={`${showBrandInfo && showContactCol ? "md:col-span-3" : "md:col-span-4"} space-y-3 font-mono text-xs`}>
              <h4 className="text-amber-300 font-black uppercase text-sm border-b-2 border-slate-800 pb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-500" /> {footerProgramsTitle}
              </h4>
              <ul className="space-y-2.5 text-slate-300">
                {footerPrograms.map((prog, idx) => (
                  <li key={idx}>
                    <Link href={prog.link || "/#program"} className="hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors">
                      <span>▶</span> {prog.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 3: Kontak & Lokasi (4 cols) */}
          {showContactCol && (
            <div className={`${showBrandInfo && showProgramsCol ? "md:col-span-4" : "md:col-span-6"} space-y-3 text-xs`}>
              <h4 className="text-amber-300 font-mono font-black uppercase text-sm border-b-2 border-slate-800 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" /> LOKASI &amp; KONTAK
              </h4>
              <div className="space-y-3 text-slate-300">
                {address && (
                  <p className="leading-relaxed">
                    {address}
                  </p>
                )}
                <div className="space-y-1.5 font-mono">
                  {workingHours && (
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{workingHours}</span>
                    </p>
                  )}
                  {whatsappNumber && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 hover:underline">
                        WhatsApp: {phoneDisplay}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t-2 border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {copyright}
          </p>
        </div>

      </div>
    </footer>
  );
}
