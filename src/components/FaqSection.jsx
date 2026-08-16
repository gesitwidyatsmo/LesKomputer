"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Terminal, MessageCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Saya benar-benar awam dan belum pernah menyentuh komputer. Apakah bisa ikut?",
      a: "Tentu sangat bisa! Kurikulum kami dimulai dari cara penggunaan dasar, pengenalan keyboard shortcuts, hingga logika penggunaan software secara bertahap. Dengan konsep maksimal 5 siswa per sesi, mentor akan memandu Anda secara personal step-by-step tanpa perlu merasa malu atau tertinggal."
    },
    {
      q: "Apakah jadwal belajarnya fleksibel jika saya seorang pekerja atau mahasiswa?",
      a: "Ya! Kami menyediakan pilihan shift belajar yang fleksibel: Shift Pagi (08.30 - 10.30 WIB), Shift Siang (13.30 - 15.30 WIB), Shift Sore (16.00 - 18.00 WIB), dan Shift Malam (19.00 - 21.00 WIB). Anda juga bisa berkonsultasi untuk penyesuaian jadwal khusus."
    },
    {
      q: "Apakah saya perlu membawa laptop sendiri saat kelas berlangsung?",
      a: "Tidak perlu repot! Kami sudah menyediakan 5 unit komputer PC berspesifikasi tinggi lengkap dengan software Microsoft Office berlisensi di lab belajar ber-AC. Anda cukup datang dan fokus belajar."
    },
    {
      q: "Apakah lulusan akan mendapatkan sertifikat resmi?",
      a: "Ya! Setelah menyelesaikan modul dan lulus ujian proyek praktik, Anda akan menerima Sertifikat Fisik Resmi ber-QR Code serta E-Sertifikat Digital (PDF) berstempel resmi yang dapat dilampirkan untuk melamar kerja di perusahaan swasta, BUMN, maupun berkas instansi."
    },
    {
      q: "Bagaimana jika ada materi yang belum saya pahami setelah sesi selesai?",
      a: "Kami memberikan Garansi Bimbingan Sampai Bisa. Anda berhak mendapatkan sesi konsultasi & asistensi tambahan dengan mentor serta akses materi pada portal siswa secara gratis tanpa dipungut biaya tambahan."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FFFDF5] border-b-3 border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-rose-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> [KNOWLEDGE_BASE // FAQ]
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4 uppercase">
            PERTANYAAN UMUM <br />
            <span className="bg-rose-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
              SEPUTAR KELAS & FASILITAS
            </span>
          </h2>
          
          <p className="text-base sm:text-lg font-medium text-slate-700 mt-4 leading-relaxed">
            Punya pertanyaan sebelum mendaftar? Temukan jawabannya di bawah ini atau tanyakan langsung ke admin kami.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg transition-colors cursor-pointer select-none ${
                    isOpen ? "bg-amber-300 text-black border-b-2 border-black" : "bg-white text-black hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-black text-white px-2 py-0.5 border border-black shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <span className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-black" /> : <ChevronDown className="w-4 h-4 text-black" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 bg-[#FFFDF5] text-sm sm:text-base font-medium text-slate-800 leading-relaxed border-t-0 animate-in fade-in duration-150">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Contact Box */}
        <div className="mt-12 p-6 bg-cyan-100 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-black text-lg text-black">
              Masih Ada Pertanyaan Lain?
            </h4>
            <p className="text-sm font-medium text-slate-800">
              Tim admin & mentor kami siap menjawab konsultasi kebutuhan belajar Anda.
            </p>
          </div>
          <a
            href="https://wa.me/6280000000000?text=Halo%20Admin%20GWA,%20saya%20ingin%20tanya-tanya%20seputar%20kursus."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat Admin WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
