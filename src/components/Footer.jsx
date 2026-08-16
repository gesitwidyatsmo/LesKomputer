"use client";

import { MapPin, Clock, Phone, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-3 border-black selection:bg-amber-300 selection:text-black">
      
      {/* Retro Status Strip */}
      <div className="border-b-2 border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-400 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">[SYS_STATUS: 100% OPERATIONAL]</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300">GWA TECH // LKP LES KOMPUTER</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-amber-400 font-bold">1 SISWA 1 KOMPUTER</span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">MAKS 5 SISWA / KELAS</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-300 text-black border-2 border-white shadow-[2px_2px_0px_0px_#FFF] flex items-center justify-center font-mono font-black text-xl">
                &gt;_
              </div>
              <span className="font-heading font-black text-2xl text-white tracking-tight">
                GWA<span className="text-orange-500">.</span>TECH
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
              // Gesit, Wawasan, Aplikatif
            </p>
            <p className="text-sm text-slate-300 leading-relaxed font-medium max-w-sm">
              Lembaga kursus komputer terpercaya dengan pendekatan eksklusif 1-on-5 mentoring. Fokus pada efisiensi kerja, pemahaman logika rumus, dan studi kasus nyata.
            </p>
          </div>

          {/* Col 2: Program Kursus (3 cols) */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-amber-300 font-black uppercase text-sm border-b-2 border-slate-800 pb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" /> PROGRAM MODUL
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a href="#program" className="hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors">
                  <span>▶</span> Microsoft Word Master
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors">
                  <span>▶</span> Microsoft Excel Expert
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors">
                  <span>▶</span> Microsoft PowerPoint Pro
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors">
                  <span>▶</span> Paket Mahir 3-in-1 Kantor
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak & Lokasi (4 cols) */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-amber-300 font-mono font-black uppercase text-sm border-b-2 border-slate-800 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> LOKASI & KONTAK
            </h4>
            <div className="space-y-3 text-slate-300">
              <p className="leading-relaxed">
                Jl. Pendidikan No. 123, Kecamatan Ilmu, Kota Teknologi, Indonesia 12345
              </p>
              <div className="space-y-1.5 font-mono">
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Senin - Sabtu: 08.30 - 21.00 WIB</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp: +62 800-0000-0000</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t-2 border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} GWA TECH COURSE. HAK CIPTA DILINDUNGI.
          </p>
        </div>

      </div>
    </footer>
  );
}
