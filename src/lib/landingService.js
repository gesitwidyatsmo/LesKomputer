import { supabase } from './supabase';

/**
 * Format string nomor WhatsApp ke format standar internasional (misal: 0812 -> 62812).
 */
export function normalizeWhatsAppNumber(rawNumber) {
  if (!rawNumber) return "6280000000000";
  let num = String(rawNumber).replace(/\D/g, "");
  if (num.startsWith("0")) {
    num = "62" + num.slice(1);
  }
  if (!num.startsWith("62") && num.length > 5) {
    num = "62" + num;
  }
  return num || "6280000000000";
}

/**
 * Membuat link wa.me dengan nomor dan pesan yang di-encode.
 */
export function formatWhatsAppUrl(rawNumber, message = "") {
  const num = normalizeWhatsAppNumber(rawNumber);
  const msg = encodeURIComponent(message || "");
  return `https://wa.me/${num}${msg ? `?text=${msg}` : ""}`;
}

/**
 * Format tampilan nomor telepon ramah baca (misal: +62 812-3456-7890).
 */
export function formatPhoneDisplay(rawNumber) {
  const num = normalizeWhatsAppNumber(rawNumber);
  if (num.startsWith("62")) {
    const rest = num.slice(2);
    if (rest.length >= 8) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
    }
    return `+62 ${rest}`;
  }
  return `+${num}`;
}

export const DEFAULT_LANDING_CONFIG = {
  // ⭐ PENGATURAN UMUM & KONTAK TERPUSAT (SINGLE SOURCE OF TRUTH & FOOTER)
  general: {
    is_visible: true,
    content: {
      whatsappNumber: "6280000000000", // SATU-SATUNYA INPUT NO. WA UNTUK SELURUH WEB
      brandName: "GWA.TECH",
      brandTagline: "// Gesit, Wawasan, Aplikatif",
      brandDescription: "Lembaga kursus komputer terpercaya dengan pendekatan eksklusif 1-on-5 mentoring. Fokus pada efisiensi kerja, pemahaman logika rumus, dan studi kasus nyata.",
      address: "Jl. Pendidikan No. 123, Kecamatan Ilmu, Kota Teknologi, Indonesia 12345",
      workingHours: "Senin - Sabtu: 08.30 - 21.00 WIB",
      copyright: "GWA TECH COURSE. HAK CIPTA DILINDUNGI.",
      showStatusStrip: true,
      showBrandInfo: true,
      showProgramsCol: true,
      showContactCol: true,
      footerProgramsTitle: "PROGRAM MODUL",
      footerPrograms: [
        { isVisible: true, label: "Microsoft Word Master", link: "/#program" },
        { isVisible: true, label: "Microsoft Excel Expert", link: "/#program" },
        { isVisible: true, label: "Microsoft PowerPoint Pro", link: "/#program" },
        { isVisible: true, label: "Paket Mahir 3-in-1 Kantor", link: "/#program" }
      ]
    }
  },
  announcement: {
    is_visible: true,
    content: {
      showBadge: true,
      batchStatus: "[BATCH_2026 // OPEN]",
      onlineText: "[ONLINE]",
      marqueeText1: "⚡ KUOTA TERBATAS: MAKSIMAL 5 SISWA / KELAS",
      marqueeText2: "1 SISWA 1 KOMPUTER — METODE PRAKTIK LANGSUNG DI TEMPAT",
      marqueeText3: "DAFTAR SEGERA >_",
      showButton: true,
      buttonText: "CEK SLOT >",
      whatsappMessage: "Halo Admin GWA, saya ingin cek slot kelas terdekat."
    }
  },
  hero: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[⚡ METODE EKSKLUSIF 1-ON-5 MENTORING]",
      headlinePrefix: "Belajar Komputer",
      headlineSub: "Gak Pakai Rumit.",
      headlineHighlight: "Dari Nol Sampai Mahir.",
      description: "Kuasai Microsoft Word, Excel Logika & Kasir, dan PowerPoint Profesional dengan metode mentoring privat maksimal 5 orang. 1 Siswa 1 Unit Komputer — 100% praktik langsung studi kasus dunia kerja.",
      showCtaWhatsapp: true,
      ctaWhatsappText: "Konsultasi via WhatsApp",
      ctaWhatsappMessage: "Halo Admin GWA, saya ingin konsultasi kursus komputer.",
      showCtaSecondary: true,
      ctaSecondaryText: "Lihat 3 Modul Kursus",
      ctaSecondaryLink: "/#program",
      showTrustBadges: true,
      trustBadge1: "100% Praktik Nyata",
      trustBadge2: "Sertifikat Resmi",
      trustBadge3: "1 Siswa 1 PC Mandiri",
      showFloatingBadges: true,
      floatingBadgeLeftTitle: "Total Alumni Lulus",
      floatingBadgeLeftValue: "500+ Siswa Mahir",
      floatingBadgeRightText: "5 PC WORKSTATION SIAP",
      showSimulator: true
    }
  },
  values: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[FILOSOFI INTI GWA TECH]",
      titlePrefix: "Bukan Sekadar Belajar Mengetik.",
      titleHighlight: "Kami Membentuk Mindset Solutif.",
      description: "Tiga pilar kurikulum GWA dirancang khusus agar Anda tidak hanya sekadar bisa, tapi unggul dan tangkas saat bekerja di kantor atau menjalankan bisnis.",
      items: [
        {
          id: "gesit",
          isVisible: true,
          code: "SYS_VAL // 01",
          title: "Gesit",
          subtitle: "Shortcut & Efisiensi Waktu",
          desc: "Kuasai puluhan jalan pintas keyboard (shortcuts), trik cepat navigasi, dan automasi tugas berulang. Bereskan pekerjaan harian berjam-jam hanya dalam beberapa menit tanpa lembur.",
          tag: "#SPEED_&_PRODUCTIVITY",
          accentColor: "bg-orange-500",
          lightBg: "bg-[#FFF7ED]",
          headerFile: "sys_speed_booster.bin",
          points: [
            "Shortcut esensial Word, Excel & PPT",
            "Trik navigasi data ribuan baris",
            "Automasi format & template dokumen"
          ]
        },
        {
          id: "wawasan",
          isVisible: true,
          code: "SYS_VAL // 02",
          title: "Wawasan",
          subtitle: "Logika Rumus & Problem Solving",
          desc: "Bukan sekadar hafalan tombol yang mudah dilupakan. Kami ajarkan cara komputer berpikir dan merangkai logika rumus (IF, VLOOKUP, INDEX MATCH) agar Anda mandiri memecahkan segala kendala data.",
          tag: "#LOGIC_NOT_MEMORIZATION",
          accentColor: "bg-cyan-400",
          lightBg: "bg-[#ECFEFF]",
          headerFile: "sys_logic_core.dll",
          points: [
            "Bedah logika rumus komputasi",
            "Teknik mengatasi error (#N/A, #VALUE!)",
            "Struktur data & manajemen file rapi"
          ]
        },
        {
          id: "aplikatif",
          isVisible: true,
          code: "SYS_VAL // 03",
          title: "Aplikatif",
          subtitle: "100% Studi Kasus Dunia Kerja",
          desc: "Langsung terjun ke simulasi riil: Pembuatan Faktur Kasir Toko, Slip Gaji Karyawan, Laporan Keuangan Neraca, Surat Undangan Massal Mail Merge, hingga Slide Presentasi Laporan Manajemen.",
          tag: "#REAL_WORLD_CASE_STUDIES",
          accentColor: "bg-emerald-400",
          lightBg: "bg-[#ECFDF5]",
          headerFile: "sys_real_world.dat",
          points: [
            "Studi kasus nyata bisnis & kantor",
            "Bahan latihan riil format resmi",
            "Portofolio hasil kerja siap pakai"
          ]
        }
      ]
    }
  },
  programs: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[CURRICULUM_MATRIX // 2026]",
      titlePrefix: "PILIH MODUL KEAHLIAN",
      titleHighlight: "SESUAI TARGET KARIR ANDA",
      description: "Setiap modul dirancang dari level dasar hingga mahir dengan kurikulum berbasis proyek nyata. Anda juga bisa mengambil paket lengkap 3-in-1 dengan potongan harga khusus.",
      items: [
        {
          id: "word",
          isVisible: true,
          code: "MODUL_01 // WORD",
          title: "Microsoft Word Master",
          subtitle: "Dokumen Resmi, Surat Massal & Administrasi",
          desc: "Kuasai pembuatan surat dinas resmi, proposal berstandar, format penomoran halaman otomatis, Mail Merge 100+ surat dalam sekejap, dan tata letak dokumen profesional tanpa berantakan.",
          windowHeader: "01_ms_word_master.exe",
          badgeText: "ESENSIAL KANTOR",
          badgeColor: "bg-cyan-300 text-black",
          accentBg: "bg-cyan-400",
          lightBg: "bg-[#ECFEFF]",
          duration: "8 Sesi Pertemuan (16 Jam Praktik)",
          tags: ["[MAIL MERGE]", "[LAYOUT SURAT]", "[DAFTAR ISI OTOMATIS]", "[TABEL & TABULASI]", "[HEADER / FOOTER]"],
          kurikulum: [
            { session: "Sesi 01-02", topic: "Pengenalan Antarmuka, Shortcuts Cepat, & Format Tipografi Rapi" },
            { session: "Sesi 03-04", topic: "Page Setup, Margin Standar Dinas, Indentasi, & Tabulasi Angka" },
            { session: "Sesi 05-06", topic: "Mail Merge (Cetak Surat Undangan, Sertifikat, & Amplop Massal)" },
            { session: "Sesi 07", topic: "Pembuatan Makalah, Proposal, Daftar Isi & Gambar Otomatis (Heading Styles)" },
            { session: "Sesi 08", topic: "Ujian Praktik Proyek Administrasi & Evaluasi Kelulusan" }
          ],
          targetHasil: "Mampu membuat dokumen kantor resmi, proposal bebas format berantakan, serta mencetak surat dinas massal dalam hitungan menit."
        },
        {
          id: "excel",
          isVisible: true,
          code: "MODUL_02 // EXCEL",
          title: "Microsoft Excel Expert",
          subtitle: "Logika Rumus, Kasir & Analisis Data",
          desc: "Program paling favorit! Dari nol hingga menguasai logika rumus IF bercabang, VLOOKUP/XLOOKUP, sistem kasir toko, slip gaji, laporan keuangan bulanan, hingga Pivot Table dan grafik interaktif.",
          windowHeader: "02_ms_excel_expert.exe",
          badgeText: "⭐ PALING DIMINATI",
          badgeColor: "bg-emerald-400 text-black",
          accentBg: "bg-emerald-500",
          lightBg: "bg-[#ECFDF5]",
          duration: "10 Sesi Pertemuan (20 Jam Praktik)",
          tags: ["[VLOOKUP / XLOOKUP]", "[LOGIKA IF/AND/OR]", "[PIVOT TABLE]", "[SISTEM KASIR]", "[CHART & DASHBOARD]"],
          kurikulum: [
            { session: "Sesi 01-02", topic: "Format Cell Akuntansi, Data Validation, & Rumus Matematika/Statistik Dasar (SUM, AVERAGE, COUNTIF)" },
            { session: "Sesi 03-04", topic: "Penguasaan Logika Lanjut (IF Tunggal, IF Bertingkat/Nested, AND, OR, IFS)" },
            { session: "Sesi 05-06", topic: "Pencarian Data Presisi (VLOOKUP, HLOOKUP, XLOOKUP, INDEX MATCH)" },
            { session: "Sesi 07-08", topic: "Studi Kasus Nyata: Pembuatan Sistem Kasir Toko & Laporan Penggajian Karyawan" },
            { session: "Sesi 09", topic: "Pivot Table, Slicer, dan Visualisasi Chart Laporan Keuangan" },
            { session: "Sesi 10", topic: "Simulasi Ujian Kasus Riil Akuntansi/Administrasi & Uji Kompetensi" }
          ],
          targetHasil: "Mahir merancang spreadsheet cerdas tanpa error, mengotomasi perhitungan data ribuan baris, dan membuat laporan keuangan siap pakai."
        },
        {
          id: "powerpoint",
          isVisible: true,
          code: "MODUL_03 // PPT",
          title: "Microsoft PowerPoint Pro",
          subtitle: "Desain Presentasi Eksekutif & Animasi Visual",
          desc: "Ubah presentasi membosankan jadi memukau dan profesional. Pelajari prinsip visual hierarchy, Master Slide, infografis visual, animasi transisi smooth (Morph), dan teknik penyampaian ide persuasif.",
          windowHeader: "03_ms_powerpoint_pro.exe",
          badgeText: "VISUAL & PITCHING",
          badgeColor: "bg-amber-300 text-black",
          accentBg: "bg-amber-400",
          lightBg: "bg-[#FEFCE8]",
          duration: "6 Sesi Pertemuan (12 Jam Praktik)",
          tags: ["[MASTER SLIDE]", "[ANIMASI MORPH]", "[INFOGRAFIS]", "[VISUAL STORYTELLING]", "[EXPORT VIDEO/PDF]"],
          kurikulum: [
            { session: "Sesi 01-02", topic: "Prinsip Desain Slide Modern, Tipografi, Palet Warna Kontras, & Layout Grid" },
            { session: "Sesi 03-04", topic: "Master Slide Setup, Pembuatan Infografis, Iconography, & SmartArt Visual" },
            { session: "Sesi 05", topic: "Animasi Profesional & Transisi Elegan (Morph Effect, Video & Audio Embed)" },
            { session: "Sesi 06", topic: "Proyek Akhir: Desain Pitch Deck Bisnis / Laporan Rapat & Ujian Praktik" }
          ],
          targetHasil: "Mampu merancang slide presentasi kelas eksekutif yang memukau audiens, rapi secara visual, dan memperkuat pesan presentasi."
        }
      ],
      showPromoBanner: true,
      promoBadge: "🔥 PAKET KOMPLIT ALL-IN-ONE",
      promoTitle: "Paket Mahir Komputer Kantor (Word + Excel + PPT)",
      promoDesc: "Ambil 3 modul sekaligus untuk penguasaan total administrasi kantor & bisnis. Dapatkan diskon spesial, modul cetak eksklusif, serta garansi bimbingan sampai mahir!",
      promoButtonText: "KLAIM PROMO PAKET 3-IN-1",
      promoWhatsappMessage: "Halo Admin GWA, saya tertarik dengan Paket Komplit 3-in-1 (Word+Excel+PPT)."
    }
  },
  fasilitas: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[LAB_ARCHITECTURE // PRIVATE_ROOM]",
      titlePrefix: "DENAH KELAS 5-WORKSTATION:",
      titleHighlight: "1 SISWA 1 UNIT KOMPUTER",
      description: "Kami menolak konsep kelas massal yang berisik dan tidak terarah. Di GWA Tech Course, setiap sesi hanya diisi 5 orang untuk menjamin bimbingan intensif dan pemahaman penuh.",
      showWorkstations: true,
      pcStations: [
        {
          id: 1,
          isVisible: true,
          name: "PC-01 // WORKSTATION",
          status: "TERSEDIA",
          isOnline: true,
          specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
          session: "Shift Pagi / Sore / Malam"
        },
        {
          id: 2,
          isVisible: true,
          name: "PC-02 // WORKSTATION",
          status: "TERSEDIA",
          isOnline: true,
          specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
          session: "Shift Pagi / Sore / Malam"
        },
        {
          id: 3,
          isVisible: true,
          name: "PC-03 // WORKSTATION",
          status: "TERISI (BATCH PAGI)",
          isOnline: false,
          specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
          session: "Slot Siang & Malam Tersedia"
        },
        {
          id: 4,
          isVisible: true,
          name: "PC-04 // WORKSTATION",
          status: "TERSEDIA",
          isOnline: true,
          specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
          session: "Shift Pagi / Sore / Malam"
        },
        {
          id: 5,
          isVisible: true,
          name: "PC-05 // WORKSTATION",
          status: "TERSEDIA",
          isOnline: true,
          specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
          session: "Shift Pagi / Sore / Malam"
        }
      ],
      showFacilitiesList: true,
      facilities: [
        {
          isVisible: true,
          title: "Maksimal 5 Siswa / Kelas",
          desc: "Suasana belajar privat & intensif. Mentor selalu standby di samping Anda untuk membimbing setiap kendala rumus dan tugas.",
          iconName: "Users",
          color: "bg-orange-300"
        },
        {
          isVisible: true,
          title: "1 Siswa 1 Unit Komputer",
          desc: "Tidak perlu repot membawa laptop sendiri. Setiap siswa disediakan 1 workstation PC spesifikasi mumpuni siap pakai.",
          iconName: "Monitor",
          color: "bg-cyan-300"
        },
        {
          isVisible: true,
          title: "Ruangan Ber-AC Dingin & Nyaman",
          desc: "Fasilitas ruang belajar ber-AC yang sejuk, bersih, bebas kebisingan, dan nyaman untuk konsentrasi belajar maksimal.",
          iconName: "AirVent",
          color: "bg-emerald-300"
        },
        {
          isVisible: true,
          title: "Modul Cetak + Portal LMS 24/7",
          desc: "Dapatkan buku panduan fisik eksklusif serta akses akun portal siswa untuk ujian kuis mandiri & download bahan latihan.",
          iconName: "HardDrive",
          color: "bg-amber-300"
        },
        {
          isVisible: true,
          title: "Free High-Speed WiFi Internet",
          desc: "Koneksi internet cepat untuk download data latihan, referensi riset dokumen, dan simulasi pengiriman email tugas kantor.",
          iconName: "Wifi",
          color: "bg-purple-300"
        },
        {
          isVisible: true,
          title: "Garansi Bimbingan Sampai Bisa",
          desc: "Belum paham di pertemuan tertentu? Bebas konsultasi tambahan dengan mentor tanpa biaya sepeserpun sampai benar-benar mahir.",
          iconName: "ShieldCheck",
          color: "bg-rose-300"
        }
      ],
      showStats: true,
      stats: [
        { isVisible: true, value: "500+", label: "Siswa Lulus Mahir", sub: "Tersebar di berbagai kantor & instansi" },
        { isVisible: true, value: "1 : 5", label: "Rasio Mentor Siswa", sub: "Maksimal 5 siswa per sesi pertemuan" },
        { isVisible: true, value: "98%", label: "Tingkat Kepuasan", sub: "Rekomendasi langsung dari alumni" },
        { isVisible: true, value: "100%", label: "Praktik Langsung", sub: "Bukan teori hafalan semata" }
      ]
    }
  },
  testimonials: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[TESTIMONIALS_LOG // VERIFIED_ALUMNI]",
      titlePrefix: "CERITA NYATA ALUMNI",
      titleHighlight: "YANG MAKIN PERCAYA DIRI BEKERJA",
      description: "Ratusan siswa dari berbagai latar belakang telah merasakan peningkatan efisiensi kerja setelah belajar di GWA Tech Course.",
      reviews: [
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
      ]
    }
  },
  faq: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[KNOWLEDGE_BASE // FAQ]",
      titlePrefix: "PERTANYAAN UMUM",
      titleHighlight: "SEPUTAR KELAS & FASILITAS",
      description: "Punya pertanyaan sebelum mendaftar? Temukan jawabannya di bawah ini atau tanyakan langsung ke admin kami.",
      faqs: [
        {
          isVisible: true,
          q: "Saya benar-benar awam dan belum pernah menyentuh komputer. Apakah bisa ikut?",
          a: "Tentu sangat bisa! Kurikulum kami dimulai dari cara penggunaan dasar, pengenalan keyboard shortcuts, hingga logika penggunaan software secara bertahap. Dengan konsep maksimal 5 siswa per sesi, mentor akan memandu Anda secara personal step-by-step tanpa perlu merasa malu atau tertinggal."
        },
        {
          isVisible: true,
          q: "Apakah jadwal belajarnya fleksibel jika saya seorang pekerja atau mahasiswa?",
          a: "Ya! Kami menyediakan pilihan shift belajar yang fleksibel: Shift Pagi (08.30 - 10.30 WIB), Shift Siang (13.30 - 15.30 WIB), Shift Sore (16.00 - 18.00 WIB), dan Shift Malam (19.00 - 21.00 WIB). Anda juga bisa berkonsultasi untuk penyesuaian jadwal khusus."
        },
        {
          isVisible: true,
          q: "Apakah saya perlu membawa laptop sendiri saat kelas berlangsung?",
          a: "Tidak perlu repot! Kami sudah menyediakan 5 unit komputer PC berspesifikasi tinggi lengkap dengan software Microsoft Office berlisensi di lab belajar ber-AC. Anda cukup datang dan fokus belajar."
        },
        {
          isVisible: true,
          q: "Apakah lulusan akan mendapatkan sertifikat resmi?",
          a: "Ya! Setelah menyelesaikan modul dan lulus ujian proyek praktik, Anda akan menerima Sertifikat Fisik Resmi ber-QR Code serta E-Sertifikat Digital (PDF) berstempel resmi yang dapat dilampirkan untuk melamar kerja di perusahaan swasta, BUMN, maupun berkas instansi."
        },
        {
          isVisible: true,
          q: "Bagaimana jika ada materi yang belum saya pahami setelah sesi selesai?",
          a: "Kami memberikan Garansi Bimbingan Sampai Bisa. Anda berhak mendapatkan sesi konsultasi & asistensi tambahan dengan mentor serta akses materi pada portal siswa secara gratis tanpa dipungut biaya tambahan."
        }
      ],
      showHelpBox: true,
      helpBoxTitle: "Masih Ada Pertanyaan Lain?",
      helpBoxDesc: "Tim admin & mentor kami siap menjawab konsultasi kebutuhan belajar Anda.",
      helpBoxButtonText: "Chat Admin WhatsApp",
      helpBoxWhatsappMessage: "Halo Admin GWA, saya ingin tanya-tanya seputar kursus."
    }
  },
  cta_banner: {
    is_visible: true,
    content: {
      showBadge: true,
      badgeText: "[SYS_COMMAND // INITIALIZE_ENROLLMENT]",
      titlePrefix: "SIAP MENJADI MAHIR",
      titleHighlight: "DAN PERCAYA DIRI BEKERJA?",
      description: "Slot 5 siswa per kelas sangat cepat penuh. Segera konsultasikan modul yang Anda butuhkan dan amankan jadwal kelas terbaik Anda bersama mentor kami hari ini.",
      showBadges: true,
      badge1: "Bebas Biaya Pendaftaran",
      badge2: "Modul & Praktik Lengkap",
      showButtonPrimary: true,
      buttonPrimaryText: "DAFTAR VIA WHATSAPP SEKARANG",
      buttonPrimaryMessage: "Halo Admin GWA, saya siap mendaftar kelas kursus komputer.",
      showButtonSecondary: true,
      buttonSecondaryText: "[#] Eksplor Modul Kursus Lainnya",
      buttonSecondaryLink: "/#program"
    }
  },
  floating_wa: {
    is_visible: true,
    content: {
      showTooltip: true,
      tooltipText: "[ CHAT MENTOR GESIT >_ ]",
      whatsappMessage: "Halo Admin GWA Tech Course, saya ingin konsultasi jadwal dan program kursus."
    }
  },
  footer: {
    is_visible: true,
    content: {
      // Mengikuti pengaturan 'general' secara default
    }
  }
};

/**
 * Mengambil semua konfigurasi landing page dari Supabase.
 * Menggabungkan dengan default fallback agar tidak crash jika ada tabel/field yang belum ada.
 */
export async function getLandingPageConfig() {
  try {
    const { data, error } = await supabase
      .from('landing_settings')
      .select('*');

    if (error || !data || data.length === 0) {
      return { success: true, data: DEFAULT_LANDING_CONFIG, isDefault: true };
    }

    // Merge DB records into DEFAULT_LANDING_CONFIG
    const merged = JSON.parse(JSON.stringify(DEFAULT_LANDING_CONFIG));
    
    data.forEach((row) => {
      if (merged[row.section_key]) {
        merged[row.section_key] = {
          is_visible: row.is_visible !== undefined ? row.is_visible : true,
          content: {
            ...merged[row.section_key].content,
            ...(row.content || {})
          }
        };
      }
    });

    // Sinkronisasi nomor WA terpusat jika ada data legacy di baris announcement/floating_wa
    const globalWa = merged.general?.content?.whatsappNumber || 
                     merged.announcement?.content?.whatsappNumber || 
                     merged.floating_wa?.content?.whatsappNumber || 
                     "6280000000000";

    merged.general.content.whatsappNumber = globalWa;

    return { success: true, data: merged, isDefault: false };
  } catch (err) {
    console.error("Error fetching landing config:", err);
    return { success: true, data: DEFAULT_LANDING_CONFIG, isDefault: true };
  }
}

/**
 * Menyimpan / memperbarui satu section di Supabase.
 */
export async function updateLandingSection(sectionKey, content, isVisible = true) {
  try {
    const { data, error } = await supabase
      .from('landing_settings')
      .upsert({
        section_key: sectionKey,
        content: content,
        is_visible: isVisible,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error(`Error saving section ${sectionKey}:`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error(`Exception saving section ${sectionKey}:`, err);
    return { success: false, error: err };
  }
}

/**
 * Menyimpan seluruh konfigurasi halaman utama sekaligus.
 */
export async function updateAllLandingSections(fullConfig) {
  try {
    const payload = Object.keys(fullConfig).map((key) => ({
      section_key: key,
      content: fullConfig[key].content,
      is_visible: fullConfig[key].is_visible,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('landing_settings')
      .upsert(payload, { onConflict: 'section_key' })
      .select();

    if (error) {
      console.error("Error saving all sections:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception saving all sections:", err);
    return { success: false, error: err };
  }
}

/**
 * Mereset konfigurasi ke default awal.
 */
export async function resetLandingToDefaults() {
  return await updateAllLandingSections(DEFAULT_LANDING_CONFIG);
}
