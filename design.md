# GWA TECH COURSE — DESIGN SYSTEM & UI/UX GUIDELINE
## Cyber-Neobrutalism & Retro-Tech Computer System

**Versi:** 2.0 (Neobrutalism Edition)  
**Platform:** Next.js 16 (App Router) + Tailwind CSS v4 + Lucide Icons  
**Target Aplikasi:** Landing Page Publik, Portal Siswa (LMS), & Dashboard Admin (CRM LKP)  
**Filosofi Inti:** **GWA** (*Gesit, Wawasan, Aplikatif*) × *Tactile Retro-Futuristic Computing*

---

## 1. Visi Desain & Filosofi "Cyber-Neobrutalism"

Desain ini menggabungkan **Neobrutalism** (garis tepi tebal, warna kontras tinggi, bayangan tegas tanpa blur, tata letak blok berani) dengan **Estetika Teknologi Komputer & Retro-Computing** (elemen window OS vintage, terminal CLI `>_`, aksen monospace, status badge ala BIOS/Server, tombol mekanis tactile, dan visual arsitektur hardware).

```
 ┌──────────────────────────────────────────────────────────────┐
 │ [●][▲][■] GWA_OS_v2.0 // TERMINAL READY           [SYS: OK]  │
 ├──────────────────────────────────────────────────────────────┤
 │  > BOLD 2-3px SOLID BORDERS                                  │
 │  > HARD OFFSET SHADOWS (3px-6px, NO BLUR)                    │
 │  > VIBRANT RETRO-TECH ACCENTS (Cyan, Lime, Amber, Cyber-Red) │
 │  > MONOSPACE METADATA & CLI BADGES                           │
 │  > MECHANICAL TACTILE PRESS ON HOVER/ACTIVE                  │
 └──────────────────────────────────────────────────────────────┘
```

### Pilar Utama
1. **Tactile & Mechanical (Aplikatif):** Setiap tombol, kartu, dan dropdown memiliki kedalaman fisik. Tombol terasa seperti ditekan pada keyboard mekanikal (*hard drop shadow* yang mengecil saat di-klik).
2. **Clarity & High Contrast (Wawasan):** Teks sangat terbaca, kontras hitam pekat di atas warna cerah, mempermudah siswa dan admin membaca materi, kode, dan tabel data tanpa kelelahan visual.
3. **Speed & Efficiency (Gesit):** UI tanpa animasi lambat. Transisi cepat (100ms-150ms), status sistem sekilas terlihat (*badge*, *chips*, *indicator lights*).

---

## 2. Palet Warna (Color System)

Neobrutalism menggunakan warna dasar netral yang kuat (*Off-White, Pure Black, Slate*) dipadukan dengan aksen *High-Energy Tech*.

### A. Palet Utama (Core Palette)
| Token / Nama | Hex Code | Tailwind Utility | Karakter & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Ink Black (Border/Text)** | `#0F172A` / `#000000` | `border-black text-slate-950` | Border utama (2px-3px), teks heading, hard shadow |
| **Cyber Canvas (Bg Light)** | `#F8FAFC` / `#FFFDF5` | `bg-slate-50` / `bg-[#FFFDF5]` | Background halaman utama & portal |
| **GWA Tech Orange** | `#FF6B00` / `#F97316` | `bg-orange-500` | CTA Utama, Aksen "Gesit", Sorotan Kursus |
| **Terminal Green** | `#10B981` / `#22C55E` | `bg-emerald-500` | Status "Online", Lulus, Sukses, Excel Badge |
| **Electric Cyan** | `#06B6D4` / `#0284C7` | `bg-cyan-500` / `bg-sky-500` | Word Modul, Tech Info, Header Siswa |
| **Warning / Retro Amber** | `#FACC15` / `#FFE600` | `bg-amber-400` / `bg-yellow-400` | Badge Pending, Rating, PowerPoint Modul |
| **Cyber Lilac / Purple** | `#8B5CF6` / `#A855F7` | `bg-purple-500` | Admin Superuser, Sertifikat, Kuis Khusus |
| **Error / Alert Crimson** | `#EF4444` / `#F43F5E` | `bg-rose-500` | Validasi Error, Tombol Hapus, Deadline Kuis |

### B. Warna Pastel Tint (Surface & Card Backgrounds)
Untuk kartu data agar tidak silau namun tetap kontras dan berwarna:
- **Mint Surface:** `#ECFDF5` (`bg-emerald-50`)
- **Cyan Surface:** `#ECFEFF` (`bg-cyan-50`)
- **Amber Surface:** `#FEFCE8` (`bg-yellow-50`)
- **Orange Surface:** `#FFF7ED` (`bg-orange-50`)
- **Violet Surface:** `#F5F3FF` (`bg-violet-50`)
- **Pure White Card:** `#FFFFFF` (`bg-white`)

---

## 3. Sistem Tipografi (Typography)

Kombinasi 3 kategori font untuk memisahkan hierarki: **Brutalist Display** untuk judul besar, **Clean Modern Sans** untuk teks bacaan, dan **Monospace Tech** untuk elemen data komputer.

```
[H1/H2 Heading]   --> Poppins / Space Grotesk (Bold 700 - Black 900, Tight Tracking)
[Body & Paragraf] --> Inter / Plus Jakarta Sans (Regular 400 - SemiBold 600)
[Tech Metadata]   --> JetBrains Mono / Space Mono / Courier (Bold 700, Uppercase)
```

### Standar Hirarki Teks:
- **Display / Hero H1:** `text-4xl md:text-6xl font-black tracking-tight text-black`
- **Section Heading H2:** `text-2xl md:text-3xl font-black tracking-tight uppercase`
- **Card Title H3:** `text-lg md:text-xl font-bold tracking-tight text-slate-900`
- **Body Text:** `text-sm md:text-base font-medium text-slate-800 leading-relaxed`
- **Tech / Meta Tag:** `font-mono text-xs font-bold uppercase tracking-wider` (Contoh: `[MODUL: MS_EXCEL_01]`, `STATUS: 200_OK`)

---

## 4. Efek Neobrutalism & Elemen Komputer (Core Components)

### A. Border & Hard Shadow Tokens (Kunci Neobrutalism)
Neobrutalism TIDAK menggunakan *soft blur shadow*. Menggunakan *solid color offset shadow*:

```css
/* Custom Utility Class Reference */
.neo-border {
  border: 2px solid #000000;
}
.neo-border-thick {
  border: 3px solid #000000;
}
.neo-shadow-sm {
  box-shadow: 2px 2px 0px 0px #000000;
}
.neo-shadow {
  box-shadow: 4px 4px 0px 0px #000000;
}
.neo-shadow-lg {
  box-shadow: 6px 6px 0px 0px #000000;
}
.neo-shadow-xl {
  box-shadow: 8px 8px 0px 0px #000000;
}

/* Hover & Click Mechanics (Tactile Feel) */
.neo-btn-interactive {
  transition: all 0.15s cubic-bezier(0, 0, 0.2, 1);
}
.neo-btn-interactive:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #000000;
}
.neo-btn-interactive:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px 0px #000000;
}
```

---

### B. Retro Window Bar (Header Jendela Sistem)
Gunakan komponen ini di atas Modal, Card Kursus Utama, atau Reader Materi:

```html
<!-- Retro OS / Terminal Titlebar -->
<div class="flex items-center justify-between px-3 py-1.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
  <div class="flex items-center gap-2">
    <div class="flex gap-1.5">
      <span class="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
    </div>
    <span class="tracking-wide">sys_materi_reader.exe</span>
  </div>
  <span class="text-[10px] text-emerald-400">[ONLINE]</span>
</div>
```

---

### C. Tombol Neobrutalism (Buttons)

#### 1. Primary Action Button (GWA Orange)
```html
<button class="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm tracking-wide uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">
  <span class="font-mono">>_</span> Mulai Belajar Sekarang
</button>
```

#### 2. Secondary / Utility Button (White / Cyan)
```html
<button class="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-cyan-100 text-black font-bold text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">
  <Download class="w-4 h-4" /> Unduh Modul PDF
</button>
```

#### 3. Danger / Delete Button (Crimson Red)
```html
<button class="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
  <Trash2 class="w-3.5 h-3.5" /> Hapus
</button>
```

---

### D. Input Form & Dropdown (Neobrutalist Inputs)
```html
<!-- Input Text -->
<div class="space-y-1">
  <label class="block font-mono text-xs font-bold uppercase text-black">
    [INPUT] Nama Lengkap Siswa *
  </label>
  <input 
    type="text" 
    placeholder="Contoh: Gesit Widi Atmoko" 
    class="w-full px-3 py-2.5 bg-white text-black font-medium text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none focus:ring-0 placeholder:text-slate-400"
  />
</div>

<!-- Select Option -->
<div class="space-y-1">
  <label class="block font-mono text-xs font-bold uppercase text-black">
    [SELECT] Pilihan Modul Kursus
  </label>
  <select class="w-full px-3 py-2.5 bg-white text-black font-bold text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] focus:bg-cyan-50 focus:outline-none focus:ring-0 cursor-pointer">
    <option value="word">01 // Microsoft Word Master</option>
    <option value="excel">02 // Microsoft Excel & Logika Rumus</option>
    <option value="ppt">03 // Microsoft PowerPoint Pro</option>
  </select>
</div>
```

---

### E. Status Badges & Tech Chips
```html
<!-- Green Online / Selesai -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-300 text-black font-mono text-xs font-bold uppercase border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
  <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> LULUS_100%
</span>

<!-- Amber Pending -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-yellow-300 text-black font-mono text-xs font-bold uppercase border-1.5 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
  ⏳ DALAM_PROSES
</span>

<!-- Blue Module Tag -->
<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-200 text-black font-mono text-[11px] font-bold border border-black">
  #MODUL_EXCEL
</span>
```

---

### F. Metric / Stat Card (Dashboard Box)
```html
<div class="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between relative overflow-hidden group">
  <!-- Accent top strip -->
  <div class="absolute top-0 left-0 right-0 h-1.5 bg-orange-500"></div>
  
  <div class="flex items-start justify-between">
    <div>
      <span class="font-mono text-xs font-bold text-slate-500 uppercase">SYS_METRIC // 01</span>
      <h4 class="text-2xl font-black text-black mt-1">24 Siswa</h4>
    </div>
    <div class="p-2.5 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
      <Users class="w-5 h-5 text-black" />
    </div>
  </div>
  
  <div class="mt-4 pt-3 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-xs font-mono">
    <span class="text-emerald-600 font-bold">▲ 4 Siswa Baru</span>
    <span class="text-slate-500">Bulan Ini</span>
  </div>
</div>
```

---

## 5. Panduan Implementasi Per Modul Aplikasi

---

### A. Halaman Utama (Landing Page Publik)

**Tujuan:** Menarik minat calon siswa & wali murid dengan citra tempat kursus komputer modern, terstruktur, berbasis praktik nyata (*hands-on*), dan menyenangkan.

1. **Top Announcement Bar (Retro Ticker):**
   - Baris teks hitam dengan font mono kuning: `📢 GELOMBANG BARU DIBUKA // MAKSIMAL 5 SISWA PER KELAS // DAFTAR SEGERA >_`

2. **Navbar:**
   - Background putih dengan border bawah hitam 3px (`border-b-3 border-black`).
   - Logo GWA dengan badge ikon komputer / chip.
   - Menu ber-hover kotak dengan offset shadow.
   - Tombol CTA "Daftar Kursus" warna oranye menyala dengan efek klik *spring*.

3. **Hero Section:**
   - **Headline:** *“Belajar Komputer Gak Pakai Rumit. Dari Nol Sampai Mahir Praktik.”*
   - **Badge Headline:** `[⚡ METODE EKSKLUSIF 1-ON-5 MENTORING]` dengan background kuning cerah.
   - **Visual Kanan:** Ilustrasi Mockup Terminal / Monitor Komputer Neobrutalis yang menampilkan tab modul Word, Excel, PowerPoint, dan sertifikat kelulusan.
   - **Feature Highlights (3 Kotak Gesit, Wawasan, Aplikatif):**
     - **Gesit (Orange Box):** Jalan pintas keyboard, trik efisiensi kerja kantor.
     - **Wawasan (Cyan Box):** Logika rumus, pemahaman mendalam bukan sekadar hafalan.
     - **Aplikatif (Lime Box):** 100% kasus nyata administrasi, akuntansi kasir, & surat menyurat.

4. **Syllabus / Modul Section (Retro App Cards):**
   - Setiap kartu kursus memiliki format jendela OS (Titlebar `ms_word.exe` / `ms_excel.exe`).
   - Tag keahlian berbentuk *chip hardware* (`[VLOOKUP]`, `[MAIL MERGE]`, `[ANIMATION]`).
   - Tombol "Lihat Kurikulum Lengkap" yang membuka modal Neobrutalis.

5. **5-Workstation Seating Map (Visualisasi Eksklusif Ruang Belajar):**
   - Tampilkan denah visual 5 Unit Komputer (`PC-01` s/d `PC-05`) dengan status lampu hijau/merah (*TERISI* vs *TERSEDIA*).
   - Menegaskan nilai jual utama: *1 Siswa 1 Komputer, Kelas Privat & Personal*.

6. **Floating WhatsApp Hub:**
   - Tombol hijau cerah di sudut kanan bawah dengan bayangan tebal 4px, tooltip berkedip: `[ CHAT MENTOR GESIT ]`.

---

### B. Portal Siswa (Learning Management System)

**Tujuan:** Membuat pengalaman belajar siswa interaktif, memotivasi siswa dengan progres bar yang jelas, akses materi instan, serta ujian kuis mandiri.

1. **Header Profil Siswa (Sys-Status Header):**
   - Menampilkan status login: `USER: GESIT WIDI // MODUL AKTIF: EXCEL // PROGRES: 75%`.
   - Progress bar model blok retro kotak-kotak: `[████████░░] 80%`.

2. **Daftar Materi & Reader:**
   - Navigasi materi berbentuk tab *Directory Tree* (`📁 Modul 1 / 📄 01_Pengenalan_Rumus.pdf`).
   - Kontainer materi dengan frame monitor komputer, lengkap dengan tombol `[Unduh Dokumen Latihan .XLSX]` dan `[Tandai Selesai]`.

3. **Quiz & Latihan Mandiri (Terminal Mode):**
   - Kotak pertanyaan dengan background kuning pucat (`bg-yellow-50`), border hitam 2.5px.
   - Opsi jawaban A, B, C, D menggunakan tombol neobrutalis yang berubah warna hijau saat dipilih.
   - Timer hitung mundur berkedip bergaya jam digital `⏱️ 14:59`.

4. **Transkrip Nilai & Download E-Sertifikat:**
   - Sertifikat digital dengan preview bingkai beraksen stempel kelulusan bertuliskan `[VERIFIED // GWA TECH COURSE]`.
   - Tombol cetak PDF instan dengan efek loading *Compiling Certificate...*.

---

### C. Dashboard Admin (Sistem Manajemen LKP)

**Tujuan:** Mengelola data siswa, jadwal 5 unit komputer, nilai, dan absensi secara cepat (*fast data entry*) tanpa beban visual berlebih.

1. **Navigation Sidebar:**
   - Border kanan hitam 3px, latar belakang putih / abu terang.
   - Menu aktif ditandai dengan background warna oranye cerah + hard shadow hitam (`translate-x-1 shadow-[3px_3px_0px_0px_#000]`).
   - Badge counter di samping menu (contoh: `Siswa: 18`, `Kuis Baru: 3`).

2. **Tabel Data Siswa (Neobrutalist Data Grid):**
   - Header tabel hitam pekat dengan teks putih huruf kapital (`NAMA SISWA`, `KONTAK WA`, `MODUL`, `SLOT PC`, `STATUS BAYAR`, `AKSI`).
   - Baris zebra striping halus dengan garis pemisah hitam 1.5px.
   - Tombol aksi cepat: *Edit, Input Nilai, Kirim WA, Cetak Sertifikat*.

3. **Manajemen Slot 5 PC & Jadwal Kelas:**
   - Tampilan matriks interaktif Shift Pagi / Siang / Sore.
   - Kartu drag-and-drop atau klik untuk memasukkan siswa ke slot komputer kosong.

4. **Modal Generator Sertifikat:**
   - Form input nilai praktik Word, Excel, PPT dengan kalkulasi rata-rata otomatis (badge grade: `A [SANGAT BAIK]`, `B [BAIK]`).
   - Live preview sertifikat dua sisi (Halaman Depan: Sertifikat Utama, Halaman Belakang: Transkrip Nilai).

---

## 6. Token & Konfigurasi CSS (Tailwind CSS v4)

Tambahkan atau gunakan variabel token berikut pada `src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  /* Brand Colors */
  --color-neo-black: #0F172A;
  --color-neo-white: #FFFFFF;
  --color-neo-bg: #F8FAFC;
  
  --color-neo-orange: #FF6B00;
  --color-neo-amber: #FACC15;
  --color-neo-cyan: #06B6D4;
  --color-neo-emerald: #10B981;
  --color-neo-purple: #8B5CF6;
  --color-neo-rose: #F43F5E;

  /* Typography */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-heading: var(--font-poppins), system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Space Mono', monospace;
}

/* Custom Neobrutalism Utilities */
@layer utilities {
  .neo-box {
    background-color: #ffffff;
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px 0px #000000;
  }
  
  .neo-box-sm {
    background-color: #ffffff;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0px 0px #000000;
  }

  .neo-box-lg {
    background-color: #ffffff;
    border: 3px solid #000000;
    box-shadow: 6px 6px 0px 0px #000000;
  }

  .neo-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px 0px #000000;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
  }

  .neo-btn:hover {
    transform: translate(-1.5px, -1.5px);
    box-shadow: 4.5px 4.5px 0px 0px #000000;
  }

  .neo-btn:active {
    transform: translate(1.5px, 1.5px);
    box-shadow: 0px 0px 0px 0px #000000;
  }
}
```

---

## 7. Prinsip Do's & Don'ts (Pedoman Kualitas)

### ✅ YANG HARUS DILAKUKAN (DO's)
1. **Gunakan Border Hitam Solid:** Pastikan setiap kartu, tombol, dan modal memiliki border minimal `2px solid #000000`.
2. **Gunakan Hard Shadows Tanpa Blur:** `box-shadow: Xpx Ypx 0px 0px #000`.
3. **Pertahankan Kontras Tinggi:** Teks gelap di atas latar belakang terang/pastel, teks putih di atas latar hitam pekat.
4. **Berikan Feedback Fisik:** Tombol wajib memiliki efek *translate* saat ditekan (`active:translate-x-...`).
5. **Sisipkan Nuansa Komputer:** Gunakan kode status (`[OK]`, `[ERR]`), icon terminal, nama file (`modul.pdf`), dan indikator slot PC.

### ❌ YANG HARUS DIHINDARI (DON'Ts)
1. **Dilarang Menggunakan Soft Blur Shadow:** Hindari `shadow-lg` bawaan standar yang kabur/pudar.
2. **Dilarang Menggunakan Sudut Terlalu Bulat:** Hindari `rounded-3xl` atau `rounded-full` pada kartu utama; gunakan `rounded-none` atau maksimal `rounded-md (4px-8px)` agar karakter brutalist tajam tetap terjaga.
3. **Dilarang Menggunakan Gradasi Halus Berlebihan:** Gunakan warna datar (*flat solid blocks*) untuk mempertahankan ketegasan.
4. **Dilarang Mengorbankan Keterbacaan:** Jangan gunakan font dekoratif untuk teks panjang atau paragraf materi kursus.

---

*Dokumen ini menjadi standar acuan utama untuk pengembangan dan pembaruan antarmuka pada seluruh halaman GWA Tech Course (Les Komputer).*
