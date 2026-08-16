"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Search, FileText, Printer, CheckCircle, Loader2, Award, UserCheck, ShieldCheck } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
        logging: false
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
        title: 'Berhasil!',
        text: 'Sertifikat resmi berhasil dicetak & diarsipkan ke database.',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat memproses sertifikat PDF.' });
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
                      className="w-[1122px] h-[793px] bg-[#FFFDF5] relative p-16 shadow-2xl border-8 border-black select-none"
                    >
                      {/* Inner border */}
                      <div className="absolute inset-4 border-2 border-black pointer-events-none"></div>

                      {/* Corner Decorations */}
                      <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-orange-500"></div>
                      <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-orange-500"></div>
                      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-orange-500"></div>
                      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-orange-500"></div>

                      {/* Header */}
                      <div className="text-center mb-12">
                        <div className="w-16 h-16 mx-auto bg-black text-white font-heading font-black text-3xl flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_#FF6B00] mb-3">
                          G
                        </div>
                        <h1 className="text-3xl font-heading font-black text-black tracking-widest uppercase">
                          Sertifikat Kelulusan &amp; Kompetensi
                        </h1>
                        <p className="text-sm font-mono text-slate-700 font-bold tracking-widest mt-1 uppercase">
                          GWA TECH COMPUTER LEARNING CENTER
                        </p>
                        <p className="font-mono text-xs text-slate-500 mt-2 bg-yellow-100 px-3 py-1 border border-black inline-block">
                          NO: {selectedSiswa.id}/CERT/GWA/{new Date().getFullYear()}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="text-center space-y-4 mb-12">
                        <p className="font-mono text-sm uppercase text-slate-600 font-bold">Diberikan secara resmi kepada:</p>
                        <h2 className="text-4xl font-heading font-black text-black uppercase border-b-4 border-black inline-block px-12 pb-1 tracking-wider">
                          {selectedSiswa.nama}
                        </h2>
                        <p className="text-base text-slate-700 max-w-2xl mx-auto leading-relaxed mt-4 font-sans font-medium">
                          Telah menyelesaikan seluruh rangkaian program pelatihan modul <strong className="text-black font-black bg-yellow-200 px-1 border border-black">{selectedSiswa.modul}</strong> dengan evaluasi tugas praktik dan dinyatakan <strong className="text-emerald-700 font-black">LULUS</strong> dengan predikat <strong>"{selectedSiswa.predikat || 'Sangat Memuaskan'}"</strong> (Skor: {selectedSiswa.nilaiAkhir || 90}).
                        </p>
                      </div>

                      {/* Footer Signatures */}
                      <div className="absolute bottom-14 left-24 text-center font-mono">
                        <p className="text-xs font-bold text-slate-600 uppercase mb-14">Instruktur &amp; Penguji</p>
                        <div className="border-b-2 border-black w-48 mb-1.5"></div>
                        <p className="font-heading font-black text-sm uppercase text-black">Gesit Widi Atmoko</p>
                        <p className="text-[10px] text-slate-500 font-bold">Head Instructor</p>
                      </div>

                      <div className="absolute bottom-14 right-24 text-center font-mono">
                        <p className="text-xs font-bold text-slate-600 uppercase mb-1">Tanggal Terbit: {selectedSiswa.tanggalLulus}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-10">[OFFICIAL_VERIFIED]</p>
                        <div className="border-b-2 border-black w-48 mb-1.5"></div>
                        <p className="font-heading font-black text-sm uppercase text-black">GWA TECH DIRECTOR</p>
                        <p className="text-[10px] text-slate-500 font-bold">Authorized Signatory</p>
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
