"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  Search,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Building,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { getSiswaById } from "@/lib/siswaService";

function VerifikasiContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || searchParams.get("no") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [siswaData, setSiswaData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async (idToSearch) => {
    const query = (idToSearch || searchId).trim();
    if (!query) return;

    setIsLoading(true);
    setSearched(true);
    setNotFound(false);

    try {
      const { data, error } = await getSiswaById(query);
      if (error || !data) {
        setSiswaData(null);
        setNotFound(true);
      } else {
        setSiswaData(data);
        setNotFound(false);
      }
    } catch (err) {
      console.error("Verification query error:", err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center justify-start">
      <div className="max-w-2xl w-full space-y-6">
        {/* Top Branding Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-yellow-200 text-black font-heading text-xs font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-sm text-black">
              GWA<span className="text-orange-500">.</span>TECH
            </span>
            <span className="bg-black text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
              VERIFIER
            </span>
          </div>
        </div>

        {/* Verification Card Box */}
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-amber-300">Pusat Verifikasi E-Sertifikat Resmi</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">● LIVE_CHECK</span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight">
                Verifikasi Keaslian Dokumen
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-md mx-auto">
                Validasi sertifikat digital resmi yang diterbitkan oleh Lembaga Pelatihan Komputer <strong>GWA Tech Course</strong>.
              </p>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Masukkan Nomor Siswa (cth: GWA-202608-001)"
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 font-medium text-xs sm:text-sm border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs sm:text-sm font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verifikasi"}
              </button>
            </form>

            {/* Result Loading */}
            {isLoading && (
              <div className="p-8 text-center space-y-2 bg-yellow-50 border-2 border-dashed border-black rounded-xl">
                <Loader2 className="w-7 h-7 animate-spin text-orange-500 mx-auto" />
                <p className="text-xs font-heading font-bold text-black">
                  Sedang memverifikasi nomor dokumen di basis data resmi...
                </p>
              </div>
            )}

            {/* Result: NOT FOUND */}
            {!isLoading && searched && notFound && (
              <div className="p-6 bg-rose-50 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-center space-y-3 animate-in zoom-in-95 duration-150">
                <div className="w-12 h-12 bg-rose-200 border-2 border-black rounded-xl flex items-center justify-center text-2xl mx-auto">
                  ❌
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-rose-950 uppercase">
                    Dokumen Tidak Terdaftar
                  </h3>
                  <p className="text-xs text-rose-800 font-medium mt-1">
                    Nomor ID <strong>&quot;{searchId}&quot;</strong> tidak ditemukan dalam database sertifikat resmi GWA Tech Course. Pastikan nomor yang dimasukkan sudah benar.
                  </p>
                </div>
              </div>
            )}

            {/* Result: FOUND & LULUS */}
            {!isLoading && searched && siswaData && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {siswaData.status === "Lulus" ? (
                  <div className="border-3 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                    {/* Status Top Banner */}
                    <div className="bg-emerald-400 p-4 border-b-2 border-black flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        <span className="font-heading font-black text-xs sm:text-sm uppercase text-black">
                          Sertifikat Terverifikasi Asli &amp; Resmi
                        </span>
                      </div>
                      <span className="bg-black text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        STATUS: VALID ✓
                      </span>
                    </div>

                    <div className="p-5 bg-[#FFFDF5] space-y-4">
                      {/* Grid Data */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                          <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">
                            Nama Peserta
                          </span>
                          <span className="font-heading font-black text-sm sm:text-base text-black mt-0.5 block">
                            {siswaData.nama}
                          </span>
                        </div>

                        <div className="p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                          <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">
                            Nomor Sertifikat
                          </span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-black mt-0.5 block">
                            {siswaData.id}/CERT/GWA/2026
                          </span>
                        </div>

                        <div className="p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                          <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">
                            Program / Modul Kursus
                          </span>
                          <span className="font-heading font-bold text-xs sm:text-sm text-black mt-0.5 block">
                            {siswaData.modul}
                          </span>
                        </div>

                        <div className="p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                          <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">
                            Tanggal Kelulusan
                          </span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-black mt-0.5 block">
                            {siswaData.tanggalLulus || siswaData.tanggal_lulus || "16 Agustus 2026"}
                          </span>
                        </div>
                      </div>

                      {/* Nilai Akhir & Predikat Box */}
                      <div className="p-4 bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-600 font-bold uppercase block">
                            Hasil Evaluasi Akhir
                          </span>
                          <span className="font-heading font-black text-sm text-black">
                            Predikat: &quot;{siswaData.predikat || "Sangat Baik"}&quot;
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-600 font-bold uppercase block">
                            Skor Nilai
                          </span>
                          <span className="font-heading font-black text-2xl text-emerald-700">
                            {siswaData.nilaiAkhir || siswaData.nilai_akhir || 90}
                          </span>
                        </div>
                      </div>

                      {/* Official Statement */}
                      <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-lg text-[11px] text-slate-700 font-medium leading-relaxed">
                        Dokumen sertifikat ini diterbitkan secara sah oleh Lembaga Pelatihan Komputer <strong>GWA Tech Course</strong> dan terdaftar dalam pangkalan data kompetensi resmi.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] text-center space-y-2">
                    <p className="font-heading font-black text-sm text-black">
                      Peserta Terdaftar ({siswaData.nama}), Status: Masih Belajar
                    </p>
                    <p className="text-xs text-slate-600">
                      Sertifikat kelulusan belum diterbitkan karena siswa masih dalam proses menyelesaikan sesi materi dan ujian kuis.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifikasiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-heading font-bold text-xs">
          Memuat sistem verifikasi... 🛡️
        </div>
      }
    >
      <VerifikasiContent />
    </Suspense>
  );
}
