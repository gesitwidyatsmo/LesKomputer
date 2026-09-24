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
  Key,
  ShieldAlert,
  HelpCircle,
  Gem,
} from 'lucide-react';
import { treasureAudio } from '@/lib/treasureAudio';

// ─── KONFIGURASI 5 RUANG EKSPEDISI (TOTAL ~4.5 - 5 MENIT) ─────────
const ROOMS_CONFIG = [
  {
    room: 1,
    title: 'Ruang 1: Gudang Harta Kayu Klasik',
    subtitle: 'Fokus: Mengetuk klik kiri 2x beruntun dengan tenang',
    duration: 45, // detik
    targetCount: 10,
    items: [
      { id: 'c1', type: 'wood_chest', name: 'Peti Kayu Tua', points: 100 },
      { id: 'c2', type: 'wood_chest', name: 'Peti Kayu Rimba', points: 100 },
      { id: 'c3', type: 'wood_chest', name: 'Peti Kayu Pelaut', points: 100 },
      { id: 'c4', type: 'wood_chest', name: 'Peti Kayu Kuno', points: 100 },
      { id: 'c5', type: 'wood_chest', name: 'Peti Kayu Ukir', points: 100 },
      { id: 'c6', type: 'wood_chest', name: 'Peti Kayu Hutan', points: 100 },
      { id: 'c7', type: 'wood_chest', name: 'Peti Kayu Emas', points: 100 },
      { id: 'c8', type: 'wood_chest', name: 'Peti Kayu Antik', points: 100 },
      { id: 'c9', type: 'wood_chest', name: 'Peti Kayu Mahoni', points: 100 },
      { id: 'c10', type: 'wood_chest', name: 'Peti Kayu Jati', points: 100 },
    ],
    tip: 'Ketuk tombol kiri mouse 2x cepat (Klik-Klik!) tepat di atas peti kayu untuk membukanya!',
  },
  {
    room: 2,
    title: 'Ruang 2: Lorong Pintu Rahasia & Peti Perak',
    subtitle: 'Fokus: Ritme ketukan konsisten (Klik-Klik! tanpa jeda lama)',
    duration: 50,
    targetCount: 12,
    items: [
      { id: 'c1', type: 'silver_chest', name: 'Peti Perak Murni', points: 140 },
      { id: 'c2', type: 'secret_door', name: 'Pintu Batu Rahasia', points: 150 },
      { id: 'c3', type: 'silver_chest', name: 'Peti Perak Bulan', points: 140 },
      { id: 'c4', type: 'secret_door', name: 'Pintu Kayu Kastil', points: 150 },
      { id: 'c5', type: 'silver_chest', name: 'Peti Perak Bintang', points: 140 },
      { id: 'c6', type: 'secret_door', name: 'Pintu Gua Kristal', points: 150 },
      { id: 'c7', type: 'silver_chest', name: 'Peti Perak Kerajaan', points: 140 },
      { id: 'c8', type: 'secret_door', name: 'Pintu Menara Kuno', points: 150 },
      { id: 'c9', type: 'silver_chest', name: 'Peti Perak Pelindung', points: 140 },
      { id: 'c10', type: 'secret_door', name: 'Pintu Rahasia Labirin', points: 150 },
      { id: 'c11', type: 'silver_chest', name: 'Peti Perak Mahkota', points: 140 },
      { id: 'c12', type: 'secret_door', name: 'Pintu Gerbang Kuno', points: 150 },
    ],
    tip: 'Jaga ritmemu! Jika hanya klik 1x, gembok hanya bergoyang tapi tidak akan terbuka.',
  },
  {
    room: 3,
    title: 'Ruang 3: Gua Mutiara Mengapung',
    subtitle: 'Fokus: Kestabilan kursor (tangan tidak bergeser saat double click)',
    duration: 60,
    targetCount: 14,
    items: [
      { id: 'c1', type: 'floating_pearl', name: 'Cangkang Mutiara Pink', points: 180, floating: true },
      { id: 'c2', type: 'coral_chest', name: 'Peti Karang Samudra', points: 160, floating: true },
      { id: 'c3', type: 'floating_pearl', name: 'Cangkang Mutiara Biru', points: 180, floating: true },
      { id: 'c4', type: 'coral_chest', name: 'Peti Harta Karang', points: 160, floating: true },
      { id: 'c5', type: 'floating_pearl', name: 'Cangkang Mutiara Emas', points: 180, floating: true },
      { id: 'c6', type: 'coral_chest', name: 'Peti Bintang Laut', points: 160, floating: true },
      { id: 'c7', type: 'floating_pearl', name: 'Cangkang Mutiara Ungu', points: 180, floating: true },
      { id: 'c8', type: 'coral_chest', name: 'Peti Terumbu Karang', points: 160, floating: true },
      { id: 'c9', type: 'floating_pearl', name: 'Cangkang Mutiara Hijau', points: 180, floating: true },
      { id: 'c10', type: 'coral_chest', name: 'Peti Kapal Karam', points: 160, floating: true },
      { id: 'c11', type: 'floating_pearl', name: 'Cangkang Mutiara Putih', points: 180, floating: true },
      { id: 'c12', type: 'coral_chest', name: 'Peti Harta Atlantik', points: 160, floating: true },
      { id: 'c13', type: 'floating_pearl', name: 'Cangkang Mutiara Hitam', points: 180, floating: true },
      { id: 'c14', type: 'coral_chest', name: 'Peti Karang Mutiara', points: 160, floating: true },
    ],
    tip: 'Objek sedikit terapung! Pastikan mouse tenang dan tidak bergeser jauh saat menekan 2x.',
  },
  {
    room: 4,
    title: 'Ruang 4: Brankas Berlian & Peti Bom Tengkorak',
    subtitle: 'Fokus: Akurasi selektif (Anti-Spam Click)',
    duration: 60,
    targetCount: 15,
    items: [
      { id: 'c1', type: 'diamond_safe', name: 'Brankas Berlian Safir', points: 260 },
      { id: 'c2', type: 'bomb_chest', name: 'Peti Bom Tengkorak', points: -100, isTrap: true },
      { id: 'c3', type: 'diamond_safe', name: 'Brankas Berlian Zamrud', points: 260 },
      { id: 'c4', type: 'gold_chest', name: 'Peti Emas Murni', points: 200 },
      { id: 'c5', type: 'bomb_chest', name: 'Peti Bom Jebakan', points: -100, isTrap: true },
      { id: 'c6', type: 'diamond_safe', name: 'Brankas Berlian Ruby', points: 260 },
      { id: 'c7', type: 'gold_chest', name: 'Peti Emas Kuno', points: 200 },
      { id: 'c8', type: 'bomb_chest', name: 'Peti Bom Bahaya', points: -100, isTrap: true },
      { id: 'c9', type: 'diamond_safe', name: 'Brankas Berlian Topaz', points: 260 },
      { id: 'c10', type: 'gold_chest', name: 'Peti Emas Mahkota', points: 200 },
      { id: 'c11', type: 'bomb_chest', name: 'Peti Bom Rahasia', points: -100, isTrap: true },
      { id: 'c12', type: 'diamond_safe', name: 'Brankas Berlian Amethyst', points: 260 },
      { id: 'c13', type: 'gold_chest', name: 'Peti Emas Batangan', points: 200 },
      { id: 'c14', type: 'diamond_safe', name: 'Brankas Berlian Kristal', points: 260 },
      { id: 'c15', type: 'gold_chest', name: 'Peti Emas Khazanah', points: 200 },
    ],
    tip: '⭐ Double-click Brankas Berlian & Peti Emas! ⚠️ JANGAN double-click Peti Bom Tengkorak!',
  },
  {
    room: 5,
    title: 'Ruang 5: Ruang Mahkota Raja (Master Vault)',
    subtitle: 'Fokus: Puncak ketahanan & membuka Brankas Raja 3 Gembok',
    duration: 65,
    targetCount: 13,
    items: [
      { id: 'c1', type: 'gold_chest', name: 'Peti Emas Utama', points: 220 },
      { id: 'c2', type: 'diamond_safe', name: 'Brankas Kristal Raja', points: 280 },
      { id: 'c3', type: 'master_vault', name: 'Brankas Raksasa Raja', points: 500, locksNeeded: 3 },
      { id: 'c4', type: 'diamond_safe', name: 'Brankas Berlian Megah', points: 280 },
      { id: 'c5', type: 'gold_chest', name: 'Peti Emas Kerajaan', points: 220 },
      { id: 'c6', type: 'bomb_chest', name: 'Peti Bom Penjaga', points: -100, isTrap: true },
      { id: 'c7', type: 'diamond_safe', name: 'Brankas Mahkota Intan', points: 280 },
      { id: 'c8', type: 'gold_chest', name: 'Peti Emas Pangeran', points: 220 },
      { id: 'c9', type: 'diamond_safe', name: 'Brankas Pusaka Raja', points: 280 },
      { id: 'c10', type: 'bomb_chest', name: 'Peti Bom Jebakan Istana', points: -100, isTrap: true },
      { id: 'c11', type: 'gold_chest', name: 'Peti Permata Agung', points: 220 },
      { id: 'c12', type: 'diamond_safe', name: 'Brankas Harta Terakhir', points: 280 },
      { id: 'c13', type: 'gold_chest', name: 'Peti Kejayaan Kerajaan', points: 220 },
    ],
    tip: 'Brankas Raksasa Raja butuh 3x Double-Click untuk membuka 3 gembok emasnya! Buka mahkotanya!',
  },
];

export default function TreasureHuntGame() {
  // Game states
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'room_clear' | 'paused' | 'gameover'
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [roomCountdown, setRoomCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(ROOMS_CONFIG[0].duration);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [doubleClickSuccessCount, setDoubleClickSuccessCount] = useState(0);
  const [timingThreshold, setTimingThreshold] = useState(520); // toleransi ms: 650 (Santai), 520 (Normal), 380 (Tantangan)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Status peti di ruang aktif
  const [roomItems, setRoomItems] = useState([]);
  // ID peti yang sedang bergetar (wobble pada klik ke-1)
  const [wobblingId, setWobblingId] = useState(null);
  // Feedback teks mengambang sementara di atas peti
  const [feedbackBubbles, setFeedbackBubbles] = useState({});

  // Tracker klik terakhir per item: { [itemId]: timestamp }
  const lastClickTimeRef = useRef({});
  const containerRef = useRef(null);

  const currentRoom = ROOMS_CONFIG[currentRoomIdx] || ROOMS_CONFIG[0];

  // Rasio keberhasilan double-click
  const totalAttempts = Math.max(1, Math.floor(totalClicks / 2));
  const accuracy = Math.min(100, Math.round((doubleClickSuccessCount / totalAttempts) * 100));

  // Toggle Sound
  const handleToggleSound = () => {
    const newState = treasureAudio.toggleSound();
    setSoundEnabled(newState);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
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

  // ─── INISIALISASI ITEM RUANGAN ──────────────────────────────────
  const setupRoomItems = useCallback((roomIdx) => {
    const config = ROOMS_CONFIG[roomIdx] || ROOMS_CONFIG[0];
    const initialItems = config.items.map((item) => ({
      ...item,
      isOpen: false,
      locksLeft: item.locksNeeded || 1,
      isShaking: false,
    }));
    setRoomItems(initialItems);
    lastClickTimeRef.current = {};
    setFeedbackBubbles({});
  }, []);

  // ─── MULAI GAME DARI AWAL ───────────────────────────────────────
  const startGame = () => {
    treasureAudio.init();
    setCurrentRoomIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setOpenedCount(0);
    setTotalClicks(0);
    setDoubleClickSuccessCount(0);
    startRoomCountdown(0);
  };

  const startRoomCountdown = (roomIdx) => {
    setCurrentRoomIdx(roomIdx);
    setupRoomItems(roomIdx);
    setTimeLeft(ROOMS_CONFIG[roomIdx].duration);
    setRoomCountdown(3);
    setGameState('countdown');
    treasureAudio.playRoomFanfare();
  };

  // ─── HITUNG MUNDUR ANTAR RUANG (3, 2, 1, GO!) ──────────────────
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const interval = setInterval(() => {
      setRoomCountdown((prev) => {
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

  // ─── EVALUASI WAKTU HABIS / RUANG SELESAI ────────────────────────
  const handleRoomComplete = useCallback(() => {
    if (currentRoomIdx < ROOMS_CONFIG.length - 1) {
      setGameState('room_clear');
      treasureAudio.playRoomFanfare();
    } else {
      setGameState('gameover');
      treasureAudio.playGrandVictory();
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [currentRoomIdx]);

  // ─── TIMER RUANG BERJALAN SETIAP DETIK ──────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleRoomComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, handleRoomComplete]);

  // ─── CEK APAKAH SELURUH PETI NON-TRAP TELAH TERBUKA ─────────────
  useEffect(() => {
    if (gameState !== 'playing' || roomItems.length === 0) return;

    // Filter target non-trap yang wajib dibuka
    const targetsToOpen = roomItems.filter((i) => !i.isTrap);
    const allOpened = targetsToOpen.every((i) => i.isOpen);

    if (allOpened) {
      const timer = setTimeout(() => {
        handleRoomComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [roomItems, gameState, handleRoomComplete]);

  const showFeedback = useCallback((itemId, text, className) => {
    setFeedbackBubbles((prev) => ({
      ...prev,
      [itemId]: { text, className },
    }));

    setTimeout(() => {
      setFeedbackBubbles((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }, 1500);
  }, []);

  // ─── CUSTOM DOUBLE-CLICK ENGINE DETEKTOR ─────────────────────────
  const handleItemClick = useCallback(
    (itemId, e) => {
      if (gameState !== 'playing') return;

      const now = e?.timeStamp || 0;
      const lastTime = lastClickTimeRef.current[itemId] || 0;
      const timeDiff = now - lastTime;

      setTotalClicks((prev) => prev + 1);

      const targetItem = roomItems.find((i) => i.id === itemId);
      if (!targetItem || targetItem.isOpen) return;

      // ─── CEK: APAKAH MEMENUHI SYARAT DOUBLE-CLICK? ───
      if (timeDiff > 0 && timeDiff <= timingThreshold) {
        // ══════════════════════════════════════════════════════════
        // DOUBLE CLICK BERHASIL! (Ketukan ke-2 tepat waktu)
        // ══════════════════════════════════════════════════════════
        lastClickTimeRef.current[itemId] = 0; // reset
        setDoubleClickSuccessCount((prev) => prev + 1);

        // Cek apakah item adalah peti jebakan (Bomb)
        if (targetItem.isTrap) {
          treasureAudio.playTrapExplode();
          setCombo(0);
          setScore((prev) => Math.max(0, prev + targetItem.points)); // points bernilai minus (-100)
          showFeedback(itemId, '💥 JEBAKAN MELETUS! -100', 'bg-rose-500 text-white');

          setRoomItems((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, isOpen: true, isTrapExploded: true } : item
            )
          );
          return;
        }

        // Cek apakah item butuh beberapa gembok (Master Vault butuh 3x double-click)
        if (targetItem.locksLeft > 1) {
          treasureAudio.playLockTick(4 - targetItem.locksLeft);
          const remaining = targetItem.locksLeft - 1;
          showFeedback(itemId, `🔓 KUNCI TERBUKA! SISA ${remaining}x LAGI!`, 'bg-amber-300 text-black');

          setRoomItems((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, locksLeft: remaining } : item
            )
          );
          return;
        }

        // ─── Peti Terbuka Penuh! ───
        const isDiamond = targetItem.type === 'diamond_safe' || targetItem.type === 'master_vault';
        treasureAudio.playChestOpen(isDiamond);

        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setOpenedCount((prev) => prev + 1);

        const comboBonus = Math.min(newCombo * 15, 120);
        const pointsWon = targetItem.points + comboBonus;
        setScore((prev) => prev + pointsWon);

        showFeedback(
          itemId,
          `✨ TERBUKA! +${pointsWon}${newCombo > 1 ? ` (x${newCombo})` : ''}`,
          isDiamond ? 'bg-amber-400 text-black font-black' : 'bg-emerald-400 text-black'
        );

        setRoomItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, isOpen: true, locksLeft: 0 } : item
          )
        );

        // Semburan partikel konfeti kecil
        confetti({
          particleCount: isDiamond ? 45 : 25,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        // ══════════════════════════════════════════════════════════
        // KLIK TUNGGAL (Single Click) -> Peti Bergoyang + Panduan
        // ══════════════════════════════════════════════════════════
        lastClickTimeRef.current[itemId] = now;
        treasureAudio.playClickWobble();

        // Animasi getar (wobble)
        setWobblingId(itemId);
        setTimeout(() => {
          setWobblingId((curr) => (curr === itemId ? null : curr));
        }, 350);

        // Teks panduan ramah anak
        showFeedback(itemId, '⚡ Klik 1x lagi cepat!', 'bg-yellow-100 text-slate-800 border border-black');
      }
    },
    [gameState, timingThreshold, combo, roomItems, showFeedback]
  );

  // ─── RATING BINTANG AKHIR ───────────────────────────────────────
  const getStarRating = () => {
    if (score >= 3800 && accuracy >= 70) return 3;
    if (score >= 2000 && accuracy >= 50) return 2;
    return 1;
  };

  return (
    <div
      ref={containerRef}
      className={`relative isolate bg-[#FFFDF5] border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-screen w-screen' : ''
      }`}
    >
      {/* ─── TOP HUD HEADER ──────────────────────────────────────── */}
      <div className="relative z-10 bg-[#FFFDF5] border-b-3 border-black p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 select-none">
        {/* Kolom Kiri: Indikator Ruang & Sisa Waktu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
            <span className="font-heading font-black text-xs sm:text-sm text-black">
              {gameState === 'idle' ? 'PERSIAPAN MISI' : `RUANG ${currentRoom.room} / ${ROOMS_CONFIG.length}`}
            </span>
            <span className="hidden xl:inline text-xs font-mono font-bold text-slate-700">
              ({gameState === 'idle' ? 'Latihan Refleks: Ketangkasan Double Click' : currentRoom.title.split(':')[1]})
            </span>
          </div>

          <div
            className={`border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 font-mono font-black text-xs sm:text-sm ${
              timeLeft <= 10 && gameState === 'playing' ? 'bg-rose-400 text-white animate-pulse' : 'bg-white text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{gameState === 'idle' ? '5 Ruang' : `${timeLeft} dtk`}</span>
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
            <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span className="font-bold hidden sm:inline">Peti:</span>
            <span className="font-black text-emerald-600 text-xs sm:text-sm">
              {openedCount}/{currentRoom.items.length}
            </span>
          </div>

          {combo > 1 && (
            <div className="bg-rose-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md flex items-center gap-1 font-black animate-bounce text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Pengaturan Tempo & Tombol Kontrol */}
        <div className="flex items-center gap-1.5">
          <select
            value={timingThreshold}
            onChange={(e) => setTimingThreshold(parseInt(e.target.value))}
            disabled={gameState === 'playing'}
            className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-1 rounded-md font-mono text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-50"
            title="Pilih toleransi tempo double-click"
          >
            <option value={650}>Tempo: Santai (650ms)</option>
            <option value={520}>Tempo: Normal (520ms)</option>
            <option value={380}>Tempo: Cepat (380ms)</option>
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

      {/* ─── ARENA PETI & PINTU HARTA KARUN ──────────────────────── */}
      <div className={`relative flex-1 p-4 sm:p-6 bg-gradient-to-b from-amber-50/60 via-stone-100 to-amber-100 flex items-center justify-center select-none overflow-hidden ${
        isFullscreen ? 'min-h-0 w-full h-full' : 'min-h-[480px] sm:min-h-[520px]'
      }`}>
        {gameState === 'idle' ? (
          /* ─── IN-ARENA WELCOME SCREEN (BUKAN POPUP MODAL) ─── */
          <div className="flex-1 w-full h-full flex flex-col justify-between items-center text-center py-4 sm:py-6 px-4 sm:px-6 relative z-10 my-auto max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Header Judul Game */}
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-300 border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_#000] uppercase text-black">
                <span>💎</span>
                <span>Game 2 • Fokus Motorik: Double Click (Klik Ganda)</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-black drop-shadow-[2px_2px_0px_#fff]">
                Detektif Harta Karun
              </h1>
              <p className="text-xs sm:text-sm text-slate-800 font-bold max-w-xl mx-auto leading-relaxed">
                Buka peti rahasia, brankas mutiara, dan pintu gua kuno menggunakan <strong>Double-Click (Klik 2x cepat)</strong>! Jelajahi <strong>5 Ruang Misteri (~4.5 Menit)</strong> untuk melatih tempo jarimu.
              </p>
            </div>

            {/* Panggung Tiga Kolom Edukasi */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-purple-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🖱️
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-purple-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    1. DOUBLE-CLICK
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Ketuk 2x Beruntun
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Ketuk tombol kiri mouse 2x cepat dan stabil tanpa jeda lama agar gembok terbuka.
                  </p>
                </div>
              </div>

              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-amber-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  📦
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-amber-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    2. GEMBOK TEBAL
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Peti Bertingkat
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Peti perak &amp; emas membutuhkan beberapa kali 2-klik berurutan untuk dipecahkan!
                  </p>
                </div>
              </div>

              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-rose-400 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  💣
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-rose-400 border border-black rounded-md text-[11px] font-mono font-black text-white shadow-[1px_1px_0px_#000]">
                    3. WASPADA JEBAKAN
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Hindari Peti Bom
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Jangan double-click peti bom bertanda tengkorak agar skor dan kombo kamu tetap aman.
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
                <span>MULAI EKSPEDISI HARTA KARUN</span>
              </button>
            </div>
          </div>
        ) : (
          /* Grid Peti Harta Karun */
          <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 z-10">
            {roomItems.map((item) => {
              const isWobble = wobblingId === item.id;
              const bubble = feedbackBubbles[item.id];

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleItemClick(item.id, e)}
                  className={`relative group rounded-xl p-3 sm:p-4 border-3 border-black text-center flex flex-col items-center justify-between transition-all select-none ${
                    item.isOpen
                      ? item.isTrapExploded
                        ? 'bg-slate-800 border-slate-900 opacity-60'
                        : 'bg-emerald-100/80 border-emerald-800 shadow-inner'
                      : isWobble
                      ? 'bg-amber-200 shadow-[2px_2px_0px_0px_#000] translate-x-1 animate-wiggle'
                      : 'bg-white hover:bg-amber-50 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                  } ${item.floating && !item.isOpen ? 'animate-bounce duration-1000' : ''}`}
                  style={{
                    animationDuration: item.floating ? '2.5s' : undefined,
                  }}
                >
                  {/* Bubble Feedback Cepat (⚡ KLIK 1X LAGI!) */}
                  {bubble && (
                    <div
                      className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[11px] font-mono font-black shadow-[2px_2px_0px_0px_#000] whitespace-nowrap z-20 animate-in fade-in zoom-in-95 duration-150 ${bubble.className}`}
                    >
                      {bubble.text}
                    </div>
                  )}

                  {/* Ikon Representasi Objek */}
                  <div className="text-3xl sm:text-4xl my-1 sm:my-2 transition-transform duration-200 group-hover:scale-110 select-none">
                    {item.isOpen ? (
                      item.isTrapExploded ? (
                        '💥'
                      ) : item.type === 'diamond_safe' ? (
                        '💎'
                      ) : item.type === 'floating_pearl' ? (
                        '🦪'
                      ) : item.type === 'secret_door' ? (
                        '🚪'
                      ) : item.type === 'crown_safe' ? (
                        '👑'
                      ) : (
                        '🪙'
                      )
                    ) : item.type === 'wood_chest' ? (
                      '📦'
                    ) : item.type === 'silver_chest' ? (
                      '🥈'
                    ) : item.type === 'secret_door' ? (
                      '🚪'
                    ) : item.type === 'floating_pearl' ? (
                      '🫧'
                    ) : item.type === 'coral_chest' ? (
                      '🪸'
                    ) : item.type === 'diamond_safe' ? (
                      '💠'
                    ) : item.type === 'gold_chest' ? (
                      '💰'
                    ) : item.type === 'bomb_chest' ? (
                      '💣'
                    ) : item.type === 'crown_safe' ? (
                      '🏛️'
                    ) : (
                      '🎁'
                    )}
                  </div>

                  {/* Status Keterangan Peti */}
                  <div className="w-full space-y-1 mt-1">
                    <p className="font-heading font-black text-xs text-black truncate">
                      {item.name}
                    </p>

                    <div className="flex items-center justify-center gap-1">
                      {item.isOpen ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-200 px-1.5 py-0.5 rounded">
                          {item.isTrapExploded ? 'Jebakan Meletus' : 'Terbuka!'}
                        </span>
                      ) : item.locksLeft > 1 ? (
                        <span className="text-[10px] font-mono font-bold bg-amber-300 text-black px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                          Sisa {item.locksLeft}x 2-Klik
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Double-Click
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── OVERLAY 2: COUNTDOWN ANTAR RUANG ───────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3 my-auto animate-in zoom-in-90 duration-200">
              <div className="inline-block bg-amber-300 border-2 border-black px-2.5 py-1 rounded text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                {currentRoom.title}
              </div>
              <p className="text-xs font-mono font-bold text-slate-700 leading-snug">
                {currentRoom.tip}
              </p>
              <div className="py-1">
                <span className="inline-block font-heading font-black text-5xl sm:text-6xl text-amber-500 animate-ping duration-1000">
                  {roomCountdown > 0 ? roomCountdown : 'GO!'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Siapkan jarimu untuk ketukan ganda (*Klik-Klik!*)!
              </p>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 3: ROOM CLEAR SCREEN ───────────────────────── */}
        {gameState === 'room_clear' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3.5 my-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-black text-lg sm:text-xl text-black">
                  Ruang {currentRoom.room} Berhasil Ditembus! 🎉
                </h3>
                <p className="text-xs font-mono text-slate-600">
                  Kerja hebat! Ritme double-click kamu sangat mantap.
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Skor Terkumpul</span>
                  <span className="font-black text-sm sm:text-base text-black">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Peti Terbuka</span>
                  <span className="font-black text-sm sm:text-base text-emerald-600">{openedCount} Peti</span>
                </div>
              </div>

              <button
                onClick={() => startRoomCountdown(currentRoomIdx + 1)}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>MASUK KE RUANG {currentRoom.room + 1}</span>
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
              <h3 className="font-heading font-black text-lg text-black">Game Dijeda</h3>
              <p className="text-xs font-mono text-slate-600">
                Istirahat sejenak sambil melemaskan jemari telunjuk.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                >
                  Lanjut Main
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

        {/* ─── OVERLAY 5: VICTORY & RAPOR DETEKTIF ─────────────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-30 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 my-auto animate-in zoom-in-95 duration-200">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
                👑
              </div>

              <div className="space-y-1">
                <div className="inline-block bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                  Ekspedisi Selesai!
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Rapor Detektif Harta Karun
                </h2>
                <p className="text-[11px] sm:text-xs font-mono text-slate-600">
                  Selamat! Kamu telah menaklukkan seluruh 5 ruang rahasia dengan teknik double-click yang lincah.
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
                    ? '🌟 LUAR BIASA! MASTER DOUBLE-CLICK'
                    : getStarRating() === 2
                    ? '✨ HEBAT! TEMPO SANGAT STABIL'
                    : '👍 BAGUS! TERUS LATIH KECEPATAN JARI'}
                </span>
              </div>

              {/* Rincian Statistik */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left font-mono">
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Total Skor</span>
                  <span className="font-black text-base sm:text-lg text-black">{score}</span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Peti Dibuka</span>
                  <span className="font-black text-base sm:text-lg text-emerald-600">{openedCount}</span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Sukses 2-Klik</span>
                  <span className="font-black text-base sm:text-lg text-black">{doubleClickSuccessCount}</span>
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
          <span className="font-bold shrink-0">Tips Detektif:</span>
          <span className="truncate">{currentRoom.tip}</span>
        </div>
        <div className="text-[11px] text-slate-600 hidden md:block shrink-0">
          Total 5 Ruang • Durasi ~4.5 Menit • Melatih Double-Click
        </div>
      </div>
    </div>
  );
}
