'use client';

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
  Zap,
  CheckCircle2,
  AlertTriangle,
  Award,
  Star,
  Info,
  Heart,
  ChevronRight,
  Flame,
  LogOut,
  Copy,
  ClipboardPaste,
  MousePointer,
  Check,
} from 'lucide-react';
import { cloneAudio } from '@/lib/cloneAudio';

// ─── KONFIGURASI 5 BABAK MISI (DURASI ~4.5 - 5 MENIT) ──────────────────
const MISSIONS_CONFIG = [
  {
    mission: 1,
    title: 'Babak 1: Danau Bebek Kuning',
    subtitle: 'Blok Induk Bebek, tekan Ctrl + C, lalu tekan Ctrl + V berkali-kali untuk memenuhi danau!',
    parentAnimal: {
      name: 'Induk Bebek',
      icon: '🦆',
      childIcon: '🐥',
      childName: 'Anak Bebek',
      bgTheme: 'from-cyan-900 via-sky-950 to-blue-950',
      arenaBg: 'bg-cyan-950/80',
      badgeColor: 'bg-amber-400 text-black',
      sceneName: 'Danau Air Jernih 🌊',
    },
    targetClones: 15,
    duration: 50,
    description: 'Penuhi danau dengan 15 anak bebek lucu yang berenang riang!',
  },
  {
    mission: 2,
    title: 'Babak 2: Kebun Kelinci Wortel',
    subtitle: 'Blok Kelinci Putih, salin dengan Ctrl + C, lalu tempel dengan Ctrl + V sebanyak 20 kali!',
    parentAnimal: {
      name: 'Kelinci Putih',
      icon: '🐇',
      childIcon: '🐰',
      childName: 'Kelinci Kecil',
      bgTheme: 'from-emerald-950 via-teal-950 to-green-950',
      arenaBg: 'bg-emerald-950/80',
      badgeColor: 'bg-emerald-400 text-black',
      sceneName: 'Padang Rumput Wortel 🥕',
    },
    targetClones: 20,
    duration: 55,
    description: 'Gandakan 20 kelinci untuk memanen seluruh wortel di kebun!',
  },
  {
    mission: 3,
    title: 'Babak 3: Pabrik Perakitan Robot',
    subtitle: 'Salin cetak biru robot (Ctrl + C) dan gandakan (Ctrl + V) menjadi 25 pasukan mekanik!',
    parentAnimal: {
      name: 'Robot Induk',
      icon: '🤖',
      childIcon: '🦾',
      childName: 'Mini Bot',
      bgTheme: 'from-slate-900 via-zinc-950 to-neutral-950',
      arenaBg: 'bg-zinc-950/80',
      badgeColor: 'bg-cyan-400 text-black',
      sceneName: 'Ban Berjalan Pabrik ⚙️',
    },
    targetClones: 25,
    duration: 65,
    description: 'Ciptakan 25 robot pembantu untuk mengoperasikan pabrik otomatis!',
  },
  {
    mission: 4,
    title: 'Babak 4: Pulau Salju Penguin Kutub',
    subtitle: 'Tantangan kecepatan! Blok Induk Penguin, salin dan tempelkan 30 anak penguin es!',
    parentAnimal: {
      name: 'Induk Penguin',
      icon: '🐧',
      childIcon: '🐧',
      childName: 'Anak Penguin',
      bgTheme: 'from-sky-950 via-indigo-950 to-slate-950',
      arenaBg: 'bg-sky-950/80',
      badgeColor: 'bg-sky-300 text-black',
      sceneName: 'Gunung Es Salju ❄️',
    },
    targetClones: 30,
    duration: 75,
    description: 'Penuhi pulau es dengan 30 penguin lucu sebelum matahari terbenam!',
  },
  {
    mission: 5,
    title: 'Babak 5: Parade Akbar Galaksi Luar Angkasa',
    subtitle: 'Klimaks Grand Finale! Gandakan 36 makhluk bintang ajaib untuk menerangi galaksi!',
    parentAnimal: {
      name: 'Unicorn Nebula',
      icon: '🦄',
      childIcon: '🐱',
      childName: 'Kucing Bintang',
      bgTheme: 'from-purple-950 via-fuchsia-950 to-indigo-950',
      arenaBg: 'bg-purple-950/80',
      badgeColor: 'bg-yellow-400 text-black',
      sceneName: 'Panggung Antariksa Bintang ✨',
    },
    targetClones: 36,
    duration: 95,
    description: 'Penuhi seluruh kosmos dengan 36 klon bintang dalam parade akbar kelulusan!',
  },
];

export default function MesinPenggandaGame() {
  // Status Permainan: 'idle' | 'countdown' | 'playing' | 'wave_clear' | 'paused' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Status Babak & Nilai
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [missionCountdown, setMissionCountdown] = useState(3);
  const [totalClonesCreated, setTotalClonesCreated] = useState(0);
  const [gameOverReason, setGameOverReason] = useState(null);

  // Status Alur Kloning: 'select' (Blok objek) -> 'copy' (Ctrl+C) -> 'paste' (Ctrl+V)
  const [cloneStep, setCloneStep] = useState('select');
  const [isObjectSelected, setIsObjectSelected] = useState(false);
  const [clipboardData, setClipboardData] = useState(null); // Data yang ada di memory clipboard
  const [clonesList, setClonesList] = useState([]); // Daftar klon yang telah ditempelkan di layar

  // Status Kontrol Tombol Virtual & Keyboard Fisik
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [virtualCtrlLocked, setVirtualCtrlLocked] = useState(false); // Mode toggle Ctrl untuk tablet/Chromebook
  const [isScanningCopy, setIsScanningCopy] = useState(false); // Efek laser pemindai saat Ctrl+C
  const [warningFeedback, setWarningFeedback] = useState(null);
  const [shakeError, setShakeError] = useState(false);

  const containerRef = useRef(null);
  const currentMission = MISSIONS_CONFIG[currentMissionIdx] || MISSIONS_CONFIG[0];

  // Inisialisasi Babak
  const initMission = useCallback((missionIdx) => {
    const cfg = MISSIONS_CONFIG[missionIdx];
    setCurrentMissionIdx(missionIdx);
    setTimeLeft(cfg.duration);
    setCloneStep('select');
    setIsObjectSelected(false);
    setClipboardData(null);
    setClonesList([]);
    setWarningFeedback(null);
    setGameOverReason(null);
    cloneAudio.playWaveStart();
  }, []);

  // Mulai Permainan dari Awal
  const handleStartGame = useCallback(() => {
    cloneAudio.init();
    cloneAudio.playKeyClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalClonesCreated(0);
    setCurrentMissionIdx(0);
    setMissionCountdown(3);
    setGameOverReason(null);
    setWarningFeedback(null);
    setGameState('countdown');
  }, []);

  // Selesai & Keluar Layar Penuh (Sesuai Permintaan)
  const handleFinishGame = useCallback(() => {
    cloneAudio.playKeyClick();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
    setGameState('idle');
    setCloneStep('select');
    setIsObjectSelected(false);
    setClipboardData(null);
    setClonesList([]);
    setShakeError(false);
    setWarningFeedback(null);
  }, []);

  // Lanjut ke Babak Berikutnya
  const handleNextMission = useCallback(() => {
    cloneAudio.playKeyClick();
    const nextIdx = currentMissionIdx + 1;
    if (nextIdx < MISSIONS_CONFIG.length) {
      initMission(nextIdx);
      setMissionCountdown(3);
      setGameState('countdown');
    } else {
      setGameState('victory');
    }
  }, [currentMissionIdx, initMission]);

  // Efek Countdown Sebelum Babak Dimulai
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (missionCountdown > 0) {
      const timer = setTimeout(() => {
        setMissionCountdown((prev) => prev - 1);
        cloneAudio.playKeyClick();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState('playing');
    }
  }, [gameState, missionCountdown]);

  // Timer Hitung Mundur Babak
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          cloneAudio.playShieldDamage();
          setGameOverReason('Waktu kloning habis sebelum layar terisi penuh!');
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Toggle Sound Mute
  const toggleSound = () => {
    const newState = cloneAudio.toggleSound();
    setSoundEnabled(newState);
  };

  // Toggle Virtual Ctrl (untuk Tablet / Layar Sentuh)
  const handleVirtualCtrlToggle = useCallback(() => {
    const nextState = !virtualCtrlLocked;
    setVirtualCtrlLocked(nextState);
    setIsCtrlPressed(nextState);
    cloneAudio.playKeyClick();
  }, [virtualCtrlLocked]);

  // Aksi 1: Memblok / Memilih Objek Induk (Bisa via klik / shortcut)
  const handleSelectObject = useCallback(() => {
    if (gameState !== 'playing') return;
    cloneAudio.playSelect();
    setIsObjectSelected(true);
    setCloneStep('copy');
    setWarningFeedback(null);
  }, [gameState]);

  // Aksi 2: Salin ke Clipboard (Ctrl + C)
  const handleCopyAction = useCallback(() => {
    if (gameState !== 'playing') return;

    if (!isObjectSelected) {
      cloneAudio.playWarning();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 300);
      setWarningFeedback('Klik atau blok hewan induk terlebih dahulu sebelum menyalin!');
      return;
    }

    // Pemindai laser beranimasi
    setIsScanningCopy(true);
    cloneAudio.playCopy();
    setClipboardData(currentMission.parentAnimal);
    setCloneStep('paste');
    setWarningFeedback(null);

    setTimeout(() => {
      setIsScanningCopy(false);
    }, 400);
  }, [gameState, isObjectSelected, currentMission]);

  // Aksi 3: Tempelkan Klon (Ctrl + V)
  const handlePasteAction = useCallback(() => {
    if (gameState !== 'playing') return;

    // Jika belum disalin
    if (!clipboardData) {
      cloneAudio.playWarning();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 300);
      if (!isObjectSelected) {
        setWarningFeedback('Blok hewan induk terlebih dahulu, lalu tekan Ctrl + C untuk menyalin!');
      } else {
        setWarningFeedback('Memori masih kosong! Tekan Ctrl + C terlebih dahulu untuk menyalin!');
      }
      return;
    }

    // Tambah 1 klon baru ke arena
    const currentCount = clonesList.length + 1;
    cloneAudio.playPaste(currentCount);

    const newClone = {
      id: `${currentMissionIdx}-${currentCount}-${Date.now()}`,
      icon: currentMission.parentAnimal.childIcon,
      name: currentMission.parentAnimal.childName,
      rotation: (Math.random() - 0.5) * 16, // sedikit rotasi alami
      scale: 0.9 + Math.random() * 0.25,
    };

    const nextList = [...clonesList, newClone];
    setClonesList(nextList);
    setTotalClonesCreated((prev) => prev + 1);

    // Hitung Skor & Combo
    const pointsEarned = 75 + combo * 10;
    setScore((prev) => prev + pointsEarned);
    setCombo((prev) => {
      const nextCombo = prev + 1;
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      return nextCombo;
    });

    // Cek apakah target jumlah klon tercapai
    if (nextList.length >= currentMission.targetClones) {
      cloneAudio.playBatchComplete();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#34d399'],
      });

      setTimeout(() => {
        if (currentMissionIdx >= MISSIONS_CONFIG.length - 1) {
          // Kemenangan Utama
          cloneAudio.playVictory();
          confetti({
            particleCount: 130,
            spread: 90,
            origin: { y: 0.5 },
          });
          setGameState('victory');
        } else {
          // Babak Selesai
          cloneAudio.playVictory();
          setGameState('wave_clear');
        }
      }, 700);
    }
  }, [
    gameState,
    clipboardData,
    isObjectSelected,
    clonesList,
    currentMission,
    currentMissionIdx,
    combo,
    maxCombo,
  ]);

  // Listener Tombol Fisik Keyboard (Ctrl+C, Ctrl+V, Space, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut Universal
      if (gameState === 'idle') {
        if (e.code === 'Space') {
          e.preventDefault();
          handleStartGame();
          return;
        }
      }

      if (gameState === 'wave_clear') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextMission();
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          handleFinishGame();
          return;
        }
      }

      if (gameState === 'victory') {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          handleFinishGame();
          return;
        }
      }

      if (gameState === 'gameover') {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleFinishGame();
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          initMission(currentMissionIdx);
          setMissionCountdown(3);
          setGameState('countdown');
          return;
        }
      }

      // Deteksi Tombol Ctrl / Meta (Mac)
      if (e.key === 'Control' || e.key === 'Meta') {
        setIsCtrlPressed(true);
        return;
      }

      if (gameState !== 'playing') return;

      const hasCtrl = e.ctrlKey || e.metaKey || isCtrlPressed || virtualCtrlLocked;

      // DETEKSI 1: Kombinasi Ctrl + C (Salin)
      if (hasCtrl && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleCopyAction();
        return;
      }

      // DETEKSI 2: Kombinasi Ctrl + V (Tempel)
      if (hasCtrl && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        handlePasteAction();
        return;
      }

      // DETEKSI 3: Shortcut Seleksi Cepat Ctrl + A (Blok Semua)
      if (hasCtrl && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleSelectObject();
        return;
      }

      // KASUS KESALAHAN: Menekan tombol C atau V tanpa menahan Ctrl
      if (!hasCtrl && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        cloneAudio.playWarning();
        setShakeError(true);
        setTimeout(() => setShakeError(false), 250);
        setWarningFeedback('Tahan tombol CTRL sambil menekan C untuk menyalin!');
        return;
      }

      if (!hasCtrl && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        cloneAudio.playWarning();
        setShakeError(true);
        setTimeout(() => setShakeError(false), 250);
        setWarningFeedback('Tahan tombol CTRL sambil menekan V untuk menempel!');
        return;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        if (!virtualCtrlLocked) {
          setIsCtrlPressed(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    gameState,
    isCtrlPressed,
    virtualCtrlLocked,
    handleCopyAction,
    handlePasteAction,
    handleSelectObject,
    handleStartGame,
    handleFinishGame,
    handleNextMission,
    initMission,
    currentMissionIdx,
  ]);

  const progressPercent = Math.min(
    100,
    Math.round((clonesList.length / currentMission.targetClones) * 100)
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl border-4 border-black overflow-hidden font-sans select-none bg-slate-950 text-white ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-0' : 'shadow-[8px_8px_0px_0px_#000]'
      }`}
    >
      {/* ── HEADER PANEL KONTROL & STATISTIK ─────────────────────────── */}
      <div role="banner" className="bg-slate-900/90 border-b-3 border-black/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono backdrop-blur-sm z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-black flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#000]">
            🤖
          </div>
          <div>
            <div className="font-heading font-black text-sm text-amber-300 flex items-center gap-1.5">
              <span>Mesin Pengganda</span>
              <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-500/50 px-1.5 py-0.2 rounded font-bold">
                Babak {currentMissionIdx + 1}/5
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              {currentMission.title}
            </div>
          </div>
        </div>

        {/* Skor, Klon & Waktu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-slate-800/90 border-2 border-black px-2.5 py-1 rounded-lg text-center shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[9px] text-slate-400 uppercase font-bold">Skor</div>
            <div className="font-black text-amber-300 text-sm">{score}</div>
          </div>

          <div className="bg-slate-800/90 border-2 border-black px-2.5 py-1 rounded-lg text-center shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[9px] text-slate-400 uppercase font-bold">Klon Ditempel</div>
            <div className="font-black text-emerald-400 text-sm">
              {clonesList.length}/{currentMission.targetClones}
            </div>
          </div>

          <div className="bg-slate-800/90 border-2 border-black px-2.5 py-1 rounded-lg text-center shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Clock className="w-2.5 h-2.5 text-amber-400" />
              <span>Waktu</span>
            </div>
            <div
              className={`font-black text-sm ${
                timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-300'
              }`}
            >
              {timeLeft}s
            </div>
          </div>

          {/* Tombol Suara & Layar Penuh */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── KANVAS ARENA UTAMA (PABRIK & HABITAT KLONING) ───────────── */}
      <div
        className={`relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-4 sm:p-5 overflow-hidden transition-all bg-gradient-to-b ${
          currentMission.parentAnimal.bgTheme
        } ${shakeError ? 'animate-shake' : ''}`}
      >
        {/* Dekorasi Grid / Gelembung Latar Belakang */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping" />
          <div className="absolute bottom-16 right-12 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full" />
        </div>

        {/* ── BARIS STATUS 3 LANGKAH KLONING & MEMORI CLIPBOARD ──────── */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2.5 relative z-10">
          {/* 3 Langkah Kloning Cepat */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Langkah 1: Blok */}
            <div
              className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono font-black text-[11px] flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] ${
                isObjectSelected
                  ? 'bg-emerald-400 text-black'
                  : cloneStep === 'select'
                  ? 'bg-amber-300 text-black animate-pulse ring-2 ring-yellow-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>1. BLOK</span>
              {isObjectSelected && <Check className="w-3.5 h-3.5" />}
            </div>

            {/* Langkah 2: Salin (Ctrl + C) */}
            <div
              className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono font-black text-[11px] flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] ${
                clipboardData
                  ? 'bg-emerald-400 text-black'
                  : cloneStep === 'copy'
                  ? 'bg-cyan-400 text-black animate-pulse ring-2 ring-cyan-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>2. CTRL + C</span>
              {clipboardData && <Check className="w-3.5 h-3.5" />}
            </div>

            {/* Langkah 3: Tempel (Ctrl + V) */}
            <div
              className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono font-black text-[11px] flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] ${
                cloneStep === 'paste'
                  ? 'bg-yellow-400 text-black animate-bounce ring-2 ring-yellow-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>3. CTRL + V (TEMPEL)</span>
            </div>
          </div>

          {/* Indikator Memori Clipboard Mesin */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-xl border-2 border-black font-mono font-bold text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] ${
                clipboardData
                  ? 'bg-emerald-400 text-black shadow-[0_0_15px_#34d399]'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>
                {clipboardData
                  ? `MEMORI: ${clipboardData.icon} ${clipboardData.name}`
                  : 'MEMORI CLIPBOARD KOSONG'}
              </span>
            </div>

            {/* Tombol Kunci Ctrl Virtual (Untuk Tablet / Touchscreen) */}
            <button
              onClick={handleVirtualCtrlToggle}
              className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono text-[11px] font-black cursor-pointer transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000] ${
                virtualCtrlLocked || isCtrlPressed
                  ? 'bg-yellow-400 text-black shadow-[0_0_12px_#facc15]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {virtualCtrlLocked ? '⎈ CTRL: AKTIF' : '⎈ Kunci Ctrl'}
            </button>
          </div>
        </div>

        {/* ── AREA UTAMA: POD INDUK & PADANG KLONING (ARENA PENUH) ──── */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-2 sm:my-3 z-10 space-y-3">
          {/* POD HEWAN INDUK UNTUK DIBLOK & DISALIN */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
            {/* Kartu Hewan Induk */}
            <div
              onClick={handleSelectObject}
              className={`relative p-3 sm:p-4 rounded-2xl border-4 border-black flex items-center gap-3 sm:gap-4 transition-all duration-300 cursor-pointer select-none ${
                isObjectSelected
                  ? 'bg-cyan-300 text-black shadow-[0_0_25px_#38bdf8] scale-105 ring-4 ring-cyan-400'
                  : 'bg-slate-900/90 hover:bg-slate-800/90 text-white shadow-[4px_4px_0px_0px_#000]'
              }`}
            >
              {/* Avatar Hewan Induk */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 border-3 border-black rounded-xl flex items-center justify-center text-4xl sm:text-5xl shadow-[3px_3px_0px_0px_#000] relative overflow-hidden">
                <span>{currentMission.parentAnimal.icon}</span>
                {/* Efek Laser Scanner saat Ctrl + C */}
                {isScanningCopy && (
                  <div className="absolute inset-x-0 h-1.5 bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-scan" />
                )}
              </div>

              <div className="text-left space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-base sm:text-lg">
                    {currentMission.parentAnimal.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-black ${
                      isObjectSelected
                        ? 'bg-emerald-400 text-black'
                        : 'bg-amber-300 text-black'
                    }`}
                  >
                    {isObjectSelected ? 'TERPILIH (DIBLOK)' : 'KLIK UNTUK BLOK'}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  {isObjectSelected
                    ? 'Sekarang tekan kombinasi CTRL + C untuk menyalin!'
                    : 'Klik kotak ini atau sentuh tombol "Blok Hewan"'}
                </div>
              </div>
            </div>

            {/* Tombol Cepat Aksi Visual (Touchscreen / Tablet Friendly) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectObject}
                className={`px-3 py-2 rounded-xl border-3 border-black font-heading font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                  isObjectSelected
                    ? 'bg-emerald-400 text-black'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-black'
                }`}
              >
                <MousePointer className="w-4 h-4" />
                <span>{isObjectSelected ? 'Sudah Diblok' : 'Blok Hewan'}</span>
              </button>

              <button
                onClick={handleCopyAction}
                className={`px-3 py-2 rounded-xl border-3 border-black font-heading font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                  clipboardData
                    ? 'bg-emerald-400 text-black'
                    : cloneStep === 'copy'
                    ? 'bg-cyan-400 text-black animate-pulse'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>Salin (Ctrl+C)</span>
              </button>

              <button
                onClick={handlePasteAction}
                className={`px-3 py-2 rounded-xl border-3 border-black font-heading font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                  cloneStep === 'paste'
                    ? 'bg-amber-400 text-black animate-bounce shadow-[0_0_15px_#facc15]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <ClipboardPaste className="w-4 h-4" />
                <span>Tempel (Ctrl+V)</span>
              </button>
            </div>
          </div>

          {/* BILAH KEMAJUAN KLONING (PROGRESS BAR) */}
          <div className="w-full max-w-2xl px-2 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 px-1">
              <span>{currentMission.parentAnimal.sceneName}</span>
              <span className="text-amber-300 font-black">
                {clonesList.length} / {currentMission.targetClones} Klon ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-4 bg-slate-900 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_#000] p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* WADAH ARENA KLON YANG MEMENUHI LAYAR (RESPONSIVE HABITAT) */}
          <div
            className={`w-full max-w-4xl min-h-[170px] sm:min-h-[210px] p-3 sm:p-4 rounded-2xl border-3 border-black ${currentMission.parentAnimal.arenaBg} backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] relative overflow-hidden flex flex-wrap items-center justify-center content-center gap-2 sm:gap-3 transition-all`}
          >
            {clonesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 opacity-75">
                <span className="text-4xl animate-bounce">
                  {currentMission.parentAnimal.icon}
                </span>
                <div className="text-xs sm:text-sm font-mono text-slate-300">
                  {cloneStep === 'select'
                    ? '1. Blok hewan induk di atas untuk memulai kloning!'
                    : cloneStep === 'copy'
                    ? '2. Tekan CTRL + C untuk menyalin hewan ke memori mesin!'
                    : '3. Tekan CTRL + V berkali-kali untuk memenuhi habitat ini!'}
                </div>
              </div>
            ) : (
              clonesList.map((clone, idx) => (
                <div
                  key={clone.id}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 border-2 border-black rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-[3px_3px_0px_0px_#000] animate-popIn transition-transform hover:scale-110 select-none"
                  style={{
                    transform: `rotate(${clone.rotation}deg) scale(${clone.scale})`,
                  }}
                  title={`${clone.name} #${idx + 1}`}
                >
                  <span>{clone.icon}</span>
                </div>
              ))
            )}
          </div>

          {/* Balon Peringatan Edukatif */}
          {warningFeedback && (
            <div className="bg-rose-500 text-white border-3 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_#000] font-mono text-xs max-w-lg animate-bounce flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-300" />
              <div className="text-left leading-snug">
                <strong>PANDUAN: </strong>
                {warningFeedback}
              </div>
            </div>
          )}
        </div>

        {/* ── KEYBOARD VIRTUAL INTERAKTIF: CTRL + C & CTRL + V ──────── */}
        <div className="w-full max-w-3xl mx-auto space-y-2 z-10 pt-2 border-t-2 border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>PANDUAN TOMBOL SHORTCUT:</span>
            <span className="text-amber-300 font-bold hidden sm:inline">
              Tahan tombol Ctrl (⎈) lalu tekan tombol C atau V
            </span>
          </div>

          {/* Tombol Virtual Interaktif */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {/* Tombol Ctrl Kiri */}
            <button
              onClick={handleVirtualCtrlToggle}
              className={`py-2.5 sm:py-3 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                isCtrlPressed || virtualCtrlLocked
                  ? 'bg-yellow-400 text-black shadow-[0_0_18px_#facc15]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>⎈ CTRL</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isCtrlPressed || virtualCtrlLocked ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              />
            </button>

            {/* Tombol A (Blok Semua) */}
            <button
              onClick={handleSelectObject}
              className={`py-2.5 sm:py-3 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                isObjectSelected
                  ? 'bg-emerald-400 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>A</span>
              <span className="text-[9px] font-mono opacity-60">BLOK</span>
            </button>

            {/* Tombol C (Salin) */}
            <button
              onClick={handleCopyAction}
              className={`py-2.5 sm:py-3 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                cloneStep === 'copy'
                  ? 'bg-cyan-400 text-black animate-pulse shadow-[0_0_15px_#38bdf8]'
                  : clipboardData
                  ? 'bg-emerald-400 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>C</span>
              <span className="text-[9px] font-mono opacity-60">SALIN</span>
            </button>

            {/* Tombol V (Tempel) */}
            <button
              onClick={handlePasteAction}
              className={`py-2.5 sm:py-3 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm flex flex-col items-center justify-center cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                cloneStep === 'paste'
                  ? 'bg-amber-400 text-black shadow-[0_0_20px_#facc15] font-black'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span>V</span>
              <span className="text-[9px] font-mono opacity-60">TEMPEL</span>
            </button>
          </div>
        </div>

        {/* ── LAYAR MULAI LANGSUNG DI KANVAS (BUKAN POPUP BLOCKING) ─── */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-5 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-400 border-4 border-black rounded-2xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_#000]">
              🤖
            </div>

            <div className="max-w-xl space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-300 text-black border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_0px_#000] uppercase">
                Petualangan 5 Babak Kloning (~4.5 - 5 Menit)
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-amber-300">
                Mesin Pengganda: Kuasai Ctrl + C & Ctrl + V
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
                Bantu peternakan dan pabrik robotika ajaib! Blok karakter hewan induk (seperti Bebek
                🦆), tekan <strong>Ctrl + C</strong> untuk menyalin, lalu tekan <strong>Ctrl + V</strong>{' '}
                berkali-kali untuk memenuhi danau dengan anak bebek lucu!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-heading font-black text-sm sm:text-base uppercase rounded-xl border-3 border-black shadow-[5px_5px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>MULAI PETUALANGAN (SPASI)</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 5 Babak Seru
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Ctrl+C & Ctrl+V
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" /> Penuhi Seluruh Layar
              </span>
            </div>
          </div>
        )}

        {/* ── COUNTDOWN SCREEN (3-2-1) ──────────────────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 space-y-3">
            <div className="text-xs font-mono text-amber-300 uppercase tracking-widest font-black">
              {currentMission.title}
            </div>
            <div className="font-heading font-black text-7xl sm:text-8xl text-yellow-400 animate-pulse drop-shadow-[0_0_25px_#facc15]">
              {missionCountdown > 0 ? missionCountdown : 'GANDAKAN!'}
            </div>
            <div className="text-xs font-mono text-slate-300 max-w-xs text-center">
              {currentMission.subtitle}
            </div>
          </div>
        )}

        {/* ── MODAL AKHIR BABAK (WAVE CLEAR) ───────────────────────── */}
        {gameState === 'wave_clear' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-400 text-black border-3 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_#000]">
              ✨
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Babak {currentMissionIdx + 1} Berhasil Dipenuhi!
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                {currentMission.title} Tuntas!
              </h3>
              <p className="text-xs font-mono text-slate-300">
                Kamu berhasil melipatgandakan seluruh {currentMission.targetClones} klon dengan sukses!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleNextMission}
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-heading font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <span>LANJUT KE BABAK BERIKUTNYA</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Opsi Selesai: Keluar dari Popup & Keluar Layar Penuh */}
              <button
                onClick={handleFinishGame}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-300 font-heading font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>SELESAI</span>
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL GAME OVER (WAKTU HABIS) ─────────────────────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-rose-500 text-white border-3 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_#000]">
              ⏳
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                Waktu Kloning Habis!
              </span>
              <h3 className="font-heading font-black text-2xl text-white">Habitat Belum Penuh</h3>
              <p className="text-xs font-mono text-slate-300 max-w-sm">
                {gameOverReason || 'Waktu pencarian habis sebelum seluruh klon berhasil ditempelkan.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  initMission(currentMissionIdx);
                  setMissionCountdown(3);
                  setGameState('countdown');
                }}
                className="px-6 py-2.5 bg-rose-400 hover:bg-rose-300 text-black font-heading font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>COBA BABAK INI LAGI</span>
              </button>

              <button
                onClick={handleFinishGame}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-heading font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>SELESAI</span>
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL KEMENANGAN UTAMA (GRAND FINALE - 5 BABAK TUNTAS) ── */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4 animate-fadeIn">
            <div className="w-20 h-20 bg-yellow-400 text-black border-4 border-black rounded-3xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_#000] animate-bounce">
              🏆
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 bg-yellow-400 text-black border-2 border-black rounded-full text-xs font-mono font-black uppercase">
                Grand Master Copy & Paste
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-yellow-300">
                Pabrik & Peternakan Sukses Besar!
              </h2>
              <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-md">
                Selamat! Kamu telah menguasai kombinasi sakti <strong>Ctrl + C</strong> dan{' '}
                <strong>Ctrl + V</strong> untuk melipatgandakan data dengan kecepatan kilat!
              </p>
            </div>

            {/* Rekap Nilai Akhir */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-2">
              <div className="bg-slate-900 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Skor Total</div>
                <div className="font-heading font-black text-xl text-yellow-400">{score}</div>
              </div>
              <div className="bg-slate-900 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Combo Max</div>
                <div className="font-heading font-black text-xl text-cyan-400">{maxCombo}x</div>
              </div>
              <div className="bg-slate-900 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Total Klon</div>
                <div className="font-heading font-black text-xl text-emerald-400">{totalClonesCreated}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {/* Tombol Selesai Utama */}
              <button
                onClick={handleFinishGame}
                className="px-7 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>SELESAI (ENTER)</span>
              </button>

              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-heading font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>MAIN LAGI</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
