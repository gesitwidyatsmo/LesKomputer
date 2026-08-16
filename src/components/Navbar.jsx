"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF5] border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Neobrutalis */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-black text-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center font-mono font-black text-lg group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                &gt;_
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl text-black tracking-tight leading-none">
                  GWA<span className="text-orange-500">.</span>TECH
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-600 tracking-wider uppercase mt-0.5">
                  Lembaga Kursus Komputer
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu - Properly spaced with margin from logo */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 ml-auto mr-6">
            <Link 
              href="#beranda" 
              className="px-3 py-1.5 font-mono text-xs font-bold text-slate-900 uppercase hover:bg-amber-300 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all border-2 border-transparent"
            >
              Beranda
            </Link>
            <Link 
              href="#keunggulan" 
              className="px-3 py-1.5 font-mono text-xs font-bold text-slate-900 uppercase hover:bg-cyan-300 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all border-2 border-transparent"
            >
              Keunggulan
            </Link>
            <Link 
              href="#program" 
              className="px-3 py-1.5 font-mono text-xs font-bold text-slate-900 uppercase hover:bg-emerald-300 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all border-2 border-transparent"
            >
              Program Kursus
            </Link>
            <Link 
              href="#fasilitas" 
              className="px-3 py-1.5 font-mono text-xs font-bold text-slate-900 uppercase hover:bg-purple-300 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all border-2 border-transparent"
            >
              Fasilitas Lab
            </Link>
            <Link 
              href="#faq" 
              className="px-3 py-1.5 font-mono text-xs font-bold text-slate-900 uppercase hover:bg-rose-300 hover:border-2 hover:border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all border-2 border-transparent"
            >
              FAQ
            </Link>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center shrink-0">
            <a 
              href="https://wa.me/6280000000000?text=Halo%20Admin%20GWA,%20saya%20tertarik%20untuk%20mendaftar%20kursus%20komputer." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>&gt;_</span> DAFTAR SEKARANG
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-black hover:bg-amber-300 focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-black bg-[#FFFDF5] p-4 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-2 font-mono text-xs">
            <Link 
              href="#beranda" 
              className="block px-3 py-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-bold text-black uppercase hover:bg-amber-300"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="#keunggulan" 
              className="block px-3 py-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-bold text-black uppercase hover:bg-cyan-300"
              onClick={() => setIsOpen(false)}
            >
              Keunggulan
            </Link>
            <Link 
              href="#program" 
              className="block px-3 py-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-bold text-black uppercase hover:bg-emerald-300"
              onClick={() => setIsOpen(false)}
            >
              Program Kursus
            </Link>
            <Link 
              href="#fasilitas" 
              className="block px-3 py-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-bold text-black uppercase hover:bg-purple-300"
              onClick={() => setIsOpen(false)}
            >
              Fasilitas Lab
            </Link>
            <Link 
              href="#faq" 
              className="block px-3 py-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-bold text-black uppercase hover:bg-rose-300"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>

            <div className="pt-2">
              <a 
                href="https://wa.me/6280000000000?text=Halo%20Admin%20GWA,%20saya%20tertarik%20untuk%20mendaftar%20kursus%20komputer." 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center py-3 bg-orange-500 hover:bg-orange-400 border-2 border-black shadow-[3px_3px_0px_0px_#000] font-black text-black uppercase"
              >
                &gt;_ DAFTAR VIA WHATSAPP
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
