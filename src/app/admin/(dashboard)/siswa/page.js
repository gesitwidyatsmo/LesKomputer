"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Users, Filter, Edit2, Trash2, Calendar, FileText,
  CheckCircle2, Lock, BookOpen, Clock, Loader2, Plus, X,
  AlertCircle, Save, KeyRound, Phone, User, RefreshCw, ChevronDown,
  Award, Calculator, Sparkles, TrendingUp, Zap,
} from "lucide-react";
import {
  getSemuaSiswa, getKehadiranSiswa, upsertKehadiran,
  generateIdSiswa, tambahSiswa, editSiswa, deleteSiswa, resetPasswordSiswa,
  simpanKelulusanSiswa, aktivasiSiswa,
} from "@/lib/siswaService";
import { getAksesSiswa, tandaiSelesai, bukaAkses, kunciUlang, bukaSemuaAkses, getMateriByModul } from "@/lib/materiService";
import { getQuizHasilSiswa } from "@/lib/quizService";
import { getSemuaKelas } from "@/lib/kelasService";
import { getSemuaModul } from "@/lib/modulService";
import Swal from "sweetalert2";
import ClientPortal from "@/components/ClientPortal";

// ─── Inisial Avatar ──────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-blue-300 text-black border-2 border-black",
  "bg-emerald-300 text-black border-2 border-black",
  "bg-violet-300 text-black border-2 border-black",
  "bg-orange-300 text-black border-2 border-black",
  "bg-rose-300 text-black border-2 border-black",
  "bg-cyan-300 text-black border-2 border-black",
];
function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] || AVATAR_COLORS[0];
}

// ─── Input Field Helper ───────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="space-y-1">
      <label className="block font-mono text-xs font-bold uppercase text-black">
        {label} {required && <span className="text-rose-600 font-black">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border-2 border-black px-3 py-2 text-sm font-medium focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] placeholder:text-slate-400 transition-colors";
const selectCls =
  "w-full border-2 border-black px-3 py-2 text-sm font-bold focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] bg-white cursor-pointer transition-colors";

// ─── Modal Tambah / Edit Siswa ────────────────────────────────────────────────
function SiswaFormModal({ siswa, kelasList, modulList, onClose, onSaved }) {
  const isEdit = !!siswa?.id;

  const [form, setForm] = useState({
    id: "",
    nama: siswa?.nama || "",
    tanggal_lahir: siswa?.tanggal_lahir || "",
    wa: siswa?.wa || "",
    kelas_id: siswa?.kelas_id || "",
    modul_id: siswa?.modul_id || "",
    status: siswa?.status || "Aktif",
    status_bayar: siswa?.status_bayar || "Belum Lunas",
    password: "",
    confirm_password: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [err, setErr] = useState("");

  // Generate ID otomatis saat tambah baru
  useEffect(() => {
    if (!isEdit) {
      setIsGenerating(true);
      generateIdSiswa().then((id) => {
        setForm((f) => ({ ...f, id }));
        setIsGenerating(false);
      });
    } else {
      setForm((f) => ({ ...f, id: siswa.id }));
    }
  }, [isEdit, siswa?.id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.nama.trim()) return "Nama siswa wajib diisi.";
    if (!form.kelas_id) return "Kelas wajib dipilih.";
    if (!form.modul_id) return "Modul wajib dipilih.";
    if (!form.tanggal_lahir) return "Tanggal lahir wajib diisi.";
    if (!isEdit) {
      if (!form.password) return "Password wajib diisi untuk siswa baru.";
      if (form.password.length < 6) return "Password minimal 6 karakter.";
      if (form.password !== form.confirm_password) return "Konfirmasi password tidak cocok.";
    }
    return null;
  };

  const handleSave = async () => {
    const validErr = validate();
    if (validErr) { setErr(validErr); return; }
    setErr("");
    setIsSaving(true);

    const formatError = (msg) => {
      if (msg.includes("siswa_status_check")) {
        return `Nilai status "${form.status}" belum diizinkan di database Supabase. Jalankan script supabase_update_constraints.sql di Supabase SQL Editor atau pilih status Aktif / Lulus / Cuti.`;
      }
      if (msg.includes("siswa_status_bayar_check")) {
        return `Nilai status bayar "${form.status_bayar}" belum diizinkan di database Supabase. Jalankan script supabase_update_constraints.sql di Supabase SQL Editor atau pilih Lunas / Belum Lunas.`;
      }
      return msg;
    };

    if (isEdit) {
      const { error } = await editSiswa(siswa.id, form);
      if (error) { setErr("Gagal menyimpan: " + formatError(error.message)); setIsSaving(false); return; }
    } else {
      const { error } = await tambahSiswa(form);
      if (error) { setErr("Gagal menambah siswa: " + formatError(error.message)); setIsSaving(false); return; }
    }

    setIsSaving(false);
    onSaved();
  };

  return (
    <ClientPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full flex flex-col max-h-full overflow-hidden" style={{ maxWidth: '520px' }}>

          {/* Retro Window Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span className="tracking-wide">{isEdit ? "edit_siswa.exe" : "new_siswa_entry.exe"}</span>
            </div>
            <button 
              onClick={onClose} 
              className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] uppercase border border-white"
            >
              ESC [X]
            </button>
          </div>

          {/* Header Description */}
          <div className="px-5 py-3.5 bg-yellow-100 border-b-2 border-black flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-base font-heading font-black uppercase text-black">
                {isEdit ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </h3>
              <p className="text-xs font-mono text-slate-700 mt-0.5">
                {isEdit ? `[ID: ${siswa.id}] ${siswa.nama}` : "Pendaftaran peserta kursus baru ke database"}
              </p>
            </div>
            <span className="px-2 py-0.5 bg-orange-400 border border-black text-black font-mono text-[10px] font-bold">
              {isEdit ? "MODE: UPDATE" : "MODE: CREATE"}
            </span>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-[#FFFDF5]">
            {err && (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-900 bg-rose-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] p-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /> {err}
              </div>
            )}

            {/* ID Siswa */}
            <Field label="[SYS_ID] Nomor Induk Siswa" required>
              <div className="relative">
                <input
                  readOnly
                  value={isGenerating ? "MENGHASILKAN_ID..." : form.id}
                  className={`${inputCls} bg-slate-100 font-mono pr-10 cursor-not-allowed font-bold`}
                />
                {!isEdit && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsGenerating(true);
                      const id = await generateIdSiswa();
                      setForm((f) => ({ ...f, id }));
                      setIsGenerating(false);
                    }}
                    title="Generate ulang ID"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 bg-white border border-black hover:bg-yellow-300 transition-colors"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </Field>

            {/* Nama */}
            <Field label="[INPUT] Nama Lengkap" required>
              <input type="text" value={form.nama} onChange={set("nama")} placeholder="Contoh: Budi Santoso" className={inputCls} />
            </Field>

            {/* Tanggal Lahir & WA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="[DATE] Tanggal Lahir" required>
                <input type="date" value={form.tanggal_lahir} onChange={set("tanggal_lahir")} className={inputCls} />
              </Field>
              <Field label="[TEL] No. WhatsApp">
                <input type="tel" value={form.wa} onChange={set("wa")} placeholder="Contoh: 081234567890" className={inputCls} />
              </Field>
            </div>

            {/* Kelas & Modul */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="[SELECT] Kelas Jadwal" required>
                <select value={form.kelas_id} onChange={set("kelas_id")} className={selectCls}>
                  <option value="">-- Pilih Kelas --</option>
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </Field>
              <Field label="[SELECT] Modul Kursus" required>
                <select value={form.modul_id} onChange={set("modul_id")} className={selectCls}>
                  <option value="">-- Pilih Modul --</option>
                  {modulList
                    .filter((m) => (m.status || 'Aktif') !== 'Tidak Aktif' || m.id === form.modul_id)
                    .map((m) => (
                      <option 
                        key={m.id} 
                        value={m.id}
                        disabled={(m.status || 'Aktif') === 'Akan Datang' && m.id !== form.modul_id}
                      >
                        {m.icon} {m.nama} {(m.status || 'Aktif') === 'Akan Datang' ? '(Akan Datang)' : (m.status === 'Tidak Aktif' ? '(Nonaktif)' : '')}
                      </option>
                    ))}
                </select>
              </Field>
            </div>

            {/* Status & Status Bayar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="[STATUS] Status Belajar">
                <select value={form.status} onChange={set("status")} className={selectCls}>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif (Menunggu Aktivasi)</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Berhenti">Berhenti</option>
                </select>
              </Field>
              <Field label="[PAYMENT] Status Bayar">
                <select value={form.status_bayar} onChange={set("status_bayar")} className={selectCls}>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Cicilan">Cicilan</option>
                </select>
              </Field>
            </div>

            {/* Password — hanya untuk tambah baru */}
            {!isEdit && (
              <div className="pt-3 border-t-2 border-dashed border-slate-300 space-y-3">
                <p className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600" /> KREDENSIAL LOGIN SISWA
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="[AUTH] Password" required>
                    <input type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 karakter" className={inputCls} />
                  </Field>
                  <Field label="[AUTH] Konfirmasi Password" required>
                    <input type="password" value={form.confirm_password} onChange={set("confirm_password")} placeholder="Ulangi password" className={inputCls} />
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 py-3.5 border-t-2 border-black justify-end shrink-0 bg-white">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-heading font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? "Simpan Perubahan" : "Daftarkan Siswa"}
            </button>
          </div>
        </div>
      </div>
    </ClientPortal>
  );
}

// ─── Modal Reset Password ─────────────────────────────────────────────────────
function ResetPasswordModal({ siswa, onClose }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleReset = async () => {
    if (!password || password.length < 6) { setErr("Password minimal 6 karakter."); return; }
    if (password !== confirm) { setErr("Konfirmasi password tidak cocok."); return; }
    setErr("");
    setIsSaving(true);
    const { error } = await resetPasswordSiswa(siswa.id, password);
    setIsSaving(false);
    if (error) { setErr("Gagal reset password: " + error.message); return; }
    onClose();
    Swal.fire({ icon: "success", title: "Password berhasil direset!", timer: 1500, showConfirmButton: false });
  };

  return (
    <ClientPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-sm overflow-hidden">
          {/* Retro Window Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span>sys_pwd_reset.exe</span>
            </div>
            <button onClick={onClose} className="px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[10px]">X</button>
          </div>

          <div className="p-5 space-y-4 bg-[#FFFDF5]">
            <div>
              <h3 className="font-heading font-black uppercase text-base text-black">Reset Password Siswa</h3>
              <p className="text-xs font-mono text-slate-600 mt-1">
                Target: <strong>{siswa.nama}</strong> ({siswa.id})
              </p>
            </div>
            
            {err && (
              <div className="text-xs font-mono font-bold text-rose-800 bg-rose-100 border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]">
                [!] {err}
              </div>
            )}
            
            <div className="space-y-3">
              <Field label="[INPUT] Password Baru" required>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" className={inputCls} />
              </Field>
              <Field label="[INPUT] Konfirmasi Password" required>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Ulangi password baru" className={inputCls} />
              </Field>
            </div>
          </div>

          <div className="flex gap-2 px-5 py-3.5 border-t-2 border-black justify-end bg-white">
            <button 
              onClick={onClose} 
              className="px-3.5 py-2 text-xs font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-heading font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </div>
      </div>
    </ClientPortal>
  );
}

// ─── Modal Aktivasi Siswa ──────────────────────────────────────────────────────
function AktivasiSiswaModal({ siswa, kelasList, onClose, onActivated }) {
  const [kelasId, setKelasId] = useState(siswa?.kelas_id || "");
  const [statusBayar, setStatusBayar] = useState(siswa?.status_bayar || "Belum Lunas");
  const [isActivating, setIsActivating] = useState(false);
  const [err, setErr] = useState("");

  const handleAktivasi = async () => {
    setIsActivating(true);
    setErr("");
    const { data, error } = await aktivasiSiswa(siswa.id, {
      kelas_id: kelasId || null,
      status_bayar: statusBayar,
    });
    setIsActivating(false);

    if (error) {
      setErr("Gagal aktivasi: " + error.message);
      return;
    }

    onActivated(siswa, kelasId, statusBayar);
  };

  return (
    <ClientPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span>siswa_activation_wizard.exe</span>
            </div>
            <button onClick={onClose} className="px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[10px]">X</button>
          </div>

          <div className="p-5 space-y-4 bg-[#FFFDF5]">
            <div className="bg-emerald-100 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
              <h3 className="font-heading font-black uppercase text-base text-black flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-700 fill-emerald-500" /> Aktivasi Akun Siswa
              </h3>
              <p className="text-xs font-mono text-slate-800 mt-1">
                Siswa: <strong>{siswa.nama}</strong> ({siswa.id})
              </p>
              <p className="text-xs font-mono text-slate-700">
                Modul: <strong>{siswa.modul || "Kursus Komputer"}</strong>
              </p>
            </div>

            {err && (
              <div className="text-xs font-mono font-bold text-rose-800 bg-rose-100 border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]">
                [!] {err}
              </div>
            )}

            <div className="space-y-3">
              <Field label="[SELECT] Tetapkan Kelas Lab Siswa">
                <select
                  value={kelasId}
                  onChange={(e) => setKelasId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">-- Pilih / Tetapkan Kelas --</option>
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} ({k.jadwal || "Reguler"} - {k.waktu || "Sore"})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="[PAYMENT] Status Pembayaran">
                <select
                  value={statusBayar}
                  onChange={(e) => setStatusBayar(e.target.value)}
                  className={selectCls}
                >
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Cicilan">Cicilan</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </Field>
            </div>

            <div className="bg-yellow-50 border border-black p-2.5 text-[11px] font-mono text-slate-700 space-y-1">
              <p className="font-bold text-black">ℹ️ Informasi Aktivasi:</p>
              <p>Setelah diaktifkan, status siswa akan menjadi <strong>Aktif</strong> dan siswa dapat login ke portal belajar dengan ID <strong>{siswa.id}</strong>.</p>
            </div>
          </div>

          <div className="flex gap-2 px-5 py-3.5 border-t-2 border-black justify-end bg-white">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleAktivasi}
              disabled={isActivating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-heading font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer"
            >
              {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Aktifkan Siswa Sekarang
            </button>
          </div>
        </div>
      </div>
    </ClientPortal>
  );
}

// ─── Badge Komponen ───────────────────────────────────────────────────────────
function StatusBadge({ value }) {
  const map = {
    Aktif:        "bg-emerald-300 text-black border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]",
    "Tidak Aktif":"bg-amber-300 text-black border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]",
    Lulus:        "bg-cyan-300 text-black border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]",
    Cuti:         "bg-yellow-200 text-black border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]",
    Berhenti:     "bg-slate-300 text-black border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] font-bold uppercase ${map[value] || "bg-slate-200 text-black border border-black"}`}>
      {value === "Aktif" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>}
      {value === "Tidak Aktif" && <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse"></span>}
      {value}
    </span>
  );
}

function BayarBadge({ value }) {
  const map = {
    Lunas:       "bg-emerald-100 text-emerald-800 border border-black",
    "Belum Lunas": "bg-rose-100 text-rose-800 border border-black",
    Cicilan:     "bg-amber-100 text-amber-800 border border-black",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${map[value] || "bg-slate-100 text-slate-800 border border-black"}`}>
      {value === "Lunas" ? "✓ LUNAS" : value === "Belum Lunas" ? "✗ BLM LUNAS" : "⏳ CICILAN"}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DataSiswa() {
  // ── State ──
  const [siswaList, setSiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterBayar, setFilterBayar] = useState("Semua");

  // Dropdown & Modal state
  const [kelasList, setKelasList] = useState([]);
  const [modulList, setModulList] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);

  // Detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [resetPwModal, setResetPwModal] = useState(false);

  // Aktivasi modal state
  const [aktivasiModalOpen, setAktivasiModalOpen] = useState(false);
  const [activatingSiswa, setActivatingSiswa] = useState(null);

  // Detail sub-state
  const [materiList, setMateriList] = useState([]);
  const [aksesMateri, setAksesMateri] = useState({});
  const [isUpdatingAkses, setIsUpdatingAkses] = useState(false);
  const [kehadiranList, setKehadiranList] = useState([]);
  const [quizHasilList, setQuizHasilList] = useState([]);
  const [nilaiPraktikInput, setNilaiPraktikInput] = useState(85);
  const [isSavingKelulusan, setIsSavingKelulusan] = useState(false);

  // ── Loaders ──
  const loadSiswa = useCallback(async () => {
    setIsLoading(true);
    const { data } = await getSemuaSiswa();
    if (data) setSiswaList(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSiswa();
    getSemuaKelas().then(({ data }) => { if (data) setKelasList(data); });
    getSemuaModul().then(({ data }) => { if (data) setModulList(data); });
  }, [loadSiswa]);

  // ── Detail Modal Loader ──
  const handleOpenDetail = async (siswa) => {
    setSelectedSiswa(siswa);
    setDetailModalOpen(true);
    setActiveTab("profil");
    setMateriList([]);
    setAksesMateri({});
    setKehadiranList([]);
    setQuizHasilList([]);
    setNilaiPraktikInput(siswa.nilai_akhir || 85);

    // Fetch data paralel
    const [{ data: mData }, { aksesMap }, { data: kData }, { data: qData }] = await Promise.all([
      getMateriByModul(siswa.modul_id),
      getAksesSiswa(siswa.id),
      getKehadiranSiswa(siswa.id),
      getQuizHasilSiswa(siswa.id),
    ]);

    if (mData) setMateriList(mData);
    setAksesMateri(aksesMap || {});
    if (kData) setKehadiranList(kData);
    if (qData) setQuizHasilList(qData);
  };

  const handleSimpanKelulusan = async (calculatedNilaiAkhir, calculatedPredikat) => {
    if (!selectedSiswa) return;
    setIsSavingKelulusan(true);
    try {
      const { data, error } = await simpanKelulusanSiswa(selectedSiswa.id, {
        nilai_akhir: calculatedNilaiAkhir,
        predikat: calculatedPredikat,
        status: "Lulus",
        tanggal_lulus: new Date().toISOString().split("T")[0],
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: error.message || "Terjadi kesalahan saat menyimpan kelulusan.",
        });
      } else {
        const updated = {
          ...selectedSiswa,
          status: "Lulus",
          nilai_akhir: calculatedNilaiAkhir,
          nilaiAkhir: calculatedNilaiAkhir,
          predikat: calculatedPredikat,
          tanggal_lulus: new Date().toISOString().split("T")[0],
        };
        setSelectedSiswa(updated);
        setSiswaList((prev) =>
          prev.map((s) => (s.id === selectedSiswa.id ? updated : s))
        );

        Swal.fire({
          icon: "success",
          title: "Kelulusan Ditetapkan! 🎓",
          html: `Siswa <b>${selectedSiswa.nama}</b> resmi dinyatakan <b>LULUS</b>.<br/>Nilai Akhir: <b>${calculatedNilaiAkhir}</b> (Predikat: <b>${calculatedPredikat}</b>).<br/><span class="text-xs text-slate-500 mt-2 block">E-Sertifikat resmi sudah dapat diterbitkan.</span>`,
          customClass: {
            popup: "border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]",
            confirmButton: "bg-orange-500 border-2 border-black font-bold text-black rounded-lg cursor-pointer",
          },
        });
      }
    } catch (err) {
      console.error("Gagal simpan kelulusan:", err);
    } finally {
      setIsSavingKelulusan(false);
    }
  };

  // ── CRUD Handlers ──
  const handleTambah = () => {
    setEditingSiswa(null);
    setFormModalOpen(true);
  };

  const handleEdit = (siswa) => {
    setEditingSiswa(siswa);
    setFormModalOpen(true);
  };

  const handleDelete = async (siswa) => {
    const result = await Swal.fire({
      title: "Hapus Siswa?",
      html: `Hapus <strong>${siswa.nama}</strong> (${siswa.id})?<br/><span class="text-sm text-gray-500">Semua data kehadiran & akses materi akan ikut terhapus.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    const { error } = await deleteSiswa(siswa.id);
    if (error) {
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal menghapus siswa: " + error.message });
      return;
    }
    await loadSiswa();
    Swal.fire({ icon: "success", title: "Terhapus!", text: `${siswa.nama} telah dihapus.`, timer: 1500, showConfirmButton: false });
  };

  const handleFormSaved = async () => {
    setFormModalOpen(false);
    setEditingSiswa(null);
    await loadSiswa();
    Swal.fire({
      icon: "success",
      title: editingSiswa ? "Data Diperbarui!" : "Siswa Ditambahkan!",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // ── Aktivasi Handlers ──
  const handleBukaAktivasi = (siswa) => {
    setActivatingSiswa(siswa);
    setAktivasiModalOpen(true);
  };

  const handleAktivasiSuccess = async (siswa, assignedKelasId, assignedStatusBayar) => {
    setAktivasiModalOpen(false);
    setActivatingSiswa(null);
    await loadSiswa();

    if (selectedSiswa && selectedSiswa.id === siswa.id) {
      setSelectedSiswa((prev) => ({
        ...prev,
        status: "Aktif",
        status_bayar: assignedStatusBayar,
        kelas_id: assignedKelasId || prev.kelas_id,
      }));
    }

    const waMsg = `Halo ${siswa.nama},\n\nAkun pendaftaran Anda di GWA Tech Course telah *AKTIF*! 🚀\n- *ID Siswa*: ${siswa.id}\n- *Modul*: ${siswa.modul || 'Kursus Komputer'}\n\nSilakan login ke Portal Belajar Siswa di:\n${window.location.origin}/siswa/login\n\nSelamat belajar dan sampai jumpa di kelas!`;
    const waUrl = siswa.wa ? `https://wa.me/${siswa.wa.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}` : null;

    Swal.fire({
      icon: "success",
      title: "Siswa Berhasil Diaktifkan! ⚡",
      html: `Akun <b>${siswa.nama}</b> (${siswa.id}) telah <b>AKTIF</b> dan dapat mengakses portal belajar.<br/><br/>${
        waUrl
          ? `<a href="${waUrl}" target="_blank" class="inline-block mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] no-underline">📲 Kirim Notifikasi WhatsApp ke Siswa</a>`
          : ''
      }`,
      customClass: {
        popup: "border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000]",
        confirmButton: "bg-orange-500 border-2 border-black font-bold text-black rounded-lg cursor-pointer",
      },
    });
  };

  // ── Akses Materi Handlers ──
  const refreshAkses = async () => {
    const { aksesMap } = await getAksesSiswa(selectedSiswa.id);
    setAksesMateri(aksesMap || {});
  };

  const handleSelesaiDanBukaBerikut = async (currentMateriId, nextMateriId) => {
    setIsUpdatingAkses(true);
    await tandaiSelesai(selectedSiswa.id, currentMateriId, nextMateriId);
    await refreshAkses();
    setIsUpdatingAkses(false);
  };

  const handleBukaAkses = async (materiId) => {
    setIsUpdatingAkses(true);
    await bukaAkses(selectedSiswa.id, materiId);
    await refreshAkses();
    setIsUpdatingAkses(false);
  };

  const handleKunciUlang = async (materiId) => {
    const result = await Swal.fire({
      title: "Kunci Ulang?",
      text: "Kunci ulang pertemuan ini? Siswa tidak akan bisa mengaksesnya.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Kunci",
    });
    if (!result.isConfirmed) return;
    setIsUpdatingAkses(true);
    await kunciUlang(selectedSiswa.id, materiId);
    await refreshAkses();
    setIsUpdatingAkses(false);
    Swal.fire({ icon: "success", title: "Terkunci", timer: 1000, showConfirmButton: false });
  };

  const handleBukaSemua = async () => {
    const result = await Swal.fire({
      title: "Buka Semua Akses?",
      text: "Buka SEMUA pertemuan untuk siswa ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Buka Semua",
    });
    if (!result.isConfirmed) return;
    setIsUpdatingAkses(true);
    await bukaSemuaAkses(selectedSiswa.id, materiList.map((m) => m.id));
    await refreshAkses();
    setIsUpdatingAkses(false);
    Swal.fire({ icon: "success", title: "Semua Terbuka!", timer: 1500, showConfirmButton: false });
  };

  // ── Kehadiran Handler ──
  const handleTandaiKehadiran = async (pertemuan, status) => {
    setIsUpdatingAkses(true);
    await upsertKehadiran({ siswa_id: selectedSiswa.id, pertemuan, status });
    const { data } = await getKehadiranSiswa(selectedSiswa.id);
    if (data) setKehadiranList(data);
    setIsUpdatingAkses(false);
  };

  // ── Filtered List ──
  const filteredSiswa = siswaList.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.nama?.toLowerCase().includes(q) ||
      s.kelas?.toLowerCase().includes(q) ||
      s.id?.toLowerCase().includes(q) ||
      s.modul?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Semua" || s.status === filterStatus;
    const matchBayar = filterBayar === "Semua" || s.status_bayar === filterBayar;
    return matchSearch && matchStatus && matchBayar;
  });

  const statsTotal = siswaList.length;
  const statsAktif = siswaList.filter((s) => s.status === "Aktif").length;
  const statsTidakAktif = siswaList.filter((s) => s.status === "Tidak Aktif").length;
  const statsLunas = siswaList.filter((s) => s.status_bayar === "Lunas").length;

  // ── Render ──
  return (
    <div className="space-y-6">

      {/* ── Page Header Banner ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-cyan-300 border border-black text-black">
              [SYS_DIRECTORY // SISWA]
            </span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              COUNT: {statsTotal} SISWA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black">
            Manajemen Data Siswa
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-600 mt-0.5">
            Kelola peserta kursus, kontrol akses materi per-pertemuan, aktivasi pendaftar baru, presensi, dan pembayaran.
          </p>
        </div>
        <button
          id="btn-tambah-siswa"
          onClick={handleTambah}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Siswa Baru
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Siswa Terdaftar", value: statsTotal, icon: <Users className="w-5 h-5" />, bg: "bg-cyan-300", accent: "bg-cyan-500" },
          { label: "Siswa Status Aktif", value: statsAktif, icon: <CheckCircle2 className="w-5 h-5" />, bg: "bg-emerald-300", accent: "bg-emerald-500" },
          { 
            label: "Menunggu Aktivasi", 
            value: statsTidakAktif, 
            icon: <Zap className="w-5 h-5" />, 
            bg: statsTidakAktif > 0 ? "bg-amber-300 animate-pulse" : "bg-amber-100", 
            accent: "bg-amber-500",
            onClick: () => setFilterStatus(filterStatus === "Tidak Aktif" ? "Semua" : "Tidak Aktif"),
            isFilterable: true
          },
          { label: "Pembayaran Lunas", value: statsLunas, icon: <FileText className="w-5 h-5" />, bg: "bg-amber-300", accent: "bg-amber-500" },
        ].map((s) => (
          <div 
            key={s.label} 
            onClick={s.onClick}
            className={`bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 flex items-center justify-between relative overflow-hidden ${
              s.isFilterable ? "cursor-pointer hover:bg-yellow-50 transition-colors" : ""
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${s.accent}`}></div>
            <div>
              <p className="text-3xl font-heading font-black text-black">{s.value}</p>
              <p className="text-xs font-mono font-bold text-slate-600 uppercase mt-0.5">{s.label}</p>
            </div>
            <div className={`w-10 h-10 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0 ${s.bg} text-black`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-black" />
          </div>
          <input
            id="input-cari-siswa"
            type="text"
            className="block w-full pl-9 pr-3 py-2 border-2 border-black bg-[#FFFDF5] text-black font-medium focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] text-xs sm:text-sm placeholder:text-slate-400 transition-colors"
            placeholder="Cari berdasarkan nama, ID siswa, kelas, atau modul kursus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-2 border-black px-3 py-2 text-xs font-mono font-bold uppercase bg-white text-black focus:outline-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <option value="Semua">STATUS: SEMUA</option>
            <option value="Aktif">STATUS: AKTIF</option>
            <option value="Tidak Aktif">STATUS: TIDAK AKTIF (PENDAFTAR)</option>
            <option value="Lulus">STATUS: LULUS</option>
            <option value="Cuti">STATUS: CUTI</option>
            <option value="Berhenti">STATUS: BERHENTI</option>
          </select>
          <select
            value={filterBayar}
            onChange={(e) => setFilterBayar(e.target.value)}
            className="border-2 border-black px-3 py-2 text-xs font-mono font-bold uppercase bg-white text-black focus:outline-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <option value="Semua">BAYAR: SEMUA</option>
            <option value="Lunas">BAYAR: LUNAS</option>
            <option value="Belum Lunas">BAYAR: BLM LUNAS</option>
            <option value="Cicilan">BAYAR: CICILAN</option>
          </select>
        </div>
      </div>

      {/* ── Tabel Siswa (Neobrutalist Data Grid) ── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="font-mono text-xs font-bold uppercase">[SYS_QUERY: FETCHING_STUDENTS...]</span>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-black text-white text-left font-mono text-xs font-bold uppercase tracking-wider select-none">
                  <th className="px-4 py-3 border-r border-slate-700 w-16 text-center">NO</th>
                  <th className="px-4 py-3 border-r border-slate-700">DATA SISWA</th>
                  <th className="px-4 py-3 border-r border-slate-700">KELAS & MODUL</th>
                  <th className="px-4 py-3 border-r border-slate-700">STATUS & PEMBAYARAN</th>
                  <th className="px-4 py-3 text-center w-48">AKSI KONTROL</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filteredSiswa.map((siswa, idx) => (
                  <tr key={siswa.id} className="hover:bg-yellow-50/70 transition-colors group">
                    {/* Number */}
                    <td className="px-4 py-3 text-center font-mono text-xs font-bold text-slate-500 border-r border-black/10">
                      {idx + 1}
                    </td>

                    {/* Siswa */}
                    <td className="px-4 py-3 border-r border-black/10">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-[2px_2px_0px_0px_#000] ${getAvatarColor(siswa.nama)}`}>
                          {siswa.nama?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-heading font-black text-black">{siswa.nama}</p>
                          <p className="text-[11px] text-slate-600 font-mono font-bold">
                            [{siswa.id}] {siswa.wa ? `• WA: ${siswa.wa}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kelas & Modul */}
                    <td className="px-4 py-3 border-r border-black/10">
                      <p className="text-xs font-bold text-black">{siswa.kelas || <span className="text-slate-400 italic">Tanpa Kelas</span>}</p>
                      <span className="inline-block px-1.5 py-0.5 bg-cyan-100 border border-black font-mono text-[10px] font-bold text-black mt-1">
                        #{siswa.modul || "BELUM_SET"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 border-r border-black/10">
                      <div className="flex flex-col gap-1.5 items-start">
                        <StatusBadge value={siswa.status} />
                        <BayarBadge value={siswa.status_bayar} />
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {siswa.status === "Tidak Aktif" && (
                          <button
                            onClick={() => handleBukaAktivasi(siswa)}
                            className="px-2.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1"
                            title="Aktifkan Siswa Baru"
                          >
                            <Zap className="w-3.5 h-3.5 fill-black" /> Aktifkan
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(siswa)}
                          className="px-2.5 py-1.5 bg-cyan-300 hover:bg-cyan-200 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                          title="Lihat Detail & Akses Materi"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(siswa)}
                          title="Edit Profil Siswa"
                          className="p-1.5 bg-amber-300 hover:bg-amber-200 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(siswa)}
                          title="Hapus Siswa"
                          className="p-1.5 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSiswa.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center bg-[#FFFDF5]">
                      <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="font-heading font-black text-base text-black uppercase">Data Siswa Tidak Ditemukan</p>
                      <p className="font-mono text-xs text-slate-500 mt-1">[SYS_NOTICE] Sesuaikan kata kunci atau filter pencarian Anda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredSiswa.length > 0 && (
            <div className="px-4 py-3 border-t-2 border-black bg-yellow-50 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-black">
                TOTAL TAMPIL: <strong>{filteredSiswa.length}</strong> DARI <strong>{statsTotal}</strong> PESERTA
              </span>
              <span className="text-slate-500">[DB_SYNC_OK]</span>
            </div>
          )}
        </div>
      )}

      {/* ── Form Modal (Tambah / Edit) ── */}
      {formModalOpen && (
        <SiswaFormModal
          siswa={editingSiswa}
          kelasList={kelasList}
          modulList={modulList}
          onClose={() => { setFormModalOpen(false); setEditingSiswa(null); }}
          onSaved={handleFormSaved}
        />
      )}

      {/* ── Detail Modal ── */}
      {detailModalOpen && selectedSiswa && (
        <ClientPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setDetailModalOpen(false)} />
            <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full flex flex-col max-h-full overflow-hidden" style={{ maxWidth: '800px' }}>

              {/* Retro Window Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
                  </div>
                  <span>siswa_record_manager.exe</span>
                </div>
                <button 
                  onClick={() => setDetailModalOpen(false)}
                  className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px]"
                >
                  ESC [X]
                </button>
              </div>

              {/* Modal Profile Banner */}
              <div className="bg-slate-900 px-5 py-4 shrink-0 flex justify-between items-center border-b-2 border-black">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 flex items-center justify-center text-xl font-heading font-black shadow-[2px_2px_0px_0px_#000] ${getAvatarColor(selectedSiswa.nama)}`}>
                    {selectedSiswa.nama?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-black text-white uppercase">{selectedSiswa.nama}</h3>
                    <p className="text-amber-400 text-xs font-mono font-bold mt-0.5">
                      [{selectedSiswa.id}] // {selectedSiswa.kelas || 'Belum Ada Kelas'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDetailModalOpen(false); handleEdit(selectedSiswa); }}
                    className="p-1.5 bg-yellow-400 hover:bg-yellow-300 text-black border border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono font-bold flex items-center gap-1 transition-all"
                    title="Edit Profil"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">EDIT</span>
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b-2 border-black shrink-0 bg-yellow-100 overflow-x-auto p-1.5 gap-1.5">
                {[
                  { key: "profil", label: "[01] PROFIL & DATA", icon: <User className="w-3.5 h-3.5 mr-1" /> },
                  { key: "akses", label: "[02] AKSES MATERI", icon: <BookOpen className="w-3.5 h-3.5 mr-1" /> },
                  { key: "presensi", label: "[03] PRESENSI & NILAI", icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? "bg-orange-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black"
                        : "bg-white text-slate-700 border-2 border-transparent hover:border-black"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#FFFDF5] space-y-4">

                {/* ─ Tab: Profil ─ */}
                {activeTab === "profil" && (
                  <div className="space-y-4">
                    {/* Inactive Student Banner */}
                    {selectedSiswa.status === "Tidak Aktif" && (
                      <div className="bg-amber-200 border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <p className="font-heading font-black text-sm uppercase text-black flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-900" /> SISWA INI MENUNGGU AKTIVASI
                          </p>
                          <p className="font-mono text-xs text-slate-800 mt-0.5">
                            Siswa mendaftar mandiri via web dan berstatus Tidak Aktif. Aktifkan akun agar siswa dapat login.
                          </p>
                        </div>
                        <button
                          onClick={() => handleBukaAktivasi(selectedSiswa)}
                          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-black" /> Aktifkan Siswa Sekarang
                        </button>
                      </div>
                    )}

                    {/* Info Umum */}
                    <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 sm:p-5">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black font-heading font-black text-xs uppercase">
                        <span>Informasi Biodata Peserta</span>
                        <span className="font-mono text-slate-500">[RECORD_INFO]</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs">
                        <div>
                          <p className="text-slate-500 font-bold mb-0.5">[NAMA LENGKAP]</p>
                          <p className="font-bold text-black text-sm">{selectedSiswa.nama}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold mb-0.5">[NOMOR INDUK / ID]</p>
                          <p className="font-bold text-black text-sm bg-yellow-100 px-1.5 py-0.5 border border-black inline-block">
                            {selectedSiswa.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold mb-0.5">[TANGGAL LAHIR]</p>
                          <p className="font-bold text-black">
                            {selectedSiswa.tanggal_lahir
                              ? new Date(selectedSiswa.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold mb-0.5">[NO. WHATSAPP]</p>
                          <p className="font-bold text-black">{selectedSiswa.wa || "—"}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold mb-0.5">[KELAS]</p>
                          <p className="font-bold text-black">{selectedSiswa.kelas || "—"}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold mb-0.5">[MODUL KURSUS]</p>
                          <p className="font-bold text-black">{selectedSiswa.modul || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Box */}
                    <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 sm:p-5">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black font-heading font-black text-xs uppercase">
                        <span>Status Akademik & Keuangan</span>
                        <span className="font-mono text-slate-500">[STATUS_MONITOR]</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-mono font-bold text-slate-500 mb-1.5">STATUS BELAJAR</p>
                          <StatusBadge value={selectedSiswa.status} />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-slate-500 mb-1.5">STATUS PEMBAYARAN</p>
                          <BayarBadge value={selectedSiswa.status_bayar} />
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 sm:p-5">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black font-heading font-black text-xs uppercase">
                        <span>Tindakan Langsung</span>
                        <span className="font-mono text-slate-500">[ACTIONS]</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={() => { setDetailModalOpen(false); handleEdit(selectedSiswa); }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-yellow-300 hover:bg-yellow-200 text-black text-xs font-heading font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Biodata
                        </button>
                        <button
                          onClick={() => setResetPwModal(true)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-400 hover:bg-orange-300 text-black text-xs font-heading font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Reset Password
                        </button>
                        {selectedSiswa.wa && (
                          <a
                            href={`https://wa.me/${selectedSiswa.wa.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-heading font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" /> Hubungi WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => { setDetailModalOpen(false); handleDelete(selectedSiswa); }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-400 hover:bg-rose-300 text-black text-xs font-heading font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus Data
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─ Tab: Akses Materi ─ */}
                {activeTab === "akses" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-cyan-100 border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4">
                      <div>
                        <p className="font-heading font-black text-black text-sm uppercase">Kontrol Akses Materi Siswa</p>
                        <p className="font-mono text-xs text-slate-700 mt-0.5">Buka materi secara berjenjang atau serentak sesuai progres tatap muka.</p>
                      </div>
                      <button
                        onClick={handleBukaSemua}
                        className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                      >
                        ⚡ Buka Semua Akses
                      </button>
                    </div>

                    {isUpdatingAkses && (
                      <div className="flex justify-center py-2">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      </div>
                    )}

                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden overflow-x-auto">
                      <table className="w-full text-xs min-w-[500px]">
                        <thead>
                          <tr className="bg-black text-white font-mono font-bold uppercase">
                            <th className="text-center p-2.5 w-16 border-r border-slate-700">PRTM</th>
                            <th className="text-left p-2.5 border-r border-slate-700">JUDUL MATERI</th>
                            <th className="text-center p-2.5 w-32 border-r border-slate-700">STATUS AKSES</th>
                            <th className="text-right p-2.5 w-48">KONTROL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-black/10">
                          {materiList.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-8 text-center text-slate-500 font-mono text-xs">
                                [EMPTY] Belum ada daftar materi untuk modul siswa ini.
                              </td>
                            </tr>
                          ) : (
                            materiList.map((m, idx) => {
                              const status = aksesMateri[m.id] || "terkunci";
                              const nextMateri = materiList[idx + 1];
                              return (
                                <tr key={m.id} className="hover:bg-yellow-50/70 font-mono">
                                  <td className="p-2.5 text-center font-black text-black border-r border-black/10 bg-slate-50">
                                    #{m.pertemuan}
                                  </td>
                                  <td className="p-2.5 font-bold text-slate-900 border-r border-black/10 font-sans">
                                    {m.judul}
                                  </td>
                                  <td className="p-2.5 text-center border-r border-black/10">
                                    {status === "selesai" && (
                                      <span className="inline-flex items-center px-2 py-0.5 bg-emerald-300 text-black font-mono text-[10px] font-bold border border-black shadow-[1px_1px_0px_0px_#000]">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> SELESAI
                                      </span>
                                    )}
                                    {status === "terbuka" && (
                                      <span className="inline-flex items-center px-2 py-0.5 bg-cyan-300 text-black font-mono text-[10px] font-bold border border-black shadow-[1px_1px_0px_0px_#000]">
                                        <BookOpen className="w-3 h-3 mr-1" /> TERBUKA
                                      </span>
                                    )}
                                    {status === "terkunci" && (
                                      <span className="inline-flex items-center px-2 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] font-bold border border-black">
                                        <Lock className="w-3 h-3 mr-1" /> TERKUNCI
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2.5 text-right space-x-1.5">
                                    {status === "terbuka" && (
                                      <button
                                        onClick={() => handleSelesaiDanBukaBerikut(m.id, nextMateri?.id)}
                                        className="inline-flex items-center px-2.5 py-1 bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-[10px] font-bold uppercase border border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                      >
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai {nextMateri && "& Buka Berikut"}
                                      </button>
                                    )}
                                    {status === "terkunci" && (
                                      <button
                                        onClick={() => handleBukaAkses(m.id)}
                                        className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-yellow-200 text-black font-mono text-[10px] font-bold uppercase border border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                      >
                                        🔓 Buka Akses
                                      </button>
                                    )}
                                    {status === "selesai" && (
                                      <button
                                        onClick={() => handleKunciUlang(m.id)}
                                        title="Kunci Ulang"
                                        className="inline-flex items-center px-2 py-1 bg-rose-200 hover:bg-rose-300 text-black font-mono text-[10px] font-bold uppercase border border-black transition-colors"
                                      >
                                        <Lock className="w-3 h-3 mr-1" /> Kunci Ulang
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ─ Tab: Kehadiran & Nilai ─ */}
                {activeTab === "presensi" && (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    {materiList.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: "Total Hadir",
                            value: kehadiranList.filter((k) => k.status === "Hadir").length,
                            bg: "bg-emerald-200",
                          },
                          {
                            label: "Absen / Izin",
                            value: kehadiranList.filter((k) => ["Alpa", "Sakit", "Izin"].includes(k.status)).length,
                            bg: "bg-rose-200",
                          },
                          {
                            label: "Rata-rata Nilai",
                            value: quizHasilList.length > 0
                              ? Math.round(quizHasilList.reduce((a, q) => a + (q.nilai || 0), 0) / quizHasilList.length)
                              : "—",
                            bg: "bg-cyan-200",
                          },
                        ].map((s) => (
                          <div key={s.label} className={`border-2 border-black shadow-[2px_2px_0px_0px_#000] p-3 text-center ${s.bg}`}>
                            <p className="text-2xl font-heading font-black text-black">{s.value}</p>
                            <p className="text-[11px] font-mono font-bold uppercase text-black mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden overflow-x-auto">
                      <div className="bg-black text-white px-4 py-2 font-mono font-bold text-xs uppercase flex justify-between items-center">
                        <span>Rekap Presensi & Nilai Quiz per Pertemuan</span>
                        <span className="text-yellow-300 text-[10px]">[AUTO_SYNC]</span>
                      </div>
                      <table className="w-full text-xs min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-100 border-b-2 border-black font-mono font-bold uppercase text-slate-700">
                            <th className="text-center p-2.5 w-16 border-r border-black">PRTM</th>
                            <th className="text-left p-2.5 border-r border-black">MATERI</th>
                            <th className="text-left p-2.5 w-36 border-r border-black">KEHADIRAN</th>
                            <th className="text-center p-2.5 w-28">NILAI KUIS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-black/10">
                          {materiList.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-8 text-center text-slate-500 font-mono text-xs">
                                [EMPTY] Belum ada data materi.
                              </td>
                            </tr>
                          ) : (
                            materiList.map((m) => {
                              const hadirRec = kehadiranList.find((k) => k.pertemuan === m.pertemuan);
                              const statusHadir = hadirRec?.status || "Belum";
                              const quizHasil = quizHasilList.find((q) => q.quiz?.materi?.pertemuan === m.pertemuan);
                              return (
                                <tr key={m.id} className="hover:bg-yellow-50/60 font-mono">
                                  <td className="p-2.5 text-center font-black text-black border-r border-black/10 bg-slate-50">
                                    #{m.pertemuan}
                                  </td>
                                  <td className="p-2.5 font-bold text-slate-900 border-r border-black/10 font-sans">
                                    {m.judul}
                                  </td>
                                  <td className="p-2.5 border-r border-black/10">
                                    <select
                                      value={statusHadir}
                                      onChange={(e) => handleTandaiKehadiran(m.pertemuan, e.target.value)}
                                      className={`text-xs font-mono font-bold uppercase px-2 py-1 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] outline-none cursor-pointer ${
                                        statusHadir === "Hadir"
                                          ? "bg-emerald-300 text-black"
                                          : statusHadir === "Belum"
                                          ? "bg-white text-slate-600"
                                          : "bg-rose-300 text-black"
                                      }`}
                                    >
                                      <option value="Belum">BELUM</option>
                                      <option value="Hadir">HADIR</option>
                                      <option value="Izin">IZIN</option>
                                      <option value="Sakit">SAKIT</option>
                                      <option value="Alpa">ALPA</option>
                                    </select>
                                  </td>
                                  <td className="p-2.5 text-center">
                                    {quizHasil ? (
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 font-mono text-xs font-black border border-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                                          quizHasil.nilai >= 75
                                            ? "bg-emerald-300 text-black"
                                            : "bg-rose-300 text-black"
                                        }`}
                                      >
                                        SCORE: {quizHasil.nilai}
                                      </span>
                                    ) : (
                                      <span className="font-mono text-xs text-slate-400 font-bold">[BELUM_ADA]</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Panel Kalkulasi Otomatis Nilai Akhir & Kelulusan Siswa */}
                    {(() => {
                      const avgQuiz = quizHasilList.length > 0
                        ? Math.round(quizHasilList.reduce((a, q) => a + (q.nilai || 0), 0) / quizHasilList.length)
                        : 80;
                      const totalPrtm = materiList.length || selectedSiswa.totalPertemuan || 10;
                      const hadirCount = kehadiranList.filter((k) => k.status === "Hadir").length;
                      const hadirPct = totalPrtm > 0 ? Math.min(100, Math.round((hadirCount / totalPrtm) * 100)) : 100;
                      const nilaiPraktik = Number(nilaiPraktikInput) || 85;

                      // Bobot: 40% Kuis + 30% Presensi + 30% Praktik
                      const calculatedNilaiAkhir = Math.round((avgQuiz * 0.4) + (hadirPct * 0.3) + (nilaiPraktik * 0.3));
                      const calculatedPredikat = calculatedNilaiAkhir >= 90
                        ? "Sangat Baik"
                        : calculatedNilaiAkhir >= 75
                        ? "Baik"
                        : calculatedNilaiAkhir >= 60
                        ? "Cukup"
                        : "Perlu Bimbingan";
                      const isAlreadyLulus = selectedSiswa.status === "Lulus";

                      return (
                        <div className="bg-amber-100 border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 sm:p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-black/20 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-black text-amber-300 rounded border border-black text-sm">
                                ⚡
                              </span>
                              <div>
                                <h4 className="font-heading font-black text-sm uppercase text-black">
                                  Kalkulasi Nilai Akhir &amp; Kelulusan Siswa
                                </h4>
                                <p className="font-mono text-[11px] text-slate-700">
                                  Formula: 40% Kuis + 30% Presensi + 30% Nilai Praktik
                                </p>
                              </div>
                            </div>

                            <span
                              className={`font-mono text-xs font-black px-2.5 py-1 border border-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                                isAlreadyLulus ? "bg-emerald-300 text-black" : "bg-white text-slate-700"
                              }`}
                            >
                              {isAlreadyLulus ? "🎓 STATUS: SUDAH LULUS" : "⏳ STATUS: MASIH AKTIF"}
                            </span>
                          </div>

                          {/* 3 Metric Inputs / Displays */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Kuis */}
                            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] space-y-1">
                              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                                <span>[01] RATA KUIS (40%)</span>
                              </div>
                              <div className="text-xl font-heading font-black text-black">
                                {avgQuiz}{" "}
                                <span className="text-xs font-mono text-slate-500 font-normal">
                                  ({quizHasilList.length} Kuis)
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-slate-500">
                                Poin: {Math.round(avgQuiz * 0.4)}
                              </p>
                            </div>

                            {/* Kehadiran */}
                            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] space-y-1">
                              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                                <span>[02] PRESENSI (30%)</span>
                              </div>
                              <div className="text-xl font-heading font-black text-black">
                                {hadirPct}%{" "}
                                <span className="text-xs font-mono text-slate-500 font-normal">
                                  ({hadirCount}/{totalPrtm} Sesi)
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-slate-500">
                                Poin: {Math.round(hadirPct * 0.3)}
                              </p>
                            </div>

                            {/* Nilai Praktik Input */}
                            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] space-y-1">
                              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                                <span>[03] PRAKTIK (30%)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={nilaiPraktikInput}
                                  onChange={(e) => setNilaiPraktikInput(e.target.value)}
                                  className="w-20 px-2 py-1 border-2 border-black text-sm font-heading font-black bg-yellow-50 focus:bg-white outline-none"
                                />
                                <span className="text-[11px] font-mono text-slate-500">
                                  Poin: {Math.round(nilaiPraktik * 0.3)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Calculated Result Banner & Action Button */}
                          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-emerald-300 border-2 border-black flex items-center justify-center font-heading font-black text-2xl shadow-[2px_2px_0px_0px_#000]">
                                {calculatedNilaiAkhir}
                              </div>
                              <div>
                                <p className="font-mono text-xs font-bold text-slate-500">
                                  HASIL KALKULASI NILAI AKHIR:
                                </p>
                                <p className="font-heading font-black text-base text-black">
                                  Predikat:{" "}
                                  <span className="text-emerald-700 underline">
                                    &quot;{calculatedPredikat}&quot;
                                  </span>
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleSimpanKelulusan(calculatedNilaiAkhir, calculatedPredikat)}
                              disabled={isSavingKelulusan}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Award className="w-4 h-4" />
                              <span>
                                {isSavingKelulusan
                                  ? "Menyimpan Kelulusan..."
                                  : isAlreadyLulus
                                  ? "Perbarui Nilai Kelulusan"
                                  : "🎓 Tetapkan LULUS & Terbitkan Nilai"}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* ── Reset Password Modal ── */}
      {resetPwModal && selectedSiswa && (
        <ResetPasswordModal
          siswa={selectedSiswa}
          onClose={() => setResetPwModal(false)}
        />
      )}

      {/* ── Aktivasi Siswa Modal ── */}
      {aktivasiModalOpen && activatingSiswa && (
        <AktivasiSiswaModal
          siswa={activatingSiswa}
          kelasList={kelasList}
          onClose={() => { setAktivasiModalOpen(false); setActivatingSiswa(null); }}
          onActivated={handleAktivasiSuccess}
        />
      )}
    </div>
  );
}
