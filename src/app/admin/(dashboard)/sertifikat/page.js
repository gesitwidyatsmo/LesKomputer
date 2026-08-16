"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Search, FileText, Printer, CheckCircle, Loader2, Award, UserCheck, ShieldCheck } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { getLulusanSiswa, uploadSertifikat, simpanSertifikatRecord, getRiwayatSertifikat } from "@/lib/adminService";
import Swal from "sweetalert2";

export default function Sertifikat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);
  
  const [siswaLulus, setSiswaLulus] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: lulusData } = await getLulusanSiswa();
      if (lulusData) {
        const formattedLulus = lulusData.map(s => ({
             ...s,
             tanggalLulus: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        }));
        setSiswaLulus(formattedLulus);
      }
      
      const { data: riwayatData } = await getRiwayatSertifikat();
      if (riwayatData) setRiwayatList(riwayatData);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredSiswa = siswaLulus.filter(s => 
    s.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFDF5",
        onclone: (clonedDoc) => {
          // Remove any CSS stylesheet or variables that might contain modern lab/oklch colors
          const elList = clonedDoc.querySelectorAll("*");
          elList.forEach((el) => {
            try {
              const cs = window.getComputedStyle(el);
              if (cs.backgroundColor && (cs.backgroundColor.includes("lab") || cs.backgroundColor.includes("oklch"))) {
                el.style.backgroundColor = "#ffffff";
              }
              if (cs.color && (cs.color.includes("lab") || cs.color.includes("oklch"))) {
                el.style.color = "#000000";
              }
              if (cs.borderColor && (cs.borderColor.includes("lab") || cs.borderColor.includes("oklch"))) {
                el.style.borderColor = "#000000";
              }
            } catch (e) {
              // ignore
            }
          });
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4" // 297 x 210 mm
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      
      // Save locally
      const fileName = `Sertifikat_${selectedSiswa.nama.replace(/\s+/g, '_')}_${selectedSiswa.modul}.pdf`;
      pdf.save(fileName);
      
      // Also upload to Supabase and save record
      const pdfBlob = pdf.output('blob');
      const uploadRes = await uploadSertifikat(pdfBlob, selectedSiswa.id, selectedSiswa.modul);
      
      if (uploadRes.url) {
         await simpanSertifikatRecord({
            siswa_id: selectedSiswa.id,
            kelas_id: selectedSiswa.kelas_id,
            nilai_akhir: selectedSiswa.nilaiAkhir,
            predikat: selectedSiswa.predikat,
            url_pdf: uploadRes.url
         });
         // Refresh riwayat
         const { data } = await getRiwayatSertifikat();
         if (data) setRiwayatList(data);
      }
      
      // Show success
      Swal.fire({
        icon: 'success',
        title: 'Berhasil! 🎉',
        text: 'Sertifikat resmi berhasil dicetak & diarsipkan ke database.',
        timer: 2500,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat memproses sertifikat PDF: ' + (error.message || "") });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-300 border border-black text-black">
              [SYS_CERTIFICATE // ACCREDITATION_ENGINE]
            </span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              VERIFICATION: GWA-DIGITAL-SIGN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black">
            Penilaian & Penerbitan Sertifikat
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-600 mt-0.5">
            Cetak dokumen sertifikat resmi kompetensi kursus untuk siswa yang telah menyelesaikan kurikulum.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: List Siswa Lulus */}
        <div className="xl:col-span-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col h-[450px] sm:h-[550px] xl:h-[650px] overflow-hidden">
          {/* Window Titlebar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span>graduated_students.dat</span>
            </div>
            <span className="text-[10px] text-yellow-300 font-mono">[{siswaLulus.length} LULUS]</span>
          </div>

          <div className="p-3.5 border-b-2 border-black bg-yellow-50 shrink-0">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none"
                placeholder="Cari siswa lulus / ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#FFFDF5]">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-12 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="font-mono text-xs text-slate-500">[QUERY: LOADING_GRADUATES...]</span>
              </div>
            ) : filteredSiswa.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-dashed border-slate-300 p-4 font-mono text-xs text-slate-500">
                [EMPTY] Tidak ada data siswa berstatus Lulus.
              </div>
            ) : (
              filteredSiswa.map((siswa) => {
                const isGeneratedBefore = riwayatList.some(r => r.siswa_id === siswa.id);
                const isSelected = selectedSiswa?.id === siswa.id;
                return (
                  <div 
                    key={siswa.id} 
                    onClick={() => setSelectedSiswa(siswa)}
                    className={`p-3.5 border-2 border-black cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-orange-500 text-black shadow-[3px_3px_0px_0px_#000] translate-x-1 font-bold" 
                        : "bg-white text-black hover:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h4 className="font-heading font-black text-sm uppercase truncate text-black">{siswa.nama}</h4>
                        <p className={`font-mono text-xs mt-0.5 truncate ${isSelected ? 'text-black' : 'text-slate-600'}`}>
                          [{siswa.id}] • {siswa.modul}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 bg-emerald-300 text-black px-2 py-0.5 border border-black font-mono text-xs font-black shadow-[1px_1px_0px_0px_#000]">
                          <Award className="w-3 h-3" />
                          {siswa.nilaiAkhir || 90}
                        </div>
                        {isGeneratedBefore && (
                          <span className="font-mono text-[9px] bg-cyan-300 text-black px-1.5 py-0.2 border border-black font-bold uppercase">
                            TERCETAK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Preview & Generate */}
        <div className="xl:col-span-2 space-y-4">
          {selectedSiswa ? (
            <>
              {/* Action Bar */}
              <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-bold text-slate-500 uppercase">[PREVIEW_DOCUMENT]</p>
                    <p className="font-heading font-black text-base uppercase text-black">{selectedSiswa.nama} — {selectedSiswa.modul}</p>
                  </div>
                </div>
                <button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sedang Merender PDF...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF &amp; Arsipkan
                    </>
                  )}
                </button>
              </div>

              {/* Certificate Template Preview */}
              <div className="bg-slate-900 p-4 sm:p-6 border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center overflow-x-auto max-h-[70vh] xl:max-h-none">
                <div className="w-full flex justify-between items-center text-white font-mono text-xs mb-3 pb-2 border-b border-slate-700">
                  <span className="text-yellow-400 font-bold">[MONITOR_FRAME: CERTIFICATE_A4_LANDSCAPE]</span>
                  <span className="text-slate-400 hidden sm:inline">RESOLUTION: 300 DPI</span>
                </div>
                <div className="w-full flex justify-center overflow-x-auto pb-4">
                  <div className="min-w-[650px] transform scale-[0.6] sm:scale-75 md:scale-90 origin-top my-2">
                    {/* The actual certificate that will be captured by html2canvas */}
                    <div 
                      ref={certificateRef}
                      style={{
                        width: '1122px',
                        height: '793px',
                        backgroundColor: '#FFFDF5',
                        border: '8px solid #000000',
                        color: '#000000',
                        position: 'relative',
                        padding: '64px',
                        boxSizing: 'border-box',
                        fontFamily: 'sans-serif',
                      }}
                      className="shadow-2xl select-none"
                    >
                      {/* Inner border */}
                      <div style={{ position: 'absolute', inset: '16px', border: '2px solid #000000', pointerEvents: 'none' }} />

                      {/* Corner Decorations */}
                      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '64px', height: '64px', borderTop: '4px solid #FF6B00', borderLeft: '4px solid #FF6B00' }} />
                      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '64px', height: '64px', borderTop: '4px solid #FF6B00', borderRight: '4px solid #FF6B00' }} />
                      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '64px', height: '64px', borderBottom: '4px solid #FF6B00', borderLeft: '4px solid #FF6B00' }} />
                      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '64px', height: '64px', borderBottom: '4px solid #FF6B00', borderRight: '4px solid #FF6B00' }} />

                      {/* Header */}
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ width: '64px', height: '64px', margin: '0 auto 12px', backgroundColor: '#000000', color: '#FFFFFF', fontSize: '30px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000000', boxShadow: '3px 3px 0px 0px #FF6B00' }}>
                          G
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#000000', letterSpacing: '2px', textTransform: 'uppercase', margin: '0' }}>
                          Sertifikat Kelulusan &amp; Kompetensi
                        </h1>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#334155', letterSpacing: '1.5px', marginTop: '4px', textTransform: 'uppercase' }}>
                          GWA TECH COMPUTER LEARNING CENTER
                        </p>
                        <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', backgroundColor: '#FEF9C3', padding: '4px 12px', border: '1px solid #000000', display: 'inline-block' }}>
                          NO: {selectedSiswa.id}/CERT/GWA/{new Date().getFullYear()}
                        </p>
                      </div>

                      {/* Body */}
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <p style={{ fontSize: '13px', textTransform: 'uppercase', color: '#475569', fontWeight: '700', marginBottom: '8px' }}>
                          Diberikan secara resmi kepada:
                        </p>
                        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', borderBottom: '4px solid #000000', display: 'inline-block', padding: '0 48px 4px', letterSpacing: '1px', margin: '0 0 16px' }}>
                          {selectedSiswa.nama}
                        </h2>
                        <p style={{ fontSize: '16px', color: '#1E293B', maxWidth: '720px', margin: '16px auto 0', lineHeight: '1.6', fontWeight: '500' }}>
                          Telah menyelesaikan seluruh rangkaian program pelatihan modul <strong style={{ color: '#000000', backgroundColor: '#FEF08A', padding: '2px 6px', border: '1px solid #000000' }}>{selectedSiswa.modul}</strong> dengan evaluasi tugas praktik dan dinyatakan <strong style={{ color: '#047857', fontWeight: '900' }}>LULUS</strong> dengan predikat <strong>&quot;{selectedSiswa.predikat || 'Sangat Memuaskan'}&quot;</strong> (Skor: {selectedSiswa.nilaiAkhir || 90}).
                        </p>
                      </div>

                      {/* Footer Signatures & QR Code Verification */}
                      <div style={{ position: 'absolute', bottom: '48px', left: '80px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '48px' }}>
                          Instruktur &amp; Penguji
                        </p>
                        <div style={{ borderBottom: '2px solid #000000', width: '180px', marginBottom: '4px' }}></div>
                        <p style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#000000', margin: '0' }}>
                          Gesit Widi Atmoko, S.Kom
                        </p>
                        <p style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', margin: '0' }}>
                          Head Instructor GWA
                        </p>
                      </div>

                      {/* QR Code Center Verification */}
                      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ padding: '8px', backgroundColor: '#FFFFFF', border: '2px solid #000000', boxShadow: '2px 2px 0px 0px #000000' }}>
                          <QRCodeCanvas
                            value={`${typeof window !== "undefined" ? window.location.origin : ""}/verifikasi?id=${selectedSiswa.id}`}
                            size={72}
                            level="M"
                          />
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#1E293B', marginTop: '4px', textTransform: 'uppercase' }}>
                          SCAN UNTUK VERIFIKASI
                        </span>
                        <span style={{ fontSize: '8px', color: '#64748B' }}>
                          ID: {selectedSiswa.id}
                        </span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '48px', right: '80px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Tanggal Terbit: {selectedSiswa.tanggalLulus}
                        </p>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#047857', textTransform: 'uppercase', marginBottom: '32px' }}>
                          [OFFICIAL_VERIFIED ✓]
                        </p>
                        <div style={{ borderBottom: '2px solid #000000', width: '180px', marginBottom: '4px' }}></div>
                        <p style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#000000', margin: '0' }}>
                          DIREKTUR LEMBAGA
                        </p>
                        <p style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', margin: '0' }}>
                          Authorized Signatory
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border-2 border-dashed border-black h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 min-h-[450px]">
              <div className="w-16 h-16 bg-yellow-200 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-black mb-3">
                <Printer className="w-8 h-8" />
              </div>
              <p className="font-heading font-black text-base uppercase text-black">PILIH SISWA LULUS</p>
              <p className="font-mono text-xs text-slate-500 mt-1 max-w-sm">
                [SYS_INFO] Silakan pilih salah satu peserta kursus berstatus Lulus dari daftar di sebelah kiri untuk melihat preview dan mengunduh sertifikat resmi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
