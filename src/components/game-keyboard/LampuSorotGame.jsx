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
  Flashlight,
  Eye,
  Key,
} from 'lucide-react';
import { shiftAudio } from '@/lib/shiftAudio';

// ─── DAFTAR SIMBOL DERETAN ANGKA & PEMETAAN TOMBOL KEYBOARD ───────────
const SYMBOL_KEY_MAP = {
  '!': { key: '1', name: 'Tanda Seru', digit: '1', finger: 'Kelingking Kiri' },
  '@': { key: '2', name: 'At / Keong', digit: '2', finger: 'Jari Manis Kiri' },
  '#': { key: '3', name: 'Pagar / Hashtag', digit: '3', finger: 'Jari Tengah Kiri' },
  $: { key: '4', name: 'Dolar', digit: '4', finger: 'Telunjuk Kiri' },
  '%': { key: '5', name: 'Persen', digit: '5', finger: 'Telunjuk Kiri' },
  '^': { key: '6', name: 'Caret / Puncak', digit: '6', finger: 'Telunjuk Kanan' },
  '&': { key: '7', name: 'Ampersand / Dan', digit: '7', finger: 'Telunjuk Kanan' },
  '*': { key: '8', name: 'Bintang Asterisk', digit: '8', finger: 'Jari Tengah Kanan' },
  '(': { key: '9', name: 'Kurung Buka', digit: '9', finger: 'Jari Manis Kanan' },
  ')': { key: '0', name: 'Kurung Tutup', digit: '0', finger: 'Kelingking Kanan' },
  '?': { key: '/', name: 'Tanda Tanya', digit: '/', finger: 'Kelingking Kanan' },
};

// ─── BANK BENDA TERSEMBUNYI DI KEGELAPAN (DISCOVERY ITEMS) ─────────────
const DISCOVERY_ITEMS = [
  { symbol: '!', name: 'Petir Kristal', icon: '⚡', color: 'from-amber-400 to-yellow-500' },
  { symbol: '@', name: 'Planet Bercincin', icon: '🪐', color: 'from-cyan-400 to-blue-500' },
  { symbol: '#', name: 'Kunci Harta Karun', icon: '🗝️', color: 'from-yellow-400 to-amber-600' },
  { symbol: '$', name: 'Berlian Kerajaan', icon: '💎', color: 'from-emerald-400 to-teal-500' },
  { symbol: '%', name: 'Baterai Kosmik', icon: '🔋', color: 'from-green-400 to-emerald-600' },
  { symbol: '^', name: 'Gunung Bintang', icon: '🏔️', color: 'from-purple-400 to-indigo-600' },
  { symbol: '&', name: 'Jangkar Kuno', icon: '⚓', color: 'from-sky-400 to-blue-600' },
  { symbol: '*', name: 'Bintang Kejora', icon: '⭐', color: 'from-amber-300 to-orange-500' },
  { symbol: '(', name: 'Bulan Sabit Emas', icon: '🌙', color: 'from-yellow-300 to-amber-500' },
  { symbol: ')', name: 'Komet Antariksa', icon: '☄️', color: 'from-rose-400 to-red-600' },
  { symbol: '?', name: 'Bola Ramalan Kristal', icon: '🔮', color: 'from-fuchsia-400 to-purple-600' },
  { symbol: '!!', name: 'Burung Hantu Emas', icon: '🦉', color: 'from-amber-400 to-yellow-600' },
  { symbol: '@@', name: 'Kompas Pelaut Galaksi', icon: '🧭', color: 'from-blue-400 to-indigo-600' },
  { symbol: '##', name: 'Peti Harta Karun', icon: '📦', color: 'from-amber-500 to-yellow-700' },
  { symbol: '$$', name: 'Mahkota Raja Permata', icon: '👑', color: 'from-yellow-400 to-amber-500' },
  { symbol: '%%', name: 'Jamur Hutan Bercahaya', icon: '🍄', color: 'from-teal-400 to-emerald-600' },
  { symbol: '^^', name: 'Unicorn Nebula Ajaib', icon: '🦄', color: 'from-pink-400 to-purple-500' },
  { symbol: '**', name: 'Teropong Mercusuar', icon: '🔭', color: 'from-cyan-400 to-sky-600' },
  { symbol: '&&', name: 'Guci Emas Kuno', icon: '🏺', color: 'from-amber-400 to-yellow-600' },
  { symbol: '()', name: 'Cermin Ajaib Dimensi', icon: '🪞', color: 'from-violet-400 to-purple-600' },
  { symbol: '!?', name: 'Pintu Rahasia Gua', icon: '🚪', color: 'from-orange-400 to-amber-600' },
  { symbol: '?*', name: 'Lilin Api Biru Abadi', icon: '🕯️', color: 'from-cyan-400 to-blue-600' },
  { symbol: '!ROKET!', name: 'Pesawat Apollo Mini', icon: '🚀', color: 'from-red-400 to-orange-500' },
  { symbol: '#JUARA!', name: 'Piala Mercusuar Agung', icon: '🏆', color: 'from-yellow-400 to-amber-500' },
  { symbol: '$EMAS$', name: 'Tumpukan Emas Murni', icon: '💰', color: 'from-amber-300 to-yellow-500' },
  { symbol: '@BINTANG*', name: 'Konstelasi Bintang', icon: '✨', color: 'from-indigo-400 to-purple-600' },
  { symbol: '(PINTAR)', name: 'Buku Mantra Rahasia', icon: '📖', color: 'from-emerald-400 to-teal-600' },
  { symbol: '!KILAT!', name: 'Kapsul Energi Petir', icon: '⚡', color: 'from-yellow-300 to-amber-500' },
];

// ─── 5 BABAK MISI (TOTAL ~4.5 - 5 MENIT) ──────────────────────────────
const MISSIONS_CONFIG = [
  {
    mission: 1,
    title: 'Babak 1: Sorot Jemari Kiri',
    subtitle: 'Nyalakan lampu sorot dengan menahan Shift (⇧) + Angka 1, 2, atau 3 (!, @, #)!',
    duration: 55,
    targetCount: 10,
    allowedSymbols: ['!', '@', '#'],
    wordPool: ['!', '@', '#', '!', '@', '#', '!@', '@#', '#!', '!!'],
    description: 'Menemukan 10 benda di gua kiri dengan simbol !, @, dan #.',
  },
  {
    mission: 2,
    title: 'Babak 2: Harta Karun Tengah',
    subtitle: 'Sorot benda misterius dengan menahan Shift (⇧) + Angka 4, 5, atau 6 ($, %, ^)!',
    duration: 55,
    targetCount: 10,
    allowedSymbols: ['$', '%', '^'],
    wordPool: ['$', '%', '^', '$$', '%%', '^^', '$%', '%^', '^$', '$$%'],
    description: 'Menemukan 10 benda di lorong tengah dengan simbol $, %, dan ^.',
  },
  {
    mission: 3,
    title: 'Babak 3: Rahasia Langit Kanan',
    subtitle: 'Tahan Shift (⇧) + Angka 7, 8, 9, atau 0 untuk simbol &, *, (, dan )!',
    duration: 65,
    targetCount: 12,
    allowedSymbols: ['&', '*', '(', ')'],
    wordPool: ['*', '&', '(', ')', '**', '&&', '()', '*&*', '(*)', ')&(', '(**)', '&&)'],
    description: 'Menemukan 12 benda di menara kanan dengan simbol &, *, (, dan ).',
  },
  {
    mission: 4,
    title: 'Babak 4: Misteri Tanda Tanya & Campuran',
    subtitle: 'Gunakan Shift (⇧) + / (?) serta variasi simbol untuk menembus kabut tebal!',
    duration: 75,
    targetCount: 14,
    allowedSymbols: ['?', '!', '@', '#', '$', '%', '*'],
    wordPool: ['?', '!?', '?#', '@?', '$?', '*?', '!?#', '?$%', '@#?', '*?*', '??', '!?$', '#?*', '*?#'],
    description: 'Menemukan 14 benda misterius yang dijaga simbol tanda tanya & simbol campuran.',
  },
  {
    mission: 5,
    title: 'Babak 5: Kode Rahasia Mercusuar',
    subtitle: 'Klimaks! Tahan Shift untuk mengetik simbol pembuka kata sandi rahasia!',
    duration: 90,
    targetCount: 16,
    allowedSymbols: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '?'],
    wordPool: [
      '#JUARA!',
      '@BINTANG*',
      '$EMAS$',
      '(PINTAR)',
      '!ROKET!',
      '#KILAT#',
      '*BERANI*',
      '%SUKSES%',
      '!PINTAR!',
      '?RAHASIA?',
      '@HEBAT#',
      '$BERLIAN$',
      '(MENANG)',
      '#SEMANGAT!',
      '!KOMPUTER!',
      '*MERCUSUAR*',
    ],
    description: 'Pecahkan 16 kode kata bersimbol untuk memancarkan cahaya mercusuar ke seluruh samudra!',
  },
];

// Tombol Virtual Baris Angka
const NUMBER_ROW_KEYS = [
  { symbol: '!', num: '1', key: '1' },
  { symbol: '@', num: '2', key: '2' },
  { symbol: '#', num: '3', key: '3' },
  { symbol: '$', num: '4', key: '4' },
  { symbol: '%', num: '5', key: '5' },
  { symbol: '^', num: '6', key: '6' },
  { symbol: '&', num: '7', key: '7' },
  { symbol: '*', num: '8', key: '8' },
  { symbol: '(', num: '9', key: '9' },
  { symbol: ')', num: '0', key: '0' },
  { symbol: '?', num: '/', key: '/' },
];

export default function LampuSorotGame() {
  // Status Permainan: 'idle' | 'countdown' | 'playing' | 'wave_clear' | 'paused' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Status Babak & Nilai
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [missionDiscoveryCount, setMissionDiscoveryCount] = useState(0);
  const [batteryCharge, setBatteryCharge] = useState(3); // HP lentera (3 bar)
  const [missionCountdown, setMissionCountdown] = useState(3);
  const [gameOverReason, setGameOverReason] = useState(null);

  // Status Shift & Interaksi
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [virtualShiftLocked, setVirtualShiftLocked] = useState(false); // Mode toggle untuk tablet
  const [highlightedKey, setHighlightedKey] = useState(null); // Tombol angka yang sedang ditargetkan

  // Target Simbol / Kata Saat Ini
  const [currentPrompt, setCurrentPrompt] = useState({
    targetCode: '!',
    typedIndex: 0,
    item: DISCOVERY_ITEMS[0],
  });

  // Animasi dan Umpan Balik
  const [isSpotlightRevealed, setIsSpotlightRevealed] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const [shakeError, setShakeError] = useState(false);
  const [recentFoundItem, setRecentFoundItem] = useState(null);

  const containerRef = useRef(null);
  const arenaRef = useRef(null);
  const missionStartScoreRef = useRef(0);
  const currentMission = MISSIONS_CONFIG[currentMissionIdx] || MISSIONS_CONFIG[0];

  // Cari representasi benda tersembunyi
  const findItemForCode = useCallback((code) => {
    const exact = DISCOVERY_ITEMS.find((it) => it.symbol === code);
    if (exact) return exact;
    // Fallback berdasarkan karakter pertama
    const firstChar = code[0];
    const matchChar = DISCOVERY_ITEMS.find((it) => it.symbol === firstChar);
    if (matchChar) return matchChar;
    return DISCOVERY_ITEMS[Math.floor(Math.random() * DISCOVERY_ITEMS.length)];
  }, []);

  // Generator Target Simbol Baru
  const generateNewPrompt = useCallback(
    (missionIdx, promptCounter = 0) => {
      const cfg = MISSIONS_CONFIG[missionIdx];
      const pool = cfg.wordPool;
      const targetCode = pool[promptCounter % pool.length] || pool[0];
      const item = findItemForCode(targetCode);

      return {
        targetCode,
        typedIndex: 0,
        item,
      };
    },
    [findItemForCode]
  );

  // Inisialisasi Babak
  const initMission = useCallback(
    (missionIdx) => {
      const cfg = MISSIONS_CONFIG[missionIdx];
      setCurrentMissionIdx(missionIdx);
      setTimeLeft(cfg.duration);
      setMissionDiscoveryCount(0);
      setBatteryCharge(3);
      setGameOverReason(null);
      setWarningMessage(null);
      setIsSpotlightRevealed(false);
      setRecentFoundItem(null);

      const firstPrompt = generateNewPrompt(missionIdx, 0);
      setCurrentPrompt(firstPrompt);
      shiftAudio.playWaveStart();
    },
    [generateNewPrompt]
  );

  // Mulai Permainan dari Awal
  const handleStartGame = useCallback(() => {
    shiftAudio.init();
    shiftAudio.playKeyClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setDiscoveredCount(0);
    setMissionDiscoveryCount(0);
    setBatteryCharge(3);
    setCurrentMissionIdx(0);
    setMissionCountdown(3);
    setGameOverReason(null);
    setWarningMessage(null);
    setIsSpotlightRevealed(false);
    setRecentFoundItem(null);
    missionStartScoreRef.current = 0;
    setGameState('countdown');
  }, []);

  // Selesai & Keluar Layar Penuh (Sesuai Permintaan)
  const handleFinishGame = useCallback(() => {
    shiftAudio.playKeyClick();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
    setGameState('idle');
    setIsSpotlightRevealed(false);
    setShakeError(false);
    setWarningMessage(null);
    setIsShiftActive(false);
    setVirtualShiftLocked(false);
  }, []);

  // Lanjut ke Babak Berikutnya
  const handleNextMission = useCallback(() => {
    shiftAudio.playKeyClick();
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
        shiftAudio.playKeyClick();
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
          shiftAudio.playShieldDamage();
          setGameOverReason('Waktu pencarian habis! Lentera kehabisan daya baterai.');
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
    const newState = shiftAudio.toggleSound();
    setSoundEnabled(newState);
  };

  // Toggle Virtual Shift (untuk Tablet / Touchscreen)
  const handleVirtualShiftToggle = useCallback(() => {
    const nextState = !virtualShiftLocked;
    setVirtualShiftLocked(nextState);
    setIsShiftActive(nextState);
    if (nextState) {
      shiftAudio.playShiftDown();
    } else {
      shiftAudio.playShiftUp();
    }
  }, [virtualShiftLocked]);

  // Deteksi Tombol Fisik Keyboard & Validasi Shift
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tombol Shortcut Universal
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

      // Deteksi Tombol Shift Ditekan
      if (e.key === 'Shift') {
        setIsShiftActive(true);
        shiftAudio.playShiftDown();
        return;
      }

      // Jika Game Sedang Bermain
      if (gameState !== 'playing') return;

      // Abaikan tombol sistem khusus (Tab, Alt, Ctrl, dll.)
      if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Tab') {
        return;
      }

      const targetChar = currentPrompt.targetCode[currentPrompt.typedIndex];
      if (!targetChar) return;

      const symbolInfo = SYMBOL_KEY_MAP[targetChar];

      // KASUS 1: Anak menekan ANGKA biasa tanpa menahan SHIFT
      // Contoh: target '!' tetapi menekan '1'; target '@' tetapi menekan '2'
      if (symbolInfo && e.key === symbolInfo.key && !e.shiftKey && !virtualShiftLocked) {
        e.preventDefault();
        shiftAudio.playShiftMissingWarning();
        setShakeError(true);
        setTimeout(() => setShakeError(false), 300);

        setWarningMessage({
          typedKey: e.key,
          targetSymbol: targetChar,
          requiredDigit: symbolInfo.digit,
          finger: symbolInfo.finger,
          text: `Ups! Angka [${e.key}] keluar karena SHIFT belum ditahan. Tahan tombol SHIFT (⇧) sambil tekan angka [${symbolInfo.digit}] untuk menyalakan lampu sorot [${targetChar}]!`,
        });

        // Highlight tombol keyboard virtual
        setHighlightedKey(symbolInfo.key);
        setTimeout(() => setHighlightedKey(null), 1500);

        // Pengurangan energi baterai jika melakukan kesalahan
        setBatteryCharge((prev) => {
          if (prev <= 1) {
            shiftAudio.playShieldDamage();
            setGameOverReason('Baterai senter habis akibat korsleting listrik!');
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
        setCombo(0);
        return;
      }

      // KASUS 2: Karakter yang ditekan BENAR (Simbol cocok)
      if (e.key === targetChar) {
        e.preventDefault();
        setWarningMessage(null);
        const nextIndex = currentPrompt.typedIndex + 1;
        shiftAudio.playSymbolCorrect(nextIndex);

        // Jika satu kode / kata selesai diketik lengkap
        if (nextIndex >= currentPrompt.targetCode.length) {
          // Benda ditemukan! Nyalakan lampu sorot penuh
          setIsSpotlightRevealed(true);
          shiftAudio.playItemDiscovered();

          setRecentFoundItem(currentPrompt.item);
          setDiscoveredCount((prev) => prev + 1);
          const nextMissionCount = missionDiscoveryCount + 1;
          setMissionDiscoveryCount(nextMissionCount);

          // Hitung Skor & Combo
          const comboBonus = combo * 15;
          const lengthBonus = currentPrompt.targetCode.length * 25;
          const pointsEarned = 100 + comboBonus + lengthBonus;

          setScore((prev) => prev + pointsEarned);
          setCombo((prev) => {
            const nextCombo = prev + 1;
            if (nextCombo > maxCombo) setMaxCombo(nextCombo);
            return nextCombo;
          });

          // Efek partikel konfeti kecil saat benda tersingkap
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
          });

          // Cek apakah target babak tercapai
          if (nextMissionCount >= currentMission.targetCount) {
            setTimeout(() => {
              if (currentMissionIdx >= MISSIONS_CONFIG.length - 1) {
                // Kemenangan Akbar!
                shiftAudio.playVictory();
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.5 },
                });
                setGameState('victory');
              } else {
                // Wave Clear
                shiftAudio.playVictory();
                setGameState('wave_clear');
              }
            }, 650);
          } else {
            // Lanjut ke simbol berikutnya setelah jeda singkat reveal
            setTimeout(() => {
              setIsSpotlightRevealed(false);
              const nextPrompt = generateNewPrompt(currentMissionIdx, nextMissionCount);
              setCurrentPrompt(nextPrompt);
            }, 550);
          }
        } else {
          // Huruf simbol berikutnya dalam satu kata
          setCurrentPrompt((prev) => ({
            ...prev,
            typedIndex: nextIndex,
          }));
        }
        return;
      }

      // KASUS 3: Karakter yang ditekan SALAH sama sekali
      if (e.key.length === 1) {
        shiftAudio.playKeyClick();
        setShakeError(true);
        setTimeout(() => setShakeError(false), 250);
        setCombo(0);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        if (!virtualShiftLocked) {
          setIsShiftActive(false);
          shiftAudio.playShiftUp();
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
    currentPrompt,
    combo,
    maxCombo,
    missionDiscoveryCount,
    currentMission,
    currentMissionIdx,
    generateNewPrompt,
    handleFinishGame,
    handleNextMission,
    handleStartGame,
    initMission,
    virtualShiftLocked,
  ]);

  // Input dari Tombol Virtual Keyboard (Klik / Layar Sentuh)
  const handleVirtualKeyPress = (keyItem) => {
    if (gameState !== 'playing') return;

    // Jika Shift aktif, karakter yang dihasilkan adalah simbol atas
    const effectiveChar = isShiftActive || virtualShiftLocked ? keyItem.symbol : keyItem.key;
    const targetChar = currentPrompt.targetCode[currentPrompt.typedIndex];

    const symbolInfo = SYMBOL_KEY_MAP[targetChar];

    // Jika menekan angka tanpa Shift
    if (symbolInfo && effectiveChar === symbolInfo.key && !isShiftActive && !virtualShiftLocked) {
      shiftAudio.playShiftMissingWarning();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 300);

      setWarningMessage({
        typedKey: effectiveChar,
        targetSymbol: targetChar,
        requiredDigit: symbolInfo.digit,
        finger: symbolInfo.finger,
        text: `Sentuh tombol [⇧ SHIFT] terlebih dahulu agar simbol [${targetChar}] menyala!`,
      });

      setBatteryCharge((prev) => Math.max(0, prev - 1));
      setCombo(0);
      return;
    }

    if (effectiveChar === targetChar) {
      setWarningMessage(null);
      const nextIndex = currentPrompt.typedIndex + 1;
      shiftAudio.playSymbolCorrect(nextIndex);

      if (nextIndex >= currentPrompt.targetCode.length) {
        setIsSpotlightRevealed(true);
        shiftAudio.playItemDiscovered();
        setRecentFoundItem(currentPrompt.item);
        setDiscoveredCount((prev) => prev + 1);
        const nextMissionCount = missionDiscoveryCount + 1;
        setMissionDiscoveryCount(nextMissionCount);

        const pointsEarned = 100 + combo * 15;
        setScore((prev) => prev + pointsEarned);
        setCombo((prev) => prev + 1);

        if (nextMissionCount >= currentMission.targetCount) {
          setTimeout(() => {
            if (currentMissionIdx >= MISSIONS_CONFIG.length - 1) {
              shiftAudio.playVictory();
              setGameState('victory');
            } else {
              shiftAudio.playVictory();
              setGameState('wave_clear');
            }
          }, 650);
        } else {
          setTimeout(() => {
            setIsSpotlightRevealed(false);
            const nextPrompt = generateNewPrompt(currentMissionIdx, nextMissionCount);
            setCurrentPrompt(nextPrompt);
          }, 550);
        }
      } else {
        setCurrentPrompt((prev) => ({
          ...prev,
          typedIndex: nextIndex,
        }));
      }
    } else {
      shiftAudio.playKeyClick();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 250);
      setCombo(0);
    }
  };

  // Target simbol saat ini untuk petunjuk tombol
  const currentTargetChar = currentPrompt.targetCode[currentPrompt.typedIndex] || '';
  const currentTargetInfo = SYMBOL_KEY_MAP[currentTargetChar];

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
          <div className="w-8 h-8 rounded-lg bg-cyan-400 border-2 border-black flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#000]">
            🔦
          </div>
          <div>
            <div className="font-heading font-black text-sm text-cyan-300 flex items-center gap-1.5">
              <span>Lampu Sorot Jari</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/50 px-1.5 py-0.2 rounded font-bold">
                Babak {currentMissionIdx + 1}/5
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              {currentMission.title}
            </div>
          </div>
        </div>

        {/* Skor, Combo & Baterai Lentera */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-slate-800/90 border-2 border-black px-2.5 py-1 rounded-lg text-center shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[9px] text-slate-400 uppercase font-bold">Skor</div>
            <div className="font-black text-amber-300 text-sm">{score}</div>
          </div>

          <div className="bg-slate-800/90 border-2 border-black px-2.5 py-1 rounded-lg text-center shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[9px] text-slate-400 uppercase font-bold">Ditemukan</div>
            <div className="font-black text-emerald-400 text-sm">
              {missionDiscoveryCount}/{currentMission.targetCount}
            </div>
          </div>

          <div className="bg-slate-800/90 border-2 border-black px-2.5 py-1 rounded-lg text-center shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
              <Clock className="w-2.5 h-2.5 text-cyan-400" />
              <span>Waktu</span>
            </div>
            <div
              className={`font-black text-sm ${
                timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-cyan-300'
              }`}
            >
              {timeLeft}s
            </div>
          </div>

          {/* Baterai / HP Senter */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/90 border-2 border-black px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] text-slate-400 font-bold mr-1">BATERAI:</span>
            {[1, 2, 3].map((lvl) => (
              <div
                key={lvl}
                className={`w-3.5 h-4.5 rounded-xs border border-black transition-all ${
                  lvl <= batteryCharge
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-slate-700 opacity-40'
                }`}
              />
            ))}
          </div>

          {/* Tombol Kontrol (Suara & Layar Penuh) */}
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

      {/* ── KANVAS ARENA UTAMA (EKSPEDISI KEGELAPAN & LAMPU SOROT) ──── */}
      <div
        ref={arenaRef}
        className={`relative min-h-[440px] sm:min-h-[500px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden transition-all ${
          shakeError ? 'animate-shake' : ''
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, #0f172a 0%, #090d16 55%, #020617 100%)',
        }}
      >
        {/* Dekorasi Bintang & Partikel Malam */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-6 left-12 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-pulse" />
          <div className="absolute top-16 right-20 w-2 h-2 bg-yellow-200 rounded-full animate-ping" />
          <div className="absolute top-36 left-1/4 w-1 h-1 bg-amber-100 rounded-full" />
          <div className="absolute top-24 right-1/3 w-1.5 h-1.5 bg-purple-200 rounded-full animate-pulse" />
          <div className="absolute bottom-28 left-20 w-1 h-1 bg-cyan-300 rounded-full" />
          <div className="absolute bottom-36 right-16 w-2 h-2 bg-yellow-100 rounded-full animate-pulse" />
        </div>

        {/* ── STATUS INDIKATOR TOMBOL SHIFT DI KANVAS ────────────────── */}
        <div className="w-full flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-xl border-2 border-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000] ${
                isShiftActive || virtualShiftLocked
                  ? 'bg-yellow-400 text-black shadow-[0_0_15px_#facc15]'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black ${
                  isShiftActive || virtualShiftLocked
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-slate-600'
                }`}
              />
              <span>
                {isShiftActive || virtualShiftLocked
                  ? '⇧ TOMBOL SHIFT AKTIF (LAMPU MENYALA)'
                  : '⇧ TAHAN SHIFT UNTUK MENYALAKAN LAMPU'}
              </span>
            </div>

            {/* Tombol Toggle Shift Virtual (Sangat berguna untuk Tablet/Chromebook) */}
            <button
              onClick={handleVirtualShiftToggle}
              className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono text-[11px] font-black cursor-pointer transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000] ${
                virtualShiftLocked
                  ? 'bg-amber-300 text-black'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {virtualShiftLocked ? 'KUNCI SHIFT: ON' : 'Sentuh Kunci Shift'}
            </button>
          </div>

          {/* Pengingat Jari & Tombol */}
          {currentTargetInfo && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-cyan-500/40 px-3 py-1 rounded-lg text-xs font-mono text-cyan-300">
              <span>Posisi Jari:</span>
              <strong className="text-yellow-300 underline font-black">
                {currentTargetInfo.finger}
              </strong>
              <span>(Shift + {currentTargetInfo.digit})</span>
            </div>
          )}
        </div>

        {/* ── PANGGUNG PENCARIAN DI KEGELAPAN (SPOTLIGHT CONE) ──────── */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-4 py-2 z-10">
          {/* EFEK BERKAS LAMPU SOROT (SPOTLIGHT BEAM) */}
          <div
            className={`absolute top-0 bottom-0 pointer-events-none transition-all duration-300 flex items-center justify-center ${
              isSpotlightRevealed
                ? 'opacity-100 scale-105'
                : isShiftActive || virtualShiftLocked
                ? 'opacity-70 scale-100'
                : 'opacity-15 scale-95'
            }`}
            style={{
              width: '420px',
              maxWidth: '90vw',
              background: isSpotlightRevealed
                ? 'radial-gradient(ellipse at center, rgba(253, 224, 71, 0.45) 0%, rgba(250, 204, 21, 0.25) 40%, rgba(234, 179, 8, 0.08) 70%, transparent 85%)'
                : isShiftActive || virtualShiftLocked
                ? 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.15) 45%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(148, 163, 184, 0.1) 0%, transparent 60%)',
              filter: 'blur(4px)',
            }}
          />

          {/* KOTAK BENDA TERSEMBUNYI / DISCOVERY OBJECT */}
          <div className="relative flex flex-col items-center justify-center text-center space-y-3 z-10">
            {/* Siluet vs Objek Tersingkap */}
            <div
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-black flex items-center justify-center text-5xl sm:text-6xl transition-all duration-300 relative shadow-[6px_6px_0px_0px_#000] ${
                isSpotlightRevealed
                  ? `bg-gradient-to-br ${currentPrompt.item.color} scale-110 shadow-[0_0_35px_#fde047]`
                  : isShiftActive || virtualShiftLocked
                  ? 'bg-slate-800/90 text-cyan-200 border-cyan-400/80 shadow-[0_0_15px_#38bdf8]'
                  : 'bg-slate-900/90 text-slate-600'
              }`}
            >
              {isSpotlightRevealed ? (
                <span className="animate-bounce drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  {currentPrompt.item.icon}
                </span>
              ) : isShiftActive || virtualShiftLocked ? (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl filter blur-[1px] opacity-75">
                    {currentPrompt.item.icon}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 mt-1 tracking-wider">
                    TERKUNCI 🔒
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl opacity-30">❓</span>
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                    GELAP GULITA
                  </span>
                </div>
              )}

              {/* Lencana Terang Saat Benda Ditemukan */}
              {isSpotlightRevealed && (
                <div className="absolute -top-3 -right-3 bg-yellow-300 text-black border-2 border-black rounded-full p-1 shadow-[2px_2px_0px_0px_#000] animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Nama Benda Tersembunyi */}
            <div className="h-6">
              {isSpotlightRevealed ? (
                <div className="font-heading font-black text-sm sm:text-base text-yellow-300 animate-fadeIn flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Ditemukan: {currentPrompt.item.name}!</span>
                </div>
              ) : (
                <div className="text-xs font-mono text-slate-400">
                  {isShiftActive || virtualShiftLocked
                    ? 'Ketik simbol untuk menembus bayangan...'
                    : 'Tahan SHIFT untuk mengarahkan lampu sorot!'}
                </div>
              )}
            </div>

            {/* ── KOTAK SIMBOL KATA SATU BARIS UTUH (STRICT SINGLE LINE) ── */}
            <div className="w-full max-w-2xl px-2">
              <div className="bg-slate-900/90 border-3 border-black rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col items-center gap-2">
                <div className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  KUNCI SIMBOL RAHASIA
                </div>

                {/* Wadah Simbol Flex-Nowrap Tanpa Pernah Terpotong */}
                <div className="w-full flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto scrollbar-none py-1">
                  {currentPrompt.targetCode.split('').map((char, idx) => {
                    const isTyped = idx < currentPrompt.typedIndex;
                    const isCurrent = idx === currentPrompt.typedIndex;
                    const charInfo = SYMBOL_KEY_MAP[char];

                    return (
                      <div
                        key={idx}
                        className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl border-3 border-black transition-all ${
                          isTyped
                            ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_0px_#000] scale-95'
                            : isCurrent
                            ? isShiftActive || virtualShiftLocked
                              ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_#000] scale-110 ring-2 ring-yellow-200 animate-pulse'
                              : 'bg-cyan-500 text-black shadow-[3px_3px_0px_0px_#000] scale-105'
                            : 'bg-slate-800 text-slate-500 shadow-[2px_2px_0px_0px_#000]'
                        } ${
                          currentPrompt.targetCode.length <= 4
                            ? 'w-12 h-16 sm:w-16 sm:h-20 text-2xl sm:text-4xl'
                            : currentPrompt.targetCode.length <= 8
                            ? 'w-10 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl'
                            : 'w-8 h-12 sm:w-10 sm:h-14 text-lg sm:text-xl font-black'
                        }`}
                      >
                        <span className="font-heading font-black leading-none">{char}</span>
                        {/* Petunjuk tombol angka di bawah simbol */}
                        {charInfo && (
                          <span
                            className={`text-[9px] sm:text-[10px] font-mono font-bold mt-1 px-1 rounded ${
                              isTyped
                                ? 'text-black/60'
                                : isCurrent
                                ? 'bg-black/20 text-black'
                                : 'text-slate-400'
                            }`}
                          >
                            ⇧+{charInfo.digit}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Balon Peringatan Edukatif Bila Mengetik Angka Tanpa Shift */}
            {warningMessage && (
              <div className="bg-rose-500 text-white border-3 border-black px-4 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#000] font-mono text-xs max-w-lg animate-bounce flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-300" />
                <div className="text-left leading-snug">
                  <strong>PENTING: </strong>
                  {warningMessage.text}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── KEYBOARD VIRTUAL: BARIS ANGKA & TOMBOL SHIFT ─────────── */}
        <div className="w-full max-w-4xl mx-auto space-y-2 z-10 pt-2 border-t-2 border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>PANDUAN PAPAN KETIK:</span>
            <span className="text-cyan-300 font-bold hidden sm:inline">
              Simbol atas aktif saat Shift (⇧) ditahan
            </span>
          </div>

          {/* Baris Tombol Angka (Dengan Simbol di Atasnya) */}
          <div className="grid grid-cols-11 gap-1 sm:gap-2">
            {NUMBER_ROW_KEYS.map((k) => {
              const isTargetKey = currentTargetChar === k.symbol;
              const isCurrentDigitActive = highlightedKey === k.key;

              return (
                <button
                  key={k.key}
                  onClick={() => handleVirtualKeyPress(k)}
                  className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl border-2 border-black transition-all cursor-pointer select-none active:translate-y-0.5 ${
                    isTargetKey
                      ? isShiftActive || virtualShiftLocked
                        ? 'bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] font-black scale-105 ring-2 ring-yellow-200'
                        : 'bg-cyan-400 text-black shadow-[2px_2px_0px_0px_#000] scale-100'
                      : isCurrentDigitActive
                      ? 'bg-rose-400 text-black animate-ping'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {/* Simbol (Atas) */}
                  <span
                    className={`font-heading font-black text-sm sm:text-lg leading-tight ${
                      isShiftActive || virtualShiftLocked
                        ? 'text-black scale-110 font-black'
                        : isTargetKey
                        ? 'text-cyan-900 font-black'
                        : 'text-slate-400'
                    }`}
                  >
                    {k.symbol}
                  </span>
                  {/* Angka (Bawah) */}
                  <span
                    className={`font-mono text-[9px] sm:text-xs font-bold ${
                      isShiftActive || virtualShiftLocked ? 'opacity-50' : 'text-slate-200'
                    }`}
                  >
                    {k.num}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Baris Tombol Shift Kiri & Kanan */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleVirtualShiftToggle}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                isShiftActive || virtualShiftLocked
                  ? 'bg-yellow-400 text-black shadow-[0_0_20px_#facc15]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>⇧ SHIFT KIRI</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isShiftActive || virtualShiftLocked ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              />
            </button>

            <div className="text-[10px] font-mono text-center text-slate-400 hidden sm:block px-2">
              Tekan di keyboard fisik atau sentuh tombol Shift di layar
            </div>

            <button
              onClick={handleVirtualShiftToggle}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 ${
                isShiftActive || virtualShiftLocked
                  ? 'bg-yellow-400 text-black shadow-[0_0_20px_#facc15]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isShiftActive || virtualShiftLocked ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              />
              <span>⇧ SHIFT KANAN</span>
            </button>
          </div>
        </div>

        {/* ── LAYAR MULAI LANGSUNG DI KANVAS (BUKAN POPUP BLOCKING) ─── */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-5 animate-fadeIn">
            <div className="w-20 h-20 bg-cyan-400 border-4 border-black rounded-2xl flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_#000]">
              🔦
            </div>

            <div className="max-w-xl space-y-2">
              <span className="inline-block px-3 py-1 bg-cyan-300 text-black border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_0px_#000] uppercase">
                Petualangan Ekspedisi 5 Babak (~4.5 - 5 Menit)
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-cyan-300">
                Lampu Sorot Jari: Menyingkap Simbol Misterius
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
                Di dalam kegelapan pulau mercusuar, banyak harta karun tersembunyi! Untuk menyalakan
                lampu sorot, tahan tombol <strong>SHIFT (⇧)</strong> sambil menekan angka di bawah
                simbol seperti <strong>!, @, #, $, %, ?, *</strong>.
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 5 Babak Bertingkat
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Tahan Shift + Angka
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" /> Temukan 62 Benda
              </span>
            </div>
          </div>
        )}

        {/* ── COUNTDOWN SCREEN (3-2-1) ──────────────────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 space-y-3">
            <div className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-black">
              {currentMission.title}
            </div>
            <div className="font-heading font-black text-7xl sm:text-8xl text-yellow-400 animate-pulse drop-shadow-[0_0_25px_#facc15]">
              {missionCountdown > 0 ? missionCountdown : 'SOROT!'}
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
                Babak {currentMissionIdx + 1} Berhasil Disorot!
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                {currentMission.title} Selesai!
              </h3>
              <p className="text-xs font-mono text-slate-300">
                Kamu berhasil menyingkap seluruh {currentMission.targetCount} benda di kegelapan!
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

        {/* ── MODAL GAME OVER (BATERAI / WAKTU HABIS) ───────────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-rose-500 text-white border-3 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_#000]">
              🪫
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                Lentera Kehabisan Daya!
              </span>
              <h3 className="font-heading font-black text-2xl text-white">Kegelapan Meliputi Gua</h3>
              <p className="text-xs font-mono text-slate-300 max-w-sm">
                {gameOverReason || 'Waktu pencarian habis sebelum semua benda tersingkap.'}
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
                Grand Master Shift & Simbol
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-yellow-300">
                Mercusuar Bintang Bersinar Penuh!
              </h2>
              <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-md">
                Selamat! Kamu telah menguasai tombol <strong>Shift (⇧)</strong> dan menemukan seluruh
                62 benda rahasia di pulau malam!
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
                <div className="text-[10px] font-mono text-slate-400 uppercase">Benda Temuan</div>
                <div className="font-heading font-black text-xl text-emerald-400">{discoveredCount}</div>
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
