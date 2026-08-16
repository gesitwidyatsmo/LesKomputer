"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSiswa } from "@/context/SiswaContext";
import { User, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] bg-retro-dots py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        {/* Retro Window Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
            </div>
            <span className="tracking-wide">sys_siswa_auth.exe</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">[SYS_READY]</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-black font-mono font-black text-2xl mb-4">
              &gt;_
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black">
              Portal Siswa
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-mono text-slate-600 font-bold">
              [GWA TECH COURSE // LEARNING MANAGEMENT SYSTEM]
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-rose-100 text-rose-900 p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ID Siswa */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold uppercase text-black">
                [INPUT] ID Siswa *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-black" />
                </div>
                <input
                  id="id-siswa"
                  type="text"
                  value={idSiswa}
                  onChange={(e) => setIdSiswa(e.target.value)}
                  placeholder="Contoh: S-001"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-white text-black font-mono font-bold text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 placeholder:font-normal transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold uppercase text-black">
                [INPUT] Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-black" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-700 hover:text-black transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                id="btn-login-siswa"
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-black font-heading font-black text-sm uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                  isLoading ? "bg-amber-300 opacity-80" : "bg-orange-500 hover:bg-orange-400"
                }`}
              >
                <span className="font-mono">{isLoading ? "⏳" : ">_"}</span>
                {isLoading ? "Memproses Autentikasi..." : "Masuk ke Portal Siswa"}
              </button>
            </div>

            {/* Hint Box */}
            <div className="p-3 bg-amber-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-black uppercase">
                <span>💡</span> Informasi Default:
              </div>
              <p className="text-[11px] text-slate-700">
                Gunakan ID Siswa terdaftar Anda. Password default jika belum diubah adalah{" "}
                <span className="bg-white px-1 py-0.5 border border-black font-bold text-black">123456</span>.
              </p>
            </div>

            {/* Back link */}
            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 hover:text-black uppercase hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Halaman Utama
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
