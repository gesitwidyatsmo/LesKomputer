import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TypingTrainerGame from "@/components/typing-trainer/TypingTrainerGame";
import TypingGuideCard from "@/components/typing-trainer/TypingGuideCard";
import { getLandingPageConfig, formatWhatsAppUrl } from "@/lib/landingService";
import Link from "next/link";
import { 
  ArrowLeft, 
  Keyboard, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Monitor
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Latihan Mengetik 10 Jari (Touch Typing) - Belajar Mengetik Cepat & Tepat",
  description: "Simulasi dan latihan mengetik 10 jari interaktif online gratis dengan keyboard visual, panduan tangan, dan pengukuran WPM realtime untuk pemula dan siswa kursus komputer.",
};

export default async function LatihanMengetikPage() {
  const { data: config } = await getLandingPageConfig();
  const globalSettings = config?.general?.content || {};
  const globalWhatsapp = globalSettings.whatsappNumber || "6280000000000";
  const brandName = globalSettings.brandName || "GWA.TECH";

  const waLink = formatWhatsAppUrl(
    globalWhatsapp,
    "Halo Admin GWA Tech, saya telah mencoba Simulasi Latihan Mengetik 10 Jari dan ingin bertanya info kursus komputer lebih lanjut."
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF5] text-slate-950">
      {/* Top Navbar */}
      <Navbar globalWhatsapp={globalWhatsapp} brandName={brandName} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* ── Breadcrumb & Top Hero Badge ────────────────── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-amber-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="bg-amber-300 border-2 border-black px-2.5 py-1 text-[11px] font-mono font-bold shadow-[2px_2px_0px_0px_#000] rounded-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Modul Praktik 10 Jari</span>
              </span>
              <Link
                href="/siswa/login"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-black hover:bg-slate-800 text-white font-mono text-[11px] font-bold rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                <Monitor className="w-3.5 h-3.5 text-amber-300" />
                <span>Portal Siswa</span>
              </Link>
            </div>
          </div>

          {/* Page Main Header */}
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-cyan-200/50 rounded-full border-2 border-black/10 pointer-events-none hidden sm:block"></div>

            <div className="max-w-3xl space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-300 border border-black rounded text-[11px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                <span>⌨️ Latihan Keterampilan Mengetik Cepat</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-black tracking-tight leading-snug">
                Latihan Praktik Mengetik 10 Jari (Touch Typing)
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Tingkatkan kecepatan dan akurasi mengetik Anda tanpa perlu melihat keyboard fisik. Dilengkapi keyboard visual berwarna, panduan letak 10 jari tangan, deteksi WPM realtime, dan alur pembelajaran bertingkat dari Baris Beranda (*Home Row*) hingga kata nyata bahasa Indonesia.
              </p>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE TYPING ENGINE ────────────────── */}
        <section aria-label="Game Latihan Mengetik 10 Jari Interaktif">
          <TypingTrainerGame />
        </section>

        {/* ── EDUCATIONAL GUIDE CARD ────────────────── */}
        <section aria-label="Panduan Home Row & Pemetaan 10 Jari">
          <TypingGuideCard />
        </section>

        {/* ── CTA TO JOIN COURSES ────────────────── */}
        <div className="bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-300 border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#fff]">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Kelas Komputer Lengkap</span>
            </div>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-black">
              Ingin Mahir Microsoft Office, Desain, & Pemrograman?
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
              Daftar kursus komputer di {brandName} sekarang. Belajar praktikum langsung dengan bimbingan instruktur profesional, sertifikat resmi, dan fasilitas komputer lengkap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/daftar"
              className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-slate-800 text-white font-heading font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
            >
              Konsultasi WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer brandName={brandName} />
    </div>
  );
}
