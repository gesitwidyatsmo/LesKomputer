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
  Moon,
  Sun,
} from 'lucide-react';
import { capsAudio } from '@/lib/capsAudio';

// ─── BANK KATA BERTERIAK (HURUF KAPITAL) & BERBISIK (HURUF KECIL) ──────
const WORDS_SHOUT_SHORT = [
  'AWAS',
  'LARI',
  'STOP',
  'CEPAT',
  'BOOM',
  'SIAP',
  'MAJU',
  'GAS',
  'HORE',
  'AYO',
  'BAIK',
  'HEBAT',
];

const WORDS_WHISPER_SHORT = [
  'sssh',
  'diam',
  'senyap',
  'sunyi',
  'tidur',
  'pulas',
  'lelap',
  'teduh',
  'tenang',
  'aman',
  'sejuk',
  'damai',
];

const WORDS_SHOUT_MEDIUM = [
  'BAHAYA',
  'MENANG',
  'JUARA',
  'ROKET',
  'SEKOLAH',
  'BELAJAR',
  'PINTAR',
  'KOMPUTER',
  'SEMANGAT',
  'BERSORAK',
  'BERANI',
  'TERIAK',
];

const WORDS_WHISPER_MEDIUM = [
  'bisik',
  'sayup',
  'mimpi',
  'lembut',
  'malam',
  'bintang',
  'bantal',
  'selimut',
  'angin',
  'gerimis',
  'pelan',
  'rahasia',
];

// ─── KONFIGURASI 5 BABAK MISI (TOTAL ~4.5 - 5 MENIT) ───────────────────
const MISSIONS_CONFIG = [
  {
    mission: 1,
    title: 'Babak 1: Hutan Teriakan Monster',
    subtitle: 'Nyalakan Caps Lock (⇪) untuk mengetik huruf BESAR bersama Monster Marah!',
    modeRule: 'always_shout', // 100% Berteriak
    duration: 55,
    targetCount: 10,
    bgTheme: 'from-amber-950 via-rose-950 to-slate-950',
    tip: 'Monster sedang marah! Tekan tombol CAPS LOCK (⇪) agar menyala, lalu ketik huruf BESAR!',
  },
  {
    mission: 2,
    title: 'Babak 2: Lembah Peri Tertidur',
    subtitle: 'Matikan Caps Lock (⇪) untuk mengetik huruf kecil agar peri tidak terbangun!',
    modeRule: 'always_whisper', // 100% Berbisik
    duration: 55,
    targetCount: 10,
    bgTheme: 'from-indigo-950 via-purple-950 to-slate-950',
    tip: 'Ssshh! Peri manis sedang tidur. Matikan CAPS LOCK (⇪) dan ketik huruf kecil dengan tenang!',
  },
  {
    mission: 3,
    title: 'Babak 3: Panggung Teater Gema',
    subtitle: 'Ganti mode Caps Lock bergantian: Satu kata Teriak, satu kata Bisik!',
    modeRule: 'alternate', // Bergantian tiap kata
    duration: 65,
    targetCount: 12,
    bgTheme: 'from-fuchsia-950 via-slate-900 to-indigo-950',
    tip: 'Perhatikan ikon karakter di panggung: Monster = Nyalakan Caps Lock, Peri = Matikan Caps Lock!',
  },
  {
    mission: 4,
    title: 'Babak 4: Badai Dinamis Dua Dunia',
    subtitle: 'Mode teriak dan bisik berganti acak dengan kata-kata yang lebih menantang!',
    modeRule: 'random', // Acak
    duration: 75,
    targetCount: 14,
    bgTheme: 'from-purple-950 via-violet-950 to-slate-950',
    tip: 'Cepat cek lampu Caps Lock di layar! Selaraskan tombol Caps Lock sebelum mengetik!',
  },
  {
    mission: 5,
    title: 'Babak 5: Konser Harmoni Akbar (Grand Finale)',
    subtitle: 'Tantangan puncak penguasaan Caps Lock kecepatan tinggi!',
    modeRule: 'random_advanced',
    duration: 90,
    targetCount: 16,
    bgTheme: 'from-rose-950 via-purple-950 to-emerald-950',
    tip: 'Fokus konsentrasi jemari! Kuasai pergantian Caps Lock dengan lincah dan sempurna!',
  },
];

export default function TeriakBisikGame() {
  // Game states: 'idle' | 'countdown' | 'playing' | 'wave_clear' | 'paused' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState('idle');
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [missionCountdown, setMissionCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(MISSIONS_CONFIG[0].duration);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [missionWordCount, setMissionWordCount] = useState(0);
  const [shields, setShields] = useState(3); // 3 perisai / hati
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null); // 'time_up' | 'shields_depleted'

  // Caps Lock State (bisa dari keyboard fisik via getModifierState atau klik tombol virtual)
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Status Kata Saat Ini
  // mode: 'shout' (Berteriak / Caps Lock ON) | 'whisper' (Berbisik / Caps Lock OFF)
  const [currentPrompt, setCurrentPrompt] = useState({
    targetWord: 'AWAS',
    mode: 'shout',
    typedIndex: 0, // Huruf keberapa yang sedang diketik
  });

  // Umpan balik visual & animasi
  const [shoutMonsterMood, setShoutMonsterMood] = useState('idle'); // 'idle' | 'roaring' | 'confused'
  const [whisperFairyMood, setWhisperFairyMood] = useState('sleeping'); // 'sleeping' | 'happy' | 'startled'
  const [warningFeedback, setWarningFeedback] = useState(null); // Pesan jika salah mode Caps Lock
  const [shakeError, setShakeError] = useState(false);
  const [activeVirtualKey, setActiveVirtualKey] = useState(null); // Tombol visual yang ditekan

  const containerRef = useRef(null);
  const arenaRef = useRef(null);
  const missionStartScoreRef = useRef(0);
  const currentMission = MISSIONS_CONFIG[currentMissionIdx] || MISSIONS_CONFIG[0];

  // Generator Kata Berdasarkan Babak & Mode
  const generateNewWord = useCallback((missionIdx, previousMode, wordCounter) => {
    const cfg = MISSIONS_CONFIG[missionIdx];
    let nextMode = 'shout';

    if (cfg.modeRule === 'always_shout') {
      nextMode = 'shout';
    } else if (cfg.modeRule === 'always_whisper') {
      nextMode = 'whisper';
    } else if (cfg.modeRule === 'alternate') {
      nextMode = wordCounter % 2 === 0 ? 'shout' : 'whisper';
    } else {
      // Random
      nextMode = Math.random() < 0.5 ? 'shout' : 'whisper';
    }

    let wordPool = [];
    if (nextMode === 'shout') {
      wordPool = missionIdx >= 3 ? [...WORDS_SHOUT_SHORT, ...WORDS_SHOUT_MEDIUM] : WORDS_SHOUT_SHORT;
    } else {
      wordPool = missionIdx >= 3 ? [...WORDS_WHISPER_SHORT, ...WORDS_WHISPER_MEDIUM] : WORDS_WHISPER_SHORT;
    }

    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];

    return {
      targetWord: randomWord,
      mode: nextMode,
      typedIndex: 0,
    };
  }, []);

  // Inisialisasi Misi
  const initMission = useCallback(
    (missionIdx) => {
      const cfg = MISSIONS_CONFIG[missionIdx];
      setCurrentMissionIdx(missionIdx);
      setTimeLeft(cfg.duration);
      setMissionWordCount(0);
      setShields(3);
      setGameOverReason(null);
      setWarningFeedback(null);
      const nextWord = generateNewWord(missionIdx, null, 0);
      setCurrentPrompt(nextWord);
      capsAudio.playWaveStart();
    },
    [generateNewWord]
  );

  // Mulai Permainan dari Awal
  const handleStartGame = useCallback(() => {
    capsAudio.init();
    capsAudio.playKeyClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setWordCount(0);
    setMissionWordCount(0);
    setShields(3);
    setCurrentMissionIdx(0);
    setMissionCountdown(3);
    setGameOverReason(null);
    setWarningFeedback(null);
    missionStartScoreRef.current = 0;
    setGameState('countdown');
  }, []);

  // Ulangi Babak yang Sama
  const handleRetryCurrentMission = useCallback(() => {
    capsAudio.init();
    capsAudio.playKeyClick();
    setScore(missionStartScoreRef.current);
    setCombo(0);
    setMissionWordCount(0);
    setShields(3);
    setGameOverReason(null);
    setWarningFeedback(null);
    setMissionCountdown(3);
    setGameState('countdown');
  }, []);

  // Selesai & Keluar dari Permainan (Tutup Popup & Keluar Fullscreen)
  const handleFinishGame = useCallback(() => {
    capsAudio.playKeyClick();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
    setGameState('idle');
    setShoutMonsterMood('idle');
    setWhisperFairyMood('sleeping');
    setWarningFeedback(null);
    setShakeError(false);
  }, []);

  // Hitung Mundur 3, 2, 1
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (missionCountdown > 0) {
      const timer = setTimeout(() => {
        setMissionCountdown((prev) => prev - 1);
        if (missionCountdown > 1) {
          capsAudio.playKeyClick();
        } else {
          capsAudio.playWaveStart();
        }
      }, 900);
      return () => clearTimeout(timer);
    } else {
      initMission(currentMissionIdx);
      setGameState('playing');
    }
  }, [gameState, missionCountdown, currentMissionIdx, initMission]);

  // Transisi Manual ke Babak Berikutnya
  const handleNextMission = useCallback(() => {
    const nextIdx = currentMissionIdx + 1;
    if (nextIdx < MISSIONS_CONFIG.length) {
      setCurrentMissionIdx(nextIdx);
      setMissionCountdown(3);
      missionStartScoreRef.current = score;
      setGameOverReason(null);
      setGameState('countdown');
      setShields(3);
    } else {
      setGameState('victory');
      capsAudio.playVictory();
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentMissionIdx, score]);

  // Timer Babak per Detik
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState((curr) => {
            if (curr === 'playing') {
              setGameOverReason('time_up');
              capsAudio.playShieldDamage();
              return 'gameover';
            }
            return curr;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Toggle Caps Lock Virtual (bisa diklik di layar)
  const handleToggleVirtualCaps = useCallback(() => {
    capsAudio.init();
    setCapsLockActive((prev) => {
      const next = !prev;
      capsAudio.playCapsToggle(next);
      return next;
    });
  }, []);

  // Eksekusi Input Huruf (Mengetik Huruf ke Kata)
  const handleTypeCharacter = useCallback(
    (char, isPhysicalCapsState) => {
      if (gameState !== 'playing') return;
      const { targetWord, mode, typedIndex } = currentPrompt;

      // Cek apakah seluruh kata sudah selesai
      if (typedIndex >= targetWord.length) return;

      const expectedChar = targetWord[typedIndex];

      // Verifikasi Mode Caps Lock:
      // Di Mode Shout: Caps Lock HARUS AKTIF (dan char harus kapital A-Z)
      // Di Mode Whisper: Caps Lock HARUS TIDAK AKTIF (dan char harus huruf kecil a-z)
      const isExpectedCapsOn = mode === 'shout';
      const actualCapsOn = isPhysicalCapsState !== undefined ? isPhysicalCapsState : capsLockActive;

      // Cek status Caps Lock terlebih dahulu
      if (isExpectedCapsOn && !actualCapsOn) {
        // Mode Teriak tapi Caps Lock masih mati!
        capsAudio.playModeWarning();
        setWarningFeedback('Nyalakan CAPS LOCK (⇪) untuk mode berteriak!');
        setShoutMonsterMood('confused');
        setShakeError(true);
        setTimeout(() => setShakeError(false), 350);
        setTimeout(() => setShoutMonsterMood('idle'), 600);
        return;
      }

      if (!isExpectedCapsOn && actualCapsOn) {
        // Mode Bisik tapi Caps Lock masih menyala!
        capsAudio.playModeWarning();
        setWarningFeedback('Ssshh! Matikan CAPS LOCK (⇪) agar suara menjadi bisikan!');
        setWhisperFairyMood('startled');
        setShakeError(true);
        setTimeout(() => setShakeError(false), 350);
        setTimeout(() => setWhisperFairyMood('sleeping'), 700);
        return;
      }

      // Caps Lock sudah sesuai! Sekarang cek apakah karakter cocok persis
      if (char === expectedChar) {
        // SUKSES KETIK HURUF INI
        setWarningFeedback(null);
        const nextTypedIndex = typedIndex + 1;

        if (mode === 'shout') {
          capsAudio.playShoutLetter(typedIndex);
          setShoutMonsterMood('roaring');
          setTimeout(() => setShoutMonsterMood('idle'), 250);
        } else {
          capsAudio.playWhisperLetter(typedIndex);
          setWhisperFairyMood('happy');
          setTimeout(() => setWhisperFairyMood('sleeping'), 350);
        }

        const pts = 80 + combo * 15;
        setScore((s) => s + pts);
        setCombo((c) => {
          const nc = c + 1;
          setMaxCombo((m) => Math.max(m, nc));
          return nc;
        });

        // Cek apakah seluruh kata sudah tuntas
        if (nextTypedIndex >= targetWord.length) {
          capsAudio.playWordComplete();
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
          setScore((s) => s + 200);
          setWordCount((w) => w + 1);

          // Update prompt menjadi kata bersih selesai sesaat
          setCurrentPrompt((p) => ({ ...p, typedIndex: nextTypedIndex }));

          setTimeout(() => {
            setMissionWordCount((curr) => {
              const nextCount = curr + 1;
              if (nextCount >= currentMission.targetCount) {
                setTimeout(() => {
                  if (currentMissionIdx + 1 >= MISSIONS_CONFIG.length) {
                    setGameState('victory');
                    capsAudio.playVictory();
                    confetti({ particleCount: 160, spread: 95, origin: { y: 0.55 } });
                  } else {
                    setGameState('wave_clear');
                    capsAudio.playWaveStart();
                    confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
                  }
                }, 400);
              } else {
                const nextWord = generateNewWord(currentMissionIdx, mode, nextCount);
                setCurrentPrompt(nextWord);
              }
              return nextCount;
            });
          }, 450);
        } else {
          setCurrentPrompt((p) => ({ ...p, typedIndex: nextTypedIndex }));
        }
      } else {
        // SALAH KETIK HURUF
        capsAudio.playShieldDamage();
        setShakeError(true);
        setTimeout(() => setShakeError(false), 400);
        setCombo(0);
        setWarningFeedback(`Huruf '${char}' tidak sesuai. Yang benar adalah '${expectedChar}'!`);

        setShields((s) => {
          const ns = Math.max(0, s - 1);
          if (ns <= 0) {
            setGameOverReason('shields_depleted');
            setGameState('gameover');
          }
          return ns;
        });
      }
    },
    [
      gameState,
      currentPrompt,
      capsLockActive,
      combo,
      currentMission,
      currentMissionIdx,
      generateNewWord,
    ]
  );

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Update status Caps Lock dari keyboard fisik
      if (typeof e.getModifierState === 'function') {
        const physicalCaps = e.getModifierState('CapsLock');
        setCapsLockActive(physicalCaps);
      }

      // 1. Enter / Spacebar untuk Navigasi Dialog
      if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'Space') {
        if (gameState === 'idle') {
          e.preventDefault();
          handleStartGame();
          return;
        } else if (gameState === 'wave_clear') {
          e.preventDefault();
          handleNextMission();
          return;
        } else if (gameState === 'gameover') {
          e.preventDefault();
          if (gameOverReason === 'time_up' || timeLeft <= 0) {
            handleRetryCurrentMission();
          } else {
            handleStartGame();
          }
          return;
        } else if (gameState === 'victory') {
          e.preventDefault();
          handleFinishGame();
          return;
        }
      }

      // 2. Tombol Pause / Keluar Modal (Escape)
      if (e.key === 'Escape') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
        else if (gameState === 'wave_clear' || gameState === 'victory' || gameState === 'gameover') {
          handleFinishGame();
        }
        return;
      }

      // 3. Tombol Caps Lock Fisik ditekan langsung
      if (e.key === 'CapsLock') {
        setActiveVirtualKey('CapsLock');
        setTimeout(() => setActiveVirtualKey(null), 180);
        // Toggle atau sync status
        setTimeout(() => {
          if (typeof e.getModifierState === 'function') {
            const nextCaps = e.getModifierState('CapsLock');
            capsAudio.playCapsToggle(nextCaps);
            setCapsLockActive(nextCaps);
          }
        }, 10);
        return;
      }

      // 4. Input Huruf Saat Bermain
      if (gameState === 'playing') {
        // Hanya tangkap karakter tunggal huruf alfabet
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
          e.preventDefault();
          const physicalCaps = typeof e.getModifierState === 'function' ? e.getModifierState('CapsLock') : capsLockActive;
          setCapsLockActive(physicalCaps);
          setActiveVirtualKey(e.key);
          setTimeout(() => setActiveVirtualKey(null), 160);
          handleTypeCharacter(e.key, physicalCaps);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (typeof e.getModifierState === 'function') {
        const physicalCaps = e.getModifierState('CapsLock');
        setCapsLockActive(physicalCaps);
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
    gameOverReason,
    timeLeft,
    capsLockActive,
    handleStartGame,
    handleNextMission,
    handleFinishGame,
    handleRetryCurrentMission,
    handleTypeCharacter,
  ]);

  // Toggle Suara
  const handleToggleSound = () => {
    const next = capsAudio.toggleSound();
    setSoundOn(next);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
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
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const { targetWord, mode, typedIndex } = currentPrompt;
  const isWordFinished = typedIndex >= targetWord.length;

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-950 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] overflow-hidden flex flex-col select-none transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none shadow-none h-screen' : ''
      }`}
    >
      {/* ── HEADER GAME & INDIKATOR UTAMA ─────────────────────────── */}
      <div className="bg-purple-950 border-b-3 border-black px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-400 border-2 border-black rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-[2px_2px_0px_0px_#000]">
            📢
          </div>
          <div>
            <h2 className="font-heading font-black text-sm sm:text-lg leading-tight flex items-center gap-1.5 text-white">
              <span>Mode Berteriak vs Berbisik</span>
              <span className="hidden sm:inline-block text-[10px] bg-purple-300 text-purple-950 px-2 py-0.5 rounded-full font-mono font-bold">
                Caps Lock ⇪
              </span>
            </h2>
            <p className="text-[11px] font-mono text-purple-200">
              {gameState === 'idle'
                ? 'Persiapan • Latihan Toggle Kapital vs Huruf Kecil'
                : `${currentMission.title} • Babak ${currentMission.mission} / 5`}
            </p>
          </div>
        </div>

        {/* Skor, Kombo, Nyawa, Waktu, & Tombol Kontrol */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Perisai / Nyawa */}
          <div className="flex items-center gap-1 bg-black/40 border border-purple-500/40 px-2 sm:px-2.5 py-1 rounded-xl">
            {[1, 2, 3].map((shieldIdx) => (
              <Heart
                key={shieldIdx}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
                  shieldIdx <= shields
                    ? 'text-rose-400 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                    : 'text-slate-600 fill-transparent'
                }`}
              />
            ))}
          </div>

          {/* Waktu Tersisa */}
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold bg-black/40 border border-purple-500/40 px-2 sm:px-3 py-1 rounded-xl">
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-purple-300'}`} />
            <span className={timeLeft <= 10 ? 'text-rose-400 animate-pulse font-black' : 'text-purple-200'}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Skor */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-xs sm:text-sm font-black bg-black/40 border border-purple-500/40 px-3 py-1 rounded-xl text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{score}</span>
          </div>

          {/* Toggle Suara */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle Sound"
            className="p-1.5 bg-white hover:bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-black"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>

          {/* Toggle Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-1.5 bg-white hover:bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-black"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── SUB-HEADER TARGET KUOTA KATA ───────────────────────────── */}
      <div className="bg-slate-900 border-b-2 border-black/40 px-3.5 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-purple-500 text-white font-black rounded border border-black text-[11px]">
            {gameState === 'idle' ? 'PERSIAPAN MISI' : `BABAK ${currentMission.mission} / 5`}
          </span>
          <span className="font-bold text-slate-300">
            {gameState === 'idle'
              ? 'Latihan Refleks: Caps Lock ON (Teriak) vs Caps Lock OFF (Bisik)'
              : currentMission.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {gameState === 'idle' ? (
            <span className="text-amber-300 font-bold bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 rounded text-[11px]">
              ⭐ Total 5 Babak Tantangan (~4–5 Menit)
            </span>
          ) : (
            <>
              <span className="text-slate-400">Target Kata:</span>
              <span className="font-black text-amber-300">
                {missionWordCount} / {currentMission.targetCount}
              </span>
              <div className="w-24 sm:w-32 bg-slate-800 border border-black rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-400 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (missionWordCount / currentMission.targetCount) * 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── ARENA UTAMA (RESPONSIVE FLEX / CANVAS) ──────────────────── */}
      <div
        ref={arenaRef}
        className={`relative flex-1 min-h-[500px] sm:min-h-[540px] md:min-h-[570px] bg-gradient-to-b ${
          gameState === 'idle'
            ? 'from-slate-900 via-purple-950 to-slate-950'
            : currentMission.bgTheme
        } p-3 sm:p-5 flex flex-col justify-between overflow-hidden`}
      >
        {/* Dekorasi Partikel Bintang Latar */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-white animate-ping" />
          <div className="absolute top-24 right-20 w-3 h-3 rounded-full bg-amber-300 animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
        </div>

        {gameState === 'idle' ? (
          /* ── KONTEN KANVAS MULAI PERMAINAN (TERINTEGRASI DI KANVAS) ── */
          <div className="flex-1 flex flex-col justify-between items-center text-center py-2 sm:py-3 px-2 sm:px-4 relative z-10 my-auto w-full max-w-4xl mx-auto space-y-4">
            {/* Header Judul Game */}
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-300 border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_#000] uppercase text-black">
                <span>📢</span>
                <span>Game 4 • Fokus Motorik: Caps Lock</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white drop-shadow-[3px_3px_0px_#000]">
                Mode Berteriak vs Berbisik
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
                Selaraskan tombol <strong>Caps Lock</strong> sesuai suasana hati karakter! Berteriaklah dengan huruf besar bersama monster, dan berbisiklah dengan huruf kecil bersama peri tidur.
              </p>
            </div>

            {/* Panggung Dua Karakter: Monster Marah VS Peri Tidur */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center max-w-3xl">
              {/* Karakter 1: Monster Marah (Mode Berteriak) */}
              <div className="bg-rose-950/80 border-3 border-rose-500/80 rounded-2xl p-4 text-center space-y-3 shadow-[4px_4px_0px_#000] flex flex-col items-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-black p-2 flex flex-col items-center justify-center bg-gradient-to-b from-rose-500 to-red-700 shadow-[3px_3px_0px_#000] animate-bounce-slow">
                  <span className="text-4xl sm:text-5xl">😡</span>
                  <div className="absolute -bottom-2 bg-amber-300 border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-black text-black">
                    TERIAK!
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="font-heading font-black text-xs sm:text-sm text-rose-300 uppercase block">
                    Mode Berteriak (Monster Marah)
                  </span>
                  <p className="text-[11px] font-mono text-slate-200">
                    Nyalakan <strong>Caps Lock (ON)</strong> dan ketik huruf <strong>BESAR / KAPITAL</strong> (contoh: <code>"AWAS"</code>).
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-black/60 border border-rose-400 px-2 py-1 rounded text-[11px] font-mono font-bold text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CAPS LOCK HARUS ON ⇪</span>
                  </div>
                </div>
              </div>

              {/* Karakter 2: Peri Tidur (Mode Berbisik) */}
              <div className="bg-indigo-950/80 border-3 border-indigo-500/80 rounded-2xl p-4 text-center space-y-3 shadow-[4px_4px_0px_#000] flex flex-col items-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-black p-2 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-700 shadow-[3px_3px_0px_#000] animate-bounce-slow">
                  <span className="text-4xl sm:text-5xl">🧚‍♀️</span>
                  <div className="absolute -top-2 right-1 text-base animate-pulse">💤</div>
                  <div className="absolute -bottom-2 bg-purple-300 border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-black text-black">
                    BISIK...
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="font-heading font-black text-xs sm:text-sm text-purple-300 uppercase block">
                    Mode Berbisik (Peri Tidur)
                  </span>
                  <p className="text-[11px] font-mono text-slate-200">
                    Matikan <strong>Caps Lock (OFF)</strong> dan ketik huruf <strong>kecil lembut</strong> (contoh: <code>"tidur"</code>).
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-400 px-2 py-1 rounded text-[11px] font-mono font-bold text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span>CAPS LOCK HARUS OFF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Mulai Permainan */}
            <div className="w-full max-w-md pt-1 space-y-2">
              <button
                onClick={handleStartGame}
                className="w-full py-3.5 sm:py-4 bg-emerald-400 hover:bg-emerald-300 border-3 sm:border-4 border-black rounded-2xl font-heading font-black text-sm sm:text-base text-black shadow-[5px_5px_0px_0px_#000] active:translate-x-1 active:translate-y-1 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>MULAI PERMAINAN (TEKAN ENTER / SPASI)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── ARENA PERMAINAN BERJALAN ── */
          <>
            {/* Bagian Atas: Peringatan Mode / Hint */}
            <div className="text-center space-y-1 relative z-10">
              {warningFeedback ? (
                <div className="inline-flex items-center gap-1.5 bg-rose-500 border-2 border-black text-white text-xs px-3.5 py-1 rounded-full font-mono font-black animate-shake shadow-[2px_2px_0px_#000]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{warningFeedback}</span>
                </div>
              ) : (
                <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-slate-200 text-xs px-3 py-1 rounded-full font-mono">
                  {mode === 'shout' ? '🔥 Mode Berteriak: Nyalakan Caps Lock & Ketik Huruf Besar!' : '🌙 Mode Berbisik: Matikan Caps Lock & Ketik Huruf Kecil!'}
                </span>
              )}
            </div>

            {/* Bagian Tengah: Karakter & Papan Kata Satu Baris */}
            <div className="my-auto py-2 relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full">
              <div className="w-full max-w-5xl flex items-center justify-between gap-2 sm:gap-6 px-1">
                {/* 1. Karakter Monster Marah (Sisi Kiri) */}
                <div className="flex flex-col items-center text-center transition-all duration-300 w-20 sm:w-28 md:w-36 flex-shrink-0">
                  <div
                    className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl border-3 sm:border-4 border-black p-2 flex flex-col items-center justify-center transition-transform duration-200 ${
                      mode === 'shout'
                        ? 'scale-110 bg-gradient-to-b from-rose-500 to-red-700 shadow-[0_0_30px_rgba(244,63,94,0.8)]'
                        : 'scale-90 opacity-40 bg-slate-800 shadow-none'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl">{shoutMonsterMood === 'roaring' ? '🗣️' : '😡'}</span>
                    {mode === 'shout' && (
                      <div className="absolute -top-3 bg-amber-300 border-2 border-black px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black text-black animate-bounce shadow-[2px_2px_0px_#000]">
                        AKTIF!
                      </div>
                    )}
                  </div>
                  <span className="font-heading font-black text-xs text-rose-300 mt-2 block uppercase">
                    Monster Teriak
                  </span>
                </div>

                {/* 2. Papan Kata Utama (SELALU SATU BARIS / FLEX-NOWRAP) */}
                <div className="flex-1 flex flex-col items-center justify-center px-1 sm:px-2 min-w-0 max-w-full">
                  {/* Status Mode Kata */}
                  <div className="text-center mb-2">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000] uppercase ${
                        mode === 'shout'
                          ? 'bg-rose-400 text-black'
                          : 'bg-indigo-300 text-black'
                      }`}
                    >
                      {mode === 'shout' ? '📢 MODE BERTERIAK (CAPS LOCK ON)' : '🤫 MODE BERBISIK (CAPS LOCK OFF)'}
                    </span>
                  </div>

                  {/* Deretan Kartu Huruf Satu Baris */}
                  {(() => {
                    const textLen = targetWord.length;
                    const cardSizeClass =
                      textLen <= 5
                        ? 'w-11 h-14 sm:w-14 sm:h-18 text-2xl sm:text-4xl'
                        : textLen <= 7
                        ? 'w-9 h-12 sm:w-12 sm:h-16 text-xl sm:text-3xl'
                        : 'w-8 h-10 sm:w-10 sm:h-14 text-lg sm:text-2xl';

                    return (
                      <div
                        className={`relative bg-slate-900/95 border-3 sm:border-4 border-black p-3 sm:p-5 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-nowrap items-center justify-center gap-1 sm:gap-2 max-w-full overflow-x-auto scrollbar-none transition-all duration-300 ${
                          shakeError ? 'border-rose-500 animate-shake ring-4 ring-rose-400' : ''
                        } ${
                          isWordFinished
                            ? 'border-emerald-400 ring-4 ring-emerald-400/80 bg-emerald-950/90 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-[1.02]'
                            : ''
                        }`}
                      >
                        {isWordFinished && (
                          <div className="absolute -top-3.5 bg-emerald-300 border-2 border-black px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-heading font-black text-black shadow-[2px_2px_0px_#000] animate-bounce z-20 flex items-center gap-1 whitespace-nowrap">
                            <span>✨</span>
                            <span>KATA SELESAI SEMPURNA!</span>
                            <span>✨</span>
                          </div>
                        )}

                        {targetWord.split('').map((char, idx) => {
                          const isTyped = idx < typedIndex;
                          const isCurrent = idx === typedIndex;

                          return (
                            <div
                              key={idx}
                              id={`caps-card-${idx}`}
                              className={`relative ${cardSizeClass} rounded-xl border-2 sm:border-3 border-black flex items-center justify-center font-heading font-black transition-all duration-200 select-none flex-shrink-0 ${
                                isTyped
                                  ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000] scale-95'
                                  : isCurrent
                                  ? 'bg-amber-300 text-black shadow-[4px_4px_0px_#000] ring-4 ring-amber-400 scale-110 animate-pulse'
                                  : 'bg-white text-slate-800 shadow-[2px_2px_0px_#000]'
                              }`}
                            >
                              <span>{char}</span>
                              {isCurrent && (
                                <span className="absolute -bottom-2.5 bg-amber-400 text-black text-[8px] font-mono px-1 rounded border border-black font-black">
                                  KETIK
                                </span>
                              )}
                              {isTyped && (
                                <span className="absolute -top-2 -right-1 text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Tombol Indikator Caps Lock (Interaktif / Bisa Diklik) */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleToggleVirtualCaps}
                      className={`px-4 py-2 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-2 ${
                        capsLockActive
                          ? 'bg-emerald-400 text-black ring-4 ring-emerald-300'
                          : 'bg-slate-800 text-slate-300 border-slate-600'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full border border-black transition-all ${
                          capsLockActive
                            ? 'bg-emerald-300 shadow-[0_0_10px_#34d399] animate-pulse'
                            : 'bg-slate-600'
                        }`}
                      />
                      <span>CAPS LOCK: {capsLockActive ? 'ON (MENYALA ⇪)' : 'OFF (MATI)'}</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      (Tekan tombol <strong>Caps Lock</strong> di keyboard atau klik tombol ini)
                    </span>
                  </div>
                </div>

                {/* 3. Karakter Peri Tidur (Sisi Kanan) */}
                <div className="flex flex-col items-center text-center transition-all duration-300 w-20 sm:w-28 md:w-36 flex-shrink-0">
                  <div
                    className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl border-3 sm:border-4 border-black p-2 flex flex-col items-center justify-center transition-transform duration-200 ${
                      mode === 'whisper'
                        ? 'scale-110 bg-gradient-to-b from-indigo-500 to-purple-700 shadow-[0_0_30px_rgba(168,85,247,0.8)]'
                        : 'scale-90 opacity-40 bg-slate-800 shadow-none'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl">
                      {whisperFairyMood === 'startled' ? '😲' : whisperFairyMood === 'happy' ? '😊' : '🧚‍♀️'}
                    </span>
                    {mode === 'whisper' && (
                      <div className="absolute -top-3 bg-purple-300 border-2 border-black px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black text-black animate-bounce shadow-[2px_2px_0px_#000]">
                        AKTIF!
                      </div>
                    )}
                  </div>
                  <span className="font-heading font-black text-xs text-purple-300 mt-2 block uppercase">
                    Peri Bisik
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian Bawah: Virtual Keyboard Bar untuk Chromebook/Tablet */}
            <div className="relative z-10 w-full max-w-xl mx-auto bg-black/60 border-2 border-purple-500/40 p-2 rounded-2xl flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-bold">⌨️ Status Keyboard:</span>
                <span className={capsLockActive ? 'text-emerald-400 font-black' : 'text-slate-400'}>
                  {capsLockActive ? 'HURUF BESAR (KAPITAL)' : 'huruf kecil (normal)'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Tekan tombol alfabet untuk mengetik
              </div>
            </div>
          </>
        )}

        {/* ── MODAL 1: COUNTDOWN 3, 2, 1 ────────────────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <span className="text-white font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 font-bold">
              Bersiap Menyesuaikan Suara...
            </span>
            <div className="font-heading font-black text-7xl sm:text-8xl text-purple-400 drop-shadow-[4px_4px_0px_#000] animate-ping">
              {missionCountdown > 0 ? missionCountdown : 'MULAI!'}
            </div>
          </div>
        )}

        {/* ── MODAL 2: WAVE CLEAR (REKAP BABAK) ────────────────────── */}
        {gameState === 'wave_clear' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="max-w-md w-full bg-white border-3 sm:border-4 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] text-center space-y-2.5 sm:space-y-3.5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-purple-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000]">
                ⭐
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-purple-200 border border-black rounded-full text-[10px] sm:text-xs font-mono font-black shadow-[1px_1px_0px_0px_#000] uppercase text-purple-950">
                  Babak {currentMission.mission} Berhasil Selesai!
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Refleks Caps Lock Hebat!
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-mono">
                  Kamu sangat tangkas membedakan saatnya berteriak dan berbisik!
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3 rounded-xl space-y-1.5 text-left font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Skor Saat Ini:</span>
                  <span className="font-black text-black">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Kombo Tertinggi:</span>
                  <span className="font-black text-purple-600">{maxCombo}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Perisai Dipulihkan:</span>
                  <span className="font-black text-emerald-600">3 / 3 Penuh!</span>
                </div>
              </div>

              {currentMissionIdx + 1 < MISSIONS_CONFIG.length && (
                <div className="bg-purple-100 border-2 border-black p-2 sm:p-2.5 rounded-xl text-left text-[11px] sm:text-xs font-mono text-purple-950">
                  <span className="font-bold block">💡 Info Babak Berikutnya:</span>
                  <span>{MISSIONS_CONFIG[currentMissionIdx + 1].subtitle}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={handleNextMission}
                  className="flex-[2] py-2.5 sm:py-3 bg-purple-400 hover:bg-purple-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>
                    {currentMissionIdx + 1 < MISSIONS_CONFIG.length
                      ? `LANJUT KE BABAK ${currentMission.mission + 1} (TEKAN ENTER)`
                      : 'LIHAT KEMENANGAN AKHIR'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFinishGame}
                  className="flex-1 py-2.5 sm:py-3 bg-slate-200 hover:bg-slate-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  title="Selesai bermain dan keluar"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SELESAI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 3: PAUSED SCREEN ───────────────────────────────── */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="max-w-xs w-full bg-white border-3 sm:border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_#000] text-center space-y-3 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-11 h-11 bg-amber-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
                ⏸️
              </div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-black">Permainan Dijeda</h3>
              <p className="text-[11px] text-slate-600 font-mono">
                Tekan tombol ESC atau tombol di bawah untuk melanjutkan.
              </p>
              <button
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 bg-purple-400 hover:bg-purple-300 border-2 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                LANJUTKAN PERMAINAN
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL 4: GAME OVER SCREEN ────────────────────────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="max-w-md w-full bg-white border-3 sm:border-4 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] text-center space-y-2.5 sm:space-y-3.5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-400 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000]">
                💥
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-rose-200 border border-black rounded-full text-[10px] sm:text-xs font-mono font-black shadow-[1px_1px_0px_0px_#000] uppercase text-rose-950">
                  {gameOverReason === 'time_up' ? 'Waktu Babak Habis!' : 'Nyawa Habis!'}
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-black">
                  {gameOverReason === 'time_up' ? 'Ayo Coba Lagi!' : 'Perisai Terkuras!'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-mono leading-relaxed">
                  {gameOverReason === 'time_up'
                    ? `Target kata belum tercapai (${missionWordCount} dari ${currentMission.targetCount} kata). Tekan tombol untuk mengulang babak ini!`
                    : 'Kamu melakukan kesalahan ketik sebanyak 3 kali. Tenang, latih kembali ketelitian Caps Lock-mu!'}
                </p>
              </div>

              <div className="bg-slate-100 border-2 border-black p-2.5 sm:p-3 rounded-xl text-left font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Babak Terakhir:</span>
                  <span className="font-black text-black">Babak {currentMission.mission}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600">Skor Diperoleh:</span>
                  <span className="font-black text-emerald-600">{score}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                {gameOverReason === 'time_up' ? (
                  <button
                    onClick={handleRetryCurrentMission}
                    className="flex-[2] py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ULANGI BABAK {currentMission.mission} (ENTER)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartGame}
                    className="flex-[2] py-2.5 sm:py-3 bg-rose-400 hover:bg-rose-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ULANGI DARI AWAL (ENTER)</span>
                  </button>
                )}
                <button
                  onClick={handleFinishGame}
                  className="flex-1 py-2.5 sm:py-3 bg-slate-200 hover:bg-slate-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  title="Selesai bermain dan keluar"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SELESAI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 5: VICTORY SCREEN (GRAND FINALE) ────────────────── */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="max-w-md sm:max-w-lg w-full bg-white border-3 sm:border-4 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] text-center space-y-2.5 sm:space-y-3.5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-amber-300 border-2 sm:border-3 border-black rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_#000] animate-bounce">
                👑
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-amber-200 border border-black rounded-full text-[10px] sm:text-xs font-mono font-black shadow-[1px_1px_0px_0px_#000] uppercase text-black">
                  Kemenangan Puncak Grand Finale!
                </span>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Master Caps Lock Sejati!
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-mono">
                  Luar biasa! Kamu telah menuntaskan seluruh 5 babak <strong>Mode Berteriak vs Berbisik</strong> dengan ketangkasan Caps Lock yang sempurna!
                </p>
              </div>

              <div className="bg-purple-50 border-2 sm:border-3 border-black p-3 sm:p-3.5 rounded-xl space-y-1.5 text-left font-mono text-xs shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Skor Akhir:</span>
                  <span className="font-heading font-black text-base sm:text-lg text-purple-600">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Kata Terselesaikan:</span>
                  <span className="font-black text-black">{wordCount} Kata</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Rentetan Kombo Terbaik:</span>
                  <span className="font-black text-rose-600">{maxCombo}x Kombo</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={handleFinishGame}
                  className="flex-[2] py-2.5 sm:py-3 bg-emerald-400 hover:bg-emerald-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SELESAI (TEKAN ENTER)</span>
                </button>
                <button
                  onClick={handleStartGame}
                  className="flex-1 py-2.5 sm:py-3 bg-amber-300 hover:bg-amber-200 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>MAIN LAGI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CSS KEYFRAMES & UTILITIES ──────────────────────────────── */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes shakeError {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-8px); }
                40%, 80% { transform: translateX(8px); }
              }

              @keyframes bounceSlow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }

              .animate-shake {
                animation: shakeError 0.4s ease-in-out;
              }

              .animate-bounce-slow {
                animation: bounceSlow 2s ease-in-out infinite;
              }

              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-none {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `,
          }}
        />
      </div>
    </div>
  );
}
