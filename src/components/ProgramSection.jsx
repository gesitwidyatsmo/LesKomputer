"use client";

import { 
  FileText, 
  Table, 
  Presentation, 
  Layers, 
  Clock, 
  BookOpen,
  Terminal
} from "lucide-react";
import { useState, useEffect } from "react";

import { formatWhatsAppUrl } from "@/lib/landingService";

export default function ProgramSection({ data, globalWhatsapp }) {
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showBadge = data?.showBadge !== false;
  const badgeText = data?.badgeText || "[CURRICULUM_MATRIX // 2026]";
  const titlePrefix = data?.titlePrefix || "PILIH MODUL KEAHLIAN";
  const titleHighlight = data?.titleHighlight || "SESUAI TARGET KARIR ANDA";
  const description = data?.description || "Setiap modul dirancang dari level dasar hingga mahir dengan kurikulum berbasis proyek nyata. Anda juga bisa mengambil paket lengkap 3-in-1 dengan potongan harga khusus.";

  const showPromoBanner = data?.showPromoBanner !== false;
  const promoBadge = data?.promoBadge || "🔥 PAKET KOMPLIT ALL-IN-ONE";
  const promoTitle = data?.promoTitle || "Paket Mahir Komputer Kantor (Word + Excel + PPT)";
  const promoDesc = data?.promoDesc || "Ambil 3 modul sekaligus untuk penguasaan total administrasi kantor & bisnis. Dapatkan diskon spesial, modul cetak eksklusif, serta garansi bimbingan sampai mahir!";
  const promoButtonText = data?.promoButtonText || "KLAIM PROMO PAKET 3-IN-1";
  const promoWhatsappMessage = data?.promoWhatsappMessage || "Halo Admin GWA, saya tertarik dengan Paket Komplit 3-in-1 (Word+Excel+PPT).";

  const promoWaLink = formatWhatsAppUrl(globalWhatsapp, promoWhatsappMessage);

  const defaultPrograms = [
    {
      id: "word",
      code: "MODUL_01 // WORD",
      title: "Microsoft Word Master",
      subtitle: "Dokumen Resmi, Surat Massal & Administrasi",
      desc: "Kuasai pembuatan surat dinas resmi, proposal berstandar, format penomoran halaman otomatis, Mail Merge 100+ surat dalam sekejap, dan tata letak dokumen profesional tanpa berantakan.",
      windowHeader: "01_ms_word_master.exe",
      badgeText: "ESENSIAL KANTOR",
      badgeColor: "bg-cyan-300 text-black",
      accentBg: "bg-cyan-400",
      lightBg: "bg-[#ECFEFF]",
      duration: "8 Sesi Pertemuan (16 Jam Praktik)",
      tags: ["[MAIL MERGE]", "[LAYOUT SURAT]", "[DAFTAR ISI OTOMATIS]", "[TABEL & TABULASI]", "[HEADER / FOOTER]"],
      kurikulum: [
        { session: "Sesi 01-02", topic: "Pengenalan Antarmuka, Shortcuts Cepat, & Format Tipografi Rapi" },
        { session: "Sesi 03-04", topic: "Page Setup, Margin Standar Dinas, Indentasi, & Tabulasi Angka" },
        { session: "Sesi 05-06", topic: "Mail Merge (Cetak Surat Undangan, Sertifikat, & Amplop Massal)" },
        { session: "Sesi 07", topic: "Pembuatan Makalah, Proposal, Daftar Isi & Gambar Otomatis (Heading Styles)" },
        { session: "Sesi 08", topic: "Ujian Praktik Proyek Administrasi & Evaluasi Kelulusan" }
      ],
      targetHasil: "Mampu membuat dokumen kantor resmi, proposal bebas format berantakan, serta mencetak surat dinas massal dalam hitungan menit."
    },
    {
      id: "excel",
      code: "MODUL_02 // EXCEL",
      title: "Microsoft Excel Expert",
      subtitle: "Logika Rumus, Kasir & Analisis Data",
      desc: "Program paling favorit! Dari nol hingga menguasai logika rumus IF bercabang, VLOOKUP/XLOOKUP, sistem kasir toko, slip gaji, laporan keuangan bulanan, hingga Pivot Table dan grafik interaktif.",
      windowHeader: "02_ms_excel_expert.exe",
      badgeText: "⭐ PALING DIMINATI",
      badgeColor: "bg-emerald-400 text-black",
      accentBg: "bg-emerald-500",
      lightBg: "bg-[#ECFDF5]",
      duration: "10 Sesi Pertemuan (20 Jam Praktik)",
      tags: ["[VLOOKUP / XLOOKUP]", "[LOGIKA IF/AND/OR]", "[PIVOT TABLE]", "[SISTEM KASIR]", "[CHART & DASHBOARD]"],
      kurikulum: [
        { session: "Sesi 01-02", topic: "Format Cell Akuntansi, Data Validation, & Rumus Matematika/Statistik Dasar (SUM, AVERAGE, COUNTIF)" },
        { session: "Sesi 03-04", topic: "Penguasaan Logika Lanjut (IF Tunggal, IF Bertingkat/Nested, AND, OR, IFS)" },
        { session: "Sesi 05-06", topic: "Pencarian Data Presisi (VLOOKUP, HLOOKUP, XLOOKUP, INDEX MATCH)" },
        { session: "Sesi 07-08", topic: "Studi Kasus Nyata: Pembuatan Sistem Kasir Toko & Laporan Penggajian Karyawan" },
        { session: "Sesi 09", topic: "Pivot Table, Slicer, dan Visualisasi Chart Laporan Keuangan" },
        { session: "Sesi 10", topic: "Simulasi Ujian Kasus Riil Akuntansi/Administrasi & Uji Kompetensi" }
      ],
      targetHasil: "Mahir merancang spreadsheet cerdas tanpa error, mengotomasi perhitungan data ribuan baris, dan membuat laporan keuangan siap pakai."
    },
    {
      id: "powerpoint",
      code: "MODUL_03 // PPT",
      title: "Microsoft PowerPoint Pro",
      subtitle: "Desain Presentasi Eksekutif & Animasi Visual",
      desc: "Ubah presentasi membosankan jadi memukau dan profesional. Pelajari prinsip visual hierarchy, Master Slide, infografis visual, animasi transisi smooth (Morph), dan teknik penyampaian ide persuasif.",
      windowHeader: "03_ms_powerpoint_pro.exe",
      badgeText: "VISUAL & PITCHING",
      badgeColor: "bg-amber-300 text-black",
      accentBg: "bg-amber-400",
      lightBg: "bg-[#FEFCE8]",
      duration: "6 Sesi Pertemuan (12 Jam Praktik)",
      tags: ["[MASTER SLIDE]", "[ANIMASI MORPH]", "[INFOGRAFIS]", "[VISUAL STORYTELLING]", "[EXPORT VIDEO/PDF]"],
      kurikulum: [
        { session: "Sesi 01-02", topic: "Prinsip Desain Slide Modern, Tipografi, Palet Warna Kontras, & Layout Grid" },
        { session: "Sesi 03-04", topic: "Master Slide Setup, Pembuatan Infografis, Iconography, & SmartArt Visual" },
        { session: "Sesi 05", topic: "Animasi Profesional & Transisi Elegan (Morph Effect, Video & Audio Embed)" },
        { session: "Sesi 06", topic: "Proyek Akhir: Desain Pitch Deck Bisnis / Laporan Rapat & Ujian Praktik" }
      ],
      targetHasil: "Mampu merancang slide presentasi kelas eksekutif yang memukau audiens, rapi secara visual, dan memperkuat pesan presentasi."
    }
  ];

  const iconMap = {
    word: <FileText className="w-8 h-8 text-black" />,
    excel: <Table className="w-8 h-8 text-black" />,
    powerpoint: <Presentation className="w-8 h-8 text-black" />
  };

  const rawPrograms = data?.items || defaultPrograms;
  const programs = rawPrograms.filter((p) => p.isVisible !== false);

  const currentProgram = activeModal ? (programs.find(p => p.id === activeModal) || defaultPrograms.find(p => p.id === activeModal)) : null;

  return (
    <section id="program" className="py-20 lg:py-28 bg-[#FFFDF5] border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {showBadge && badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-emerald-400 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] mb-4">
              <Terminal className="w-3.5 h-3.5" /> {badgeText}
            </div>
          )}
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4 uppercase">
            {titlePrefix} <br />
            {titleHighlight && (
              <span className="bg-emerald-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
                {titleHighlight}
              </span>
            )}
          </h2>
          
          {description && (
            <p className="text-base sm:text-lg font-medium text-slate-700 mt-4 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* 3 Course Window Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div 
              key={prog.id} 
              className={`${prog.lightBg || "bg-[#ECFEFF]"} border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[9px_9px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
            >
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black"></span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-mono tracking-wide">{prog.windowHeader || `${prog.id}.exe`}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">[READY]</span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Badge & Duration */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className={`font-mono text-[10px] font-black uppercase px-2 py-1 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] ${prog.badgeColor || "bg-cyan-300 text-black"}`}>
                      {prog.badgeText || "KURSUS"}
                    </span>
                    {prog.duration && (
                      <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 border border-black">
                        <Clock className="w-3 h-3 text-black" />
                        <span>{prog.duration.split(" ")[0]} Sesi</span>
                      </div>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${prog.accentBg || "bg-cyan-400"} w-12 h-12 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex items-center justify-center shrink-0`}>
                      {iconMap[prog.id] || <FileText className="w-8 h-8 text-black" />}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-black text-black leading-tight">
                        {prog.title}
                      </h3>
                      {prog.subtitle && (
                        <p className="font-mono text-[11px] font-bold text-slate-600 uppercase">
                          {prog.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-medium text-slate-800 leading-relaxed mb-5">
                    {prog.desc}
                  </p>

                  {/* Hardware / Skill Chips */}
                  {prog.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {prog.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="font-mono text-[10px] font-bold bg-white text-black border border-black px-1.5 py-0.5 shadow-[1px_1px_0px_0px_#000]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div>
                  <button 
                    onClick={() => setActiveModal(prog.id)}
                    className="w-full py-3 px-4 bg-white hover:bg-black hover:text-amber-300 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Lihat Silabus Lengkap &gt;</span>
                  </button>
                </div>

              </div>

              {/* Bottom Strip Accent */}
              <div className={`h-2 border-t-2 border-black ${prog.accentBg || "bg-cyan-400"}`}></div>
            </div>
          ))}
        </div>

        {/* 3-in-1 Bundle Promo Card */}
        {showPromoBanner && promoTitle && (
          <div className="mt-12 bg-amber-300 border-3 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="px-3.5 py-2.5 bg-black text-amber-300 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] flex flex-col items-center justify-center font-mono font-black shrink-0 hidden sm:flex leading-none text-center">
                <span className="text-base tracking-tight text-amber-300">3-IN-1</span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">BUNDLE</span>
              </div>
              <div>
                {promoBadge && (
                  <div className="inline-block bg-black text-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase mb-1.5 shadow-[1px_1px_0px_0px_#000]">
                    {promoBadge}
                  </div>
                )}
                <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-black text-black leading-snug">
                  {promoTitle}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-900 mt-1.5 max-w-2xl leading-relaxed">
                  {promoDesc}
                </p>
              </div>
            </div>

            <a 
              href={promoWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs sm:text-sm font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap shrink-0 flex items-center gap-2 self-stretch sm:self-auto justify-center"
            >
              <span>&gt;_</span> {promoButtonText}
            </a>
          </div>
        )}

      </div>

      {/* Neobrutalist Curriculum Modal */}
      {activeModal && currentProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setActiveModal(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-[#FFFDF5] border-3 border-black shadow-[10px_10px_0px_0px_#000] w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-150 flex flex-col">
            
            {/* Modal Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-3 border-black select-none sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 border border-black"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-black"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-black"></span>
                </div>
                <span className="text-amber-300 font-mono">sys_curriculum_viewer.exe</span>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-white hover:text-rose-400 font-mono font-bold text-sm px-1.5 py-0.5 border border-white/40 hover:border-rose-400 cursor-pointer"
              >
                [X] ESC
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Info */}
              <div className="border-b-2 border-dashed border-black pb-5">
                <span className="font-mono text-xs font-bold text-slate-600 bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_#000]">
                  {currentProgram.code}
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-black mt-2">
                  {currentProgram.title}
                </h3>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  {currentProgram.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-3 font-mono text-xs text-slate-800">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-bold">{currentProgram.duration}</span>
                </div>
              </div>

              {/* Target Outcome */}
              {currentProgram.targetHasil && (
                <div className="p-4 bg-emerald-50 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                  <p className="font-mono text-xs font-bold text-emerald-800 uppercase mb-1">
                    🎯 Target Kelulusan & Hasil Belajar:
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {currentProgram.targetHasil}
                  </p>
                </div>
              )}

              {/* Syllabus Breakdown Table */}
              {currentProgram.kurikulum && (
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-black mb-3">
                    [SILABUS PER PERTEMUAN // PRAKTIK 100%]
                  </h4>
                  <div className="border-2 border-black divide-y-2 divide-black bg-white">
                    {currentProgram.kurikulum.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-start gap-3 text-xs sm:text-sm">
                        <span className="font-mono font-bold bg-black text-amber-300 px-2 py-0.5 text-[11px] shrink-0">
                          {item.session}
                        </span>
                        <span className="font-medium text-slate-900 leading-snug">
                          {item.topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a 
                  href={formatWhatsAppUrl(globalWhatsapp, `Halo Admin GWA, saya ingin mendaftar kelas ${currentProgram.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-4 bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs sm:text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>&gt;_</span> DAFTAR KELAS INI SEKARANG
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="py-3.5 px-6 bg-white hover:bg-slate-200 text-black font-mono text-xs sm:text-sm font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
