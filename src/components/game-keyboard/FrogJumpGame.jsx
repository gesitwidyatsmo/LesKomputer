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
  ArrowRight,
} from 'lucide-react';
import { frogAudio } from '@/lib/frogAudio';

// ─── KONFIGURASI 5 EKSPEDISI SUNGAI (~4.5 - 5 MENIT TOTAL) ────────────
const WAVES_CONFIG = [
  {
    wave: 1,
    title: 'Babak 1: Arus Tenang & Teratai Lebar',
    subtitle: 'Fokus: Pembiasaan jempol menekan 1x Spacebar secara rileks',
    duration: 45, // detik
    targetCount: 15,
    riverSpeed: 40, // pixel/detik arus hanyut ke kiri
    allowDoubleJump: false,
    doubleGapChance: 0,
    hasSinkingPads: false,
    hasObstacles: false,
    dragonflyChance: 0.25,
    tip: 'Arus sungai mengalir ke kiri! Tekan Spacebar 1x saat teratai di depanmu mendekat sebelum teratai yang kamu injak hanyut ke pusaran kiri.',
  },
  {
    wave: 2,
    title: 'Babak 2: Celah Air Dalam & Lompat Ganda',
    subtitle: 'Fokus: Ketukan 2x Spacebar cepat untuk Lompat Ganda (Double Jump)',
    duration: 50,
    targetCount: 20,
    riverSpeed: 48,
    allowDoubleJump: true,
    doubleGapChance: 0.38,
    hasSinkingPads: false,
    hasObstacles: false,
    dragonflyChance: 0.35,
    tip: 'Awas celah lebar bertanda [2x SPASI]! Jika hanya tekan 1x kamu akan jatuh ke air. Tekan tombol Spacebar DUA KALI CEPAT untuk melompat 2x lebih jauh!',
  },
  {
    wave: 3,
    title: 'Babak 3: Teratai Menguncup & Arus Beriak',
    subtitle: 'Fokus: Menjaga ritme lompatan sebelum teratai tenggelam',
    duration: 60,
    targetCount: 22,
    riverSpeed: 55,
    allowDoubleJump: true,
    doubleGapChance: 0.42,
    hasSinkingPads: true,
    hasObstacles: false,
    dragonflyChance: 0.45,
    tip: 'Teratai kuning akan tenggelam dalam 2.8 detik setelah diinjak! Jaga ritme jempolmu dan tangkap capung terbang untuk kombo poin.',
  },
  {
    wave: 4,
    title: 'Babak 4: Batang Kayu Berduri & Teratai Emas',
    subtitle: 'Fokus: Refleks lompat ganda tinggi melewati rintangan kayu',
    duration: 60,
    targetCount: 25,
    riverSpeed: 62,
    allowDoubleJump: true,
    doubleGapChance: 0.48,
    hasSinkingPads: true,
    hasObstacles: true,
    dragonflyChance: 0.5,
    tip: 'Batang kayu berduri menghalangi jalan! Kamu WAJIB menggunakan Lompat Ganda (2x Spacebar) agar melambung tinggi melewati duri kayu.',
  },
  {
    wave: 5,
    title: 'Babak 5: Arung Jeram Pamungkas (Grand Finale)',
    subtitle: 'Fokus: Ketangkasan puncak jempol menuju Dermaga Teratai Emas',
    duration: 70,
    targetCount: 30,
    riverSpeed: 70,
    allowDoubleJump: true,
    doubleGapChance: 0.52,
    hasSinkingPads: true,
    hasObstacles: true,
    dragonflyChance: 0.6,
    tip: 'Arus sungai semakin deras! Kombinasikan lompat biasa dan lompat ganda dengan tangkas sampai ke Dermaga Teratai Emas Kerajaan Katak!',
  },
];

export default function FrogJumpGame() {
  // Game states
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'wave_clear' | 'paused' | 'gameover' | 'victory'
  const [currentWaveIdx, setCurrentWaveIdx] = useState(0);
  const [waveCountdown, setWaveCountdown] = useState(3);
  const [transitionCountdown, setTransitionCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(WAVES_CONFIG[0].duration);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [waveJumpCount, setWaveJumpCount] = useState(0);
  const [doubleJumpCount, setDoubleJumpCount] = useState(0);
  const [dragonflyCaught, setDragonflyCaught] = useState(0);
  const [lives, setLives] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const [spacePressedVisual, setSpacePressedVisual] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nearWhirlpoolWarning, setNearWhirlpoolWarning] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastSpaceTapTimeRef = useRef(0);
  const lastJumpTimeRef = useRef(0);

  const currentWave = WAVES_CONFIG[currentWaveIdx] || WAVES_CONFIG[0];

  // Ref untuk objek gameplay yang terus diupdate di loop
  const gameEntitiesRef = useRef({
    frog: {
      x: 200,
      y: 0,
      baseY: 0,
      currentPadId: null,
      state: 'standing', // 'standing' | 'jumping' | 'double_jumping' | 'falling' | 'respawning'
      hasDoubleJumped: false,
      jumpProgress: 0,
      jumpStartX: 200,
      jumpStartY: 0,
      jumpTargetX: 370,
      jumpTargetY: 0,
      jumpHeight: 52,
      rotation: 0,
      rescuingTimer: 0,
    },
    pads: [],
    obstacles: [],
    dragonflies: [],
    waterParticles: [],
    sparkleParticles: [],
    floatingTexts: [],
    waveRipples: [],
    scrollOffset: 0,
    nextPadId: 1,
    riverTime: 0,
    endJettySpawned: false,
  });

  // Toggle suara
  const handleToggleSound = () => {
    const next = frogAudio.toggleSound();
    setSoundOn(next);
  };

  // Toggle layar penuh
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
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // ─── INISIALISASI LEVEL / BABAK ─────────────────────────────────────
  const initWave = useCallback(
    (waveIdx) => {
      const cfg = WAVES_CONFIG[waveIdx];
      setCurrentWaveIdx(waveIdx);
      setTimeLeft(cfg.duration);
      setWaveJumpCount(0);
      setNearWhirlpoolWarning(false);
      // Pulihkan nyawa kembali penuh (3 hati/pelampung) saat masuk babak baru
      setLives(3);

      const canvas = canvasRef.current;
      const width = canvas ? canvas.width : 840;
      const height = canvas ? canvas.height : 472;
      const waterY = height * 0.62;

      const entities = gameEntitiesRef.current;
      entities.scrollOffset = 0;
      entities.pads = [];
      entities.obstacles = [];
      entities.dragonflies = [];
      entities.waterParticles = [];
      entities.sparkleParticles = [];
      entities.floatingTexts = [];
      entities.waveRipples = [];
      entities.nextPadId = 1;
      entities.endJettySpawned = false;

      // Pijakan awal teratai di mana katak berdiri (x = 240)
      const firstPad = {
        id: entities.nextPadId++,
        x: 240,
        y: waterY,
        radius: 48,
        type: 'start', // 'start' | 'normal' | 'gold' | 'sinking' | 'jetty'
        sinkTimer: 0,
        sunk: false,
        flowerAngle: 0.2,
      };
      entities.pads.push(firstPad);

      // Siapkan deretan teratai berikutnya di depan
      let curX = 240;
      for (let i = 0; i < 7; i++) {
        const isDoubleGap = cfg.allowDoubleJump && Math.random() < cfg.doubleGapChance && i > 1;
        // Jarak teratai: Jika normal = 170px (jangkauan 1x spasi). Jika double gap = 300px (jangkauan 2x spasi)!
        const gap = isDoubleGap ? 300 : 170;
        curX += gap;

        let padType = 'normal';
        if (cfg.hasSinkingPads && Math.random() < 0.35) {
          padType = 'sinking';
        } else if (cfg.hasObstacles && Math.random() < 0.25) {
          padType = 'gold';
        }

        const pad = {
          id: entities.nextPadId++,
          x: curX,
          y: waterY + (Math.sin(i * 1.4) * 14),
          radius: padType === 'gold' ? 42 : 46,
          type: padType,
          sinkTimer: 0,
          sunk: false,
          isDoubleGap,
          flowerAngle: Math.random() * Math.PI * 2,
        };
        entities.pads.push(pad);

        // Peluang serangga capung di atas teratai
        if (Math.random() < cfg.dragonflyChance) {
          entities.dragonflies.push({
            id: Math.random(),
            x: curX,
            y: pad.y - 75 - Math.random() * 25,
            baseY: pad.y - 75,
            bobblePhase: Math.random() * Math.PI * 2,
            gold: Math.random() < 0.3,
            collected: false,
          });
        }

        // Rintangan batang kayu berduri jika double gap
        if (cfg.hasObstacles && isDoubleGap) {
          entities.obstacles.push({
            id: Math.random(),
            x: curX - 150, // tepat di tengah celah 300px
            y: waterY + 4,
            width: 56,
            height: 24,
            active: true,
          });
        }
      }

      // Reset posisi katak di atas pad pertama
      entities.frog = {
        x: firstPad.x,
        y: firstPad.y - 18,
        baseY: firstPad.y - 18,
        currentPadId: firstPad.id,
        state: 'standing',
        hasDoubleJumped: false,
        jumpProgress: 0,
        jumpStartX: firstPad.x,
        jumpStartY: firstPad.y - 18,
        jumpTargetX: firstPad.x + 170,
        jumpTargetY: firstPad.y - 18,
        jumpHeight: 52,
        rotation: 0,
        rescuingTimer: 0,
      };

      // Set kamera tepat membidik katak
      entities.scrollOffset = firstPad.x - width * 0.28;

      frogAudio.playWaveStart();
    },
    []
  );

  // ─── START GAME FLOW ────────────────────────────────────────────────
  const handleStartGame = () => {
    frogAudio.init();
    frogAudio.playRibbit();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setJumpCount(0);
    setDoubleJumpCount(0);
    setDragonflyCaught(0);
    setLives(3);
    setCurrentWaveIdx(0);
    setWaveCountdown(3);
    setGameState('countdown');
  };

  // Countdown 3, 2, 1 sebelum babak dimulai
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (waveCountdown > 0) {
      const timer = setTimeout(() => {
        setWaveCountdown((prev) => prev - 1);
        if (waveCountdown > 1) {
          frogAudio.playJump();
        } else {
          frogAudio.playWaveStart();
        }
      }, 900);
      return () => clearTimeout(timer);
    } else {
      initWave(currentWaveIdx);
      setGameState('playing');
    }
  }, [gameState, waveCountdown, currentWaveIdx, initWave]);

  // Transisi antar babak countdown
  useEffect(() => {
    if (gameState !== 'wave_clear') return;

    if (transitionCountdown > 0) {
      const timer = setTimeout(() => {
        setTransitionCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextWave();
    }
  }, [gameState, transitionCountdown]);

  const handleNextWave = () => {
    const nextIdx = currentWaveIdx + 1;
    if (nextIdx < WAVES_CONFIG.length) {
      setCurrentWaveIdx(nextIdx);
      setWaveCountdown(3);
      setTransitionCountdown(5);
      setGameState('countdown');
      // Pulihkan nyawa kembali penuh (3 hati/pelampung) saat naik ke babak baru
      setLives(3);
    } else {
      // Tamat seluruh 5 babak!
      setGameState('victory');
      frogAudio.playVictory();
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
      });
    }
  };

  // Timer game berjalan per detik
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Waktu habis: Jika target lompatan tercapai, lolos
          setGameState((curr) => {
            if (curr === 'playing') {
              frogAudio.playWaveStart();
              return 'wave_clear';
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

  // ─── SPAWN ENTITAS BARU SECARA BERLANJUT KE KANAN ────────────────────
  const ensureNextPads = useCallback(
    (cfg, entities, width, height) => {
      const waterY = height * 0.62;
      const rightEdge = entities.scrollOffset + width + 400;

      // Ambil teratai paling kanan
      const lastPad = entities.pads[entities.pads.length - 1];
      if (!lastPad) return;

      if (lastPad.x < rightEdge) {
        // Cek jika target babak hampir selesai, spawn Dermaga Teratai Emas
        const remainingToGoal = cfg.targetCount - waveJumpCount;
        const isGoalApproaching = remainingToGoal <= 2 && !entities.endJettySpawned;

        const isDoubleGap = !isGoalApproaching && cfg.allowDoubleJump && Math.random() < cfg.doubleGapChance;
        const gap = isDoubleGap ? 300 : 170;
        const newX = lastPad.x + gap;

        let padType = 'normal';
        let radius = 46;

        if (isGoalApproaching) {
          padType = 'jetty';
          radius = 65;
          entities.endJettySpawned = true;
        } else if (cfg.hasSinkingPads && Math.random() < 0.35) {
          padType = 'sinking';
        } else if (cfg.hasObstacles && Math.random() < 0.25) {
          padType = 'gold';
          radius = 42;
        }

        const newPad = {
          id: entities.nextPadId++,
          x: newX,
          y: waterY + (Math.sin(newX * 0.015) * 14),
          radius,
          type: padType,
          sinkTimer: 0,
          sunk: false,
          isDoubleGap,
          flowerAngle: Math.random() * Math.PI * 2,
        };
        entities.pads.push(newPad);

        if (Math.random() < cfg.dragonflyChance && !isGoalApproaching) {
          entities.dragonflies.push({
            id: Math.random(),
            x: newX,
            y: newPad.y - 75 - Math.random() * 25,
            baseY: newPad.y - 75,
            bobblePhase: Math.random() * Math.PI * 2,
            gold: Math.random() < 0.3,
            collected: false,
          });
        }

        if (cfg.hasObstacles && isDoubleGap) {
          entities.obstacles.push({
            id: Math.random(),
            x: newX - 150,
            y: waterY + 4,
            width: 56,
            height: 24,
            active: true,
          });
        }
      }

      // Bersihkan teratai yang sudah lewat jauh di sebelah kiri pusaran air
      const leftBound = entities.scrollOffset - 300;
      entities.pads = entities.pads.filter((p) => p.x > leftBound);
      entities.obstacles = entities.obstacles.filter((o) => o.x > leftBound);
      entities.dragonflies = entities.dragonflies.filter((d) => d.x > leftBound);
    },
    [waveJumpCount]
  );

  // ─── LOGIKA EKSEKUSI LOMPATAN (SPACEBAR HANDLER PRESISI) ───────────
  const triggerFrogJump = useCallback(() => {
    if (gameState !== 'playing') return;

    const entities = gameEntitiesRef.current;
    const frog = entities.frog;
    const cfg = currentWave;
    const now = performance.now();
    const timeSinceLastTap = now - lastSpaceTapTimeRef.current;
    lastSpaceTapTimeRef.current = now;

    // Visual feedback indikator spacebar
    setSpacePressedVisual(true);
    setTimeout(() => setSpacePressedVisual(false), 160);

    // KASUS 1: Katak sedang melayang di udara dan menekan Spacebar lagi (LOMPAT GANDA!)
    if (
      frog.state === 'jumping' &&
      cfg.allowDoubleJump &&
      !frog.hasDoubleJumped &&
      frog.jumpProgress < 0.75
    ) {
      // Mulai fase dorongan kedua secara MULUS dari posisi katak SAAT INI (tanpa teleportasi!)
      const curX = frog.x;
      const curY = frog.y;

      frog.state = 'double_jumping';
      frog.hasDoubleJumped = true;
      frog.jumpStartX = curX;
      frog.jumpStartY = curY;
      // Berikan dorongan horizontal tambahan ~155px
      frog.jumpTargetX = curX + 155;
      frog.jumpTargetY = frog.baseY;
      frog.jumpHeight = 65; // Loncatan busur kedua dari ketinggian saat ini
      frog.jumpProgress = 0; // Mulai kurva baru dari 0 secara mulus
      frogAudio.playDoubleJump();
      setDoubleJumpCount((prev) => prev + 1);

      // Partikel ledakan bintang saat double jump
      for (let i = 0; i < 8; i++) {
        entities.sparkleParticles.push({
          x: frog.x,
          y: frog.y,
          vx: (Math.random() - 0.5) * 120,
          vy: (Math.random() - 0.5) * 120,
          color: '#FBBF24',
          life: 0,
          maxLife: 0.4,
        });
      }

      entities.floatingTexts.push({
        text: 'LOMPAT GANDA! 🚀',
        color: '#F59E0B',
        x: frog.x,
        y: frog.y - 32,
        opacity: 1,
        life: 0,
      });
      return;
    }

    // Jika sedang di udara dan sudah double jump, abaikan penekanan spasi berikutnya (ANTI-SPAM)
    if (frog.state === 'jumping' || frog.state === 'double_jumping') {
      return;
    }

    // KASUS 2: Katak sedang berdiri di atas teratai (LOMPATAN AWAL)
    if (frog.state === 'standing') {
      // Buffer jeda mendarat 0.08 detik agar stabil
      if (now - lastJumpTimeRef.current < 80) return;
      lastJumpTimeRef.current = now;

      // Cek apakah ketukan ini merupakan ketukan ganda instan di tanah (< 240ms)
      const isInstantDouble = cfg.allowDoubleJump && timeSinceLastTap < 240;

      if (isInstantDouble) {
        // Langsung lompatan ganda sejauh 310px
        frog.state = 'double_jumping';
        frog.hasDoubleJumped = true;
        frog.jumpStartX = frog.x;
        frog.jumpStartY = frog.y;
        frog.jumpTargetX = frog.x + 310;
        frog.jumpTargetY = frog.y;
        frog.jumpProgress = 0;
        frog.jumpHeight = 105;
        frog.rotation = 0;
        frogAudio.playDoubleJump();
        setDoubleJumpCount((prev) => prev + 1);

        entities.floatingTexts.push({
          text: 'SUPER JUMP! ⚡',
          color: '#3B82F6',
          x: frog.x,
          y: frog.y - 28,
          opacity: 1,
          life: 0,
        });
      } else {
        // Lompatan biasa 1x Spasi sejauh 170px
        frog.state = 'jumping';
        frog.hasDoubleJumped = false;
        frog.jumpStartX = frog.x;
        frog.jumpStartY = frog.y;
        frog.jumpTargetX = frog.x + 170;
        frog.jumpTargetY = frog.y;
        frog.jumpProgress = 0;
        frog.jumpHeight = 52;
        frog.rotation = 0;
        frogAudio.playJump();
      }

      // Efek riak air awal saat melompat
      entities.waveRipples.push({
        x: frog.x,
        y: frog.y + 16,
        radius: 10,
        maxRadius: 36,
        opacity: 0.8,
      });
    }
  }, [gameState, currentWave]);

  // Event listener Spacebar global (mencegah scroll halaman & pemicu game)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault(); // Mencegah halaman ter-scroll ke bawah!
        if (gameState === 'idle') {
          handleStartGame();
        } else if (gameState === 'playing') {
          triggerFrogJump();
        } else if (gameState === 'wave_clear') {
          handleNextWave();
        } else if (gameState === 'gameover') {
          handleStartGame();
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, triggerFrogJump]);

  // ─── GAME LOOP UTAMA (CANVAS ANIMATION 60 FPS) ───────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const gameLoop = (timestamp) => {
      if (!isRunning) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = timestamp;

      const width = canvas.width;
      const height = canvas.height;
      const entities = gameEntitiesRef.current;
      entities.riverTime += dt;

      // ── 1. UPDATE GAME STATE JIKA SEDANG BERMAIN ─────────────────────
      if (gameState === 'playing') {
        const frog = entities.frog;
        const cfg = currentWave;
        const currentSpeed = cfg.riverSpeed;

        // A. ARUS SUNGAI: Semua teratai, rintangan, serangga & riak dihanyutkan arus ke arah kiri!
        entities.pads.forEach((pad) => {
          pad.x -= currentSpeed * dt;
        });
        entities.obstacles.forEach((obs) => {
          obs.x -= currentSpeed * dt;
        });
        entities.dragonflies.forEach((df) => {
          df.x -= currentSpeed * dt;
        });
        entities.waveRipples.forEach((wr) => {
          wr.x -= currentSpeed * dt;
        });
        entities.floatingTexts.forEach((ft) => {
          ft.x -= currentSpeed * dt;
        });

        // B. KATAK MENGIKUTI PAD JIKA BERDIRI (TERBAWA ARUS KE KIRI JIKA DIAM)
        if (frog.state === 'standing') {
          const currentPad = entities.pads.find((p) => p.id === frog.currentPadId);
          if (currentPad) {
            frog.x = currentPad.x;
            frog.y = currentPad.y - 18;
            frog.baseY = currentPad.y - 18;

            // Jika teratai jenis sinking, hitung timer tenggelam
            if (currentPad.type === 'sinking') {
              currentPad.sinkTimer += dt;
              if (currentPad.sinkTimer > 2.8) {
                currentPad.sunk = true;
                frog.state = 'falling';
                entities.floatingTexts.push({
                  text: 'TERATAI TENGGELAM! 🌊',
                  color: '#3B82F6',
                  x: frog.x,
                  y: frog.y - 20,
                  opacity: 1,
                  life: 0,
                });
              }
            }
          }
        }

        // C. KAMERA HANYA BERGERAK MAJU (KE KANAN) SAAT KATAK MELOMPAT KE DEPAN!
        // Kamera TIDAK IKUT MUNDUR ke kiri ketika teratai & katak dihanyutkan arus sungai.
        // Dengan cara ini, pemain JELAS MELIHAT daun teratai dan katak bergerak hanyut ke kiri!
        const forwardThreshold = frog.x - width * 0.28;
        if (forwardThreshold > entities.scrollOffset) {
          entities.scrollOffset += (forwardThreshold - entities.scrollOffset) * Math.min(1, 6 * dt);
        }

        ensureNextPads(cfg, entities, width, height);

        // D. DETEKSI BAHAYA PUSARAN AIR KIRI (LEFT DANGER ZONE)
        // Diukur relatif terhadap kamera kanvas (screenX)
        const frogScreenX = frog.x - entities.scrollOffset;
        if (frogScreenX < 140 && frog.state === 'standing') {
          setNearWhirlpoolWarning(true);
        } else {
          setNearWhirlpoolWarning(false);
        }

        if (frogScreenX < 65 && frog.state === 'standing') {
          // Terseret masuk ke dalam pusaran air kiri!
          frog.state = 'falling';
          frogAudio.playSplash();
          entities.floatingTexts.push({
            text: 'TERBAWA ARUS PUSARAN! 🌊⚠️',
            color: '#EF4444',
            x: frog.x,
            y: frog.y - 25,
            opacity: 1,
            life: 0,
          });
        }

        // E. UPDATE ANIMASI LOMPATAN KATAK
        if (frog.state === 'jumping' || frog.state === 'double_jumping') {
          const jumpSpeed = frog.state === 'double_jumping' ? 2.2 : 2.4;
          frog.jumpProgress += dt * jumpSpeed;

          const p = Math.min(frog.jumpProgress, 1);
          frog.x = frog.jumpStartX + (frog.jumpTargetX - frog.jumpStartX) * p;

          // Kurva parabola lompat: 4 * h * p * (1 - p)
          const arc = 4 * frog.jumpHeight * p * (1 - p);
          frog.y = frog.jumpStartY + (frog.jumpTargetY - frog.jumpStartY) * p - arc;

          // Rotasi salto jika double jump
          if (frog.state === 'double_jumping') {
            frog.rotation = p * Math.PI * 2;
          } else {
            frog.rotation = Math.sin(p * Math.PI) * 0.25;
          }

          // Cek tabrakan dengan serangga di udara
          entities.dragonflies.forEach((d) => {
            if (!d.collected) {
              const dist = Math.hypot(frog.x - d.x, frog.y - d.y);
              if (dist < 42) {
                d.collected = true;
                const bonusPts = d.gold ? 250 : 100;
                setScore((s) => s + bonusPts);
                setCombo((c) => {
                  const nc = c + 1;
                  setMaxCombo((m) => Math.max(m, nc));
                  frogAudio.playEatInsect(nc);
                  return nc;
                });
                setDragonflyCaught((cnt) => cnt + 1);

                entities.floatingTexts.push({
                  text: d.gold ? '+250 ⭐' : '+100 🦟',
                  color: d.gold ? '#FBBF24' : '#10B981',
                  x: d.x,
                  y: d.y - 18,
                  opacity: 1,
                  life: 0,
                });
              }
            }
          });

          // Cek tabrakan dengan rintangan batang kayu berduri
          if (cfg.hasObstacles) {
            entities.obstacles.forEach((obs) => {
              if (obs.active && Math.abs(frog.x - obs.x) < obs.width / 2 + 8) {
                // Kayu berduri ada di air dengan tinggi duri hingga waterY - 24
                // Jika tinggi katak menyentuh duri (hanya lompat biasa yang ketinggiannya rendah)
                if (frog.y > obs.y - 24) {
                  obs.active = false;
                  frogAudio.playObstacleHit();
                  frog.state = 'falling';
                  setCombo(0);
                  entities.floatingTexts.push({
                    text: 'TERBENTUR KAYU! BUTUH LOMPAT GANDA ⚠️',
                    color: '#EF4444',
                    x: frog.x,
                    y: frog.y - 20,
                    opacity: 1,
                    life: 0,
                  });
                }
              }
            });
          }

          // SAAT PENDARATAN (jumpProgress >= 1)
          if (frog.jumpProgress >= 1 && frog.state !== 'falling') {
            // DETEKSI PENDARATAN BERBASIS RADIUS TERATAI SEBENARNYA
            const landedPad = entities.pads.find(
              (p) => Math.abs(frog.x - p.x) <= p.radius + 14 && !p.sunk
            );

            if (landedPad) {
              // MENDARAT SUKSES!
              frog.state = 'standing';
              frog.currentPadId = landedPad.id;
              frog.x = landedPad.x;
              frog.y = landedPad.y - 18;
              frog.baseY = landedPad.y - 18;
              frog.rotation = 0;
              frog.jumpProgress = 0;
              frog.hasDoubleJumped = false;

              frogAudio.playLand();

              // Cek jika mendarat di Dermaga Teratai Emas Akhir Babak
              if (landedPad.type === 'jetty') {
                frogAudio.playWaveStart();
                setGameState('wave_clear');
                confetti({ particleCount: 70, spread: 70, origin: { y: 0.55 } });
              }

              // Skor & kombo
              const basePoints = landedPad.type === 'gold' ? 300 : landedPad.type === 'jetty' ? 500 : 100;
              const bonusDouble = frog.state === 'double_jumping' ? 50 : 0;
              setScore((s) => s + basePoints + bonusDouble);
              setJumpCount((j) => j + 1);

              setWaveJumpCount((wj) => {
                const nextWj = wj + 1;
                if (nextWj >= cfg.targetCount && landedPad.type !== 'jetty') {
                  setTimeout(() => {
                    frogAudio.playWaveStart();
                    setGameState('wave_clear');
                    confetti({ particleCount: 70, spread: 70, origin: { y: 0.55 } });
                  }, 400);
                }
                return nextWj;
              });

              setCombo((c) => {
                const nc = c + 1;
                setMaxCombo((m) => Math.max(m, nc));
                return nc;
              });

              if (landedPad.type === 'gold') {
                frogAudio.playGoldChime();
              }

              // Efek riak air & percikan
              entities.waveRipples.push({
                x: landedPad.x,
                y: landedPad.y + 12,
                radius: 8,
                maxRadius: 42,
                opacity: 0.9,
              });

              for (let i = 0; i < 6; i++) {
                entities.waterParticles.push({
                  x: landedPad.x,
                  y: landedPad.y + 8,
                  vx: (Math.random() - 0.5) * 80,
                  vy: -Math.random() * 50 - 20,
                  radius: Math.random() * 3 + 2,
                  life: 0,
                  maxLife: 0.45,
                });
              }

              entities.floatingTexts.push({
                text: landedPad.type === 'gold' ? '+300 ⭐ EMAS!' : landedPad.type === 'jetty' ? '+500 👑 DERMAGA!' : '+100',
                color: landedPad.type === 'gold' ? '#F59E0B' : landedPad.type === 'jetty' ? '#E11D48' : '#059669',
                x: landedPad.x,
                y: landedPad.y - 36,
                opacity: 1,
                life: 0,
              });
            } else {
              // MELESET JATUH KE AIR KOSONG!
              // (Misal: menekan 1x spasi pada celah ganda 300px sehingga mendarat di air kosong pada titik 170px)
              frog.state = 'falling';
              entities.floatingTexts.push({
                text: 'KELEWATAN / KURANG JAUH! 🌊',
                color: '#EF4444',
                x: frog.x,
                y: frog.y - 20,
                opacity: 1,
                life: 0,
              });
            }
          }
        }

        // F. PENANGANAN KATAK TERJATUH / TERCEBUR
        if (frog.state === 'falling') {
          frogAudio.playSplash();
          frog.y += dt * 160;

          // Efek cipratan air byuur
          for (let i = 0; i < 10; i++) {
            entities.waterParticles.push({
              x: frog.x,
              y: height * 0.65,
              vx: (Math.random() - 0.5) * 110,
              vy: -Math.random() * 80 - 30,
              radius: Math.random() * 4 + 2,
              life: 0,
              maxLife: 0.6,
            });
          }

          // Kurangi 1 nyawa
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('gameover');
            }
            return nextL;
          });
          setCombo(0);

          frog.state = 'respawning';
          frog.rescuingTimer = 0;
        }

        if (frog.state === 'respawning') {
          frog.rescuingTimer += dt;
          if (frog.rescuingTimer > 0.85) {
            // Temukan teratai di depan layar yang tidak tenggelam
            const safePad = entities.pads.find(
              (p) => p.x > entities.scrollOffset + 160 && !p.sunk
            ) || entities.pads[0];

            if (safePad) {
              frog.x = safePad.x;
              frog.y = safePad.y - 18;
              frog.baseY = safePad.y - 18;
              frog.currentPadId = safePad.id;
              frog.state = 'standing';
              frog.rotation = 0;
              frog.jumpProgress = 0;
              frog.hasDoubleJumped = false;
              entities.scrollOffset = safePad.x - width * 0.28;
              frogAudio.playRibbit();
            }
          }
        }

        // G. UPDATE PARTIKEL & TEKS MELAYANG
        entities.waterParticles.forEach((wp) => {
          wp.life += dt;
          wp.x += wp.vx * dt;
          wp.y += wp.vy * dt;
          wp.vy += 220 * dt;
        });
        entities.waterParticles = entities.waterParticles.filter((wp) => wp.life < wp.maxLife);

        entities.sparkleParticles.forEach((sp) => {
          sp.life += dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
        });
        entities.sparkleParticles = entities.sparkleParticles.filter((sp) => sp.life < sp.maxLife);

        entities.floatingTexts.forEach((ft) => {
          ft.life += dt;
          ft.y -= 35 * dt;
          ft.opacity = Math.max(0, 1 - ft.life / 0.85);
        });
        entities.floatingTexts = entities.floatingTexts.filter((ft) => ft.life < 0.85);

        entities.waveRipples.forEach((wr) => {
          wr.radius += 35 * dt;
          wr.opacity = Math.max(0, 1 - wr.radius / wr.maxRadius);
        });
        entities.waveRipples = entities.waveRipples.filter((wr) => wr.radius < wr.maxRadius);
      }

      // ── 2. RENDERING CANVAS CANTIK & RETRO NEOBRUTALISM ─────────────
      ctx.clearRect(0, 0, width, height);
      const camX = entities.scrollOffset;

      // A. Latar Belakang Langit & Awan
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#BAE6FD');
      skyGrad.addColorStop(0.45, '#E0F2FE');
      skyGrad.addColorStop(0.55, '#38BDF8');
      skyGrad.addColorStop(1, '#0284C7');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Awan putih mengambang
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 6; i++) {
        const cloudX = ((i * 260 - camX * 0.12) % (width + 250)) - 100;
        const cloudY = 35 + (i % 3) * 20;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 24, 0, Math.PI * 2);
        ctx.arc(cloudX + 22, cloudY - 9, 28, 0, Math.PI * 2);
        ctx.arc(cloudX + 48, cloudY, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tepian Seberang Rumput
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      for (let x = 0; x <= width; x += 40) {
        const grassH = Math.sin((x + camX * 0.25) * 0.02) * 12;
        ctx.lineTo(x, height * 0.45 + grassH);
      }
      ctx.lineTo(width, height * 0.52);
      ctx.lineTo(0, height * 0.52);
      ctx.closePath();
      ctx.fill();

      // B. Sungai & Garis Arus Horizontal (Mengalir ke Kiri)
      const waterY = height * 0.52;
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, waterY, width, height - waterY);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.5;
      for (let row = 0; row < 5; row++) {
        const ry = waterY + 35 + row * 45;
        const offset = (entities.riverTime * 85 + row * 110) % width;
        ctx.beginPath();
        ctx.moveTo(width - offset, ry);
        ctx.lineTo(Math.max(0, width - offset - 150), ry);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - offset + width, ry);
        ctx.lineTo(Math.max(0, width - offset + width - 150), ry);
        ctx.stroke();
      }

      // C. ZONA BAHAYA PUSARAN AIR TEPI KIRI (WHIRLPOOL WATERFALL) 🌊⚠️
      // Terlihat jelas di tepi kiri kanvas sebagai pembatas maut jika anak diam
      const whirlpoolWidth = 85;
      const wpGrad = ctx.createLinearGradient(0, waterY, whirlpoolWidth, waterY);
      wpGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)'); // Gelap palung air
      wpGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.4)');
      wpGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = wpGrad;
      ctx.fillRect(0, waterY, whirlpoolWidth, height - waterY);

      // Pusaran berputar spiral di kiri
      ctx.save();
      ctx.translate(35, waterY + 60);
      ctx.rotate(-entities.riverTime * 4);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const r = a * 6;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.5;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Tiang tanda peringatan batas bahaya arus
      ctx.save();
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(10, waterY + 10, 48, 24, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'black 11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ ARUS', 34, waterY + 26);
      ctx.restore();

      // D. Render Riak Air Teratai
      entities.waveRipples.forEach((wr) => {
        const screenX = wr.x - camX;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${wr.opacity})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(screenX, wr.y, wr.radius * 1.5, wr.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // E. Render Rintangan Batang Kayu Berduri
      entities.obstacles.forEach((obs) => {
        if (!obs.active) return;
        const screenX = obs.x - camX;
        if (screenX < -100 || screenX > width + 100) return;

        ctx.save();
        // Batang Kayu
        ctx.fillStyle = '#78350F';
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(screenX - obs.width / 2, obs.y - obs.height / 2, obs.width, obs.height, 8);
        ctx.fill();
        ctx.stroke();

        // Duri tajam menjulang
        ctx.fillStyle = '#DC2626';
        for (let s = -obs.width / 2 + 10; s < obs.width / 2; s += 16) {
          ctx.beginPath();
          ctx.moveTo(screenX + s - 5, obs.y - obs.height / 2);
          ctx.lineTo(screenX + s, obs.y - obs.height / 2 - 16);
          ctx.lineTo(screenX + s + 5, obs.y - obs.height / 2);
          ctx.closePath();
          ctx.fill();
        }

        // Tanda peringatan "LOMPAT TINGGI!"
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.strokeText('2x SPASI', screenX, obs.y - obs.height / 2 - 20);
        ctx.fillText('2x SPASI', screenX, obs.y - obs.height / 2 - 20);

        ctx.restore();
      });

      // F. Render Daun Teratai (Lily Pads)
      entities.pads.forEach((pad) => {
        const screenX = pad.x - camX;
        if (screenX < -120 || screenX > width + 120) return;

        ctx.save();
        ctx.translate(screenX, pad.y);

        let scale = 1;
        if (pad.type === 'sinking' && pad.sinkTimer > 0) {
          scale = Math.max(0.2, 1 - (pad.sinkTimer / 2.8) * 0.6);
        }

        // Bayangan daun teratai
        ctx.fillStyle = 'rgba(12, 74, 96, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 8, pad.radius * scale, (pad.radius * 0.5) * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Badan Daun Teratai
        let padColor = '#10B981';
        let padBorder = '#047857';

        if (pad.type === 'jetty') {
          padColor = '#F59E0B'; // Emas Dermaga
          padBorder = '#78350F';
        } else if (pad.type === 'gold') {
          padColor = '#FBBF24';
          padBorder = '#B45309';
        } else if (pad.type === 'sinking') {
          padColor = pad.sinkTimer > 1.8 ? '#F87171' : '#FDE047';
          padBorder = pad.sinkTimer > 1.8 ? '#B91C1C' : '#CA8A04';
        }

        ctx.fillStyle = padColor;
        ctx.strokeStyle = padBorder;
        ctx.lineWidth = 3.5;

        // Lingkaran teratai dengan lekukan celah khas V
        ctx.beginPath();
        ctx.arc(0, 0, pad.radius * scale, 0.25, Math.PI * 1.85);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Garis urat daun teratai
        ctx.strokeStyle = padBorder;
        ctx.lineWidth = 1.5;
        for (let a = 0.5; a < Math.PI * 1.8; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * (pad.radius * 0.8) * scale, Math.sin(a) * (pad.radius * 0.8) * scale);
          ctx.stroke();
        }

        // Bunga Teratai Mekar
        if (pad.type === 'gold' || pad.type === 'jetty' || pad.type === 'start' || pad.id % 2 === 0) {
          const fx = Math.cos(pad.flowerAngle) * (pad.radius * 0.55) * scale;
          const fy = Math.sin(pad.flowerAngle) * (pad.radius * 0.55) * scale;
          ctx.fillStyle = pad.type === 'gold' ? '#FFFBEB' : pad.type === 'jetty' ? '#FEF08A' : '#F472B6';
          for (let p = 0; p < 5; p++) {
            const pa = (p * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.arc(fx + Math.cos(pa) * 5.5, fy + Math.sin(pa) * 5.5, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(fx, fy, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Label khusus jika Dermaga Akhir
        if (pad.type === 'jetty') {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'black 12px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.strokeText('👑 DERMAGA ISTANA', 0, -pad.radius * scale - 10);
          ctx.fillText('👑 DERMAGA ISTANA', 0, -pad.radius * scale - 10);
        }

        // Indikator Celah Lebar (2x Spasi) di antara teratai
        if (pad.isDoubleGap) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2.5;
          ctx.strokeText('⚡ 2x SPASI!', 0, -pad.radius * scale - 8);
          ctx.fillText('⚡ 2x SPASI!', 0, -pad.radius * scale - 8);
        }

        ctx.restore();
      });

      // G. Render Capung / Serangga di Udara
      entities.dragonflies.forEach((d) => {
        if (d.collected) return;
        const screenX = d.x - camX;
        if (screenX < -60 || screenX > width + 60) return;

        const bobbleY = d.baseY + Math.sin(entities.riverTime * 6 + d.bobblePhase) * 12;

        ctx.save();
        ctx.translate(screenX, bobbleY);

        const wingFlap = Math.sin(entities.riverTime * 35) * 8;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.ellipse(-12, -4 + wingFlap * 0.2, 12, 4, -0.2, 0, Math.PI * 2);
        ctx.ellipse(12, -4 - wingFlap * 0.2, 12, 4, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = d.gold ? '#F59E0B' : '#059669';
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-2, -8, 2, 0, Math.PI * 2);
        ctx.arc(2, -8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // H. Render Katak Lucu (Kimi si Katak)
      const frog = entities.frog;
      const screenFrogX = frog.x - camX;

      ctx.save();
      ctx.translate(screenFrogX, frog.y);
      ctx.rotate(frog.rotation);

      // Bayangan katak
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 20 - (frog.jumpProgress ? Math.sin(frog.jumpProgress * Math.PI) * 20 : 0), 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      let scaleX = 1;
      let scaleY = 1;
      if (frog.state === 'jumping' || frog.state === 'double_jumping') {
        const stretch = Math.sin(frog.jumpProgress * Math.PI) * 0.35;
        scaleX = 1 - stretch * 0.5;
        scaleY = 1 + stretch;
      }
      ctx.scale(scaleX, scaleY);

      // Kaki Belakang
      ctx.fillStyle = '#16A34A';
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.ellipse(-14, 8, 8, 12, -0.4, 0, Math.PI * 2);
      ctx.ellipse(14, 8, 8, 12, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Badan Katak
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Perut Kuning
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bandana Petualang
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.rect(-15, -9, 30, 5);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-15, -7);
      ctx.lineTo(-24, -12);
      ctx.lineTo(-22, -4);
      ctx.closePath();
      ctx.fill();

      // Mata Besar
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-8, -13, 7.5, 0, Math.PI * 2);
      ctx.arc(8, -13, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#14532D';
      ctx.stroke();

      // Pupil
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-7, -13, 3.5, 0, Math.PI * 2);
      ctx.arc(9, -13, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Kilau Mata
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-8.5, -14.5, 1.5, 0, Math.PI * 2);
      ctx.arc(7.5, -14.5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Pipi Merona
      ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
      ctx.beginPath();
      ctx.arc(-11, -3, 3, 0, Math.PI * 2);
      ctx.arc(11, -3, 3, 0, Math.PI * 2);
      ctx.fill();

      // Senyum Katak
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -2, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.restore();

      // I. Render Partikel Bintang (Double Jump) & Cipratan Air
      entities.sparkleParticles.forEach((sp) => {
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x - camX, sp.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      entities.waterParticles.forEach((wp) => {
        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.arc(wp.x - camX, wp.y, wp.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // J. Render Teks Mengambang
      entities.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.font = 'bold 15px ui-monospace, monospace';
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.globalAlpha = ft.opacity;
        ctx.textAlign = 'center';
        ctx.strokeText(ft.text, ft.x - camX, ft.y);
        ctx.fillText(ft.text, ft.x - camX, ft.y);
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, currentWave, ensureNextPads]);

  // Format waktu mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-900 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden select-none font-sans flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-none h-screen w-screen bg-slate-950' : ''
      }`}
    >
      {/* ── TOP HUD NAVIGATION & STATUS BAR ─────────────────────────── */}
      <div className="bg-amber-300 border-b-3 border-black px-3.5 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-black font-mono">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-heading font-black text-sm sm:text-base flex items-center gap-1.5 bg-white px-2.5 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
            <span>🐸</span>
            <span className="hidden sm:inline">Katak Melompat</span>
          </span>

          <span className="bg-emerald-300 border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-black" />
            <span>Skor: {score}</span>
          </span>

          {combo > 1 && (
            <span className="bg-orange-400 border-2 border-black px-2 py-1 rounded-lg text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] animate-bounce flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-black" />
              <span>{combo}x Kombo!</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nyawa / Pelampung */}
          <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-3.5 h-3.5 transition-all ${
                  heart <= lives
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-300 fill-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Sisa Waktu */}
          <div className="bg-cyan-300 border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Tombol Kontrol Cepat */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle Suara"
            className="p-1.5 bg-white hover:bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>

          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              aria-label="Jeda Permainan"
              className="p-1.5 bg-white hover:bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleToggleFullscreen}
            aria-label="Layar Penuh"
            className="p-1.5 bg-white hover:bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── PROGRESS BAR BABAK & TARGET LOMPATAN ──────────────────────── */}
      <div className="shrink-0 bg-white border-b-2 border-black px-4 py-1.5 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="bg-purple-200 border border-black px-2 py-0.5 rounded text-[11px] font-black text-purple-950">
            {gameState === 'idle' ? 'PERSIAPAN MISI' : `BABAK ${currentWave.wave}/5`}
          </span>
          <span className="truncate max-w-[200px] sm:max-w-md text-black font-extrabold">
            {gameState === 'idle'
              ? 'Latihan Refleks: Ketangkasan Tombol Spacebar (␣)'
              : currentWave.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {gameState === 'idle' ? (
            <span className="text-purple-950 font-black bg-purple-100 border border-purple-400 px-2.5 py-0.5 rounded text-[11px]">
              ⭐ Total 5 Babak Tantangan (~4–5 Menit)
            </span>
          ) : (
            <>
              <span>Target Teratai:</span>
              <span className="text-emerald-700 font-black">
                {waveJumpCount} / {currentWave.targetCount}
              </span>
              <div className="w-20 sm:w-28 h-3 bg-slate-200 border border-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (waveJumpCount / currentWave.targetCount) * 100)}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── KANVAS GAMEPLAY INTERAKTIF / ARENA COVER ───────────────── */}
      <div
        className={`relative w-full bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 flex items-center justify-center overflow-hidden transition-all ${
          isFullscreen
            ? 'flex-1 min-h-0 w-full h-full'
            : 'min-h-[460px] sm:min-h-[520px]'
        }`}
      >
        {gameState === 'idle' ? (
          /* ── KONTEN KANVAS MULAI PERMAINAN (LANGSUNG DI KANVAS, BUKAN POPUP) ── */
          <div className="flex-1 w-full h-full flex flex-col justify-between items-center text-center py-4 sm:py-6 px-4 sm:px-6 relative z-10 my-auto max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Header Judul Game */}
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_#000] uppercase text-black">
                <span>🐸</span>
                <span>Game 1 • Fokus Motorik: Tombol Spacebar</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-950 drop-shadow-[2px_2px_0px_#fff]">
                Petualangan Katak Melompat
              </h1>
              <p className="text-xs sm:text-sm text-slate-800 font-bold max-w-xl mx-auto leading-relaxed">
                Latih memori otot jempol tanganmu! Lompat dari teratai ke teratai sebelum hanyut ke pusaran air dalam <strong>5 Babak Bertingkat</strong>.
              </p>
            </div>

            {/* Panggung Tiga Kolom: Info Teratai & Kunci Kontrol */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🪷
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-emerald-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    1x TEKAN SPASI
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Lompatan Biasa (170px)
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Untuk menjangkau teratai normal di depanmu yang mengalir tenang.
                  </p>
                </div>
              </div>

              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-blue-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  ⚡
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-blue-300 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    2x SPASI CEPAT
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Lompat Ganda &amp; Salto (310px)
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Ketuk spasi 2x cepat untuk menyeberangi celah sungai yang lebar!
                  </p>
                </div>
              </div>

              <div className="bg-white/95 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="w-12 h-12 bg-rose-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000]">
                  🌀
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-rose-400 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    WASPADA ARUS KIRI
                  </span>
                  <h3 className="font-heading font-black text-sm text-black mt-1">
                    Jangan Diam Terlalu Lama
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Arus sungai bergerak ke kiri. Segera lompat maju agar tidak terseret pusaran!
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol Mulai Permainan */}
            <div className="pt-2">
              <button
                onClick={handleStartGame}
                className="py-3 px-8 bg-emerald-400 hover:bg-emerald-300 border-3 border-black font-heading font-black text-sm sm:text-base text-black rounded-2xl shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>MULAI EKSPEDISI SEKARANG (TEKAN SPACEBAR)</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={840}
              height={472}
              className="w-full h-full object-contain block cursor-pointer"
              onClick={triggerFrogJump}
            />

            {/* ── PERINGATAN WASPADA ARUS (MUNCUL JIKA KATAK DIAM TERSERET KE KIRI) ── */}
            {nearWhirlpoolWarning && gameState === 'playing' && (
              <div className="absolute top-3 left-4 z-10 bg-rose-500 text-white border-2 border-black px-2.5 py-1 rounded-lg font-mono font-black text-[11px] shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5 fill-amber-300 text-black" />
                <span>ARUS MENYERET! AYO LOMPAT MAJU (SPACEBAR)!</span>
              </div>
            )}
          </>
        )}

        {/* ── OVERLAY: COUNTDOWN MULAI BABAK ────────────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="text-center space-y-2">
              <div className="text-6xl sm:text-8xl font-heading font-black text-amber-300 drop-shadow-[5px_5px_0px_#000] animate-bounce">
                {waveCountdown > 0 ? waveCountdown : 'LOMPAT!'}
              </div>
              <div className="bg-white border-2 border-black px-3.5 py-1 rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[2px_2px_0px_0px_#000]">
                {currentWave.title}
              </div>
            </div>
          </div>
        )}

        {/* ── OVERLAY: JEDA (PAUSE) ─────────────────────────────────── */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-xs sm:max-w-sm w-full p-4 sm:p-5 text-center space-y-3 my-auto">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-black">Permainan Dijeda</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                Istirahatkan sejenak jemari tanganmu sebelum melanjutkan penyeberangan sungai!
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 border-2 sm:border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  Lanjutkan Bermain
                </button>
                <button
                  onClick={handleStartGame}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 border-2 border-black font-heading font-bold text-xs text-black rounded-xl cursor-pointer"
                >
                  Ulangi Dari Babak 1
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── OVERLAY: SELESAI BABAK (WAVE CLEAR) ───────────────────── */}
        {gameState === 'wave_clear' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-md w-full p-3.5 sm:p-5 text-center space-y-2 sm:space-y-2.5 animate-in zoom-in-95 duration-200 my-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
                ⭐
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-mono font-black uppercase text-emerald-600 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  Babak {currentWave.wave} Selesai!
                </span>
                <h3 className="font-heading font-black text-lg sm:text-xl text-black mt-0.5">
                  Luar Biasa, Lompatan Hebat!
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] font-mono text-left bg-slate-50 border-2 border-black p-2 sm:p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-500 block">Total Lompatan:</span>
                  <span className="font-black text-black">{jumpCount} Teratai</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lompat Ganda:</span>
                  <span className="font-black text-blue-600">{doubleJumpCount}x Salto</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Kombo Maksimal:</span>
                  <span className="font-black text-orange-600">{maxCombo}x Streak</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Serangga Ditangkap:</span>
                  <span className="font-black text-emerald-600">{dragonflyCaught} Ekor</span>
                </div>
              </div>

              {/* Informasi pemulihan nyawa penuh */}
              <div className="bg-emerald-50 border border-emerald-400 p-1.5 sm:p-2 rounded-lg flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Bonus Babak Baru:</span>
                </span>
                <span className="font-black text-emerald-800 bg-white border border-emerald-300 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                  Nyawa Pulih Penuh (3/3 ❤️)
                </span>
              </div>

              {/* Tips babak selanjutnya */}
              {currentWaveIdx + 1 < WAVES_CONFIG.length && (
                <div className="bg-amber-100 border border-amber-400 p-2 rounded-lg text-left text-[10px] sm:text-[11px] text-amber-950 font-medium">
                  <strong>Tips Babak Berikutnya:</strong> {WAVES_CONFIG[currentWaveIdx + 1].tip}
                </div>
              )}

              <button
                onClick={handleNextWave}
                className="w-full py-2.5 sm:py-3 bg-emerald-400 hover:bg-emerald-300 border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentWaveIdx + 1 < WAVES_CONFIG.length
                    ? `LANJUT KE BABAK ${currentWave.wave + 1} (${transitionCountdown}s)`
                    : `LIHAT KEMENANGAN AKHIR (${transitionCountdown}s)`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── OVERLAY: GAME OVER (HATI HABIS) ───────────────────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-xs sm:max-w-sm w-full p-4 sm:p-5 text-center space-y-2.5 my-auto">
              <div className="w-11 h-11 bg-rose-200 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
                🌊
              </div>
              <h3 className="font-heading font-black text-xl text-black">
                Katak Tercebur Terlalu Sering!
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                Perhatikan celah lebar bertanda [2x SPASI] dan jangan diam terlalu lama agar tidak terseret arus ke kiri!
              </p>
              <div className="bg-slate-100 border-2 border-black p-2 rounded-xl font-mono text-xs">
                Skor Akhir: <span className="font-black text-black">{score}</span>
              </div>
              <button
                onClick={handleStartGame}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 border-2 sm:border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>COBA LAGI DARI AWAL</span>
              </button>
            </div>
          </div>
        )}

        {/* ── OVERLAY: VICTORY SCREEN (TAMAT 5 BABAK LENGKAP) ───────── */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-md w-full p-4 sm:p-5 text-center space-y-2.5 animate-in zoom-in-95 duration-300 my-auto">
              <div className="w-12 h-12 bg-yellow-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000] animate-bounce">
                👑
              </div>

              <div>
                <span className="px-2.5 py-0.5 bg-emerald-300 border border-black rounded-full text-[10px] sm:text-xs font-black font-mono shadow-[1px_1px_0px_0px_#000]">
                  EKSPEDISI 5 BABAK TAMAT SEMPURNA!
                </span>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black mt-1">
                  Sang Penjelajah Sungai Emas!
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                  Selamat! Kamu telah menguasai tombol Spacebar tunggal maupun lompatan ganda dengan memori otot yang luar biasa!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 bg-amber-50 border-2 border-black p-2.5 rounded-xl font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Skor</span>
                  <span className="font-black text-black text-sm">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Lompat Teratai</span>
                  <span className="font-black text-emerald-700 text-sm">{jumpCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Lompat Ganda</span>
                  <span className="font-black text-blue-700 text-sm">{doubleJumpCount}</span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-2.5 sm:py-3 bg-emerald-400 hover:bg-emerald-300 border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>MAINKAN LAGI PETUALANGAN INI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM INTERACTIVE SPACEBAR BAR & GUIDANCE ───────────────── */}
      <div className="shrink-0 mt-auto bg-slate-100 border-t-3 border-black p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tips Guru:</strong> {currentWave.tip}
          </span>
        </div>

        {/* Tombol Spasi Virtual (Bisa diklik mouse / disentuh) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={triggerFrogJump}
            className={`w-full sm:w-64 py-2.5 px-4 font-mono font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000] ${
              spacePressedVisual
                ? 'bg-amber-400 translate-x-0.5 translate-y-0.5 shadow-none'
                : 'bg-white hover:bg-amber-100 text-black'
            }`}
          >
            <span className="text-lg">␣</span>
            <span>TEKAN SPACEBAR</span>
            <span className="text-[10px] font-bold bg-amber-200 px-1.5 py-0.5 rounded border border-black/40">
              LOMPAT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
