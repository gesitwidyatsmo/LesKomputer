'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Trophy,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronRight,
  Star,
  Flame,
  Info,
  Search,
  Check,
  Eye,
  Lock,
  Palette,
  Lightbulb,
  Sparkle
} from 'lucide-react';
import { magicLensAudio } from '@/lib/magicLensAudio';

// ─── KONFIGURASI 5 BABAK PEMANDANGAN RAMAI (~4.5 - 5 MENIT) ─────────
const SCENES_CONFIG = [
  {
    scene: 1,
    title: 'Babak 1: Taman Kota yang Ramai',
    subtitle: 'Fokus: Menekan klik kanan dengan tenang untuk membuka menu',
    duration: 45, // detik
    bgGradient: 'from-sky-200 via-emerald-100 to-lime-200',
    landscapeDetails: [
      { type: 'tree', x: '10%', y: '30%', size: 'text-6xl', icon: '🌳' },
      { type: 'bench', x: '25%', y: '65%', size: 'text-4xl', icon: '🪑' },
      { type: 'pond', x: '50%', y: '45%', size: 'text-7xl', icon: '🦆' },
      { type: 'fountain', x: '75%', y: '60%', size: 'text-5xl', icon: '⛲' },
      { type: 'cart', x: '85%', y: '35%', size: 'text-5xl', icon: '🍦' },
      { type: 'cloud', x: '18%', y: '12%', size: 'text-4xl', icon: '☁️' },
      { type: 'cloud', x: '65%', y: '8%', size: 'text-5xl', icon: '☁️' },
    ],
    targets: [
      {
        id: 'cat_tree',
        name: 'Kucing di Pohon',
        icon: '🐱',
        coloredIcon: '🐱',
        correctAction: 'colorize',
        correctLabel: 'Beri Warna Kucing',
        x: '14%',
        y: '22%',
        hint: 'Kucing belang bersembunyi di dahan pohon kiri',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Cerah' },
          { action: 'unlock', label: '🔓 Buka Kunci' },
        ],
      },
      {
        id: 'mail_box',
        name: 'Kotak Surat Rahasia',
        icon: '📫',
        coloredIcon: '📬',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Surat',
        x: '38%',
        y: '68%',
        hint: 'Ada kotak pos berkarat dekat bangku taman',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Cat' },
          { action: 'unlock', label: '🔓 Buka Kunci Gembok' },
        ],
      },
      {
        id: 'park_lamp',
        name: 'Lentera Taman Antik',
        icon: '🏮',
        coloredIcon: '💡',
        correctAction: 'light',
        correctLabel: 'Nyalakan Lampu',
        x: '62%',
        y: '28%',
        hint: 'Lampu taman di samping jalan setapak belum menyala',
        options: [
          { action: 'light', label: '💡 Nyalakan Lentera' },
          { action: 'unlock', label: '🔓 Buka Kunci' },
        ],
      },
      {
        id: 'red_balloon',
        name: 'Balon Nyangkut',
        icon: '🎈',
        coloredIcon: '🎈',
        correctAction: 'colorize',
        correctLabel: 'Beri Warna Balon',
        x: '82%',
        y: '18%',
        hint: 'Balon kelabu tersangkut di atas gerobak es krim',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Merah' },
          { action: 'light', label: '💡 Nyalakan Lampu' },
        ],
      },
      {
        id: 'lost_bike',
        name: 'Sepeda Rantai',
        icon: '🚲',
        coloredIcon: '🚲',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Sepeda',
        x: '88%',
        y: '72%',
        hint: 'Sepeda kuno tergembok di pojok kanan bawah taman',
        options: [
          { action: 'unlock', label: '🔓 Buka Kunci Rantai' },
          { action: 'colorize', label: '🎨 Beri Warna Velg' },
        ],
      },
    ],
    tip: 'Arahkan kursor ke objek abu-abu, lalu KLIK KANAN mouse untuk memilih "Buka Kunci" atau "Beri Warna"!',
  },
  {
    scene: 2,
    title: 'Babak 2: Museum Fosil & Khazanah Kuno',
    subtitle: 'Fokus: Ketelitian jari tengah memilih opsi yang sesuai',
    duration: 50,
    bgGradient: 'from-amber-100 via-stone-200 to-amber-200',
    landscapeDetails: [
      { type: 'pillar', x: '8%', y: '40%', size: 'text-6xl', icon: '🏛️' },
      { type: 'painting', x: '35%', y: '15%', size: 'text-5xl', icon: '🖼️' },
      { type: 'display', x: '52%', y: '50%', size: 'text-6xl', icon: '🏺' },
      { type: 'redcarpet', x: '50%', y: '82%', size: 'text-7xl', icon: '🧱' },
      { type: 'pillar', x: '90%', y: '40%', size: 'text-6xl', icon: '🏛️' },
    ],
    targets: [
      {
        id: 'dino_skull',
        name: 'Tengkorak T-Rex',
        icon: '🦴',
        coloredIcon: '🦖',
        correctAction: 'clean',
        correctLabel: 'Bersihkan Debu',
        x: '20%',
        y: '35%',
        hint: 'Fosil purba berdebu di sebelah pilar kiri',
        options: [
          { action: 'clean', label: '🧹 Bersihkan Debu Fosil' },
          { action: 'unlock', label: '🔓 Buka Kunci' },
        ],
      },
      {
        id: 'glass_gem',
        name: 'Peti Kaca Berlian',
        icon: '🗄️',
        coloredIcon: '💎',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Kaca',
        x: '38%',
        y: '60%',
        hint: 'Etalase kaca terkunci di lorong tengah',
        options: [
          { action: 'unlock', label: '🔓 Buka Kunci Etalase' },
          { action: 'clean', label: '🧹 Bersihkan Kaca' },
        ],
      },
      {
        id: 'ancient_pot',
        name: 'Guci Firaun',
        icon: '🏺',
        coloredIcon: '🏺',
        correctAction: 'colorize',
        correctLabel: 'Beri Warna Emas',
        x: '65%',
        y: '40%',
        hint: 'Guci tanah liat pucat di dekat karpet merah',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Emas Murni' },
          { action: 'unlock', label: '🔓 Buka Kunci' },
        ],
      },
      {
        id: 'scroll_map',
        name: 'Peta Harta Kuno',
        icon: '📜',
        coloredIcon: '🗺️',
        correctAction: 'identify',
        correctLabel: 'Identifikasi Peta',
        x: '75%',
        y: '18%',
        hint: 'Gulungan kertas kuno tergantung di dinding museum',
        options: [
          { action: 'identify', label: '🔍 Identifikasi Aksara' },
          { action: 'clean', label: '🧹 Bersihkan Debu' },
        ],
      },
      {
        id: 'mummy_case',
        name: 'Sarkofagus Mesir',
        icon: '🪦',
        coloredIcon: '⚰️',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Makam',
        x: '82%',
        y: '65%',
        hint: 'Peti batu berukir hieroglif di sebelah kanan',
        options: [
          { action: 'unlock', label: '🔓 Buka Kunci Gembok Kuno' },
          { action: 'colorize', label: '🎨 Beri Warna' },
        ],
      },
      {
        id: 'golden_crown',
        name: 'Mahkota Kaisar',
        icon: '👑',
        coloredIcon: '👑',
        correctAction: 'colorize',
        correctLabel: 'Beri Kilau Mahkota',
        x: '48%',
        y: '22%',
        hint: 'Mahkota redup di atas bantal beludru panggung',
        options: [
          { action: 'colorize', label: '🎨 Beri Kilau Permata' },
          { action: 'identify', label: '🔍 Identifikasi Logam' },
        ],
      },
    ],
    tip: 'Klik kanan dan baca label aksinya dengan teliti. Klik kiri hanya digunakan untuk memilih tombol menu!',
  },
  {
    scene: 3,
    title: 'Babak 3: Pesisir Pantai Bajak Laut',
    subtitle: 'Fokus: Menyisir sudut layar yang luas & kontrol klik kanan',
    duration: 60,
    bgGradient: 'from-cyan-200 via-amber-50 to-blue-200',
    landscapeDetails: [
      { type: 'ship', x: '80%', y: '18%', size: 'text-6xl', icon: '⛵' },
      { type: 'palm', x: '12%', y: '45%', size: 'text-6xl', icon: '🌴' },
      { type: 'rocks', x: '30%', y: '75%', size: 'text-5xl', icon: '🪨' },
      { type: 'wave', x: '50%', y: '25%', size: 'text-6xl', icon: '🌊' },
      { type: 'sun', x: '88%', y: '10%', size: 'text-5xl', icon: '☀️' },
    ],
    targets: [
      {
        id: 'sand_chest',
        name: 'Peti Terkubur',
        icon: '📦',
        coloredIcon: '🧰',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Peti',
        x: '22%',
        y: '68%',
        hint: 'Sudut peti kayu mengintip di antara gundukan pasir',
        options: [
          { action: 'unlock', label: '🔓 Buka Kunci Peti Laut' },
          { action: 'colorize', label: '🎨 Beri Warna Kayu' },
        ],
      },
      {
        id: 'drift_bottle',
        name: 'Botol Terdampar',
        icon: '🍾',
        coloredIcon: '🍾',
        correctAction: 'unlock',
        correctLabel: 'Buka Tutup Botol',
        x: '42%',
        y: '55%',
        hint: 'Botol kaca berisi surat terombang-ambing di bibir pantai',
        options: [
          { action: 'unlock', label: '🔓 Buka Tutup Botol' },
          { action: 'identify', label: '🔍 Identifikasi Surat' },
        ],
      },
      {
        id: 'lighthouse',
        name: 'Mercusuar Padam',
        icon: '🗼',
        coloredIcon: '💡',
        correctAction: 'light',
        correctLabel: 'Nyalakan Menara',
        x: '68%',
        y: '22%',
        hint: 'Menara mercusuar gelap di tanjung karang jauh',
        options: [
          { action: 'light', label: '💡 Nyalakan Suar Sorot' },
          { action: 'unlock', label: '🔓 Buka Kunci Gerbang' },
        ],
      },
      {
        id: 'cannon',
        name: 'Meriam Karatan',
        icon: '💣',
        coloredIcon: '💣',
        correctAction: 'colorize',
        correctLabel: 'Beri Warna Baja',
        x: '75%',
        y: '65%',
        hint: 'Moncong meriam besi tertutup lumut pantai',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Hitam Baja' },
          { action: 'light', label: '💡 Nyalakan Sumbu' },
        ],
      },
      {
        id: 'telescope',
        name: 'Teropong Pelaut',
        icon: '🔭',
        coloredIcon: '🔭',
        correctAction: 'identify',
        correctLabel: 'Teropong Cakrawala',
        x: '32%',
        y: '30%',
        hint: 'Teropong kuningan bersandar di batu karang',
        options: [
          { action: 'identify', label: '🔍 Teropong Samudra' },
          { action: 'unlock', label: '🔓 Buka Kunci Lensa' },
        ],
      },
      {
        id: 'crystal_crab',
        name: 'Kepiting Kristal',
        icon: '🦀',
        coloredIcon: '🦀',
        correctAction: 'colorize',
        correctLabel: 'Beri Warna Merah',
        x: '55%',
        y: '78%',
        hint: 'Kepiting kecil bersembunyi di dekat cangkang kerang',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Merah Segar' },
          { action: 'unlock', label: '🔓 Buka Kunci Capit' },
        ],
      },
    ],
    tip: 'Sorot seluruh garis pantai! Jangan lupa klik kanan saat menemukan kilau bintang.',
  },
  {
    scene: 4,
    title: 'Babak 4: Hutan Peri Sihir Bercahaya',
    subtitle: 'Fokus: Stabilitas tangan & koordinasi cepat mencari 7 rahasia',
    duration: 60,
    bgGradient: 'from-purple-900 via-indigo-950 to-slate-900',
    landscapeDetails: [
      { type: 'bigtree', x: '20%', y: '35%', size: 'text-7xl', icon: '🌲' },
      { type: 'mushrooms', x: '45%', y: '65%', size: 'text-5xl', icon: '🍄' },
      { type: 'waterfall', x: '82%', y: '40%', size: 'text-6xl', icon: '💧' },
      { type: 'firefly', x: '35%', y: '20%', size: 'text-4xl', icon: '✨' },
      { type: 'firefly2', x: '65%', y: '15%', size: 'text-3xl', icon: '⭐' },
    ],
    targets: [
      {
        id: 'tree_door',
        name: 'Pintu Pohon Peri',
        icon: '🚪',
        coloredIcon: '🚪',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Pohon',
        x: '18%',
        y: '62%',
        hint: 'Pintu gerbang kecil berukir sulur di batang pohon raksasa',
        options: [
          { action: 'unlock', label: '🔓 Buka Kunci Mantra' },
          { action: 'colorize', label: '🎨 Beri Warna Lumut' },
        ],
      },
      {
        id: 'magic_shroom',
        name: 'Jamur Berpijar',
        icon: '🍄',
        coloredIcon: '🍄',
        correctAction: 'colorize',
        correctLabel: 'Beri Pijar Sihir',
        x: '38%',
        y: '72%',
        hint: 'Tudung jamur pudar di semak belukar lembab',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Pijar Ungu' },
          { action: 'light', label: '💡 Nyalakan Spora' },
        ],
      },
      {
        id: 'mana_crystal',
        name: 'Kristal Lembah',
        icon: '🔮',
        coloredIcon: '🔮',
        correctAction: 'light',
        correctLabel: 'Nyalakan Cahaya',
        x: '58%',
        y: '52%',
        hint: 'Batu kristal es beku di tepi kolam peri',
        options: [
          { action: 'light', label: '💡 Nyalakan Kristal Mana' },
          { action: 'unlock', label: '🔓 Buka Kunci Es' },
        ],
      },
      {
        id: 'wise_owl',
        name: 'Burung Hantu',
        icon: '🦉',
        coloredIcon: '🦉',
        correctAction: 'identify',
        correctLabel: 'Identifikasi Penjaga',
        x: '30%',
        y: '22%',
        hint: 'Mata bijak mengawasi dari kerindangan daun pinus',
        options: [
          { action: 'identify', label: '🔍 Identifikasi Penjaga Hutan' },
          { action: 'colorize', label: '🎨 Beri Warna Bulu' },
        ],
      },
      {
        id: 'night_flower',
        name: 'Bunga Malam',
        icon: '🌸',
        coloredIcon: '🌺',
        correctAction: 'colorize',
        correctLabel: 'Mekarkan Bunga',
        x: '72%',
        y: '75%',
        hint: 'Kuncup bunga kuncup di bawah tebing air terjun',
        options: [
          { action: 'colorize', label: '🎨 Beri Warna Mekar Ceria' },
          { action: 'unlock', label: '🔓 Buka Kunci Kuncup' },
        ],
      },
      {
        id: 'fairy_chest',
        name: 'Kotak Sihir Tersegel',
        icon: '🎁',
        coloredIcon: '🎁',
        correctAction: 'unlock',
        correctLabel: 'Buka Segel Sihir',
        x: '62%',
        y: '30%',
        hint: 'Kotak perhiasan berpita misterius mengapung di udara',
        options: [
          { action: 'unlock', label: '🔓 Buka Segel Rantai Sihir' },
          { action: 'colorize', label: '🎨 Beri Warna Pita' },
        ],
      },
      {
        id: 'portal_gate',
        name: 'Gerbang Bintang',
        icon: '🌀',
        coloredIcon: '🌀',
        correctAction: 'unlock',
        correctLabel: 'Aktifkan Portal',
        x: '88%',
        y: '68%',
        hint: 'Lingkaran batu kuno di sudut kanan gelap',
        options: [
          { action: 'unlock', label: '🔓 Aktifkan Pusaran Portal' },
          { action: 'light', label: '💡 Nyalakan Rune' },
        ],
      },
    ],
    tip: 'Di hutan malam ini, kilau bintang akan menuntun kaca pembesarmu menemukan 7 misteri peri!',
  },
  {
    scene: 5,
    title: 'Babak 5: Festival Malam Kembang Api (Grand Finale)',
    subtitle: 'Fokus: Puncak refleks mata & meluncurkan pesta kembang api',
    duration: 65,
    bgGradient: 'from-slate-950 via-purple-950 to-indigo-950',
    landscapeDetails: [
      { type: 'stage', x: '50%', y: '78%', size: 'text-7xl', icon: '🎪' },
      { type: 'wheel', x: '15%', y: '35%', size: 'text-6xl', icon: '🎡' },
      { type: 'tent', x: '82%', y: '45%', size: 'text-6xl', icon: '🎪' },
      { type: 'balloon', x: '35%', y: '18%', size: 'text-5xl', icon: '🎈' },
      { type: 'moon', x: '88%', y: '12%', size: 'text-5xl', icon: '🌙' },
    ],
    targets: [
      {
        id: 'firework_cannon',
        name: 'Meriam Kembang Api',
        icon: '🚀',
        coloredIcon: '🎆',
        correctAction: 'firework',
        correctLabel: 'Luncurkan Pesta!',
        x: '50%',
        y: '62%',
        hint: 'Meriam kembang api raksasa di tengah panggung festival',
        options: [
          { action: 'firework', label: '🎆 Luncurkan Kembang Api Mega' },
          { action: 'unlock', label: '🔓 Buka Kunci Selongsong' },
        ],
      },
      {
        id: 'dragon_lantern',
        name: 'Lampion Naga',
        icon: '🏮',
        coloredIcon: '🏮',
        correctAction: 'light',
        correctLabel: 'Nyalakan Api Naga',
        x: '28%',
        y: '32%',
        hint: 'Lampion merah berbentuk naga bergoyang di atas tali festival',
        options: [
          { action: 'light', label: '💡 Nyalakan Cahaya Lentera' },
          { action: 'colorize', label: '🎨 Beri Warna Sisik' },
        ],
      },
      {
        id: 'carnival_wheel',
        name: 'Kincir Ria Lampu',
        icon: '🎡',
        coloredIcon: '🎡',
        correctAction: 'colorize',
        correctLabel: 'Beri Lampu Warna-Warni',
        x: '14%',
        y: '58%',
        hint: 'Roda kincir ria yang lampunya belum menyala',
        options: [
          { action: 'colorize', label: '🎨 Nyalakan Lampu Neon Pelangi' },
          { action: 'unlock', label: '🔓 Buka Kunci Pintu Kereta' },
        ],
      },
      {
        id: 'vip_safe',
        name: 'Brankas Hadiah VIP',
        icon: '🏦',
        coloredIcon: '💎',
        correctAction: 'unlock',
        correctLabel: 'Buka Kunci Brankas',
        x: '72%',
        y: '68%',
        hint: 'Kotak brankas emas terkunci di samping tenda sirkus',
        options: [
          { action: 'unlock', label: '🔓 Buka Kunci Brankas Juara' },
          { action: 'colorize', label: '🎨 Beri Warna Emas' },
        ],
      },
      {
        id: 'hot_air_balloon',
        name: 'Balon Udara Karnaval',
        icon: '🎈',
        coloredIcon: '🎈',
        correctAction: 'colorize',
        correctLabel: 'Beri Corak Belang',
        x: '62%',
        y: '18%',
        hint: 'Balon udara terbang di bawah sinar bulan sabit',
        options: [
          { action: 'colorize', label: '🎨 Beri Corak Warna Warni' },
          { action: 'light', label: '💡 Nyalakan Pembakar Api' },
        ],
      },
      {
        id: 'magic_hat',
        name: 'Topi Sulap Pesulap',
        icon: '🎩',
        coloredIcon: '🐰',
        correctAction: 'unlock',
        correctLabel: 'Keluarkan Kelinci',
        x: '85%',
        y: '75%',
        hint: 'Topi pesulap hitam di atas meja sulap sudut kanan',
        options: [
          { action: 'unlock', label: '🔓 Keluarkan Kelinci Ajaib' },
          { action: 'colorize', label: '🎨 Beri Warna Pita Topi' },
        ],
      },
      {
        id: 'trophy_stand',
        name: 'Piala Master Detektif',
        icon: '🏆',
        coloredIcon: '🏆',
        correctAction: 'colorize',
        correctLabel: 'Beri Kemilau Emas',
        x: '42%',
        y: '38%',
        hint: 'Piala kemenangan festival berdiri megah di meja kehormatan',
        options: [
          { action: 'colorize', label: '🎨 Beri Kilau Emas Pemenang' },
          { action: 'unlock', label: '🔓 Buka Kunci Wadah' },
        ],
      },
    ],
    tip: 'Luncurkan seluruh kembang api dan buka brankas VIP untuk memenangkan mahkota detektif!',
  },
];

export default function MagicLensGame() {
  // ─── STATE UTAMA GAME ─────────────────────────────────────────────
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'scene_clear' | 'paused' | 'gameover'
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [sceneCountdown, setSceneCountdown] = useState(3);

  // Skor & Progres
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalFoundCount, setTotalFoundCount] = useState(0);
  const [foundInCurrentScene, setFoundInCurrentScene] = useState([]); // Array ID target yang sudah ditemukan
  const [rightClickCount, setRightClickCount] = useState(0);

  // Status Lensa & Menu Konteks
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [lensRadius, setLensRadius] = useState(85); // 65 (presisi), 85 (normal), 110 (luas)
  const [activeMenu, setActiveMenu] = useState(null); // { x, y, target }
  const [hintMessage, setHintMessage] = useState(null); // { x, y, text }
  const [hoveredTargetId, setHoveredTargetId] = useState(null);

  // Pengaturan & Layar Penuh
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const sceneAreaRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const currentScene = SCENES_CONFIG[currentSceneIdx];

  // ─── TOGGLE SUARA ────────────────────────────────────────────────
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    magicLensAudio.enabled = nextState;
  };

  // ─── HITUNG BINTANG RAPOR ─────────────────────────────────────────
  const getStarRating = () => {
    if (totalFoundCount >= 25 && score >= 3500) return 3;
    if (totalFoundCount >= 16 && score >= 2000) return 2;
    return 1;
  };

  // ─── MULAI BABAK DENGAN COUNTDOWN ─────────────────────────────────
  const startSceneCountdown = useCallback((sceneIdx) => {
    setCurrentSceneIdx(sceneIdx);
    const targetScene = SCENES_CONFIG[sceneIdx];
    setTimeLeft(targetScene.duration);
    setSceneCountdown(3);
    setFoundInCurrentScene([]);
    setActiveMenu(null);
    setHintMessage(null);
    setGameState('countdown');
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalFoundCount(0);
    setRightClickCount(0);
    startSceneCountdown(0);
  };

  // ─── EFEK COUNTDOWN ───────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const interval = setInterval(() => {
      setSceneCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // ─── CALLBACK TIMEOUT BABAK ───────────────────────────────────────
  const handleSceneTimeout = useCallback(() => {
    if (currentSceneIdx + 1 < SCENES_CONFIG.length) {
      setGameState('scene_clear');
      magicLensAudio.playSceneClear();
    } else {
      setGameState('gameover');
      magicLensAudio.playGrandVictory();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentSceneIdx]);

  // ─── EFEK TIMER BERJALAN ─────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSceneTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, handleSceneTimeout]);

  // ─── TRACKING PERGERAKAN MOUSE DI ARENA SCENE ─────────────────────
  const handleMouseMove = (e) => {
    if (!sceneAreaRef.current) return;
    const rect = sceneAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  // ─── CEGAH MENU BROWSER & TAMPILKAN MENU RAHASIA (KLIK KANAN) ─────
  const handleContextMenu = (e, target) => {
    e.preventDefault(); // Matikan menu bawaan browser (Inspect, Back, dll)
    if (gameState !== 'playing') return;

    magicLensAudio.init();
    setRightClickCount((prev) => prev + 1);

    if (!sceneAreaRef.current) return;
    const rect = sceneAreaRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Jika objek sudah ditemukan sebelumnya, abaikan
    if (foundInCurrentScene.includes(target.id)) {
      return;
    }

    magicLensAudio.playMenuOpen();

    // Acak urutan opsi setiap kali menu dibuka agar anak membaca pilihannya
    const shuffledOptions = [...target.options].sort(() => Math.random() - 0.5);

    setActiveMenu({
      x: Math.min(Math.max(clickX, 60), rect.width - 150),
      y: Math.min(Math.max(clickY, 40), rect.height - 110),
      target,
      options: shuffledOptions,
    });
    setHintMessage(null);
  };

  // ─── HANDLER JIKA ANAK KELIRU KLIK KIRI PADA OBJEK MISTERI ────────
  const handleLeftClickTarget = (e, target) => {
    if (gameState !== 'playing') return;
    if (foundInCurrentScene.includes(target.id)) return;

    // Berikan pesan ramah untuk menggunakan klik kanan
    magicLensAudio.init();
    magicLensAudio.playHint();

    if (!sceneAreaRef.current) return;
    const rect = sceneAreaRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setHintMessage({
      x: Math.min(Math.max(clickX, 80), rect.width - 160),
      y: Math.max(clickY - 35, 15),
      text: '💡 Gunakan Klik KANAN mouse!',
    });

    setTimeout(() => setHintMessage(null), 1500);
    setActiveMenu(null);
  };

  // ─── EKSEKUSI OPSI DARI MENU RAHASIA KLIK KANAN ────────────────────
  const handleSelectOption = (chosenAction) => {
    if (!activeMenu || !activeMenu.target) return;
    const { target, x: menuX, y: menuY } = activeMenu;

    setActiveMenu(null);

    if (chosenAction === target.correctAction) {
      // ✅ AKSI BENAR!
      const nextFound = [...foundInCurrentScene, target.id];
      setFoundInCurrentScene(nextFound);
      setTotalFoundCount((prev) => prev + 1);

      // Suara sesuai aksi
      if (chosenAction === 'unlock') {
        magicLensAudio.playUnlockChime();
      } else if (chosenAction === 'colorize') {
        magicLensAudio.playColorizeSwoosh();
      } else {
        magicLensAudio.playActionSuccess();
      }

      // Skor & Combo
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const points = 150 + Math.min(newCombo * 25, 100);
      setScore((prev) => prev + points);

      // Partikel kembang api mini
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.5 },
      });

      // Cek apakah semua target dalam babak ini sudah ditemukan
      if (nextFound.length >= currentScene.targets.length) {
        setTimeout(() => {
          if (currentSceneIdx + 1 < SCENES_CONFIG.length) {
            setGameState('scene_clear');
            magicLensAudio.playSceneClear();
          } else {
            setGameState('gameover');
            magicLensAudio.playGrandVictory();
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
          }
        }, 600);
      }
    } else {
      // ⚠️ Salah opsi aksi
      setCombo(0);
      magicLensAudio.playHint();
      setHintMessage({
        x: Math.min(Math.max(menuX, 60), (sceneAreaRef.current?.getBoundingClientRect().width || 600) - 220),
        y: Math.max(menuY - 30, 15),
        text: '❌ Pilihan belum tepat! Klik kanan lagi & amati.',
      });
      setTimeout(() => setHintMessage(null), 1800);
    }
  };

  // Tutup menu jika klik di area kosong
  const handleSceneClick = () => {
    if (activeMenu) setActiveMenu(null);
  };

  // ─── FULLSCREEN TOGGLE ───────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative isolate bg-[#FFFDF5] border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-screen w-screen' : ''
      }`}
    >
      {/* ─── TOP HUD HEADER ──────────────────────────────────────── */}
      <div className="relative z-10 bg-[#FFFDF5] border-b-3 border-black p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 select-none">
        {/* Kolom Kiri: Indikator Babak & Sisa Waktu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
            <span className="font-heading font-black text-xs sm:text-sm text-black">
              {gameState === 'idle' ? 'PERSIAPAN MISI' : `BABAK ${currentScene.scene} / ${SCENES_CONFIG.length}`}
            </span>
            <span className="hidden xl:inline text-xs font-mono font-bold text-slate-700">
              ({gameState === 'idle' ? 'Latihan Refleks: Ketangkasan Klik Kanan' : currentScene.title.split(':')[1]})
            </span>
          </div>

          <div
            className={`border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 font-mono font-black text-xs sm:text-sm ${
              timeLeft <= 10 && gameState === 'playing' ? 'bg-rose-400 text-white animate-pulse' : 'bg-white text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{gameState === 'idle' ? '5 Babak' : `${timeLeft} dtk`}</span>
          </div>
        </div>

        {/* Kolom Tengah: Skor & Statistik Objek */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span className="font-bold">Skor:</span>
            <span className="font-black text-black text-xs sm:text-sm">{score}</span>
          </div>

          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />
            <span className="font-bold hidden sm:inline">Misteri:</span>
            <span className="font-black text-cyan-700 text-xs sm:text-sm">
              {foundInCurrentScene.length}/{currentScene.targets.length}
            </span>
          </div>

          {combo > 1 && (
            <div className="bg-rose-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md flex items-center gap-1 font-black animate-bounce text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Pilihan Radius Lensa & Kontrol */}
        <div className="flex items-center gap-1.5">
          <select
            value={lensRadius}
            onChange={(e) => setLensRadius(parseInt(e.target.value))}
            disabled={gameState === 'playing'}
            className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-1 rounded-md font-mono text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-50"
            title="Pilih ukuran kaca pembesar"
          >
            <option value={110}>Lensa: Luas (110px)</option>
            <option value={85}>Lensa: Normal (85px)</option>
            <option value={60}>Lensa: Tajam (60px)</option>
          </select>

          <button
            onClick={handleToggleSound}
            className="p-1.5 bg-white hover:bg-amber-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md transition-all cursor-pointer"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-black" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="p-1.5 bg-amber-300 hover:bg-amber-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md font-mono font-bold text-xs cursor-pointer"
              title="Jeda Game"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {gameState === 'paused' && (
            <button
              onClick={() => setGameState('playing')}
              className="p-1.5 bg-emerald-400 hover:bg-emerald-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md font-mono font-bold text-xs cursor-pointer"
              title="Lanjut Main"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md transition-all hidden sm:flex cursor-pointer"
            title="Layar Penuh"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-black" />
            ) : (
              <Maximize2 className="w-4 h-4 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* ─── ARENA PEMANDANGAN ILUSTRASI (WHERE'S WALDO STYLE) ─────── */}
      <div
        ref={sceneAreaRef}
        onMouseMove={handleMouseMove}
        onClick={handleSceneClick}
        className={`relative flex-1 bg-gradient-to-b ${currentScene.bgGradient} flex items-center justify-center overflow-hidden select-none cursor-crosshair ${
          isFullscreen ? 'min-h-0 w-full h-full' : 'min-h-[480px] sm:min-h-[520px]'
        }`}
      >
        {gameState === 'idle' ? (
          /* ─── IN-ARENA WELCOME SCREEN (BUKAN POPUP MODAL) ─── */
          <div className="flex-1 w-full h-full flex flex-col justify-between items-center text-center py-4 sm:py-6 px-4 sm:px-6 relative z-10 my-auto max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Header Judul Game */}
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-300 border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_#000] uppercase text-black">
                <span>🔍</span>
                <span>Game 4 • Fokus Motorik: Klik Kanan (Right-Click)</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-black drop-shadow-[2px_2px_0px_#fff]">
                Kaca Pembesar Ajaib
              </h1>
              <p className="text-xs sm:text-sm text-slate-800 font-bold max-w-xl mx-auto leading-relaxed">
                Sisir pemandangan ramai menggunakan kaca pembesar. Temukan objek tersembunyi dan tekan <strong>KLIK KANAN</strong> mouse untuk memunculkan menu rahasia dalam <strong>5 Babak Detektif (~4.5 Menit)</strong>!
              </p>
            </div>

            {/* Panggung Tiga Kolom Edukasi */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-cyan-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🔍
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-cyan-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    1. SISIR PEMANDANGAN
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Lensa Mata Elang
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Gerakkan mouse untuk mengarahkan lingkaran lensa ke berbagai sudut pemandangan.
                  </p>
                </div>
              </div>

              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-amber-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🖱️
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-amber-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    2. KLIK KANAN RAHASIA
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Gunakan Jari Tengah
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Tekan tombol kanan mouse tepat di atas objek berkilau untuk memunculkan menu rahasia.
                  </p>
                </div>
              </div>

              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-400 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🔓
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-emerald-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    3. BUKA RAHASIA
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Pilih Menu Konteks
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Klik kiri pada opsi &ldquo;Buka Kunci&rdquo; atau &ldquo;Beri Warna&rdquo; untuk mengungkap misterinya!
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol Mulai Permainan */}
            <div className="pt-2">
              <button
                onClick={startGame}
                className="py-3 px-8 bg-amber-400 hover:bg-amber-300 border-3 border-black font-heading font-black text-sm sm:text-base text-black rounded-2xl shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>MULAI PETUALANGAN MATA ELANG</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* BARIS ATAS: CHECKLIST OBJEK MISTERI YANG DICARI */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-sm border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-xl p-2 sm:px-3 overflow-x-auto">
              <div className="flex items-center gap-1 text-[11px] font-mono font-black text-black shrink-0 mr-1">
                <Search className="w-3.5 h-3.5 text-cyan-600" />
                <span>Target Misteri:</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {currentScene.targets.map((tgt) => {
              const isFound = foundInCurrentScene.includes(tgt.id);

              return (
                <div
                  key={tgt.id}
                  className={`px-2 py-1 rounded-lg border font-mono text-[10px] sm:text-xs flex items-center gap-1 shrink-0 transition-all ${
                    isFound
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-900 line-through opacity-80'
                      : 'bg-slate-100/90 border-black text-black shadow-[1px_1px_0px_0px_#000]'
                  }`}
                  title={tgt.hint}
                >
                  <span className={isFound ? '' : 'filter grayscale contrast-125'}>
                    {tgt.icon}
                  </span>
                  <span className="font-bold truncate max-w-[100px] sm:max-w-none">
                    {tgt.name}
                  </span>
                  {isFound && <Check className="w-3 h-3 text-emerald-600 font-black" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ELEMEN-ELEMEN ILUSTRASI LATAR BELAKANG SCENE ────────── */}
        <div className="absolute inset-0 pointer-events-none">
          {currentScene.landscapeDetails.map((item, idx) => (
            <div
              key={`scene-bg-${idx}`}
              className={`absolute ${item.size} opacity-80 transition-transform duration-700`}
              style={{ left: item.x, top: item.y }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        {/* ── OBJEK-OBJEK TERSEMBUNYI INTERAKTIF ─────────────────── */}
        {currentScene.targets.map((tgt) => {
          const isFound = foundInCurrentScene.includes(tgt.id);

          return (
            <div
              key={tgt.id}
              onClick={(e) => handleLeftClickTarget(e, tgt)}
              onContextMenu={(e) => handleContextMenu(e, tgt)}
              onMouseEnter={() => {
                if (!isFound) {
                  setHoveredTargetId(tgt.id);
                  magicLensAudio.playLensHum();
                }
              }}
              onMouseLeave={() => setHoveredTargetId(null)}
              className={`absolute z-10 transition-all transform duration-300 p-2 rounded-2xl flex items-center justify-center cursor-context-menu ${
                isFound
                  ? 'scale-110 filter-none opacity-100 animate-in zoom-in-75'
                  : 'filter grayscale opacity-60 hover:opacity-90 hover:scale-105'
              }`}
              style={{
                left: tgt.x,
                top: tgt.y,
              }}
            >
              {/* Efek Kilau Bintang Lembut jika belum ditemukan */}
              {!isFound && (
                <span className="absolute -top-1 -right-1 text-amber-400 text-xs animate-ping duration-1000 pointer-events-none">
                  ✨
                </span>
              )}

              {/* Ikon Objek */}
              <div className="text-3xl sm:text-4xl filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                {isFound ? tgt.coloredIcon : tgt.icon}
              </div>

              {/* Badge Centang Hijau saat berhasil dibuka */}
              {isFound && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border border-black rounded-full flex items-center justify-center text-[10px] font-black text-black">
                  ✓
                </span>
              )}
            </div>
          );
        })}

        {/* ── LINGKARAN KACA PEMBESAR AJAIB (LENS FOLLOWER) ───────── */}
        <div
          className="absolute rounded-full border-3 border-black shadow-[0_0_20px_rgba(0,0,0,0.25)] pointer-events-none z-30 transition-transform duration-75 flex items-center justify-center"
          style={{
            width: `${lensRadius * 2}px`,
            height: `${lensRadius * 2}px`,
            left: `${mousePos.x - lensRadius}px`,
            top: `${mousePos.y - lensRadius}px`,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(224,242,254,0.15) 70%, rgba(56,189,248,0.25) 100%)',
            backdropFilter: 'contrast(115%) brightness(105%)',
          }}
        >
          {/* Garis Crosshair Halus di Tengah Lensa */}
          <div className="w-2 h-2 border border-black/40 rounded-full"></div>
          <span className="absolute bottom-1 right-2 text-[10px] font-mono font-bold text-black/50">
            🔍
          </span>
        </div>

        {/* ── FLOATING HINT BUBBLE JIKA SALAH KLIK KIRI ───────────── */}
        {hintMessage && (
          <div
            className="absolute z-40 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl px-2.5 py-1 text-xs font-mono font-black text-black pointer-events-none animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${hintMessage.x}px`,
              top: `${hintMessage.y}px`,
            }}
          >
            {hintMessage.text}
          </div>
        )}

        {/* ── CUSTOM IN-GAME CONTEXT MENU (HASIL KLIK KANAN) ──────── */}
        {activeMenu && (
          <div
            className="absolute z-50 bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 min-w-[160px]"
            style={{
              left: `${activeMenu.x}px`,
              top: `${activeMenu.y}px`,
            }}
          >
            <div className="px-2 py-1 border-b border-black/20 text-[10px] font-mono font-black uppercase text-slate-600 flex items-center gap-1">
              <span>{activeMenu.target.icon}</span>
              <span className="truncate">{activeMenu.target.name}</span>
            </div>

            {(activeMenu.options || activeMenu.target.options).map((opt, i) => (
              <button
                key={`opt-${i}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOption(opt.action);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg border-2 border-black text-xs font-mono font-bold hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{opt.label}</span>
                <ChevronRight className="w-3 h-3 text-black" />
              </button>
            ))}
          </div>
        )}
      </>
    )}

        {/* ─── OVERLAY 2: COUNTDOWN ANTAR BABAK ─────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3 my-auto animate-in zoom-in-90 duration-200">
              <div className="inline-block bg-amber-300 border-2 border-black px-2.5 py-1 rounded text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                {currentScene.title}
              </div>
              <p className="text-xs font-mono font-bold text-slate-700 leading-snug">
                {currentScene.tip}
              </p>
              <div className="py-1">
                <span className="inline-block font-heading font-black text-5xl sm:text-6xl text-amber-500 animate-ping duration-1000">
                  {sceneCountdown > 0 ? sceneCountdown : 'CARI!'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Arahkan kaca pembesar dan siapkan jari tengahmu!
              </p>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 3: SCENE CLEAR SCREEN ──────────────────────── */}
        {gameState === 'scene_clear' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3.5 my-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-black text-lg sm:text-xl text-black">
                  Babak {currentScene.scene} Berhasil Terungkap! 🎉
                </h3>
                <p className="text-xs font-mono text-slate-600">
                  Penglihatan dan refleks klik kanan kamu sangat tajam.
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Skor Terkumpul</span>
                  <span className="font-black text-sm sm:text-base text-black">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Misteri Terbuka</span>
                  <span className="font-black text-sm sm:text-base text-emerald-600">
                    {foundInCurrentScene.length} Objek
                  </span>
                </div>
              </div>

              <button
                onClick={() => startSceneCountdown(currentSceneIdx + 1)}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>MASUK KE BABAK {currentScene.scene + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 4: PAUSED SCREEN ───────────────────────────── */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-xs w-full text-center space-y-3 my-auto">
              <div className="w-11 h-11 bg-amber-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Pause className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-heading font-black text-lg text-black">Ekspedisi Dijeda</h3>
              <p className="text-xs font-mono text-slate-600">
                Istirahat sejenak sambil melemaskan jemari tanganmu.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                >
                  Lanjut Mencari
                </button>
                <button
                  onClick={startGame}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-black font-mono font-bold text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  Ulangi dari Awal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 5: VICTORY & RAPOR DETEKTIF MATA ELANG ─────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 my-auto animate-in zoom-in-95 duration-200">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
                🦅
              </div>

              <div className="space-y-1">
                <div className="inline-block bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                  Ekspedisi Sukses!
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Rapor Detektif Mata Elang
                </h2>
                <p className="text-[11px] sm:text-xs font-mono text-slate-600">
                  Selamat! Kamu telah menaklukkan seluruh 5 pemandangan misteri dengan teknik klik kanan yang tangkas.
                </p>
              </div>

              {/* Bintang Penghargaan */}
              <div className="bg-amber-50 border-2 border-black rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 sm:w-7 sm:h-7 ${
                        star <= getStarRating()
                          ? 'text-amber-400 fill-amber-400 filter drop-shadow-[2px_2px_0px_#000]'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-heading font-black text-xs sm:text-sm text-black">
                  {getStarRating() === 3
                    ? '🌟 LUAR BIASA! MASTER DETEKTIF ELANG'
                    : getStarRating() === 2
                    ? '✨ HEBAT! PENGAMATAN SANGAT CERMAT'
                    : '👍 BAGUS! TERUS LATIH KLIK KANAN'}
                </span>
              </div>

              {/* Rincian Statistik */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left font-mono">
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Total Skor</span>
                  <span className="font-black text-base sm:text-lg text-black">{score}</span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Misteri Terbuka</span>
                  <span className="font-black text-base sm:text-lg text-emerald-600">
                    {totalFoundCount}
                  </span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Total Klik Kanan</span>
                  <span className="font-black text-base sm:text-lg text-black">
                    {rightClickCount}x
                  </span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Kombo Maks</span>
                  <span className="font-black text-base sm:text-lg text-rose-600">x{maxCombo}</span>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={startGame}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>MAIN LAGI & TINGKATKAN SKOR</span>
                </button>
                <Link
                  href="/siswa"
                  className="w-full py-2 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>KEMBALI KE BERANDA SISWA</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── FOOTER BAR TIPS PEDAGOGI ────────────────────────────── */}
      <div className="relative z-10 bg-[#FFFDF5] border-t-2 border-black px-3.5 sm:px-4 py-2 flex flex-wrap items-center justify-between text-xs font-mono text-slate-700 gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0 max-w-xl">
          <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
          <span className="font-bold shrink-0">Tips Detektif:</span>
          <span className="truncate">{currentScene.tip}</span>
        </div>
        <div className="text-[11px] text-slate-600 hidden md:block shrink-0">
          Total 5 Babak • Durasi ~4.5 Menit • Melatih Klik Kanan
        </div>
      </div>
    </div>
  );
}
