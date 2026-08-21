"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiswa } from "@/context/SiswaContext";
import { resetPasswordSiswa } from "@/lib/siswaService";
import Swal from "sweetalert2";
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
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Zap,
  Award,
  Star,
  Mouse,
  Keyboard,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const mainNavItems = [
  { name: "Beranda", href: "/siswa", icon: LayoutDashboard },
  { name: "Materi Belajar", href: "/siswa/materi", icon: BookOpen },
  { name: "Jadwal Kelas", href: "/siswa/jadwal", icon: Calendar },
];

const latihanDropdownItems = [
  {
    name: "Kuis Seru",
    href: "/siswa/quiz",
    icon: Brain,
    desc: "Uji pemahaman materi kursus",
    color: "bg-purple-300",
  },
  {
    name: "Latihan Mouse",
    href: "/siswa/latihan-mouse",
    icon: Mouse,
    desc: "Latihan klik, drag & koordinasi",
    color: "bg-amber-300",
  },
  {
    name: "Latihan Mengetik",
    href: "/siswa/latihan-mengetik",
    icon: Keyboard,
    desc: "Latihan 10 jari & akurasi WPM",
    color: "bg-cyan-300",
  },
];

export default function SiswaNavbar() {
  const { currentSiswa, logout, gamification } = useSiswa();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLatihanActive =
    pathname.startsWith("/siswa/quiz") ||
    pathname.startsWith("/siswa/latihan-mouse") ||
    pathname.startsWith("/siswa/latihan-mengetik");

  // State untuk modal ganti kata sandi
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [passError, setPassError] = useState("");
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // State untuk dropdown avatar akun & dropdown kuis/latihan
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);

  const [latihanMenuOpen, setLatihanMenuOpen] = useState(false);
  const latihanMenuRef = useRef(null);

  // Click outside listener untuk menutup dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target)
      ) {
        setAvatarMenuOpen(false);
      }
      if (
        latihanMenuRef.current &&
        !latihanMenuRef.current.contains(event.target)
      ) {
        setLatihanMenuOpen(false);
      }
    }
    if (avatarMenuOpen || latihanMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [avatarMenuOpen, latihanMenuOpen]);

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

  const handleGantiPassword = async (e) => {
    e.preventDefault();
    setPassError("");

    if (!passwordBaru || passwordBaru.length < 6) {
      setPassError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      setPassError("Konfirmasi kata sandi tidak cocok. Periksa kembali ya!");
      return;
    }

    setIsUpdatingPass(true);
    try {
      const { error } = await resetPasswordSiswa(currentSiswa.id, passwordBaru);
      if (error) {
        setPassError("Gagal mengubah kata sandi: " + (error.message || "Terjadi kesalahan"));
      } else {
        setIsPasswordModalOpen(false);
        setPasswordBaru("");
        setKonfirmasiPassword("");
        Swal.fire({
          icon: "success",
          title: "Kata Sandi Diperbarui! 🎉",
          text: "Kata sandi kamu berhasil diganti. Gunakan kata sandi baru ini saat masuk berikutnya.",
          customClass: {
            popup: "border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]",
            confirmButton: "bg-orange-500 border-2 border-black font-bold text-black rounded-lg",
          },
        });
      }
    } catch (err) {
      setPassError("Terjadi kesalahan sistem saat mengganti kata sandi.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

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
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {mainNavItems.map((item) => {
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

              {/* Dropdown Kuis & Latihan */}
              <div className="relative" ref={latihanMenuRef}>
                <button
                  type="button"
                  onClick={() => setLatihanMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 font-heading text-xs font-bold rounded-lg transition-all border-2 cursor-pointer select-none ${
                    isLatihanActive || latihanMenuOpen
                      ? "bg-orange-500 text-black border-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                      : "border-transparent text-slate-800 hover:bg-amber-300 hover:border-black hover:shadow-[2px_2px_0px_0px_#000]"
                  }`}
                  aria-expanded={latihanMenuOpen}
                  aria-haspopup="true"
                >
                  <Brain className="w-4 h-4 text-black shrink-0" />
                  <span>Kuis &amp; Latihan</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${
                      latihanMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Popover Dropdown Kuis & Latihan */}
                {latihanMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                    {latihanDropdownItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setLatihanMenuOpen(false)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border-2 border-black transition-all ${
                            isActive
                              ? `${item.color} shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5`
                              : "bg-white hover:bg-yellow-100 shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 ${item.color} border border-black rounded-lg flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]`}
                          >
                            <Icon className="w-4 h-4 text-black" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-heading font-black text-xs text-black leading-snug">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-600 font-medium truncate">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nilai & Sertifikat */}
              <Link
                href="/siswa/nilai"
                className={`flex items-center gap-2 px-3.5 py-2 font-heading text-xs font-bold rounded-lg transition-all border-2 ${
                  pathname.startsWith("/siswa/nilai")
                    ? "bg-orange-500 text-black border-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                    : "border-transparent text-slate-800 hover:bg-amber-300 hover:border-black hover:shadow-[2px_2px_0px_0px_#000]"
                }`}
              >
                <BarChart2 className="w-4 h-4 text-black shrink-0" />
                <span>Nilai &amp; Sertifikat</span>
              </Link>
            </nav>

            {/* Right: Avatar Dropdown for Tablet & Desktop, Hamburger for Mobile */}
            <div className="flex items-center gap-2.5">
              {currentSiswa && (
                <div className="relative" ref={avatarMenuRef}>
                  {/* Avatar Button Trigger - Compact Avatar Icon */}
                  <button
                    type="button"
                    onClick={() => setAvatarMenuOpen((prev) => !prev)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-cyan-300 hover:bg-cyan-200 border-2 border-black rounded-xl flex items-center justify-center font-heading font-black text-xs sm:text-sm text-black transition-all cursor-pointer select-none ${
                      avatarMenuOpen
                        ? "shadow-none translate-x-0.5 translate-y-0.5 bg-amber-300 ring-2 ring-black"
                        : "shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000]"
                    }`}
                    aria-expanded={avatarMenuOpen}
                    aria-haspopup="true"
                    title={`Akun: ${currentSiswa.nama} (Klik untuk info & pengaturan)`}
                  >
                    {initials}
                  </button>

                  {/* Dropdown Menu Popover */}
                  {avatarMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* Header Info Akun */}
                      <div className="p-4 bg-[#FFFDF5] border-b-2 border-black">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cyan-300 border-2 border-black flex items-center justify-center font-heading font-black text-base text-black rounded-xl shrink-0 shadow-[2px_2px_0px_0px_#000]">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading font-black text-base text-black truncate">
                              {currentSiswa.nama}
                            </p>
                            <span className="inline-block font-mono text-[11px] font-bold bg-black text-amber-300 px-2 py-0.5 rounded mt-1">
                              ID: {currentSiswa.id}
                            </span>
                          </div>
                        </div>

                        {/* Gamification Level Progress Box in Avatar Popover */}
                        {gamification?.levelInfo && (
                          <div className="mt-3 p-3 bg-[#FFF9E5] border-2 border-black rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs font-heading font-black">
                              <span className="flex items-center gap-1.5 text-black">
                                <span>{gamification.levelInfo.icon}</span>
                                <span>Level {gamification.levelInfo.level}: {gamification.levelInfo.title}</span>
                              </span>
                              <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 border border-black rounded text-black shadow-[1px_1px_0px_0px_#000]">
                                {gamification.xp} XP
                              </span>
                            </div>
                            <div className="w-full h-3 bg-white border border-black rounded-full overflow-hidden p-0.5">
                              <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(8, gamification.levelInfo.progressPct)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] font-medium text-slate-700">
                              <span>Progres Level</span>
                              <span>{gamification.levelInfo.xpToNext > 0 ? `${gamification.levelInfo.xpToNext} XP ke Lv.${gamification.levelInfo.level + 1}` : 'Level Maksimal 🏆'}</span>
                            </div>
                          </div>
                        )}

                        {/* Extra Detail: Modul & Kelas */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-slate-600 font-medium">
                            <span>Modul:</span>
                            <strong className="text-black font-bold uppercase truncate max-w-[170px]">
                              {currentSiswa.modul || "-"}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 font-medium">
                            <span>Kelas:</span>
                            <strong className="text-black font-bold truncate max-w-[170px]">
                              {currentSiswa.kelas || "-"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Menu Actions */}
                      <div className="p-3 space-y-2 bg-white">
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarMenuOpen(false);
                            setIsPasswordModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-heading font-black text-black hover:bg-yellow-200 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-left cursor-pointer"
                        >
                          <div className="w-7 h-7 bg-amber-300 border border-black rounded-lg flex items-center justify-center shrink-0">
                            <Key className="w-4 h-4 text-black" />
                          </div>
                          <span>Ganti Kata Sandi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAvatarMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-heading font-black text-rose-700 hover:bg-rose-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-left cursor-pointer"
                        >
                          <div className="w-7 h-7 bg-rose-200 border border-black rounded-lg flex items-center justify-center shrink-0">
                            <LogOut className="w-4 h-4 text-rose-700" />
                          </div>
                          <span>Keluar dari Portal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

      {/* ── Modal Ganti Password Mandiri ───────────────────── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !isUpdatingPass && setIsPasswordModalOpen(false)}
          />
          <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-xl max-w-md w-full overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-4 py-3 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-300" />
                <span className="text-amber-300">Ganti Kata Sandi Kamu</span>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 bg-white text-black border border-black hover:bg-rose-500 hover:text-white transition-colors cursor-pointer rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-yellow-50 p-3 border-2 border-black rounded-lg">
                <span>💡</span>
                <span>Buat kata sandi baru yang mudah kamu ingat (minimal 6 huruf/angka).</span>
              </div>

              {passError && (
                <div className="bg-rose-100 text-rose-950 p-3 border-2 border-black rounded-lg text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <form onSubmit={handleGantiPassword} className="space-y-4">
                {/* Password Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-black font-heading">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPass1 ? "text" : "password"}
                      value={passwordBaru}
                      onChange={(e) => setPasswordBaru(e.target.value)}
                      placeholder="Masukkan kata sandi baru"
                      required
                      className="w-full pr-10 pl-3 py-2.5 bg-white text-black font-medium text-sm border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass1(!showPass1)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-black cursor-pointer"
                    >
                      {showPass1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-black font-heading">
                    Ulangi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPass2 ? "text" : "password"}
                      value={konfirmasiPassword}
                      onChange={(e) => setKonfirmasiPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi baru"
                      required
                      className="w-full pr-10 pl-3 py-2.5 bg-white text-black font-medium text-sm border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass2(!showPass2)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-black cursor-pointer"
                    >
                      {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-black font-heading text-xs font-bold border-2 border-black rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPass}
                    className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingPass ? "Menyimpan..." : "Simpan Sandi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <div className="w-10 h-10 bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-heading font-black text-sm text-black rounded-lg shrink-0">
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

              {gamification?.levelInfo && (
                <div className="mt-3 p-2 bg-white border border-black rounded-lg flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1 text-black font-heading">
                    <span>{gamification.levelInfo.icon}</span>
                    <span>Lv.{gamification.levelInfo.level} {gamification.levelInfo.title}</span>
                  </span>
                  <span className="bg-amber-300 text-black px-1.5 py-0.5 border border-black rounded font-mono text-[11px] font-black">
                    {gamification.xp} XP
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsPasswordModalOpen(true);
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-yellow-200 text-black font-heading text-xs font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Ganti Kata Sandi</span>
              </button>
            </div>

            {/* Drawer nav links */}
            <nav className="flex-1 py-4 px-3 space-y-2 font-heading text-xs font-bold overflow-y-auto">
              {mainNavItems.map((item) => {
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

              {/* Kuis & Latihan Section Group in Mobile */}
              <div className="pt-2 border-t-2 border-dashed border-black/30 space-y-1.5">
                <span className="font-heading text-[10px] font-black uppercase text-slate-500 px-1 block">
                  🎮 Kuis &amp; Latihan
                </span>
                {latihanDropdownItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 border-2 border-black rounded-lg transition-all text-xs ${
                        isActive
                          ? `${item.color} text-black shadow-[2px_2px_0px_0px_#000]`
                          : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 ${item.color} border border-black rounded flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span className="font-bold">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/siswa/nilai"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 border-2 border-black rounded-lg transition-all ${
                  pathname.startsWith("/siswa/nilai")
                    ? "bg-orange-500 text-black shadow-[3px_3px_0px_0px_#000]"
                    : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-200"
                }`}
              >
                <BarChart2 className="w-4 h-4 text-black shrink-0" />
                <span>Nilai &amp; Sertifikat</span>
              </Link>
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
