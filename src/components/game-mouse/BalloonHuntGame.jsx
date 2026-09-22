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
  Target,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Crosshair,
  Award,
  Star,
  Info,
  Flame,
} from 'lucide-react';
import { balloonAudio } from '@/lib/balloonAudio';

// ─── KONFIGURASI 5 BABAK (TOTAL ~4.5 - 5 MENIT) ───────────────────
const WAVES_CONFIG = [
  {
    wave: 1,
    title: 'Babak 1: Pemanasan Balon Santai',
    subtitle: 'Fokus: Memegang mouse stabil & klik kiri tanpa menyeret',
    duration: 45, // detik
    targetCount: 15,
    speedBase: 1.3,
    sizeRange: [38, 48], // balon besar
    types: ['normal'],
    spawnInterval: 1400,
    wind: false,
    tip: 'Arahkan kursor tepat ke tengah balon, lalu tekan tombol kiri mouse 1 kali dengan tenang!',
  },
  {
    wave: 2,
    title: 'Babak 2: Warna-Warni & Refleks Kecepatan',
    subtitle: 'Fokus: Mengidentifikasi balon kuning yang lebih cepat',
    duration: 50,
    targetCount: 20,
    speedBase: 1.8,
    sizeRange: [30, 42],
    types: ['normal', 'fast'],
    spawnInterval: 1200,
    wind: false,
    tip: 'Hati-hati dengan Balon Kuning Kancil! Balon itu terbang lebih cepat dari yang lain.',
  },
  {
    wave: 3,
    title: 'Babak 3: Terpaan Angin Liuk-Liuk',
    subtitle: 'Fokus: Melacak gerakan kursor secara halus mengikuti balon',
    duration: 60,
    targetCount: 22,
    speedBase: 1.9,
    sizeRange: [28, 38],
    types: ['normal', 'fast', 'wind'],
    spawnInterval: 1100,
    wind: true,
    tip: 'Angin kencang bertiup! Balon ungu akan bergoyang ke kiri dan ke kanan. Ikuti ritmenya!',
  },
  {
    wave: 4,
    title: 'Babak 4: Balon Emas & Hindari Balon Duri!',
    subtitle: 'Fokus: Akurasi selektif (Anti-Spam Klik)',
    duration: 60,
    targetCount: 25,
    speedBase: 2.1,
    sizeRange: [26, 38],
    types: ['normal', 'fast', 'wind', 'gold', 'spike'],
    spawnInterval: 1000,
    wind: true,
    tip: '⭐ Klik Balon Emas untuk bonus besar! ⚠️ JANGAN klik Balon Duri Hitam karena akan mengurangi skor!',
  },
  {
    wave: 5,
    title: 'Babak 5: Pesta Balon Pamungkas (Grand Finale)',
    subtitle: 'Fokus: Refleks puncak & meletuskan Balon Raksasa',
    duration: 65,
    targetCount: 30,
    speedBase: 2.4,
    sizeRange: [24, 38],
    types: ['normal', 'fast', 'wind', 'gold', 'spike', 'giant'],
    spawnInterval: 850,
    wind: true,
    tip: 'Balon Raksasa Pink butuh 3x klik kiri cepat untuk pecah! Buktikan kehebatan jemarimu!',
  },
];

const BALLOON_PALETTES = {
  red: { fill: '#EF4444', border: '#B91C1C', highlight: '#FCA5A5' },
  blue: { fill: '#3B82F6', border: '#1D4ED8', highlight: '#93C5FD' },
  green: { fill: '#10B981', border: '#047857', highlight: '#6EE7B7' },
  orange: { fill: '#F97316', border: '#C2410C', highlight: '#FDBA74' },
  purple: { fill: '#8B5CF6', border: '#6D28D9', highlight: '#C4B5FD' },
  gold: { fill: '#FBBF24', border: '#B45309', highlight: '#FEF08A' },
  spike: { fill: '#1E293B', border: '#0F172A', highlight: '#475569' },
  giant: { fill: '#EC4899', border: '#BE185D', highlight: '#F472B6' },
};

// ─── STATIC CANVAS DRAW HELPERS ───────────────────────────────────
const drawClouds = (ctx, width, height, time) => {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  const offset = (time * 0.015) % (width + 300);

  const clouds = [
    { x: ((150 + offset) % (width + 200)) - 100, y: 70, s: 0.9 },
    { x: ((550 + offset * 0.7) % (width + 250)) - 120, y: 130, s: 1.2 },
    { x: ((900 + offset * 0.85) % (width + 300)) - 150, y: 85, s: 0.8 },
  ];

  clouds.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 28 * c.s, 0, Math.PI * 2);
    ctx.arc(c.x + 25 * c.s, c.y - 12 * c.s, 32 * c.s, 0, Math.PI * 2);
    ctx.arc(c.x + 55 * c.s, c.y, 25 * c.s, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
};

const drawBalloon = (ctx, b, wobble) => {
  const palette = BALLOON_PALETTES[b.colorKey] || BALLOON_PALETTES.blue;
  const r = b.radius;

  ctx.save();
  ctx.translate(b.x + wobble, b.y);

  // 1. Tali Balon (Wavy String)
  ctx.beginPath();
  ctx.moveTo(0, r * 1.2);
  ctx.bezierCurveTo(-6, r * 1.5, 6, r * 1.8, 0, r * 2.2);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. Simpul Bawah Balon
  ctx.beginPath();
  ctx.moveTo(-4, r * 1.15);
  ctx.lineTo(4, r * 1.15);
  ctx.lineTo(0, r * 1.28);
  ctx.closePath();
  ctx.fillStyle = palette.border;
  ctx.fill();

  // 3. Badan Balon (Oval / Teardrop Shape)
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 1.15, -r, r * 1.15, r * 0.8, 0, r * 1.15);
  ctx.bezierCurveTo(-r * 1.15, r * 0.8, -r * 1.15, -r, 0, -r);
  ctx.closePath();

  // Gradasi 3D Balon
  const grad = ctx.createRadialGradient(
    -r * 0.35,
    -r * 0.35,
    r * 0.1,
    0,
    0,
    r * 1.2
  );
  grad.addColorStop(0, palette.highlight);
  grad.addColorStop(0.4, palette.fill);
  grad.addColorStop(1, palette.border);

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 4. Kilau Cahaya (White Reflection Specular)
  ctx.beginPath();
  ctx.ellipse(-r * 0.38, -r * 0.35, r * 0.22, r * 0.36, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();

  // 5. Dekorasi Khusus berdasarkan Tipe
  if (b.type === 'spike') {
    // Duri-duri tajam pada balon obstacle
    ctx.fillStyle = '#DC2626';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const sx = Math.cos(a) * (r + 1);
      const sy = Math.sin(a) * (r + 1);
      const tx = Math.cos(a) * (r + 10);
      const ty = Math.sin(a) * (r + 10);
      ctx.beginPath();
      ctx.moveTo(sx - 4, sy);
      ctx.lineTo(tx, ty);
      ctx.lineTo(sx + 4, sy);
      ctx.fill();
    }
    // Tanda Bahaya X / Petir
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(r * 0.9)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠️', 0, 0);
  } else if (b.type === 'gold') {
    // Bintang berkilau
    ctx.fillStyle = '#78350F';
    ctx.font = `bold ${Math.round(r * 0.85)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', 0, 0);
  } else if (b.type === 'fast') {
    // Simbol Kilat
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(r * 0.8)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', 0, 0);
  } else if (b.type === 'giant') {
    // Hit counter untuk balon raksasa
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `black 22px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(`${b.hitsLeft}x`, 0, 0);
    ctx.fillText(`${b.hitsLeft}x`, 0, 0);
  }

  ctx.restore();
};

export default function BalloonHuntGame() {
  // Game states
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'countdown' | 'playing' | 'wave_clear' | 'paused' | 'gameover'
  const [currentWaveIdx, setCurrentWaveIdx] = useState(0);
  const [waveCountdown, setWaveCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(WAVES_CONFIG[0].duration);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [wavePoppedCount, setWavePoppedCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [hits, setHits] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0); // 0.8: Santai, 1.0: Normal, 1.25: Tantangan
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [usePinCursor, setUsePinCursor] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Slow motion power-up (from gold balloon)
  const slowMoRef = useRef(0); // timestamp until slowmo expires

  // Refs for engine loop
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const balloonsRef = useRef([]);
  const particlesRef = useRef([]);
  const floatingTextsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);
  const nextBalloonIdRef = useRef(1);

  const currentWave = WAVES_CONFIG[currentWaveIdx] || WAVES_CONFIG[0];
  const accuracy = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 100;

  // ─── HELPER: Toggle Sound ───────────────────────────────────────
  const handleToggleSound = () => {
    const newState = balloonAudio.toggleSound();
    setSoundEnabled(newState);
  };

  // ─── HELPER: Toggle Fullscreen ──────────────────────────────────
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

  // ─── SPAWN BALON ────────────────────────────────────────────────
  const spawnBalloon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wave = WAVES_CONFIG[currentWaveIdx];
    if (!wave) return;

    // Tentukan jenis balon
    const randTypeRoll = Math.random();
    let type = 'normal';

    if (wave.types.includes('giant') && Math.random() < 0.12) {
      type = 'giant';
    } else if (wave.types.includes('spike') && randTypeRoll < 0.2) {
      type = 'spike';
    } else if (wave.types.includes('gold') && randTypeRoll < 0.35) {
      type = 'gold';
    } else if (wave.types.includes('wind') && randTypeRoll < 0.6) {
      type = 'wind';
    } else if (wave.types.includes('fast') && randTypeRoll < 0.8) {
      type = 'fast';
    }

    // Ukuran & Warna
    let radius = Math.floor(
      wave.sizeRange[0] + Math.random() * (wave.sizeRange[1] - wave.sizeRange[0])
    );
    let colorKey = 'blue';
    let hitsNeeded = 1;
    let speed = wave.speedBase * (0.85 + Math.random() * 0.35) * speedMultiplier;

    if (type === 'fast') {
      radius = Math.max(22, radius - 6);
      speed *= 1.45;
      colorKey = 'orange';
    } else if (type === 'wind') {
      colorKey = 'purple';
      speed *= 1.05;
    } else if (type === 'gold') {
      radius = Math.max(24, radius - 4);
      speed *= 1.35;
      colorKey = 'gold';
    } else if (type === 'spike') {
      radius = Math.max(28, radius);
      speed *= 0.9;
      colorKey = 'spike';
    } else if (type === 'giant') {
      radius = 58;
      speed *= 0.7;
      hitsNeeded = 3;
      colorKey = 'giant';
    } else {
      const normalColors = ['red', 'blue', 'green'];
      colorKey = normalColors[Math.floor(Math.random() * normalColors.length)];
    }

    const padding = radius + 20;
    const x = padding + Math.random() * (canvas.width - padding * 2);
    const y = canvas.height + radius + 10;

    balloonsRef.current.push({
      id: nextBalloonIdRef.current++,
      x,
      y,
      baseX: x,
      radius,
      speed,
      type,
      colorKey,
      hitsNeeded,
      hitsLeft: hitsNeeded,
      windPhase: Math.random() * Math.PI * 2,
      windSpeed: 0.03 + Math.random() * 0.03,
      windAmp: type === 'wind' ? 35 + Math.random() * 25 : 10,
      wobblePhase: Math.random() * Math.PI * 2,
    });
  }, [currentWaveIdx, speedMultiplier]);

  // ─── SPAWN PARTICLES & FLOATING TEXTS ───────────────────────────
  const createExplosion = (x, y, color, count = 14) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: 3 + Math.random() * 4,
        color,
        alpha: 1,
        life: 0.95,
      });
    }
  };

  const addFloatingText = (x, y, text, color = '#000', size = 18) => {
    floatingTextsRef.current.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1,
      vy: -2,
    });
  };

  // ─── CLICK / HIT HANDLING (ACCURACY LOGIC) ──────────────────────
  const handleCanvasClick = (e) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    setTotalClicks((prev) => prev + 1);

    // Hit-testing dari balon paling atas (z-order)
    let hitIndex = -1;
    for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
      const b = balloonsRef.current[i];
      // Jarak Euclidean ke pusat balon
      const dx = clickX - b.x;
      const dy = clickY - (b.y - b.radius * 0.1); // Kompensasi bentuk oval
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= b.radius * 1.1) {
        hitIndex = i;
        break;
      }
    }

    if (hitIndex !== -1) {
      // ─── HIT SUKSES ───
      const target = balloonsRef.current[hitIndex];
      setHits((prev) => prev + 1);

      if (target.type === 'spike') {
        // BALON DURI: Penalti!
        balloonAudio.playSpikeHit();
        setCombo(0);
        setScore((prev) => Math.max(0, prev - 100));
        addFloatingText(target.x, target.y, 'UPS! DURI -100', '#EF4444', 20);
        createExplosion(target.x, target.y, '#1E293B', 12);
        balloonsRef.current.splice(hitIndex, 1);
        return;
      }

      // Balon Biasa / Cepat / Angin / Emas / Giant
      target.hitsLeft -= 1;

      if (target.hitsLeft > 0) {
        // Balon Giant belum pecah (perlu klik lagi)
        balloonAudio.playPop(combo);
        target.radius = Math.max(35, target.radius - 10);
        createExplosion(target.x, target.y, '#EC4899', 6);
        addFloatingText(target.x, target.y, `KLIK LAGI! (${target.hitsLeft}x)`, '#EC4899', 16);
      } else {
        // Balon Pecah Sepenuhnya!
        balloonsRef.current.splice(hitIndex, 1);

        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setPoppedCount((prev) => prev + 1);
        setWavePoppedCount((prev) => prev + 1);

        const palette = BALLOON_PALETTES[target.colorKey] || BALLOON_PALETTES.blue;
        createExplosion(target.x, target.y, palette.fill, 16);

        let points = 50;
        let praise = '';

        if (target.type === 'fast') {
          points = 90;
          praise = 'CEPAT!';
        } else if (target.type === 'wind') {
          points = 110;
          praise = 'TEPAT!';
        } else if (target.type === 'gold') {
          points = 250;
          praise = '⭐ BONUS EMAS!';
          slowMoRef.current = Date.now() + 4000; // 4 detik slow-motion
          balloonAudio.playGoldChime();
        } else if (target.type === 'giant') {
          points = 300;
          praise = '💥 BALON RAKSASA!';
        } else {
          points = 50;
          if (newCombo % 5 === 0) praise = `COMBO x${newCombo}!`;
        }

        // Skor kombo tambahan
        const comboBonus = Math.min(newCombo * 10, 100);
        const totalAwarded = points + comboBonus;
        setScore((prev) => prev + totalAwarded);

        if (target.type !== 'gold') {
          balloonAudio.playPop(newCombo);
        }

        const displayText = praise ? `${praise} +${totalAwarded}` : `+${totalAwarded}`;
        addFloatingText(
          target.x,
          target.y,
          displayText,
          target.type === 'gold' ? '#D97706' : palette.fill,
          target.type === 'gold' || target.type === 'giant' ? 22 : 18
        );
      }
    } else {
      // ─── KLIK MELESET DI AREA KOSONG ───
      setCombo(0);
      addFloatingText(clickX, clickY, 'Meleset', '#64748B', 14);
    }
  };

  // ─── MULAI GAME & RESUMING ──────────────────────────────────────
  const startGame = () => {
    balloonAudio.init();
    setCurrentWaveIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPoppedCount(0);
    setWavePoppedCount(0);
    setTotalClicks(0);
    setHits(0);
    balloonsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    startWaveCountdown(0);
  };

  const startWaveCountdown = (waveIdx) => {
    setCurrentWaveIdx(waveIdx);
    setWavePoppedCount(0);
    balloonsRef.current = [];
    setTimeLeft(WAVES_CONFIG[waveIdx].duration);
    setWaveCountdown(3);
    setGameState('countdown');
    balloonAudio.playWaveStart();
  };

  // ─── EVALUASI WAKTU HABIS / BABAK SELESAI ────────────────────────
  const handleWaveComplete = useCallback(() => {
    if (currentWaveIdx < WAVES_CONFIG.length - 1) {
      // Masih ada babak berikutnya
      setGameState('wave_clear');
      balloonAudio.playWaveStart();
    } else {
      // Seluruh 5 Babak Selesai! (Tamat)
      setGameState('gameover');
      balloonAudio.playVictory();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [currentWaveIdx]);

  // Hitung mundur sebelum tiap babak (3, 2, 1, GO!)
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const interval = setInterval(() => {
      setWaveCountdown((prev) => {
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

  // ─── TIMER BERJALAN SETIAP DETIK SAAT BERMAIN ──────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleWaveComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, handleWaveComplete]);

  // ─── RESIZE CANVAS MENGACU PADA CONTAINER ────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = Math.min(Math.max(500, window.innerHeight * 0.65), 650);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── GAME ENGINE ANIMATION LOOP (60 FPS) ────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = (time) => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Bersihkan canvas
      ctx.clearRect(0, 0, width, height);

      // Latar belakang langit gradasi ceria
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#E0F2FE'); // Biru langit cerah
      skyGrad.addColorStop(0.7, '#F0F9FF');
      skyGrad.addColorStop(1, '#FEF3C7'); // Sentuhan kuning lembut di bawah
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Gambar awan kartun halus di latar
      drawClouds(ctx, width, height, time);

      const isSlowMo = Date.now() < slowMoRef.current;
      const timeScale = isSlowMo ? 0.45 : 1.0;

      // ─── UPDATE & GAMBAR BALON ───
      if (gameState === 'playing') {
        const wave = WAVES_CONFIG[currentWaveIdx];

        // Cek spawn balon baru
        if (time - lastSpawnTimeRef.current > wave.spawnInterval * (isSlowMo ? 1.5 : 1)) {
          spawnBalloon();
          lastSpawnTimeRef.current = time;
        }

        // Loop update balon
        for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
          const b = balloonsRef.current[i];

          // Naik ke atas
          b.y -= b.speed * timeScale;

          // Efek terpaan angin (goyang gelombang sinus)
          if (wave.wind || b.type === 'wind') {
            b.windPhase += b.windSpeed * timeScale;
            b.x = b.baseX + Math.sin(b.windPhase) * b.windAmp;
          }

          // Efek sedikit bergoyang natural
          b.wobblePhase += 0.04 * timeScale;
          const wobble = Math.sin(b.wobblePhase) * 2;

          drawBalloon(ctx, b, wobble);

          // Hapus balon yang sudah terbang keluar layar atas
          if (b.y + b.radius < -20) {
            balloonsRef.current.splice(i, 1);
          }
        }
      } else if (balloonsRef.current.length > 0) {
        // Render balon tetap jika pause / wave clear
        balloonsRef.current.forEach((b) => drawBalloon(ctx, b, 0));
      }

      // ─── UPDATE & GAMBAR PARTIKEL ───
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // Gravitasi
        p.alpha *= p.life;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0.05) {
          particlesRef.current.splice(i, 1);
        }
      }

      // ─── UPDATE & GAMBAR FLOATING TEXTS ───
      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatingTextsRef.current[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = `900 ${ft.size}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();

        if (ft.alpha <= 0.05) {
          floatingTextsRef.current.splice(i, 1);
        }
      }

      // Slow motion indicator badge di canvas
      if (isSlowMo && gameState === 'playing') {
        ctx.save();
        ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 110, 16, 220, 36, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 13px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⏳ SLOW-MOTION AKTIF!', width / 2, 39);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, currentWaveIdx, speedMultiplier, spawnBalloon]);

  // ─── STAR RATING CALCULATION ─────────────────────────────────────
  const getStarRating = () => {
    if (score >= 4000 && accuracy >= 80) return 3;
    if (score >= 2200 && accuracy >= 65) return 2;
    return 1;
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* ─── HUD / HEADER ATAS GAME ──────────────────────────────── */}
      <div className="relative z-10 bg-[#FFFDF5] border-b-3 border-black p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 select-none">
        {/* Kolom Kiri: Indikator Babak */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
            <span className="font-heading font-black text-xs sm:text-sm text-black">
              BABAK {currentWave.wave} / {WAVES_CONFIG.length}
            </span>
            <span className="hidden xl:inline text-xs font-mono font-bold text-slate-700">
              ({currentWave.title.split(':')[1]})
            </span>
          </div>

          {/* Sisa Waktu Babak */}
          <div
            className={`border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 font-mono font-black text-xs sm:text-sm ${
              timeLeft <= 10 ? 'bg-rose-400 text-white animate-pulse' : 'bg-white text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{timeLeft} dtk</span>
          </div>
        </div>

        {/* Kolom Tengah: Statistik Poin & Akurasi */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
          {/* Skor */}
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span className="font-bold">Skor:</span>
            <span className="font-black text-black text-xs sm:text-sm">{score}</span>
          </div>

          {/* Akurasi */}
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
            <span className="font-bold hidden sm:inline">Akurasi:</span>
            <span
              className={`font-black text-xs sm:text-sm ${
                accuracy >= 80
                  ? 'text-emerald-600'
                  : accuracy >= 60
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {accuracy}%
            </span>
          </div>

          {/* Combo */}
          {combo > 1 && (
            <div className="bg-rose-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md flex items-center gap-1 font-black animate-bounce text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Pengaturan Cepat & Kontrol */}
        <div className="flex items-center gap-1.5">
          {/* Pilihan Mode Kecepatan */}
          <select
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            disabled={gameState === 'playing'}
            className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-1 rounded-md font-mono text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-50"
            title="Pilih tingkat kecepatan balon"
          >
            <option value={0.8}>Kecepatan: Santai</option>
            <option value={1.0}>Kecepatan: Normal</option>
            <option value={1.25}>Kecepatan: Cepat</option>
          </select>

          {/* Toggle Kursor Pin / Crosshair */}
          <button
            onClick={() => setUsePinCursor(!usePinCursor)}
            className={`p-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md transition-all cursor-pointer ${
              usePinCursor ? 'bg-cyan-300' : 'bg-white'
            }`}
            title={usePinCursor ? 'Kursor Target Aktif' : 'Kursor Standar'}
          >
            <Crosshair className="w-4 h-4 text-black" />
          </button>

          {/* Toggle Suara */}
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

          {/* Pause / Resume */}
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="p-1.5 bg-amber-300 hover:bg-amber-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md font-mono font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Jeda Game"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {gameState === 'paused' && (
            <button
              onClick={() => setGameState('playing')}
              className="p-1.5 bg-emerald-400 hover:bg-emerald-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-md font-mono font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Lanjut Main"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen */}
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

      {/* ─── KANVAS UTAMA GAME ───────────────────────────────────── */}
      <div className="relative flex-1 bg-sky-100 overflow-hidden select-none min-h-[480px] sm:min-h-[520px]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`w-full block select-none ${
            usePinCursor ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        />

        {/* ─── OVERLAY 1: IDLE / WELCOME SCREEN ─────────────────── */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 sm:space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
                🎈
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <div className="inline-block bg-cyan-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                  Game 1 • Klik Kiri & Akurasi
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Buru Balon Terbang
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                  Arahkan kursor dan klik kiri tepat pada balon sebelum terbang tinggi ke langit! Terdiri dari <strong>5 Babak (~4.5 - 5 menit)</strong> untuk melatih refleks jemarimu.
                </p>
              </div>

              {/* Panduan Jenis Balon */}
              <div className="bg-[#FFFDF5] border-2 border-black rounded-xl p-2.5 sm:p-3 text-left space-y-1.5 text-xs font-mono">
                <div className="font-black text-black border-b border-black pb-1 flex items-center gap-1.5 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kamus Sasaran Balon:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] sm:text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 border border-black shrink-0"></span>
                    <span className="truncate">Biasa (+50)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-orange-500 border border-black shrink-0"></span>
                    <span className="truncate">⚡ Cepat (+90)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500 border border-black shrink-0"></span>
                    <span className="truncate">🌬️ Angin (+110)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 border border-black shrink-0"></span>
                    <span className="truncate">⭐ Emas (+250)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-800 border border-black shrink-0"></span>
                    <span className="truncate">⚠️ Duri (Hindari)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-pink-500 border border-black shrink-0"></span>
                    <span className="truncate">💥 Jumbo (Klik 3x)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>MULAI PETUALANGAN BALON</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 2: COUNTDOWN ANTAR BABAK ─────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3 my-auto animate-in zoom-in-90 duration-200">
              <div className="inline-block bg-amber-300 border-2 border-black px-2.5 py-1 rounded text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                {currentWave.title}
              </div>
              <p className="text-xs font-mono font-bold text-slate-700 leading-snug">
                {currentWave.tip}
              </p>
              <div className="py-1">
                <span className="inline-block font-heading font-black text-5xl sm:text-6xl text-amber-500 animate-ping duration-1000">
                  {waveCountdown > 0 ? waveCountdown : 'GO!'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Arahkan kursor mouse dan bersiaplah mengklik!
              </p>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 3: WAVE CLEAR SCREEN ─────────────────────── */}
        {gameState === 'wave_clear' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center space-y-3.5 my-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-black text-lg sm:text-xl text-black">
                  Babak {currentWave.wave} Selesai! 🎉
                </h3>
                <p className="text-xs font-mono text-slate-600">
                  Kerja bagus! Refleks dan akurasi tanganmu semakin tajam.
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Skor Sementara</span>
                  <span className="font-black text-sm sm:text-base text-black">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Akurasi Klik</span>
                  <span className="font-black text-sm sm:text-base text-emerald-600">{accuracy}%</span>
                </div>
              </div>

              <button
                onClick={() => startWaveCountdown(currentWaveIdx + 1)}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs sm:text-sm uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>LANJUT KE BABAK {currentWave.wave + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── OVERLAY 4: PAUSED SCREEN ─────────────────────────── */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-xs w-full text-center space-y-3 my-auto">
              <div className="w-11 h-11 bg-amber-300 border-2 border-black rounded-xl mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Pause className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-heading font-black text-lg text-black">Game Dijeda</h3>
              <p className="text-xs font-mono text-slate-600">
                Istirahat sejenak sambil melemaskan pergelangan tangan.
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

        {/* ─── OVERLAY 5: GAME OVER / VICTORY RAPOR SCREEN ──────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-30 overflow-y-auto">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 my-auto animate-in zoom-in-95 duration-200">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
                🏆
              </div>

              <div className="space-y-1">
                <div className="inline-block bg-emerald-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                  Pelatihan Mouse Selesai!
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Rapor Pemburu Balon
                </h2>
                <p className="text-[11px] sm:text-xs font-mono text-slate-600">
                  Selamat! Kamu telah menyelesaikan seluruh 5 babak latihan mouse.
                </p>
              </div>

              {/* Bintang Penghargaan (1 - 3 Bintang) */}
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
                    ? '🌟 LUAR BIASA! MASTER AKURASI'
                    : getStarRating() === 2
                    ? '✨ HEBAT! TERUS TINGKATKAN'
                    : '👍 BAGUS! TETAP SEMANGAT BERLATIH'}
                </span>
              </div>

              {/* Rincian Statistik Rapor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left font-mono">
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Total Skor</span>
                  <span className="font-black text-base sm:text-lg text-black">{score}</span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Akurasi</span>
                  <span
                    className={`font-black text-base sm:text-lg ${
                      accuracy >= 80 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {accuracy}%
                  </span>
                </div>
                <div className="bg-slate-50 border-2 border-black rounded-lg p-2">
                  <span className="text-slate-500 text-[10px] block font-bold">Balon Pecah</span>
                  <span className="font-black text-base sm:text-lg text-black">{poppedCount}</span>
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

      {/* ─── FOOTER BAR GAME TIPS ─────────────────────────────────── */}
      <div className="relative z-10 bg-[#FFFDF5] border-t-2 border-black px-3.5 sm:px-4 py-2 flex flex-wrap items-center justify-between text-xs font-mono text-slate-700 gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0 max-w-xl">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-bold shrink-0">Tips Guru:</span>
          <span className="truncate">{currentWave.tip}</span>
        </div>
        <div className="text-[11px] text-slate-500 hidden md:block shrink-0">
          Total 5 Babak • Durasi ~4.5 Menit • Melatih Motorik Halus
        </div>
      </div>
    </div>
  );
}
