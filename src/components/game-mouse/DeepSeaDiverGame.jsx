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
  Clock,
  CheckCircle2,
  ChevronRight,
  Star,
  Info,
  Camera,
  Navigation,
  Compass,
  ArrowDown,
  ArrowUp,
  ShieldAlert,
} from 'lucide-react';
import { deepSeaAudio } from '@/lib/deepSeaAudio';

// ─── KONFIGURASI 5 ZONA KEDALAMAN SAMUDRA (~4.5 - 5 MENIT) ──────────
const EXPEDITIONS_CONFIG = [
  {
    stage: 1,
    title: 'Ekspedisi 1: Zona Epipelagik (0 - 500m)',
    subtitle: 'Zona Terang: Putar scroll wheel ke bawah perlahan untuk menyelam',
    depthMin: 0,
    depthMax: 500,
    duration: 55, // detik
    bgClass: 'from-sky-400 via-blue-500 to-indigo-700',
    lightIntensity: 1.0,
    targets: [
      { id: 'turtle', name: 'Penyu Hijau Samudra', icon: '🐢', depth: 70, xPercent: 25, hint: 'Berenang santai di kedalaman 70m' },
      { id: 'dolphin', name: 'Lumba-Lumba Ceria', icon: '🐬', depth: 140, xPercent: 75, hint: 'Meluncur lincah di kedalaman 140m' },
      { id: 'clownfish', name: 'Ikan Badut Karang', icon: '🐠', depth: 220, xPercent: 35, hint: 'Bermain di anemon karang 220m' },
      { id: 'seahorse', name: 'Kuda Laut Emas', icon: '🪸', depth: 300, xPercent: 80, hint: 'Bersembunyi di rumput laut 300m' },
      { id: 'starfish', name: 'Bintang Laut Megah', icon: '⭐', depth: 380, xPercent: 40, hint: 'Menempel di tebing karang 380m' },
      { id: 'manta', name: 'Ikan Pari Manta', icon: '🪁', depth: 460, xPercent: 65, hint: 'Melayang anggun di kedalaman 460m' },
    ],
    obstacles: [
      { id: 'driftwood', name: 'Batang Kayu Hanyut', icon: '🪵', depth: 105, xPercent: 50, width: 60 },
      { id: 'fishing_net', name: 'Jaring Nelayan Usang', icon: '🕸️', depth: 260, xPercent: 60, width: 55 },
      { id: 'shallow_reef', name: 'Karang Tepi Dangkal', icon: '🪨', depth: 340, xPercent: 20, width: 55 },
      { id: 'floating_barrel', name: 'Drum Apung Terlantar', icon: '🛢️', depth: 420, xPercent: 55, width: 45 },
    ],
    bubbles: [
      { id: 'b1_1', depth: 50, xPercent: 20 },
      { id: 'b1_2', depth: 115, xPercent: 80 },
      { id: 'b1_3', depth: 190, xPercent: 45 },
      { id: 'b1_4', depth: 275, xPercent: 25 },
      { id: 'b1_5', depth: 350, xPercent: 70 },
      { id: 'b1_6', depth: 430, xPercent: 35 },
    ],
    tip: 'Putar roda scroll mouse ke BAWAH untuk menyelam, ke ATAS untuk naik!',
  },
  {
    stage: 2,
    title: 'Ekspedisi 2: Zona Mesopelagik (500 - 1.800m)',
    subtitle: 'Zona Remang: Hindari ubur-ubur listrik dengan scroll naik-turun',
    depthMin: 500,
    depthMax: 1800,
    duration: 55,
    bgClass: 'from-blue-700 via-indigo-900 to-slate-950',
    lightIntensity: 0.75,
    targets: [
      { id: 'whale', name: 'Paus Bungkuk Biru', icon: '🐋', depth: 700, xPercent: 70, hint: 'Raksasa samudra melintas di 700m' },
      { id: 'rainbow_jelly', name: 'Ubur-Ubur Pelangi', icon: '🪼', depth: 900, xPercent: 30, hint: 'Bercahaya lembut di kedalaman 900m' },
      { id: 'swordfish', name: 'Ikan Pedang Todak', icon: '🐟', depth: 1120, xPercent: 75, hint: 'Menukik lincah di kedalaman 1.120m' },
      { id: 'barracuda', name: 'Barakuda Perak', icon: '🦈', depth: 1340, xPercent: 25, hint: 'Patroli cepat di kedalaman 1.340m' },
      { id: 'nautilus', name: 'Nautilus Purba', icon: '🐚', depth: 1550, xPercent: 60, hint: 'Fosil hidup mengapung di 1.550m' },
      { id: 'giant_clam', name: 'Kerang Mutiara Raksasa', icon: '🦪', depth: 1740, xPercent: 40, hint: 'Mutiara berkilau di dasar tebing 1.740m' },
    ],
    obstacles: [
      { id: 'jelly1', name: 'Ubur-Ubur Listrik', icon: '⚡', depth: 780, xPercent: 45, width: 45 },
      { id: 'jelly2', name: 'Kawanan Ubur Listrik', icon: '⚡', depth: 1020, xPercent: 60, width: 45 },
      { id: 'deep_reef1', name: 'Pilar Karang Hitam', icon: '🪨', depth: 1240, xPercent: 35, width: 55 },
      { id: 'jelly3', name: 'Ubur-Ubur Listrik', icon: '⚡', depth: 1450, xPercent: 70, width: 45 },
      { id: 'mine1', name: 'Ranjau Laut Berkarat', icon: '💣', depth: 1660, xPercent: 25, width: 45 },
    ],
    bubbles: [
      { id: 'b2_1', depth: 620, xPercent: 60 },
      { id: 'b2_2', depth: 840, xPercent: 20 },
      { id: 'b2_3', depth: 1060, xPercent: 80 },
      { id: 'b2_4', depth: 1280, xPercent: 50 },
      { id: 'b2_5', depth: 1490, xPercent: 30 },
      { id: 'b2_6', depth: 1700, xPercent: 75 },
    ],
    tip: 'Arahkan kapal selam mendekati hewan laut, lalu klik tombol FOTO saat kotak bidik mengunci!',
  },
  {
    stage: 3,
    title: 'Ekspedisi 3: Zona Batipelagik (1.800 - 4.500m)',
    subtitle: 'Zona Gelap Gulita: Gunakan lampu sorot kapal selam untuk melacak sasaran',
    depthMin: 1800,
    depthMax: 4500,
    duration: 60,
    bgClass: 'from-indigo-950 via-slate-950 to-black',
    lightIntensity: 0.45,
    targets: [
      { id: 'anglerfish', name: 'Ikan Lentera (Anglerfish)', icon: '🐡', depth: 2200, xPercent: 35, hint: 'Umpan lenteranya menyala di 2.200m' },
      { id: 'viperfish', name: 'Ikan Bertaring (Viperfish)', icon: '🐍', depth: 2650, xPercent: 80, hint: 'Mata tajam berburu di 2.650m' },
      { id: 'giant_squid', name: 'Cumi Raksasa Kraken', icon: '🦑', depth: 3100, xPercent: 30, hint: 'Tentakel raksasa bergerak di 3.100m' },
      { id: 'oarfish', name: 'Ikan Naga Rajalaut', icon: '🐉', depth: 3580, xPercent: 70, hint: 'Tubuh perak meliuk di 3.580m' },
      { id: 'gulper_eel', name: 'Belut Mulut Raksasa', icon: '🪱', depth: 4020, xPercent: 25, hint: 'Rahang lebar menelan di 4.020m' },
      { id: 'shipwreck', name: 'Bangkai Kapal Bajak Laut', icon: '🏴‍☠️', depth: 4420, xPercent: 55, hint: 'Harta karun kuno karam di 4.420m' },
    ],
    obstacles: [
      { id: 'reef1', name: 'Taji Karang Basalt', icon: '🪨', depth: 2400, xPercent: 60, width: 55 },
      { id: 'anchor', name: 'Jangkar Kuno Tertancap', icon: '⚓', depth: 2850, xPercent: 45, width: 50 },
      { id: 'reef2', name: 'Palung Karang Sempit', icon: '🪨', depth: 3340, xPercent: 20, width: 60 },
      { id: 'mine2', name: 'Ranjau Palung Berkarat', icon: '💣', depth: 3800, xPercent: 75, width: 45 },
      { id: 'wood_mast', name: 'Reruntuhan Tiang Kapal', icon: '🪵', depth: 4220, xPercent: 35, width: 55 },
    ],
    bubbles: [
      { id: 'b3_1', depth: 2020, xPercent: 25 },
      { id: 'b3_2', depth: 2480, xPercent: 75 },
      { id: 'b3_3', depth: 2980, xPercent: 40 },
      { id: 'b3_4', depth: 3440, xPercent: 65 },
      { id: 'b3_5', depth: 3900, xPercent: 30 },
      { id: 'b3_6', depth: 4320, xPercent: 80 },
    ],
    tip: 'Hati-hati dengan bebatuan karang dan ranjau! Scroll cepat ke atas jika hampir menabrak.',
  },
  {
    stage: 4,
    title: 'Ekspedisi 4: Zona Abisal (4.500 - 8.000m)',
    subtitle: 'Dasar Samudra Dalam: Suhu beku & cerobong uap hidrotermal aktif',
    depthMin: 4500,
    depthMax: 8000,
    duration: 60,
    bgClass: 'from-slate-950 via-zinc-950 to-black',
    lightIntensity: 0.35,
    targets: [
      { id: 'dumbo_octopus', name: 'Gurita Dumbo Langka', icon: '🐙', depth: 5000, xPercent: 30, hint: 'Telinga siripnya mengepak di 5.000m' },
      { id: 'tripod_fish', name: 'Ikan Berkaki Tripod', icon: '🦐', depth: 5550, xPercent: 75, hint: 'Berdiri di lumpur palung 5.550m' },
      { id: 'spider_crab', name: 'Kepiting Laba-Laba', icon: '🦀', depth: 6150, xPercent: 25, hint: 'Merayap di lereng jurang 6.150m' },
      { id: 'ghost_shark', name: 'Hiu Hantu Putih', icon: '🦈', depth: 6750, xPercent: 70, hint: 'Mata putih bercahaya di 6.750m' },
      { id: 'hydrothermal_vent', name: 'Cerobong Asap Magma', icon: '🌋', depth: 7350, xPercent: 45, hint: 'Menyemburkan mineral panas di 7.350m' },
      { id: 'deep_isopod', name: 'Kutu Laut Raksasa', icon: '🐛', depth: 7880, xPercent: 60, hint: 'Krustasea purba di dasar 7.880m' },
    ],
    obstacles: [
      { id: 'steam1', name: 'Semburan Uap Panas', icon: '💨', depth: 5250, xPercent: 65, width: 50 },
      { id: 'rock3', name: 'Runtuhan Batu Basalt', icon: '🪨', depth: 5850, xPercent: 40, width: 55 },
      { id: 'methane', name: 'Gas Metana Beracun', icon: '🫧', depth: 6450, xPercent: 20, width: 50 },
      { id: 'steam2', name: 'Semburan Uap Panas', icon: '💨', depth: 7050, xPercent: 80, width: 50 },
      { id: 'chasm', name: 'Jurang Sempit Abisal', icon: '🪨', depth: 7620, xPercent: 35, width: 55 },
    ],
    bubbles: [
      { id: 'b4_1', depth: 4780, xPercent: 40 },
      { id: 'b4_2', depth: 5380, xPercent: 75 },
      { id: 'b4_3', depth: 6020, xPercent: 25 },
      { id: 'b4_4', depth: 6580, xPercent: 60 },
      { id: 'b4_5', depth: 7180, xPercent: 30 },
      { id: 'b4_6', depth: 7720, xPercent: 80 },
    ],
    tip: 'Ambil gelembung oksigen 🫧 sesering mungkin untuk memperpanjang daya tahan kapal selam!',
  },
  {
    stage: 5,
    title: 'Ekspedisi 5: Palung Hadal Mariana (8.000 - 11.500m)',
    subtitle: 'Grand Finale: Titik terdalam bumi! Abadikan seluruh legenda dan ambil Mutiara Abadi!',
    depthMin: 8000,
    depthMax: 11500,
    duration: 65,
    bgClass: 'from-zinc-950 via-purple-950 to-black',
    lightIntensity: 0.25,
    targets: [
      { id: 'snailfish', name: 'Mariana Snailfish', icon: '🐟', depth: 8500, xPercent: 35, hint: 'Ikan transparan terdalam di 8.500m' },
      { id: 'amphipod', name: 'Amfipoda Bercahaya', icon: '🦐', depth: 9100, xPercent: 75, hint: 'Krustasea hadal di kedalaman 9.100m' },
      { id: 'sea_cucumber', name: 'Teripang Kaca Hadal', icon: '🪱', depth: 9700, xPercent: 25, hint: 'Melata di palung 9.700m' },
      { id: 'crystal_core', name: 'Kristal Palung Mariana', icon: '💎', depth: 10300, xPercent: 65, hint: 'Kristal bercahaya di tebing 10.300m' },
      { id: 'ancient_leviathan', name: 'Leviathan Samudra Ramah', icon: '🐉', depth: 10900, xPercent: 40, hint: 'Naga laut purba berenang di 10.900m' },
      { id: 'eternal_pearl', name: 'Mutiara Abadi Inti Samudra', icon: '🔮', depth: 11400, xPercent: 50, hint: 'Puncak misteri palung 11.400m!' },
    ],
    obstacles: [
      { id: 'vortex1', name: 'Pusaran Palung Dalam', icon: '🌀', depth: 8800, xPercent: 50, width: 55 },
      { id: 'spire1', name: 'Pilar Kristal Menjulang', icon: '🪨', depth: 9400, xPercent: 30, width: 60 },
      { id: 'vortex2', name: 'Pusaran Palung Dalam', icon: '🌀', depth: 10000, xPercent: 70, width: 55 },
      { id: 'tectonic', name: 'Semburan Tektonik', icon: '💨', depth: 10600, xPercent: 20, width: 50 },
      { id: 'spire2', name: 'Tebing Palung Challenger', icon: '🪨', depth: 11150, xPercent: 75, width: 60 },
    ],
    bubbles: [
      { id: 'b5_1', depth: 8300, xPercent: 25 },
      { id: 'b5_2', depth: 8950, xPercent: 80 },
      { id: 'b5_3', depth: 9550, xPercent: 35 },
      { id: 'b5_4', depth: 10150, xPercent: 70 },
      { id: 'b5_5', depth: 10750, xPercent: 30 },
      { id: 'b5_6', depth: 11250, xPercent: 75 },
    ],
    tip: 'Bidikan kamera akan memotret Mutiara Abadi di dasar palung 11.400m untuk menamatkan ekspedisi!',
  },
];

export default function DeepSeaDiverGame() {
  // ─── STATE PERMAINAN ───────────────────────────────────────────────
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'paused' | 'stage_clear' | 'gameover' | 'timeout'
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fisika Kapal Selam & Scroll
  const [subX, setSubX] = useState(50); // persen horizontal (0 - 100)
  const [subTilt, setSubTilt] = useState(0); // derajat kemiringan (-18 s.d 18)
  const [subFacing, setSubFacing] = useState(1); // 1: hadap kanan, -1: hadap kiri
  const [currentDepth, setCurrentDepth] = useState(0); // meter
  const [targetDepth, setTargetDepth] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  // Misi & Dokumentasi Foto
  const [photographedIds, setPhotographedIds] = useState([]);
  const [collectedBubbleIds, setCollectedBubbleIds] = useState([]);
  const [photoFlash, setPhotoFlash] = useState(false);
  const [hitWarning, setHitWarning] = useState(null);
  const [recentPhotoToast, setRecentPhotoToast] = useState(null);

  // Timer & Oksigen
  const [timeLeft, setTimeLeft] = useState(45);
  const [totalPhotosTaken, setTotalPhotosTaken] = useState(0);
  const [totalMetersDived, setTotalMetersDived] = useState(0);

  // Ref elemen DOM & Fisika Halus 60fps
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const targetXRef = useRef(50);
  const currentXRef = useRef(50);
  const currentTiltRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const depthLerpRef = useRef(0);
  const lockTimerRef = useRef(0);
  const lastTargetIdRef = useRef(null);

  const currentConfig = EXPEDITIONS_CONFIG[currentStageIdx];
  const depthRange = currentConfig.depthMax - currentConfig.depthMin;
  
  // ─── TOLERANSI PRESISE JEPRET FOTO: WAJIB SEJAJAR & TIDAK TERLALU JAUH ───
  // Dalam skala virtual 800%: depthRange * 0.0105 setara dengan ~8.4% tinggi layar (sejajar dengan posisi kapal selam)
  const photoDepthTolerance = Math.max(depthRange * 0.0105, 5);
  // Jarak horizontal maksimal 12% lebar kanvas (dekat di depan/samping kapal selam)
  const photoXTolerance = 12;

  // Toleransi interaksi fisik (gelembung oksigen & rintangan batu/karang)
  const bubbleDepthTolerance = Math.max(depthRange * 0.015, 8);
  const obstacleDepthTolerance = Math.max(depthRange * 0.014, 7);

  // Target foto yang sedang terkunci dalam jangkauan kamera sonar (wajib SEJAJAR & DEKAT)
  const activePhotoLockTarget =
    gameState === 'playing'
      ? currentConfig.targets.find((tgt) => {
          if (photographedIds.includes(tgt.id)) return false;
          const dDiff = Math.abs(currentDepth - tgt.depth);
          const xDiff = Math.abs(subX - tgt.xPercent);
          return dDiff <= photoDepthTolerance && xDiff <= photoXTolerance;
        }) || null
      : null;

  // ─── INIT AUDIO & STATE SAAT TAHAP BARU ─────────────────────────────
  const setupStage = useCallback((stageIndex) => {
    const config = EXPEDITIONS_CONFIG[stageIndex];
    setCurrentStageIdx(stageIndex);
    setCurrentDepth(config.depthMin);
    setTargetDepth(config.depthMin);
    depthLerpRef.current = config.depthMin;
    targetXRef.current = 50;
    currentXRef.current = 50;
    currentTiltRef.current = 0;
    scrollVelocityRef.current = 0;
    lockTimerRef.current = 0;
    lastTargetIdRef.current = null;
    setTimeLeft(config.duration);
    setPhotographedIds([]);
    setCollectedBubbleIds([]);
    setHitWarning(null);
    setRecentPhotoToast(null);
    setSubX(50);
    setSubTilt(0);
    setSubFacing(1);
  }, []);

  // ─── MULAI PERMAINAN BARU ──────────────────────────────────────────
  const startGame = () => {
    deepSeaAudio.init();
    deepSeaAudio.playSonarPing();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalPhotosTaken(0);
    setTotalMetersDived(0);
    setupStage(0);
    setGameState('playing');
  };

  // ─── RESTART STAGE SAAT INI (JIKA OKSIGEN HABIS) ────────────────────
  const retryStage = () => {
    deepSeaAudio.init();
    deepSeaAudio.playSonarPing();
    setupStage(currentStageIdx);
    setGameState('playing');
  };

  // ─── LANJUT KE EKSPEDISI BERIKUTNYA ────────────────────────────────
  const nextStage = () => {
    const nextIdx = currentStageIdx + 1;
    if (nextIdx < EXPEDITIONS_CONFIG.length) {
      deepSeaAudio.init();
      deepSeaAudio.playSonarPing();
      setupStage(nextIdx);
      setGameState('playing');
    } else {
      setGameState('gameover');
      deepSeaAudio.playGrandVictory();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };

  // ─── TIMEOUT HANDLER (OKSIGEN HABIS) ────────────────────────────────
  const handleTimeout = useCallback(() => {
    setGameState('timeout');
    deepSeaAudio.playWarningBeep();
  }, []);

  // ─── TIMER OKSIGEN BERJALAN ────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        if (prev <= 8) {
          deepSeaAudio.playWarningBeep();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, handleTimeout]);

  // ─── SMOOTH PHYSICS ENGINE (60FPS ANIMATION TICK) ───────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    let isRunning = true;
    const updatePhysics = () => {
      if (!isRunning) return;

      // 1. Lerp Horizontal Submarine (Gliding water physics)
      const xDiff = targetXRef.current - currentXRef.current;
      if (Math.abs(xDiff) > 0.04) {
        currentXRef.current += xDiff * 0.15;
        setSubX(Math.round(currentXRef.current * 100) / 100);
      }
      if (xDiff > 0.4) {
        setSubFacing(1);
      } else if (xDiff < -0.4) {
        setSubFacing(-1);
      }

      // 2. Lerp Kedalaman Vertikal (Submarine Diving)
      const dDiff = targetDepth - depthLerpRef.current;
      if (Math.abs(dDiff) > 0.4) {
        depthLerpRef.current += dDiff * 0.14;
        setCurrentDepth(Math.round(depthLerpRef.current));
      }

      // 3. Kemiringan Dinamis (Banking saat belok kiri/kanan + menukik/naik)
      const horizontalSpeed = xDiff;
      const targetBanking = Math.max(
        Math.min(horizontalSpeed * 2.2 + scrollVelocityRef.current * 0.6, 18),
        -18
      );
      currentTiltRef.current += (targetBanking - currentTiltRef.current) * 0.16;
      setSubTilt(Math.round(currentTiltRef.current * 10) / 10);

      // 4. Reduksi velocity putaran scroll
      scrollVelocityRef.current *= 0.91;
      setScrollVelocity(Math.round(scrollVelocityRef.current * 10) / 10);

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, targetDepth]);

  // ─── EVENT LISTENER SCROLL WHEEL (NON-PASSIVE & PREVENT DEFAULT) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // Wajib e.preventDefault() agar layar website tidak ikut bergulir
      e.preventDefault();

      if (gameState !== 'playing') return;
      deepSeaAudio.init();

      const delta = e.deltaY;
      const span = currentConfig.depthMax - currentConfig.depthMin;
      // Langkah kedalaman berbobot proporsional agar sensasi menyelam terasa nyata & tidak instan
      const step = Math.max(3, Math.round(span * 0.0042));

      if (delta > 0) {
        // 🔻 SCROLL KE BAWAH: Menyelam lebih dalam
        deepSeaAudio.playDivingBubbles();
        scrollVelocityRef.current = Math.min(scrollVelocityRef.current + 2.5, 16);
        setTargetDepth((prev) => {
          const next = Math.min(prev + step, currentConfig.depthMax);
          setTotalMetersDived((td) => td + Math.max(0, next - prev));
          return next;
        });
      } else if (delta < 0) {
        // 🔺 SCROLL KE ATAS: Naik kembali ke permukaan
        deepSeaAudio.playPropellerAscent();
        scrollVelocityRef.current = Math.max(scrollVelocityRef.current - 2.5, -16);
        setTargetDepth((prev) => Math.max(prev - step, currentConfig.depthMin));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [gameState, currentConfig]);

  // ─── POINTER / MOUSE HORIZONTAL NAVIGATION ─────────────────────────
  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percentX = Math.min(Math.max((relativeX / rect.width) * 100, 8), 92);
    targetXRef.current = percentX;
  };

  // ─── CEK INTERAKSI RINTANGAN & GELEMBUNG OKSIGEN ───────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    // 1. Cek Gelembung Oksigen 🫧
    currentConfig.bubbles.forEach((bub) => {
      if (collectedBubbleIds.includes(bub.id)) return;

      const dDiff = Math.abs(currentDepth - bub.depth);
      const xDiff = Math.abs(subX - bub.xPercent);

      if (dDiff <= bubbleDepthTolerance && xDiff <= 14) {
        setCollectedBubbleIds((prev) => [...prev, bub.id]);
        setTimeLeft((prev) => Math.min(prev + 8, currentConfig.duration + 10));
        setScore((prev) => prev + 80);
        deepSeaAudio.playOxygenPickup();
      }
    });

    // 2. Cek Rintangan Berbahaya 🪨⚡
    currentConfig.obstacles.forEach((obs) => {
      const dDiff = Math.abs(currentDepth - obs.depth);
      const xDiff = Math.abs(subX - obs.xPercent);

      if (dDiff <= obstacleDepthTolerance && xDiff <= 12) {
        if (!hitWarning) {
          deepSeaAudio.playObstacleHit();
          setCombo(0);
          setHitWarning(`⚠️ Menabrak ${obs.name}! Baterai berkurang.`);
          setTimeLeft((prev) => Math.max(prev - 4, 1));
          setTimeout(() => setHitWarning(null), 1400);
        }
      }
    });
  }, [currentDepth, subX, gameState, currentConfig, bubbleDepthTolerance, obstacleDepthTolerance, collectedBubbleIds, hitWarning]);

  // ─── AMBIL FOTO BIOTA SAAT DALAM TARGET LOCK ───────────────────────
  const takePhotoOfTarget = useCallback((targetToSnap) => {
    const target = targetToSnap || activePhotoLockTarget;
    if (!target || gameState !== 'playing') return;
    if (photographedIds.includes(target.id)) return;

    deepSeaAudio.playPhotoSnap();
    setPhotoFlash(true);
    setTimeout(() => setPhotoFlash(false), 200);

    const nextPhotographed = [...photographedIds, target.id];
    setPhotographedIds(nextPhotographed);
    setTotalPhotosTaken((prev) => prev + 1);

    // Tambah Combo & Skor
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    const photoPoints = 200 + Math.min(newCombo * 35, 150);
    setScore((prev) => prev + photoPoints);

    // Toast Notifikasi Foto
    setRecentPhotoToast({
      name: target.name,
      icon: target.icon,
      points: photoPoints,
    });
    setTimeout(() => setRecentPhotoToast(null), 1800);

    // Mini confetti
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.4 },
    });

    // Cek kelulusan babak: jika semua target foto terkumpul
    if (nextPhotographed.length >= currentConfig.targets.length) {
      setTimeout(() => {
        if (currentStageIdx + 1 < EXPEDITIONS_CONFIG.length) {
          setGameState('stage_clear');
          deepSeaAudio.playZoneClear();
        } else {
          setGameState('gameover');
          deepSeaAudio.playGrandVictory();
          confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
        }
      }, 700);
    }
  }, [activePhotoLockTarget, gameState, photographedIds, combo, maxCombo, currentConfig, currentStageIdx]);

  // ─── AUTO-SNAP STABILIZE TIMER (TAHAN 1.2S UNTUK AUTO-JEPRET) ──────
  useEffect(() => {
    if (gameState !== 'playing' || !activePhotoLockTarget) {
      return;
    }

    deepSeaAudio.playSonarPing();

    const timer = setTimeout(() => {
      takePhotoOfTarget(activePhotoLockTarget);
    }, 1200);

    return () => clearTimeout(timer);
  }, [gameState, activePhotoLockTarget, takePhotoOfTarget]);

  // ─── KEYBOARD SHORTCUT (SPACE / ENTER UNTUK JEPRET) ────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (activePhotoLockTarget) {
          takePhotoOfTarget(activePhotoLockTarget);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activePhotoLockTarget, takePhotoOfTarget]);

  // ─── FULLSCREEN TOGGLE ─────────────────────────────────────────────
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
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // ─── TOGGLE MUTE ───────────────────────────────────────────────────
  const toggleSound = () => {
    const muted = deepSeaAudio.toggleMute();
    setIsMuted(muted);
  };

  // Kedalaman persentase dalam zona saat ini (0% s.d 100%)
  const depthPercentInZone = Math.min(
    Math.max(((currentDepth - currentConfig.depthMin) / (depthRange || 1)) * 100, 0),
    100
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`relative isolate w-full max-w-4xl mx-auto rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden select-none bg-slate-900 text-white font-sans ${
        isFullscreen ? 'fixed inset-0 z-[90] rounded-none max-w-none h-screen' : 'aspect-[4/3] min-h-[580px] max-h-[720px]'
      }`}
    >
      {/* ── LATAR BELAKANG KEDALAMAN SAMUDRA BERGRADASI DINAMIS ───── */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentConfig.bgClass} transition-colors duration-1000`}
      >
        {/* Lapisan Garis Kedalaman Kontur */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none p-4 font-mono text-xs">
          <div>— Permukaan Air (0m) —</div>
          <div>— Batas Atas Ekspedisi ({currentConfig.depthMin}m) —</div>
          <div>— Palung Bawah ({currentConfig.depthMax}m) —</div>
        </div>
      </div>

      {/* ── FLASH EFEK KAMERA JEPPRET ──────────────────────────────── */}
      {photoFlash && (
        <div className="absolute inset-0 bg-white/80 z-40 pointer-events-none animate-in fade-in duration-75"></div>
      )}

      {/* ── TOAST NOTIFIKASI FOTO BERHASIL ───────────────────────── */}
      {recentPhotoToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] px-4 py-2 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 fade-in duration-200 text-black pointer-events-none">
          <span className="text-3xl">{recentPhotoToast.icon}</span>
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-600 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Foto Berhasil Diabadikan!</span>
            </div>
            <div className="font-heading font-black text-xs sm:text-sm">
              {recentPhotoToast.name} (+{recentPhotoToast.points} Poin)
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFIKASI PERINGATAN TABRAKAN ────────────────────────── */}
      {hitWarning && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-rose-500 border-2 border-black shadow-[3px_3px_0px_0px_#000] px-4 py-1.5 rounded-xl font-mono text-xs font-black text-white flex items-center gap-2 animate-bounce pointer-events-none">
          <ShieldAlert className="w-4 h-4" />
          <span>{hitWarning}</span>
        </div>
      )}

      {/* ── TOP HUD NAVIGATION BAR ─────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 bg-black/70 backdrop-blur-md border-b-2 border-black">
        {/* Tombol Back & Title */}
        <div className="flex items-center gap-2">
          <Link
            href="/siswa/game-mouse"
            className="p-1.5 bg-white text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-amber-300 transition-all cursor-pointer"
            title="Pilih Game Lain"
          >
            <Compass className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg">🌊</span>
              <h1 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wide text-cyan-300">
                Penyelam Laut Dalam
              </h1>
              <span className="hidden md:inline bg-blue-400 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-black">
                Scroll Wheel
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-300 line-clamp-1">
              {currentConfig.title}
            </p>
          </div>
        </div>

        {/* Depth, Oxygen, Photo, Score Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Depth Gauge */}
          <div className="bg-cyan-950/80 border-2 border-cyan-400/80 px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <div>
              <div className="text-[9px] font-mono text-cyan-200 uppercase leading-none">Kedalaman</div>
              <div className="text-xs sm:text-sm font-mono font-black text-cyan-300 leading-tight">
                {currentDepth.toLocaleString()} m
              </div>
            </div>
          </div>

          {/* Oksigen / Waktu */}
          <div
            className={`border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-colors ${
              timeLeft <= 8 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-400 text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono font-black text-xs sm:text-sm">
              {timeLeft}s
            </span>
          </div>

          {/* Foto Biota Target Terkumpul */}
          <div
            className="bg-cyan-400 text-black border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] font-mono font-black text-xs sm:text-sm flex items-center gap-1"
            title="Biota Terfoto dalam Zona Ini"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>
              {photographedIds.length}/{currentConfig.targets.length}
            </span>
          </div>

          {/* Skor */}
          <div className="bg-emerald-400 text-black border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] font-mono font-black text-xs sm:text-sm hidden sm:flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" />
            <span>{score}</span>
          </div>

          {/* Audio & Control Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className="p-1.5 bg-white text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-slate-200 transition-all cursor-pointer"
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {gameState === 'playing' && (
              <button
                onClick={() => setGameState('paused')}
                className="p-1.5 bg-amber-300 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-amber-400 transition-all cursor-pointer"
                title="Jeda"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-white text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-slate-200 transition-all cursor-pointer"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── METERAN VERTIKAL KEDALAMAN (DEPTH METER SLIDER) ───────── */}
      <aside
        aria-label="Meteran Kedalaman"
        className="absolute left-3 top-20 bottom-16 z-20 w-8 sm:w-10 bg-black/60 border-2 border-cyan-400/80 rounded-2xl p-1 flex flex-col justify-between items-center shadow-[3px_3px_0px_0px_#000] backdrop-blur-sm pointer-events-none"
      >
        <span className="text-[9px] font-mono font-bold text-cyan-300">
          {currentConfig.depthMin}m
        </span>

        {/* Track Vertikal & Jarum Posisi */}
        <div className="relative w-2 flex-1 bg-white/20 rounded-full my-1 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 bg-cyan-400 rounded-full transition-all duration-150"
            style={{ height: `${depthPercentInZone}%` }}
          ></div>
        </div>

        {/* Jarum Indikator Submarine */}
        <div
          className="absolute -right-3 w-4 h-4 bg-amber-400 border border-black rounded-full flex items-center justify-center text-[8px] text-black font-black shadow-[1px_1px_0px_0px_#000] transition-all duration-150"
          style={{ top: `${Math.min(Math.max(depthPercentInZone, 5), 90)}%` }}
        >
          ▼
        </div>

        <span className="text-[9px] font-mono font-bold text-cyan-300">
          {currentConfig.depthMax}m
        </span>
      </aside>

      {/* ── AREA ARENA BAWAH LAUT ──────────────────────────────────── */}
      <main
        onClick={() => {
          if (gameState === 'playing' && activePhotoLockTarget) {
            takePhotoOfTarget(activePhotoLockTarget);
          }
        }}
        className="relative w-full h-full overflow-hidden cursor-crosshair"
      >
        {/* ── ELEMEN AIR & BIOTA DI KEDALAMAN ──────────────────────── */}
        {/* Render Biota Laut Sasaran */}
        {currentConfig.targets.map((tgt) => {
          const isDone = photographedIds.includes(tgt.id);
          const isLocked = activePhotoLockTarget?.id === tgt.id;
          const depthDiff = tgt.depth - currentDepth;
          // Skala virtual samudra 800% untuk sensasi menyelam yang dalam & bertahap
          const visibleY = 50 + (depthDiff / (depthRange || 1)) * 800;
          const isNearby = Math.abs(depthDiff) <= photoDepthTolerance * 2.8 && Math.abs(subX - tgt.xPercent) <= 22;

          // Optimasi render: sembunyikan objek yang jauh di luar layar
          if (visibleY < -35 || visibleY > 135) return null;

          return (
            <div
              key={tgt.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDone && isLocked) {
                  takePhotoOfTarget(tgt);
                }
              }}
              className={`absolute transition-transform duration-200 flex flex-col items-center ${
                isDone
                  ? 'opacity-40 filter grayscale pointer-events-none'
                  : isLocked
                  ? 'opacity-100 pointer-events-auto cursor-pointer scale-125 z-30'
                  : isNearby
                  ? 'opacity-100 pointer-events-none scale-110'
                  : 'opacity-95 pointer-events-none'
              }`}
              style={{
                left: `${tgt.xPercent}%`,
                top: `${visibleY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Balon Ikon Hewan Laut */}
              <div
                className={`relative text-4xl sm:text-5xl transition-transform ${
                  isLocked ? 'animate-bounce drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''
                }`}
              >
                {tgt.icon}
                {isDone && (
                  <span className="absolute -top-1 -right-1 bg-emerald-400 text-black border border-black rounded-full p-0.5 text-[9px] font-black">
                    ✓
                  </span>
                )}
              </div>

              {/* Label Nama & Kedalaman */}
              <div
                className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold whitespace-nowrap shadow-[1px_1px_0px_0px_#000] border ${
                  isLocked
                    ? 'bg-amber-400 text-black border-black font-black animate-pulse'
                    : isNearby
                    ? 'bg-sky-900/90 text-amber-300 border-amber-300/70'
                    : 'bg-black/80 text-cyan-200 border-cyan-400'
                }`}
              >
                {tgt.name} ({tgt.depth}m)
              </div>
            </div>
          );
        })}

        {/* Render Rintangan (Ubur-Ubur / Karang / Ranjau) */}
        {currentConfig.obstacles.map((obs) => {
          const depthDiff = obs.depth - currentDepth;
          const visibleY = 50 + (depthDiff / (depthRange || 1)) * 800;

          if (visibleY < -35 || visibleY > 135) return null;

          return (
            <div
              key={obs.id}
              className="absolute flex flex-col items-center pointer-events-none transition-transform duration-150 animate-bounce duration-1000"
              style={{
                left: `${obs.xPercent}%`,
                top: `${visibleY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="text-3xl sm:text-4xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
                {obs.icon}
              </div>
              <div className="text-[9px] font-mono font-bold text-rose-300 bg-black/70 px-1.5 py-0.2 rounded border border-rose-500 mt-0.5">
                {obs.name}
              </div>
            </div>
          );
        })}

        {/* Render Gelembung Oksigen 🫧 */}
        {currentConfig.bubbles.map((bub) => {
          if (collectedBubbleIds.includes(bub.id)) return null;
          const depthDiff = bub.depth - currentDepth;
          const visibleY = 50 + (depthDiff / (depthRange || 1)) * 800;

          if (visibleY < -35 || visibleY > 135) return null;

          return (
            <div
              key={bub.id}
              className="absolute pointer-events-none animate-pulse flex flex-col items-center"
              style={{
                left: `${bub.xPercent}%`,
                top: `${visibleY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
                🫧
              </span>
              <span className="text-[8px] font-mono font-black text-cyan-200 bg-sky-950/80 px-1 rounded border border-cyan-400">
                +Oksigen
              </span>
            </div>
          );
        })}

        {/* ── KAPAL SELAM KUNING PEMAIN (YELLOW SUBMARINE) ─────────── */}
        <div
          className="absolute z-30 pointer-events-none flex items-center justify-center will-change-transform transition-transform"
          style={{
            left: `${subX}%`,
            top: '50%',
            transform: `translate(-50%, -50%) scaleX(${subFacing}) rotate(${subTilt * subFacing}deg)`,
          }}
        >
          {/* Lampu Sorot Bawah Laut (Headlight Cone) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '180px',
              height: '110px',
              background:
                'radial-gradient(ellipse at left, rgba(254,240,138,0.45) 0%, rgba(254,240,138,0.15) 50%, transparent 80%)',
              clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
              transformOrigin: 'left center',
            }}
          ></div>

          {/* Submarine Body (Desain Neo-Brutalist Kartun) */}
          <div className="relative bg-amber-400 border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-full px-4 py-2 flex items-center gap-1.5">
            {/* Periskop di Atas */}
            <div className="absolute -top-3.5 left-5 w-2 h-4 bg-amber-500 border-2 border-black rounded-t"></div>
            <div className="absolute -top-4 left-5 w-3.5 h-1.5 bg-cyan-300 border border-black rounded-r"></div>

            {/* Jendela Kabin Pengamat */}
            <div className="w-5 h-5 rounded-full bg-cyan-200 border-2 border-black flex items-center justify-center shadow-inner">
              <span className="text-[10px]" style={{ transform: `scaleX(${subFacing})` }}>👀</span>
            </div>

            {/* Lambung & Lampu Depan */}
            <div
              className="text-xs font-mono font-black text-black uppercase"
              style={{ transform: `scaleX(${subFacing})` }}
            >
              SUB-05
            </div>

            {/* Baling-baling di Belakang */}
            <div
              className={`absolute -left-2.5 top-1/2 -translate-y-1/2 w-3 h-5 bg-orange-500 border border-black rounded-sm ${
                Math.abs(scrollVelocity) > 0.8 ? 'animate-spin' : ''
              }`}
            ></div>
          </div>

          {/* Gelembung Dorongan Baling-Baling */}
          {Math.abs(scrollVelocity) > 1.5 && (
            <span className="absolute -left-7 text-xs opacity-75 animate-ping">
              🫧
            </span>
          )}
        </div>

        {/* ── RETIKEL BIDIK KAMERA FOTO SAAT TARGET DEKAT ──────────── */}
        {activePhotoLockTarget && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              takePhotoOfTarget(activePhotoLockTarget);
            }}
            className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-1 cursor-pointer animate-in zoom-in-90 duration-150"
            style={{
              left: `${activePhotoLockTarget.xPercent}%`,
              top: `${50 + ((activePhotoLockTarget.depth - currentDepth) / (depthRange || 1)) * 800}%`,
            }}
          >
            {/* Viewfinder Circle dengan Indikator Auto-Snap */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-amber-300 bg-amber-400/20 backdrop-blur-xs flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.8)]">
              {/* Reticle Crosshairs */}
              <div className="absolute w-full h-[2px] bg-amber-300/70"></div>
              <div className="absolute h-full w-[2px] bg-amber-300/70"></div>

              <Camera className="w-8 h-8 text-amber-300 drop-shadow animate-pulse" />

              {/* Progress Ring Pengisi Auto-Snap */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  fill="transparent"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeDasharray="260"
                  strokeDashoffset="260"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="260"
                    to="0"
                    dur="1.2s"
                    fill="freeze"
                  />
                </circle>
              </svg>
            </div>

            {/* Tombol Cepat Jepret Foto */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                takePhotoOfTarget(activePhotoLockTarget);
              }}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-black border-2 border-black font-heading font-black text-xs px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 cursor-pointer uppercase transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Jepret Foto!</span>
            </button>
          </div>
        )}

        {/* ── ACTION BAR FOTO DI TENGAH BAWAH ──────────────────────── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-auto">
          {activePhotoLockTarget ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                takePhotoOfTarget(activePhotoLockTarget);
              }}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-black border-3 border-black font-heading font-black text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex items-center gap-2 cursor-pointer uppercase transition-all animate-bounce"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>📸 KLIK JEPRET FOTO ({activePhotoLockTarget.name})!</span>
              <span className="bg-black text-amber-300 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-300 hidden sm:inline">
                KLIK / SPASI
              </span>
            </button>
          ) : (
            <div className="bg-black/60 border border-cyan-400/60 backdrop-blur-sm text-cyan-200 text-[10px] sm:text-xs font-mono font-bold px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 pointer-events-none">
              <span>🎯</span>
              <span>Arahkan kapal selam &amp; scroll mendekati hewan untuk memotret</span>
            </div>
          )}
        </div>

        {/* ── RADAR PANDUAN SCROLL ARAH ────────────────────────────── */}
        <div className="absolute right-3 bottom-3 z-20 bg-black/85 border-2 border-cyan-400/80 rounded-2xl p-2.5 shadow-[4px_4px_0px_0px_#000] backdrop-blur-sm w-48 sm:w-56 pointer-events-none hidden sm:block">
          <div className="text-[10px] font-mono font-black text-cyan-300 uppercase flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Misi Foto Biota</span>
            </div>
            <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded border border-amber-400/50">
              {photographedIds.length}/{currentConfig.targets.length}
            </span>
          </div>

          <div className="mt-1.5 space-y-1 max-h-[140px] overflow-y-auto pr-0.5 pointer-events-auto">
            {currentConfig.targets.map((tgt) => {
              const isDone = photographedIds.includes(tgt.id);
              const isBelow = tgt.depth > currentDepth;

              return (
                <div
                  key={tgt.id}
                  className={`flex items-center justify-between gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                    isDone
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>{tgt.icon}</span>
                    <span className="truncate">{tgt.name}</span>
                  </div>

                  {isDone ? (
                    <span className="text-emerald-400 font-bold shrink-0">✓ FOTO</span>
                  ) : (
                    <span className="text-[9px] font-bold text-amber-300 shrink-0 flex items-center gap-0.5">
                      {isBelow ? <ArrowDown className="w-2.5 h-2.5 text-cyan-300" /> : <ArrowUp className="w-2.5 h-2.5 text-amber-300" />}
                      <span>{tgt.depth}m</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Panduan Cepat Scroll */}
          <div className="mt-1.5 pt-1 border-t border-white/20 text-[9px] font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-0.5">
              <ArrowDown className="w-2.5 h-2.5 text-cyan-300" />
              <span>Scroll: Selam</span>
            </span>
            <span className="flex items-center gap-0.5">
              <ArrowUp className="w-2.5 h-2.5 text-amber-300" />
              <span>Scroll: Naik</span>
            </span>
          </div>
        </div>
      </main>

      {/* ─── MODAL 1: IDLE WELCOME & TUTORIAL ──────────────────────── */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 sm:space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200 text-black">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-cyan-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl sm:text-3xl">
              🌊
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <div className="inline-block bg-blue-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                Game 5 • Fokus: Roda Gulir (Scroll Wheel)
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                Penyelam Laut Dalam
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                Kendalikan kapal selam riset samudra! Gunakan <strong>roda scroll mouse</strong> untuk menyelam ke palung terdalam, potret biota laut langka, dan hindari rintangan karang.
              </p>
            </div>

            {/* Kotak Petunjuk Praktis */}
            <div className="bg-sky-50 border-2 border-black rounded-xl p-3 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-sky-900">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>Kendali Kemudi Kapal Selam:</span>
              </div>
              <ul className="space-y-1 text-[10px] sm:text-[11px] text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-sm">🖱️</span>
                  <span><strong>Scroll ke Bawah:</strong> Menyelam menembus kedalaman air laut.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">⬆️</span>
                  <span><strong>Scroll ke Atas:</strong> Naik kembali menuju permukaan air laut.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">📸</span>
                  <span><strong>Jepret Foto:</strong> Dekati hewan laut lalu klik di mana saja atau tekan Spasi!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-cyan-400 hover:bg-cyan-300 active:translate-x-0.5 active:translate-y-0.5 text-black border-3 border-black font-heading font-black text-sm sm:text-base py-2.5 sm:py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer uppercase transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Mulai Menyelam Samudra</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: PAUSED SCREEN ─────────────────────────────────── */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-sm w-full text-center space-y-3.5 text-black">
            <h2 className="font-heading font-black text-xl text-black">
              Ekspedisi Dijeda
            </h2>
            <p className="text-xs text-slate-600">
              Kapal selam sedang mengapung stabil di kedalaman {currentDepth} meter.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setGameState('playing')}
                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-heading font-black text-xs py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Lanjutkan</span>
              </button>

              <button
                onClick={retryStage}
                className="bg-slate-200 hover:bg-slate-300 text-black border-2 border-black font-heading font-black text-xs px-3 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1 cursor-pointer"
                title="Mulai Ulang Zona Ini"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: TIMEOUT (OKSIGEN HABIS) ───────────────────────── */}
      {gameState === 'timeout' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-sm w-full text-center space-y-3 text-black">
            <div className="w-12 h-12 bg-rose-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl">
              🫧
            </div>

            <h2 className="font-heading font-black text-xl text-rose-600">
              Oksigen Menipis!
            </h2>
            <p className="text-xs text-slate-600">
              Tangki udara kapal selam habis sebelum seluruh biota difoto. Ambil gelembung oksigen 🫧 di sepanjang jalan untuk menambah waktu!
            </p>

            <button
              onClick={retryStage}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Menyelam Lagi</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: STAGE CLEAR (ZONA SELESAI) ────────────────────── */}
      {gameState === 'stage_clear' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-md w-full text-center space-y-3.5 text-black">
            <div className="w-12 h-12 bg-emerald-400 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl">
              📸
            </div>

            <div>
              <div className="inline-block bg-emerald-200 border border-black px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-1">
                Ekspedisi Berhasil!
              </div>
              <h2 className="font-heading font-black text-xl text-black">
                {currentConfig.title} Tuntas!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Semua foto biota laut langka di zona ini berhasil didokumentasikan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 border-2 border-black rounded-xl p-2.5 font-mono text-xs">
              <div className="text-left">
                <span className="text-slate-500 text-[10px]">Total Skor:</span>
                <p className="font-black text-sm text-black">{score}</p>
              </div>
              <div className="text-left">
                <span className="text-slate-500 text-[10px]">Combo Jepretan:</span>
                <p className="font-black text-sm text-emerald-600">x{combo}</p>
              </div>
            </div>

            <button
              onClick={nextStage}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <span>Lanjut ke Ekspedisi {currentStageIdx + 2}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: GRAND VICTORY (MENAKLUKKAN PALUNG MARIANA) ─────── */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 text-black my-auto">
            <div className="w-14 h-14 bg-amber-400 border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl mx-auto flex items-center justify-center text-3xl">
              🏆
            </div>

            <div className="space-y-1">
              <div className="inline-block bg-cyan-300 border-2 border-black px-2.5 py-0.5 rounded text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                Penjelajah Samudra Master!
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                Palung Mariana Tertaklukkan!
              </h2>
              <p className="text-xs sm:text-sm text-slate-700">
                Luar biasa! Kamu berhasil menguasai putaran roda scroll mouse untuk menyelam hingga 11.500 meter dan kembali dengan selamat membawa Mutiara Abadi!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-amber-50 border-2 border-black rounded-xl p-2.5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Skor Akhir</span>
                <p className="font-black text-sm text-black">{score}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Foto Biota</span>
                <p className="font-black text-sm text-cyan-600">{totalPhotosTaken} Spesies</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Max Combo</span>
                <p className="font-black text-sm text-amber-600">x{maxCombo}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Ulang</span>
              </button>

              <Link
                href="/siswa/game-mouse"
                className="flex-1 bg-white hover:bg-amber-100 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <span>Pilih Game Lain</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
