"use client";

import { useState, useEffect } from "react";
import { 
  getLandingPageConfig, 
  updateAllLandingSections, 
  resetLandingToDefaults, 
  DEFAULT_LANDING_CONFIG,
  normalizeWhatsAppNumber,
  formatPhoneDisplay
} from "@/lib/landingService";
import Swal from "sweetalert2";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Megaphone,
  Layout,
  Zap,
  BookOpen,
  Monitor,
  MessageSquare,
  HelpCircle,
  PhoneCall,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Building,
  Clock,
  ToggleLeft,
  ToggleRight,
  Terminal
} from "lucide-react";

export default function AdminLandingPage() {
  const [config, setConfig] = useState(DEFAULT_LANDING_CONFIG);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    const res = await getLandingPageConfig();
    if (res.success && res.data) {
      setConfig(res.data);
    }
    setIsLoading(false);
  };

  // Helper to update specific section's content or visibility
  const updateSectionContent = (sectionKey, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        content: {
          ...prev[sectionKey].content,
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const toggleSectionVisibility = (sectionKey) => {
    setConfig((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        is_visible: !prev[sectionKey].is_visible
      }
    }));
    setHasChanges(true);
  };

  // Save all sections
  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateAllLandingSections(config);
    setIsSaving(false);

    if (res.success) {
      setHasChanges(false);
      Swal.fire({
        icon: "success",
        title: "Perubahan Disimpan!",
        text: "Konten dan pengaturan visibilitas berhasil diperbarui di seluruh website.",
        confirmButtonColor: "#000",
        background: "#FFFDF5",
        customClass: {
          popup: "border-3 border-black shadow-[6px_6px_0px_0px_#000] font-sans",
          confirmButton: "font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000]"
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Terjadi kesalahan saat menyimpan data ke Supabase: " + (res.error?.message || "Koneksi database bermasalah."),
        confirmButtonColor: "#000"
      });
    }
  };

  // Reset to default
  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Reset Konten ke Awal?",
      text: "Semua teks, kustomisasi, dan pengaturan visibilitas akan dikembalikan ke setelan default awal pabrik.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#000000",
      confirmButtonText: "Ya, Reset Semuanya",
      cancelButtonText: "Batal",
      background: "#FFFDF5",
      customClass: {
        popup: "border-3 border-black shadow-[6px_6px_0px_0px_#000] font-sans",
        confirmButton: "font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000]",
        cancelButton: "font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000]"
      }
    });

    if (result.isConfirmed) {
      setIsSaving(true);
      const res = await resetLandingToDefaults();
      setIsSaving(false);

      if (res.success) {
        setConfig(DEFAULT_LANDING_CONFIG);
        setHasChanges(false);
        Swal.fire({
          icon: "success",
          title: "Berhasil Direset",
          text: "Seluruh konten landing page telah kembali ke kondisi awal.",
          confirmButtonColor: "#000"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Reset",
          text: res.error?.message || "Terjadi kesalahan.",
          confirmButtonColor: "#000"
        });
      }
    }
  };

  // Section keys list
  const sectionList = [
    { key: "announcement", label: "Top Announcement", icon: <Megaphone className="w-4 h-4" /> },
    { key: "hero", label: "Hero Section", icon: <Layout className="w-4 h-4" /> },
    { key: "values", label: "Keunggulan (3 Pilar)", icon: <Zap className="w-4 h-4" /> },
    { key: "programs", label: "Program & Modul", icon: <BookOpen className="w-4 h-4" /> },
    { key: "fasilitas", label: "Fasilitas Lab 5-PC", icon: <Monitor className="w-4 h-4" /> },
    { key: "testimonials", label: "Testimoni Alumni", icon: <MessageSquare className="w-4 h-4" /> },
    { key: "faq", label: "FAQ (Tanya Jawab)", icon: <HelpCircle className="w-4 h-4" /> },
    { key: "cta_banner", label: "Banner Ajakan CTA", icon: <Sparkles className="w-4 h-4" /> },
    { key: "floating_wa", label: "Tombol Floating WA", icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const currentWaNumber = config.general?.content?.whatsappNumber || "6280000000000";
  const normalizedWa = normalizeWhatsAppNumber(currentWaNumber);
  const formattedPhone = formatPhoneDisplay(currentWaNumber);

  // Helper mini toggle button
  const MiniToggle = ({ label, isVisible, onToggle, subLabel }) => (
    <div className="flex items-center justify-between p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] gap-3">
      <div>
        <span className="font-heading font-bold text-xs sm:text-sm text-black block">
          {label}
        </span>
        {subLabel && (
          <span className="font-mono text-[10px] text-slate-500 block">
            {subLabel}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-1 font-mono text-[11px] font-black uppercase border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
          isVisible !== false
            ? "bg-emerald-400 text-black hover:bg-emerald-300"
            : "bg-rose-500 text-white hover:bg-rose-400"
        }`}
      >
        {isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>{isVisible !== false ? "Tampil" : "Sembunyi"}</span>
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          <p className="font-mono text-xs font-bold uppercase">[MEMUAT_PENGATURAN_BERANDA...]</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-3 border-black p-5 shadow-[5px_5px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-300 border border-black font-mono text-[10px] font-black uppercase px-2 py-0.5 shadow-[1.5px_1.5px_0px_0px_#000]">
              [CMS // BERANDA_V2]
            </span>
            {hasChanges && (
              <span className="bg-rose-500 text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black animate-pulse">
                ADA PERUBAHAN BELUM DISIMPAN
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
            Kelola Konten & Visibilitas Beranda
          </h1>
          <p className="font-medium text-xs sm:text-sm text-slate-600 mt-0.5">
            Atur visibilitas setiap section &amp; sub-elemen (div/kartu/tombol), nomor WhatsApp terpusat, dan ubah teks tanpa coding.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] font-mono text-xs font-bold uppercase active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
            title="Buka Halaman Utama di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Web</span>
          </a>

          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] font-mono text-xs font-bold uppercase active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Kembalikan semua teks ke default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] font-mono text-xs font-black uppercase active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Quick Info Banner for Centralized WhatsApp */}
      <div className="p-3.5 bg-emerald-100 border-3 border-black shadow-[3.5px_3.5px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Phone className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>Nomor WhatsApp Terpusat Aktif:</span>
          <span className="bg-black text-amber-300 px-2 py-0.5 border border-black font-black">
            {formattedPhone} ({normalizedWa})
          </span>
        </div>
        <button
          onClick={() => setActiveTab("general")}
          className="self-start sm:self-auto text-[11px] font-black uppercase text-emerald-900 hover:text-black underline cursor-pointer"
        >
          ✎ Ubah Nomor Kontak Utama
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-black/20 select-none">
        {/* Centralized Contact Tab */}
        <button
          onClick={() => setActiveTab("general")}
          className={`px-3.5 py-2 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all border-2 border-black cursor-pointer flex items-center gap-1.5 ${
            activeTab === "general"
              ? "bg-emerald-400 text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 font-black"
              : "bg-emerald-50 text-slate-800 hover:bg-emerald-100 shadow-[1.5px_1.5px_0px_0px_#000]"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>⭐ Kontak Terpusat</span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3.5 py-2 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all border-2 border-black cursor-pointer ${
            activeTab === "overview"
              ? "bg-black text-amber-300 shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 font-black"
              : "bg-white text-black hover:bg-yellow-100 shadow-[1.5px_1.5px_0px_0px_#000]"
          }`}
        >
          🎛️ Visibilitas Global
        </button>

        {sectionList.map((sec) => {
          const isVis = config[sec.key]?.is_visible !== false;
          const isActive = activeTab === sec.key;
          return (
            <button
              key={sec.key}
              onClick={() => setActiveTab(sec.key)}
              className={`px-3 py-2 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all border-2 border-black cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-amber-300 text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 font-black"
                  : "bg-white text-slate-800 hover:bg-slate-100 shadow-[1.5px_1.5px_0px_0px_#000]"
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
              {!isVis && (
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" title="Section Nonaktif"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: GENERAL / KONTAK TERPUSAT */}
      {/* ========================================================================= */}
      {activeTab === "general" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-heading font-black text-black">
                  Pengaturan Kontak &amp; Brand Terpusat (Single Source of Truth)
                </h2>
                <p className="font-mono text-xs text-slate-600">
                  Ubah data di sini satu kali, dan seluruh tombol WhatsApp, footer, header, serta halaman siswa otomatis tersinkronisasi!
                </p>
              </div>
            </div>
          </div>

          {/* SINGLE WHATSAPP NUMBER INPUT */}
          <div className="p-5 bg-emerald-50 border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-heading font-black text-sm text-black uppercase flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Nomor WhatsApp Utama Admin (Satu Input Untuk Seluruh Web)</span>
              </label>
              <span className="font-mono text-[11px] bg-black text-amber-300 px-2 py-0.5 font-bold">
                AUTO-SYNC KE SEMUA TOMBOL
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={config.general?.content?.whatsappNumber || ""}
                  onChange={(e) => updateSectionContent("general", "whatsappNumber", e.target.value)}
                  className="w-full p-3 bg-white border-2 border-black font-mono text-sm font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:bg-amber-50"
                  placeholder="Contoh: 08123456789 atau 628123456789"
                />
              </div>

              <div className="px-4 py-2.5 bg-black text-white border-2 border-black flex items-center gap-3 shrink-0 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">HASIL FORMAT LINK:</span>
                  <span className="text-emerald-400 font-bold">wa.me/{normalizedWa}</span>
                </div>
                <div className="border-l border-slate-700 pl-3">
                  <span className="text-[10px] text-slate-400 block">TAMPILAN DISPLAY:</span>
                  <span className="text-amber-300 font-bold">{formattedPhone}</span>
                </div>
              </div>
            </div>

            <p className="font-mono text-[11px] text-slate-700 leading-relaxed">
              💡 <em>Anda bisa memasukkan format dengan awalan <code>08xxx</code>, <code>628xxx</code>, atau <code>+62 8xxx</code>. Sistem secara otomatis mengonversinya menjadi format internasional yang valid untuk seluruh tombol WhatsApp di website.</em>
            </p>
          </div>

          {/* Sub-element Visibility Toggles for Footer */}
          <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
            <span className="font-mono text-[11px] font-black uppercase text-slate-700 block mb-2">
              🎛️ Visibilitas Kolom &amp; Elemen Footer:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <MiniToggle
                label="Status Strip Atas"
                subLabel="[SYS_STATUS: 100%]"
                isVisible={config.general?.content?.showStatusStrip}
                onToggle={() => updateSectionContent("general", "showStatusStrip", config.general?.content?.showStatusStrip === false)}
              />
              <MiniToggle
                label="Kolom Brand & Profil"
                subLabel="Logo & Deskripsi"
                isVisible={config.general?.content?.showBrandInfo}
                onToggle={() => updateSectionContent("general", "showBrandInfo", config.general?.content?.showBrandInfo === false)}
              />
              <MiniToggle
                label="Kolom Program Modul"
                subLabel="Daftar Modul Kursus"
                isVisible={config.general?.content?.showProgramsCol}
                onToggle={() => updateSectionContent("general", "showProgramsCol", config.general?.content?.showProgramsCol === false)}
              />
              <MiniToggle
                label="Kolom Lokasi & Kontak"
                subLabel="Alamat & Jam Kerja"
                isVisible={config.general?.content?.showContactCol}
                onToggle={() => updateSectionContent("general", "showContactCol", config.general?.content?.showContactCol === false)}
              />
            </div>
          </div>

          {/* BRAND & LEMBAGA INFO */}
          <div className="space-y-4 pt-2 border-t-2 border-black/20">
            <h3 className="font-heading font-black text-base text-black flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-500" />
              <span>Informasi Profil Lembaga &amp; Lokasi Footer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                  Nama Brand / Lembaga
                </label>
                <input
                  type="text"
                  value={config.general?.content?.brandName || ""}
                  onChange={(e) => updateSectionContent("general", "brandName", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-heading font-bold text-sm shadow-[2px_2px_0px_0px_#000]"
                  placeholder="GWA.TECH"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                  Tagline Lembaga
                </label>
                <input
                  type="text"
                  value={config.general?.content?.brandTagline || ""}
                  onChange={(e) => updateSectionContent("general", "brandTagline", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                  placeholder="// Gesit, Wawasan, Aplikatif"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Deskripsi Lembaga (Footer)
              </label>
              <textarea
                rows={2}
                value={config.general?.content?.brandDescription || ""}
                onChange={(e) => updateSectionContent("general", "brandDescription", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                  Alamat Kantor &amp; Lab Kursus
                </label>
                <input
                  type="text"
                  value={config.general?.content?.address || ""}
                  onChange={(e) => updateSectionContent("general", "address", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                  Jam Operasional Belajar
                </label>
                <input
                  type="text"
                  value={config.general?.content?.workingHours || ""}
                  onChange={(e) => updateSectionContent("general", "workingHours", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                  placeholder="Senin - Sabtu: 08.30 - 21.00 WIB"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Hak Cipta (Copyright Footer)
              </label>
              <input
                type="text"
                value={config.general?.content?.copyright || ""}
                onChange={(e) => updateSectionContent("general", "copyright", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          {/* EDITABLE PROGRAM MODUL DI FOOTER */}
          <div className="space-y-4 pt-4 border-t-2 border-black/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base text-black flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-500" />
                  <span>Daftar Link Program Modul di Footer ({config.general?.content?.footerPrograms?.length || 4} Item)</span>
                </h3>
                <p className="font-mono text-[11px] text-slate-600">
                  Ubah teks tautan, target link, dan atur visibilitas link program yang ditampilkan di kolom footer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const defaultList = [
                    { isVisible: true, label: "Microsoft Word Master", link: "/#program" },
                    { isVisible: true, label: "Microsoft Excel Expert", link: "/#program" },
                    { isVisible: true, label: "Microsoft PowerPoint Pro", link: "/#program" },
                    { isVisible: true, label: "Paket Mahir 3-in-1 Kantor", link: "/#program" }
                  ];
                  const currentList = config.general?.content?.footerPrograms || defaultList;
                  const newPrograms = [
                    ...currentList,
                    {
                      isVisible: true,
                      label: "Modul Baru",
                      link: "/#program"
                    }
                  ];
                  updateSectionContent("general", "footerPrograms", newPrograms);
                }}
                className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Link</span>
              </button>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Judul Header Kolom Program
              </label>
              <input
                type="text"
                value={config.general?.content?.footerProgramsTitle || "PROGRAM MODUL"}
                onChange={(e) => updateSectionContent("general", "footerProgramsTitle", e.target.value)}
                className="w-full sm:w-1/2 p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs font-bold shadow-[2px_2px_0px_0px_#000]"
                placeholder="PROGRAM MODUL"
              />
            </div>

            <div className="space-y-3">
              {(() => {
                const defaultList = [
                  { isVisible: true, label: "Microsoft Word Master", link: "/#program" },
                  { isVisible: true, label: "Microsoft Excel Expert", link: "/#program" },
                  { isVisible: true, label: "Microsoft PowerPoint Pro", link: "/#program" },
                  { isVisible: true, label: "Paket Mahir 3-in-1 Kantor", link: "/#program" }
                ];
                const list = config.general?.content?.footerPrograms || defaultList;

                return list.map((item, idx) => {
                  const isLinkVis = item.isVisible !== false;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-all ${
                        isLinkVis ? "bg-[#FFFDF5]" : "bg-slate-100 opacity-60"
                      }`}
                    >
                      <div className="flex flex-1 flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <label className="block font-mono text-[9px] font-bold text-slate-600 uppercase mb-0.5">Label / Nama Program</label>
                          <input
                            type="text"
                            value={item.label || ""}
                            onChange={(e) => {
                              const newProgs = [...list];
                              newProgs[idx] = { ...newProgs[idx], label: e.target.value };
                              updateSectionContent("general", "footerPrograms", newProgs);
                            }}
                            className="w-full p-1.5 bg-white border border-black font-mono text-xs font-bold"
                            placeholder="Nama Program"
                          />
                        </div>
                        <div className="sm:w-1/3">
                          <label className="block font-mono text-[9px] font-bold text-slate-600 uppercase mb-0.5">Target Link</label>
                          <input
                            type="text"
                            value={item.link || "/#program"}
                            onChange={(e) => {
                              const newProgs = [...list];
                              newProgs[idx] = { ...newProgs[idx], link: e.target.value };
                              updateSectionContent("general", "footerPrograms", newProgs);
                            }}
                            className="w-full p-1.5 bg-white border border-black font-mono text-xs"
                            placeholder="/#program"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newProgs = [...list];
                            newProgs[idx] = { ...newProgs[idx], isVisible: !isLinkVis };
                            updateSectionContent("general", "footerPrograms", newProgs);
                          }}
                          className={`px-2.5 py-1 font-mono text-[10px] font-black uppercase border border-black cursor-pointer ${
                            isLinkVis ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                          }`}
                        >
                          {isLinkVis ? "✓ TAMPIL" : "✕ SEMBUNYI"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newProgs = list.filter((_, i) => i !== idx);
                            updateSectionContent("general", "footerPrograms", newProgs);
                          }}
                          className="text-rose-600 hover:text-rose-800 font-mono text-xs font-bold p-1 cursor-pointer"
                          title="Hapus Link Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & VISIBILITAS GLOBAL */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-amber-100 border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-black text-sm text-black">
                Pusat Kontrol Tampilan Halaman Utama (/)
              </p>
              <p className="font-medium text-xs text-slate-800 mt-0.5">
                Klik tombol toggle <strong className="underline">TAMPILKAN / SEMBUNYIKAN</strong> pada bagian yang diinginkan, lalu klik <strong>&quot;Simpan Perubahan&quot;</strong> di pojok kanan atas. Anda juga bisa mengatur visibilitas per sub-elemen/kartu di dalam masing-masing tab section.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionList.map((sec, idx) => {
              const isVis = config[sec.key]?.is_visible !== false;
              return (
                <div
                  key={sec.key}
                  className={`p-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-between gap-4 transition-all ${
                    isVis ? "bg-white" : "bg-slate-100 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-mono font-bold text-sm ${
                      isVis ? "bg-amber-300 text-black" : "bg-slate-300 text-slate-600"
                    }`}>
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-base text-black">
                          {sec.label}
                        </span>
                      </div>
                      <span className={`inline-block font-mono text-[10px] font-bold uppercase px-1.5 py-0.2 border border-black mt-1 ${
                        isVis ? "bg-emerald-300 text-black" : "bg-rose-200 text-rose-800"
                      }`}>
                        {isVis ? "✓ AKTIF DITAMPILKAN" : "✕ DISEMBUNYIKAN"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSectionVisibility(sec.key)}
                      className={`px-3 py-1.5 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer ${
                        isVis 
                          ? "bg-rose-500 hover:bg-rose-400 text-white" 
                          : "bg-emerald-400 hover:bg-emerald-300 text-black"
                      }`}
                    >
                      {isVis ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isVis ? "Sembunyikan" : "Tampilkan"}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab(sec.key)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-bold uppercase cursor-pointer"
                      title="Edit Konten Teks Bagian Ini"
                    >
                      Edit ✎
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TOP ANNOUNCEMENT BAR */}
      {/* ========================================================================= */}
      {activeTab === "announcement" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Top Announcement Bar (Header Berjalan)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("announcement")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.announcement?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.announcement?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          {/* Sub-element Visibility Toggles */}
          <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
            <span className="font-mono text-[11px] font-black uppercase text-slate-700 block mb-2">
              🎛️ Visibilitas Elemen di Bar Ini:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MiniToggle
                label="Badge Status Kiri ([BATCH_2026 // OPEN])"
                isVisible={config.announcement.content.showBadge}
                onToggle={() => updateSectionContent("announcement", "showBadge", config.announcement.content.showBadge === false)}
              />
              <MiniToggle
                label="Tombol CTA WhatsApp Kanan ([CEK SLOT >])"
                isVisible={config.announcement.content.showButton}
                onToggle={() => updateSectionContent("announcement", "showButton", config.announcement.content.showButton === false)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Badge Status Kiri (Desktop)
              </label>
              <input
                type="text"
                value={config.announcement.content.batchStatus || ""}
                onChange={(e) => updateSectionContent("announcement", "batchStatus", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                placeholder="[BATCH_2026 // OPEN]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Badge Status Kiri (Mobile)
              </label>
              <input
                type="text"
                value={config.announcement.content.onlineText || ""}
                onChange={(e) => updateSectionContent("announcement", "onlineText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                placeholder="[ONLINE]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Pengumuman Tengah 1 (Utama)
              </label>
              <input
                type="text"
                value={config.announcement.content.marqueeText1 || ""}
                onChange={(e) => updateSectionContent("announcement", "marqueeText1", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Pengumuman Tengah 2 (Sekunder)
              </label>
              <input
                type="text"
                value={config.announcement.content.marqueeText2 || ""}
                onChange={(e) => updateSectionContent("announcement", "marqueeText2", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Pengumuman Tengah 3 (Aksi)
              </label>
              <input
                type="text"
                value={config.announcement.content.marqueeText3 || ""}
                onChange={(e) => updateSectionContent("announcement", "marqueeText3", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t-2 border-black/20">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Tombol CTA Kanan
              </label>
              <input
                type="text"
                value={config.announcement.content.buttonText || ""}
                onChange={(e) => updateSectionContent("announcement", "buttonText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                placeholder="CEK SLOT >"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                <span>Pesan Template WhatsApp Tombol</span>
                <span className="text-[10px] text-emerald-700">✓ Menggunakan No. WA Utama</span>
              </label>
              <input
                type="text"
                value={config.announcement.content.whatsappMessage || ""}
                onChange={(e) => updateSectionContent("announcement", "whatsappMessage", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HERO SECTION */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Hero Section (Bagian Utama Atas)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("hero")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.hero?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.hero?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          {/* Sub-element Visibility Toggles for Hero */}
          <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
            <span className="font-mono text-[11px] font-black uppercase text-slate-700 block mb-2">
              🎛️ Visibilitas Elemen di Hero Section:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <MiniToggle
                label="Badge Pill Atas"
                subLabel="[⚡ METODE EKSKLUSIF...]"
                isVisible={config.hero.content.showBadge}
                onToggle={() => updateSectionContent("hero", "showBadge", config.hero.content.showBadge === false)}
              />
              <MiniToggle
                label="Tombol CTA WhatsApp"
                subLabel="Tombol Utama Orange"
                isVisible={config.hero.content.showCtaWhatsapp}
                onToggle={() => updateSectionContent("hero", "showCtaWhatsapp", config.hero.content.showCtaWhatsapp === false)}
              />
              <MiniToggle
                label="Tombol Sekunder Silabus"
                subLabel="Tombol Putih Lihat Modul"
                isVisible={config.hero.content.showCtaSecondary}
                onToggle={() => updateSectionContent("hero", "showCtaSecondary", config.hero.content.showCtaSecondary === false)}
              />
              <MiniToggle
                label="3 Trust Badges"
                subLabel="Praktik, Sertifikat, PC"
                isVisible={config.hero.content.showTrustBadges}
                onToggle={() => updateSectionContent("hero", "showTrustBadges", config.hero.content.showTrustBadges === false)}
              />
              <MiniToggle
                label="Floating Stat Widgets"
                subLabel="Box Alumni & Workstation"
                isVisible={config.hero.content.showFloatingBadges}
                onToggle={() => updateSectionContent("hero", "showFloatingBadges", config.hero.content.showFloatingBadges === false)}
              />
              <MiniToggle
                label="Simulator Window Kanan"
                subLabel="Interactive Terminal Lab"
                isVisible={config.hero.content.showSimulator}
                onToggle={() => updateSectionContent("hero", "showSimulator", config.hero.content.showSimulator === false)}
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
              Badge Atas (Pill Badge)
            </label>
            <input
              type="text"
              value={config.hero.content.badgeText || ""}
              onChange={(e) => updateSectionContent("hero", "badgeText", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Headline Baris 1
              </label>
              <input
                type="text"
                value={config.hero.content.headlinePrefix || ""}
                onChange={(e) => updateSectionContent("hero", "headlinePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Headline Baris 2
              </label>
              <input
                type="text"
                value={config.hero.content.headlineSub || ""}
                onChange={(e) => updateSectionContent("hero", "headlineSub", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Headline Highlight (Kotak Orange)
              </label>
              <input
                type="text"
                value={config.hero.content.headlineHighlight || ""}
                onChange={(e) => updateSectionContent("hero", "headlineHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
              Deskripsi Paragraf Hero
            </label>
            <textarea
              rows={3}
              value={config.hero.content.description || ""}
              onChange={(e) => updateSectionContent("hero", "description", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-sm shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t-2 border-black/20">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Tombol CTA WhatsApp
              </label>
              <input
                type="text"
                value={config.hero.content.ctaWhatsappText || ""}
                onChange={(e) => updateSectionContent("hero", "ctaWhatsappText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                <span>Pesan Template WhatsApp Tombol CTA</span>
                <span className="text-[10px] text-emerald-700">✓ Menggunakan No. WA Utama</span>
              </label>
              <input
                type="text"
                value={config.hero.content.ctaWhatsappMessage || ""}
                onChange={(e) => updateSectionContent("hero", "ctaWhatsappMessage", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Teks Tombol Sekunder (Silabus)
              </label>
              <input
                type="text"
                value={config.hero.content.ctaSecondaryText || ""}
                onChange={(e) => updateSectionContent("hero", "ctaSecondaryText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
                Link Target Tombol Sekunder
              </label>
              <input
                type="text"
                value={config.hero.content.ctaSecondaryLink || "/#program"}
                onChange={(e) => updateSectionContent("hero", "ctaSecondaryLink", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          {/* 3 Trust Badges */}
          <div className="pt-2 border-t-2 border-black/20">
            <h4 className="font-mono text-xs font-black uppercase text-black mb-3">
              3 Trust Badges (Kelebihan Cepat di Bawah Tombol)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-600 uppercase mb-1">Badge 1</label>
                <input
                  type="text"
                  value={config.hero.content.trustBadge1 || ""}
                  onChange={(e) => updateSectionContent("hero", "trustBadge1", e.target.value)}
                  className="w-full p-2 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[1.5px_1.5px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-600 uppercase mb-1">Badge 2</label>
                <input
                  type="text"
                  value={config.hero.content.trustBadge2 || ""}
                  onChange={(e) => updateSectionContent("hero", "trustBadge2", e.target.value)}
                  className="w-full p-2 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[1.5px_1.5px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-600 uppercase mb-1">Badge 3</label>
                <input
                  type="text"
                  value={config.hero.content.trustBadge3 || ""}
                  onChange={(e) => updateSectionContent("hero", "trustBadge3", e.target.value)}
                  className="w-full p-2 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[1.5px_1.5px_0px_0px_#000]"
                />
              </div>
            </div>
          </div>

          {/* Floating Simulator Badges */}
          <div className="pt-2 border-t-2 border-black/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-600 uppercase mb-1">Floating Box Judul</label>
              <input
                type="text"
                value={config.hero.content.floatingBadgeLeftTitle || ""}
                onChange={(e) => updateSectionContent("hero", "floatingBadgeLeftTitle", e.target.value)}
                className="w-full p-2 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[1.5px_1.5px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-600 uppercase mb-1">Floating Box Nilai</label>
              <input
                type="text"
                value={config.hero.content.floatingBadgeLeftValue || ""}
                onChange={(e) => updateSectionContent("hero", "floatingBadgeLeftValue", e.target.value)}
                className="w-full p-2 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[1.5px_1.5px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-600 uppercase mb-1">Floating Box Kanan Atas</label>
              <input
                type="text"
                value={config.hero.content.floatingBadgeRightText || ""}
                onChange={(e) => updateSectionContent("hero", "floatingBadgeRightText", e.target.value)}
                className="w-full p-2 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[1.5px_1.5px_0px_0px_#000]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KEUNGGULAN / 3 PILAR */}
      {/* ========================================================================= */}
      {activeTab === "values" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Keunggulan (3 Pilar Filosofi)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("values")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.values?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.values?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          {/* Section Header Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase">Badge Section</label>
                <button
                  type="button"
                  onClick={() => updateSectionContent("values", "showBadge", config.values.content.showBadge === false)}
                  className="font-mono text-[10px] text-blue-700 underline font-bold"
                >
                  {config.values.content.showBadge !== false ? "✓ Tampil" : "✕ Sembunyi"}
                </button>
              </div>
              <input
                type="text"
                value={config.values.content.badgeText || ""}
                onChange={(e) => updateSectionContent("values", "badgeText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Utama</label>
              <input
                type="text"
                value={config.values.content.titlePrefix || ""}
                onChange={(e) => updateSectionContent("values", "titlePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Highlight</label>
              <input
                type="text"
                value={config.values.content.titleHighlight || ""}
                onChange={(e) => updateSectionContent("values", "titleHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Deskripsi Section</label>
            <textarea
              rows={2}
              value={config.values.content.description || ""}
              onChange={(e) => updateSectionContent("values", "description", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-xs shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* 3 Pillar Cards with Individual Toggle */}
          <div className="pt-4 border-t-2 border-black/20 space-y-6">
            <h3 className="font-mono text-sm font-black uppercase text-black">
              Edit Kartu Pilar &amp; Atur Visibilitas Per Pilar:
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {config.values.content.items?.map((item, idx) => {
                const isItemVis = item.isVisible !== false;
                return (
                  <div key={item.id || idx} className={`p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-3 transition-all ${
                    isItemVis ? "bg-[#FFFDF5]" : "bg-slate-100 opacity-60"
                  }`}>
                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                      <span className="font-mono text-xs font-bold text-black uppercase">
                        Pilar 0{idx + 1} ({item.title})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = [...config.values.content.items];
                          newItems[idx].isVisible = !isItemVis;
                          updateSectionContent("values", "items", newItems);
                        }}
                        className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase border border-black cursor-pointer ${
                          isItemVis ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                        }`}
                      >
                        {isItemVis ? "✓ TAMPIL" : "✕ SEMBUNYI"}
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Judul Pilar</label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const newItems = [...config.values.content.items];
                          newItems[idx].title = e.target.value;
                          updateSectionContent("values", "items", newItems);
                        }}
                        className="w-full p-2 bg-white border border-black font-heading font-black text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Subjudul</label>
                      <input
                        type="text"
                        value={item.subtitle || ""}
                        onChange={(e) => {
                          const newItems = [...config.values.content.items];
                          newItems[idx].subtitle = e.target.value;
                          updateSectionContent("values", "items", newItems);
                        }}
                        className="w-full p-2 bg-white border border-black font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Deskripsi</label>
                      <textarea
                        rows={3}
                        value={item.desc || ""}
                        onChange={(e) => {
                          const newItems = [...config.values.content.items];
                          newItems[idx].desc = e.target.value;
                          updateSectionContent("values", "items", newItems);
                        }}
                        className="w-full p-2 bg-white border border-black font-sans text-xs"
                      />
                    </div>

                    {/* Bullet points */}
                    <div>
                      <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-1">3 Poin Unggulan</label>
                      {item.points?.map((pt, pIdx) => (
                        <input
                          key={pIdx}
                          type="text"
                          value={pt || ""}
                          onChange={(e) => {
                            const newItems = [...config.values.content.items];
                            newItems[idx].points[pIdx] = e.target.value;
                            updateSectionContent("values", "items", newItems);
                          }}
                          className="w-full p-1.5 bg-white border border-black font-mono text-xs mb-1.5"
                          placeholder={`Poin ${pIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PROGRAM & MODUL */}
      {/* ========================================================================= */}
      {activeTab === "programs" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Program &amp; Modul Kursus
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("programs")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.programs?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.programs?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase">Badge Section</label>
                <button
                  type="button"
                  onClick={() => updateSectionContent("programs", "showBadge", config.programs.content.showBadge === false)}
                  className="font-mono text-[10px] text-blue-700 underline font-bold"
                >
                  {config.programs.content.showBadge !== false ? "✓ Tampil" : "✕ Sembunyi"}
                </button>
              </div>
              <input
                type="text"
                value={config.programs.content.badgeText || ""}
                onChange={(e) => updateSectionContent("programs", "badgeText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Baris 1</label>
              <input
                type="text"
                value={config.programs.content.titlePrefix || ""}
                onChange={(e) => updateSectionContent("programs", "titlePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Highlight</label>
              <input
                type="text"
                value={config.programs.content.titleHighlight || ""}
                onChange={(e) => updateSectionContent("programs", "titleHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Deskripsi Section</label>
            <textarea
              rows={2}
              value={config.programs.content.description || ""}
              onChange={(e) => updateSectionContent("programs", "description", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-xs shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* 3 Modules Edit List with Visibilities */}
          <div className="pt-4 border-t-2 border-black/20 space-y-6">
            <h3 className="font-mono text-sm font-black uppercase text-black">
              Edit Rincian Modul &amp; Atur Visibilitas Per Modul:
            </h3>

            <div className="space-y-6">
              {config.programs.content.items?.map((prog, idx) => {
                const isProgVis = prog.isVisible !== false;
                return (
                  <div key={prog.id || idx} className={`p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-4 transition-all ${
                    isProgVis ? "bg-[#FFFDF5]" : "bg-slate-100 opacity-60"
                  }`}>
                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                      <span className="font-heading font-black text-base text-black uppercase">
                        Modul 0{idx + 1}: {prog.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-black text-amber-300 px-2 py-0.5">
                          {prog.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...config.programs.content.items];
                            newItems[idx].isVisible = !isProgVis;
                            updateSectionContent("programs", "items", newItems);
                          }}
                          className={`px-2.5 py-0.5 font-mono text-[11px] font-black uppercase border border-black cursor-pointer ${
                            isProgVis ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                          }`}
                        >
                          {isProgVis ? "✓ TAMPIL" : "✕ SEMBUNYI"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Nama Modul</label>
                        <input
                          type="text"
                          value={prog.title || ""}
                          onChange={(e) => {
                            const newItems = [...config.programs.content.items];
                            newItems[idx].title = e.target.value;
                            updateSectionContent("programs", "items", newItems);
                          }}
                          className="w-full p-2 bg-white border border-black font-heading font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Subjudul / Topik</label>
                        <input
                          type="text"
                          value={prog.subtitle || ""}
                          onChange={(e) => {
                            const newItems = [...config.programs.content.items];
                            newItems[idx].subtitle = e.target.value;
                            updateSectionContent("programs", "items", newItems);
                          }}
                          className="w-full p-2 bg-white border border-black font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Durasi Kelas</label>
                        <input
                          type="text"
                          value={prog.duration || ""}
                          onChange={(e) => {
                            const newItems = [...config.programs.content.items];
                            newItems[idx].duration = e.target.value;
                            updateSectionContent("programs", "items", newItems);
                          }}
                          className="w-full p-2 bg-white border border-black font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Deskripsi Singkat</label>
                      <textarea
                        rows={2}
                        value={prog.desc || ""}
                        onChange={(e) => {
                          const newItems = [...config.programs.content.items];
                          newItems[idx].desc = e.target.value;
                          updateSectionContent("programs", "items", newItems);
                        }}
                        className="w-full p-2 bg-white border border-black font-sans text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase mb-0.5">Target Kelulusan &amp; Hasil Belajar</label>
                      <input
                        type="text"
                        value={prog.targetHasil || ""}
                        onChange={(e) => {
                          const newItems = [...config.programs.content.items];
                          newItems[idx].targetHasil = e.target.value;
                          updateSectionContent("programs", "items", newItems);
                        }}
                        className="w-full p-2 bg-white border border-black font-mono text-xs"
                      />
                    </div>

                    {/* Syllabus editor */}
                    <div className="pt-2 border-t border-dashed border-black">
                      <label className="block font-mono text-[10px] font-bold text-slate-800 uppercase mb-2">
                        Silabus Pertemuan:
                      </label>
                      <div className="space-y-2">
                        {prog.kurikulum?.map((k, kIdx) => (
                          <div key={kIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={k.session || ""}
                              onChange={(e) => {
                                const newItems = [...config.programs.content.items];
                                newItems[idx].kurikulum[kIdx].session = e.target.value;
                                updateSectionContent("programs", "items", newItems);
                              }}
                              className="w-32 p-1.5 bg-black text-amber-300 font-mono text-xs font-bold shrink-0"
                              placeholder="Sesi 01-02"
                            />
                            <input
                              type="text"
                              value={k.topic || ""}
                              onChange={(e) => {
                                const newItems = [...config.programs.content.items];
                                newItems[idx].kurikulum[kIdx].topic = e.target.value;
                                updateSectionContent("programs", "items", newItems);
                              }}
                              className="flex-1 p-1.5 bg-white border border-black font-sans text-xs"
                              placeholder="Materi yang dipelajari"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3-in-1 Bundle Promo Card */}
          <div className="pt-4 border-t-2 border-black/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-black uppercase text-black">
                Banner Promo Paket 3-in-1
              </h3>
              <button
                type="button"
                onClick={() => updateSectionContent("programs", "showPromoBanner", config.programs.content.showPromoBanner === false)}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.programs.content.showPromoBanner !== false ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                }`}
              >
                {config.programs.content.showPromoBanner !== false ? "✓ Banner Ditampilkan" : "✕ Banner Disembunyikan"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Badge Promo</label>
                <input
                  type="text"
                  value={config.programs.content.promoBadge || ""}
                  onChange={(e) => updateSectionContent("programs", "promoBadge", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Paket</label>
                <input
                  type="text"
                  value={config.programs.content.promoTitle || ""}
                  onChange={(e) => updateSectionContent("programs", "promoTitle", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Deskripsi Promo</label>
              <textarea
                rows={2}
                value={config.programs.content.promoDesc || ""}
                onChange={(e) => updateSectionContent("programs", "promoDesc", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Teks Tombol Promo</label>
                <input
                  type="text"
                  value={config.programs.content.promoButtonText || ""}
                  onChange={(e) => updateSectionContent("programs", "promoButtonText", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                  <span>Pesan Template WhatsApp Promo</span>
                  <span className="text-[10px] text-emerald-700">✓ Menggunakan No. WA Utama</span>
                </label>
                <input
                  type="text"
                  value={config.programs.content.promoWhatsappMessage || ""}
                  onChange={(e) => updateSectionContent("programs", "promoWhatsappMessage", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: FASILITAS & LAB 5-PC */}
      {/* ========================================================================= */}
      {activeTab === "fasilitas" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Fasilitas Lab &amp; Status 5 Workstation
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("fasilitas")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.fasilitas?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.fasilitas?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          {/* Sub-blocks Visibility Toggles for Facilities */}
          <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
            <span className="font-mono text-[11px] font-black uppercase text-slate-700 block mb-2">
              🎛️ Visibilitas Blok-Blok di Fasilitas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MiniToggle
                label="Denah 5 Workstation PC"
                subLabel="Interaktif Map Meja Lab"
                isVisible={config.fasilitas.content.showWorkstations}
                onToggle={() => updateSectionContent("fasilitas", "showWorkstations", config.fasilitas.content.showWorkstations === false)}
              />
              <MiniToggle
                label="Daftar 6 Fasilitas Lab"
                subLabel="AC, WiFi, Modul, Garansi"
                isVisible={config.fasilitas.content.showFacilitiesList}
                onToggle={() => updateSectionContent("fasilitas", "showFacilitiesList", config.fasilitas.content.showFacilitiesList === false)}
              />
              <MiniToggle
                label="4 Angka Metrik Statistik"
                subLabel="Alumni, Rasio, Kepuasan"
                isVisible={config.fasilitas.content.showStats}
                onToggle={() => updateSectionContent("fasilitas", "showStats", config.fasilitas.content.showStats === false)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase">Badge Section</label>
                <button
                  type="button"
                  onClick={() => updateSectionContent("fasilitas", "showBadge", config.fasilitas.content.showBadge === false)}
                  className="font-mono text-[10px] text-blue-700 underline font-bold"
                >
                  {config.fasilitas.content.showBadge !== false ? "✓ Tampil" : "✕ Sembunyi"}
                </button>
              </div>
              <input
                type="text"
                value={config.fasilitas.content.badgeText || ""}
                onChange={(e) => updateSectionContent("fasilitas", "badgeText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Baris 1</label>
              <input
                type="text"
                value={config.fasilitas.content.titlePrefix || ""}
                onChange={(e) => updateSectionContent("fasilitas", "titlePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Highlight</label>
              <input
                type="text"
                value={config.fasilitas.content.titleHighlight || ""}
                onChange={(e) => updateSectionContent("fasilitas", "titleHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          {/* Status 5 PC Workstations */}
          <div className="pt-4 border-t-2 border-black/20 space-y-4">
            <h3 className="font-mono text-sm font-black uppercase text-black">
              Status 5 Unit PC Workstation Lab:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {config.fasilitas.content.pcStations?.map((pc, idx) => (
                <div key={pc.id || idx} className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black">SLOT 0{pc.id}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newStations = [...config.fasilitas.content.pcStations];
                        newStations[idx].isOnline = !newStations[idx].isOnline;
                        newStations[idx].status = newStations[idx].isOnline ? "TERSEDIA" : "TERISI (BOOKED)";
                        updateSectionContent("fasilitas", "pcStations", newStations);
                      }}
                      className={`px-1.5 py-0.5 font-mono text-[10px] font-black uppercase border border-black cursor-pointer ${
                        pc.isOnline ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                      }`}
                    >
                      {pc.isOnline ? "ONLINE" : "BOOKED"}
                    </button>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-600 uppercase">Teks Status</label>
                    <input
                      type="text"
                      value={pc.status || ""}
                      onChange={(e) => {
                        const newStations = [...config.fasilitas.content.pcStations];
                        newStations[idx].status = e.target.value;
                        updateSectionContent("fasilitas", "pcStations", newStations);
                      }}
                      className="w-full p-1 bg-white border border-black font-mono text-[10px]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] text-slate-600 uppercase">Spesifikasi</label>
                    <input
                      type="text"
                      value={pc.specs || ""}
                      onChange={(e) => {
                        const newStations = [...config.fasilitas.content.pcStations];
                        newStations[idx].specs = e.target.value;
                        updateSectionContent("fasilitas", "pcStations", newStations);
                      }}
                      className="w-full p-1 bg-white border border-black font-mono text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daftar Fasilitas Lab (Cards) */}
          <div className="pt-4 border-t-2 border-black/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm font-black uppercase text-black">
                  Daftar Fasilitas Lab ({config.fasilitas.content.facilities?.length || 0} Item):
                </h3>
                <p className="font-mono text-[11px] text-slate-600">
                  Edit judul, deskripsi, icon, warna aksen, dan atur visibilitas masing-masing kartu fasilitas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newFacilities = [
                    ...(config.fasilitas.content.facilities || []),
                    {
                      isVisible: true,
                      title: "Fasilitas Baru",
                      desc: "Deskripsi fasilitas yang disediakan untuk kenyamanan siswa saat belajar...",
                      iconName: "Monitor",
                      color: "bg-amber-300"
                    }
                  ];
                  updateSectionContent("fasilitas", "facilities", newFacilities);
                }}
                className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Fasilitas</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.fasilitas.content.facilities?.map((fac, idx) => {
                const isFacVis = fac.isVisible !== false;
                return (
                  <div 
                    key={idx} 
                    className={`p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-3 transition-all ${
                      isFacVis ? "bg-[#FFFDF5]" : "bg-slate-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-black pb-2">
                      <span className="font-mono text-xs font-bold text-black uppercase">
                        Fasilitas #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newFacilities = [...config.fasilitas.content.facilities];
                            newFacilities[idx].isVisible = !isFacVis;
                            updateSectionContent("fasilitas", "facilities", newFacilities);
                          }}
                          className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase border border-black cursor-pointer ${
                            isFacVis ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                          }`}
                        >
                          {isFacVis ? "✓ TAMPIL" : "✕ SEMBUNYI"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newFacilities = config.fasilitas.content.facilities.filter((_, i) => i !== idx);
                            updateSectionContent("fasilitas", "facilities", newFacilities);
                          }}
                          className="text-rose-600 hover:text-rose-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer ml-1"
                          title="Hapus Fasilitas Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Judul Fasilitas</label>
                      <input
                        type="text"
                        value={fac.title || ""}
                        onChange={(e) => {
                          const newFacilities = [...config.fasilitas.content.facilities];
                          newFacilities[idx].title = e.target.value;
                          updateSectionContent("fasilitas", "facilities", newFacilities);
                        }}
                        className="w-full p-2 bg-white border border-black font-heading font-bold text-xs"
                        placeholder="Contoh: 1 Siswa 1 Unit Komputer"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Deskripsi Fasilitas</label>
                      <textarea
                        rows={2}
                        value={fac.desc || ""}
                        onChange={(e) => {
                          const newFacilities = [...config.fasilitas.content.facilities];
                          newFacilities[idx].desc = e.target.value;
                          updateSectionContent("fasilitas", "facilities", newFacilities);
                        }}
                        className="w-full p-2 bg-white border border-black font-sans text-xs"
                        placeholder="Keterangan fasilitas..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {/* Ikon Selector with 'Lainnya' option */}
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Ikon</label>
                        {(() => {
                          const iconPresets = [
                            "Users", "Monitor", "AirVent", "HardDrive", "Wifi", "ShieldCheck",
                            "Laptop", "Cpu", "BookOpen", "Clock", "Award", "Sparkles",
                            "Printer", "Coffee", "Headphones", "Video", "Globe", "Star", "Package"
                          ];
                          const isCustomIcon = fac.iconName && !iconPresets.includes(fac.iconName);
                          return (
                            <div className="space-y-1">
                              <select
                                value={isCustomIcon ? "_custom_" : (fac.iconName || "Monitor")}
                                onChange={(e) => {
                                  const newFacilities = [...config.fasilitas.content.facilities];
                                  if (e.target.value === "_custom_") {
                                    newFacilities[idx].iconName = isCustomIcon ? fac.iconName : "HelpCircle";
                                  } else {
                                    newFacilities[idx].iconName = e.target.value;
                                  }
                                  updateSectionContent("fasilitas", "facilities", newFacilities);
                                }}
                                className="w-full p-1.5 bg-white border border-black font-mono text-xs"
                              >
                                <option value="Users">👥 Users (5 Siswa / Grup)</option>
                                <option value="Monitor">🖥️ Monitor (PC Desktop)</option>
                                <option value="AirVent">❄️ AirVent (Ruang AC)</option>
                                <option value="HardDrive">💾 HardDrive (Modul / LMS)</option>
                                <option value="Wifi">📶 Wifi (Internet Cepat)</option>
                                <option value="ShieldCheck">🛡️ ShieldCheck (Garansi)</option>
                                <option value="Laptop">💻 Laptop (Komputer Portable)</option>
                                <option value="Cpu">⚡ Cpu (Hardware / Tech)</option>
                                <option value="BookOpen">📖 BookOpen (Buku Materi)</option>
                                <option value="Clock">⏰ Clock (Waktu Fleksibel)</option>
                                <option value="Award">🏆 Award (Sertifikat Resmi)</option>
                                <option value="Sparkles">✨ Sparkles (Kelebihan Khusus)</option>
                                <option value="Printer">🖨️ Printer (Cetak Dokumen)</option>
                                <option value="Coffee">☕ Coffee (Snack / Minuman)</option>
                                <option value="Headphones">🎧 Headphones (Audio / Media)</option>
                                <option value="Video">📹 Video (Video Pembelajaran)</option>
                                <option value="Globe">🌐 Globe (Internet / Web)</option>
                                <option value="Star">⭐ Star (Fasilitas Unggulan)</option>
                                <option value="Package">📦 Package (Paket Lengkap)</option>
                                <option value="_custom_">✏️ [ Lainnya / Tulis Sendiri... ]</option>
                              </select>

                              {(isCustomIcon || fac.iconName === "HelpCircle") && (
                                <input
                                  type="text"
                                  value={fac.iconName || ""}
                                  onChange={(e) => {
                                    const newFacilities = [...config.fasilitas.content.facilities];
                                    newFacilities[idx].iconName = e.target.value;
                                    updateSectionContent("fasilitas", "facilities", newFacilities);
                                  }}
                                  className="w-full p-1 bg-amber-50 border border-black font-mono text-[11px]"
                                  placeholder="Tulis nama icon (mis: Printer, Zap, Key, dll)"
                                />
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Warna Kotak Selector with 'Lainnya' option */}
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Warna Kotak</label>
                        {(() => {
                          const colorPresets = [
                            "bg-orange-300", "bg-cyan-300", "bg-emerald-300", "bg-amber-300",
                            "bg-purple-300", "bg-rose-300", "bg-yellow-300", "bg-lime-300",
                            "bg-blue-300", "bg-indigo-300", "bg-pink-300", "bg-slate-200"
                          ];
                          const isCustomColor = fac.color && !colorPresets.includes(fac.color);
                          return (
                            <div className="space-y-1">
                              <select
                                value={isCustomColor ? "_custom_" : (fac.color || "bg-orange-300")}
                                onChange={(e) => {
                                  const newFacilities = [...config.fasilitas.content.facilities];
                                  if (e.target.value === "_custom_") {
                                    newFacilities[idx].color = isCustomColor ? fac.color : "bg-[#FDE047]";
                                  } else {
                                    newFacilities[idx].color = e.target.value;
                                  }
                                  updateSectionContent("fasilitas", "facilities", newFacilities);
                                }}
                                className="w-full p-1.5 bg-white border border-black font-mono text-xs"
                              >
                                <option value="bg-orange-300">🟠 Orange Pastel</option>
                                <option value="bg-cyan-300">🔵 Cyan Pastel</option>
                                <option value="bg-emerald-300">🟢 Emerald Pastel</option>
                                <option value="bg-amber-300">🟡 Amber Emas</option>
                                <option value="bg-purple-300">🟣 Purple Ungu</option>
                                <option value="bg-rose-300">🔴 Rose Merah Muda</option>
                                <option value="bg-yellow-300">🟡 Yellow Kuning</option>
                                <option value="bg-lime-300">🟢 Lime Hijau Muda</option>
                                <option value="bg-blue-300">🔵 Sky Blue</option>
                                <option value="bg-indigo-300">🟣 Indigo</option>
                                <option value="bg-pink-300">🌸 Pink</option>
                                <option value="bg-slate-200">⚪ Abu-abu Netral</option>
                                <option value="_custom_">✏️ [ Lainnya / Tulis Sendiri... ]</option>
                              </select>

                              {isCustomColor && (
                                <input
                                  type="text"
                                  value={fac.color || ""}
                                  onChange={(e) => {
                                    const newFacilities = [...config.fasilitas.content.facilities];
                                    newFacilities[idx].color = e.target.value;
                                    updateSectionContent("fasilitas", "facilities", newFacilities);
                                  }}
                                  className="w-full p-1 bg-amber-50 border border-black font-mono text-[11px]"
                                  placeholder="Tulis class warna (mis: bg-[#FDE047] atau bg-red-300)"
                                />
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Stats Metrics */}
          <div className="pt-4 border-t-2 border-black/20 space-y-4">
            <h3 className="font-mono text-sm font-black uppercase text-black">
              4 Angka Statistik (Metrics):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {config.fasilitas.content.stats?.map((st, idx) => (
                <div key={idx} className="p-3 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <div>
                    <label className="block font-mono text-[10px] text-slate-600 uppercase font-bold">Angka/Nilai</label>
                    <input
                      type="text"
                      value={st.value || ""}
                      onChange={(e) => {
                        const newStats = [...config.fasilitas.content.stats];
                        newStats[idx].value = e.target.value;
                        updateSectionContent("fasilitas", "stats", newStats);
                      }}
                      className="w-full p-1.5 bg-white border border-black font-heading font-black text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate-600 uppercase font-bold">Label</label>
                    <input
                      type="text"
                      value={st.label || ""}
                      onChange={(e) => {
                        const newStats = [...config.fasilitas.content.stats];
                        newStats[idx].label = e.target.value;
                        updateSectionContent("fasilitas", "stats", newStats);
                      }}
                      className="w-full p-1.5 bg-white border border-black font-mono text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: TESTIMONI ALUMNI */}
      {/* ========================================================================= */}
      {activeTab === "testimonials" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Testimoni Alumni
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("testimonials")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.testimonials?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.testimonials?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase">Badge Section</label>
                <button
                  type="button"
                  onClick={() => updateSectionContent("testimonials", "showBadge", config.testimonials.content.showBadge === false)}
                  className="font-mono text-[10px] text-blue-700 underline font-bold"
                >
                  {config.testimonials.content.showBadge !== false ? "✓ Tampil" : "✕ Sembunyi"}
                </button>
              </div>
              <input
                type="text"
                value={config.testimonials.content.badgeText || ""}
                onChange={(e) => updateSectionContent("testimonials", "badgeText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Baris 1</label>
              <input
                type="text"
                value={config.testimonials.content.titlePrefix || ""}
                onChange={(e) => updateSectionContent("testimonials", "titlePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Highlight</label>
              <input
                type="text"
                value={config.testimonials.content.titleHighlight || ""}
                onChange={(e) => updateSectionContent("testimonials", "titleHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          {/* Testimonial List Items with Individual Show/Hide */}
          <div className="pt-4 border-t-2 border-black/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-black uppercase text-black">
                Daftar Testimoni ({config.testimonials.content.reviews?.length || 0}):
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newReviews = [
                    ...(config.testimonials.content.reviews || []),
                    {
                      id: `LOG_${String((config.testimonials.content.reviews?.length || 0) + 1).padStart(2, "0")}`,
                      isVisible: true,
                      name: "Nama Alumni Baru",
                      role: "Staff Kantor",
                      company: "PT. Maju Bersama",
                      course: "Microsoft Excel Expert",
                      rating: 5,
                      comment: "Pengalaman belajar sangat menyenangkan dan aplikatif untuk pekerjaan sehari-hari.",
                      badge: "ALUMNI TERVERIFIKASI"
                    }
                  ];
                  updateSectionContent("testimonials", "reviews", newReviews);
                }}
                className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Testimoni</span>
              </button>
            </div>

            <div className="space-y-4">
              {config.testimonials.content.reviews?.map((rev, idx) => {
                const isRevVis = rev.isVisible !== false;
                return (
                  <div key={rev.id || idx} className={`p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-3 transition-all ${
                    isRevVis ? "bg-[#FFFDF5]" : "bg-slate-100 opacity-60"
                  }`}>
                    <div className="flex items-center justify-between border-b border-black pb-2">
                      <span className="font-mono text-xs font-bold text-black uppercase">
                        Testimoni #{idx + 1} ({rev.id})
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].isVisible = !isRevVis;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase border border-black cursor-pointer ${
                            isRevVis ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                          }`}
                        >
                          {isRevVis ? "✓ TAMPIL" : "✕ SEMBUNYI"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newReviews = config.testimonials.content.reviews.filter((_, i) => i !== idx);
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="text-rose-600 hover:text-rose-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Nama Alumni</label>
                        <input
                          type="text"
                          value={rev.name || ""}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].name = e.target.value;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-2 bg-white border border-black font-heading font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Posisi / Pekerjaan</label>
                        <input
                          type="text"
                          value={rev.role || ""}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].role = e.target.value;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-2 bg-white border border-black font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Perusahaan / Instansi</label>
                        <input
                          type="text"
                          value={rev.company || ""}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].company = e.target.value;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-2 bg-white border border-black font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Badge Alumni</label>
                        <input
                          type="text"
                          value={rev.badge || ""}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].badge = e.target.value;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-2 bg-white border border-black font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Isi Ulasan / Komentar</label>
                        <textarea
                          rows={2}
                          value={rev.comment || ""}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].comment = e.target.value;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-2 bg-white border border-black font-sans text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Modul Diambil</label>
                        <input
                          type="text"
                          value={rev.course || ""}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].course = e.target.value;
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-2 bg-white border border-black font-mono text-xs mb-2"
                        />
                        <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Rating Bintang (1-5)</label>
                        <select
                          value={rev.rating || 5}
                          onChange={(e) => {
                            const newReviews = [...config.testimonials.content.reviews];
                            newReviews[idx].rating = Number(e.target.value);
                            updateSectionContent("testimonials", "reviews", newReviews);
                          }}
                          className="w-full p-1.5 bg-white border border-black font-mono text-xs"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                          <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: FAQ (TANYA JAWAB) */}
      {/* ========================================================================= */}
      {activeTab === "faq" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola FAQ (Pertanyaan Umum)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("faq")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.faq?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.faq?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase">Badge Section</label>
                <button
                  type="button"
                  onClick={() => updateSectionContent("faq", "showBadge", config.faq.content.showBadge === false)}
                  className="font-mono text-[10px] text-blue-700 underline font-bold"
                >
                  {config.faq.content.showBadge !== false ? "✓ Tampil" : "✕ Sembunyi"}
                </button>
              </div>
              <input
                type="text"
                value={config.faq.content.badgeText || ""}
                onChange={(e) => updateSectionContent("faq", "badgeText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Baris 1</label>
              <input
                type="text"
                value={config.faq.content.titlePrefix || ""}
                onChange={(e) => updateSectionContent("faq", "titlePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Highlight</label>
              <input
                type="text"
                value={config.faq.content.titleHighlight || ""}
                onChange={(e) => updateSectionContent("faq", "titleHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          {/* FAQ Items List with Individual Show/Hide */}
          <div className="pt-4 border-t-2 border-black/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-black uppercase text-black">
                Daftar Pertanyaan &amp; Jawaban ({config.faq.content.faqs?.length || 0}):
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newFaqs = [
                    ...(config.faq.content.faqs || []),
                    {
                      isVisible: true,
                      q: "Pertanyaan baru...",
                      a: "Jawaban penjelasan disini..."
                    }
                  ];
                  updateSectionContent("faq", "faqs", newFaqs);
                }}
                className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah FAQ</span>
              </button>
            </div>

            <div className="space-y-4">
              {config.faq.content.faqs?.map((item, idx) => {
                const isFaqVis = item.isVisible !== false;
                return (
                  <div key={idx} className={`p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2 transition-all ${
                    isFaqVis ? "bg-[#FFFDF5]" : "bg-slate-100 opacity-60"
                  }`}>
                    <div className="flex items-center justify-between border-b border-black pb-2">
                      <span className="font-mono text-xs font-bold text-black uppercase">
                        Pertanyaan #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = [...config.faq.content.faqs];
                            newFaqs[idx].isVisible = !isFaqVis;
                            updateSectionContent("faq", "faqs", newFaqs);
                          }}
                          className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase border border-black cursor-pointer ${
                            isFaqVis ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                          }`}
                        >
                          {isFaqVis ? "✓ TAMPIL" : "✕ SEMBUNYI"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = config.faq.content.faqs.filter((_, i) => i !== idx);
                            updateSectionContent("faq", "faqs", newFaqs);
                          }}
                          className="text-rose-600 hover:text-rose-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Pertanyaan (Tanya)</label>
                      <input
                        type="text"
                        value={item.q || ""}
                        onChange={(e) => {
                          const newFaqs = [...config.faq.content.faqs];
                          newFaqs[idx].q = e.target.value;
                          updateSectionContent("faq", "faqs", newFaqs);
                        }}
                        className="w-full p-2 bg-white border border-black font-heading font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate-700 uppercase font-bold mb-0.5">Jawaban</label>
                      <textarea
                        rows={3}
                        value={item.a || ""}
                        onChange={(e) => {
                          const newFaqs = [...config.faq.content.faqs];
                          newFaqs[idx].a = e.target.value;
                          updateSectionContent("faq", "faqs", newFaqs);
                        }}
                        className="w-full p-2 bg-white border border-black font-sans text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Help Box Bottom with Toggle */}
          <div className="pt-4 border-t-2 border-black/20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-black uppercase text-black">
                Kotak Bantuan Kontak (Bawah FAQ):
              </h3>
              <button
                type="button"
                onClick={() => updateSectionContent("faq", "showHelpBox", config.faq.content.showHelpBox === false)}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.faq.content.showHelpBox !== false ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                }`}
              >
                {config.faq.content.showHelpBox !== false ? "✓ Kotak Ditampilkan" : "✕ Kotak Disembunyikan"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Judul Kotak Bantuan</label>
                <input
                  type="text"
                  value={config.faq.content.helpBoxTitle || ""}
                  onChange={(e) => updateSectionContent("faq", "helpBoxTitle", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Deskripsi Bantuan</label>
                <input
                  type="text"
                  value={config.faq.content.helpBoxDesc || ""}
                  onChange={(e) => updateSectionContent("faq", "helpBoxDesc", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                  <span>Pesan Template WhatsApp</span>
                  <span className="text-[10px] text-emerald-700">✓ No. WA Utama</span>
                </label>
                <input
                  type="text"
                  value={config.faq.content.helpBoxWhatsappMessage || ""}
                  onChange={(e) => updateSectionContent("faq", "helpBoxWhatsappMessage", e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: BANNER CTA BAWAH */}
      {/* ========================================================================= */}
      {activeTab === "cta_banner" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Banner CTA Ajakan Daftar (Bawah)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("cta_banner")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.cta_banner?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.cta_banner?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          {/* Sub-element Visibility Toggles for CTA Banner */}
          <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
            <span className="font-mono text-[11px] font-black uppercase text-slate-700 block mb-2">
              🎛️ Visibilitas Elemen di Banner CTA:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MiniToggle
                label="Badge Atas ([SYS_COMMAND...])"
                isVisible={config.cta_banner.content.showBadge}
                onToggle={() => updateSectionContent("cta_banner", "showBadge", config.cta_banner.content.showBadge === false)}
              />
              <MiniToggle
                label="Badges Fasilitas Gratis"
                subLabel="Bebas Biaya, Modul Lengkap"
                isVisible={config.cta_banner.content.showBadges}
                onToggle={() => updateSectionContent("cta_banner", "showBadges", config.cta_banner.content.showBadges === false)}
              />
              <MiniToggle
                label="Tombol Sekunder Eksplor"
                subLabel="[#] Eksplor Modul Lainnya"
                isVisible={config.cta_banner.content.showButtonSecondary}
                onToggle={() => updateSectionContent("cta_banner", "showButtonSecondary", config.cta_banner.content.showButtonSecondary === false)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Badge Atas</label>
              <input
                type="text"
                value={config.cta_banner.content.badgeText || ""}
                onChange={(e) => updateSectionContent("cta_banner", "badgeText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Headline Baris 1</label>
              <input
                type="text"
                value={config.cta_banner.content.titlePrefix || ""}
                onChange={(e) => updateSectionContent("cta_banner", "titlePrefix", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Headline Highlight</label>
              <input
                type="text"
                value={config.cta_banner.content.titleHighlight || ""}
                onChange={(e) => updateSectionContent("cta_banner", "titleHighlight", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Deskripsi Paragraf</label>
            <textarea
              rows={3}
              value={config.cta_banner.content.description || ""}
              onChange={(e) => updateSectionContent("cta_banner", "description", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-sans text-xs shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Badge Kelebihan 1</label>
              <input
                type="text"
                value={config.cta_banner.content.badge1 || ""}
                onChange={(e) => updateSectionContent("cta_banner", "badge1", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Badge Kelebihan 2</label>
              <input
                type="text"
                value={config.cta_banner.content.badge2 || ""}
                onChange={(e) => updateSectionContent("cta_banner", "badge2", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t-2 border-black/20">
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">Teks Tombol Daftar WhatsApp</label>
              <input
                type="text"
                value={config.cta_banner.content.buttonPrimaryText || ""}
                onChange={(e) => updateSectionContent("cta_banner", "buttonPrimaryText", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                <span>Pesan Template WhatsApp Tombol</span>
                <span className="text-[10px] text-emerald-700">✓ Menggunakan No. WA Utama</span>
              </label>
              <input
                type="text"
                value={config.cta_banner.content.buttonPrimaryMessage || ""}
                onChange={(e) => updateSectionContent("cta_banner", "buttonPrimaryMessage", e.target.value)}
                className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: FLOATING WHATSAPP */}
      {/* ========================================================================= */}
      {activeTab === "floating_wa" && (
        <div className="bg-white border-3 border-black p-6 shadow-[5px_5px_0px_0px_#000] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-heading font-black text-black">
                Kelola Tombol Floating WhatsApp (Pojok Kanan Bawah)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold">Status Section:</span>
              <button
                onClick={() => toggleSectionVisibility("floating_wa")}
                className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  config.floating_wa?.is_visible !== false
                    ? "bg-emerald-400 text-black"
                    : "bg-rose-400 text-white"
                }`}
              >
                {config.floating_wa?.is_visible !== false ? "✓ Ditampilkan" : "✕ Disembunyikan"}
              </button>
            </div>
          </div>

          {/* Sub-element Visibility Toggles for Floating WA */}
          <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
            <span className="font-mono text-[11px] font-black uppercase text-slate-700 block mb-2">
              🎛️ Visibilitas Elemen:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MiniToggle
                label="Tooltip Bubble Mengambang"
                subLabel="[ CHAT MENTOR GESIT >_ ] di samping tombol"
                isVisible={config.floating_wa.content.showTooltip}
                onToggle={() => updateSectionContent("floating_wa", "showTooltip", config.floating_wa.content.showTooltip === false)}
              />
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 border-2 border-black font-mono text-xs flex items-center justify-between">
            <span className="font-bold">
              🔗 Nomor Tujuan: <span className="text-emerald-800">{formattedPhone}</span>
            </span>
            <span className="text-[11px] text-slate-600">
              (Terkoneksi ke Nomor WhatsApp Utama di tab Kontak Terpusat)
            </span>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
              Teks Tooltip Mengambang (Bubble Kiri Tombol)
            </label>
            <input
              type="text"
              value={config.floating_wa.content.tooltipText || ""}
              onChange={(e) => updateSectionContent("floating_wa", "tooltipText", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
              placeholder="[ CHAT MENTOR GESIT >_ ]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-slate-800 uppercase mb-1">
              Pesan Template Saat Pengunjung Klik Tombol Floating WA
            </label>
            <textarea
              rows={2}
              value={config.floating_wa.content.whatsappMessage || ""}
              onChange={(e) => updateSectionContent("floating_wa", "whatsappMessage", e.target.value)}
              className="w-full p-2.5 bg-[#FFFDF5] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
