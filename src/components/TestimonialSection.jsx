"use client";

import { Star, Terminal } from "lucide-react";

export default function TestimonialSection({ data }) {
  const showBadge = data?.showBadge !== false;
  const badgeText = data?.badgeText || "[TESTIMONIALS_LOG // VERIFIED_ALUMNI]";
  const titlePrefix = data?.titlePrefix || "CERITA NYATA ALUMNI";
  const titleHighlight = data?.titleHighlight || "YANG MAKIN PERCAYA DIRI BEKERJA";
  const description = data?.description || "Ratusan siswa dari berbagai latar belakang telah merasakan peningkatan efisiensi kerja setelah belajar di GWA Tech Course.";

  const defaultReviews = [
    {
      id: "LOG_01",
      isVisible: true,
      name: "Rizky Firmansyah",
      role: "Staff Administrasi & Keuangan",
      company: "PT. Sarana Distribusi",
      course: "Microsoft Excel Expert",
      rating: 5,
      comment: "Sebelumnya tiap kali bikin laporan rekap penjualan akhir bulan selalu lembur sampai malam karena rumus error melulu. Setelah ikut kelas Excel di GWA, diajarin logika VLOOKUP dan Pivot Table langsung pakai contoh kasus kantor. Sekarang laporan beres cuma 15 menit!",
      badge: "LULUS GRADE A"
    },
    {
      id: "LOG_02",
      isVisible: true,
      name: "Dini Anggraini",
      role: "Sekretaris & Operasional",
      company: "Klinik Utama Medika",
      course: "Paket Mahir 3-in-1 (Word, Excel, PPT)",
      rating: 5,
      comment: "Belajar di sini bener-bener privat! Karena 1 kelas cuma 5 orang, mentornya sabar banget ngebimbing dari nol. Yang tadinya gak paham Mail Merge buat cetak ratusan surat undangan, sekarang jadi tugas paling gampang.",
      badge: "ALUMNI 2026"
    },
    {
      id: "LOG_03",
      isVisible: true,
      name: "Budi Santoso",
      role: "Fresh Graduate / Jobseeker",
      company: "Lolos Seleksi Admin Kantor",
      course: "Microsoft Office Terpadu",
      rating: 5,
      comment: "Sertifikat dari GWA sangat membantu pas tes praktik kerja di perusahaan swasta. Soal tes praktik Excel dan Word mirip banget sama studi kasus yang diajarkan pas kursus. Sangat aplikatif dan recommended!",
      badge: "BERHASIL DITERIMA KERJA"
    }
  ];

  const rawReviews = data?.reviews || defaultReviews;
  const reviews = rawReviews.filter((r) => r.isVisible !== false);

  return (
    <section className="py-20 lg:py-28 bg-[#FFFDF5] bg-retro-dots border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {showBadge && badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-yellow-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] mb-4">
              <Terminal className="w-3.5 h-3.5" /> {badgeText}
            </div>
          )}
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4 uppercase">
            {titlePrefix} <br />
            {titleHighlight && (
              <span className="bg-yellow-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
                {titleHighlight}
              </span>
            )}
          </h2>
          
          {description && (
            <p className="text-base sm:text-lg font-medium text-slate-700 mt-4 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div 
              key={rev.id || idx}
              className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[9px_9px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
                <span className="text-amber-300">{rev.id || `LOG_0${idx+1}`} // FEEDBACK.LOG</span>
                <span className="text-emerald-400 text-[10px]">★ VERIFIED</span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-black stroke-[1.5]" />
                    ))}
                    <span className="font-mono text-xs font-bold text-black ml-1.5">{Number(rev.rating || 5).toFixed(1)} / 5.0</span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm font-medium text-slate-800 leading-relaxed italic mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t-2 border-black/15">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-heading font-black text-base text-black">
                      {rev.name}
                    </h4>
                    {rev.badge && (
                      <span className="font-mono text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-black px-1.5 py-0.5">
                        {rev.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] font-bold text-slate-600">
                    {rev.role} {rev.company ? `— ${rev.company}` : ""}
                  </p>
                  {rev.course && (
                    <p className="font-mono text-[10px] text-orange-600 font-bold mt-1">
                      Modul: {rev.course}
                    </p>
                  )}
                </div>

              </div>

              {/* Bottom Strip */}
              <div className="h-1.5 bg-yellow-400 border-t-2 border-black"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
