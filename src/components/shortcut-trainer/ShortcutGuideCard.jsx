"use client";

import { useState } from "react";
import { 
  Keyboard, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb,
  Hand,
  Layers,
  Zap
} from "lucide-react";

export default function ShortcutGuideCard() {
  const [activeTab, setActiveTab] = useState("cheatSheet"); // "cheatSheet" | "posisiJari" | "tipsNinja"

  const SHORTCUT_TABLE = [
    { key: "Ctrl + S", desc: "Simpan (Save) dokumen saat ini", cat: "Dasar / Office" },
    { key: "Ctrl + Z", desc: "Undo (batalkan perintah terakhir)", cat: "Dasar / Office" },
    { key: "Ctrl + Y", desc: "Redo (ulangi aksi yang dibatalkan)", cat: "Dasar / Office" },
    { key: "Ctrl + A", desc: "Pilih semua (Select All) teks/file", cat: "Dasar / Office" },
    { key: "Ctrl + C / V", desc: "Salin (Copy) dan Tempel (Paste)", cat: "Dasar / Office" },
    { key: "Ctrl + X", desc: "Potong (Cut) teks atau objek", cat: "Dasar / Office" },
    { key: "Ctrl + B / I / U", desc: "Tebal (Bold), Miring (Italic), Garis Bawah", cat: "Format Teks" },
    { key: "Ctrl + ➔ / ⬅", desc: "Lompat kursor per kata ke depan/belakang", cat: "Navigasi Kursor" },
    { key: "Ctrl + Shift + ➔", desc: "Blok 1 kata di sebelah kanan kursor", cat: "Navigasi Kursor" },
    { key: "Shift + End / Home", desc: "Blok hingga akhir atau awal baris", cat: "Navigasi Kursor" },
    { key: "Ctrl + Backspace", desc: "Hapus 1 kata ke belakang sekaligus", cat: "Navigasi Kursor" },
    { key: "Ctrl + F", desc: "Cari (Find) kata di dokumen / browser", cat: "Office & Navigasi" },
    { key: "Ctrl + K", desc: "Sisipkan tautan link (Hyperlink)", cat: "Office & Web" },
    { key: "Ctrl + H", desc: "Cari & Ganti (Find and Replace) kata", cat: "Office" },
    { key: "Ctrl + E", desc: "Format paragraf teks rata tengah (Center)", cat: "Format Teks" },
    { key: "Ctrl + Enter", desc: "Page Break / Buat halaman baru seketika", cat: "Format Dokumen" },
  ];

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
      {/* Header Bar */}
      <div className="bg-black text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-3 border-black select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-400 text-black border-2 border-white rounded-lg flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_#fff]">
            ⌨️
          </div>
          <div>
            <h2 className="font-heading font-black text-base text-amber-300 tracking-wide uppercase">
              Panduan & Lembar Contekan Shortcut
            </h2>
            <p className="text-[11px] font-mono text-slate-300">
              Kuasai Kombinasi Tombol Ctrl, Alt, Shift, & Win
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-700 rounded-lg">
          <button
            onClick={() => setActiveTab("cheatSheet")}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              activeTab === "cheatSheet"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            📋 Tabel Shortcut
          </button>
          <button
            onClick={() => setActiveTab("posisiJari")}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              activeTab === "posisiJari"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            ✋ Posisi Jari
          </button>
          <button
            onClick={() => setActiveTab("tipsNinja")}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
              activeTab === "tipsNinja"
                ? "bg-amber-400 text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            ⚡ Tips Efisiensi
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5 sm:p-6 bg-[#FFFDF5]">
        {activeTab === "cheatSheet" && (
          <div className="space-y-4">
            <p className="text-xs font-mono text-slate-600">
              Berikut adalah daftar kombinasi tuts pengubah yang paling sering digunakan dalam dunia kerja profesional:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SHORTCUT_TABLE.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <kbd className="px-2 py-0.5 bg-amber-200 border border-black rounded font-mono font-black text-xs text-black">
                      {item.key}
                    </kbd>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                      {item.cat}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "posisiJari" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-300 border border-black rounded font-mono text-xs font-black">
                  TANGAN KIRI
                </span>
                <h3 className="font-heading font-black text-base text-black">
                  Kelingking & Jempol Kiri (Modifier)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Kelingking Kiri:</strong> Tuts `Ctrl` kiri dan `Shift` kiri dikendalikan oleh kelingking kiri. Jangan gunakan telunjuk untuk menekan Ctrl!
                </li>
                <li>
                  <strong>Jempol Kiri:</strong> Bertugas menekan tombol `Alt` kiri dan `Windows Key`.
                </li>
                <li>
                  <strong>Jari Lainnya:</strong> Jari manis menekan `S`, `Z`, `A`, telunjuk menekan `C`, `V`, `F`, `B`.
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-300 border border-black rounded font-mono text-xs font-black">
                  TANGAN KANAN
                </span>
                <h3 className="font-heading font-black text-base text-black">
                  Navigasi & Seleksi Teks
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Jari Tangan Kanan:</strong> Bertugas mengontrol tombol panah (`➔`, `⬅`, `▲`, `▼`), serta tombol `Home` dan `End`.
                </li>
                <li>
                  <strong>Kombinasi Dua Tangan:</strong> Tangan kiri menahan `Ctrl + Shift`, tangan kanan menekan panah `➔` untuk memblok kata demi kata secara kilat.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "tipsNinja" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2">
                <div className="inline-block p-1 bg-amber-300 border border-black rounded font-mono text-[11px] font-black">
                  TIPS 1
                </div>
                <h4 className="font-heading font-black text-sm text-black">
                  Hindari Raih Mouse untuk Tugas Kecil
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menggerakkan tangan dari keyboard ke mouse hanya untuk memindahkan kursor 2 kata membuang 2-3 detik. Gunakan <strong>Ctrl + Panah</strong>!
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2">
                <div className="inline-block p-1 bg-emerald-300 border border-black rounded font-mono text-[11px] font-black">
                  TIPS 2
                </div>
                <h4 className="font-heading font-black text-sm text-black">
                  Hapus Kata Instan
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jangan menahan tombol Backspace sampai 10 kali untuk menghapus kata yang salah. Cukup tekan <strong>Ctrl + Backspace</strong> satu kali!
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2">
                <div className="inline-block p-1 bg-cyan-300 border border-black rounded font-mono text-[11px] font-black">
                  TIPS 3
                </div>
                <h4 className="font-heading font-black text-sm text-black">
                  Refleks Rutin Menyimpan
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jadikan <strong>Ctrl + S</strong> sebagai kebiasaan refleks setiap kali Anda selesai menulis satu paragraf agar pekerjaan tidak pernah hilang.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
