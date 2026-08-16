"use client";

import { useState } from "react";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/adminService";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginAdmin(username, password);
    
    if (result.success) {
      // Set session using localStorage or cookies (for simplicity in this LMS, localStorage is used, but Supabase Auth is better for production)
      localStorage.setItem("admin_session", JSON.stringify(result.data));
      router.push("/admin"); // redirect to dashboard
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] bg-retro-dots py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        {/* Retro Window Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
            </div>
            <span className="tracking-wide">auth_admin_gate.exe</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">[SYS_SECURE]</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-orange-500 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-black font-heading font-black text-2xl mb-4">
              G
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black">
              GWA Admin Gate
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-mono text-slate-600">
              [AUTHENTICATION REQUIRED // LKP CRM]
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-100 text-rose-800 p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs sm:text-sm font-mono font-bold flex items-center gap-2">
                <span className="text-rose-600 font-black">[!]</span> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-bold uppercase text-black">
                  [INPUT] Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                    placeholder="Masukkan username admin"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-bold uppercase text-black">
                  [INPUT] Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-black" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                    placeholder="Masukkan password"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-black font-heading font-black text-sm uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                  isLoading ? "bg-amber-300 opacity-80" : "bg-orange-500 hover:bg-orange-400"
                }`}
              >
                <span className="font-mono">{isLoading ? "⏳" : ">_"}</span>
                {isLoading ? "Memproses Autentikasi..." : "Masuk Sistem Admin"}
              </button>
            </div>
            
            <div className="p-3 bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-center text-xs font-mono text-slate-800">
              <span>Demo Login: </span>
              <span className="font-bold bg-white px-1.5 py-0.5 border border-black">admin</span> / <span className="font-bold bg-white px-1.5 py-0.5 border border-black">admin123</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
