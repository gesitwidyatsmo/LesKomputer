"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiswa } from "@/context/SiswaContext";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart2,
  Brain,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Beranda", href: "/siswa", icon: LayoutDashboard },
  { name: "Materi Belajar", href: "/siswa/materi", icon: BookOpen },
  { name: "Jadwal Kelas", href: "/siswa/jadwal", icon: Calendar },
  { name: "Kuis Seru", href: "/siswa/quiz", icon: Brain },
  { name: "Nilai & Sertifikat", href: "/siswa/nilai", icon: BarChart2 },
];

export default function SiswaNavbar() {
  const { currentSiswa, logout } = useSiswa();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const initials =
    currentSiswa?.nama
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFDF5] border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Neobrutalis Ramah */}
            <Link href="/siswa" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-xl group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#000] transition-all rounded-lg">
                💻
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-slate-950 text-base sm:text-lg leading-none">
                    GWA<span className="text-orange-500">.</span>TECH
                  </span>
                  <span className="bg-orange-500 text-black text-[10px] font-black px-1.5 py-0.2 border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                    SISWA
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Ruang Belajar Komputer
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/siswa"
                    ? pathname === "/siswa"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 font-heading text-xs font-bold rounded-lg transition-all border-2 ${
                      isActive
                        ? "bg-orange-500 text-black border-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                        : "border-transparent text-slate-800 hover:bg-amber-300 hover:border-black hover:shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-black shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: user badge + logout */}
            <div className="flex items-center gap-2.5">
              {currentSiswa && (
                <div className="hidden sm:flex items-center gap-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-1.5 rounded-lg">
                  <div className="w-7 h-7 bg-cyan-300 border border-black flex items-center justify-center font-heading font-black text-xs text-black rounded shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-black font-heading leading-tight truncate max-w-[120px] lg:max-w-[150px]">
                      {currentSiswa.nama}
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold leading-none mt-0.5">
                      ID: {currentSiswa.id}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                title="Keluar dari Portal"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white font-heading text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg text-black hover:bg-amber-300 transition-colors cursor-pointer"
                onClick={() => setMobileOpen(true)}
                aria-label="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#FFFDF5] border-l-3 border-black shadow-[-6px_0px_0px_0px_#000] flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black text-white border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-black text-amber-300">
                  📱 Menu Belajar Siswa
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 bg-white text-black border border-black hover:bg-rose-500 hover:text-white transition-colors cursor-pointer rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile in Drawer */}
            <div className="p-4 bg-amber-100 border-b-2 border-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-heading font-black text-sm text-black rounded-lg">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-black text-black text-sm truncate">
                    {currentSiswa?.nama}
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    Nomor Siswa: {currentSiswa?.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer nav links */}
            <nav className="flex-1 py-4 px-3 space-y-2 font-heading text-xs font-bold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/siswa"
                    ? pathname === "/siswa"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 border-2 border-black rounded-lg transition-all ${
                      isActive
                        ? "bg-orange-500 text-black shadow-[3px_3px_0px_0px_#000]"
                        : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-black shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer footer / logout */}
            <div className="p-4 border-t-2 border-black bg-white">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-heading text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
