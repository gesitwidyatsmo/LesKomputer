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
  Shield,
  ChevronRight,
  Flame,
  CornerDownLeft,
} from 'lucide-react';
import { rocketAudio } from '@/lib/rocketAudio';

// ─── KONFIGURASI 5 MISI ANTARIKSA (TOTAL ~4.5 - 5 MENIT) ─────────────
const MISSIONS_CONFIG = [
  {
    mission: 1,
    title: 'Misi 1: Uji Ignisi Troposfer (Landasan Luncur)',
    subtitle: 'Fokus: Mengenal letak tombol Enter untuk konfirmasi peluncuran',
    duration: 60, // detik
    targetCount: 10,
    codeType: 'simple_countdown', // kode 1-2 angka
    hasGauge: false,
    requireDoubleEnter: false,
    skyTheme: 'day',
    tip: 'Ketik kode angka yang muncul, lalu tekan tombol ENTER secara tegas saat layar berkedip hijau!',
  },
  {
    mission: 2,
    title: 'Misi 2: Pendorong Tahap 1 (Stratosfer)',
    subtitle: 'Fokus: Hitung mundur klasik 321 & timing Enter di zona hijau',
    duration: 65,
    targetCount: 12,
    codeType: 'classic_countdown', // "321"
    hasGauge: true, // pengukur tekanan zona hijau
    requireDoubleEnter: false,
    skyTheme: 'sunset',
    tip: 'Ketik 321 lalu tekan ENTER saat jarum pengukur tekanan berada di zona hijau untuk bonus poin besar!',
  },
  {
    mission: 3,
    title: 'Misi 3: Menembus Awan Badai (Mesosfer)',
    subtitle: 'Fokus: Kecepatan reaksi kode koordinat darurat',
    duration: 70,
    targetCount: 14,
    codeType: 'coord_codes', // "789", "101", dll
    hasGauge: false,
    requireDoubleEnter: false,
    hasEmergencyTimer: true, // 5.5 detik batas waktu
    skyTheme: 'storm',
    tip: 'Awas badai meteor! Ketik kode koordinat dengan cepat dan tekan ENTER sebelum waktu darurat (5.5 detik) habis.',
  },
  {
    mission: 4,
    title: 'Misi 4: Pelepasan Selubung Satelit (Termosfer)',
    subtitle: 'Fokus: Konfirmasi Ganda (Double Enter) pelepasan pendorong',
    duration: 75,
    targetCount: 15,
    codeType: 'space_words', // "ROKET", "ORBIT", "BULAN"
    hasGauge: true,
    requireDoubleEnter: true, // Enter 2x
    skyTheme: 'night',
    tip: 'Ketik kata sandi antariksa, lalu tekan tombol ENTER DUA KALI untuk konfirmasi pelepasan modul roket!',
  },
  {
    mission: 5,
    title: 'Misi 5: Menembus Gravitasi ke Bulan (Grand Finale)',
    subtitle: 'Fokus: Ketangkasan puncak Enter menuju Pendaratan Stasiun Bulan',
    duration: 90,
    targetCount: 18,
    codeType: 'full_countdown', // "54321" & kode kosmik
    hasGauge: true,
    requireDoubleEnter: false,
    skyTheme: 'orbit',
    tip: 'Misi pamungkas! Luncurkan seluruh roket fusi menuju Stasiun Antariksa Bulan Emas dengan menekan ENTER tepat waktu!',
  },
];

// Generator kode berdasarkan tipe misi (tanpa tanda minus -)
const generateTargetCode = (type) => {
  if (type === 'simple_countdown') {
    const pool = ['32', '21', '54', '43', '20', '10', '98', '87'];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (type === 'classic_countdown') {
    const pool = ['321', '543', '987', '432', '654', '876'];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (type === 'coord_codes') {
    const pool = ['789', '101', '456', '202', '999', '303', '852', '642'];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (type === 'space_words') {
    const pool = ['ROKET', 'ORBIT', 'BULAN', 'BINTANG', 'KOSMOS', 'SATELIT'];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (type === 'full_countdown') {
    const pool = ['54321', '98765', 'NUSANTARA', 'BULAN1', 'APOLLO9'];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return '321';
};

export default function RocketLaunchGame() {
  // Game states
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'wave_clear' | 'paused' | 'gameover' | 'victory'
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [missionCountdown, setMissionCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(MISSIONS_CONFIG[0].duration);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [launchCount, setLaunchCount] = useState(0);
  const [missionLaunchCount, setMissionLaunchCount] = useState(0);
  const [shields, setShields] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const [enterPressedVisual, setEnterPressedVisual] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Status Peluncuran Saat Ini
  const [targetCode, setTargetCode] = useState('321');
  const [typedInput, setTypedInput] = useState('');
  const [launchStage, setLaunchStage] = useState('WAITING_CODE'); // 'WAITING_CODE' | 'READY_FOR_ENTER' | 'SECOND_ENTER' | 'LAUNCHING'
  const [emergencyTimeLeft, setEmergencyTimeLeft] = useState(5.5);
  const [gaugeValue, setGaugeValue] = useState(50); // 0-100%
  const [isBlinkingAlert, setIsBlinkingAlert] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null); // 'time_up' | 'shields_depleted' | null

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const gaugeDirectionRef = useRef(1);
  const gaugeValueRef = useRef(50);
  const lastGaugeUpdateRef = useRef(0);
  const emergencyTimerRef = useRef(5.5);
  const lastEmergencyUiUpdateRef = useRef(0);
  const missionStartScoreRef = useRef(0);

  const currentMission = MISSIONS_CONFIG[currentMissionIdx] || MISSIONS_CONFIG[0];

  const towerImgRef = useRef(null);
  const [towerImgLoaded, setTowerImgLoaded] = useState(false);
  const penyanggaImgRef = useRef(null);
  const [penyanggaImgLoaded, setPenyanggaImgLoaded] = useState(false);
  const rocketImgRef = useRef(null);
  const [rocketImgLoaded, setRocketImgLoaded] = useState(false);

  useEffect(() => {
    // 1. Muat aset SVG Tiang & Landasan
    const img = new Image();
    img.src = '/roket/tiang%20Rocket.svg';
    img.onload = () => {
      towerImgRef.current = img;
      setTowerImgLoaded(true);
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.src = '/roket/tiang_rocket.svg';
      fallbackImg.onload = () => {
        towerImgRef.current = fallbackImg;
        setTowerImgLoaded(true);
      };
    };

    // 2. Muat aset SVG Penyangga (Gantry Arm Bridge)
    const pImg = new Image();
    pImg.src = '/roket/penyangga%20roket.svg';
    pImg.onload = () => {
      penyanggaImgRef.current = pImg;
      setPenyanggaImgLoaded(true);
    };
    pImg.onerror = () => {
      const fallbackPImg = new Image();
      fallbackPImg.src = '/roket/penyangga_roket.svg';
      fallbackPImg.onload = () => {
        penyanggaImgRef.current = fallbackPImg;
        setPenyanggaImgLoaded(true);
      };
    };

    // 3. Muat aset SVG Roket
    const rImg = new Image();
    rImg.src = '/roket/roket.svg';
    rImg.onload = () => {
      rocketImgRef.current = rImg;
      setRocketImgLoaded(true);
    };
  }, []);

  // Ref objek partikel & roket kanvas (Posisi di sisi kiri kanvas agar tidak tertutup konsol kode di kanan)
  const rocketAnimRef = useRef({
    rocketY: 397,
    rocketX: 220, // Sisi kiri kanvas
    baseY: 397,
    speedY: 0,
    rumble: 0,
    clampRetract: 0, // 0 = menjepit roket, 1 = terbuka/lepas
    fireParticles: [],
    smokeParticles: [],
    steamParticles: [],
    starField: [],
    screenShake: 0,
    launchProgress: 0,
  });

  // Toggle suara
  const handleToggleSound = () => {
    const next = rocketAudio.toggleSound();
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

  // Inisialisasi Bintang Latar Belakang
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * 840,
        y: Math.random() * 472,
        radius: Math.random() * 2 + 1,
        blinkSpeed: Math.random() * 3 + 1,
      });
    }
    rocketAnimRef.current.starField = stars;
  }, []);

  // ─── SETUP TARGET BARU ───────────────────────────────────────────────
  const spawnNewRocketTarget = useCallback(() => {
    const nextCode = generateTargetCode(currentMission.codeType);
    setTargetCode(nextCode);
    setTypedInput('');
    setLaunchStage('WAITING_CODE');
    setIsBlinkingAlert(false);
    emergencyTimerRef.current = 5.5;
    setEmergencyTimeLeft(5.5);

    const anim = rocketAnimRef.current;
    anim.rocketY = anim.baseY;
    anim.speedY = 0;
    anim.clampRetract = 0; // Klem penahan kembali mengunci roket baru
    anim.launchProgress = 0;
  }, [currentMission]);

  // ─── INISIALISASI MISI BABAK ─────────────────────────────────────────
  const initMission = useCallback(
    (missionIdx) => {
      const cfg = MISSIONS_CONFIG[missionIdx];
      setCurrentMissionIdx(missionIdx);
      setTimeLeft(cfg.duration);
      setMissionLaunchCount(0);
      setShields(3); // Pulihkan perisai penuh di setiap awal misi baru!
      emergencyTimerRef.current = 5.5;
      setEmergencyTimeLeft(5.5);
      setGameOverReason(null);

      const anim = rocketAnimRef.current;
      anim.rocketY = anim.baseY;
      anim.speedY = 0;
      anim.clampRetract = 0;
      anim.fireParticles = [];
      anim.smokeParticles = [];
      anim.steamParticles = [];

      spawnNewRocketTarget();
      rocketAudio.playWaveStart();
    },
    [spawnNewRocketTarget]
  );

  // Mulai game dari awal (Misi 1)
  const handleStartGame = useCallback(() => {
    rocketAudio.init();
    rocketAudio.playKeyClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLaunchCount(0);
    setMissionLaunchCount(0);
    setShields(3);
    setCurrentMissionIdx(0);
    setMissionCountdown(3);
    setGameOverReason(null);
    missionStartScoreRef.current = 0;
    setGameState('countdown');
  }, []);

  // Ulangi misi yang sama (saat waktu habis tapi target roket belum terpenuhi)
  const handleRetryCurrentMission = useCallback(() => {
    rocketAudio.init();
    rocketAudio.playKeyClick();
    setScore(missionStartScoreRef.current);
    setCombo(0);
    setMissionLaunchCount(0);
    setShields(3);
    setGameOverReason(null);
    setMissionCountdown(3);
    setGameState('countdown');
  }, []);

  // Countdown 3, 2, 1 sebelum misi dimulai
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (missionCountdown > 0) {
      const timer = setTimeout(() => {
        setMissionCountdown((prev) => prev - 1);
        if (missionCountdown > 1) {
          rocketAudio.playAlertPulse();
        } else {
          rocketAudio.playWaveStart();
        }
      }, 900);
      return () => clearTimeout(timer);
    } else {
      initMission(currentMissionIdx);
      setGameState('playing');
    }
  }, [gameState, missionCountdown, currentMissionIdx, initMission]);

  const handleNextMission = useCallback(() => {
    const nextIdx = currentMissionIdx + 1;
    if (nextIdx < MISSIONS_CONFIG.length) {
      setCurrentMissionIdx(nextIdx);
      setMissionCountdown(3);
      missionStartScoreRef.current = score;
      setGameOverReason(null);
      setGameState('countdown');
      setShields(3); // Pulihkan perisai penuh saat naik ke babak baru
    } else {
      setGameState('victory');
      rocketAudio.playVictory();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentMissionIdx, score]);

  // Timer game misi per detik
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState((curr) => {
            if (curr === 'playing') {
              // Jika waktu habis tapi target peluncuran belum terpenuhi, misi gagal
              rocketAudio.playShieldDamage();
              setGameOverReason('time_up');
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

  // ─── PROSES EKSEKUSI TOMBOL ENTER (IGNISI ROKET) ──────────────────────
  const handleTriggerEnter = useCallback(() => {
    if (gameState !== 'playing') return;

    setEnterPressedVisual(true);
    setTimeout(() => setEnterPressedVisual(false), 160);

    // KASUS A: Belum selesai mengetik kode
    if (launchStage === 'WAITING_CODE') {
      rocketAudio.playShieldDamage();
      return;
    }

    // KASUS B: Butuh konfirmasi ganda (Double Enter pada Misi 4)
    if (launchStage === 'READY_FOR_ENTER' && currentMission.requireDoubleEnter) {
      rocketAudio.playCodeReady();
      setLaunchStage('SECOND_ENTER');
      return;
    }

    // KASUS C: Peluncuran Roket Siap Dieksekusi (Enter Ditekan!)
    if (launchStage === 'READY_FOR_ENTER' || launchStage === 'SECOND_ENTER') {
      setLaunchStage('LAUNCHING');
      rocketAudio.playLaunchIgnition();

      // Cek apakah timing Enter tepat di zona hijau pengukur tekanan
      const currentGauge = gaugeValueRef.current;
      const isGreenZone = currentMission.hasGauge && currentGauge >= 60 && currentGauge <= 88;
      const isBonusLaunch = missionLaunchCount >= currentMission.targetCount;
      const basePts = isGreenZone ? 300 : (isBonusLaunch ? 200 : 100);

      if (isGreenZone) {
        rocketAudio.playPerfectChime();
      }

      setScore((s) => s + basePts);
      setLaunchCount((c) => c + 1);

      setCombo((c) => {
        const nextCombo = c + 1;
        setMaxCombo((m) => Math.max(m, nextCombo));
        return nextCombo;
      });

      // Animasi semburan roket meluncur
      const anim = rocketAnimRef.current;
      anim.speedY = -12;
      anim.screenShake = 15;

      // Spawn partikel api & asap dari 3 nozzle roket SVG (tengah, booster kiri, booster kanan)
      for (let i = 0; i < 48; i++) {
        const offset = Math.random() < 0.35 ? -41.4 : Math.random() < 0.7 ? 41.4 : 0;
        const nozzleY = offset === 0 ? anim.baseY : anim.baseY - 11.6;
        anim.fireParticles.push({
          x: anim.rocketX + offset + (Math.random() - 0.5) * 12,
          y: nozzleY,
          vx: (Math.random() - 0.5) * 80 + offset * 0.4,
          vy: Math.random() * 160 + 80,
          radius: Math.random() * 7 + 4,
          color: Math.random() < 0.5 ? '#F97316' : Math.random() < 0.8 ? '#FBBF24' : '#EF4444',
          life: 0,
          maxLife: 0.65,
        });
      }

      // Spawn uap putih pelepasan klem penahan
      for (let i = 0; i < 20; i++) {
        anim.steamParticles.push({
          x: anim.rocketX + (Math.random() < 0.5 ? -55 : 55),
          y: anim.baseY - 10 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 70 + (Math.random() < 0.5 ? -40 : 40),
          vy: (Math.random() - 0.5) * 30 - 20,
          radius: Math.random() * 9 + 5,
          alpha: 0.8,
          life: 0,
          maxLife: 0.5,
        });
      }

      // Catat peluncuran dan cek pemenuhan target misi
      setTimeout(() => {
        setMissionLaunchCount((curr) => {
          const nextCount = curr + 1;
          if (nextCount >= currentMission.targetCount) {
            // Target peluncuran misi tercapai secara sah!
            setTimeout(() => {
              if (currentMissionIdx + 1 >= MISSIONS_CONFIG.length) {
                // Seluruh 5 misi telah selesai! Langsung masuk ke Layar Kemenangan Puncak (Victory Screen)
                rocketAudio.playVictory();
                setGameState('victory');
                confetti({ particleCount: 160, spread: 95, origin: { y: 0.55 } });
              } else {
                rocketAudio.playWaveStart();
                setGameState('wave_clear');
                confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
              }
            }, 600);
          } else {
            spawnNewRocketTarget();
          }
          return nextCount;
        });
      }, 750);
    }
  }, [gameState, launchStage, currentMission, currentMissionIdx, missionLaunchCount, spawnNewRocketTarget]);

  // ─── PROSES PENGETIKAN KODE KEYBOARD ─────────────────────────────────
  const handleKeyCharacterInput = useCallback(
    (char) => {
      if (gameState !== 'playing') return;
      if (launchStage === 'LAUNCHING') return;

      const upperChar = char.toUpperCase();
      const expectedChar = targetCode[typedInput.length];

      if (upperChar === expectedChar) {
        const nextTyped = typedInput + upperChar;
        setTypedInput(nextTyped);
        rocketAudio.playKeyClick();

        // Cek jika seluruh kode sudah lengkap
        if (nextTyped === targetCode) {
          rocketAudio.playCodeReady();
          setLaunchStage('READY_FOR_ENTER');
          setIsBlinkingAlert(true);
        }
      } else {
        // Salah ketik: bunyikan teguran lembut
        rocketAudio.playShieldDamage();
      }
    },
    [gameState, launchStage, targetCode, typedInput]
  );

  // Event listener keyboard global untuk mengetik kode dan tombol Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Tombol Enter / NumpadEnter
      if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        if (gameState === 'idle') {
          handleStartGame();
        } else if (gameState === 'playing') {
          handleTriggerEnter();
        } else if (gameState === 'wave_clear') {
          handleNextMission();
        } else if (gameState === 'gameover') {
          if (gameOverReason === 'time_up' || timeLeft <= 0) {
            handleRetryCurrentMission();
          } else {
            handleStartGame();
          }
        } else if (gameState === 'victory') {
          handleStartGame();
        }
        return;
      }

      // 2. Tombol Pause (Escape / Esc)
      if (e.key === 'Escape') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
        return;
      }

      // 3. Tombol Backspace untuk koreksi
      if (e.key === 'Backspace' && typedInput.length > 0 && launchStage === 'WAITING_CODE') {
        setTypedInput((prev) => prev.slice(0, -1));
        rocketAudio.playKeyClick();
        return;
      }

      // 4. Tombol Huruf, Angka & Tanda Hubung (-)
      if (e.key.length === 1 && launchStage === 'WAITING_CODE') {
        handleKeyCharacterInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    handleTriggerEnter,
    handleKeyCharacterInput,
    typedInput,
    launchStage,
    gameOverReason,
    timeLeft,
    handleRetryCurrentMission,
    handleStartGame,
    handleNextMission,
  ]);

  // ─── GAME LOOP ANIMASI KANVAS 60 FPS ─────────────────────────────────
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
      const anim = rocketAnimRef.current;

      // 1. UPDATE FISIKA ROKET & KONSOL JIKA SEDANG BERMAIN
      if (gameState === 'playing') {
        // Jarum pengukur tekanan bolak-balik
        if (currentMission.hasGauge) {
          let next = gaugeValueRef.current + gaugeDirectionRef.current * dt * 90;
          if (next >= 98) {
            next = 98;
            gaugeDirectionRef.current = -1;
          } else if (next <= 2) {
            next = 2;
            gaugeDirectionRef.current = 1;
          }
          gaugeValueRef.current = next;

          if (timestamp - lastGaugeUpdateRef.current > 40) {
            lastGaugeUpdateRef.current = timestamp;
            setGaugeValue(Math.round(next));
          }
        }

        // Timer darurat Misi 3
        if (currentMission.hasEmergencyTimer && launchStage !== 'LAUNCHING') {
          emergencyTimerRef.current -= dt;
          if (emergencyTimerRef.current <= 0) {
            // Waktu habis: Reset timer darurat seketika di ref agar tidak terpanggil ganda di frame berikutnya
            emergencyTimerRef.current = 5.5;
            setEmergencyTimeLeft(5.5);
            rocketAudio.playShieldDamage();
            // Kurangi perisai tepat 1 nyawa
            setShields((s) => {
              const ns = Math.max(0, s - 1);
              if (ns <= 0) {
                setGameOverReason('shields_depleted');
                setGameState('gameover');
              }
              return ns;
            });
            spawnNewRocketTarget();
          } else if (timestamp - lastEmergencyUiUpdateRef.current > 50) {
            lastEmergencyUiUpdateRef.current = timestamp;
            setEmergencyTimeLeft(Math.max(0, emergencyTimerRef.current));
          }
        }

        // Animasi peluncuran roket melesat ke atas
        if (launchStage === 'LAUNCHING') {
          anim.rocketY += anim.speedY;
          anim.speedY -= 25 * dt; // Percepatan naik
          anim.clampRetract = Math.min(1, anim.clampRetract + dt * 4.5); // Penahan roket membuka

          // Semburan api kontinu saat meluncur dari 3 nozzle roket SVG
          [
            { offset: -41.4, yOffset: -11.6 },
            { offset: 0, yOffset: 0 },
            { offset: 41.4, yOffset: -11.6 },
          ].forEach(({ offset, yOffset }) => {
            anim.fireParticles.push({
              x: anim.rocketX + offset + (Math.random() - 0.5) * 8,
              y: anim.rocketY + yOffset,
              vx: (Math.random() - 0.5) * 45,
              vy: Math.random() * 160 + 100,
              radius: Math.random() * 6 + 3,
              color: Math.random() < 0.6 ? '#F97316' : '#FBBF24',
              life: 0,
              maxLife: 0.45,
            });
          });
        } else {
          anim.clampRetract = Math.max(0, anim.clampRetract - dt * 3.5);
          // Getaran mesin halus di landasan
          anim.rumble = Math.sin(timestamp * 0.05) * (launchStage === 'READY_FOR_ENTER' ? 3.5 : 0.8);
        }

        // Update getaran layar
        if (anim.screenShake > 0) {
          anim.screenShake = Math.max(0, anim.screenShake - 25 * dt);
        }

        // Update partikel api & asap
        anim.fireParticles.forEach((fp) => {
          fp.life += dt;
          fp.x += fp.vx * dt;
          fp.y += fp.vy * dt;
        });
        anim.fireParticles = anim.fireParticles.filter((fp) => fp.life < fp.maxLife);

        // Update partikel uap pelepas klem
        anim.steamParticles.forEach((sp) => {
          sp.life += dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
          sp.radius += dt * 10;
        });
        anim.steamParticles = anim.steamParticles.filter((sp) => sp.life < sp.maxLife);
      }

      // 2. RENDERING GRAFIS KANVAS ANTARIKSA (Sisi Kiri: Roket & Menara, Sisi Kanan: Panel Kontrol)
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      if (anim.screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * anim.screenShake, (Math.random() - 0.5) * anim.screenShake);
      }

      // A. Latar Belakang Langit sesuai Tema Misi
      const skyTheme = currentMission.skyTheme;
      const grad = ctx.createLinearGradient(0, 0, 0, height);

      if (skyTheme === 'day') {
        grad.addColorStop(0, '#38BDF8');
        grad.addColorStop(0.7, '#BAE6FD');
        grad.addColorStop(1, '#E0F2FE');
      } else if (skyTheme === 'sunset') {
        grad.addColorStop(0, '#4C1D95');
        grad.addColorStop(0.4, '#C026D3');
        grad.addColorStop(0.8, '#F97316');
        grad.addColorStop(1, '#FDE047');
      } else if (skyTheme === 'storm') {
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(0.5, '#334155');
        grad.addColorStop(1, '#64748B');
      } else if (skyTheme === 'night') {
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.6, '#0F172A');
        grad.addColorStop(1, '#1E293B');
      } else {
        // Orbit luar angkasa
        grad.addColorStop(0, '#000000');
        grad.addColorStop(0.7, '#020617');
        grad.addColorStop(1, '#0C4A6E');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // B. Bintang-Bintang Gemerlap
      if (skyTheme === 'night' || skyTheme === 'orbit' || skyTheme === 'sunset') {
        ctx.fillStyle = '#FFFFFF';
        anim.starField.forEach((star) => {
          const alpha = 0.4 + Math.sin(timestamp * 0.003 * star.blinkSpeed) * 0.4;
          ctx.globalAlpha = Math.max(0.1, alpha);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // C. Bulan Sabit Bercahaya (Diposisikan di langit tengah-kiri agar terlihat jelas)
      if (skyTheme === 'orbit' || skyTheme === 'night') {
        ctx.save();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(330, 68, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(340, 63, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // D. Awan-Awan Putih di Langit Siang / Senja
      if (skyTheme === 'day' || skyTheme === 'sunset') {
        ctx.fillStyle = skyTheme === 'day' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(254, 215, 170, 0.55)';
        for (let i = 0; i < 4; i++) {
          const cx = (i * 200 + (timestamp * 0.02) % 600) - 60;
          const cy = 50 + (i % 2) * 40;
          ctx.beginPath();
          ctx.arc(cx, cy, 24, 0, Math.PI * 2);
          ctx.arc(cx + 22, cy - 8, 28, 0, Math.PI * 2);
          ctx.arc(cx + 48, cy, 22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // E. TIANG GANTRY & MEJA LANDASAN PELUNCURAN (ASET VEKTOR SVG: tiang Rocket.svg)
      const rocketX = anim.rocketX; // 220px (Sumbu tengah roket)
      const towerImg = towerImgRef.current;
      const padScale = height / 1460.16; // Skala pas dengan tinggi kanvas (472px)
      const svgW = 1024 * padScale;
      const svgH = 1460.16 * padScale;
      // Menyelaraskan titik tengah antara 2 pilar penyangga landasan SVG (x=631.0) tepat di sumbu roket (220)
      const svgX = rocketX - 631.0 * padScale;
      const svgY = height - svgH; // Dasar landasan menyentuh batas dasar kanvas

      if (towerImg && towerImg.complete && towerImg.naturalWidth > 0) {
        ctx.drawImage(towerImg, svgX, svgY, svgW, svgH);

        // Lampu Merah Berkedip di Puncak Menara SVG (koordinat SVG: x=282.21, y=21.38)
        const beaconX = svgX + 282.21 * padScale;
        const beaconY = svgY + 21.38 * padScale;
        const beaconGlow = Math.sin(timestamp * 0.008) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(239, 68, 68, ${beaconGlow * 0.95})`;
        ctx.beginPath();
        ctx.arc(beaconX, beaconY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Fallback procedural sederhana jika gambar sedang dimuat
        const padY = anim.baseY + 10;
        const padH = height - padY + 10;
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(rocketX - 160, padY, 320, padH);
      }

      // F. LENGAN JEMBATAN PENYANGGA ROKET (ASET VEKTOR SVG: penyangga roket.svg)
      const penyanggaImg = penyanggaImgRef.current;
      if (penyanggaImg && penyanggaImg.complete && penyanggaImg.naturalWidth > 0) {
        const pScale = 0.636;
        const pW = 464.4 * pScale * padScale;
        const pH = 159.12 * pScale * padScale;
        // Lengan penyangga membuka/retract ke arah menara saat roket meluncur
        const pRetract = anim.clampRetract * 35 * padScale;
        const pX = svgX + 312.0 * padScale - pRetract;
        const pY = svgY + (260.5 - 22.18 * pScale) * padScale;
        ctx.drawImage(penyanggaImg, pX, pY, pW, pH);
      }

      // G. PARTIKEL UAP PELEPASAN KLEM (STEAM PARTICLES)
      anim.steamParticles.forEach((sp) => {
        ctx.fillStyle = `rgba(241, 245, 249, ${Math.max(0, sp.alpha * (1 - sp.life / sp.maxLife))})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // H. PARTIKEL API & ASAP SEMBURAN
      anim.fireParticles.forEach((fp) => {
        ctx.fillStyle = fp.color;
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // I. ROKET ANTARIKSA BESAR MULTI-STAGE "NUSANTARA-1" (ASET VEKTOR SVG: roket.svg) 🚀
      const rx = anim.rocketX + (launchStage === 'LAUNCHING' ? 0 : anim.rumble);
      const ry = anim.rocketY;

      ctx.save();
      ctx.translate(rx, ry);

      // Dimensi roket diperbesar agar proporsional dengan pilar penyangga landasan (rasio 256.0 / 370.0 ≈ 0.69189)
      const rocketScale = 0.69189;
      const rocketW = 769.21 * rocketScale * padScale; // ~172px pada height 472
      const rocketH = 1485.37 * rocketScale * padScale; // ~332px pada height 472
      const centerNozzleBottomY = rocketH * (1443.43 / 1485.37); // ~322.8px dari pucuk kerucut

      // ── API PENYEMBUR DARI 3 NOZZLE SAAT MELUNCUR ──
      if (launchStage === 'LAUNCHING') {
        const flamePulse = Math.sin(timestamp * 0.1) * 8;
        // 1. Api Nozzle Utama Tengah (x = 0, y = 0)
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(-16, -4);
        ctx.lineTo(0, 72 + flamePulse);
        ctx.lineTo(16, -4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.moveTo(-10, -4);
        ctx.lineTo(0, 54 + flamePulse * 0.7);
        ctx.lineTo(10, -4);
        ctx.closePath();
        ctx.fill();

        // 2. Api Booster Kiri (x = -41.4, y = -11.6)
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(-41.4 - 13, -15);
        ctx.lineTo(-41.4, 46 + flamePulse * 0.8);
        ctx.lineTo(-41.4 + 13, -15);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.moveTo(-41.4 - 8, -15);
        ctx.lineTo(-41.4, 35 + flamePulse * 0.6);
        ctx.lineTo(-41.4 + 8, -15);
        ctx.closePath();
        ctx.fill();

        // 3. Api Booster Kanan (x = 41.4, y = -11.6)
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(41.4 - 13, -15);
        ctx.lineTo(41.4, 46 + flamePulse * 0.8);
        ctx.lineTo(41.4 + 13, -15);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.moveTo(41.4 - 8, -15);
        ctx.lineTo(41.4, 35 + flamePulse * 0.6);
        ctx.lineTo(41.4 + 8, -15);
        ctx.closePath();
        ctx.fill();
      }

      // ── BADAN ROKET ASET VEKTOR SVG: roket.svg ──
      const rocketImg = rocketImgRef.current;
      if (rocketImg && rocketImg.complete && rocketImg.naturalWidth > 0) {
        ctx.drawImage(rocketImg, -rocketW / 2, -centerNozzleBottomY, rocketW, rocketH);
      } else {
        // Fallback procedural proporsional jika aset SVG roket sedang dimuat
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-rocketW * 0.22, -centerNozzleBottomY * 0.72, rocketW * 0.44, centerNozzleBottomY * 0.68, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.moveTo(-rocketW * 0.22, -centerNozzleBottomY * 0.72);
        ctx.lineTo(0, -centerNozzleBottomY);
        ctx.lineTo(rocketW * 0.22, -centerNozzleBottomY * 0.72);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.fillRect(-20, -10, 40, 10);
      }

      ctx.restore();

      ctx.restore(); // end screen shake

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, currentMission, launchStage, towerImgLoaded, penyanggaImgLoaded, rocketImgLoaded]);

  // Format waktu mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-900 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden select-none font-sans flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen bg-slate-950' : ''
      }`}
    >
      {/* ── TOP HUD NAVIGATION & STATUS BAR ─────────────────────────── */}
      <div className="bg-amber-300 border-b-3 border-black px-3.5 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-black font-mono">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-heading font-black text-sm sm:text-base flex items-center gap-1.5 bg-white px-2.5 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
            <span>🚀</span>
            <span className="hidden sm:inline">Peluncuran Roket</span>
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
          {/* Perisai Energi Roket */}
          <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
            {[1, 2, 3].map((shieldIdx) => (
              <Shield
                key={shieldIdx}
                className={`w-3.5 h-3.5 transition-all ${
                  shieldIdx <= shields
                    ? 'text-blue-500 fill-blue-500'
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

      {/* ── PROGRESS BAR MISI ────────────────────────────────────────── */}
      <div className="bg-white border-b-2 border-black px-4 py-1.5 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="bg-blue-200 border border-black px-2 py-0.5 rounded text-[11px] font-black text-blue-950">
            MISI {currentMission.mission}/5
          </span>
          <span className="truncate max-w-[200px] sm:max-w-md text-black font-extrabold">
            {currentMission.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Target Peluncuran:</span>
          <span className="text-blue-700 font-black">
            {missionLaunchCount} / {currentMission.targetCount}
          </span>
          <div className="w-20 sm:w-28 h-3 bg-slate-200 border border-black rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, (missionLaunchCount / currentMission.targetCount) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── KANVAS ANIMASI ROKET & KONSOL ───────────────────────────── */}
      <div className={`relative w-full bg-slate-950 flex items-center justify-center overflow-hidden ${
        isFullscreen
          ? 'flex-1 min-h-0'
          : 'min-h-[420px] aspect-[16/9] max-h-[520px]'
      }`}>
        <canvas
          ref={canvasRef}
          width={840}
          height={472}
          className="w-full h-full object-contain block"
        />

        {/* ── TERMINAL KONSOL OPERATOR ANTARIKSA DI SEBELAH KANAN (TIDAK MENUTUPI ROKET DI SISI KIRI) ──────── */}
        {gameState === 'playing' && (
          <div className="absolute top-2.5 sm:top-4 bottom-2.5 sm:bottom-4 right-2 sm:right-5 w-[46%] sm:w-[48%] max-w-[420px] z-10 pointer-events-none flex flex-col justify-between">
            <div className="w-full bg-slate-900/95 backdrop-blur-md border-3 border-emerald-400 rounded-2xl p-3 sm:p-4 text-center space-y-2 sm:space-y-3 shadow-[5px_5px_0px_0px_#000] pointer-events-auto h-full flex flex-col justify-between overflow-y-auto">
              {/* Status Header Terminal */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 border-b border-emerald-400/30 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span className="truncate">KONSOL KENDALI NUSANTARA-1</span>
                </div>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] shrink-0">
                  {launchStage === 'LAUNCHING'
                    ? 'MELUNCUR'
                    : launchStage === 'READY_FOR_ENTER' || launchStage === 'SECOND_ENTER'
                    ? 'SIAP IGNISI'
                    : 'INPUT KODE'}
                </span>
              </div>

              {/* Tampilan Kode Target & Input */}
              <div className="py-0.5 sm:py-1">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-300 block uppercase mb-1 sm:mb-1.5">
                  {launchStage === 'WAITING_CODE'
                    ? '⌨️ KETIK KODE ANGKA BERIKUT:'
                    : currentMission.requireDoubleEnter && launchStage === 'SECOND_ENTER'
                    ? '⚠️ TAHAP 1 LEPAS! TEKAN ENTER SEKALI LAGI:'
                    : '✅ KODE LENGKAP! SIAPKAN PELUNCURAN:'}
                </span>

                <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 font-mono font-black text-xl sm:text-3xl text-white">
                  {targetCode.split('').map((char, idx) => {
                    const isTyped = idx < typedInput.length;
                    return (
                      <span
                        key={idx}
                        className={`inline-block px-2 sm:px-3 py-1 rounded-lg border-2 transition-all ${
                          isTyped
                            ? 'bg-emerald-400 text-black border-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-slate-800 text-emerald-300 border-emerald-400/40'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Timer Darurat untuk Misi 3 */}
              {currentMission.hasEmergencyTimer && launchStage !== 'LAUNCHING' && (
                <div className="bg-rose-950/90 border border-rose-500 rounded-xl p-1.5 sm:p-2 text-left text-[10px] sm:text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-rose-300 font-bold">
                    <span>⚠️ DARURAT AWAN BADAI:</span>
                    <span className="text-rose-400 font-black">{Math.max(0, emergencyTimeLeft).toFixed(1)}s</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-black">
                    <div
                      className="h-full bg-rose-500 transition-all duration-100"
                      style={{ width: `${Math.max(0, (emergencyTimeLeft / 5.5) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Pengukur Tekanan Jarum (Gauge) jika aktif di Misi 2, 4, 5 */}
              {currentMission.hasGauge && (
                <div className="bg-slate-950 border border-emerald-400/40 rounded-xl p-1.5 sm:p-2 text-left text-[10px] sm:text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-300 font-bold">
                    <span>PENGUKUR TEKANAN (PRESSURE):</span>
                    <span className={gaugeValue >= 60 && gaugeValue <= 88 ? 'text-emerald-400 font-black' : 'text-amber-400 font-bold'}>
                      {Math.round(gaugeValue)}% {gaugeValue >= 60 && gaugeValue <= 88 ? '⭐ ZONA HIJAU' : ''}
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-black">
                    {/* Zona Hijau Ideal */}
                    <div className="absolute left-[60%] w-[28%] h-full bg-emerald-500/80" />
                    {/* Indikator Jarum */}
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-yellow-300 border border-black transition-all"
                      style={{ left: `${gaugeValue}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tombol / Callout Indikator Enter */}
              <div className="pt-0.5 sm:pt-1">
                {launchStage === 'WAITING_CODE' ? (
                  <div className="bg-slate-800/90 text-slate-300 font-mono text-[10px] sm:text-xs py-2 px-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5">
                    <span>Ketik kode di atas untuk membuka klem peluncuran</span>
                  </div>
                ) : (
                  <button
                    onClick={handleTriggerEnter}
                    className="w-full py-2.5 px-3 bg-rose-500 hover:bg-rose-400 text-white font-mono font-black text-xs sm:text-sm rounded-xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <CornerDownLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    <span>
                      {launchStage === 'SECOND_ENTER'
                        ? 'TEKAN ENTER 1x LAGI!'
                        : 'TEKAN ENTER SEKARANG!'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── OVERLAY: IDLE / COVER START SCREEN ────────────────────── */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-md w-full p-4 sm:p-5 text-center space-y-2 sm:space-y-3 animate-in fade-in zoom-in-95 duration-200 my-auto">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
                🚀
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 bg-amber-300 border border-black rounded-full text-[10px] sm:text-xs font-black font-mono shadow-[1px_1px_0px_0px_#000] mb-1 uppercase">
                  Fokus Motorik: Tombol Enter / Return
                </span>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black leading-tight">
                  Peluncuran Roket Antariksa
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1 leading-snug">
                  Bertindaklah sebagai Komandan Operator! Ketik kode hitung mundur lalu tekan <strong>ENTER</strong> secara tegas untuk meluncurkan roket dalam <strong>5 Misi Atmosfer (~5 Menit)</strong>.
                </p>
              </div>

              {/* Panduan Tombol Enter */}
              <div className="bg-blue-50 border-2 border-black rounded-xl p-2.5 text-left text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-950 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>KUNCI KONTROL OPERATOR:</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
                  <div className="bg-white border border-black/30 p-1.5 rounded">
                    <span className="font-black text-blue-700 block">1. Ketik Kode:</span>
                    <span>Ketik angka (misal: 3-2-1)</span>
                  </div>
                  <div className="bg-white border border-black/30 p-1.5 rounded">
                    <span className="font-black text-rose-600 block">2. Tekan ENTER:</span>
                    <span>Ignisi & luncurkan roket!</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-400 border-3 border-black font-heading font-black text-xs sm:text-sm text-white rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>MULAI MISI ANTARIKSA (TEKAN ENTER)</span>
              </button>
            </div>
          </div>
        )}

        {/* ── OVERLAY: COUNTDOWN MULAI MISI ─────────────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="text-center space-y-2">
              <div className="text-6xl sm:text-8xl font-heading font-black text-yellow-300 drop-shadow-[5px_5px_0px_#000] animate-bounce">
                {missionCountdown > 0 ? missionCountdown : 'SIAPKAN ENTER!'}
              </div>
              <div className="bg-white border-2 border-black px-3.5 py-1 rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[2px_2px_0px_0px_#000]">
                {currentMission.title}
              </div>
            </div>
          </div>
        )}

        {/* ── OVERLAY: JEDA (PAUSE) ─────────────────────────────────── */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-xs sm:max-w-sm w-full p-4 sm:p-5 text-center space-y-3 my-auto">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-black">Misi Dijeda</h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                Pusat kendali sedang dijeda sejenak. Rilekskan jemari tanganmu sebelum kembali meluncurkan roket!
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-2 bg-blue-400 hover:bg-blue-300 border-2 sm:border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  Lanjutkan Misi
                </button>
                <button
                  onClick={handleStartGame}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 border-2 border-black font-heading font-bold text-xs text-black rounded-xl cursor-pointer"
                >
                  Ulangi Dari Misi 1
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── OVERLAY: SELESAI MISI (WAVE CLEAR) ────────────────────── */}
        {gameState === 'wave_clear' && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-md w-full p-3.5 sm:p-5 text-center space-y-2 sm:space-y-2.5 animate-in zoom-in-95 duration-200 my-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-yellow-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
                ⭐
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-mono font-black uppercase text-blue-600 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded">
                  Misi {currentMission.mission} Berhasil!
                </span>
                <h3 className="font-heading font-black text-lg sm:text-xl text-black mt-0.5">
                  Peluncuran Sempurna, Komandan!
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] font-mono text-left bg-slate-50 border-2 border-black p-2 sm:p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-500 block">Total Peluncuran:</span>
                  <span className="font-black text-black">{launchCount} Roket</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Kombo Maksimal:</span>
                  <span className="font-black text-orange-600">{maxCombo}x Beruntun</span>
                </div>
              </div>

              {/* Bonus Pemulihan Perisai */}
              {/* Bonus Pemulihan Perisai (Hanya jika ada misi berikutnya) */}
              {currentMissionIdx + 1 < MISSIONS_CONFIG.length && (
                <div className="bg-blue-50 border border-blue-400 p-1.5 sm:p-2 rounded-lg flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                  <span className="font-bold text-blue-950 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    <span>Bonus Misi Baru:</span>
                  </span>
                  <span className="font-black text-blue-800 bg-white border border-blue-300 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                    Perisai Pulih Penuh (3/3 🛡️)
                  </span>
                </div>
              )}

              {/* Tips babak selanjutnya */}
              {currentMissionIdx + 1 < MISSIONS_CONFIG.length && (
                <div className="bg-amber-100 border border-amber-400 p-2 rounded-lg text-left text-[10px] sm:text-[11px] text-amber-950 font-medium">
                  <strong>Tips Misi Berikutnya:</strong> {MISSIONS_CONFIG[currentMissionIdx + 1].tip}
                </div>
              )}

              <button
                onClick={handleNextMission}
                className="w-full py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-400 border-3 border-black font-heading font-black text-xs sm:text-sm text-white rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentMissionIdx + 1 < MISSIONS_CONFIG.length
                    ? `LANJUT KE MISI ${currentMission.mission + 1} (TEKAN ENTER)`
                    : 'LIHAT KEMENANGAN AKHIR (TEKAN ENTER)'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── OVERLAY: GAME OVER (WAKTU HABIS / PERISAI HABIS) ───────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-xs sm:max-w-sm w-full p-4 sm:p-5 text-center space-y-2.5 my-auto">
              <div className="w-11 h-11 bg-rose-200 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
                {gameOverReason === 'time_up' || timeLeft <= 0 ? '⏱️' : '💥'}
              </div>
              <h3 className="font-heading font-black text-xl text-black">
                {gameOverReason === 'time_up' || timeLeft <= 0 ? 'Waktu Misi Habis!' : 'Perisai Roket Habis!'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                {gameOverReason === 'time_up' || timeLeft <= 0
                  ? `Target peluncuran belum terpenuhi (${missionLaunchCount} dari ${currentMission.targetCount} roket). Ayo ulangi misi ${currentMission.mission} dengan mengetik lebih cepat!`
                  : 'Seluruh perisai roket telah rusak. Misi antariksa gagal dan harus diulang kembali dari awal (Misi 1).'}
              </p>
              <div className="bg-slate-100 border-2 border-black p-2 rounded-xl font-mono text-xs">
                {gameOverReason === 'time_up' || timeLeft <= 0 ? 'Skor Saat Ini:' : 'Skor Akhir:'}{' '}
                <span className="font-black text-black">{score}</span>
              </div>

              {gameOverReason === 'time_up' || timeLeft <= 0 ? (
                <div className="space-y-2">
                  <button
                    onClick={handleRetryCurrentMission}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 border-2 sm:border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ULANGI MISI {currentMission.mission} (TEKAN ENTER)</span>
                  </button>
                  <button
                    onClick={handleStartGame}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-400 font-mono text-[11px] text-slate-700 rounded-lg cursor-pointer transition-all"
                  >
                    Atau ulangi dari awal (Misi 1)
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartGame}
                  className="w-full py-2.5 bg-rose-400 hover:bg-rose-300 border-2 sm:border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ULANGI DARI AWAL (TEKAN ENTER)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── OVERLAY: VICTORY SCREEN (TAMAT 5 MISI LENGKAP) ─────────── */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl max-w-md w-full p-4 sm:p-5 text-center space-y-2.5 animate-in zoom-in-95 duration-300 my-auto">
              <div className="w-12 h-12 bg-yellow-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000] animate-bounce">
                🌕
              </div>

              <div>
                <span className="px-2.5 py-0.5 bg-blue-300 border border-black rounded-full text-[10px] sm:text-xs font-black font-mono shadow-[1px_1px_0px_0px_#000]">
                  MISI 5 ATMOSFER LENGKAP TERCAPAI!
                </span>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black mt-1">
                  Komandan Antariksa Utama!
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                  Selamat! Kamu telah menguasai tombol ENTER dengan kecepatan dan ketepatan eksekusi tingkat tinggi!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 bg-blue-50 border-2 border-black p-2.5 rounded-xl font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Skor</span>
                  <span className="font-black text-black text-sm">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Peluncuran Sukses</span>
                  <span className="font-black text-blue-700 text-sm">{launchCount} Roket</span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-400 border-3 border-black font-heading font-black text-xs sm:text-sm text-white rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>LUNCURKAN MISI LAGI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM INTERACTIVE ENTER BAR & GUIDANCE ──────────────────── */}
      <div className="shrink-0 mt-auto bg-slate-100 border-t-3 border-black p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tips Operator:</strong> {currentMission.tip}
          </span>
        </div>

        {/* Tombol Enter Virtual (Bisa diklik mouse / disentuh) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleTriggerEnter}
            className={`w-full sm:w-64 py-2.5 px-4 font-mono font-black text-xs sm:text-sm uppercase rounded-xl border-3 border-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000] ${
              enterPressedVisual || launchStage !== 'WAITING_CODE'
                ? 'bg-rose-500 text-white translate-x-0.5 translate-y-0.5 shadow-none animate-pulse'
                : 'bg-white hover:bg-slate-100 text-black'
            }`}
          >
            <CornerDownLeft className="w-4 h-4 stroke-[3]" />
            <span>TEKAN TOMBOL ENTER</span>
            <span className="text-[10px] font-bold bg-white/90 text-black px-1.5 py-0.5 rounded border border-black/40">
              IGNISI
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
