'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
	MousePointer,
	RotateCcw,
	Volume2,
	VolumeX,
	Sparkles,
	Trophy,
	CheckCircle,
	AlertCircle,
	Play,
	Maximize2,
	Minimize2,
	ArrowRight,
	Zap,
	Target,
	Clock,
	Activity,
	Layers,
	ChevronRight,
	ShieldCheck,
	Mouse,
	Move,
	FileCode,
	FolderDown,
	Compass,
	X,
	Highlighter,
	Keyboard,
	CheckSquare,
	Square,
	FileText,
	Image,
	FileSpreadsheet,
	FolderArchive,
	ZoomIn,
	ZoomOut,
	Copy,
	FolderPlus,
} from 'lucide-react';
import Swal from 'sweetalert2';

// Stage definitions
const STAGES = [
	{
		id: 1,
		name: 'Tahap 1: Sorot Pointer (Hover)',
		shortName: '1. Sorot (Hover)',
		color: 'bg-rose-500 hover:bg-rose-600 text-white',
		borderColor: 'border-rose-700',
		bgLight: 'bg-rose-50',
		textLabel: 'Sorot ini',
		desc: 'Arahkan kursor tepat ke dalam kotak merah dan tahan sebentar sampai warna berubah.',
		instruction: 'Gerakkan mouse dan sorot kotak di bawah tanpa perlu mengklik!',
		type: 'hover',
	},
	{
		id: 2,
		name: 'Tahap 2: Klik Kiri (Single Click)',
		shortName: '2. Klik Kiri',
		color: 'bg-blue-600 hover:bg-blue-700 text-white',
		borderColor: 'border-blue-800',
		bgLight: 'bg-blue-50',
		textLabel: 'Klik ini',
		desc: 'Arahkan pointer ke kotak biru lalu tekan tombol kiri mouse 1 kali.',
		instruction: 'Klik kiri tepat pada kotak biru. Jangan menyeret mouse saat mengklik!',
		type: 'click',
	},
	{
		id: 3,
		name: 'Tahap 3: Klik Kanan (Right Click)',
		shortName: '3. Klik Kanan',
		color: 'bg-amber-500 hover:bg-amber-600 text-black',
		borderColor: 'border-amber-700',
		bgLight: 'bg-amber-50',
		textLabel: 'Klik Kanan',
		desc: 'Arahkan pointer dan tekan tombol kanan mouse (jari tengah).',
		instruction: 'Tekan tombol kanan mouse tepat di atas kotak kuning.',
		type: 'contextmenu',
	},
	{
		id: 4,
		name: 'Tahap 4: Klik Ganda (Double Click)',
		shortName: '4. Klik Ganda (2x)',
		color: 'bg-purple-600 hover:bg-purple-700 text-white',
		borderColor: 'border-purple-800',
		bgLight: 'bg-purple-50',
		textLabel: 'Klik 2x Cepat',
		desc: 'Tekan tombol kiri 2 kali berturut-turut secara cepat dan stabil.',
		instruction: 'Lakukan Double Click (klik 2x cepat) di dalam kotak ungu.',
		type: 'dblclick',
	},
	{
		id: 5,
		name: 'Tahap 5: Seret & Lepas (Drag & Drop)',
		shortName: '5. Drag & Drop',
		color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
		borderColor: 'border-emerald-800',
		bgLight: 'bg-emerald-50',
		textLabel: 'Seret ke Folder',
		desc: 'Klik dan tahan kotak file, geser pointer ke dalam folder target, lalu lepaskan.',
		instruction: 'Seret (Drag) file dokumen ke dalam Folder Sasaran lalu lepaskan.',
		type: 'drag',
	},
	{
		id: 6,
		name: 'Tahap 6: Seleksi Teks (Text Selection)',
		shortName: '6. Seleksi Teks',
		color: 'bg-violet-600 hover:bg-violet-700 text-white',
		borderColor: 'border-violet-800',
		bgLight: 'bg-violet-50',
		textLabel: 'Blok Kata Target',
		desc: 'Klik & tahan tombol kiri dari awal kata lalu geser untuk memblok kata target (atau klik 2x cepat).',
		instruction: 'Tahan klik kiri dan geser kursor untuk memblok kata target pada lembar dokumen!',
		type: 'select',
	},
	{
		id: 7,
		name: 'Tahap 7: Gulir Layar (Scroll Wheel)',
		shortName: '7. Scroll Wheel',
		color: 'bg-cyan-600 hover:bg-cyan-700 text-white',
		borderColor: 'border-cyan-800',
		bgLight: 'bg-cyan-50',
		textLabel: 'Scroll & Temukan',
		desc: 'Target berpindah di 10 sektor halaman. Putar roda mouse ke atas atau ke bawah untuk mencarinya.',
		instruction: 'Gulir roda mouse ke atas atau ke bawah untuk mencari target di 10 sektor halaman!',
		type: 'scroll',
	},
	{
		id: 8,
		name: 'Tahap 8: Target Bergerak (Moving Target)',
		shortName: '8. Target Bergerak',
		color: 'bg-orange-500 hover:bg-orange-600 text-black',
		borderColor: 'border-orange-700',
		bgLight: 'bg-orange-50',
		textLabel: 'Bidik & Klik!',
		desc: 'Target akan melayang memantul perlahan. Latih refleks dan ketepatan koordinasi.',
		instruction: 'Bidik target yang sedang bergerak dan klik tepat sasaran!',
		type: 'moving',
	},
	{
		id: 9,
		name: 'Tahap 9: Kombinasi Mouse + Keyboard',
		shortName: '9. Mouse + Keyboard',
		color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
		borderColor: 'border-indigo-800',
		bgLight: 'bg-indigo-50',
		textLabel: 'Ctrl / Shift + Klik',
		desc: 'Tahan tombol Ctrl (pilih acak) atau Shift (pilih rentang) di keyboard sambil mengklik berkas target.',
		instruction: 'Gunakan tombol modifier CTRL atau SHIFT di keyboard untuk memilih berkas sesuai instruksi!',
		type: 'combo',
	},
	{
		id: 10,
		name: 'Tahap 10: Zoom Dokumen (CTRL + Scroll)',
		shortName: '10. CTRL + Scroll',
		color: 'bg-teal-600 hover:bg-teal-700 text-white',
		borderColor: 'border-teal-800',
		bgLight: 'bg-teal-50',
		textLabel: 'CTRL + Scroll',
		desc: 'Tahan tombol CTRL di keyboard lalu putar roda mouse ke atas (Zoom In) atau ke bawah (Zoom Out) ke sasaran ukuran.',
		instruction: 'Tahan tombol CTRL lalu putar roda mouse untuk menyesuaikan ukuran dokumen ke target sasaran!',
		type: 'zoom',
	},
	{
		id: 11,
		name: 'Tahap 11: Duplikasi Berkas Instan (CTRL + Drag)',
		shortName: '11. CTRL + Drag',
		color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
		borderColor: 'border-emerald-800',
		bgLight: 'bg-emerald-50',
		textLabel: 'CTRL + Seret',
		desc: 'Tahan tombol CTRL lalu seret berkas ke folder cadangan untuk membuat salinan baru (Copy/Duplikat).',
		instruction: 'Tahan tombol CTRL di keyboard, lalu seret berkas ke Folder Cadangan untuk menduplikasinya!',
		type: 'ctrl_drag',
	},
];

// Konfigurasi Visual Tipe Berkas untuk Memudahkan Pemula
const FILE_TYPE_CONFIG = {
	doc: {
		label: 'Word',
		fullName: 'Dokumen Word',
		color: 'bg-blue-100 text-blue-900 border-blue-400',
		badge: 'bg-blue-600 text-white',
	},
	sheet: {
		label: 'Excel',
		fullName: 'Spreadsheet Excel',
		color: 'bg-emerald-100 text-emerald-900 border-emerald-400',
		badge: 'bg-emerald-600 text-white',
	},
	img: {
		label: 'Foto',
		fullName: 'Foto Gambar',
		color: 'bg-amber-100 text-amber-950 border-amber-400',
		badge: 'bg-amber-500 text-black',
	},
	pdf: {
		label: 'PDF',
		fullName: 'Buku PDF',
		color: 'bg-rose-100 text-rose-900 border-rose-400',
		badge: 'bg-rose-600 text-white',
	},
	zip: {
		label: 'ZIP',
		fullName: 'Arsip ZIP',
		color: 'bg-purple-100 text-purple-900 border-purple-400',
		badge: 'bg-purple-600 text-white',
	},
};

// 12 Variasi Misi Kombinasi Mouse + Keyboard yang Bervariasi & Jelas bagi Pemula
const COMBO_MISSIONS = [
	{
		id: 1,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu klik 3 berkas bertanda bintang emas (⭐)!',
		targetHint: 'Cari 3 berkas bertanda bintang emas ⭐',
		targetLabel: '3 Berkas Bintang (⭐)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Surat-Izin.docx', isTarget: true, icon: 'doc', tag: '⭐ Bintang' },
			{ id: 'f2', name: 'Foto-Sekolah.jpg', isTarget: false, icon: 'img' },
			{ id: 'f3', name: 'Laporan-Nilai.xlsx', isTarget: true, icon: 'sheet', tag: '⭐ Bintang' },
			{ id: 'f4', name: 'Jadwal-Pelajaran.pdf', isTarget: false, icon: 'pdf' },
			{ id: 'f5', name: 'Buku-Panduan.pdf', isTarget: true, icon: 'pdf', tag: '⭐ Bintang' },
			{ id: 'f6', name: 'Data-Guru.xlsx', isTarget: false, icon: 'sheet' },
		],
	},
	{
		id: 2,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas Dokumen Word berwarna BIRU (📄)!',
		targetHint: 'Cari 3 berkas [Word] berikon biru 📄',
		targetLabel: '3 Dokumen Word (Biru)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Tugas-Mengetik.docx', isTarget: true, icon: 'doc' },
			{ id: 'f2', name: 'Foto-Upacara.jpg', isTarget: false, icon: 'img' },
			{ id: 'f3', name: 'Makalah-Komputer.docx', isTarget: true, icon: 'doc' },
			{ id: 'f4', name: 'Rekap-Nilai.xlsx', isTarget: false, icon: 'sheet' },
			{ id: 'f5', name: 'Catatan-Pelajaran.docx', isTarget: true, icon: 'doc' },
			{ id: 'f6', name: 'Gambar-Peta.jpg', isTarget: false, icon: 'img' },
		],
	},
	{
		id: 3,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas Spreadsheet Excel berwarna HIJAU (📊)!',
		targetHint: 'Cari 3 berkas [Excel] berikon hijau 📊',
		targetLabel: '3 Berkas Excel (Hijau)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Daftar-Hadir.xlsx', isTarget: true, icon: 'sheet' },
			{ id: 'f2', name: 'Surat-Edaran.docx', isTarget: false, icon: 'doc' },
			{ id: 'f3', name: 'Tabungan-Siswa.xlsx', isTarget: true, icon: 'sheet' },
			{ id: 'f4', name: 'Brosur-Les.pdf', isTarget: false, icon: 'pdf' },
			{ id: 'f5', name: 'Nilai-Ulangan.xlsx', isTarget: true, icon: 'sheet' },
			{ id: 'f6', name: 'Foto-Kelas.jpg', isTarget: false, icon: 'img' },
		],
	},
	{
		id: 4,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas Foto Gambar berwarna KUNING (🖼️)!',
		targetHint: 'Cari 3 berkas [Foto] berikon kuning 🖼️',
		targetLabel: '3 Berkas Foto (Kuning)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Logo-Sekolah.jpg', isTarget: true, icon: 'img' },
			{ id: 'f2', name: 'Modul-Belajar.docx', isTarget: false, icon: 'doc' },
			{ id: 'f3', name: 'Foto-Pramuka.jpg', isTarget: true, icon: 'img' },
			{ id: 'f4', name: 'Data-Kelas.xlsx', isTarget: false, icon: 'sheet' },
			{ id: 'f5', name: 'Pemandangan.jpg', isTarget: true, icon: 'img' },
			{ id: 'f6', name: 'Buku-Siswa.pdf', isTarget: false, icon: 'pdf' },
		],
	},
	{
		id: 5,
		mode: 'shift',
		instruction: 'Klik Berkas #1 🟢, lalu tahan tombol SHIFT di keyboard dan klik Berkas #4 🏁!',
		targetHint: 'Pilih rentang Berkas #1 sampai #4 sekaligus',
		targetLabel: 'Rentang Berkas #1 s/d #4',
		rangeStart: 0,
		rangeEnd: 3,
		modifierKey: 'SHIFT',
		files: [
			{ id: 'f1', name: '01-Bab-Pengenalan.pdf', icon: 'pdf' },
			{ id: 'f2', name: '02-Bab-Perangkat.pdf', icon: 'pdf' },
			{ id: 'f3', name: '03-Bab-Mouse.pdf', icon: 'pdf' },
			{ id: 'f4', name: '04-Bab-Keyboard.pdf', icon: 'pdf' },
			{ id: 'f5', name: '05-Bab-Internet.pdf', icon: 'pdf' },
			{ id: 'f6', name: '06-Ujian-Praktik.docx', icon: 'doc' },
		],
	},
	{
		id: 6,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas Buku PDF berwarna MERAH (📕)!',
		targetHint: 'Cari 3 berkas [PDF] berikon merah 📕',
		targetLabel: '3 Berkas Buku PDF (Merah)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Buku-Cerita.pdf', isTarget: true, icon: 'pdf' },
			{ id: 'f2', name: 'Tugas-Harian.docx', isTarget: false, icon: 'doc' },
			{ id: 'f3', name: 'Kamus-Istilah.pdf', isTarget: true, icon: 'pdf' },
			{ id: 'f4', name: 'Foto-Wisuda.jpg', isTarget: false, icon: 'img' },
			{ id: 'f5', name: 'Pedoman-Komputer.pdf', isTarget: true, icon: 'pdf' },
			{ id: 'f6', name: 'Jadwal-Piket.xlsx', isTarget: false, icon: 'sheet' },
		],
	},
	{
		id: 7,
		mode: 'shift',
		instruction: 'Klik Berkas #1 🟢, lalu tahan tombol SHIFT di keyboard dan klik Berkas #5 🏁!',
		targetHint: 'Pilih rentang Berkas #1 sampai #5 sekaligus',
		targetLabel: 'Rentang Berkas #1 s/d #5',
		rangeStart: 0,
		rangeEnd: 4,
		modifierKey: 'SHIFT',
		files: [
			{ id: 'f1', name: '01-Foto-Januari.jpg', icon: 'img' },
			{ id: 'f2', name: '02-Foto-Februari.jpg', icon: 'img' },
			{ id: 'f3', name: '03-Foto-Maret.jpg', icon: 'img' },
			{ id: 'f4', name: '04-Foto-April.jpg', icon: 'img' },
			{ id: 'f5', name: '05-Foto-Mei.jpg', icon: 'img' },
			{ id: 'f6', name: '06-Foto-Juni.jpg', icon: 'img' },
		],
	},
	{
		id: 8,
		mode: 'ctrl',
		instruction: "Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas bertuliskan 'Tugas' bertanda ⭐!",
		targetHint: "Cari berkas berawalan 'Tugas' bertanda ⭐",
		targetLabel: "3 Berkas 'Tugas' (⭐)",
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Tugas-Matematika.xlsx', isTarget: true, icon: 'sheet', tag: '⭐ Bintang' },
			{ id: 'f2', name: 'Biodata-Siswa.docx', isTarget: false, icon: 'doc' },
			{ id: 'f3', name: 'Tugas-Bahasa.docx', isTarget: true, icon: 'doc', tag: '⭐ Bintang' },
			{ id: 'f4', name: 'Foto-Sekolah.jpg', isTarget: false, icon: 'img' },
			{ id: 'f5', name: 'Tugas-Komputer.pdf', isTarget: true, icon: 'pdf', tag: '⭐ Bintang' },
			{ id: 'f6', name: 'Panduan-Les.pdf', isTarget: false, icon: 'pdf' },
		],
	},
	{
		id: 9,
		mode: 'shift',
		instruction: 'Klik Berkas #2 🟢, lalu tahan tombol SHIFT dan klik Berkas #6 🏁 untuk memilih rentang!',
		targetHint: 'Pilih rentang Berkas #2 sampai #6',
		targetLabel: 'Rentang Berkas #2 s/d #6',
		rangeStart: 1,
		rangeEnd: 5,
		modifierKey: 'SHIFT',
		files: [
			{ id: 'f1', name: '01-Pengantar.docx', icon: 'doc' },
			{ id: 'f2', name: '02-Bab-Latihan-A.xlsx', icon: 'sheet' },
			{ id: 'f3', name: '03-Bab-Latihan-B.xlsx', icon: 'sheet' },
			{ id: 'f4', name: '04-Bab-Latihan-C.xlsx', icon: 'sheet' },
			{ id: 'f5', name: '05-Kunci-Jawaban.pdf', icon: 'pdf' },
			{ id: 'f6', name: '06-Evaluasi-Akhir.docx', icon: 'doc' },
		],
	},
	{
		id: 10,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas Arsip ZIP berwarna UNGU (📦)!',
		targetHint: 'Cari 3 berkas [ZIP] berikon ungu 📦',
		targetLabel: '3 Berkas Arsip ZIP (Ungu)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Arsip-Materi.zip', isTarget: true, icon: 'zip' },
			{ id: 'f2', name: 'Foto-Dokumentasi.jpg', isTarget: false, icon: 'img' },
			{ id: 'f3', name: 'Paket-Aplikasi.zip', isTarget: true, icon: 'zip' },
			{ id: 'f4', name: 'Daftar-Guru.docx', isTarget: false, icon: 'doc' },
			{ id: 'f5', name: 'Kumpulan-Font.zip', isTarget: true, icon: 'zip' },
			{ id: 'f6', name: 'Rekap-Presensi.xlsx', isTarget: false, icon: 'sheet' },
		],
	},
	{
		id: 11,
		mode: 'shift',
		instruction: 'Klik Berkas #1 🟢, lalu tahan tombol SHIFT dan klik Berkas #3 🏁 untuk memilih 3 berkas pertama!',
		targetHint: 'Pilih rentang Berkas #1 sampai #3',
		targetLabel: 'Rentang Berkas #1 s/d #3',
		rangeStart: 0,
		rangeEnd: 2,
		modifierKey: 'SHIFT',
		files: [
			{ id: 'f1', name: '01-Catatan-Pertemuan-1.docx', icon: 'doc' },
			{ id: 'f2', name: '02-Catatan-Pertemuan-2.docx', icon: 'doc' },
			{ id: 'f3', name: '03-Catatan-Pertemuan-3.docx', icon: 'doc' },
			{ id: 'f4', name: '04-Catatan-Pertemuan-4.docx', icon: 'doc' },
			{ id: 'f5', name: '05-Catatan-Pertemuan-5.docx', icon: 'doc' },
			{ id: 'f6', name: '06-Catatan-Pertemuan-6.docx', icon: 'doc' },
		],
	},
	{
		id: 12,
		mode: 'ctrl',
		instruction: 'Tahan tombol CTRL di keyboard, lalu pilih 3 Berkas Latihan bertanda bintang emas (⭐)!',
		targetHint: 'Cari 3 berkas bertanda bintang ⭐',
		targetLabel: '3 Berkas Latihan (⭐)',
		requiredCount: 3,
		modifierKey: 'CTRL',
		files: [
			{ id: 'f1', name: 'Modul-Klik-Kiri.pdf', isTarget: true, icon: 'pdf', tag: '⭐ Bintang' },
			{ id: 'f2', name: 'Logo-Windows.png', isTarget: false, icon: 'img' },
			{ id: 'f3', name: 'Modul-Drag-Drop.docx', isTarget: true, icon: 'doc', tag: '⭐ Bintang' },
			{ id: 'f4', name: 'Rekapitulasi.xlsx', isTarget: false, icon: 'sheet' },
			{ id: 'f5', name: 'Modul-Seleksi-Teks.pdf', isTarget: true, icon: 'pdf', tag: '⭐ Bintang' },
			{ id: 'f6', name: 'Surat-Izin.docx', isTarget: false, icon: 'doc' },
		],
	},
];

// Helper Generator Antrean Misi Terstruktur & Seimbang
// - Target #1: Pengenalan dasar CTRL (Mission id: 1 - 3 berkas bertanda bintang ⭐)
// - Target #2: Pengenalan dasar SHIFT (Mission id: 5 - Rentang Berkas #1 s/d #4)
// - Target #3 s/d #12: 10 variasi berkas lainnya diacak adil tanpa ada soal yang berulang
const createBalancedComboDeck = () => {
	const introCtrl = COMBO_MISSIONS.find((m) => m.id === 1) || COMBO_MISSIONS[0];
	const introShift = COMBO_MISSIONS.find((m) => m.id === 5) || COMBO_MISSIONS[4];
	const remaining = COMBO_MISSIONS.filter((m) => m.id !== 1 && m.id !== 5);

	// Fisher-Yates Shuffle untuk 10 misi berikutnya
	const shuffled = [...remaining];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return [introCtrl, introShift, ...shuffled];
};

// Pengisian ulang jika sesi permainan melebihi 12 target
const refillBalancedComboDeck = (lastPlayedId) => {
	const full = [...COMBO_MISSIONS];
	for (let i = full.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[full[i], full[j]] = [full[j], full[i]];
	}
	if (full[0]?.id === lastPlayedId && full.length > 1) {
		const temp = full[0];
		full[0] = full[full.length - 1];
		full[full.length - 1] = temp;
	}
	return full;
};

// Soal Latihan Seleksi / Blok Teks (Stage 6)
const TEXT_SELECTION_ITEMS = [
	{
		id: 1,
		sentence: 'Perangkat keras komputer terdiri dari monitor, keyboard, dan mouse.',
		target: 'mouse',
		hint: "Blok kata 'mouse' di akhir kalimat.",
		tip: "Klik 2x cepat pada kata atau tahan klik kiri dari 'm' ke 'e'",
	},
	{
		id: 2,
		sentence: 'Gunakan tombol klik kiri mouse untuk memilih dan membuka dokumen.',
		target: 'klik kiri',
		hint: "Blok frasa 'klik kiri' pada kalimat di atas.",
		tip: "Tahan klik kiri dari huruf 'k' lalu geser hingga akhir 'i'",
	},
	{
		id: 3,
		sentence: 'Menyeleksi teks dengan rapi mempermudah kita menyalin tulisan penting.',
		target: 'Menyeleksi teks',
		hint: "Blok frasa 'Menyeleksi teks' di awal kalimat.",
		tip: "Mulai seleksi tepat dari huruf 'M' kapital",
	},
	{
		id: 4,
		sentence: 'Belajar mengoperasikan komputer melatih keterampilan digital sejak dini.',
		target: 'keterampilan digital',
		hint: "Blok frasa 'keterampilan digital'!",
		tip: 'Tahan dan geser kursor stabil melewati kedua kata',
	},
	{
		id: 5,
		sentence: 'Aplikasi pengolah kata sering digunakan untuk mengetik surat dan laporan.',
		target: 'pengolah kata',
		hint: "Blok frasa 'pengolah kata' pada teks.",
		tip: 'Pastikan tidak kelebihan memblok spasi sebelum atau sesudahnya',
	},
	{
		id: 6,
		sentence: 'Pointer mouse akan berubah bentuk saat diarahkan ke atas tulisan dokumen.',
		target: 'dokumen',
		hint: "Blok kata 'dokumen' di ujung kalimat.",
		tip: "Coba trik klik 2x cepat tepat di atas kata 'dokumen'!",
	},
	{
		id: 7,
		sentence: 'Latihan mouse setiap hari membuat koordinasi tangan semakin lincah dan cepat.',
		target: 'semakin lincah',
		hint: "Blok frasa 'semakin lincah'!",
		tip: "Tarik kursor perlahan dari huruf 's' ke 'h'",
	},
	{
		id: 8,
		sentence: 'Tekan tombol mouse dengan lembut agar kursor tidak bergeser secara liar.',
		target: 'secara liar',
		hint: "Blok frasa 'secara liar' di akhir kalimat.",
		tip: "Lepas mouse begitu seluruh huruf 'secara liar' terblok",
	},
	{
		id: 9,
		sentence: 'Kursor tetikus bergerak mengikuti arah gerakan tangan di atas meja kerja.',
		target: 'tetikus',
		hint: "Blok kata 'tetikus'!",
		tip: "Klik 2x cepat pada kata 'tetikus'!",
	},
	{
		id: 10,
		sentence: 'Keterampilan menggunakan mouse adalah fondasi utama dalam belajar teknologi.',
		target: 'fondasi utama',
		hint: "Blok frasa 'fondasi utama' pada kalimat.",
		tip: "Tahan klik kiri dan geser halus melewati 'fondasi utama'",
	},
];

// Soal Latihan Zoom Dokumen & Halaman (Stage 10: CTRL + Scroll)
const ZOOM_TARGET_ITEMS = [
	{
		id: 1,
		title: 'Tabel Nilai Siswa (Excel)',
		targetZoom: 150,
		icon: 'sheet',
		fileName: 'Rekap-Nilai-Matematika.xlsx',
		hint: 'Tahan CTRL lalu putar roda mouse KE ATAS untuk perbesar ke 150%!',
		direction: 'in',
	},
	{
		id: 2,
		title: 'Foto Kegiatan Pramuka (Gambar)',
		targetZoom: 75,
		icon: 'img',
		fileName: 'Foto-Perkemahan.jpg',
		hint: 'Tahan CTRL lalu putar roda mouse KE BAWAH untuk perkecil ke 75%!',
		direction: 'out',
	},
	{
		id: 3,
		title: 'Dokumen Modul Belajar (Word)',
		targetZoom: 175,
		icon: 'doc',
		fileName: 'Modul-01-Pengenalan-PC.docx',
		hint: 'Tahan CTRL lalu perbesar (Zoom In) hingga tepat 175%!',
		direction: 'in',
	},
	{
		id: 4,
		title: 'Denah Laboratorium Komputer (PDF)',
		targetZoom: 50,
		icon: 'pdf',
		fileName: 'Denah-Lab-Komputer.pdf',
		hint: 'Tahan CTRL lalu perkecil (Zoom Out) ke 50% untuk melihat seluruh denah!',
		direction: 'out',
	},
	{
		id: 5,
		title: 'Grafik Penjualan Toko (Excel)',
		targetZoom: 125,
		icon: 'sheet',
		fileName: 'Grafik-Laporan-Bulanan.xlsx',
		hint: 'Tahan CTRL lalu sesuaikan ukuran zoom ke 125%!',
		direction: 'in',
	},
	{
		id: 6,
		title: 'Poster Lomba Mengetik (Gambar)',
		targetZoom: 200,
		icon: 'img',
		fileName: 'Poster-Lomba-Cepat.jpg',
		hint: 'Tahan CTRL lalu perbesar maksimal hingga mencapai 200%!',
		direction: 'in',
	},
];

// Soal Latihan Duplikasi Berkas Instan (Stage 11: CTRL + Drag)
const DUPLICATE_ITEMS = [
	{
		id: 1,
		name: 'Laporan-Keuangan.xlsx',
		icon: 'sheet',
		sourceFolder: 'Folder Kerja',
		targetFolder: 'Folder Cadangan (Backup)',
		hint: "Tahan tombol CTRL, seret 'Laporan-Keuangan.xlsx' ke Folder Cadangan untuk menduplikasinya!",
	},
	{
		id: 2,
		name: 'Makalah-Komputer.docx',
		icon: 'doc',
		sourceFolder: 'Folder Tugas',
		targetFolder: 'Folder Arsip 2026',
		hint: 'Tahan tombol CTRL, seret berkas ke Folder Arsip 2026!',
	},
	{
		id: 3,
		name: 'Foto-Dokumentasi.jpg',
		icon: 'img',
		sourceFolder: 'Folder Kamera',
		targetFolder: 'Folder Galeri Siswa',
		hint: 'Tahan tombol CTRL, seret foto ke Folder Galeri Siswa!',
	},
	{
		id: 4,
		name: 'Sertifikat-Kelulusan.pdf',
		icon: 'pdf',
		sourceFolder: 'Folder Dokumen',
		targetFolder: 'Folder Cadangan (Backup)',
		hint: 'Tahan tombol CTRL, seret sertifikat ke Folder Cadangan!',
	},
	{
		id: 5,
		name: 'Paket-Materi.zip',
		icon: 'zip',
		sourceFolder: 'Folder Unduhan',
		targetFolder: 'Folder Eksternal USB',
		hint: 'Tahan tombol CTRL, seret arsip ZIP ke Folder Eksternal USB!',
	},
	{
		id: 6,
		name: 'Biodata-Peserta.docx',
		icon: 'doc',
		sourceFolder: 'Folder Pendaftaran',
		targetFolder: 'Folder Arsip 2026',
		hint: 'Tahan tombol CTRL, seret biodata ke Folder Arsip 2026!',
	},
];

// Target sizes (Width x Height)
const SIZES = {
	large: { name: 'Besar (Mudah)', width: 180, height: 60, font: 'text-base font-bold' },
	medium: { name: 'Standar (150x50)', width: 150, height: 50, font: 'text-sm font-bold' },
	small: { name: 'Kecil (Tantangan)', width: 105, height: 40, font: 'text-xs font-bold' },
};

// Web Audio API Synthesizer (Zero External Dependencies)
function playTone(type, isMuted) {
	if (isMuted || typeof window === 'undefined') return;
	try {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!AudioContext) return;
		const ctx = new AudioContext();

		if (type === 'hit') {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
			osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
			gain.gain.setValueAtTime(0.15, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + 0.1);
		} else if (type === 'hover') {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'triangle';
			osc.frequency.setValueAtTime(440, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.06);
			gain.gain.setValueAtTime(0.1, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + 0.08);
		} else if (type === 'miss') {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'sawtooth';
			osc.frequency.setValueAtTime(220, ctx.currentTime);
			osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.1);
			gain.gain.setValueAtTime(0.08, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + 0.12);
		} else if (type === 'complete') {
			const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
			notes.forEach((freq, i) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'triangle';
				osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
				gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
				gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.25);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(ctx.currentTime + i * 0.1);
				osc.stop(ctx.currentTime + i * 0.1 + 0.25);
			});
		}
	} catch (e) {
		// Ignore audio context errors if browser blocked autoplay
	}
}

export default function MouseTrainerGame() {
	const [currentStageId, setCurrentStageId] = useState(1);
	const [targetCount, setTargetCount] = useState(50);
	const [currentTarget, setCurrentTarget] = useState(0);
	const [selectedSize, setSelectedSize] = useState('medium');
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Statistics
	const [totalClicks, setTotalClicks] = useState(0);
	const [missClicks, setMissClicks] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [lastHitTimestamp, setLastHitTimestamp] = useState(null);
	const [reactionTimes, setReactionTimes] = useState([]);

	// Target coordinates & size
	const [targetPos, setTargetPos] = useState({ x: 100, y: 100 });
	const targetPosRef = useRef(targetPos);
	useEffect(() => {
		targetPosRef.current = targetPos;
	}, [targetPos]);
	const [movingVelocity, setMovingVelocity] = useState({ dx: 2, dy: 1.5 });
	const [hoverProgress, setHoverProgress] = useState(0);

	// Stage 5 Drag & drop state
	const [dragItemPos, setDragItemPos] = useState({ x: 80, y: 150 });
	const [dropZonePos, setDropZonePos] = useState({ x: 400, y: 150 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

	// Floating particles & popups
	const [popups, setPopups] = useState([]);

	// DOM Refs
	const gameAreaRef = useRef(null);
	const scrollContainerRef = useRef(null);
	const hoverTimerRef = useRef(null);
	const animFrameRef = useRef(null);
	const timerIntervalRef = useRef(null);
	const justDraggedRef = useRef(false);
	const hasMovedRef = useRef(false);

	// Stage 6 Text Selection state
	const [textItemIndex, setTextItemIndex] = useState(0);

	// Stage 7 Scroll Target Section
	const [scrollTargetSection, setScrollTargetSection] = useState(2);

	// Stage 10 Zoom State (CTRL + Scroll)
	const [zoomItemIndex, setZoomItemIndex] = useState(0);
	const [currentZoom, setCurrentZoom] = useState(100);
	const zoomSnapTimerRef = useRef(null);

	// Stage 11 Duplicate State (CTRL + Drag & Drop)
	const [duplicateItemIndex, setDuplicateItemIndex] = useState(0);
	const [isCtrlDragging, setIsCtrlDragging] = useState(false);
	const [ctrlDragPos, setCtrlDragPos] = useState({ x: 90, y: 155 });
	const [ctrlDragOffset, setCtrlDragOffset] = useState({ x: 0, y: 0 });
	const [hasDuplicatedClone, setHasDuplicatedClone] = useState(false);
	const ctrlDragMovedRef = useRef(false);
	const ctrlTargetFolderRef = useRef(null);
	const stage10HintThrottleRef = useRef(false);

	// Stage 9 Combo (Mouse + Keyboard) state - Unified Mission Object with Balanced Deck (100% Synchronized)
	const comboDeckRef = useRef(null);
	if (!comboDeckRef.current) {
		const initialDeck = createBalancedComboDeck();
		initialDeck.shift(); // Target #1 mengambil soal pertama (Mission 1)
		comboDeckRef.current = initialDeck;
	}

	const [currentComboMission, setCurrentComboMission] = useState(() => {
		const base = COMBO_MISSIONS[0];
		let files = [...base.files];
		if (base.mode === 'ctrl') {
			files = files.sort(() => Math.random() - 0.5);
		}
		return { ...base, files };
	});
	const [selectedFileIds, setSelectedFileIds] = useState([]);
	const [shiftAnchorIndex, setShiftAnchorIndex] = useState(null);
	const [activeModifiers, setActiveModifiers] = useState({ ctrl: false, shift: false });
	const [isComboTransitioning, setIsComboTransitioning] = useState(false);
	const comboTimerRef = useRef(null);

	// Listen to physical Ctrl & Shift key presses
	useEffect(() => {
		const handleKeyDown = (e) => {
			setActiveModifiers({
				ctrl: Boolean(e.ctrlKey || e.metaKey || e.key === 'Control' || e.key === 'Meta'),
				shift: Boolean(e.shiftKey || e.key === 'Shift'),
			});
		};
		const handleKeyUp = (e) => {
			setActiveModifiers({
				ctrl: Boolean(e.ctrlKey || e.metaKey),
				shift: Boolean(e.shiftKey),
			});
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
		};
	}, []);

	const stage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];
	const sizeConfig = SIZES[selectedSize] || SIZES.medium;
	const currentTextItem = TEXT_SELECTION_ITEMS[textItemIndex % TEXT_SELECTION_ITEMS.length] || TEXT_SELECTION_ITEMS[0];
	const currentZoomItem = ZOOM_TARGET_ITEMS[zoomItemIndex % ZOOM_TARGET_ITEMS.length] || ZOOM_TARGET_ITEMS[0];
	const currentDuplicateItem = DUPLICATE_ITEMS[duplicateItemIndex % DUPLICATE_ITEMS.length] || DUPLICATE_ITEMS[0];

	// Utility to generate random coordinates within container (Excluding top HUD area)
	const getRandomPosition = useCallback(
		(targetWidth, targetHeight, customContainer = null) => {
			const area = customContainer || gameAreaRef.current;
			if (!area) return { x: 50, y: 100 };

			const topPadding = isFullscreen ? 85 : 75; // Exclude top info/HUD completely
			const bottomPadding = 25;
			const leftRightPadding = 25;

			const maxW = Math.max(area.clientWidth - targetWidth - leftRightPadding * 2, 20);
			const maxH = Math.max(area.clientHeight - targetHeight - topPadding - bottomPadding, 20);

			const x = Math.floor(Math.random() * maxW) + leftRightPadding;
			const y = Math.floor(Math.random() * maxH) + topPadding;
			return { x, y };
		},
		[isFullscreen],
	);

	// Spawn new target for current stage
	const spawnTarget = useCallback(() => {
		if (stage.type === 'drag') {
			const dropW = 140;
			const dropH = 120;
			const itemW = 80;
			const itemH = 80;

			// Position dropzone and item far enough apart (both below top HUD)
			const itemPos = getRandomPosition(itemW, itemH);
			let dropPos = getRandomPosition(dropW, dropH);

			// Ensure minimum distance
			const dist = Math.hypot(dropPos.x - itemPos.x, dropPos.y - itemPos.y);
			if (dist < 150) {
				dropPos = {
					x: (itemPos.x + 200) % (gameAreaRef.current?.clientWidth - 160 || 300),
					y: Math.max(isFullscreen ? 85 : 75, (itemPos.y + 120) % (gameAreaRef.current?.clientHeight - 140 || 200)),
				};
			}
			setDragItemPos(itemPos);
			setDropZonePos(dropPos);
		} else if (stage.type === 'select') {
			// Pick a new random sentence & target word
			setTextItemIndex((prev) => {
				let next = Math.floor(Math.random() * TEXT_SELECTION_ITEMS.length);
				if (next === prev && TEXT_SELECTION_ITEMS.length > 1) {
					next = (next + 1) % TEXT_SELECTION_ITEMS.length;
				}
				return next;
			});
			if (typeof window !== 'undefined') {
				window.getSelection()?.removeAllRanges();
			}
		} else if (stage.type === 'combo') {
			// Ambil misi berikutnya dari antrean deck yang terstruktur & seimbang
			setCurrentComboMission((prevMission) => {
				if (!comboDeckRef.current || comboDeckRef.current.length === 0) {
					comboDeckRef.current = refillBalancedComboDeck(prevMission?.id);
				}
				const nextBase = comboDeckRef.current.shift() || COMBO_MISSIONS[0];
				let files = [...nextBase.files];
				if (nextBase.mode === 'ctrl') {
					files = files.sort(() => Math.random() - 0.5);
				}
				return { ...nextBase, files };
			});
			setSelectedFileIds([]);
			setShiftAnchorIndex(null);
		} else if (stage.type === 'scroll') {
			// Pick a new random sector between 1 and 10 (different from previous)
			setScrollTargetSection((prev) => {
				const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== prev);
				return candidates[Math.floor(Math.random() * candidates.length)] || 5;
			});
			// Tetap pada posisi scroll saat ini agar siswa melatih scroll ke atas maupun ke bawah
		} else if (stage.type === 'zoom') {
			setZoomItemIndex((prev) => (prev + 1) % ZOOM_TARGET_ITEMS.length);
			setCurrentZoom(100);
			if (zoomSnapTimerRef.current) {
				clearTimeout(zoomSnapTimerRef.current);
				zoomSnapTimerRef.current = null;
			}
		} else if (stage.type === 'ctrl_drag') {
			setDuplicateItemIndex((prev) => (prev + 1) % DUPLICATE_ITEMS.length);
			setHasDuplicatedClone(false);
			setIsCtrlDragging(false);
			ctrlDragMovedRef.current = false;
		} else {
			const pos = getRandomPosition(sizeConfig.width, sizeConfig.height);
			setTargetPos(pos);
			setHoverProgress(0);

			if (stage.type === 'moving') {
				const speed = 2.2;
				const angle = Math.random() * Math.PI * 2;
				setMovingVelocity({
					dx: Math.cos(angle) * speed,
					dy: Math.sin(angle) * speed,
				});
			}
		}
	}, [getRandomPosition, isFullscreen, sizeConfig.width, sizeConfig.height, stage.type]);

	// Start / Reset Session
	const resetGame = useCallback(
		(newStageId = null, newCount = null) => {
			const sId = newStageId !== null ? newStageId : currentStageId;
			const count = newCount !== null ? newCount : targetCount;

			setCurrentStageId(sId);
			setTargetCount(count);
			setCurrentTarget(0);
			setTotalClicks(0);
			setMissClicks(0);
			setElapsedTime(0);
			setIsFinished(false);
			setStartTime(null);
			setLastHitTimestamp(null);
			setReactionTimes([]);
			setHoverProgress(0);
			setIsDragging(false);
			justDraggedRef.current = false;
			hasMovedRef.current = false;
			const targetStage = STAGES.find((s) => s.id === sId);
			if (targetStage?.type === 'combo') {
				const freshDeck = createBalancedComboDeck();
				const firstMission = freshDeck.shift(); // Target #1 (Mission 1 - Pengenalan CTRL)
				comboDeckRef.current = freshDeck;
				let files = [...firstMission.files];
				if (firstMission.mode === 'ctrl') {
					files = files.sort(() => Math.random() - 0.5);
				}
				setCurrentComboMission({ ...firstMission, files });
			}
			setSelectedFileIds([]);
			setShiftAnchorIndex(null);
			if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
			setIsComboTransitioning(false);

			if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
			if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

			if (typeof window !== 'undefined') {
				try {
					window.getSelection()?.removeAllRanges();
				} catch (err) {}
			}

			if (targetStage?.type === 'scroll' && scrollContainerRef.current) {
				scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
			}

			if (targetStage?.type === 'zoom') {
				setZoomItemIndex(0);
				setCurrentZoom(100);
				if (zoomSnapTimerRef.current) {
					clearTimeout(zoomSnapTimerRef.current);
					zoomSnapTimerRef.current = null;
				}
			}

			if (targetStage?.type === 'ctrl_drag') {
				setDuplicateItemIndex(0);
				setHasDuplicatedClone(false);
				setIsCtrlDragging(false);
				ctrlDragMovedRef.current = false;
			}

			setTimeout(() => {
				spawnTarget();
			}, 50);
		},
		[currentStageId, targetCount, spawnTarget],
	);

	// Handle closing victory modal with confirmation
	const handleCloseVictory = async () => {
		const res = await Swal.fire({
			title: 'Tutup & Reset Latihan?',
			text: 'Jika kamu menutup jendela skor ini, latihan tahap ini akan direset kembali dari awal.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Ya, Tutup & Reset',
			cancelButtonText: 'Batal',
			customClass: {
				popup: 'border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] font-sans bg-white',
				title: 'font-heading font-black text-black text-lg sm:text-xl',
				htmlContainer: 'text-xs sm:text-sm font-medium text-slate-700',
				confirmButton: 'bg-orange-500 hover:bg-orange-600 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-4 py-2.5 cursor-pointer ml-2',
				cancelButton: 'bg-slate-200 hover:bg-slate-300 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-4 py-2.5 cursor-pointer mr-2',
			},
			buttonsStyling: false,
		});

		if (res.isConfirmed) {
			setIsFinished(false);
			resetGame(currentStageId);
		}
	};

	// Initialize position on mount or resize
	useEffect(() => {
		const timer = setTimeout(() => {
			spawnTarget();
		}, 100);

		const handleResize = () => {
			spawnTarget();
		};

		window.addEventListener('resize', handleResize);
		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', handleResize);
		};
	}, [selectedSize, currentStageId, spawnTarget]);

	// Timer Tick
	useEffect(() => {
		if (startTime && !isFinished) {
			timerIntervalRef.current = setInterval(() => {
				setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
			}, 500);
		} else {
			if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
		}
		return () => {
			if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
		};
	}, [startTime, isFinished]);

	// Moving target animation loop for Stage 7
	useEffect(() => {
		if (stage.type !== 'moving' || isFinished) return;

		let localPos = { ...targetPosRef.current };
		let localVel = { ...movingVelocity };

		const animate = () => {
			const area = gameAreaRef.current;
			if (area) {
				const topBound = isFullscreen ? 85 : 75; // Exclude top info/HUD completely
				const bottomBound = area.clientHeight - sizeConfig.height - 15;
				const leftBound = 15;
				const rightBound = area.clientWidth - sizeConfig.width - 15;

				let nextX = localPos.x + localVel.dx;
				let nextY = localPos.y + localVel.dy;

				if (nextX <= leftBound) {
					nextX = leftBound;
					localVel.dx = Math.abs(localVel.dx);
				} else if (nextX >= rightBound) {
					nextX = rightBound;
					localVel.dx = -Math.abs(localVel.dx);
				}

				if (nextY <= topBound) {
					nextY = topBound;
					localVel.dy = Math.abs(localVel.dy);
				} else if (nextY >= bottomBound) {
					nextY = bottomBound;
					localVel.dy = -Math.abs(localVel.dy);
				}

				localPos = { x: nextX, y: nextY };
				setTargetPos({ x: nextX, y: nextY });
			}
			animFrameRef.current = requestAnimationFrame(animate);
		};

		animFrameRef.current = requestAnimationFrame(animate);
		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		};
	}, [stage.type, isFinished, movingVelocity, sizeConfig.width, sizeConfig.height, isFullscreen]);

	// Trigger popup animation on hit
	const triggerHitEffect = (x, y, text = '+1') => {
		const id = Date.now() + Math.random();
		setPopups((prev) => [...prev, { id, x, y, text }]);
		setTimeout(() => {
			setPopups((prev) => prev.filter((p) => p.id !== id));
		}, 800);
	};

	// On successful target completed
	const handleTargetSuccess = useCallback(
		(e, customText = 'Tepat!') => {
			const now = Date.now();
			if (!startTime) {
				setStartTime(now);
			}

			// Measure reaction time
			if (lastHitTimestamp) {
				const reactTime = now - lastHitTimestamp;
				setReactionTimes((prev) => [...prev, reactTime]);
			}
			setLastHitTimestamp(now);

			// Audio & Visual feedback
			playTone(stage.type === 'hover' ? 'hover' : 'hit', isMuted);

			// Popup coordinate
			let clientX = targetPos.x + sizeConfig.width / 2;
			let clientY = targetPos.y;
			if (e && e.nativeEvent) {
				const rect = gameAreaRef.current?.getBoundingClientRect();
				if (rect) {
					clientX = e.clientX - rect.left;
					clientY = e.clientY - rect.top;
				}
			}
			triggerHitEffect(clientX, clientY, customText);

			const nextCount = currentTarget + 1;
			setCurrentTarget(nextCount);

			// Check if stage is finished (or if unlimited mode, keep going)
			if (targetCount !== 0 && nextCount >= targetCount) {
				setIsFinished(true);
				playTone('complete', isMuted);
				try {
					confetti({
						particleCount: 120,
						spread: 80,
						origin: { y: 0.6 },
					});
				} catch (err) {}
			} else {
				spawnTarget();
			}
		},
		[startTime, lastHitTimestamp, stage.type, isMuted, targetPos.x, sizeConfig.width, targetPos.y, currentTarget, targetCount, spawnTarget],
	);

	// Stage 10 Wheel Event Listener (CTRL + Scroll Zoom) with { passive: false } to prevent browser zoom
	useEffect(() => {
		const gameArea = gameAreaRef.current;
		if (!gameArea || stage.type !== 'zoom' || isFinished) return;

		const handleWheel = (e) => {
			const isCtrl = Boolean(e.ctrlKey || e.metaKey || activeModifiers.ctrl);
			if (isCtrl) {
				e.preventDefault(); // Mencegah zoom bawaan browser luar
				if (!startTime) setStartTime(Date.now());

				// Putar ke atas (deltaY < 0) = Zoom In (+5%), Putar ke bawah (deltaY > 0) = Zoom Out (-5%)
				const delta = e.deltaY < 0 ? 5 : -5;
				setCurrentZoom((prev) => Math.max(40, Math.min(250, prev + delta)));
			} else {
				e.preventDefault();
				// Peringatan ramah jika memutar roda tanpa menahan CTRL
				if (!stage10HintThrottleRef.current) {
					stage10HintThrottleRef.current = true;
					const rect = gameArea.getBoundingClientRect();
					triggerHitEffect(rect.width / 2, rect.height / 2, 'Tahan tombol CTRL di keyboard!');
					setTimeout(() => {
						stage10HintThrottleRef.current = false;
					}, 1200);
				}
			}
		};

		gameArea.addEventListener('wheel', handleWheel, { passive: false });
		return () => {
			gameArea.removeEventListener('wheel', handleWheel);
		};
	}, [stage.type, isFinished, activeModifiers.ctrl, startTime]);

	// Stage 10 Tolerance & Auto-Success Check
	useEffect(() => {
		if (stage.type !== 'zoom' || isFinished) return;

		const targetZ = currentZoomItem.targetZoom;
		const diff = Math.abs(currentZoom - targetZ);

		if (diff <= 5) {
			if (!zoomSnapTimerRef.current) {
				zoomSnapTimerRef.current = setTimeout(() => {
					handleTargetSuccess(null, `Zoom ${targetZ}% Pas! 🎉`);
					zoomSnapTimerRef.current = null;
				}, 450);
			}
		} else {
			if (zoomSnapTimerRef.current) {
				clearTimeout(zoomSnapTimerRef.current);
				zoomSnapTimerRef.current = null;
			}
		}

		return () => {
			if (zoomSnapTimerRef.current) {
				clearTimeout(zoomSnapTimerRef.current);
				zoomSnapTimerRef.current = null;
			}
		};
	}, [currentZoom, currentZoomItem.targetZoom, stage.type, isFinished, handleTargetSuccess]);

	// Background Click (Miss Click detection)
	const handleAreaClick = (e) => {
		if (isFinished || justDraggedRef.current || stage.type === 'select' || stage.type === 'combo' || stage.type === 'zoom' || stage.type === 'ctrl_drag') return;

		// Abaikan jika yang diklik adalah tombol kontrol (Layar Penuh, Mute, Reset, dsb)
		if (e && e.target && typeof e.target.closest === 'function') {
			if (e.target.closest('button') || e.target.closest("[role='button']")) {
				return;
			}
		}

		if (!startTime) setStartTime(Date.now());

		setTotalClicks((prev) => prev + 1);
		setMissClicks((prev) => prev + 1);
		playTone('miss', isMuted);

		const rect = gameAreaRef.current?.getBoundingClientRect();
		if (rect && e) {
			const clickX = e.clientX - rect.left;
			const clickY = e.clientY - rect.top;
			triggerHitEffect(clickX, clickY, 'Meleset!');
		}
	};

	// Prevent default right-click and detect Right-Click Misses
	const handleContextMenu = (e) => {
		e.preventDefault();
		if (isFinished || justDraggedRef.current) return;

		// Abaikan jika yang diklik adalah tombol kontrol
		if (e && e.target && typeof e.target.closest === 'function') {
			if (e.target.closest('button') || e.target.closest("[role='button']")) {
				return;
			}
		}

		if (!startTime) setStartTime(Date.now());

		setTotalClicks((prev) => prev + 1);
		setMissClicks((prev) => prev + 1);
		playTone('miss', isMuted);

		const rect = gameAreaRef.current?.getBoundingClientRect();
		if (rect && e) {
			const clickX = e.clientX - rect.left;
			const clickY = e.clientY - rect.top;
			triggerHitEffect(clickX, clickY, 'Meleset!');
		}
	};

	// Hover Stage Handler (requires staying on target for 280ms)
	const handleTargetMouseEnter = () => {
		if (stage.type !== 'hover' || isFinished) return;
		if (!startTime) setStartTime(Date.now());

		let progress = 0;
		hoverTimerRef.current = setInterval(() => {
			progress += 25;
			setHoverProgress(progress);
			if (progress >= 100) {
				clearInterval(hoverTimerRef.current);
				handleTargetSuccess(null, 'Bagus!');
			}
		}, 45);
	};

	const handleTargetMouseLeave = () => {
		if (stage.type !== 'hover') return;
		if (hoverTimerRef.current) {
			clearInterval(hoverTimerRef.current);
			setHoverProgress(0);
		}
	};

	// Drag & drop handlers (Stage 5)
	const handleDragStart = (e) => {
		if (stage.type !== 'drag' || isFinished) return;
		e.stopPropagation();
		if (!startTime) setStartTime(Date.now());
		setIsDragging(true);
		hasMovedRef.current = false;

		const rect = e.currentTarget.getBoundingClientRect();
		setDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	// Stage 11: Duplikasi Berkas Instan (CTRL + Drag) handlers
	const handleCtrlDragStart = (e) => {
		if (stage.type !== 'ctrl_drag' || isFinished || hasDuplicatedClone) return;
		e.stopPropagation();
		if (!startTime) setStartTime(Date.now());
		setIsCtrlDragging(true);
		ctrlDragMovedRef.current = false;

		const rect = e.currentTarget.getBoundingClientRect();
		setCtrlDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
		setCtrlDragPos({
			x: rect.left,
			y: rect.top,
		});
	};

	const handleDragMove = (e) => {
		if (stage.type === 'drag') {
			if (!isDragging || !gameAreaRef.current) return;
			hasMovedRef.current = true;
			const areaRect = gameAreaRef.current.getBoundingClientRect();
			const newX = Math.max(10, Math.min(e.clientX - areaRect.left - dragOffset.x, areaRect.width - 90));
			const newY = Math.max(10, Math.min(e.clientY - areaRect.top - dragOffset.y, areaRect.height - 90));
			setDragItemPos({ x: newX, y: newY });
		} else if (stage.type === 'ctrl_drag') {
			if (!isCtrlDragging) return;
			ctrlDragMovedRef.current = true;
			setCtrlDragPos({
				x: e.clientX - ctrlDragOffset.x,
				y: e.clientY - ctrlDragOffset.y,
			});
		}
	};

	const handleDragEnd = (e) => {
		if (stage.type === 'drag') {
			if (!isDragging) return;
			setIsDragging(false);

			// Tandai bahwa drag baru saja selesai agar synthetic click event bawaan browser diabaikan
			justDraggedRef.current = true;
			setTimeout(() => {
				justDraggedRef.current = false;
			}, 150);

			// Jika file hanya diklik tanpa digeser (drag), jangan hitung sebagai percobaan drop
			if (!hasMovedRef.current) {
				return;
			}

			// Check collision with dropzone
			const itemCenter = {
				x: dragItemPos.x + 40,
				y: dragItemPos.y + 40,
			};
			const dropW = 140;
			const dropH = 120;

			if (itemCenter.x >= dropZonePos.x && itemCenter.x <= dropZonePos.x + dropW && itemCenter.y >= dropZonePos.y && itemCenter.y <= dropZonePos.y + dropH) {
				handleTargetSuccess(e, 'Sukses Masuk!');
			} else {
				setTotalClicks((prev) => prev + 1);
				setMissClicks((prev) => prev + 1);
				playTone('miss', isMuted);

				const rect = gameAreaRef.current?.getBoundingClientRect();
				if (rect && e) {
					const clickX = e.clientX - rect.left;
					const clickY = e.clientY - rect.top;
					triggerHitEffect(clickX, clickY, 'Meleset!');
				}
			}
		} else if (stage.type === 'ctrl_drag') {
			if (!isCtrlDragging) return;
			setIsCtrlDragging(false);

			justDraggedRef.current = true;
			setTimeout(() => {
				justDraggedRef.current = false;
			}, 150);

			// Jika hanya diklik tanpa digeser, abaikan
			if (!ctrlDragMovedRef.current) {
				return;
			}

			const isCtrl = Boolean(e.ctrlKey || e.metaKey || activeModifiers.ctrl);
			const targetRect = ctrlTargetFolderRef.current?.getBoundingClientRect();
			const isInsideTarget = targetRect && e.clientX >= targetRect.left && e.clientX <= targetRect.right && e.clientY >= targetRect.top && e.clientY <= targetRect.bottom;

			const rect = gameAreaRef.current?.getBoundingClientRect();
			const clickX = e && rect ? e.clientX - rect.left : (gameAreaRef.current?.clientWidth || 400) / 2;
			const clickY = e && rect ? e.clientY - rect.top : (gameAreaRef.current?.clientHeight || 400) / 2;

			setTotalClicks((prev) => prev + 1);

			if (isInsideTarget) {
				if (isCtrl) {
					// Berhasil diduplikasi dengan CTRL!
					setHasDuplicatedClone(true);
					playTone('hit', isMuted);
					triggerHitEffect(clickX, clickY, 'Salinan Berhasil Dibuat! 📋');

					setTimeout(() => {
						handleTargetSuccess(e, 'Duplikasi Berhasil!');
						setHasDuplicatedClone(false);
					}, 700);
				} else {
					// Dijatuhkan ke target folder tetapi TANPA CTRL
					setMissClicks((prev) => prev + 1);
					playTone('miss', isMuted);
					triggerHitEffect(clickX, clickY, 'Tahan tombol CTRL saat menyeret!');
				}
			} else {
				// Dijatuhkan di luar target folder
				setMissClicks((prev) => prev + 1);
				playTone('miss', isMuted);
				triggerHitEffect(clickX, clickY, 'Lepas di dalam Folder Sasaran!');
			}
		}
	};

	// Stage 6 Text Selection Handler
	const handleTextSelectionEnd = (e) => {
		if (stage.type !== 'select' || isFinished) return;
		if (!startTime) setStartTime(Date.now());

		const selection = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null;
		const rawSelected = selection ? selection.toString() : '';
		const trimmed = rawSelected.trim();

		// Jika pengguna hanya mengklik teks tanpa memblok huruf apapun, jangan hitung sebagai meleset
		if (!trimmed) {
			return;
		}

		const targetLower = currentTextItem.target.toLowerCase().trim();
		const selectedLower = trimmed.toLowerCase();

		// Koordinat pop-up feedback
		const rect = gameAreaRef.current?.getBoundingClientRect();
		const clickX = e && rect ? e.clientX - rect.left : (gameAreaRef.current?.clientWidth || 400) / 2;
		const clickY = e && rect ? e.clientY - rect.top : (gameAreaRef.current?.clientHeight || 400) / 2;

		setTotalClicks((prev) => prev + 1);

		if (selectedLower === targetLower) {
			// TEPAT SESUAI TARGET!
			handleTargetSuccess(e, 'Seleksi Tepat!');
			if (selection) {
				try {
					selection.removeAllRanges();
				} catch (err) {}
			}
		} else if (targetLower.includes(selectedLower) && selectedLower.length < targetLower.length) {
			// KURANG HURUF / KURANG LENGKAP
			setMissClicks((prev) => prev + 1);
			playTone('miss', isMuted);
			triggerHitEffect(clickX, clickY, 'Kurang lengkap!');
		} else if (selectedLower.includes(targetLower) && selectedLower.length > targetLower.length) {
			// BABLAS / KELEBIHAN KATA
			setMissClicks((prev) => prev + 1);
			playTone('miss', isMuted);
			triggerHitEffect(clickX, clickY, 'Kelebihan kata!');
		} else {
			// KATA YANG DIPILIH SALAH
			setMissClicks((prev) => prev + 1);
			playTone('miss', isMuted);
			triggerHitEffect(clickX, clickY, 'Kata salah!');
		}
	};

	// File icon renderer helper for Stage 9
	const renderFileIcon = (type) => {
		switch (type) {
			case 'doc':
				return <FileText className='w-8 h-8 text-blue-600' />;
			case 'sheet':
				return <FileSpreadsheet className='w-8 h-8 text-emerald-600' />;
			case 'img':
				return <Image className='w-8 h-8 text-amber-500' />;
			case 'zip':
				return <FolderArchive className='w-8 h-8 text-purple-600' />;
			default:
				return <FileCode className='w-8 h-8 text-rose-500' />;
		}
	};

	// Stage 9 Combo (Mouse + Keyboard) File Click Handler
	const handleComboFileClick = (file, index, e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (stage.type !== 'combo' || isFinished || isComboTransitioning) return;
		if (!startTime) setStartTime(Date.now());

		const isCtrlPressed = Boolean(e?.ctrlKey || e?.metaKey || activeModifiers.ctrl);
		const isShiftPressed = Boolean(e?.shiftKey || activeModifiers.shift);

		const rect = gameAreaRef.current?.getBoundingClientRect();
		const clickX = e && rect ? e.clientX - rect.left : (gameAreaRef.current?.clientWidth || 400) / 2;
		const clickY = e && rect ? e.clientY - rect.top : (gameAreaRef.current?.clientHeight || 400) / 2;

		setTotalClicks((prev) => prev + 1);

		if (currentComboMission.mode === 'ctrl') {
			// Modus Multi-Select (CTRL + Klik)
			if (!isCtrlPressed) {
				// Pemain mengklik tanpa menahan tombol CTRL!
				setMissClicks((prev) => prev + 1);
				playTone('miss', isMuted);
				triggerHitEffect(clickX, clickY, 'Tahan tombol CTRL!');
				return;
			}

			// Pemain menahan CTRL, cek apakah file yang diklik adalah target yang benar
			if (file.isTarget) {
				if (selectedFileIds.includes(file.id)) {
					// File sudah terpilih -> FITUR BATAL PILIH (DESELECT VIA CTRL+KLIK)!
					const newSelected = selectedFileIds.filter((id) => id !== file.id);
					setSelectedFileIds(newSelected);
					playTone('hover', isMuted);
					triggerHitEffect(clickX, clickY, 'Pilihan Dibatalkan (-1)');
					return;
				}

				const newSelected = [...selectedFileIds, file.id];
				setSelectedFileIds(newSelected);

				if (newSelected.length >= currentComboMission.requiredCount) {
					// SEMUA TARGET BERHASIL DIPILIH!
					playTone('hit', isMuted);
					triggerHitEffect(clickX, clickY, `${currentComboMission.requiredCount} Berkas Terpilih! 🎉`);
					setIsComboTransitioning(true);
					if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
					comboTimerRef.current = setTimeout(() => {
						handleTargetSuccess(e, 'Sukses 3 File Terpilih!');
						setIsComboTransitioning(false);
					}, 500);
				} else {
					// 1 File berhasil dipilih
					playTone('hit', isMuted);
					triggerHitEffect(clickX, clickY, `+1 File (${newSelected.length}/${currentComboMission.requiredCount})`);
				}
			} else {
				// File yang diklik BUKAN target
				setMissClicks((prev) => prev + 1);
				playTone('miss', isMuted);
				triggerHitEffect(clickX, clickY, 'Bukan file target!');
			}
		} else if (currentComboMission.mode === 'shift') {
			// Modus Range-Select (SHIFT + Klik)
			const targetStart = Math.min(currentComboMission.rangeStart, currentComboMission.rangeEnd);
			const targetEnd = Math.max(currentComboMission.rangeStart, currentComboMission.rangeEnd);

			if (!isShiftPressed) {
				// KLIK BIASA TANPA SHIFT -> Menetapkan atau Memindahkan Titik Awal (Anchor)
				if (index === targetStart) {
					setShiftAnchorIndex(index);
					setSelectedFileIds([file.id]);
					playTone('hit', isMuted);
					triggerHitEffect(clickX, clickY, `Bagus! Sekarang tahan SHIFT & klik Berkas #${targetEnd + 1}!`);
				} else if (index === targetEnd) {
					// Mendukung pemilihan rentang dua arah (mulai dari ujung akhir juga valid di OS)
					setShiftAnchorIndex(index);
					setSelectedFileIds([file.id]);
					playTone('hit', isMuted);
					triggerHitEffect(clickX, clickY, `Bagus! Sekarang tahan SHIFT & klik Berkas #${targetStart + 1}!`);
				} else {
					// Mengklik berkas di luar batas sasaran
					setMissClicks((prev) => prev + 1);
					playTone('miss', isMuted);
					triggerHitEffect(clickX, clickY, `Pilih Berkas #${targetStart + 1} atau #${targetEnd + 1} sebagai awal!`);
				}
			} else {
				// KLIK DENGAN MENAHAN SHIFT
				if (shiftAnchorIndex === null) {
					// Siswa sudah menahan Shift dari awal sebelum klik pertama
					if (index === targetStart) {
						setShiftAnchorIndex(index);
						setSelectedFileIds([file.id]);
						playTone('hit', isMuted);
						triggerHitEffect(clickX, clickY, `Awal terpilih! Sekarang klik Berkas #${targetEnd + 1} (sambil tahan SHIFT)!`);
					} else if (index === targetEnd) {
						setShiftAnchorIndex(index);
						setSelectedFileIds([file.id]);
						playTone('hit', isMuted);
						triggerHitEffect(clickX, clickY, `Awal terpilih! Sekarang klik Berkas #${targetStart + 1} (sambil tahan SHIFT)!`);
					} else {
						setMissClicks((prev) => prev + 1);
						playTone('miss', isMuted);
						triggerHitEffect(clickX, clickY, `Mulai dari Berkas #${targetStart + 1}!`);
					}
				} else {
					// Anchor sudah ada -> Periksa apakah klik kedua melengkapi rentang
					const isComplete = (shiftAnchorIndex === targetStart && index === targetEnd) || (shiftAnchorIndex === targetEnd && index === targetStart);

					if (isComplete) {
						// SUKSES MEMILIH RENTANG LENGKAP!
						const start = Math.min(shiftAnchorIndex, index);
						const end = Math.max(shiftAnchorIndex, index);
						const rangeIds = currentComboMission.files.slice(start, end + 1).map((f) => f.id);
						setSelectedFileIds(rangeIds);
						playTone('hit', isMuted);
						triggerHitEffect(clickX, clickY, `Rentang ${rangeIds.length} Berkas Berhasil Terpilih! 🎉`);

						setIsComboTransitioning(true);
						if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
						comboTimerRef.current = setTimeout(() => {
							handleTargetSuccess(e, 'Rentang Berhasil Dipilih!');
							setIsComboTransitioning(false);
						}, 600);
					} else if (index === shiftAnchorIndex) {
						// Mengklik berkas anchor yang sama
						triggerHitEffect(clickX, clickY, 'Klik berkas ujung lainnya sambil tahan SHIFT!');
					} else {
						// Mengklik berkas yang salah di tengah atau di luar
						const neededEnd = shiftAnchorIndex === targetStart ? targetEnd : targetStart;
						setMissClicks((prev) => prev + 1);
						playTone('miss', isMuted);
						triggerHitEffect(clickX, clickY, `Klik Berkas #${neededEnd + 1} sambil tahan SHIFT!`);
					}
				}
			}
		}
	};

	// Fullscreen toggle with real browser F11 Fullscreen API (mirip TypingTrainerGame)
	const toggleFullscreen = async (e) => {
		if (e) {
			if (typeof e.stopPropagation === 'function') e.stopPropagation();
			if (typeof e.preventDefault === 'function') e.preventDefault();
		}
		try {
			const isCurrentlyFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

			if (!isCurrentlyFs && !isFullscreen) {
				// Request true browser fullscreen (seperti F11)
				const docEl = document.documentElement;
				if (docEl.requestFullscreen) {
					await docEl.requestFullscreen();
				} else if (docEl.webkitRequestFullscreen) {
					await docEl.webkitRequestFullscreen();
				} else if (docEl.mozRequestFullScreen) {
					await docEl.mozRequestFullScreen();
				} else if (docEl.msRequestFullscreen) {
					await docEl.msRequestFullscreen();
				}
				setIsFullscreen(true);
			} else {
				// Exit true browser fullscreen
				if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
					if (document.exitFullscreen) {
						await document.exitFullscreen();
					} else if (document.webkitExitFullscreen) {
						await document.webkitExitFullscreen();
					} else if (document.mozCancelFullScreen) {
						await document.mozCancelFullScreen();
					} else if (document.msExitFullscreen) {
						await document.msExitFullscreen();
					}
				}
				setIsFullscreen(false);
			}
		} catch (err) {
			// Fallback if browser policy restricts fullscreen API
			setIsFullscreen((prev) => !prev);
		}
	};

	// Sync state if user presses F11 or Esc natively in browser
	useEffect(() => {
		const handleFullscreenChange = () => {
			const isNowFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
			setIsFullscreen(isNowFs);
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
		document.addEventListener('mozfullscreenchange', handleFullscreenChange);
		document.addEventListener('MSFullscreenChange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
			document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
			document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
		};
	}, []);

	// Calculate Accuracy
	const hits = currentTarget;
	const recordedActions = stage.type === 'hover' ? hits : Math.max(totalClicks, hits);
	const accuracy = recordedActions > 0 ? Math.min(100, Math.round((hits / (hits + missClicks)) * 100)) : 100;

	// Average reaction time
	const avgReaction = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;

	// Format Elapsed Time
	const formatTime = (secs) => {
		const mins = Math.floor(secs / 60);
		const remainder = secs % 60;
		return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
	};

	return (
		<div className={`flex flex-col transition-all select-none ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#FFFDF5] p-2 sm:p-3 overflow-hidden flex flex-col justify-between' : 'w-full'}`}>
			{/* ── TOP CONTROL PANEL (Hanya Tampil Saat Mode Normal, Tersembunyi di Fullscreen) ── */}
			{!isFullscreen && (
				<div className='bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-4 sm:p-5 mb-4'>
					{/* Top Info Bar */}
					<div className='flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4 mb-4'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 bg-amber-300 border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000] font-black text-black'>
								<Mouse className='w-6 h-6' />
							</div>
							<div>
								<div className='flex items-center gap-2'>
									<h1 className='font-heading font-black text-lg sm:text-xl text-black'>{stage.name}</h1>
									<span className='bg-black text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]'>Praktik Mouse</span>
								</div>
								<p className='text-xs text-slate-600 font-mono font-medium mt-0.5'>{stage.instruction}</p>
							</div>
						</div>

						{/* Quick Actions in Normal Mode */}
						<div className='flex items-center gap-2'>
							<button
								onClick={() => setIsMuted(!isMuted)}
								title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
								className='p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-slate-800'>
								{isMuted ? <VolumeX className='w-5 h-5 text-rose-600' /> : <Volume2 className='w-5 h-5 text-emerald-600' />}
							</button>
							<button
								onClick={() => resetGame()}
								title='Ulangi Tahap Ini'
								className='flex items-center gap-1.5 px-3 py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-mono text-xs font-black text-black'>
								<RotateCcw className='w-4 h-4' />
								<span>Reset</span>
							</button>
						</div>
					</div>

					{/* Realtime Stats Badges */}
					<div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3'>
						{/* Target Counter */}
						<div className='bg-amber-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3'>
							<div className='w-8 h-8 rounded bg-amber-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0'>
								<Target className='w-4 h-4' />
							</div>
							<div>
								<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Target</div>
								<div className='font-heading font-black text-base sm:text-lg text-black'>
									{currentTarget} <span className='text-xs text-slate-500 font-mono'>/ {targetCount === 0 ? '∞' : targetCount}</span>
								</div>
							</div>
						</div>

						{/* Time Elapsed */}
						<div className='bg-cyan-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3'>
							<div className='w-8 h-8 rounded bg-cyan-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0'>
								<Clock className='w-4 h-4' />
							</div>
							<div>
								<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Waktu</div>
								<div className='font-heading font-black text-base sm:text-lg text-black font-mono'>{formatTime(elapsedTime)}</div>
							</div>
						</div>

						{/* Accuracy */}
						<div className='bg-emerald-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3'>
							<div className='w-8 h-8 rounded bg-emerald-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0'>
								<Activity className='w-4 h-4' />
							</div>
							<div>
								<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Akurasi</div>
								<div className='font-heading font-black text-base sm:text-lg text-emerald-800'>{accuracy}%</div>
							</div>
						</div>

						{/* Miss Clicks */}
						<div className='bg-rose-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3'>
							<div className='w-8 h-8 rounded bg-rose-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0'>
								<AlertCircle className='w-4 h-4' />
							</div>
							<div>
								<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Meleset</div>
								<div className='font-heading font-black text-base sm:text-lg text-rose-700'>
									{missClicks} <span className='text-xs text-slate-500 font-mono'>kali</span>
								</div>
							</div>
						</div>

						{/* Average Reaction Time */}
						<div className='hidden lg:flex bg-purple-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] items-center gap-3'>
							<div className='w-8 h-8 rounded bg-purple-300 border-2 border-black flex items-center justify-center font-bold text-black shrink-0'>
								<Zap className='w-4 h-4' />
							</div>
							<div>
								<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Kecepatan</div>
								<div className='font-heading font-black text-sm text-purple-900 font-mono'>{avgReaction > 0 ? `${avgReaction} ms` : '-'}</div>
							</div>
						</div>
					</div>

					{/* Stage Selector Pills */}
					<div className='mt-4 pt-3 border-t border-slate-200'>
						<div className='flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono font-bold scrollbar-thin'>
							<span className='text-slate-500 mr-1 shrink-0'>Pilih Tahap:</span>
							{STAGES.map((s) => (
								<button
									key={s.id}
									onClick={() => resetGame(s.id)}
									className={`px-3 py-1.5 rounded-md border-2 border-black shrink-0 transition-all cursor-pointer font-bold ${
										currentStageId === s.id ? 'bg-black text-white shadow-[2px_2px_0px_0px_#FF6B00] scale-105' : 'bg-white text-slate-800 hover:bg-amber-100 shadow-[1px_1px_0px_0px_#000]'
									}`}>
									{s.shortName}
								</button>
							))}
						</div>
					</div>

					{/* Options Row (Target Count, Box Size, & Fullscreen Button) */}
					<div className='mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-slate-100'>
						<div className='flex flex-wrap items-center gap-4'>
							{/* Target Count Option */}
							<div className='flex items-center gap-2'>
								<span className='font-bold text-slate-700'>Jumlah Target:</span>
								{[10, 25, 50, 0].map((count) => (
									<button
										key={count}
										onClick={() => resetGame(currentStageId, count)}
										className={`px-2.5 py-1 rounded border border-black font-bold transition-all cursor-pointer ${
											targetCount === count ? 'bg-orange-500 text-black shadow-[1px_1px_0px_0px_#000]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
										}`}>
										{count === 0 ? 'Bebas (∞)' : `${count}x`}
									</button>
								))}
							</div>

							{/* Size Option */}
							<div className='flex items-center gap-2'>
								<span className='font-bold text-slate-700'>Ukuran Kotak:</span>
								{Object.keys(SIZES).map((key) => (
									<button
										key={key}
										onClick={() => setSelectedSize(key)}
										className={`px-2.5 py-1 rounded border border-black font-bold transition-all cursor-pointer ${
											selectedSize === key ? 'bg-cyan-400 text-black shadow-[1px_1px_0px_0px_#000]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
										}`}>
										{SIZES[key].name}
									</button>
								))}
							</div>
						</div>

						{/* Repositioned Fullscreen Button */}
						<button
							onClick={toggleFullscreen}
							title='Aktifkan Mode Layar Penuh'
							className='inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer'>
							<Maximize2 className='w-4 h-4' />
							<span>Layar Penuh</span>
						</button>
					</div>
				</div>
			)}

			{/* ── MAIN INTERACTIVE GAME CANVAS / PLAYGROUND ────────────────── */}
			<div
				ref={gameAreaRef}
				onClick={handleAreaClick}
				onContextMenu={handleContextMenu}
				onMouseMove={handleDragMove}
				onMouseUp={handleDragEnd}
				className={`relative w-full bg-[#f4f4f4] bg-retro-grid border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden cursor-crosshair select-none transition-all ${
					isFullscreen ? 'flex-1 w-full h-full min-h-[500px]' : 'h-[480px] sm:h-[540px]'
				}`}>
				{/* Stage watermark background */}
				<div className='absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none'>
					<span className='text-8xl sm:text-9xl font-black font-heading text-black'>STAGE {stage.id}</span>
				</div>

				{/* ── FULLSCREEN FLOATING HUD OVERLAY (Hanya Muncul Saat Mode Layar Penuh) ── */}
				{isFullscreen ? (
					<div className='absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none'>
						{/* Left: Stage Title & Instruction */}
						<div className='bg-white/95 backdrop-blur border-2 border-black px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 pointer-events-auto'>
							<span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping'></span>
							<div className='flex flex-col'>
								<span className='font-heading font-black text-xs text-black leading-tight'>{stage.name}</span>
								<span className='font-mono text-[10px] text-slate-600 font-medium'>{stage.instruction}</span>
							</div>
						</div>

						{/* Center: Realtime Stats Badges */}
						<div className='bg-black/90 backdrop-blur text-white border-2 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center gap-3 sm:gap-4 font-mono text-xs font-bold pointer-events-auto select-none'>
							<div className='flex items-center gap-1.5 text-amber-300'>
								<Target className='w-3.5 h-3.5' />
								<span>
									Target: {currentTarget}/{targetCount === 0 ? '∞' : targetCount}
								</span>
							</div>
							<div className='w-px h-3.5 bg-slate-700'></div>
							<div className='flex items-center gap-1.5 text-cyan-300'>
								<Clock className='w-3.5 h-3.5' />
								<span>{formatTime(elapsedTime)}</span>
							</div>
							<div className='w-px h-3.5 bg-slate-700'></div>
							<div className='flex items-center gap-1.5 text-emerald-300'>
								<Activity className='w-3.5 h-3.5' />
								<span>{accuracy}%</span>
							</div>
							<div className='w-px h-3.5 bg-slate-700'></div>
							<div className='flex items-center gap-1.5 text-rose-300'>
								<AlertCircle className='w-3.5 h-3.5' />
								<span>Meleset: {missClicks}</span>
							</div>
						</div>

						{/* Right: Actions & Exit Fullscreen Button */}
						<div className='flex items-center gap-2 pointer-events-auto'>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setIsMuted(!isMuted);
								}}
								title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
								className='p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer text-slate-800'>
								{isMuted ? <VolumeX className='w-4 h-4 text-rose-600' /> : <Volume2 className='w-4 h-4 text-emerald-600' />}
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									resetGame();
								}}
								title='Ulangi Tahap Ini'
								className='flex items-center gap-1 px-3 py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black cursor-pointer'>
								<RotateCcw className='w-3.5 h-3.5' />
								<span>Reset</span>
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									toggleFullscreen(e);
								}}
								title='Keluar Layar Penuh (Tekan Esc)'
								className='flex items-center gap-1.5 px-3.5 py-2 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 font-mono text-xs font-black transition-all cursor-pointer'>
								<Minimize2 className='w-4 h-4' />
								<span>Keluar Layar Penuh</span>
								<kbd className='hidden sm:inline bg-black text-white text-[10px] px-1 py-0.5 rounded font-mono'>Esc</kbd>
							</button>
						</div>
					</div>
				) : /* Normal Mode: Top Pinned Instructions Banner & Inside-Canvas Fullscreen Button */
				stage.type !== 'combo' && stage.type !== 'select' && stage.type !== 'scroll' && stage.type !== 'zoom' && stage.type !== 'ctrl_drag' ? (
					<div
						onClick={(e) => e.stopPropagation()}
						className='absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10'>
						<div className='bg-white/95 backdrop-blur border-2 border-black px-3.5 py-2 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-2'>
							<span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping'></span>
							<span className='font-mono text-xs font-bold text-slate-900'>{stage.desc}</span>
						</div>

						{/* Quick fullscreen trigger inside canvas */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								toggleFullscreen(e);
							}}
							title='Perbesar ke Layar Penuh'
							className='pointer-events-auto p-2 bg-white hover:bg-orange-300 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-black flex items-center gap-1.5 font-mono text-xs font-bold'>
							<Maximize2 className='w-4 h-4' />
							<span className='hidden sm:inline'>Layar Penuh</span>
						</button>
					</div>
				) : (
					/* Structured Stages (Combo, Select, Scroll, Zoom, Ctrl_Drag): Only keep the quick fullscreen button at top-right, NO overlapping instruction banner */
					<div
						onClick={(e) => e.stopPropagation()}
						className='absolute top-3 right-3 pointer-events-none z-10'>
						<button
							onClick={(e) => {
								e.stopPropagation();
								toggleFullscreen(e);
							}}
							title='Perbesar ke Layar Penuh'
							className='pointer-events-auto p-2 bg-white hover:bg-orange-300 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-black flex items-center gap-1.5 font-mono text-xs font-bold'>
							<Maximize2 className='w-4 h-4' />
							<span className='hidden sm:inline'>Layar Penuh</span>
						</button>
					</div>
				)}

				{/* ── STAGES 1, 2, 3, 4, 8: Standard Target Box ────────────────── */}
				{stage.type !== 'drag' && stage.type !== 'scroll' && stage.type !== 'select' && stage.type !== 'combo' && stage.type !== 'zoom' && stage.type !== 'ctrl_drag' && !isFinished && (
					<div
						onClick={(e) => {
							e.stopPropagation();
							if (stage.type === 'click' || stage.type === 'moving') {
								setTotalClicks((prev) => prev + 1);
								handleTargetSuccess(e, 'Klik Bagus!');
							} else if (stage.type === 'contextmenu') {
								// Left-click on a right-click target counts as miss!
								setTotalClicks((prev) => prev + 1);
								setMissClicks((prev) => prev + 1);
								playTone('miss', isMuted);
								triggerHitEffect(targetPos.x + sizeConfig.width / 2, targetPos.y, 'Gunakan Klik Kanan!');
							}
						}}
						onContextMenu={(e) => {
							e.preventDefault();
							e.stopPropagation();
							if (stage.type === 'contextmenu') {
								setTotalClicks((prev) => prev + 1);
								handleTargetSuccess(e, 'Klik Kanan Tepat!');
							} else {
								// Right-click on left-click target counts as miss!
								setTotalClicks((prev) => prev + 1);
								setMissClicks((prev) => prev + 1);
								playTone('miss', isMuted);
								triggerHitEffect(targetPos.x + sizeConfig.width / 2, targetPos.y, 'Meleset!');
							}
						}}
						onDoubleClick={(e) => {
							e.stopPropagation();
							if (stage.type === 'dblclick') {
								setTotalClicks((prev) => prev + 2);
								handleTargetSuccess(e, 'Double Click Hebat!');
							}
						}}
						onMouseEnter={handleTargetMouseEnter}
						onMouseLeave={handleTargetMouseLeave}
						style={{
							position: 'absolute',
							left: `${targetPos.x}px`,
							top: `${targetPos.y}px`,
							width: `${sizeConfig.width}px`,
							height: `${sizeConfig.height}px`,
							transition: stage.type === 'moving' ? 'none' : 'transform 0.1s ease-out',
						}}
						className={`flex flex-col items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] cursor-pointer select-none rounded-lg overflow-hidden ${stage.color} hover:brightness-105 group animate-in fade-in zoom-in-90 duration-150`}>
						{/* Hover progress bar inside box */}
						{stage.type === 'hover' && (
							<div
								className='absolute bottom-0 left-0 top-0 bg-white/40 transition-all duration-75'
								style={{ width: `${hoverProgress}%` }}
							/>
						)}

						<div className='relative z-10 flex items-center gap-1.5 text-center font-heading'>
							<span className={sizeConfig.font}>{stage.textLabel}</span>
						</div>

						{stage.type === 'hover' && <span className='relative z-10 text-[9px] font-mono opacity-90'>{hoverProgress > 0 ? `Menahan... ${hoverProgress}%` : 'Tahan kursor disini'}</span>}
					</div>
				)}

				{/* ── STAGE 5: Drag and Drop Interaction ────────────────── */}
				{stage.type === 'drag' && !isFinished && (
					<>
						{/* Drop Zone (Target Folder) */}
						<div
							style={{
								position: 'absolute',
								left: `${dropZonePos.x}px`,
								top: `${dropZonePos.y}px`,
								width: '140px',
								height: '120px',
							}}
							className='border-3 border-dashed border-emerald-700 bg-emerald-100/90 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] pointer-events-none select-none'>
							<FolderDown className='w-10 h-10 text-emerald-800 mb-1 animate-bounce' />
							<span className='font-heading font-black text-xs text-emerald-900'>FOLDER SASARAN</span>
							<span className='text-[10px] font-mono text-emerald-700 font-bold'>Lepas file di sini</span>
						</div>

						{/* Draggable File Item */}
						<div
							onMouseDown={handleDragStart}
							onClick={(e) => e.stopPropagation()}
							style={{
								position: 'absolute',
								left: `${dragItemPos.x}px`,
								top: `${dragItemPos.y}px`,
								width: '84px',
								height: '84px',
								zIndex: isDragging ? 50 : 20,
							}}
							className={`bg-amber-300 border-3 border-black rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] cursor-grab active:cursor-grabbing hover:bg-amber-200 transition-shadow ${
								isDragging ? 'scale-110 rotate-3 shadow-[8px_8px_0px_0px_#000]' : ''
							}`}>
							<FileCode className='w-7 h-7 text-black mb-0.5' />
							<span className='font-mono font-bold text-[10px] text-black leading-tight'>Data.pdf</span>
							<span className='text-[8px] font-mono bg-black text-white px-1 rounded mt-0.5'>SERET ME</span>
						</div>
					</>
				)}

				{/* ── STAGE 6: Seleksi & Blok Teks (Text Selection) ────────────────── */}
				{stage.type === 'select' && !isFinished && (
					<div className={`absolute inset-0 flex flex-col items-center justify-center p-3 select-none overflow-y-auto ${isFullscreen ? 'pt-20 pb-4' : 'pt-2 pb-2'}`}>
						<div
							onClick={(e) => e.stopPropagation()}
							className='my-auto w-full max-w-2xl bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl p-5 sm:p-7 space-y-4 animate-in zoom-in-95 duration-200'>
							{/* Target Mission Header Banner */}
							<div className='flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3.5'>
								<div className='flex items-center gap-3'>
									<div className='w-10 h-10 rounded-xl bg-violet-600 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000]'>
										<Highlighter className='w-5 h-5' />
									</div>
									<div>
										<span className='text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block'>Target #{currentTarget + 1}</span>
										<div className='flex flex-wrap items-center gap-2'>
											<span className='text-xs font-mono font-bold text-slate-700'>Blok teks:</span>
											<span className='font-heading font-black text-sm sm:text-base text-violet-950 bg-violet-200 border-2 border-violet-700 px-3 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_#6D28D9]'>
												"{currentTextItem.target}"
											</span>
										</div>
									</div>
								</div>

								{/* Pro Tip Badge */}
								<div className='bg-amber-100 border border-amber-400 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-amber-900 flex items-center gap-1.5 shadow-xs'>
									<Sparkles className='w-3.5 h-3.5 text-amber-600 shrink-0' />
									<span>Trik: Bisa klik 2x cepat!</span>
								</div>
							</div>

							{/* Interactive Text Display (Document Paper Area) */}
							<div className='space-y-1.5'>
								<div className='text-[11px] font-mono text-slate-500 flex items-center justify-between'>
									<span>📄 Lembar Kalimat Latihan:</span>
									<span className='font-bold text-violet-700'>{currentTextItem.hint}</span>
								</div>

								<div
									onMouseUp={handleTextSelectionEnd}
									className='bg-[#FFFDF8] border-3 border-black rounded-xl p-5 sm:p-7 shadow-inner text-base sm:text-xl font-mono text-slate-900 leading-relaxed sm:leading-loose tracking-wide cursor-text select-text hover:border-violet-600 transition-colors selection:bg-violet-300 selection:text-black min-h-[100px] flex items-center'>
									{currentTextItem.sentence}
								</div>
							</div>

							{/* Footer Guidance */}
							<div className='flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono text-slate-600 border-t border-slate-100'>
								<div className='flex items-center gap-2'>
									<span className='inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping'></span>
									<span>{currentTextItem.tip}</span>
								</div>
								<span className='text-[10px] text-slate-400 font-bold'>Lepas tombol mouse untuk memvalidasi</span>
							</div>
						</div>
					</div>
				)}

				{/* ── STAGE 7: Scroll Wheel Playground (10 Sektor dengan Latihan Scroll Ke Atas & Ke Bawah) ── */}
				{stage.type === 'scroll' && !isFinished && (
					<div
						ref={scrollContainerRef}
						onClick={handleAreaClick}
						onContextMenu={handleContextMenu}
						className='absolute inset-0 overflow-y-auto p-4 sm:p-6 space-y-16 scroll-smooth pt-20'>
						{/* Top Start Banner */}
						<div
							onClick={(e) => {
								e.stopPropagation();
								handleAreaClick(e);
							}}
							className='bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] max-w-lg mx-auto text-center space-y-2 select-none'>
							<Compass className='w-8 h-8 text-cyan-600 mx-auto animate-pulse' />
							<h3 className='font-heading font-black text-sm text-black'>⬆️ Ujung Paling Atas Halaman (Sektor #1 - #10)</h3>
							<p className='text-xs text-slate-600 font-mono'>
								Putar roda mouse <strong>ke bawah (scroll down)</strong> atau <strong>ke atas (scroll up)</strong> untuk mencari Target #{currentTarget + 1} di 10 sektor ini!
							</p>
						</div>

						{/* 10 Distinct Scroll Landmark Sectors */}
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sectionNum) => {
							const isTargetHere = scrollTargetSection === sectionNum;
							return (
								<div
									key={sectionNum}
									onClick={(e) => {
										e.stopPropagation();
										handleAreaClick(e);
									}}
									className={`max-w-lg mx-auto py-8 px-5 border-2 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 relative transition-all ${
										isTargetHere ? 'border-cyan-500 bg-cyan-50/90 shadow-[4px_4px_0px_0px_#06B6D4]' : 'border-dashed border-slate-300 bg-white/80 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]'
									}`}>
									<div className='flex items-center gap-2'>
										<span className='font-mono text-xs font-black text-slate-800 bg-amber-300 px-3 py-1 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]'>📍 Sektor #{sectionNum} dari 10</span>
										{isTargetHere && <span className='text-[11px] font-mono font-bold text-cyan-800 bg-cyan-200 px-2 py-0.5 rounded border border-cyan-400 animate-pulse'>Target Ditemukan!</span>}
									</div>

									{isTargetHere ? (
										<div className='py-3 animate-in zoom-in-95 duration-200'>
											<button
												onClick={(e) => {
													e.stopPropagation();
													setTotalClicks((prev) => prev + 1);
													handleTargetSuccess(e, `Sektor #${sectionNum} Sukses!`);
												}}
												className='px-6 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-heading font-black text-base border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer animate-bounce flex items-center gap-2'>
												<Target className='w-6 h-6' />
												<span>🎯 KLIK TARGET #{currentTarget + 1} DI SEKTOR INI!</span>
											</button>
										</div>
									) : (
										<div className='py-2 text-xs font-mono text-slate-400'>Target tidak berada di Sektor #{sectionNum}. Gulir roda mouse ke atas atau ke bawah...</div>
									)}
								</div>
							);
						})}

						{/* Bottom End Banner */}
						<div
							onClick={(e) => {
								e.stopPropagation();
								handleAreaClick(e);
							}}
							className='h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 font-mono text-xs max-w-lg mx-auto bg-slate-50 p-3 text-center space-y-1'>
							<span className='font-bold'>⬇️ Ujung Paling Bawah Halaman</span>
							<span className='text-[11px] text-slate-400'>
								Jika target belum ditemukan di sini, gulir roda mouse <strong>ke atas</strong> ⬆️
							</span>
						</div>
					</div>
				)}

				{/* ── STAGE 9: Kombinasi Mouse + Keyboard (Ctrl / Shift + Klik) ────────────────── */}
				{stage.type === 'combo' && !isFinished && (
					<div className={`absolute inset-0 flex flex-col items-center justify-center p-3 select-none overflow-y-auto ${isFullscreen ? 'pt-20 pb-4' : 'pt-2 pb-2'}`}>
						<div
							onClick={(e) => e.stopPropagation()}
							className='w-full max-w-2xl bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-3 sm:p-4 space-y-2.5 animate-in zoom-in-95 duration-200'>
							{/* Mission Header & Keyboard Live Indicator (Diletakkan Tepat di Bawah Soal) */}
							<div className='border-b-2 border-slate-200 pb-2'>
								<div className='flex items-start gap-2.5 min-w-0'>
									<div className='w-8 h-8 rounded-lg bg-indigo-600 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000] shrink-0 mt-0.5'>
										<Keyboard className='w-4 h-4' />
									</div>
									<div className='min-w-0 flex-1 space-y-1.5'>
										<div className='flex items-center gap-2'>
											<span className='text-[10px] font-mono font-bold uppercase text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded border border-indigo-200'>Target #{currentTarget + 1}</span>
											<span className='text-[10px] font-mono text-slate-500 font-bold'>{currentComboMission.mode === 'ctrl' ? 'Multi-Select (Acak)' : 'Range-Select (Rentang)'}</span>
										</div>

										<h3 className='font-heading font-black text-xs sm:text-sm text-black leading-snug break-words'>{currentComboMission.instruction}</h3>

										{/* Real-time Keyboard Indicator (Indikator Tombol Keyboard Fisik) */}
										<div className='flex flex-wrap items-center gap-2 pt-0.5'>
											<div className='flex items-center gap-1.5 bg-slate-900 border-2 border-black px-2.5 py-1 rounded-lg shrink-0 shadow-[2px_2px_0px_0px_#000] select-none'>
												<span className='text-[9px] font-mono text-slate-400 mr-0.5 font-bold'>STATUS KEYBOARD:</span>
												<div
													title='Status tombol CTRL di keyboard fisik'
													className={`px-2 py-0.5 rounded font-mono text-[10px] font-black border transition-all select-none ${
														activeModifiers.ctrl ? 'bg-emerald-400 text-black border-white shadow-[0_0_8px_#10B981] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700'
													}`}>
													CTRL {activeModifiers.ctrl ? '✓ (Ditekan)' : ''}
												</div>
												<div
													title='Status tombol SHIFT di keyboard fisik'
													className={`px-2 py-0.5 rounded font-mono text-[10px] font-black border transition-all select-none ${
														activeModifiers.shift ? 'bg-emerald-400 text-black border-white shadow-[0_0_8px_#10B981] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700'
													}`}>
													SHIFT {activeModifiers.shift ? '✓ (Ditekan)' : ''}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Explorer Toolbar with Integrated Target Badge */}
							<div className='flex flex-wrap items-center justify-between gap-2 px-1'>
								<div className='flex items-center gap-2'>
									<span className='text-xs font-mono font-bold text-slate-700'>📁 File Explorer</span>
									<span className='text-slate-300'>•</span>
									<span className='text-[11px] font-mono font-black text-indigo-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-xs'>
										<Sparkles className='w-3 h-3 text-amber-700 shrink-0' />
										<span>
											🎯 Sasaran: <strong>{currentComboMission.targetLabel}</strong>
										</span>
									</span>
								</div>
								<div className='text-[11px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded'>
									Terpilih: <span className='text-indigo-700 font-black'>{selectedFileIds.length}</span>
									{currentComboMission.mode === 'ctrl' ? ` / ${currentComboMission.requiredCount}` : ' berkas'}
								</div>
							</div>

							{/* File Grid (6 Symmetrical, Compact Files) */}
							<div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
								{currentComboMission.files.map((file, idx) => {
									const isSelected = selectedFileIds.includes(file.id);
									const typeConfig = FILE_TYPE_CONFIG[file.icon] || {
										label: 'Berkas',
										fullName: 'Berkas',
										color: 'bg-slate-100 text-slate-900 border-slate-300',
									};

									const isShiftMode = currentComboMission.mode === 'shift';
									const targetStart = isShiftMode ? Math.min(currentComboMission.rangeStart, currentComboMission.rangeEnd) : null;
									const targetEnd = isShiftMode ? Math.max(currentComboMission.rangeStart, currentComboMission.rangeEnd) : null;

									const isAnchor = isShiftMode && shiftAnchorIndex === idx;
									const isStartBound = isShiftMode && idx === targetStart;
									const isEndBound = isShiftMode && idx === targetEnd;
									const isOppositeTarget = isShiftMode && shiftAnchorIndex !== null && (shiftAnchorIndex === targetStart ? isEndBound : isStartBound);

									return (
										<div
											key={file.id}
											onClick={(e) => handleComboFileClick(file, idx, e)}
											className={`border-2 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between cursor-pointer transition-all select-none min-h-[74px] ${
												isSelected
													? 'bg-indigo-100 border-indigo-700 shadow-[3px_3px_0px_0px_#4338CA] -translate-y-0.5'
													: 'bg-white border-black hover:bg-slate-50 hover:border-indigo-400 shadow-[2px_2px_0px_0px_#000]'
											}`}>
											{/* Top Bar inside Card: Checkbox + File Type Badge + Status/Step Badge */}
											<div className='flex items-center justify-between gap-1 mb-1'>
												<div className='flex items-center gap-1.5'>
													{isSelected ? <CheckSquare className='w-3.5 h-3.5 text-indigo-700 shrink-0' /> : <Square className='w-3.5 h-3.5 text-slate-400 shrink-0' />}
													<span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded border ${typeConfig.color}`}>{typeConfig.label}</span>
												</div>

												{/* Right Tag: Star / Shift Step Badge / File Index */}
												{file.tag ? (
													<span className='text-[9px] font-bold text-amber-900 bg-amber-200 border border-amber-400 px-1.5 py-0.2 rounded'>{file.tag}</span>
												) : isShiftMode ? (
													isAnchor ? (
														<span className='text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-emerald-500 text-white border border-emerald-600 shadow-xs'>#{idx + 1} ✓ (Awal)</span>
													) : isOppositeTarget ? (
														<span className='text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 border border-indigo-400 animate-pulse'>#{idx + 1} 🏁 (Shift+Klik)</span>
													) : shiftAnchorIndex === null && isStartBound ? (
														<span className='text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-400 animate-pulse'>#{idx + 1} 🟢 (Klik Awal)</span>
													) : shiftAnchorIndex === null && isEndBound ? (
														<span className='text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 border border-indigo-400'>#{idx + 1} 🏁 (Shift+Klik)</span>
													) : (
														<span className='text-[9px] font-mono text-slate-400 font-bold'>#{idx + 1}</span>
													)
												) : (
													<span className='text-[9px] font-mono text-slate-400 font-bold'>#{idx + 1}</span>
												)}
											</div>

											{/* Bottom: Icon & File Name */}
											<div className='flex items-center gap-2'>
												<div className='shrink-0'>{renderFileIcon(file.icon)}</div>
												<div className='overflow-hidden flex-1 min-w-0'>
													<p
														className={`font-mono text-xs font-bold truncate ${isSelected ? 'text-indigo-950 font-black' : 'text-slate-800'}`}
														title={file.name}>
														{file.name}
													</p>
													<span className='text-[9px] font-mono text-slate-500 block truncate'>{typeConfig.fullName}</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Footer Guidance with Rumus Cepat */}
							<div className='pt-2 border-t border-slate-100 space-y-1.5 font-mono'>
								{/* Baris 1: Tips Dinamis Misi Saat Ini + Target Hint */}
								<div className='flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs text-slate-700'>
									<div className='flex items-center gap-1.5 min-w-0'>
										<span className='inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0'></span>
										<span className='text-[11px] leading-tight font-semibold truncate sm:whitespace-normal'>
											{currentComboMission.mode === 'ctrl'
												? '💡 Tips: Tahan CTRL saat klik untuk memilih (atau klik lagi untuk batal pilih/deselect).'
												: '💡 Tips: Klik awal dulu, lalu tahan SHIFT dan klik berkas akhir untuk memilih rentang.'}
										</span>
									</div>
									<span className='text-[10px] text-indigo-700 font-bold shrink-0 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded'>{currentComboMission.targetHint}</span>
								</div>

								{/* Baris 2: Rumus Cepat Edukatif CTRL vs SHIFT */}
								<div className='flex flex-wrap items-center justify-between gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] text-slate-600'>
									<div className='flex items-center gap-1.5'>
										<span className='font-black text-slate-800 bg-amber-200 border border-amber-400 px-1 py-0.2 rounded text-[9px]'>RUMUS CEPAT</span>
										<span>
											<strong>CTRL + Klik</strong> = Pilih berkas acak/tersebar (klik lagi untuk batal)
										</span>
									</div>
									<span className='text-slate-300 hidden md:inline'>•</span>
									<div>
										<span>
											<strong>SHIFT + Klik</strong> = Pilih rentang berkas berurutan sekaligus
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* ── STAGE 10: Zoom Dokumen & Halaman (CTRL + Scroll Wheel) ────────────────── */}
				{stage.type === 'zoom' && !isFinished && (
					<div className={`absolute inset-0 flex flex-col items-center justify-center p-3 select-none overflow-y-auto ${isFullscreen ? 'pt-20 pb-4' : 'pt-2 pb-2'}`}>
						<div
							onClick={(e) => e.stopPropagation()}
							className='my-auto w-full max-w-2xl bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-3 sm:p-4 space-y-2.5 animate-in zoom-in-95 duration-200'>
							{/* Header: Title, Target Zoom Badge, Keyboard Status */}
							<div className='border-b-2 border-slate-200 pb-2 flex flex-wrap items-center justify-between gap-2'>
								<div className='flex items-center gap-2.5 min-w-0'>
									<div className='w-8 h-8 rounded-lg bg-teal-600 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000] shrink-0'>
										{currentZoomItem.direction === 'in' ? <ZoomIn className='w-4 h-4' /> : <ZoomOut className='w-4 h-4' />}
									</div>
									<div className='min-w-0'>
										<div className='flex items-center gap-2'>
											<span className='text-[10px] font-mono font-bold uppercase text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded border border-teal-300'>Target #{currentTarget + 1}</span>
											<span className='text-[10px] font-mono text-slate-500 font-bold'>Zooming Lembar Dokumen</span>
										</div>
										<h3 className='font-heading font-black text-xs sm:text-sm text-black leading-tight truncate'>{currentZoomItem.hint}</h3>
									</div>
								</div>

								{/* Keyboard CTRL Status Badge */}
								<div className='flex items-center gap-1.5 bg-slate-900 border-2 border-black px-2.5 py-1 rounded-lg shrink-0 shadow-[2px_2px_0px_0px_#000] select-none'>
									<span className='text-[9px] font-mono text-slate-400 mr-0.5 font-bold'>TOMBOL:</span>
									<div
										className={`px-2 py-0.5 rounded font-mono text-[10px] font-black border transition-all ${
											activeModifiers.ctrl ? 'bg-emerald-400 text-black border-white shadow-[0_0_8px_#10B981] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 animate-pulse'
										}`}>
										CTRL {activeModifiers.ctrl ? '✓ (Ditekan)' : '(Harus Ditekan)'}
									</div>
								</div>
							</div>

							{/* Middle: Document Preview Stage (Clamped view with dynamic scaling) */}
							<div className='relative w-full h-40 sm:h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center p-2 shadow-inner'>
								{/* Background Watermark/Grid */}
								<div className='absolute inset-0 bg-retro-grid opacity-20 pointer-events-none' />

								{/* Scalable Document Paper */}
								<div
									style={{
										transform: `scale(${currentZoom / 100})`,
										transformOrigin: 'center center',
										transition: 'transform 0.05s ease-out',
									}}
									className='w-72 sm:w-80 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] p-3 select-none pointer-events-none'>
									{/* Document Window Header */}
									<div className='flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2'>
										<div className='flex items-center gap-1.5'>
											{renderFileIcon(currentZoomItem.icon)}
											<span className='font-mono font-bold text-xs text-slate-800 truncate max-w-[170px]'>{currentZoomItem.fileName}</span>
										</div>
										<span className='font-mono text-[10px] font-black bg-teal-100 text-teal-900 border border-teal-300 px-1.5 py-0.5 rounded'>
											{currentZoom}%
										</span>
									</div>

									{/* Document Content Mockup based on type */}
									{currentZoomItem.icon === 'sheet' ? (
										<div className='space-y-1 font-mono text-[10px]'>
											<div className='grid grid-cols-4 gap-1 bg-emerald-100 p-1 rounded font-black text-emerald-900 border border-emerald-300 text-center'>
												<span>No</span>
												<span>Nama</span>
												<span>Nilai</span>
												<span>Hasil</span>
											</div>
											<div className='grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded text-slate-700 text-center border border-slate-200'>
												<span>01</span>
												<span>Budi</span>
												<span className='font-bold text-emerald-700'>95</span>
												<span className='bg-emerald-200 text-emerald-900 rounded font-bold'>A</span>
											</div>
											<div className='grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded text-slate-700 text-center border border-slate-200'>
												<span>02</span>
												<span>Siti</span>
												<span className='font-bold text-emerald-700'>90</span>
												<span className='bg-emerald-200 text-emerald-900 rounded font-bold'>A</span>
											</div>
										</div>
									) : currentZoomItem.icon === 'img' ? (
										<div className='h-20 bg-amber-50 border border-amber-300 rounded flex flex-col items-center justify-center p-2 text-center text-amber-900'>
											<Image className='w-8 h-8 text-amber-600 mb-1' />
											<span className='text-[10px] font-mono font-bold'>{currentZoomItem.title}</span>
										</div>
									) : (
										<div className='space-y-1 text-slate-700'>
											<div className='h-2.5 bg-blue-200 rounded w-3/4'></div>
											<div className='h-2 bg-slate-200 rounded w-full'></div>
											<div className='h-2 bg-slate-200 rounded w-5/6'></div>
											<p className='text-[9px] font-mono text-slate-500 pt-0.5 leading-tight'>Simulasi zoom lembar dokumen pengolah kata.</p>
										</div>
									)}
								</div>

								{/* Floating Zoom Percentage Badge */}
								<div className='absolute bottom-2 right-2 bg-black text-amber-300 font-mono text-xs font-black px-2.5 py-1 rounded-md border border-amber-300 shadow-[2px_2px_0px_0px_#000]'>
									Ukuran: {currentZoom}%
								</div>
							</div>

							{/* Zoom Gauge / Meter */}
							<div className='bg-slate-50 border-2 border-black rounded-xl p-2.5 space-y-1.5 shadow-[2px_2px_0px_0px_#000]'>
								<div className='flex items-center justify-between text-xs font-mono font-bold'>
									<span className='text-slate-600'>Meteran Ukuran:</span>
									<div className='flex items-center gap-2'>
										<span className='text-slate-500'>Target: <strong className='text-amber-800 font-black bg-amber-200 px-1.5 py-0.2 rounded border border-amber-400'>{currentZoomItem.targetZoom}%</strong></span>
										<span className='text-slate-300'>•</span>
										<span>Saat ini: <strong className={`font-black px-1.5 py-0.2 rounded border ${Math.abs(currentZoom - currentZoomItem.targetZoom) <= 5 ? 'bg-emerald-300 text-emerald-950 border-emerald-600' : 'bg-white text-slate-900 border-black'}`}>{currentZoom}%</strong></span>
									</div>
								</div>

								{/* Gauge Bar */}
								<div className='relative h-6 bg-slate-200 rounded-lg border-2 border-black overflow-hidden'>
									{/* Target Zone Highlight */}
									<div
										style={{
											left: `${Math.max(0, Math.min(94, ((currentZoomItem.targetZoom - 40) / (250 - 40)) * 100 - 3))}%`,
											width: '6%',
										}}
										className='absolute top-0 bottom-0 bg-amber-400 border-x-2 border-amber-600 z-10 animate-pulse flex items-center justify-center'
										title={`Zona Target: ${currentZoomItem.targetZoom}%`}
									/>

									{/* Current Zoom Fill */}
									<div
										style={{
											width: `${Math.max(0, Math.min(100, ((currentZoom - 40) / (250 - 40)) * 100))}%`,
										}}
										className={`h-full transition-all duration-75 ${
											Math.abs(currentZoom - currentZoomItem.targetZoom) <= 5 ? 'bg-emerald-500' : 'bg-teal-500'
										}`}
									/>

									{/* Pointer Label */}
									<div
										style={{
											left: `${Math.max(2, Math.min(98, ((currentZoom - 40) / (250 - 40)) * 100))}%`,
										}}
										className='absolute top-0 bottom-0 -ml-1 w-2 bg-black z-20 pointer-events-none'
									/>
								</div>

								{/* Status Message */}
								<div className='flex items-center justify-between text-[11px] font-mono'>
									<span className='text-slate-400 font-bold'>Min: 50%</span>
									<span className={`font-black ${Math.abs(currentZoom - currentZoomItem.targetZoom) <= 5 ? 'text-emerald-700 animate-bounce' : currentZoom < currentZoomItem.targetZoom ? 'text-teal-700' : 'text-amber-700'}`}>
										{Math.abs(currentZoom - currentZoomItem.targetZoom) <= 5
											? '✅ TEPAT! Tahan sejenak...'
											: currentZoom < currentZoomItem.targetZoom
											? '🔼 Putar roda KE ATAS (Zoom In)'
											: '🔽 Putar roda KE BAWAH (Zoom Out)'}
									</span>
									<span className='text-slate-400 font-bold'>Max: 200%</span>
								</div>
							</div>

							{/* Footer Note */}
							<div className='pt-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-slate-600'>
								<span>💡 Tips: Tahan tombol <strong>CTRL</strong> di keyboard lalu putar roda mouse.</span>
								<span className='text-slate-400'>MS Word, Excel & Web Browser</span>
							</div>
						</div>
					</div>
				)}

				{/* ── STAGE 11: Duplikasi Berkas Instan (CTRL + Drag & Drop) ────────────────── */}
				{stage.type === 'ctrl_drag' && !isFinished && (
					<div className={`absolute inset-0 flex flex-col items-center justify-center p-3 select-none overflow-y-auto ${isFullscreen ? 'pt-20 pb-4' : 'pt-2 pb-2'}`}>
						<div
							onClick={(e) => e.stopPropagation()}
							className='my-auto w-full max-w-2xl bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-3 sm:p-4 space-y-2.5 animate-in zoom-in-95 duration-200'>
							{/* Header: Mission Instruction & Keyboard Status */}
							<div className='border-b-2 border-slate-200 pb-2 flex flex-wrap items-center justify-between gap-2'>
								<div className='flex items-center gap-2.5 min-w-0'>
									<div className='w-8 h-8 rounded-lg bg-emerald-600 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000] shrink-0'>
										<Copy className='w-4 h-4' />
									</div>
									<div className='min-w-0'>
										<div className='flex items-center gap-2'>
											<span className='text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300'>Target #{currentTarget + 1}</span>
											<span className='text-[10px] font-mono text-slate-500 font-bold'>Duplikasi Cepat (Copy)</span>
										</div>
										<h3 className='font-heading font-black text-xs sm:text-sm text-black leading-tight truncate'>{currentDuplicateItem.hint}</h3>
									</div>
								</div>

								{/* Keyboard CTRL Status Badge */}
								<div className='flex items-center gap-1.5 bg-slate-900 border-2 border-black px-2.5 py-1 rounded-lg shrink-0 shadow-[2px_2px_0px_0px_#000] select-none'>
									<span className='text-[9px] font-mono text-slate-400 mr-0.5 font-bold'>TOMBOL:</span>
									<div
										className={`px-2 py-0.5 rounded font-mono text-[10px] font-black border transition-all ${
											activeModifiers.ctrl ? 'bg-emerald-400 text-black border-white shadow-[0_0_8px_#10B981] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 animate-pulse'
										}`}>
										CTRL {activeModifiers.ctrl ? '✓ (Ditekan)' : '(Tahan CTRL)'}
									</div>
								</div>
							</div>

							{/* Main Folder Workspace: Side-by-Side (Source Folder vs Destination Folder) */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-auto'>
								{/* Folder Asal (Source Folder) */}
								<div className='bg-slate-50 border-2 border-black rounded-xl p-3 flex flex-col justify-between shadow-[3px_3px_0px_0px_#000] min-h-[155px] relative'>
									<div className='flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2'>
										<div className='flex items-center gap-1.5'>
											<span className='text-base'>📁</span>
											<span className='font-mono font-bold text-xs text-slate-800 truncate'>{currentDuplicateItem.sourceFolder}</span>
										</div>
										<span className='text-[9px] font-mono text-slate-500 font-bold bg-slate-200 px-1.5 py-0.5 rounded'>Asal</span>
									</div>

									{/* File Workspace inside Source Folder */}
									<div className='flex-1 flex items-center justify-center p-2 relative'>
										{/* Ghost Original (always visible in place to show it's a clone, not move!) */}
										<div className='w-full max-w-[210px] border-2 border-dashed border-slate-300 bg-white/70 rounded-xl p-2.5 flex items-center gap-2.5 select-none'>
											<div className='shrink-0 opacity-50'>{renderFileIcon(currentDuplicateItem.icon)}</div>
											<div className='min-w-0 flex-1 opacity-50'>
												<p className='font-mono text-xs font-bold text-slate-700 truncate'>{currentDuplicateItem.name}</p>
												<span className='text-[9px] font-mono text-slate-500 block truncate'>Berkas Asli (Tetap di sini)</span>
											</div>
										</div>

										{/* Draggable File Card */}
										{!hasDuplicatedClone && (
											<div
												onMouseDown={handleCtrlDragStart}
												style={
													isCtrlDragging
														? {
																position: 'fixed',
																left: `${ctrlDragPos.x}px`,
																top: `${ctrlDragPos.y}px`,
																zIndex: 9999,
																pointerEvents: 'none',
														  }
														: {
																position: 'absolute',
																zIndex: 10,
														  }
												}
												className={`w-full max-w-[210px] border-2 rounded-xl p-2.5 flex items-center gap-2.5 cursor-grab active:cursor-grabbing transition-shadow select-none ${
													isCtrlDragging
														? activeModifiers.ctrl
															? 'bg-emerald-100 border-emerald-700 shadow-[6px_6px_0px_0px_#047857] rotate-2 scale-105'
															: 'bg-amber-100 border-amber-600 shadow-[6px_6px_0px_0px_#D97706] rotate-1 scale-105'
														: 'bg-white border-black shadow-[3px_3px_0px_0px_#000] hover:bg-slate-50'
												}`}>
												<div className='shrink-0'>{renderFileIcon(currentDuplicateItem.icon)}</div>
												<div className='min-w-0 flex-1'>
													<div className='flex items-center justify-between gap-1'>
														<p className='font-mono text-xs font-black text-slate-900 truncate'>{currentDuplicateItem.name}</p>
													</div>
													<div className='flex items-center gap-1 mt-0.5'>
														{isCtrlDragging ? (
															activeModifiers.ctrl ? (
																<span className='text-[9px] font-mono font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded shadow-xs flex items-center gap-1'>
																	<span>[+] Salin (Copy)</span>
																</span>
															) : (
																<span className='text-[9px] font-mono font-bold bg-amber-500 text-black px-1.5 py-0.2 rounded'>
																	⚠️ Pindah (Tahan CTRL!)
																</span>
															)
														) : (
															<span className='text-[9px] font-mono text-slate-500 font-bold'>Tahan CTRL & Seret</span>
														)}
													</div>
												</div>
											</div>
										)}
									</div>

									<span className='text-[10px] font-mono text-slate-400 text-center'>Klik & tahan berkas sambil tekan CTRL</span>
								</div>

								{/* Folder Tujuan (Target/Backup Folder) */}
								<div
									ref={ctrlTargetFolderRef}
									className={`border-3 border-dashed rounded-xl p-3 flex flex-col justify-between transition-colors min-h-[155px] ${
										isCtrlDragging
											? activeModifiers.ctrl
												? 'bg-emerald-50/90 border-emerald-600 shadow-[4px_4px_0px_0px_#10B981]'
												: 'bg-amber-50/90 border-amber-500 shadow-[4px_4px_0px_0px_#F59E0B]'
											: 'bg-[#F9FCF8] border-emerald-800/60 shadow-[3px_3px_0px_0px_#000]'
									}`}>
									<div className='flex items-center justify-between border-b border-emerald-200 pb-1.5 mb-2'>
										<div className='flex items-center gap-1.5'>
											<FolderPlus className='w-4 h-4 text-emerald-700' />
											<span className='font-mono font-bold text-xs text-emerald-950 truncate'>{currentDuplicateItem.targetFolder}</span>
										</div>
										<span className='text-[9px] font-mono text-emerald-800 font-black bg-emerald-200 border border-emerald-400 px-1.5 py-0.5 rounded'>Target Salinan</span>
									</div>

									{/* File Workspace inside Target Folder */}
									<div className='flex-1 flex items-center justify-center p-2'>
										{hasDuplicatedClone ? (
											/* Newly cloned duplicate file card */
											<div className='w-full max-w-[210px] bg-emerald-100 border-2 border-emerald-700 rounded-xl p-2.5 flex items-center gap-2.5 shadow-[4px_4px_0px_0px_#047857] animate-in zoom-in-95 duration-200'>
												<div className='shrink-0'>{renderFileIcon(currentDuplicateItem.icon)}</div>
												<div className='min-w-0 flex-1'>
													<p className='font-mono text-xs font-black text-emerald-950 truncate'>
														{currentDuplicateItem.name.replace(/\.[^/.]+$/, '')} - Salinan
													</p>
													<span className='text-[9px] font-mono font-black text-white bg-emerald-600 px-1.5 py-0.2 rounded inline-block mt-0.5 shadow-xs'>
														✓ Berhasil Diduplikasi!
													</span>
												</div>
											</div>
										) : (
											/* Drop Target Placeholder */
											<div className='flex flex-col items-center justify-center text-center space-y-1.5 py-2'>
												<div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform ${isCtrlDragging ? 'border-emerald-600 bg-emerald-200 scale-110 animate-bounce' : 'border-slate-300 bg-white text-slate-400'}`}>
													<FolderDown className={`w-4 h-4 ${isCtrlDragging ? 'text-emerald-800' : 'text-slate-400'}`} />
												</div>
												<span className='font-heading font-black text-xs text-slate-700'>
													{isCtrlDragging ? (activeModifiers.ctrl ? 'Lepaskan Berkas di Sini!' : 'Tahan CTRL lalu lepaskan!') : 'Area Cadangan (Drop Target)'}
												</span>
												<span className='text-[10px] font-mono text-slate-500'>Salinan baru akan tersimpan di sini</span>
											</div>
										)}
									</div>

									<span className='text-[10px] font-mono text-emerald-700 font-bold text-center'>
										{hasDuplicatedClone ? '🎉 Duplikasi Sempurna!' : 'Folder Penerima Salinan'}
									</span>
								</div>
							</div>

							{/* Footer: Windows Shortcut Formula */}
							<div className='pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono text-slate-600'>
								<div className='flex items-center gap-1.5'>
									<span className='font-black text-slate-800 bg-amber-200 border border-amber-400 px-1 py-0.2 rounded text-[9px]'>RUMUS WINDOWS</span>
									<span><strong>CTRL + Drag</strong> = Menggandakan berkas (Copy) tanpa menghapus file asal</span>
								</div>
								<span className='text-slate-400 hidden sm:inline'>Lepas mouse di folder tujuan</span>
							</div>
						</div>
					</div>
				)}

				{/* Floating popups (+1, Tepat!, etc) */}
				{popups.map((popup) => (
					<div
						key={popup.id}
						style={{
							position: 'absolute',
							left: `${popup.x}px`,
							top: `${popup.y}px`,
						}}
						className='pointer-events-none -translate-x-1/2 -translate-y-full z-50 animate-out fade-out slide-out-to-top duration-700'>
						<span
							className={`inline-block px-3 py-1 font-heading font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
								popup.text.includes('Meleset') ? 'bg-rose-500 text-white' : 'bg-amber-300 text-black'
							}`}>
							{popup.text}
						</span>
					</div>
				))}

				{/* ── STAGE COMPLETED MODAL (Victory Dialog) ────────────────── */}
				{isFinished && (
					<div
						className='absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200'
						onClick={(e) => {
							if (e.target === e.currentTarget) handleCloseVictory();
						}}>
						<div className='relative bg-white border-4 border-black shadow-[10px_10px_0px_0px_#000] rounded-2xl max-w-md w-full p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-200'>
							{/* Close / Dismiss Button with Warning Confirmation */}
							<button
								type='button'
								onClick={handleCloseVictory}
								className='absolute top-3.5 right-3.5 w-8 h-8 bg-white hover:bg-rose-500 hover:text-white text-black border-2 border-black rounded-lg flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer z-10'
								title='Tutup & Reset Latihan'>
								<X className='w-4 h-4' />
							</button>

							{/* Trophy Icon */}
							<div className='w-16 h-16 bg-amber-300 border-3 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000] -rotate-3'>
								<Trophy className='w-9 h-9 text-black animate-bounce' />
							</div>

							{/* Title & Badge */}
							<div>
								<span className='bg-emerald-400 text-black font-mono text-xs font-black px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] uppercase inline-block mb-2'>
									🎉 Latihan Selesai!
								</span>
								<h2 className='font-heading font-black text-2xl text-black'>Selamat, Kamu Hebat!</h2>
								<p className='text-xs text-slate-600 font-medium mt-1'>
									Kamu telah menyelesaikan <strong>{stage.name}</strong> dengan sangat baik.
								</p>
							</div>

							{/* Scorecard Stats Grid */}
							<div className='grid grid-cols-3 gap-2 bg-[#FFFDF5] border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_#000]'>
								<div className='p-2 bg-white border border-black rounded-lg'>
									<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Target</div>
									<div className='font-heading font-black text-lg text-black'>{currentTarget}</div>
								</div>
								<div className='p-2 bg-white border border-black rounded-lg'>
									<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Waktu</div>
									<div className='font-heading font-black text-lg text-black font-mono'>{formatTime(elapsedTime)}</div>
								</div>
								<div className='p-2 bg-white border border-black rounded-lg'>
									<div className='text-[10px] font-mono font-bold text-slate-500 uppercase'>Akurasi</div>
									<div className='font-heading font-black text-lg text-emerald-700'>{accuracy}%</div>
								</div>
							</div>

							{/* Evaluation Message */}
							<div className='bg-amber-50 border-2 border-black p-3 rounded-lg text-left flex items-start gap-2.5 text-xs text-slate-800'>
								<ShieldCheck className='w-5 h-5 text-emerald-600 shrink-0 mt-0.5' />
								<div>
									<strong className='text-black block font-heading'>
										{accuracy >= 90 ? '🎯 Evaluasi: Sangat Mahir & Presisi!' : accuracy >= 75 ? '👍 Evaluasi: Cukup Bagus & Lancar' : '💡 Saran: Latih lagi kestabilan tangan'}
									</strong>
									<span className='text-slate-600 text-[11px]'>
										{accuracy >= 90 ? 'Gerakan kursor dan ritme klik mouse kamu sudah sangat presisi, lincah, dan terkontrol!' : 'Pertahankan ketenangan saat mengklik dan jangan terburu-buru menyeret pointer.'}
									</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className='flex flex-col sm:flex-row items-center gap-2.5 pt-2'>
								<button
									onClick={() => resetGame()}
									className='w-full sm:flex-1 py-3 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2'>
									<RotateCcw className='w-4 h-4' />
									<span>Ulangi Tahap Ini</span>
								</button>

								{currentStageId < STAGES.length ? (
									<button
										onClick={() => resetGame(currentStageId + 1)}
										className='w-full sm:flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2'>
										<span>Lanjut Tahap {currentStageId + 1}</span>
										<ArrowRight className='w-4 h-4' />
									</button>
								) : (
									<button
										onClick={() => resetGame(1)}
										className='w-full sm:flex-1 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2'>
										<span>Mulai dari Tahap 1</span>
										<Sparkles className='w-4 h-4' />
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
