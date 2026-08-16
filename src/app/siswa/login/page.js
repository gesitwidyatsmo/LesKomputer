"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSiswa } from "@/context/SiswaContext";
import { User, Lock, AlertCircle, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { getLandingPageConfig, formatWhatsAppUrl } from "@/lib/landingService";

export default function SiswaLoginPage() {
  const { login } = useSiswa();
  const router = useRouter();

  const [idSiswa, setIdSiswa] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [inactiveData, setInactiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminWa, setAdminWa] = useState("6280000000000");

  useEffect(() => {
    getLandingPageConfig().then((res) => {
      if (res?.data?.general?.content?.whatsappNumber) {
        setAdminWa(res.data.general.content.whatsappNumber);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setInactiveData(null);
    setIsLoading(true);

    setTimeout(async () => {
      const result = await login(idSiswa.trim().toUpperCase(), password);
      if (result.success) {
        router.push("/siswa");
      } else {
        setError(result.message);
        if (result.isInactive) {
          setInactiveData(result.data || { id: idSiswa.trim().toUpperCase() });
        }
        setIsLoading(false);
      }
    }, 600);
  };

  const getWaActivationLink = () => {
    if (!inactiveData) return "#";
    const pesan = `Halo Admin GWA Tech Course,\n\nSaya ingin mengonfirmasi aktivasi akun siswa saya:\n- *ID Siswa*: ${inactiveData.id}\n${inactiveData.nama ? `- *Nama*: ${inactiveData.nama}\n` : ''}Mohon bantuan untuk aktivasi akun agar saya dapat mulai login dan belajar. Terima kasih!`;
    return formatWhatsAppUrl(adminWa, pesan);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] bg-retro-dots py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden rounded-xl">
        {/* Playful Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black inline-block"></span>
            </div>
            <span className="tracking-wide text-amber-300 font-mono">GWA Tech Course</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold font-mono">● Kelas Siswa</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Logo & Welcome Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-amber-300 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center text-black text-3xl mb-3 rounded-lg">
              💻
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-200 text-black font-bold text-xs border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-800" /> Portal Belajar Siswa
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
              Selamat Datang! 👋
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Yuk masuk untuk belajar materi dan main kuis seru!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error banner */}
            {error && !inactiveData && (
              <div className="bg-rose-100 text-rose-950 p-3.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs sm:text-sm font-bold flex items-center gap-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Inactive Account Alert Banner */}
            {inactiveData && (
              <div className="bg-amber-100 text-slate-900 p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs space-y-2.5 rounded-lg">
                <div className="flex items-center gap-2 font-heading font-black uppercase text-amber-950 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Akun Menunggu Aktivasi</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Pendaftaran dengan ID <strong>{inactiveData.id}</strong> sudah tercatat, namun status Anda masih <strong>Tidak Aktif</strong> (menunggu aktivasi manual oleh Admin).
                </p>
                <a
                  href={getWaActivationLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  📲 Hubungi Admin WhatsApp untuk Aktivasi
                </a>
              </div>
            )}

            {/* ID Siswa */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-black font-heading">
                Nomor / ID Siswa Kamu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="id-siswa"
                  type="text"
                  value={idSiswa}
                  onChange={(e) => setIdSiswa(e.target.value)}
                  placeholder="Contoh: GWA-202608-001"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white text-black font-mono font-bold text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-lg focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 placeholder:font-normal transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-black font-heading">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi kamu"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-white text-black font-medium text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-lg focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 hover:text-black transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="btn-login-siswa"
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-black font-heading font-black text-sm uppercase tracking-wide text-black rounded-lg shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                  isLoading ? "bg-amber-300 opacity-90" : "bg-orange-500 hover:bg-orange-400"
                }`}
              >
                <span>{isLoading ? "⏳ Sedang Masuk..." : "🚀 Masuk ke Ruang Belajar"}</span>
              </button>
            </div>

            {/* Link to Register */}
            <div className="p-3.5 bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg text-xs text-slate-900 flex items-center justify-between">
              <div>
                <p className="font-bold text-black">Belum punya akun siswa?</p>
                <p className="text-[11px] text-slate-600">Daftar kursus online sekarang.</p>
              </div>
              <Link
                href="/daftar"
                className="px-3 py-1.5 bg-white hover:bg-amber-300 text-black font-mono font-bold text-[11px] uppercase border border-black shadow-[1.5px_1.5px_0px_0px_#000] transition-colors"
              >
                Daftar &gt;
              </Link>
            </div>

            {/* Back link */}
            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-black hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Halaman Depan
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
