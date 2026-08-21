"use client";

import { useState } from "react";
import { 
  Keyboard, 
  Hand, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  BookOpen,
  Award,
  Layers
} from "lucide-react";

export default function TypingGuideCard() {
  const [activeTab, setActiveTab] = useState("posisi"); // "posisi" | "jari" | "tips" | "kurikulum"

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden select-none">
      {/* Top Header */}
      <div className="bg-black text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-3 border-black">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-cyan-400 text-black border-2 border-white rounded-lg flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_#fff]">
            ⌨️
          </div>
          <div>
            <h2 className="font-heading font-black text-base text-amber-300 tracking-wide uppercase">
              Panduan Mengetik 10 Jari (Touch Typing)
            </h2>
            <p className="text-[11px] font-mono text-slate-300">
              Teknik Baku Mengetik Cepat & Tepat Tanpa Melihat Keyboard
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-700 rounded-lg text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab("posisi")}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === "posisi"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            🏠 Baris Beranda (Home Row)
          </button>
          <button
            onClick={() => setActiveTab("jari")}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === "jari"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            🖐️ Pemetaan 10 Jari
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === "tips"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            ⚡ Tips & Ergonomi
          </button>
          <button
            onClick={() => setActiveTab("kurikulum")}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === "kurikulum"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            🎯 Alur Pembelajaran
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5 sm:p-6 bg-[#FFFDF5]">
        {/* Tab 1: Home Row */}
        {activeTab === "posisi" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Home Row Keyboard Illustration */}
            <div className="lg:col-span-6 bg-white border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
              <div className="text-center space-y-1">
                <span className="bg-amber-300 border border-black font-mono text-[10px] font-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] uppercase">
                  Posisi Rumah Dasar (Home Row)
                </span>
                <h3 className="font-heading font-black text-sm text-black">
                  Letakkan Jari Anda pada Tombol ASDF - JKL;
                </h3>
              </div>

              {/* Home Row Keys Visual */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {/* Left Hand Keys */}
                <div className="flex gap-1 bg-rose-50 border-2 border-rose-400 p-1.5 rounded-lg shadow-sm">
                  {[
                    { key: "A", finger: "Kelingking Kiri", color: "bg-rose-400 text-white" },
                    { key: "S", finger: "Manis Kiri", color: "bg-orange-400 text-black" },
                    { key: "D", finger: "Tengah Kiri", color: "bg-amber-300 text-black" },
                    { key: "F", finger: "Telunjuk Kiri", color: "bg-emerald-400 text-black", bump: true },
                  ].map((k) => (
                    <div key={k.key} className="flex flex-col items-center gap-1">
                      <div className={`w-9 h-11 sm:w-11 sm:h-13 ${k.color} border-2 border-black rounded-lg flex flex-col items-center justify-center font-mono font-black text-base shadow-[2px_2px_0px_0px_#000] relative`}>
                        {k.key}
                        {k.bump && (
                          <div className="w-3 h-0.5 bg-black rounded-full absolute bottom-1.5"></div>
                        )}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-700 text-center leading-tight">
                        {k.key}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Space separator */}
                <div className="text-slate-400 font-mono font-bold px-1 text-xs">
                  •••
                </div>

                {/* Right Hand Keys */}
                <div className="flex gap-1 bg-cyan-50 border-2 border-cyan-400 p-1.5 rounded-lg shadow-sm">
                  {[
                    { key: "J", finger: "Telunjuk Kanan", color: "bg-cyan-400 text-black", bump: true },
                    { key: "K", finger: "Tengah Kanan", color: "bg-blue-400 text-white" },
                    { key: "L", finger: "Manis Kanan", color: "bg-indigo-400 text-white" },
                    { key: ";", finger: "Kelingking Kanan", color: "bg-purple-400 text-white" },
                  ].map((k) => (
                    <div key={k.key} className="flex flex-col items-center gap-1">
                      <div className={`w-9 h-11 sm:w-11 sm:h-13 ${k.color} border-2 border-black rounded-lg flex flex-col items-center justify-center font-mono font-black text-base shadow-[2px_2px_0px_0px_#000] relative`}>
                        {k.key}
                        {k.bump && (
                          <div className="w-3 h-0.5 bg-black rounded-full absolute bottom-1.5"></div>
                        )}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-700 text-center leading-tight">
                        {k.key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacebar indicator */}
              <div className="flex flex-col items-center">
                <div className="w-48 sm:w-64 h-7 bg-slate-100 border-2 border-black rounded-md flex items-center justify-center font-mono text-[11px] font-bold text-slate-800 shadow-[2px_2px_0px_0px_#000]">
                  SPACE (Ibu Jari Kiri / Kanan)
                </div>
              </div>
            </div>

            {/* Explanation Details */}
            <div className="lg:col-span-6 space-y-3">
              <div className="bg-amber-50 border-2 border-black p-3.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-amber-400 border-2 border-black flex items-center justify-center font-black text-sm shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-black">
                    Tonjolan Jangkar Tombol F dan J
                  </h4>
                  <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                    Setiap keyboard standar memiliki tonjolan kecil (*tactile bump*) pada tombol <strong>F</strong> dan <strong>J</strong>. Gunakan kedua ujung jari telunjuk untuk meraba tonjolan ini agar jari Anda dapat menemukan posisi awal tanpa perlu menunduk melihat keyboard.
                  </p>
                </div>
              </div>

              <div className="bg-cyan-50 border-2 border-black p-3.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan-400 border-2 border-black flex items-center justify-center font-black text-sm shrink-0">
                  ↩️
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-black">
                    Selalu Kembali ke Baris Beranda
                  </h4>
                  <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                    Setelah menjangkau tombol di baris atas (misal huruf <code>E, R, T, U, I</code>) atau baris bawah (<code>C, V, B, N, M</code>), jari harus <strong>segera kembali</strong> beristirahat di baris beranda (Home Row).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Finger Mapping */}
        {activeTab === "jari" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                hand: "Tangan Kiri",
                finger: "Kelingking Kiri",
                color: "bg-rose-100 border-rose-500 text-rose-900",
                badgeBg: "bg-rose-500 text-white",
                keys: ["1", "Q", "A", "Z", "Tab", "Caps Lock", "Shift Kiri"],
              },
              {
                hand: "Tangan Kiri",
                finger: "Jari Manis Kiri",
                color: "bg-orange-100 border-orange-500 text-orange-900",
                badgeBg: "bg-orange-500 text-black",
                keys: ["2", "W", "S", "X"],
              },
              {
                hand: "Tangan Kiri",
                finger: "Jari Tengah Kiri",
                color: "bg-amber-100 border-amber-500 text-amber-900",
                badgeBg: "bg-amber-400 text-black",
                keys: ["3", "E", "D", "C"],
              },
              {
                hand: "Tangan Kiri",
                finger: "Telunjuk Kiri",
                color: "bg-emerald-100 border-emerald-500 text-emerald-900",
                badgeBg: "bg-emerald-500 text-white",
                keys: ["4", "5", "R", "T", "F", "G", "V", "B"],
              },
              {
                hand: "Tangan Kanan",
                finger: "Telunjuk Kanan",
                color: "bg-cyan-100 border-cyan-500 text-cyan-900",
                badgeBg: "bg-cyan-500 text-black",
                keys: ["6", "7", "Y", "U", "H", "J", "N", "M"],
              },
              {
                hand: "Tangan Kanan",
                finger: "Jari Tengah Kanan",
                color: "bg-blue-100 border-blue-500 text-blue-900",
                badgeBg: "bg-blue-500 text-white",
                keys: ["8", "I", "K", ","],
              },
              {
                hand: "Tangan Kanan",
                finger: "Jari Manis Kanan",
                color: "bg-indigo-100 border-indigo-500 text-indigo-900",
                badgeBg: "bg-indigo-500 text-white",
                keys: ["9", "O", "L", "."],
              },
              {
                hand: "Tangan Kanan",
                finger: "Kelingking Kanan",
                color: "bg-purple-100 border-purple-500 text-purple-900",
                badgeBg: "bg-purple-500 text-white",
                keys: ["0", "-", "=", "P", "[", "]", ";", "'", "/", "Enter", "Backspace"],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] bg-white flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${item.badgeBg}`}>
                      {item.finger}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {item.hand}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.keys.map((k) => (
                      <span
                        key={k}
                        className="px-2 py-1 bg-slate-100 border border-black rounded text-xs font-mono font-bold text-slate-900 shadow-[1px_1px_0px_0px_#000]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tips & Ergonomics */}
        {activeTab === "tips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-2.5">
              <div className="flex items-center gap-2 text-rose-700 font-heading font-black text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>ATURAN EMAS MENGETIK 10 JARI:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800 font-medium list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-black">DILARANG melihat keyboard fisik:</strong> Tatap layar monitor Anda. Keyboard virtual dan panduan tangan di layar sudah memberikan seluruh petunjuk tombol yang harus ditekan.
                </li>
                <li>
                  <strong className="text-black">Akurasi Dulu, Kecepatan Mengikuti:</strong> Jangan terburu-buru mengejar WPM tinggi di awal. Tekan tombol dengan ritme yang stabil dan akurat (95%+).
                </li>
                <li>
                  <strong className="text-black">Gunakan Jari yang Tepat:</strong> Jangan tergoda menggunakan jari telunjuk untuk semua tombol. Biarkan setiap jari belajar tugasnya masing-masing.
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-700 font-heading font-black text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>POSTUR DUDUK & ERGONOMI:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-800 font-medium list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-black">Posisi Punggung Tegak:</strong> Duduk bersandar dengan nyaman, pandangan lurus sejajar dengan bagian atas layar monitor.
                </li>
                <li>
                  <strong className="text-black">Pergelangan Mengambang Rileks:</strong> Jangan menempelkan telapak tangan terlalu berat ke meja saat mengetik. Biarkan jari melengkung rileks seperti memegang bola tenis.
                </li>
                <li>
                  <strong className="text-black">Latihan Rutin 10-15 Menit Sehari:</strong> Konsistensi harian jauh lebih efektif membangun memori otot dibanding latihan berjam-jam sekaligus.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Curriculum */}
        {activeTab === "kurikulum" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { level: 1, title: "Level 1: Jangkar F, J & Spasi", desc: "Mengenal tonjolan F & J serta ritme spasi.", badge: "Dasar" },
              { level: 2, title: "Level 2: Home Row D, K", desc: "Melatih jari tengah kiri (D) dan jari tengah kanan (K).", badge: "Home Row" },
              { level: 3, title: "Level 3: Home Row S, L", desc: "Melatih jari manis kiri (S) dan jari manis kanan (L).", badge: "Home Row" },
              { level: 4, title: "Level 4: Home Row A, ;", desc: "Melatih kelingking kiri (A) dan kelingking kanan (;).", badge: "Home Row" },
              { level: 5, title: "Level 5: Baris Atas E, I, R, U", desc: "Menjangkau baris atas dengan jari tengah & telunjuk.", badge: "Top Row" },
              { level: 6, title: "Level 6: Baris Atas T, Y, O, P", desc: "Menjangkau huruf vokal dan konsonan atas.", badge: "Top Row" },
              { level: 7, title: "Level 7: Baris Bawah V, M, C, ,", desc: "Menjangkau baris bawah keyboard.", badge: "Bottom Row" },
              { level: 8, title: "Level 8: Baris Bawah X, Z, ., /", desc: "Menjangkau tombol sudut bawah kiri dan kanan.", badge: "Bottom Row" },
              { level: 9, title: "Level 9: Kata Bahasa Indonesia", desc: "Mengetik kata-kata umum dalam bahasa Indonesia.", badge: "Kata Nyata" },
              { level: 10, title: "Level 10: Tes Kecepatan 1 Menit", desc: "Uji kecepatan WPM dan akurasi mengetik Anda!", badge: "Tantangan WPM" },
            ].map((c) => (
              <div
                key={c.level}
                className="bg-white border-2 border-black rounded-lg p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white font-mono text-xs font-bold flex items-center justify-center">
                      {c.level}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-black rounded bg-cyan-200">
                      {c.badge}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-xs text-black mb-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {c.desc}
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
