import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MouseTrainerGame from "@/components/mouse-trainer/MouseTrainerGame";
import MouseGuideCard from "@/components/mouse-trainer/MouseGuideCard";
import { getLandingPageConfig, formatWhatsAppUrl } from "@/lib/landingService";
import Link from "next/link";
import { 
  ArrowLeft, 
  MousePointer2, 
  Sparkles, 
  HelpCircle, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Monitor
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Latihan Menggunakan Mouse Komputer - Belajar Mengoperasikan Kursor",
  description: "Latihan interaktif menggerakkan kursor, menyorot target, klik kiri, klik kanan, klik ganda, drag and drop, serta scroll roda mouse untuk pemula dan siswa kursus komputer.",
};

export default async function LatihanMousePage() {
  const { data: config } = await getLandingPageConfig();
  const globalSettings = config?.general?.content || {};
  const globalWhatsapp = globalSettings.whatsappNumber || "6280000000000";
  const brandName = globalSettings.brandName || "GWA.TECH";

  const waLink = formatWhatsAppUrl(
    globalWhatsapp,
    "Halo Admin GWA Tech, saya telah mencoba Simulasi Latihan Mouse dan ingin bertanya info kursus komputer lebih lanjut."
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
                <span>Modul Praktik Komputer Dasar</span>
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
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-200/50 rounded-full border-2 border-black/10 pointer-events-none hidden sm:block"></div>

            <div className="max-w-3xl space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-300 border border-black rounded text-[11px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                <span>🖱️ Latihan Keterampilan Komputer Dasar</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-black tracking-tight leading-snug">
                Latihan Praktik Menggunakan Mouse
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Asah kelenturan dan presisi tangan Anda dalam menggerakkan kursor, menyorot objek, melakukan klik kiri, klik kanan, klik ganda, drag & drop, serta scrolling roda mouse. Sangat cocok bagi pemula, anak-anak, pelajar, maupun siapa saja yang ingin semakin mahir dan lincah mengoperasikan komputer.
              </p>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE GAME ENGINE ────────────────── */}
        <section aria-label="Game Latihan Mouse Interaktif">
          <MouseTrainerGame />
        </section>

        {/* ── EDUCATIONAL GUIDE CARD ────────────────── */}
        <section aria-label="Panduan Anatomi & Tips Ergonomi Mouse">
          <MouseGuideCard />
        </section>

        {/* ── CTA TO JOIN COURSES ────────────────── */}
        <div className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#fff]">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>KURSUS KOMPUTER LENGKAP & TERBIMBING</span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
              Ingin Mahir Mengetik 10 Jari, Word, Excel & Desain Grafis?
            </h2>
            <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl">
              Gabung di kelas <strong>GWA Tech Course</strong>. Belajar dari nol dipandu instruktur berpengalaman dengan modul interaktif, sertifikat resmi, dan ruang lab ber-AC.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/daftar"
              className="px-5 py-3 bg-black hover:bg-slate-900 text-amber-300 font-heading font-black text-xs uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Daftar Kursus Sekarang</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer 
        data={config?.footer?.content} 
        globalSettings={globalSettings} 
      />
    </div>
  );
}
