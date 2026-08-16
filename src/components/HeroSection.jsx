"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Table, 
  FileText, 
  Presentation, 
  Award, 
  Cpu,
  MousePointerClick
} from "lucide-react";

export default function HeroSection({ data }) {
  const [activeTab, setActiveTab] = useState("excel");

  const badgeText = data?.badgeText || "[⚡ METODE EKSKLUSIF 1-ON-5 MENTORING]";
  const headlinePrefix = data?.headlinePrefix || "Belajar Komputer";
  const headlineSub = data?.headlineSub || "Gak Pakai Rumit.";
  const headlineHighlight = data?.headlineHighlight || "Dari Nol Sampai Mahir.";
  const description = data?.description || "Kuasai Microsoft Word, Excel Logika & Kasir, dan PowerPoint Profesional dengan metode mentoring privat maksimal 5 orang. 1 Siswa 1 Unit Komputer — 100% praktik langsung studi kasus dunia kerja.";
  const ctaWhatsappText = data?.ctaWhatsappText || "Konsultasi via WhatsApp";
  const ctaWhatsappMessage = data?.ctaWhatsappMessage || "Halo Admin GWA, saya ingin konsultasi kursus komputer.";
  const ctaSecondaryText = data?.ctaSecondaryText || "Lihat 3 Modul Kursus";
  const ctaSecondaryLink = data?.ctaSecondaryLink || "#program";
  const trustBadge1 = data?.trustBadge1 || "100% Praktik Nyata";
  const trustBadge2 = data?.trustBadge2 || "Sertifikat Resmi";
  const trustBadge3 = data?.trustBadge3 || "1 Siswa 1 PC Mandiri";
  const floatingBadgeLeftTitle = data?.floatingBadgeLeftTitle || "Total Alumni Lulus";
  const floatingBadgeLeftValue = data?.floatingBadgeLeftValue || "500+ Siswa Mahir";
  const floatingBadgeRightText = data?.floatingBadgeRightText || "5 PC WORKSTATION SIAP";

  const waLink = `https://wa.me/6280000000000?text=${encodeURIComponent(ctaWhatsappMessage)}`;

  return (
    <section id="beranda" className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 bg-[#FFFDF5] bg-retro-dots overflow-hidden border-b-3 border-black">
      
      {/* Decorative floating code tags in background */}
      <div className="absolute top-12 right-12 opacity-15 select-none pointer-events-none font-mono text-xs hidden lg:block text-slate-800">
        <p>&gt; RUN INIT_WORKSTATION_LAB()</p>
        <p>&gt; ALLOCATING 5 PC SLOTS... [OK]</p>
        <p>&gt; MENTOR_SYNC: READY</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 max-w-2xl">
            
            {/* Top Pill Badge */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] font-mono text-xs font-black uppercase text-black mb-6 tracking-wide">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                </span>
                {badgeText}
              </div>
            )}
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-black leading-[1.1] tracking-tight mb-6">
              {headlinePrefix} <br className="hidden sm:inline" />
              {headlineSub} <br />
              {headlineHighlight && (
                <span className="bg-orange-500 text-black px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[4px_4px_0px_0px_#000] transform -rotate-1">
                  {headlineHighlight}
                </span>
              )}
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg font-medium text-slate-800 mb-8 leading-relaxed">
              {description}
            </p>
            
            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a 
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 text-sm sm:text-base font-mono font-black uppercase text-black bg-orange-500 hover:bg-orange-400 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>&gt;_</span> {ctaWhatsappText}
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <a 
                href={ctaSecondaryLink} 
                className="inline-flex justify-center items-center gap-2 px-6 py-4 text-sm sm:text-base font-mono font-bold uppercase text-black bg-white hover:bg-cyan-100 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span>[#]</span> {ctaSecondaryText}
              </a>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {trustBadge1 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-bold text-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{trustBadge1}</span>
                </div>
              )}
              {trustBadge2 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-bold text-black">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{trustBadge2}</span>
                </div>
              )}
              {trustBadge3 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-cyan-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-bold text-black">
                  <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span>{trustBadge3}</span>
                </div>
              )}
            </div>

          </div>
          
          {/* Right Column: Retro-Tech OS Workstation Interactive Simulator */}
          <div className="lg:col-span-5 relative">
            
            {/* Retro Window Container */}
            <div className="neo-box-lg bg-white overflow-hidden relative">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 border border-black inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 border border-black inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-black inline-block"></span>
                  </div>
                  <span className="text-white tracking-wide font-bold">GWA_OS // LAB_SIMULATOR</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  [PC: ONLINE]
                </span>
              </div>

              {/* Window Tab Navigation */}
              <div className="flex border-b-2 border-black bg-slate-100 font-mono text-[11px] font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveTab("excel")}
                  className={`px-3 py-2 flex items-center gap-1.5 border-r-2 border-black transition-colors whitespace-nowrap ${
                    activeTab === "excel" 
                      ? "bg-emerald-300 text-black shadow-[inset_0_-2px_0_0_#000]" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Table className="w-3.5 h-3.5 text-emerald-800" />
                  <span>01. Excel_Logika.xlsx</span>
                </button>

                <button
                  onClick={() => setActiveTab("word")}
                  className={`px-3 py-2 flex items-center gap-1.5 border-r-2 border-black transition-colors whitespace-nowrap ${
                    activeTab === "word" 
                      ? "bg-cyan-300 text-black shadow-[inset_0_-2px_0_0_#000]" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-800" />
                  <span>02. Surat_Resmi.docx</span>
                </button>

                <button
                  onClick={() => setActiveTab("ppt")}
                  className={`px-3 py-2 flex items-center gap-1.5 border-r-2 border-black transition-colors whitespace-nowrap ${
                    activeTab === "ppt" 
                      ? "bg-amber-300 text-black shadow-[inset_0_-2px_0_0_#000]" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5 text-amber-800" />
                  <span>03. PitchDeck.pptx</span>
                </button>

                <button
                  onClick={() => setActiveTab("cert")}
                  className={`px-3 py-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "cert" 
                      ? "bg-purple-300 text-black shadow-[inset_0_-2px_0_0_#000]" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-purple-800" />
                  <span>04. Sertifikat.pdf</span>
                </button>
              </div>

              {/* Tab Content Canvas */}
              <div className="p-4 bg-white min-h-[290px] flex flex-col justify-between font-mono text-xs">
                
                {/* 1. EXCEL TAB CONTENT */}
                {activeTab === "excel" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-black">
                        [FORMULA: VLOOKUP + IF LOGIKA]
                      </span>
                      <span className="text-[11px] text-slate-500">Sheet1: Laporan_Kasir</span>
                    </div>

                    <div className="bg-slate-900 text-emerald-400 p-2.5 border-2 border-black font-mono text-[11px] overflow-x-auto">
                      <code>=IF(VLOOKUP(B2, TBL_HARGA, 3, 0) &gt; 500000, &quot;DISKON_10%&quot;, &quot;NORMAL&quot;)</code>
                    </div>

                    <div className="border-2 border-black overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-emerald-200 text-black border-b-2 border-black font-bold">
                          <tr>
                            <th className="p-1.5 border-r border-black">ID_PRODUK</th>
                            <th className="p-1.5 border-r border-black">QTY</th>
                            <th className="p-1.5 border-r border-black">TOTAL</th>
                            <th className="p-1.5">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          <tr className="bg-emerald-50">
                            <td className="p-1.5 border-r border-black font-bold">PRD-8821</td>
                            <td className="p-1.5 border-r border-black">5 Unit</td>
                            <td className="p-1.5 border-r border-black font-bold">Rp 1.250.000</td>
                            <td className="p-1.5">
                              <span className="bg-emerald-400 text-black px-1.5 py-0.5 border border-black font-black text-[10px]">
                                DISKON_10%
                              </span>
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-1.5 border-r border-black font-bold">PRD-1029</td>
                            <td className="p-1.5 border-r border-black">1 Unit</td>
                            <td className="p-1.5 border-r border-black font-bold">Rp 350.000</td>
                            <td className="p-1.5">
                              <span className="bg-yellow-300 text-black px-1.5 py-0.5 border border-black font-black text-[10px]">
                                NORMAL
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>✓ 100% Kasus Nyata Keuangan</span>
                      <span className="text-emerald-700 font-bold">Hasil: 100% Akurat</span>
                    </div>
                  </div>
                )}

                {/* 2. WORD TAB CONTENT */}
                {activeTab === "word" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                      <span className="font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 border border-black">
                        [ENGINE: MAIL MERGE OTOMATIS]
                      </span>
                      <span className="text-[11px] text-slate-500">Kop_Surat_Resmi.dotx</span>
                    </div>

                    <div className="p-3 bg-cyan-50 border-2 border-black space-y-2 text-[11px]">
                      <div className="border-b border-black pb-1.5 text-center font-bold text-black">
                        PT. TEKNOLOGI KARYA MANDIRI
                        <p className="text-[10px] text-slate-600 font-normal">Jl. Sudirman No. 45, Jakarta Pusat</p>
                      </div>
                      <p className="text-slate-800">
                        Kepada Yth. <br />
                        <strong className="bg-yellow-200 px-1 border border-black text-black">&lt;&lt;Nama_Karyawan&gt;&gt;</strong> di <strong className="bg-yellow-200 px-1 border border-black text-black">&lt;&lt;Divisi&gt;&gt;</strong>
                      </p>
                      <p className="text-slate-700 text-[10px]">
                        Dengan ini dinyatakan telah memenuhi standar kualifikasi administrasi kantor modern...
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>✓ Cetak 100 Surat dalam 1 Klik</span>
                      <span className="text-cyan-700 font-bold">Selesai 5 Detik</span>
                    </div>
                  </div>
                )}

                {/* 3. PPT TAB CONTENT */}
                {activeTab === "ppt" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 border border-black">
                        [SLIDE DESIGN: EXECUTIVE DECK]
                      </span>
                      <span className="text-[11px] text-slate-500">16:9 HD Master</span>
                    </div>

                    <div className="p-4 bg-slate-950 text-white border-2 border-black rounded-none space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-amber-400">
                        <span>SLIDE 01 // OVERVIEW</span>
                        <span>ANIMATION: SMOOTH</span>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        STRATEGI DIGITALISASI KERJA 2026
                      </h4>
                      <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center">
                        <div className="bg-slate-800 p-1.5 border border-amber-400/50">
                          <p className="text-amber-300 font-bold">85%</p>
                          <p className="text-[9px] text-slate-300">Efisiensi</p>
                        </div>
                        <div className="bg-slate-800 p-1.5 border border-amber-400/50">
                          <p className="text-amber-300 font-bold">0 Error</p>
                          <p className="text-[9px] text-slate-300">Rumus</p>
                        </div>
                        <div className="bg-slate-800 p-1.5 border border-amber-400/50">
                          <p className="text-amber-300 font-bold">10x</p>
                          <p className="text-[9px] text-slate-300">Kecepatan</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>✓ Desain Clean & Elegan</span>
                      <span className="text-amber-700 font-bold">Master Slide Ready</span>
                    </div>
                  </div>
                )}

                {/* 4. SERTIFIKAT TAB CONTENT */}
                {activeTab === "cert" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                      <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 border border-black">
                        [OFFICIAL_CREDENTIAL // VERIFIED]
                      </span>
                      <span className="text-[11px] text-slate-500">QR_ID: #GWA-88219</span>
                    </div>

                    <div className="p-3 bg-purple-50 border-2 border-black space-y-2 text-center">
                      <div className="inline-block bg-purple-500 text-white px-2 py-0.5 text-[10px] font-bold border border-black">
                        SERTIFIKAT KELULUSAN RESMI
                      </div>
                      <p className="text-[12px] font-black text-black">
                        GESIT WIDI ATMOKO
                      </p>
                      <p className="text-[10px] text-slate-700">
                        Telah Menyelesaikan Kursus: <strong>Paket Mahir Komputer Kantor</strong>
                      </p>
                      <div className="flex justify-center items-center gap-2 pt-1">
                        <span className="bg-emerald-300 text-black px-2 py-0.5 border border-black font-black text-[10px]">
                          GRADE: A (SANGAT BAIK)
                        </span>
                        <span className="bg-white text-black px-2 py-0.5 border border-black font-bold text-[10px]">
                          ✓ TERVERIFIKASI
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>✓ Sertifikat Fisik + Digital PDF</span>
                      <span className="text-purple-700 font-bold">Bisa Buat CV / CPNS</span>
                    </div>
                  </div>
                )}

                {/* Bottom interactive click guide */}
                <div className="mt-3 pt-2.5 border-t-2 border-black flex items-center justify-between text-[11px] bg-yellow-50 -mx-4 -mb-4 p-2.5 px-4 border-b-0">
                  <span className="flex items-center gap-1.5 text-black font-bold">
                    <MousePointerClick className="w-3.5 h-3.5 text-orange-600" />
                    <span>Klik tab di atas untuk menguji materi praktik</span>
                  </span>
                  <span className="font-bold text-orange-600">[LIVE SIMULATOR]</span>
                </div>

              </div>

            </div>

            {/* Floating Badge Bottom Left */}
            {floatingBadgeLeftTitle && (
              <div className="absolute -bottom-5 -left-4 bg-yellow-300 border-2 border-black p-2.5 shadow-[4px_4px_0px_0px_#000] z-20 font-mono text-xs hidden sm:flex items-center gap-2">
                <span className="text-base">🏆</span>
                <div>
                  <p className="text-[10px] text-slate-800 font-bold uppercase">{floatingBadgeLeftTitle}</p>
                  <p className="font-black text-black text-sm leading-none">{floatingBadgeLeftValue}</p>
                </div>
              </div>
            )}

            {/* Floating Badge Top Right */}
            {floatingBadgeRightText && (
              <div className="absolute -top-5 -right-3 bg-emerald-400 border-2 border-black p-2 shadow-[3px_3px_0px_0px_#000] z-20 font-mono text-[11px] hidden sm:flex items-center gap-1.5 text-black font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>{floatingBadgeRightText}</span>
              </div>
            )}

          </div>
          
        </div>
      </div>
    </section>
  );
}
