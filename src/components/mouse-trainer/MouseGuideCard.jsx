"use client";

import { useState } from "react";
import { 
  MousePointer2, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Lightbulb,
  Mouse,
  Move,
  Eye,
  Sliders
} from "lucide-react";

export default function MouseGuideCard() {
  const [activeTab, setActiveTab] = useState("anatomi"); // "anatomi" | "tips" | "tahapan"

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
      {/* Header Bar */}
      <div className="bg-black text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-3 border-black select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-400 text-black border-2 border-white rounded-lg flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_#fff]">
            💡
          </div>
          <div>
            <h2 className="font-heading font-black text-base text-amber-300 tracking-wide uppercase">
              Panduan & Tips Menggunakan Mouse
            </h2>
            <p className="text-[11px] font-mono text-slate-300">
              Keterampilan Dasar Mengoperasikan Komputer
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-700 rounded-lg">
          <button
            onClick={() => setActiveTab("anatomi")}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              activeTab === "anatomi"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            🖱️ Anatomi Mouse
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              activeTab === "tips"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            ⚡ Tips Kelancaran
          </button>
          <button
            onClick={() => setActiveTab("tahapan")}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              activeTab === "tahapan"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            🎯 6 Tahap Latihan
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 bg-[#FFFDF5]">
        {activeTab === "anatomi" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Mouse Diagram */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <div className="relative w-44 h-64 bg-slate-100 border-3 border-black rounded-[48px] shadow-[4px_4px_0px_0px_#000] p-2 flex flex-col items-center">
                {/* Mouse Buttons split */}
                <div className="w-full h-24 grid grid-cols-2 gap-1 mb-1">
                  {/* Left Button */}
                  <div className="bg-cyan-300 border-2 border-black rounded-tl-[36px] flex flex-col items-center justify-center p-1 hover:bg-cyan-200 transition-colors">
                    <span className="font-heading font-black text-xs text-black">KLIK KIRI</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 text-center">Jari Telunjuk</span>
                  </div>
                  {/* Right Button */}
                  <div className="bg-amber-300 border-2 border-black rounded-tr-[36px] flex flex-col items-center justify-center p-1 hover:bg-amber-200 transition-colors">
                    <span className="font-heading font-black text-xs text-black">KLIK KANAN</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 text-center">Jari Tengah</span>
                  </div>
                </div>

                {/* Scroll Wheel in center */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-5 h-10 bg-slate-900 border-2 border-white rounded-full flex flex-col items-center justify-between py-1 shadow-inner">
                  <div className="w-3 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-[8px] text-white font-mono font-bold">SCROLL</span>
                  <div className="w-3 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                </div>

                {/* Mouse Body */}
                <div className="w-full flex-1 bg-slate-200 border-2 border-black rounded-b-[36px] flex flex-col items-center justify-center p-2 text-center">
                  <Mouse className="w-6 h-6 text-slate-700 mb-1" />
                  <span className="text-[11px] font-heading font-black text-slate-800">
                    TELAPAK TANGAN
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    Menopang santai di atas bodi mouse
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs font-mono font-bold text-slate-700 text-center">
                👉 Posisi Pegangan Mouse Standar 2-Tombol + Scroll
              </p>
            </div>

            {/* Explanations */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="bg-cyan-50 border-2 border-black p-3.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan-400 border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-[1px_1px_0px_0px_#000]">
                  1
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-black">
                    Tombol Kiri (Left Click) — Fungsi Utama
                  </h3>
                  <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                    Digunakan untuk <strong>memilih objek, tombol, atau ikon</strong>, membuka menu, mengklik tautan, dan menyorot teks. Tekan menggunakan <strong>ujung jari telunjuk</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-black p-3.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-amber-400 border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-[1px_1px_0px_0px_#000]">
                  2
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-black">
                    Tombol Kanan (Right Click) — Menu Tambahan
                  </h3>
                  <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                    Digunakan untuk memunculkan <em>menu konteks (pilihan opsi ekstra)</em> seperti Copy, Paste, Rename, atau Properties. Tekan menggunakan <strong>jari tengah</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-black p-3.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-purple-300 border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-[1px_1px_0px_0px_#000]">
                  3
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-black">
                    Roda Gulir (Scroll Wheel) — Navigasi Layar
                  </h3>
                  <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                    Putar roda ke atas atau ke bawah menggunakan jari telunjuk untuk <strong>menggulung halaman dokumen/website yang panjang</strong> tanpa perlu menyeret scrollbar di samping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-2">
              <div className="flex items-center gap-2 text-rose-600 font-heading font-black text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>HAL PENTING SAAT BELAJAR MENGGUNAKAN MOUSE:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800 font-medium list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-black">Hindari mengklik sambil menggeser mouse:</strong> Pemula sering tidak sengaja menyeret mouse saat menekan tombol, sehingga klik tidak terbaca atau malah memindahkan file tanpa sengaja.
                </li>
                <li>
                  <strong className="text-black">Hentikan pointer sejenak:</strong> Arahkan kursor sampai tepat berada di atas target tombol/ikon sebelum jari menekan klik kiri.
                </li>
                <li>
                  <strong className="text-black">Jangan menekan terlalu keras:</strong> Cukup tekan tombol secara lembut dan santai sampai terdengar bunyi klik.
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-heading font-black text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>TIPS ERGONOMI & KESTABILAN TANGAN:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800 font-medium list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-black">Posisi Pergelangan:</strong> Letakkan pergelangan tangan di atas meja/mousepad sebagai tumpuan agar tangan tidak cepat pegal.
                </li>
                <li>
                  <strong className="text-black">Gunakan Mouse Fisik:</strong> Latih menggunakan mouse optik USB kabel/wireless untuk membiasakan tangan dengan presisi pointer komputer.
                </li>
                <li>
                  <strong className="text-black">Atur Sensitivitas:</strong> Pastikan kecepatan kursor di komputer terasa nyaman dan tidak terlalu cepat atau terlalu lambat.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "tahapan" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                step: 1,
                title: "Sorot Pointer (Hover)",
                desc: "Gerakkan kursor ke kotak target dan tahan selama 0.3 detik. Melatih kestabilan tangan.",
                color: "bg-red-200",
                badge: "Tahap 1",
              },
              {
                step: 2,
                title: "Klik Kiri (Single Click)",
                desc: "Arahkan kursor dan tekan tombol kiri mouse tepat pada kotak target.",
                color: "bg-blue-200",
                badge: "Tahap 2",
              },
              {
                step: 3,
                title: "Klik Kanan (Right Click)",
                desc: "Melatih penggunaan tombol kanan mouse dengan akurat pada kotak konteks.",
                color: "bg-amber-200",
                badge: "Tahap 3",
              },
              {
                step: 4,
                title: "Klik Ganda (Double Click)",
                desc: "Klik kiri 2 kali secara berurutan dan cepat untuk melatih ritme pembukaan file/folder.",
                color: "bg-purple-200",
                badge: "Tahap 4",
              },
              {
                step: 5,
                title: "Seret & Lepas (Drag & Drop)",
                desc: "Klik, tahan tombol, geser target ke zona drop, lalu lepaskan. Keterampilan kelola file.",
                color: "bg-emerald-200",
                badge: "Tahap 5",
              },
              {
                step: 6,
                title: "Gulir Layar (Scroll Wheel)",
                desc: "Gunakan roda mouse untuk menggulung layar ke atas/bawah dan temukan kotak tersembunyi.",
                color: "bg-cyan-200",
                badge: "Tahap 6",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border-2 border-black rounded-lg p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white font-mono text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border border-black rounded ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-sm text-black mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
