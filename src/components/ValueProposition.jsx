"use client";

import { Zap, BrainCircuit, Wrench, Terminal } from "lucide-react";

export default function ValueProposition({ data }) {
  const showBadge = data?.showBadge !== false;
  const badgeText = data?.badgeText || "[FILOSOFI INTI GWA TECH]";
  const titlePrefix = data?.titlePrefix || "Bukan Sekadar Belajar Mengetik.";
  const titleHighlight = data?.titleHighlight || "Kami Membentuk Mindset Solutif.";
  const description = data?.description || "Tiga pilar kurikulum GWA dirancang khusus agar Anda tidak hanya sekadar bisa, tapi unggul dan tangkas saat bekerja di kantor atau menjalankan bisnis.";
  
  const iconList = [
    <Zap key="1" className="w-8 h-8 text-black" />,
    <BrainCircuit key="2" className="w-8 h-8 text-black" />,
    <Wrench key="3" className="w-8 h-8 text-black" />
  ];

  const defaultValues = [
    {
      id: "gesit",
      isVisible: true,
      code: "SYS_VAL // 01",
      title: "Gesit",
      subtitle: "Shortcut & Efisiensi Waktu",
      desc: "Kuasai puluhan jalan pintas keyboard (shortcuts), trik cepat navigasi, dan automasi tugas berulang. Bereskan pekerjaan harian berjam-jam hanya dalam beberapa menit tanpa lembur.",
      tag: "#SPEED_&_PRODUCTIVITY",
      accentColor: "bg-orange-500",
      lightBg: "bg-[#FFF7ED]",
      headerFile: "sys_speed_booster.bin",
      points: [
        "Shortcut esensial Word, Excel & PPT",
        "Trik navigasi data ribuan baris",
        "Automasi format & template dokumen"
      ]
    },
    {
      id: "wawasan",
      isVisible: true,
      code: "SYS_VAL // 02",
      title: "Wawasan",
      subtitle: "Logika Rumus & Problem Solving",
      desc: "Bukan sekadar hafalan tombol yang mudah dilupakan. Kami ajarkan cara komputer berpikir dan merangkai logika rumus (IF, VLOOKUP, INDEX MATCH) agar Anda mandiri memecahkan segala kendala data.",
      tag: "#LOGIC_NOT_MEMORIZATION",
      accentColor: "bg-cyan-400",
      lightBg: "bg-[#ECFEFF]",
      headerFile: "sys_logic_core.dll",
      points: [
        "Bedah logika rumus komputasi",
        "Teknik mengatasi error (#N/A, #VALUE!)",
        "Struktur data & manajemen file rapi"
      ]
    },
    {
      id: "aplikatif",
      isVisible: true,
      code: "SYS_VAL // 03",
      title: "Aplikatif",
      subtitle: "100% Studi Kasus Dunia Kerja",
      desc: "Langsung terjun ke simulasi riil: Pembuatan Faktur Kasir Toko, Slip Gaji Karyawan, Laporan Keuangan Neraca, Surat Undangan Massal Mail Merge, hingga Slide Presentasi Laporan Manajemen.",
      tag: "#REAL_WORLD_CASE_STUDIES",
      accentColor: "bg-emerald-400",
      lightBg: "bg-[#ECFDF5]",
      headerFile: "sys_real_world.dat",
      points: [
        "Studi kasus nyata bisnis & kantor",
        "Bahan latihan riil format resmi",
        "Portofolio hasil kerja siap pakai"
      ]
    }
  ];

  const rawValues = data?.items || defaultValues;
  const values = rawValues.filter((v) => v.isVisible !== false);

  return (
    <section id="keunggulan" className="py-20 lg:py-28 bg-[#FFFDF5] border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {showBadge && badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-amber-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] mb-4">
              <Terminal className="w-3.5 h-3.5" /> {badgeText}
            </div>
          )}
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4 uppercase">
            {titlePrefix} <br />
            {titleHighlight && (
              <span className="bg-amber-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
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

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <div 
              key={val.id || idx} 
              className={`${val.lightBg || "bg-[#FFF7ED]"} border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[9px_9px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
            >
              {/* Retro Window Header */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black"></div>
                  <span className="text-[11px] text-amber-300 font-mono">{val.headerFile || "sys_module.bin"}</span>
                </div>
                <span className="text-[10px] text-slate-300">{val.code || `SYS_VAL // 0${idx+1}`}</span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Icon & Tag */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`${val.accentColor || "bg-orange-500"} w-14 h-14 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center group-hover:rotate-3 transition-transform`}>
                      {iconList[idx % iconList.length]}
                    </div>
                    {val.tag && (
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-white border border-black px-2 py-1 shadow-[1.5px_1.5px_0px_0px_#000]">
                        {val.tag}
                      </span>
                    )}
                  </div>

                  {/* Titles */}
                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-black mb-1">
                    {val.title}
                  </h3>
                  {val.subtitle && (
                    <p className="font-mono text-xs font-bold text-slate-600 uppercase mb-4 tracking-wide">
                      // {val.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm font-medium text-slate-800 leading-relaxed mb-6">
                    {val.desc}
                  </p>
                </div>

                {/* Feature Points list */}
                {val.points && val.points.length > 0 && (
                  <div className="pt-4 border-t-2 border-black/20 space-y-2 font-mono text-xs">
                    {val.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-slate-900 font-bold">
                        <span className="w-4 h-4 bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          ✓
                        </span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Bottom Strip Accent */}
              <div className={`h-2 border-t-2 border-black ${val.accentColor || "bg-orange-500"}`}></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
