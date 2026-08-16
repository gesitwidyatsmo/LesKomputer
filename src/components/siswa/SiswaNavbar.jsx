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
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Beranda", href: "/siswa", icon: LayoutDashboard },
  { name: "Materi", href: "/siswa/materi", icon: BookOpen },
  { name: "Jadwal", href: "/siswa/jadwal", icon: Calendar },
  { name: "Quiz", href: "/siswa/quiz", icon: Brain },
  { name: "Nilai", href: "/siswa/nilai", icon: BarChart2 },
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
          <div className="flex items-center justify-between h-16">
            {/* Logo Neobrutalis */}
            <Link href="/siswa" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-black text-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-mono font-black text-sm group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#000] transition-all">
                &gt;_
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-slate-950 text-base leading-none">
                  GWA<span className="text-orange-500">.</span>LMS
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  Portal Siswa
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
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
                    className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all border-2 ${
                      isActive
                        ? "bg-orange-500 text-black border-black shadow-[2px_2px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                        : "border-transparent text-slate-800 hover:bg-amber-300 hover:border-black hover:shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-black shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: user badge + logout */}
            <div className="flex items-center gap-2.5">
              {currentSiswa && (
                <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 py-1">
                  <div className="w-6 h-6 bg-cyan-300 border border-black flex items-center justify-center font-mono font-bold text-[11px] text-black shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-black font-heading leading-tight truncate max-w-[120px] lg:max-w-[160px]">
                      {currentSiswa.nama}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold leading-none">
                      [{currentSiswa.id}]
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                title="Keluar dari Portal"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-black hover:bg-amber-300 transition-colors cursor-pointer"
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
                <span className="font-mono text-xs font-bold text-amber-300">
                  SYS_MENU // LMS
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 bg-white text-black border border-black hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile in Drawer */}
            <div className="p-4 bg-amber-100 border-b-2 border-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-mono font-bold text-sm text-black">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-black text-black text-sm truncate">
                    {currentSiswa?.nama}
                  </p>
                  <p className="font-mono text-xs font-bold text-slate-700">
                    ID: {currentSiswa?.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer nav links */}
            <nav className="flex-1 py-4 px-3 space-y-2 font-mono text-xs">
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 border-2 border-black font-bold uppercase transition-all ${
                      isActive
                        ? "bg-orange-500 text-black shadow-[3px_3px_0px_0px_#000]"
                        : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-black" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer footer / logout */}
            <div className="p-4 border-t-2 border-black bg-white">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
