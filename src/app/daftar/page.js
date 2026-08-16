"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, Calendar, Phone, BookOpen, Clock, Lock, Eye, EyeOff, 
  CheckCircle2, ArrowRight, Sparkles, AlertCircle, Copy, Check, 
  ArrowLeft, RefreshCw, Loader2, ShieldCheck, Terminal, HelpCircle
} from "lucide-react";
import { getSemuaModul } from "@/lib/modulService";
import { getSemuaKelas } from "@/lib/kelasService";
import { generateIdSiswa, tambahSiswa } from "@/lib/siswaService";
import { getLandingPageConfig, formatWhatsAppUrl } from "@/lib/landingService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PendaftaranSiswaPage() {
  // ── Form State ──
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    tanggal_lahir: "",
    wa: "",
    modul_id: "",
    kelas_id: "",
    password: "",
    confirm_password: "",
  });

  const [modulList, setModulList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isGeneratingId, setIsGeneratingId] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Success Receipt State ──
  const [registeredData, setRegisteredData] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [globalSettings, setGlobalSettings] = useState(null);

  // Load modules, classes, and generate student ID on mount
  useEffect(() => {
    async function initData() {
      setIsLoadingData(true);
      try {
        const [{ data: mData }, { data: kData }, newId, { data: landingCfg }] = await Promise.all([
          getSemuaModul(),
          getSemuaKelas(),
          generateIdSiswa(),
          getLandingPageConfig()
        ]);

        if (mData && mData.length > 0) {
          setModulList(mData);
          const firstActive = mData.find((m) => (m.status || "Aktif") === "Aktif");
          setFormData((f) => ({ ...f, modul_id: firstActive ? firstActive.id : "" }));
        }
        if (kData && kData.length > 0) {
          setKelasList(kData);
        }
        if (landingCfg?.general?.content) {
          setGlobalSettings(landingCfg.general.content);
        }
        setFormData((f) => ({ ...f, id: newId }));
      } catch (err) {
        console.error("Gagal inisialisasi form pendaftaran:", err);
      } finally {
        setIsLoadingData(false);
        setIsGeneratingId(false);
      }
    }

    initData();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleRefreshId = async () => {
    setIsGeneratingId(true);
    const newId = await generateIdSiswa();
    setFormData((prev) => ({ ...prev, id: newId }));
    setIsGeneratingId(false);
  };

  const handleCopyId = () => {
    if (registeredData?.id) {
      navigator.clipboard.writeText(registeredData.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const validateForm = () => {
    if (!formData.nama.trim()) return "Nama lengkap wajib diisi.";
    if (!formData.tanggal_lahir) return "Tanggal lahir wajib diisi.";
    if (!formData.wa.trim()) return "Nomor WhatsApp aktif wajib diisi.";
    if (!formData.modul_id) return "Silakan pilih modul kursus yang diminati.";
    const chosenModul = modulList.find((m) => m.id === formData.modul_id);
    if (!chosenModul || chosenModul.status === "Tidak Aktif") {
      return "Modul yang dipilih tidak tersedia saat ini.";
    }
    if (chosenModul.status === "Akan Datang") {
      return "Modul ini berstatus 'Akan Datang' dan belum dapat dipilih untuk pendaftaran.";
    }
    if (!formData.password) return "Kata sandi (password) wajib diisi.";
    if (formData.password.length < 6) return "Kata sandi minimal 6 karakter.";
    if (formData.password !== formData.confirm_password) return "Konfirmasi kata sandi tidak cocok.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // Siapkan payload siswa baru dengan status Tidak Aktif
      const payload = {
        id: formData.id,
        nama: formData.nama.trim(),
        tanggal_lahir: formData.tanggal_lahir,
        wa: formData.wa.trim(),
        modul_id: formData.modul_id,
        kelas_id: formData.kelas_id || null,
        status: "Tidak Aktif", // Menunggu aktivasi admin
        status_bayar: "Belum Lunas",
        password: formData.password,
      };

      const { data, error: submitError } = await tambahSiswa(payload);

      if (submitError) {
        let msg = submitError.message;
        if (msg.includes("siswa_status_check")) {
          msg = "Status 'Tidak Aktif' belum diizinkan di database Supabase. Jalankan query di file database/supabase_update_constraints.sql pada Supabase SQL Editor.";
        }
        setErrorMsg("Pendaftaran gagal: " + msg);
        setIsSubmitting(false);
        return;
      }

      // Ambil nama modul & nama kelas untuk struk pendaftaran
      const selectedModul = modulList.find((m) => m.id === formData.modul_id);
      const selectedKelas = kelasList.find((k) => k.id === formData.kelas_id);

      setRegisteredData({
        id: formData.id,
        nama: formData.nama,
        wa: formData.wa,
        modulNama: selectedModul?.nama || formData.modul_id,
        kelasNama: selectedKelas ? `${selectedKelas.nama} (${selectedKelas.jadwal || "Jadwal Reguler"})` : "Konsultasi Jadwal Nanti",
        waktuDaftar: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error submit registration:", err);
      setErrorMsg("Terjadi kesalahan sistem. Silakan coba kembali beberapa saat lagi.");
      setIsSubmitting(false);
    }
  };

  const getWaConfirmationLink = () => {
    if (!registeredData) return "#";
    const pesan = `Halo Admin GWA Tech Course,\n\nSaya telah mendaftar kursus komputer online:\n- *ID Siswa*: ${registeredData.id}\n- *Nama*: ${registeredData.nama}\n- *Modul*: ${registeredData.modulNama}\n- *Pilihan Kelas*: ${registeredData.kelasNama}\n- *No. WA*: ${registeredData.wa}\n\nMohon bantuan untuk verifikasi dan aktivasi akun saya agar dapat mulai belajar. Terima kasih!`;
    const waNum = globalSettings?.whatsappNumber || "6280000000000";
    return formatWhatsAppUrl(waNum, pesan);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-slate-950 font-sans">
      <Navbar globalWhatsapp={globalSettings?.whatsappNumber} brandName={globalSettings?.brandName} />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative bg-retro-dots">
        <div className="max-w-4xl mx-auto">

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAMPILAN SUKSES / STRUK REGISTRASI DIGITAL                        */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {registeredData ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Retro Box Struk Registrasi */}
              <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden rounded-xl">
                
                {/* Header Window Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black inline-block"></span>
                    </div>
                    <span className="text-amber-300">receipt_registration_success.exe</span>
                  </div>
                  <span className="text-emerald-400 text-[11px]">[REGISTERED_OK]</span>
                </div>

                {/* Content Header Banner */}
                <div className="bg-amber-300 p-6 sm:p-8 border-b-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-black font-mono text-xs font-black uppercase border border-black shadow-[2px_2px_0px_0px_#000] mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" /> PENDAFTARAN BERHASIL DITERIMA!
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-black uppercase tracking-tight">
                      Selamat Bergabung, {registeredData.nama.split(" ")[0]}! 🎉
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 mt-1">
                      Data Anda telah tersimpan di sistem kami pada {registeredData.waktuDaftar}.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-3 text-center shadow-[3px_3px_0px_0px_#000] shrink-0 self-stretch sm:self-auto">
                    <p className="font-mono text-[10px] font-bold text-slate-600 uppercase">STATUS AKUN</p>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 bg-amber-200 border border-black font-mono text-xs font-black text-amber-950">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                      MENUNGGU AKTIVASI
                    </span>
                  </div>
                </div>

                {/* Struk Card Content */}
                <div className="p-6 sm:p-8 space-y-6 bg-[#FFFDF5]">
                  
                  {/* Highlight ID Siswa Box */}
                  <div className="bg-yellow-100 border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-700 uppercase">[KREDENSIAL_LOGIN]</p>
                      <p className="text-xs text-slate-600 mt-0.5">Nomor Induk / ID Siswa Resmi Anda:</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-mono font-black text-black bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] tracking-wider">
                          {registeredData.id}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyId}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      {copiedId ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" /> TERSALIN!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> SALIN ID SISWA
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_#000] space-y-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">[NAMA LENGKAP]</span>
                      <p className="font-heading font-black text-base text-black">{registeredData.nama}</p>
                    </div>

                    <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_#000] space-y-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">[NO. WHATSAPP]</span>
                      <p className="font-heading font-black text-base text-black">{registeredData.wa}</p>
                    </div>

                    <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_#000] space-y-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">[MODUL KURSUS]</span>
                      <p className="font-heading font-black text-base text-black">{registeredData.modulNama}</p>
                    </div>

                    <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_#000] space-y-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">[PILIHAN JADWAL KELAS]</span>
                      <p className="font-heading font-black text-base text-black">{registeredData.kelasNama}</p>
                    </div>
                  </div>

                  {/* Next Step Guide */}
                  <div className="bg-cyan-50 border-2 border-black p-5 shadow-[3px_3px_0px_0px_#000] space-y-3">
                    <h3 className="font-heading font-black text-sm uppercase text-black flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-800" />
                      Langkah Selanjutnya untuk Memulai Belajar:
                    </h3>
                    <ol className="space-y-2 font-mono text-xs text-slate-800 list-decimal list-inside leading-relaxed">
                      <li>
                        <strong>Simpan ID Siswa</strong> Anda (<span className="bg-white px-1 border border-black font-bold">{registeredData.id}</span>) beserta kata sandi yang telah Anda buat.
                      </li>
                      <li>
                        Klik tombol <strong>&quot;Konfirmasi ke Admin WhatsApp&quot;</strong> di bawah untuk memberi tahu admin bahwa Anda telah mendaftar.
                      </li>
                      <li>
                        Admin akan memverifikasi pilihan jadwal kelas dan <strong>mengaktifkan akun Anda</strong>.
                      </li>
                      <li>
                        Setelah diaktifkan, Anda dapat langsung login ke <strong>Portal Belajar Siswa</strong> untuk akses materi dan kuis.
                      </li>
                    </ol>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={getWaConfirmationLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-sm uppercase tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4" /> 📲 Konfirmasi ke Admin WhatsApp
                    </a>

                    <Link
                      href="/siswa/login"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-sm uppercase tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      <span>🚀 Ke Halaman Login Siswa</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="text-center pt-2">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 hover:text-black hover:underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda Utama
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            /* ═════════════════════════════════════════════════════════════════ */
            /* FORMULIR PENDAFTARAN SISWA BARU                                  */
            /* ═════════════════════════════════════════════════════════════════ */
            <div className="space-y-6">

              {/* Back to Home link */}
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 hover:text-black bg-white px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> &lt;_ KEMBALI KE BERANDA
                </Link>
              </div>

              {/* Main Card Container */}
              <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden rounded-xl">
                
                {/* Retro Header Window Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black inline-block"></span>
                    </div>
                    <span className="tracking-wide text-amber-300">student_registration_form.exe</span>
                  </div>
                  <span className="text-cyan-300 text-[11px] font-mono">● PENDAFTARAN SISWA BARU</span>
                </div>

                {/* Form Title & Instruction Banner */}
                <div className="bg-orange-500 p-6 sm:p-8 border-b-2 border-black text-black">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-amber-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
                    <Terminal className="w-3.5 h-3.5" /> [SYS_ENROLLMENT // BATCH_2026]
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight leading-tight">
                    Formulir Pendaftaran Kursus Komputer
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-black/90 mt-2 max-w-2xl leading-relaxed">
                    Isi data diri Anda di bawah ini untuk membuat akun siswa dan memesan slot 1 Komputer 1 Siswa di lab GWA Tech Course.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="m-6 sm:m-8 mb-0 p-4 bg-rose-100 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-rose-950 text-xs sm:text-sm font-bold flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-[#FFFDF5]">

                  {/* Section 1: Kredensial Sistem (ID Otomatis) */}
                  <div className="bg-yellow-100 border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-mono text-xs font-bold uppercase text-black">
                        [01] Nomor Induk / ID Siswa (Dihasilkan Otomatis)
                      </label>
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 border border-black font-bold text-slate-700">
                        SISTEM OTOMATIS
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value={isGeneratingId ? "MENGHASILKAN_ID..." : formData.id}
                        className="w-full pl-3.5 pr-12 py-2.5 bg-white font-mono font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-not-allowed text-black"
                      />
                      <button
                        type="button"
                        onClick={handleRefreshId}
                        title="Generate ulang nomor ID"
                        className="absolute right-2 p-1.5 bg-yellow-300 hover:bg-yellow-200 border border-black active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        {isGeneratingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-slate-600">
                      *ID ini akan menjadi username login Anda ke portal belajar siswa.
                    </p>
                  </div>

                  {/* Section 2: Biodata Diri Siswa */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-600" />
                      [02] Biodata Diri Peserta
                    </h3>

                    {/* Nama Lengkap */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-bold uppercase text-black">
                        Nama Lengkap Siswa <span className="text-rose-600 font-black">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nama}
                        onChange={handleChange("nama")}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3.5 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                      />
                    </div>

                    {/* Tanggal Lahir & WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block font-mono text-xs font-bold uppercase text-black">
                          Tanggal Lahir <span className="text-rose-600 font-black">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={formData.tanggal_lahir}
                            onChange={handleChange("tanggal_lahir")}
                            className="w-full px-3.5 py-2.5 bg-white text-black font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-mono text-xs font-bold uppercase text-black">
                          No. WhatsApp Aktif <span className="text-rose-600 font-black">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={formData.wa}
                            onChange={handleChange("wa")}
                            placeholder="Contoh: 081234567890"
                            className="w-full px-3.5 py-2.5 bg-white text-black font-mono text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                          />
                        </div>
                        <p className="text-[10px] font-mono text-slate-500">
                          Digunakan untuk konfirmasi aktivasi akun & jadwal masuk kelas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Pilihan Modul & Jadwal Kursus */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-600" />
                      [03] Pilihan Modul Kursus & Preferensi Jadwal
                    </h3>

                    {/* Pilihan Modul Kursus */}
                    <div className="space-y-2">
                      <label className="block font-mono text-xs font-bold uppercase text-black">
                        Pilih Modul Kursus <span className="text-rose-600 font-black">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {modulList
                          .filter((m) => (m.status || "Aktif") !== "Tidak Aktif")
                          .map((m) => {
                            const isComingSoon = (m.status || "Aktif") === "Akan Datang";
                            const isSelected = !isComingSoon && formData.modul_id === m.id;

                            return (
                              <label
                                key={m.id}
                                className={`p-3.5 border-2 border-black transition-all flex items-start gap-3 select-none relative ${
                                  isComingSoon
                                    ? "bg-slate-100/80 border-dashed border-slate-400 opacity-75 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-amber-200 shadow-[3px_3px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5 cursor-pointer"
                                    : "bg-white hover:bg-yellow-50 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="modul_id"
                                  value={m.id}
                                  checked={isSelected}
                                  disabled={isComingSoon}
                                  onChange={isComingSoon ? () => {} : handleChange("modul_id")}
                                  className="mt-1 accent-orange-600 cursor-pointer disabled:cursor-not-allowed"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className="text-lg">{m.icon || "💻"}</span>
                                      <p className="font-heading font-black text-sm text-black leading-tight truncate">
                                        {m.nama}
                                      </p>
                                    </div>
                                    {isComingSoon && (
                                      <span className="px-1.5 py-0.5 bg-amber-300 text-black border border-black font-mono text-[9px] font-bold uppercase shadow-[1px_1px_0px_0px_#000]">
                                        Akan Datang
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                                    {m.deskripsi || `${m.total_pertemuan || 10} Pertemuan Belajar`}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="inline-block px-1.5 py-0.5 bg-white border border-black font-mono text-[10px] font-bold text-black">
                                      {m.total_pertemuan || 10} Pertemuan
                                    </span>
                                    {isComingSoon && (
                                      <span className="text-[10px] font-mono text-amber-700 font-bold">
                                        [Segera Hadir]
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* Preferensi Kelas / Sesi */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-bold uppercase text-black">
                        Pilihan Kelas &amp; Preferensi Waktu Belajar
                      </label>
                      <select
                        value={formData.kelas_id}
                        onChange={handleChange("kelas_id")}
                        className="w-full px-3.5 py-2.5 bg-white text-black font-mono text-xs sm:text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-cyan-50 focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="">-- [PILIHAN] Konsultasikan Jadwal dengan Admin Nanti --</option>
                        {kelasList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama} • {k.jadwal || "Hari Fleksibel"} ({k.waktu || "16.00-18.00"})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] font-mono text-slate-500">
                        *Admin akan mengonfirmasi ketersediaan slot 5 PC sebelum kelas dimulai.
                      </p>
                    </div>
                  </div>

                  {/* Section 4: Kredensial Kata Sandi Login */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      [04] Buat Kata Sandi (Password) Login Portal
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="block font-mono text-xs font-bold uppercase text-black">
                          Kata Sandi <span className="text-rose-600 font-black">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleChange("password")}
                            placeholder="Min. 6 karakter"
                            className="w-full pl-3.5 pr-10 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-black cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label className="block font-mono text-xs font-bold uppercase text-black">
                          Ulangi Kata Sandi <span className="text-rose-600 font-black">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPw ? "text" : "password"}
                            required
                            value={formData.confirm_password}
                            onChange={handleChange("confirm_password")}
                            placeholder="Ketik ulang kata sandi"
                            className="w-full pl-3.5 pr-10 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none placeholder:text-slate-400 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-black cursor-pointer"
                          >
                            {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Button */}
                  <div className="pt-4 border-t-2 border-black space-y-3">
                    <button
                      id="btn-kirim-pendaftaran"
                      type="submit"
                      disabled={isSubmitting || isGeneratingId}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-sm sm:text-base uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>MEMPROSES PENDAFTARAN...</span>
                        </>
                      ) : (
                        <>
                          <span>&gt;_ KIRIM PENDAFTARAN SEKARANG</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center font-mono text-xs text-slate-600">
                      Sudah punya akun siswa sebelumnya?{" "}
                      <Link href="/siswa/login" className="font-bold text-black underline hover:text-orange-600">
                        Login ke Portal Siswa di sini
                      </Link>
                    </p>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer globalSettings={globalSettings} />
    </div>
  );
}
