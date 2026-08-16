"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSiswa } from "@/context/SiswaContext";
import { User, Lock, AlertCircle, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";

export default function SiswaLoginPage() {
  const { login } = useSiswa();
  const router = useRouter();

  const [idSiswa, setIdSiswa] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(async () => {
      const result = await login(idSiswa.trim().toUpperCase(), password);
      if (result.success) {
        router.push("/siswa");
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    }, 600);
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
            {error && (
              <div className="bg-rose-100 text-rose-950 p-3.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs sm:text-sm font-bold flex items-center gap-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
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
                  placeholder="Contoh: S-001"
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

            {/* Friendly Hint Box */}
            <div className="p-3.5 bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg text-xs text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-black">
                <span>💡</span> Bantuan Masuk:
              </div>
              <p className="text-[12px] text-slate-700 leading-relaxed font-medium">
                Gunakan ID Siswa dari guru/instruktur. Password awal kamu adalah{" "}
                <span className="bg-white px-1.5 py-0.5 border border-black font-mono font-bold text-black">123456</span>.
              </p>
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
