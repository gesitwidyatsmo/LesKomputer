import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BalloonHuntGame from "@/components/game-mouse/BalloonHuntGame";
import GameHubSelector from "@/components/game-mouse/GameHubSelector";
import { getLandingPageConfig, formatWhatsAppUrl } from "@/lib/landingService";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  Gamepad2, 
  GraduationCap, 
  ArrowRight,
  MousePointer2,
  ShieldCheck,
  Award,
  HeartHandshake
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arena Game Penguasaan Mouse - Petualangan Belajar Komputer Anak & Siswa",
  description: "Bermain sambil mengasah keterampilan mouse: Buru Balon Terbang, Detektif Harta Karun, Pabrik Burger, dan game interaktif lainnya dirancang selesai dalam 4-5 menit untuk anak dan pelajar.",
};

export default async function GameMousePage() {
  const { data: config } = await getLandingPageConfig();
  const globalSettings = config?.general?.content || {};
  const globalWhatsapp = globalSettings.whatsappNumber || "6280000000000";
  const brandName = globalSettings.brandName || "GWA.TECH";

  const waLink = formatWhatsAppUrl(
    globalWhatsapp,
    "Halo Admin GWA Tech, anak/siswa saya baru saja mencoba Game Buru Balon Terbang dan saya ingin bertanya info kelas kursus komputer anak lebih lanjut."
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF5] text-slate-950">
      {/* Top Navbar */}
      <Navbar globalWhatsapp={globalWhatsapp} brandName={brandName} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* ── Breadcrumb & Navigation Badges ────────────────── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href="/siswa"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-amber-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Beranda Siswa</span>
              </Link>
              <Link
                href="/siswa/latihan-mouse"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-cyan-300 font-mono text-xs font-bold text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                <span>Modul Latihan Formal</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-300 border-2 border-black px-2.5 py-1 text-[11px] font-mono font-bold shadow-[2px_2px_0px_0px_#000] rounded-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Kids & Student Gamification</span>
              </span>
            </div>
          </div>

          {/* Page Main Banner */}
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-200/50 rounded-full border-2 border-black/10 pointer-events-none hidden sm:block"></div>

            <div className="max-w-3xl space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-300 border border-black rounded text-[11px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Arena Game Penguasaan Mouse Komputer</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-black tracking-tight leading-tight">
                Petualangan Penguasaan Mouse Interaktif 🎈
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Pelatihan motorik halus tangan yang menyenangkan untuk anak-anak dan pemula. Setiap game dirancang tamat dalam <strong>4–5 menit</strong> guna membentuk memori otot jari, akurasi klik kiri, klik ganda, drag-and-drop, hingga koordinasi refleks yang tangkas.
              </p>
            </div>
          </div>
        </div>

        {/* ── GAME 1 ARENA: BURU BALON TERBANG ────────────────── */}
        <section aria-label="Game Buru Balon Terbang" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-amber-300 text-xs font-mono font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <span>🎈 GAME 1 DARI 6</span>
              <span className="text-white">•</span>
              <span className="text-white">Fokus: Klik Kiri & Akurasi Tepat</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 hidden sm:inline">
              Durasi: ~4.5 Menit (5 Babak)
            </span>
          </div>

          <BalloonHuntGame />
        </section>

        {/* ── ETALASE 6 GAME PENGUASAAN MOUSE ────────────────── */}
        <section aria-label="Daftar 6 Game Penguasaan Mouse">
          <GameHubSelector activeGameId="balon-terbang" />
        </section>

        {/* ── PANDUAN PEDAGOGI UNTUK GURU & ORANG TUA ───────────── */}
        <section className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-cyan-300 border-2 border-black rounded-lg flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_0px_#000]">
              💡
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-black">
                Mengapa Pelatihan Durasi 4–5 Menit Sangat Penting Bagi Anak?
              </h3>
              <p className="text-xs font-mono text-slate-600">
                Catatan pedagogis untuk Guru TIK di sekolah dan Orang Tua di rumah.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#FFFDF5] border-2 border-black rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-mono font-black text-xs text-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mencegah Click-Spamming</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Anak yang baru mengenal komputer cenderung mengklik mouse secara membabi-buta di sembarang layar. Mekanik game dengan penghitungan rasio akurasi mendidik anak untuk membidik terlebih dahulu sebelum menekan jari telunjuk.
              </p>
            </div>

            <div className="bg-[#FFFDF5] border-2 border-black rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-mono font-black text-xs text-black">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Rentang Fokus Emas (Sweet Spot)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Durasi 4–5 menit menjaga atensi anak tetap prima tanpa membuat otot tendon jari telunjuk mereka kram atau lelah (*muscle fatigue*). 5 Babak bertahap memberi rasa pencapaian (*sense of achievement*) beruntun.
              </p>
            </div>

            <div className="bg-[#FFFDF5] border-2 border-black rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-mono font-black text-xs text-black">
                <HeartHandshake className="w-4 h-4 text-blue-600" />
                <span>Ergonomi Genggaman Tangan</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Pastikan telapak tangan anak bersandar nyaman pada punggung mouse, pergelangan tangan tidak tertekuk tajam, dan jari telunjuk berada di tombol kiri serta jari tengah di tombol kanan.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA PENDAFTARAN KURSUS KOMPUTER ANAK & PEMULA ────── */}
        <div className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#fff]">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>KELAS KOMPUTER KIDS & PEMULA GWA TECH</span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
              Ingin Si Kecil Mahir Mengetik, Menggambar & Office Sejak Dini?
            </h2>
            <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl">
              Daftarkan putra-putri Anda di <strong>GWA Tech Course</strong>. Kurikulum disesuaikan untuk anak dan pemula dengan pengajar ramah, modul interaktif, sertifikat resmi, dan ruang lab ber-AC.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/daftar"
              className="px-5 py-3 bg-black hover:bg-slate-900 text-amber-300 font-heading font-black text-xs uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Daftar Kursus Anak</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
            >
              Konsultasi Guru via WhatsApp
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
