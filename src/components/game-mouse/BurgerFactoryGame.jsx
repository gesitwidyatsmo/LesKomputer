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
  Layers,
  Utensils,
  Check,
  AlertCircle
} from 'lucide-react';
import { burgerAudio } from '@/lib/burgerAudio';

// ─── KAMUS MASTER BAHAN BURGER ──────────────────────────────────────
const INGREDIENTS = {
  bun_bottom: {
    id: 'bun_bottom',
    name: 'Roti Bawah',
    shortName: 'Roti Bwh',
    icon: '🍞',
    color: 'bg-amber-200 border-amber-800 text-amber-950',
    layerHeight: 'h-6 sm:h-7',
    rounded: 'rounded-b-2xl rounded-t-sm',
    desc: 'Alas empuk burger',
  },
  patty: {
    id: 'patty',
    name: 'Daging Panggang',
    shortName: 'Daging',
    icon: '🥩',
    color: 'bg-amber-900 border-amber-950 text-amber-100',
    layerHeight: 'h-5 sm:h-6',
    rounded: 'rounded-lg',
    desc: 'Daging sapi lezat',
  },
  cheese: {
    id: 'cheese',
    name: 'Keju Cheddar',
    shortName: 'Keju',
    icon: '🧀',
    color: 'bg-amber-400 border-amber-600 text-amber-950',
    layerHeight: 'h-3.5 sm:h-4',
    rounded: 'rounded-sm',
    desc: 'Keju leleh gurih',
  },
  lettuce: {
    id: 'lettuce',
    name: 'Selada Segar',
    shortName: 'Selada',
    icon: '🥬',
    color: 'bg-emerald-500 border-emerald-700 text-emerald-950',
    layerHeight: 'h-4 sm:h-5',
    rounded: 'rounded-md',
    desc: 'Sayur renyah',
  },
  tomato: {
    id: 'tomato',
    name: 'Tomat Segar',
    shortName: 'Tomat',
    icon: '🍅',
    color: 'bg-rose-500 border-rose-700 text-white',
    layerHeight: 'h-4 sm:h-5',
    rounded: 'rounded-lg',
    desc: 'Irisan tomat berair',
  },
  onion: {
    id: 'onion',
    name: 'Bawang Karamel',
    shortName: 'Bawang',
    icon: '🧅',
    color: 'bg-purple-300 border-purple-500 text-purple-950',
    layerHeight: 'h-3.5 sm:h-4',
    rounded: 'rounded-sm',
    desc: 'Aroma harum manis',
  },
  egg: {
    id: 'egg',
    name: 'Telur Mata Sapi',
    shortName: 'Telur',
    icon: '🍳',
    color: 'bg-yellow-100 border-amber-400 text-amber-900',
    layerHeight: 'h-4 sm:h-5',
    rounded: 'rounded-lg',
    desc: 'Telur gurih bernutrisi',
  },
  sauce: {
    id: 'sauce',
    name: 'Saus Spesial',
    shortName: 'Saus',
    icon: '🥫',
    color: 'bg-red-600 border-red-800 text-white',
    layerHeight: 'h-3 sm:h-3.5',
    rounded: 'rounded-full',
    desc: 'Saus asam manis nikmat',
  },
  bun_top: {
    id: 'bun_top',
    name: 'Roti Atas Wijen',
    shortName: 'Roti Atas',
    icon: '🥯',
    color: 'bg-amber-300 border-amber-800 text-amber-950',
    layerHeight: 'h-7 sm:h-8',
    rounded: 'rounded-t-3xl rounded-b-sm',
    desc: 'Penutup wijen renyah',
  },
};

// ─── KONFIGURASI 5 SHIFT KOKI (~4.5 - 5 MENIT) ─────────────────────
const SHIFTS_CONFIG = [
  {
    shift: 1,
    title: 'Shift 1: Burger Junior Klasik',
    subtitle: 'Fokus: Menekan klik kiri, menggeser sejajar, lalu melepas',
    duration: 45, // detik
    targetCount: 4,
    availableIngredients: ['bun_bottom', 'patty', 'sauce', 'bun_top'],
    recipes: [
      {
        name: 'Burger Klasik Solo',
        customer: '👦 Siswa Budi',
        layers: ['bun_bottom', 'patty', 'sauce', 'bun_top'],
      },
      {
        name: 'Burger Sapi Sederhana',
        customer: '👧 Siswi Siti',
        layers: ['bun_bottom', 'patty', 'sauce', 'bun_top'],
      },
      {
        name: 'Burger Bekal Pagi',
        customer: '🧒 Adik Doni',
        layers: ['bun_bottom', 'patty', 'sauce', 'bun_top'],
      },
      {
        name: 'Burger Mini Ceria',
        customer: '👦 Kawan Rian',
        layers: ['bun_bottom', 'patty', 'sauce', 'bun_top'],
      },
    ],
    tip: 'Klik dan tahan mouse pada bahan di nampan, lalu seret dan lepaskan tepat di atas piring!',
  },
  {
    shift: 2,
    title: 'Shift 2: Sayuran Segar & Keju Lumer',
    subtitle: 'Fokus: Ketelitian mengamati urutan resep dari bawah ke atas',
    duration: 50,
    targetCount: 5,
    availableIngredients: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'sauce', 'bun_top'],
    recipes: [
      {
        name: 'Cheeseburger Hijau',
        customer: '👩 Ibu Guru Linda',
        layers: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'bun_top'],
      },
      {
        name: 'Burger Sehat Tomat',
        customer: '👨 Pak Guru Joko',
        layers: ['bun_bottom', 'patty', 'lettuce', 'tomato', 'bun_top'],
      },
      {
        name: 'Burger Komplet Segar',
        customer: '👧 Siswi Nia',
        layers: ['bun_bottom', 'patty', 'cheese', 'tomato', 'sauce', 'bun_top'],
      },
      {
        name: 'Double Keju Selada',
        customer: '👦 Siswa Fajar',
        layers: ['bun_bottom', 'patty', 'cheese', 'cheese', 'lettuce', 'bun_top'],
      },
      {
        name: 'Burger Sayur Ceria',
        customer: '🧒 Adik Sari',
        layers: ['bun_bottom', 'lettuce', 'patty', 'tomato', 'bun_top'],
      },
    ],
    tip: 'Perhatikan urutan tiket pesanan! Letakkan keju dan selada sebelum menutup roti atas.',
  },
  {
    shift: 3,
    title: 'Shift 3: Double Beef & Karamel Saus',
    subtitle: 'Fokus: Presisi meletakkan bahan pada burger yang semakin tinggi',
    duration: 60,
    targetCount: 5,
    availableIngredients: [
      'bun_bottom',
      'patty',
      'cheese',
      'lettuce',
      'tomato',
      'onion',
      'sauce',
      'bun_top',
    ],
    recipes: [
      {
        name: 'Double Beef Karnivor',
        customer: '🏋️ Kak Hendra',
        layers: ['bun_bottom', 'patty', 'cheese', 'patty', 'sauce', 'bun_top'],
      },
      {
        name: 'Burger Bawang Karamel',
        customer: '👩‍🍳 Koki Rahmat',
        layers: ['bun_bottom', 'patty', 'onion', 'cheese', 'tomato', 'bun_top'],
      },
      {
        name: 'Deluxe Tower Duo',
        customer: '🧑‍💻 Kak Aris',
        layers: ['bun_bottom', 'lettuce', 'patty', 'cheese', 'patty', 'bun_top'],
      },
      {
        name: 'Double Keju Bombay',
        customer: '👧 Siswi Maya',
        layers: ['bun_bottom', 'patty', 'onion', 'sauce', 'patty', 'cheese', 'bun_top'],
      },
      {
        name: 'Spesial Dapur Mantap',
        customer: '👨‍🏫 Pak Guru Dani',
        layers: ['bun_bottom', 'patty', 'cheese', 'onion', 'tomato', 'sauce', 'bun_top'],
      },
    ],
    tip: 'Tumpukan burger semakin tinggi! Jaga kestabilan tangan saat menyeret bahan.',
  },
  {
    shift: 4,
    title: 'Shift 4: Restoran Jam Sibuk (Rush Hour)',
    subtitle: 'Fokus: Kecepatan dan kelenturan tangan dengan resep kaya topping',
    duration: 60,
    targetCount: 5,
    availableIngredients: [
      'bun_bottom',
      'patty',
      'cheese',
      'lettuce',
      'tomato',
      'onion',
      'egg',
      'sauce',
      'bun_top',
    ],
    recipes: [
      {
        name: 'Burger Sarapan Telur',
        customer: '👮 Pak Polisi Bagus',
        layers: ['bun_bottom', 'patty', 'egg', 'cheese', 'sauce', 'bun_top'],
      },
      {
        name: 'Royal Egg Supreme',
        customer: '👩‍⚕️ Dokter Ayu',
        layers: ['bun_bottom', 'lettuce', 'patty', 'egg', 'tomato', 'bun_top'],
      },
      {
        name: 'Double Sapi Mata Sapi',
        customer: '👨‍🚒 Petugas Damkar',
        layers: ['bun_bottom', 'patty', 'cheese', 'egg', 'patty', 'bun_top'],
      },
      {
        name: 'Full Loaded Resto',
        customer: '🧑‍💼 Manajer Resto',
        layers: ['bun_bottom', 'patty', 'onion', 'lettuce', 'egg', 'tomato', 'bun_top'],
      },
      {
        name: 'King Burger Istimewa',
        customer: '👑 Tamu Kehormatan',
        layers: ['bun_bottom', 'patty', 'cheese', 'egg', 'onion', 'sauce', 'bun_top'],
      },
    ],
    tip: 'Pesanan datang cepat! Hindari salah meletakkan bahan agar kombo poin tidak putus.',
  },
  {
    shift: 5,
    title: 'Shift 5: Monster Tower Burger (Grand Finale)',
    subtitle: 'Fokus: Puncak koordinasi motorik merakit menara burger raksasa',
    duration: 65,
    targetCount: 4,
    availableIngredients: [
      'bun_bottom',
      'patty',
      'cheese',
      'lettuce',
      'tomato',
      'onion',
      'egg',
      'sauce',
      'bun_top',
    ],
    recipes: [
      {
        name: '🦖 Mega Monster Tower',
        customer: '🏆 Walikota Cilik',
        layers: [
          'bun_bottom',
          'lettuce',
          'patty',
          'cheese',
          'tomato',
          'patty',
          'egg',
          'sauce',
          'bun_top',
        ],
      },
      {
        name: '🌋 Vulkano Double Layer',
        customer: '🌟 Bintang Tamu VIP',
        layers: [
          'bun_bottom',
          'patty',
          'onion',
          'cheese',
          'patty',
          'egg',
          'tomato',
          'lettuce',
          'bun_top',
        ],
      },
      {
        name: '🏰 Benteng Raja Burger',
        customer: '👑 Sang Raja Kuliner',
        layers: [
          'bun_bottom',
          'patty',
          'cheese',
          'egg',
          'lettuce',
          'patty',
          'onion',
          'sauce',
          'bun_top',
        ],
      },
      {
        name: '⭐ Masterpiece Chef Agung',
        customer: '👨‍🍳 Kepala Koki Dunia',
        layers: [
          'bun_bottom',
          'lettuce',
          'tomato',
          'patty',
          'cheese',
          'onion',
          'egg',
          'patty',
          'sauce',
          'bun_top',
        ],
      },
    ],
    tip: 'Buktikan kehebatan jemarimu! Susun burger raksasa hingga setinggi menara!',
  },
];

export default function BurgerFactoryGame() {
  // ─── STATE INTI GAME ──────────────────────────────────────────────
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'shift_clear' | 'paused' | 'gameover'
  const [currentShiftIdx, setCurrentShiftIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [shiftCountdown, setShiftCountdown] = useState(3);

  // Statistik & Skor
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalBurgersCompleted, setTotalBurgersCompleted] = useState(0);
  const [completedInCurrentShift, setCompletedInCurrentShift] = useState(0);
  const [correctLayersCount, setCorrectLayersCount] = useState(0);
  const [wrongLayersCount, setWrongLayersCount] = useState(0);

  // Status Pesanan Aktif
  const [currentOrderIdx, setCurrentOrderIdx] = useState(0);
  const [currentStack, setCurrentStack] = useState([]); // Array ID bahan yang sudah terpasang di piring

  // Status Drag and Drop
  const [draggedItem, setDraggedItem] = useState(null); // ID bahan yang sedang di-drag
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 }); // Posisi kursor saat drag
  const [isPlateHovered, setIsPlateHovered] = useState(false); // Highlight magnetik piring

  // Feedback Visual
  const [plateFeedback, setPlateFeedback] = useState(null); // { text, type: 'success' | 'wrong' }
  const [magnetTolerance, setMagnetTolerance] = useState(45); // Radius toleransi magnetik (px)

  // Pengaturan Tampilan & Audio
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const plateRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const isDraggingRef = useRef(false);

  const currentShift = SHIFTS_CONFIG[currentShiftIdx];
  const activeRecipe = currentShift.recipes[currentOrderIdx % currentShift.recipes.length];

  // ─── AUDIO TOGGLE ────────────────────────────────────────────────
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    burgerAudio.enabled = nextState;
  };

  // ─── HITUNG BINTANG RAPOR ─────────────────────────────────────────
  const getStarRating = () => {
    const accuracy =
      correctLayersCount + wrongLayersCount > 0
        ? Math.round((correctLayersCount / (correctLayersCount + wrongLayersCount)) * 100)
        : 100;

    if (totalBurgersCompleted >= 20 && accuracy >= 80) return 3;
    if (totalBurgersCompleted >= 12 && accuracy >= 65) return 2;
    return 1;
  };

  // ─── MULAI SHIFT BARU DENGAN COUNTDOWN ────────────────────────────
  const startShiftCountdown = useCallback((shiftIdx) => {
    setCurrentShiftIdx(shiftIdx);
    const targetShift = SHIFTS_CONFIG[shiftIdx];
    setTimeLeft(targetShift.duration);
    setShiftCountdown(3);
    setCompletedInCurrentShift(0);
    setCurrentOrderIdx(0);
    setCurrentStack([]);
    setGameState('countdown');
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalBurgersCompleted(0);
    setCompletedInCurrentShift(0);
    setCorrectLayersCount(0);
    setWrongLayersCount(0);
    startShiftCountdown(0);
  };

  // ─── EFEK COUNTDOWN SHIFT ─────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const interval = setInterval(() => {
      setShiftCountdown((prev) => {
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

  // Handle jika waktu shift habis
  const handleShiftTimeout = useCallback(() => {
    if (currentShiftIdx + 1 < SHIFTS_CONFIG.length) {
      setGameState('shift_clear');
      burgerAudio.playShiftFanfare();
    } else {
      setGameState('gameover');
      burgerAudio.playGrandVictory();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  }, [currentShiftIdx]);

  // ─── EFEK TIMER GAMEPLAY BERJALAN ─────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Waktu habis pada shift ini: Lanjut ke evaluasi shift
          handleShiftTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, handleShiftTimeout]);

  // ─── LOGIKA CEK PENEMPATAN BAHAN KE PIRING ─────────────────────────
  const handleDropIngredient = (ingredientId) => {
    const nextExpectedLayer = activeRecipe.layers[currentStack.length];

    if (ingredientId === nextExpectedLayer) {
      // ✅ BENAR: Bahan sesuai urutan resep
      const nextStack = [...currentStack, ingredientId];
      setCurrentStack(nextStack);
      setCorrectLayersCount((prev) => prev + 1);

      // Suara & Combo
      burgerAudio.playDrop(nextStack.length);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Poin: 50 poin per layer + bonus combo
      const layerPoints = 50 + Math.min(newCombo * 10, 50);
      setScore((prev) => prev + layerPoints);

      // Feedback visual pop
      setPlateFeedback({
        text: `+${layerPoints} ${INGREDIENTS[ingredientId].name}!`,
        type: 'success',
      });
      setTimeout(() => setPlateFeedback(null), 800);

      // Cek apakah burger sudah selesai seluruh lapisannya
      if (nextStack.length === activeRecipe.layers.length) {
        handleBurgerCompleted();
      }
    } else {
      // ⚠️ SALAH URUTAN
      setWrongLayersCount((prev) => prev + 1);
      setCombo(0);
      burgerAudio.playWrongIngredient();

      setPlateFeedback({
        text: `Urutan salah! Butuh: ${INGREDIENTS[nextExpectedLayer]?.name}`,
        type: 'wrong',
      });
      setTimeout(() => setPlateFeedback(null), 1200);
    }
  };

  // Handler saat sebuah burger selesai dirakit penuh
  const handleBurgerCompleted = () => {
    burgerAudio.playOrderComplete();
    const burgerBonus = 200 + (currentShiftIdx + 1) * 50;
    setScore((prev) => prev + burgerBonus);
    setTotalBurgersCompleted((prev) => prev + 1);

    const nextCompletedInShift = completedInCurrentShift + 1;
    setCompletedInCurrentShift(nextCompletedInShift);

    // Mini confetti di piring
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.55 },
    });

    // Cek apakah target shift sudah tercapai
    if (nextCompletedInShift >= currentShift.targetCount) {
      setTimeout(() => {
        if (currentShiftIdx + 1 < SHIFTS_CONFIG.length) {
          setGameState('shift_clear');
          burgerAudio.playShiftFanfare();
        } else {
          setGameState('gameover');
          burgerAudio.playGrandVictory();
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        }
      }, 500);
    } else {
      // Masuk ke tiket pesanan berikutnya
      setTimeout(() => {
        setCurrentStack([]);
        setCurrentOrderIdx((prev) => prev + 1);
      }, 450);
    }
  };

  // ─── CUSTOM POINTER DRAG & DROP ENGINE ────────────────────────────
  const handlePointerDown = (ingredientId, e) => {
    if (gameState !== 'playing') return;

    // Aktifkan Audio Context saat interaksi pertama
    burgerAudio.init();
    burgerAudio.playGrab();

    isDraggingRef.current = true;
    setDraggedItem(ingredientId);
    setDragPos({ x: e.clientX, y: e.clientY });

    // Tangkap pointer agar pergerakan kursor mulus
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !draggedItem) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    setDragPos({ x: currentX, y: currentY });

    // Cek apakah kursor berada di dekat atau di atas piring (Zona Magnetik)
    if (plateRef.current) {
      const rect = plateRef.current.getBoundingClientRect();
      const isInside =
        currentX >= rect.left - magnetTolerance &&
        currentX <= rect.right + magnetTolerance &&
        currentY >= rect.top - magnetTolerance &&
        currentY <= rect.bottom + magnetTolerance;

      setIsPlateHovered(isInside);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current || !draggedItem) return;

    isDraggingRef.current = false;
    const finalItem = draggedItem;
    const wasOverPlate = isPlateHovered;

    // Bersihkan state drag
    setDraggedItem(null);
    setIsPlateHovered(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore fallback
    }

    if (wasOverPlate) {
      handleDropIngredient(finalItem);
    } else {
      // Membal kembali jika dilepas di luar piring
      burgerAudio.playSpringBack();
    }
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

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#FFFDF5] border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* ─── TOP HUD HEADER ──────────────────────────────────────── */}
      <div className="relative z-10 bg-[#FFFDF5] border-b-3 border-black p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 select-none">
        {/* Kolom Kiri: Indikator Shift & Sisa Waktu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
            <span className="font-heading font-black text-xs sm:text-sm text-black">
              SHIFT {currentShift.shift} / {SHIFTS_CONFIG.length}
            </span>
            <span className="hidden xl:inline text-xs font-mono font-bold text-slate-700">
              ({currentShift.title.split(':')[1]})
            </span>
          </div>

          <div
            className={`border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 font-mono font-black text-xs sm:text-sm ${
              timeLeft <= 10 ? 'bg-rose-400 text-white animate-pulse' : 'bg-white text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{timeLeft} dtk</span>
          </div>
        </div>

        {/* Kolom Tengah: Skor & Statistik */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span className="font-bold">Skor:</span>
            <span className="font-black text-black text-xs sm:text-sm">{score}</span>
          </div>

          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span className="font-bold hidden sm:inline">Burger:</span>
            <span className="font-black text-emerald-600 text-xs sm:text-sm">
              {completedInCurrentShift}/{currentShift.targetCount}
            </span>
          </div>

          {combo > 1 && (
            <div className="bg-rose-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md flex items-center gap-1 font-black animate-bounce text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Toleransi Magnet & Tombol Kontrol */}
        <div className="flex items-center gap-1.5">
          <select
            value={magnetTolerance}
            onChange={(e) => setMagnetTolerance(parseInt(e.target.value))}
            disabled={gameState === 'playing'}
            className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-1 rounded-md font-mono text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-50"
            title="Pilih radius magnetik piring"
          >
            <option value={60}>Magnet: Luas (Ramah Anak)</option>
            <option value={45}>Magnet: Normal (Standar)</option>
            <option value={25}>Magnet: Presisi (Ketat)</option>
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

      {/* ─── ARENA DAPUR PABRIK BURGER ───────────────────────────── */}
      <div className="relative flex-1 p-3 sm:p-5 bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-amber-100/70 min-h-[480px] sm:min-h-[520px] flex flex-col justify-between select-none overflow-hidden">
        {/* BARIS ATAS: TIKET PESANAN & CHECKLIST RESEP */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-2.5 sm:p-3">
          {/* Info Pelanggan & Nama Burger */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-300 border-2 border-black rounded-lg flex items-center justify-center text-xl shrink-0 shadow-[1px_1px_0px_0px_#000]">
              🍔
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Pesanan #{currentOrderIdx + 1}:
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  {activeRecipe.customer}
                </span>
              </div>
              <h3 className="font-heading font-black text-sm sm:text-base text-black leading-tight">
                {activeRecipe.name}
              </h3>
            </div>
          </div>

          {/* Checklist Lapisan Resep (Dari Bawah ke Atas) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase hidden lg:inline mr-1">
              Urutan (Bawah ➔ Atas):
            </span>
            {activeRecipe.layers.map((layerId, idx) => {
              const isPlaced = idx < currentStack.length;
              const isCurrentTarget = idx === currentStack.length;
              const ing = INGREDIENTS[layerId];

              return (
                <div
                  key={`${layerId}-${idx}`}
                  className={`px-2 py-1 rounded-md border-2 font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 shrink-0 transition-all ${
                    isPlaced
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-800 line-through opacity-75'
                      : isCurrentTarget
                      ? 'bg-amber-300 border-black text-black shadow-[2px_2px_0px_0px_#000] scale-105 animate-pulse'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                >
                  <span className="text-slate-400 font-mono text-[9px] mr-0.5">#{idx + 1}</span>
                  <span>{ing.icon}</span>
                  <span className="hidden sm:inline">{ing.shortName}</span>
                  {isPlaced && <Check className="w-3 h-3 text-emerald-600" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* BARIS TENGAH: MEJA SAJI & PIRING TARGET (DROP ZONE) */}
        <div className="flex-1 flex flex-col items-center justify-center my-2 sm:my-3 relative">
          {/* Bubble Feedback Penempatan Bahan */}
          {plateFeedback && (
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-xs font-mono font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] z-20 animate-in fade-in zoom-in-95 duration-150 ${
                plateFeedback.type === 'success'
                  ? 'bg-emerald-300 text-black'
                  : 'bg-rose-400 text-white'
              }`}
            >
              {plateFeedback.text}
            </div>
          )}

          {/* Wadah Tumpukan Burger & Piring Saji */}
          <div
            ref={plateRef}
            className={`relative flex flex-col items-center justify-end p-4 rounded-3xl transition-all duration-150 ${
              isPlateHovered
                ? 'bg-emerald-100/70 border-3 border-dashed border-emerald-600 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'border-3 border-transparent'
            }`}
            style={{ width: '280px', minHeight: '200px' }}
          >
            {/* Tumpukan Lapisan Burger (Bahan Pertama Roti Bawah Berada Paling Bawah Menempel Piring) */}
            <div className="w-full flex flex-col items-center justify-end z-10 space-y-1 mb-1">
              {currentStack.length === 0 ? (
                <div className="py-4 text-center">
                  <span className="text-xs font-mono font-bold text-slate-400 block animate-bounce">
                    ⬇️ Seret & Lepas Bahan ke Sini!
                  </span>
                </div>
              ) : (
                currentStack
                  .slice()
                  .reverse()
                  .map((layerId, revIdx) => {
                    const actualIdx = currentStack.length - 1 - revIdx;
                    const ing = INGREDIENTS[layerId];
                    return (
                      <div
                        key={`stacked-${actualIdx}-${layerId}`}
                        className={`w-44 sm:w-48 ${ing.layerHeight} ${ing.color} ${ing.rounded} border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1 font-mono text-[10px] font-black tracking-wide transition-all transform animate-in slide-in-from-top-2 duration-150`}
                      >
                        <span>{ing.icon}</span>
                        <span className="truncate">{ing.name}</span>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Piring Keramik Neo-Brutal */}
            <div className="w-56 sm:w-64 h-5 sm:h-6 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-full flex items-center justify-center">
              <div className="w-48 sm:w-56 h-2 bg-slate-100 border border-black/30 rounded-full"></div>
            </div>

            {/* Label Petunjuk Piring */}
            <span className="text-[10px] font-mono font-bold text-slate-500 mt-1 uppercase">
              Piring Saji Burger
            </span>
          </div>
        </div>

        {/* BARIS BAWAH: NAMPAN BAHAN-BAHAN DAPUR (DRAG SOURCES) */}
        <div className="w-full max-w-4xl mx-auto bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center justify-between border-b border-black/20 pb-1.5 mb-2 text-xs font-mono">
            <span className="font-black text-black flex items-center gap-1.5 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Nampan Bahan (Klik & Tahan, lalu Seret):</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
              {currentShift.availableIngredients.length} Bahan Siap Pakai
            </span>
          </div>

          {/* Grid Bahan yang Bisa Ditarik */}
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-9 gap-2">
            {currentShift.availableIngredients.map((ingId) => {
              const ing = INGREDIENTS[ingId];
              const isNextNeeded = activeRecipe.layers[currentStack.length] === ingId;

              return (
                <div
                  key={ingId}
                  onPointerDown={(e) => handlePointerDown(ingId, e)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className={`relative p-2 rounded-xl border-2 border-black flex flex-col items-center justify-between text-center cursor-grab active:cursor-grabbing transition-all select-none touch-none ${
                    isNextNeeded
                      ? 'bg-amber-100 hover:bg-amber-200 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5'
                      : 'bg-slate-50 hover:bg-slate-100 shadow-[2px_2px_0px_0px_#000]'
                  }`}
                  title={`Seret ${ing.name} ke piring`}
                >
                  {/* Indikator Rekomendasi Langkah Selanjutnya */}
                  {isNextNeeded && (
                    <span className="absolute -top-2 -right-1 w-4 h-4 bg-emerald-400 border border-black rounded-full flex items-center justify-center text-[10px] font-bold text-black animate-ping duration-1000">
                      ★
                    </span>
                  )}

                  <div className="text-2xl sm:text-3xl my-0.5">{ing.icon}</div>
                  <span className="font-heading font-black text-[10px] sm:text-[11px] text-black leading-tight truncate w-full">
                    {ing.shortName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── FLOATING GHOST BADGE SAAT DRAGGING ─────────────────── */}
        {draggedItem && (
          <div
            className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 scale-110 opacity-95 transition-transform duration-75"
            style={{
              left: `${dragPos.x}px`,
              top: `${dragPos.y}px`,
            }}
          >
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-2xl">{INGREDIENTS[draggedItem]?.icon}</span>
              <span className="font-heading font-black text-xs text-black">
                {INGREDIENTS[draggedItem]?.name}
              </span>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 1: IDLE WELCOME SCREEN ─────────────────────── */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 sm:space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
                🍔
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <div className="inline-block bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                  Game 3 • Fokus: Drag-and-Drop (Seret & Lepas)
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Pabrik Burger Cilik
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                  Rakit pesanan burger lezat dengan <strong>menahan klik kiri, menggeser bahan ke piring, lalu melepasnya</strong>! Selesaikan <strong>5 Shift Koki (~4.5 - 5 menit)</strong> untuk melatih koordinasi jemarimu.
                </p>
              </div>

              {/* Panduan Singkat Aturan Main */}
              <div className="bg-[#FFFDF5] border-2 border-black rounded-xl p-2.5 sm:p-3 text-left space-y-1.5 text-xs font-mono">
                <div className="font-black text-black border-b border-black pb-1 flex items-center gap-1.5 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Aturan Koki Pabrik:</span>
                </div>
                <ul className="space-y-1 text-[10px] sm:text-[11px] text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-sm">🖱️</span>
                    <span><strong>Tahan & Geser:</strong> Klik kiri tahan pada bahan, lalu seret ke piring.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">📋</span>
                    <span><strong>Ikuti Tiket:</strong> Pasang lapisan burger berurutan dari bawah ke atas.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">🧲</span>
                    <span><strong>Zona Magnetik:</strong> Lepaskan di dekat piring, bahan otomatis menempel rapi!</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className="w-full py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>MULAI MERAKIT BURGER</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 2: COUNTDOWN ANTAR SHIFT ───────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3 my-auto animate-in zoom-in-90 duration-200">
              <div className="inline-block bg-amber-300 border-2 border-black px-2.5 py-1 rounded text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                {currentShift.title}
              </div>
              <p className="text-xs font-mono font-bold text-slate-700 leading-snug">
                {currentShift.tip}
              </p>
              <div className="py-1">
                <span className="inline-block font-heading font-black text-5xl sm:text-6xl text-amber-500 animate-ping duration-1000">
                  {shiftCountdown > 0 ? shiftCountdown : 'MASAK!'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Siapkan tanganmu untuk menarik dan melepas bahan!
              </p>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 3: SHIFT CLEAR SCREEN ──────────────────────── */}
        {gameState === 'shift_clear' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3.5 my-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-black text-lg sm:text-xl text-black">
                  Shift {currentShift.shift} Berhasil Dituntaskan! 🎉
                </h3>
                <p className="text-xs font-mono text-slate-600">
                  Semua pelanggan kenyang dan senang dengan burgermu!
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Skor Koki</span>
                  <span className="font-black text-sm sm:text-base text-black">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Burger Tersaji</span>
                  <span className="font-black text-sm sm:text-base text-emerald-600">
                    {completedInCurrentShift} Burger
                  </span>
                </div>
              </div>

              <button
                onClick={() => startShiftCountdown(currentShiftIdx + 1)}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>MASUK KE SHIFT {currentShift.shift + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 4: PAUSED SCREEN ───────────────────────────── */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-xs w-full text-center space-y-3 my-auto">
              <div className="w-11 h-11 bg-amber-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Pause className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-heading font-black text-lg text-black">Dapur Dijeda</h3>
              <p className="text-xs font-mono text-slate-600">
                Istirahat sejenak sambil melemaskan jari telunjukmu.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                >
                  Lanjut Masak
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

        {/* ─── OVERLAY 5: VICTORY & RAPOR KOKI ─────────────────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-30 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 my-auto animate-in zoom-in-95 duration-200">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
                👨‍🍳
              </div>

              <div className="space-y-1">
                <div className="inline-block bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                  Pelatihan Selesai!
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Rapor Koki Burger Cilik
                </h2>
                <p className="text-[11px] sm:text-xs font-mono text-slate-600">
                  Selamat! Kamu telah menyelesaikan seluruh 5 shift dapur dengan teknik seret-lepas yang lincah.
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
                    ? '🌟 LUAR BIASA! MASTER CHEF BURGER'
                    : getStarRating() === 2
                    ? '✨ HEBAT! TANGAN SANGAT TANGKAS'
                    : '👍 BAGUS! TERUS LATIH SERET-LEPAS'}
                </span>
              </div>

              {/* Rincian Statistik */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left font-mono">
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Total Skor</span>
                  <span className="font-black text-base sm:text-lg text-black">{score}</span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Burger Selesai</span>
                  <span className="font-black text-base sm:text-lg text-emerald-600">
                    {totalBurgersCompleted}
                  </span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Akurasi Lapisan</span>
                  <span className="font-black text-base sm:text-lg text-black">
                    {correctLayersCount + wrongLayersCount > 0
                      ? Math.round(
                          (correctLayersCount / (correctLayersCount + wrongLayersCount)) * 100
                        )
                      : 100}
                    %
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
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold shrink-0">Tips Koki:</span>
          <span className="truncate">{currentShift.tip}</span>
        </div>
        <div className="text-[11px] text-slate-600 hidden md:block shrink-0">
          Total 5 Shift • Durasi ~4.5 Menit • Melatih Drag-and-Drop
        </div>
      </div>
    </div>
  );
}
