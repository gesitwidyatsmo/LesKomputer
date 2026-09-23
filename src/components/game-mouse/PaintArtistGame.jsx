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
  Sparkles,
  ChevronRight,
  Star,
  Info,
  Palette,
  PaintBucket,
  Brush,
  Pencil,
  SprayCan,
  Eraser,
  Undo2,
  Trash2,
  Download,
  Compass,
  Trophy,
  CheckCircle2,
  Award
} from 'lucide-react';
import { paintAudio } from '@/lib/paintAudio';
import { STAGE1_NUSANTARA } from './stage1Nusantara';
import { STAGE2_BAWAH_LAUT } from './stage2BawahLaut';
import { STAGE3_ISTANA } from './stage3Istana';
import { STAGE4_ASTRONOT } from './stage4Astronot';
import { STAGE5_SAFARI } from './stage5Safari';

// ─── 16 PALET WARNA NEO-BRUTALIST CERAH ────────────────────────────
const PAINT_PALETTE = [
  { id: 'red', name: 'Merah Api', hex: '#EF4444' },
  { id: 'orange', name: 'Oranye Jeruk', hex: '#F97316' },
  { id: 'yellow', name: 'Kuning Mentari', hex: '#FACC15' },
  { id: 'lime', name: 'Hijau Daun', hex: '#22C55E' },
  { id: 'emerald', name: 'Hijau Zamrud', hex: '#10B981' },
  { id: 'cyan', name: 'Cyan Samudra', hex: '#06B6D4' },
  { id: 'blue', name: 'Biru Langit', hex: '#3B82F6' },
  { id: 'navy', name: 'Biru Malam', hex: '#1E3A8A' },
  { id: 'purple', name: 'Ungu Bunga', hex: '#8B5CF6' },
  { id: 'pink', name: 'Pink Permen', hex: '#EC4899' },
  { id: 'brown', name: 'Cokelat Kayu', hex: '#92400E' },
  { id: 'sand', name: 'Krem Pasir', hex: '#FDE68A' },
  { id: 'white', name: 'Putih Salju', hex: '#FFFFFF' },
  { id: 'gray', name: 'Abu-Abu Batu', hex: '#64748B' },
  { id: 'black', name: 'Hitam Arang', hex: '#0F172A' },
  { id: 'gold', name: 'Emas Tropis', hex: '#F59E0B' },
];

const BRUSH_SIZES = [
  { id: 'small', label: 'Halus', size: 4, dot: 'w-2 h-2' },
  { id: 'medium', label: 'Sedang', size: 9, dot: 'w-3 h-3' },
  { id: 'large', label: 'Tebal', size: 18, dot: 'w-4 h-4' },
  { id: 'xlarge', label: 'Raksasa', size: 28, dot: 'w-6 h-6' },
];

// ─── 5 TEMPLATE KANVAS BUKU GAMBAR BERKUALITAS TINGGI (~4.75 MENIT) ──
const PAINT_STAGES = [
  STAGE1_NUSANTARA,
  STAGE2_BAWAH_LAUT,
  STAGE3_ISTANA,
  STAGE4_ASTRONOT,
  STAGE5_SAFARI,
];

export default function PaintArtistGame() {
  // ─── STATE UTAMA GAME ──────────────────────────────────────────────
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'paused' | 'stage_clear' | 'gameover' | 'timeout'
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50);

  // ─── ALAT LUKIS & PALET ────────────────────────────────────────────
  const [activeTool, setActiveTool] = useState('fill'); // 'fill' | 'brush' | 'pencil' | 'spray' | 'eraser'
  const [activeColor, setActiveColor] = useState('#FACC15'); // Kuning ceria default
  const [brushSize, setBrushSize] = useState(9); // 4 | 9 | 18 | 28
  const [hoveredRegionId, setHoveredRegionId] = useState(null);

  // ─── DATA MEWARNAI & GORESAN PER KANVAS ────────────────────────────
  // Map ID bidang -> warna hex yang dipilih siswa
  const [filledAreas, setFilledAreas] = useState({});
  const [strokeCount, setStrokeCount] = useState(0);
  const [completedGalleries, setCompletedGalleries] = useState([]); // galeri gambar yang disimpan

  // Ref Kanvas Gambar Bebas
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const undoStackRef = useRef([]); // ImageData snapshot stack untuk undo

  const currentStage = PAINT_STAGES[currentStageIdx];
  const filledCount = Object.keys(filledAreas).length;
  const totalAreas = currentStage.regions.length;
  const isTargetAchieved =
    filledCount >= currentStage.minFillTarget && strokeCount >= currentStage.minStrokeTarget;
  const hoveredRegion = hoveredRegionId
    ? currentStage.regions.find((r) => r.id === hoveredRegionId)
    : null;

  // ─── TOGGLE SOUND & FULLSCREEN ─────────────────────────────────────
  const toggleSound = () => {
    const muted = paintAudio.toggleMute();
    setIsMuted(muted);
  };

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

  // ─── INIT STAGE SETUP ──────────────────────────────────────────────
  const setupStage = useCallback((stageIndex) => {
    const stage = PAINT_STAGES[stageIndex];
    setCurrentStageIdx(stageIndex);
    setTimeLeft(stage.duration);
    setFilledAreas({});
    setStrokeCount(0);
    setActiveTool('fill');
    setHoveredRegionId(null);

    // Bersihkan canvas goresan bebas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      undoStackRef.current = [];
    }
  }, []);

  // ─── MULAI PERMAINAN BARU ──────────────────────────────────────────
  const startGame = () => {
    paintAudio.init();
    paintAudio.playToolSwitch();
    setScore(0);
    setCompletedGalleries([]);
    setupStage(0);
    setGameState('playing');
  };

  const retryStage = () => {
    paintAudio.init();
    paintAudio.playCanvasClear();
    setupStage(currentStageIdx);
    setGameState('playing');
  };

  // ─── TIMER BERJALAN ────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // ─── RESIZE CANVAS OVERLAY SESUAI SVG VIEWPORT ──────────────────────
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetW = currentStage?.canvasWidth || 800;
    const targetH = currentStage?.canvasHeight || 500;
    canvas.width = targetW;
    canvas.height = targetH;
  }, [currentStage]);

  useEffect(() => {
    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);
    return () => window.removeEventListener('resize', syncCanvasSize);
  }, [syncCanvasSize, currentStageIdx]);

  // ─── AKSI KLIK EMBER TUMPAH (FILL COLOR REGION) ────────────────────
  const handleRegionClick = (regionId) => {
    if (gameState !== 'playing') return;
    if (activeTool !== 'fill') return;

    paintAudio.init();
    paintAudio.playBucketFill();

    const isFirstTime = !filledAreas[regionId];
    setFilledAreas((prev) => ({
      ...prev,
      [regionId]: activeColor,
    }));

    if (isFirstTime) {
      setScore((s) => s + 50);
    }
  };

  // ─── GORESAN KUAS BEBAS (CANVAS DRAWING ENGINE) ────────────────────
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (undoStackRef.current.length > 15) {
      undoStackRef.current.shift();
    }
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const handlePointerDown = (e) => {
    if (gameState !== 'playing') return;
    if (activeTool === 'fill') return;

    paintAudio.init();
    saveCanvasState();
    isDrawingRef.current = true;
    const pt = getCanvasCoordinates(e);
    lastPointRef.current = pt;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (activeTool === 'spray') {
      paintAudio.playSpraySound();
      drawSpray(ctx, pt.x, pt.y);
    } else {
      paintAudio.playBrushStroke();
      drawPoint(ctx, pt.x, pt.y);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pt = getCanvasCoordinates(e);

    if (activeTool === 'spray') {
      paintAudio.playSpraySound();
      drawSpray(ctx, pt.x, pt.y);
    } else {
      drawLine(ctx, lastPointRef.current, pt);
      paintAudio.playBrushStroke();
    }
    lastPointRef.current = pt;
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    setStrokeCount((c) => c + 1);
    setScore((s) => s + 25);
  };

  const drawPoint = (ctx, x, y) => {
    ctx.save();
    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = activeColor;
      ctx.beginPath();
      const currentSize = activeTool === 'pencil' ? 3 : brushSize;
      ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawLine = (ctx, p1, p2) => {
    if (!p1 || !p2) return;
    ctx.save();
    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = activeTool === 'pencil' ? 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawSpray = (ctx, cx, cy) => {
    ctx.save();
    ctx.fillStyle = activeColor;
    const radius = brushSize * 1.8;
    const density = Math.round(brushSize * 1.4);
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // ─── UNDO & CLEAR GORESAN ──────────────────────────────────────────
  const handleUndo = () => {
    if (undoStackRef.current.length === 0) return;
    paintAudio.playCanvasClear();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prevState = undoStackRef.current.pop();
    ctx.putImageData(prevState, 0, 0);
    setStrokeCount((c) => Math.max(0, c - 1));
  };

  const handleClearStrokes = () => {
    paintAudio.playCanvasClear();
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveCanvasState();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // ─── SELESAIKAN KANVAS & PAJANG KE GALERI ──────────────────────────
  const handleCompleteStage = () => {
    paintAudio.init();
    paintAudio.playStageClear();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Simpan metadata karya untuk galeri akhir
    setCompletedGalleries((prev) => [
      ...prev,
      {
        stageIdx: currentStageIdx,
        title: currentStage.title,
        filled: filledCount,
        strokes: strokeCount,
      },
    ]);

    setGameState('stage_clear');
  };

  const handleNextStage = () => {
    const nextIdx = currentStageIdx + 1;
    if (nextIdx < PAINT_STAGES.length) {
      paintAudio.playToolSwitch();
      setupStage(nextIdx);
      setGameState('playing');
    } else {
      setGameState('gameover');
      paintAudio.playGalleryFanfare();
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  };

  // ─── UNDUH KARYA SENI SISWA KE PNG ─────────────────────────────────
  const handleDownloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Buat canvas komposit gabungan (SVG + Brush overlay)
    const targetW = currentStage?.canvasWidth || 800;
    const targetH = currentStage?.canvasHeight || 500;
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = targetW;
    compositeCanvas.height = targetH;
    const compCtx = compositeCanvas.getContext('2d');

    // Latar belakang putih
    compCtx.fillStyle = '#FFFFFF';
    compCtx.fillRect(0, 0, targetW, targetH);

    // Ambil SVG sebagai gambar
    const svgEl = document.getElementById('paint-svg-template');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        compCtx.drawImage(img, 0, 0);
        // Gambar goresan kuas di atasnya
        compCtx.drawImage(canvas, 0, 0);

        // Watermark studio
        compCtx.font = 'bold 14px monospace';
        compCtx.fillStyle = '#0F172A';
        compCtx.fillText('🎨 Karya Seniman Cilik · Les Komputer', 20, 480);

        const a = document.createElement('a');
        a.download = `seniman-cilik-karya-${currentStageIdx + 1}.png`;
        a.href = compositeCanvas.toDataURL('image/png');
        a.click();
        URLObj.revokeObjectURL(blobURL);
      };
      img.src = blobURL;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative isolate w-full max-w-4xl mx-auto rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden select-none bg-[#FFFDF5] text-slate-900 font-sans flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[90] rounded-none max-w-none h-screen' : 'min-h-[640px]'
      }`}
    >
      {/* ─── RETRO MS PAINT TITLE BAR HEADER ─────────────────────── */}
      <header className="relative z-20 flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white border-b-3 border-black shadow-sm">
        <div className="flex items-center gap-2">
          <Link
            href="/siswa/game-mouse"
            className="p-1.5 bg-white text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-amber-300 transition-all cursor-pointer"
            title="Kembali ke Hub Game"
          >
            <Compass className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🎨</span>
            <div>
              <h1 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wide text-white flex items-center gap-1.5">
                <span>Seniman Cilik Paint</span>
                <span className="hidden sm:inline bg-amber-400 text-black text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-black">
                  v1.0 Studio
                </span>
              </h1>
              <p className="text-[10px] font-mono text-cyan-200 line-clamp-1">
                {currentStage.title}
              </p>
            </div>
          </div>
        </div>

        {/* HUD Info Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Timer */}
          <div
            className={`border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 font-mono font-black text-xs sm:text-sm transition-colors ${
              timeLeft <= 10 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-400 text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          {/* Target Pewarnaan Ember */}
          <div
            className={`border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] font-mono font-black text-xs sm:text-sm flex items-center gap-1 ${
              filledCount >= currentStage.minFillTarget ? 'bg-emerald-400 text-black' : 'bg-white text-black'
            }`}
            title="Area Diwarnai dengan Ember"
          >
            <PaintBucket className="w-3.5 h-3.5" />
            <span>
              {filledCount}/{totalAreas}
            </span>
          </div>

          {/* Target Goresan Kuas */}
          <div
            className={`border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] font-mono font-black text-xs sm:text-sm hidden sm:flex items-center gap-1 ${
              strokeCount >= currentStage.minStrokeTarget ? 'bg-emerald-400 text-black' : 'bg-white text-black'
            }`}
            title="Goresan Kuas Bebas"
          >
            <Brush className="w-3.5 h-3.5" />
            <span>
              {strokeCount}/{currentStage.minStrokeTarget}
            </span>
          </div>

          {/* Skor Seniman */}
          <div className="bg-amber-300 text-black border-2 border-black px-2 sm:px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000] font-mono font-black text-xs sm:text-sm hidden md:flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" />
            <span>{score}</span>
          </div>

          {/* Kontrol Audio & Fullscreen */}
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

      {/* ─── RETRO RIBBON TOOLBAR & COLOR PALETTE ─────────────────── */}
      <div className="bg-slate-100 border-b-3 border-black p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        {/* Grup 1: Pilihan Alat Lukis */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white border-2 border-black p-1 rounded-xl shadow-[2px_2px_0px_0px_#000]">
          <button
            onClick={() => {
              setActiveTool('fill');
              setHoveredRegionId(null);
              paintAudio.playToolSwitch();
            }}
            className={`px-2.5 py-1.5 rounded-lg border-2 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'fill'
                ? 'bg-amber-400 border-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 text-black'
                : 'bg-white border-transparent hover:border-black text-slate-700'
            }`}
            title="Ember Tumpah: Klik untuk mewarnai bidang tertutup"
          >
            <PaintBucket className="w-4 h-4" />
            <span className="hidden sm:inline">Ember (Fill)</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('brush');
              setHoveredRegionId(null);
              paintAudio.playToolSwitch();
            }}
            className={`px-2.5 py-1.5 rounded-lg border-2 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === 'brush'
                ? 'bg-cyan-400 border-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 text-black'
                : 'bg-white border-transparent hover:border-black text-slate-700'
            }`}
            title="Kuas: Menggambar bebas di atas kanvas"
          >
            <Brush className="w-4 h-4" />
            <span className="hidden sm:inline">Kuas (Brush)</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('pencil');
              setHoveredRegionId(null);
              paintAudio.playToolSwitch();
            }}
            className={`p-1.5 rounded-lg border-2 font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              activeTool === 'pencil'
                ? 'bg-emerald-400 border-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 text-black'
                : 'bg-white border-transparent hover:border-black text-slate-700'
            }`}
            title="Pensil Halus"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTool('spray');
              setHoveredRegionId(null);
              paintAudio.playToolSwitch();
            }}
            className={`p-1.5 rounded-lg border-2 font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              activeTool === 'spray'
                ? 'bg-purple-400 border-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 text-black'
                : 'bg-white border-transparent hover:border-black text-slate-700'
            }`}
            title="Semprotan Airbrush"
          >
            <SprayCan className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTool('eraser');
              setHoveredRegionId(null);
              paintAudio.playToolSwitch();
            }}
            className={`p-1.5 rounded-lg border-2 font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-rose-400 border-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 text-black'
                : 'bg-white border-transparent hover:border-black text-slate-700'
            }`}
            title="Penghapus Goresan Kuas"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Grup 2: Ukuran Kuas */}
        {activeTool !== 'fill' && (
          <div className="flex items-center gap-1 bg-white border-2 border-black p-1 rounded-xl shadow-[2px_2px_0px_0px_#000] animate-in fade-in duration-150">
            <span className="text-[10px] font-mono font-bold text-slate-500 px-1 hidden md:inline">
              Ukuran:
            </span>
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBrushSize(b.size);
                  paintAudio.playToolSwitch();
                }}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                  brushSize === b.size
                    ? 'bg-amber-300 border-black shadow-[1px_1px_0px_0px_#000]'
                    : 'bg-slate-50 border-slate-200 hover:border-black'
                }`}
                title={`Ukuran Kuas: ${b.label}`}
              >
                <span className={`bg-black rounded-full ${b.dot}`} />
              </button>
            ))}
          </div>
        )}

        {/* Grup 3: Palet 16 Warna & Preview Kotak Warna Aktif */}
        <div className="flex items-center gap-2">
          {/* Kotak Warna Aktif */}
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              style={{ backgroundColor: activeColor }}
              title={`Warna Aktif: ${activeColor}`}
            />
            <span className="text-[8px] font-mono font-black text-slate-500 uppercase mt-0.5">
              Warna 1
            </span>
          </div>

          {/* Grid 16 Palet Warna */}
          <div className="grid grid-cols-8 sm:grid-cols-8 gap-1 bg-white border-2 border-black p-1 rounded-xl shadow-[2px_2px_0px_0px_#000]">
            {PAINT_PALETTE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveColor(c.hex);
                  paintAudio.playColorSelect();
                }}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 transition-transform cursor-pointer ${
                  activeColor === c.hex
                    ? 'border-black scale-110 shadow-[1px_1px_0px_0px_#000] z-10 ring-2 ring-black/40'
                    : 'border-black/30 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Grup 4: Tombol Aksi (Undo, Clear, Download, Pajang Karya) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            className="p-2 bg-white hover:bg-slate-100 active:scale-95 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            title="Kembalikan Goresan Terakhir (Undo)"
          >
            <Undo2 className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={handleClearStrokes}
            className="p-2 bg-white hover:bg-rose-100 active:scale-95 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            title="Bersihkan Semua Goresan Kuas"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
          </button>

          <button
            onClick={handleDownloadArtwork}
            className="p-2 bg-white hover:bg-emerald-100 active:scale-95 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            title="Unduh Lukisan ke File PNG"
          >
            <Download className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Tombol Pajang Karya (Menyala saat target terpenuhi) */}
          <button
            onClick={handleCompleteStage}
            className={`px-3 py-1.5 rounded-xl border-3 border-black font-heading font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              isTargetAchieved
                ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-[3px_3px_0px_0px_#000] animate-bounce'
                : 'bg-slate-200 text-slate-500 shadow-none'
            }`}
            title={isTargetAchieved ? 'Selesai & Pajang ke Galeri Emas!' : 'Penuhi target pewarnaan & kuas terlebih dahulu'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTargetAchieved ? 'Pajang Karya! ✨' : 'Belum Lengkap'}</span>
          </button>
        </div>
      </div>

      {/* ─── PANDUAN MISI KANVAS AKTIF ────────────────────────────── */}
      <div className="bg-amber-100/70 border-b-2 border-black px-4 py-1.5 text-xs font-mono flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-800 truncate">
          <Info className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          {activeTool === 'fill' && hoveredRegion ? (
            <span className="truncate font-bold text-blue-900 flex items-center gap-1.5 animate-in fade-in duration-100">
              <span>🎯 Sorot: {hoveredRegion.name}</span>
              <span className="text-slate-500 font-normal hidden sm:inline-flex items-center gap-1">
                (Saran warna:
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border border-black align-middle shadow-[1px_1px_0px_0px_#000]"
                  style={{ backgroundColor: hoveredRegion.recommended }}
                  title={hoveredRegion.recommended}
                />
                )
              </span>
            </span>
          ) : (
            <span className="truncate">{currentStage.prompt}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 font-bold">
          <span className={filledCount >= currentStage.minFillTarget ? 'text-emerald-700' : 'text-slate-600'}>
            🪣 {filledCount}/{currentStage.minFillTarget} Area
          </span>
          <span className="text-slate-400">|</span>
          <span className={strokeCount >= currentStage.minStrokeTarget ? 'text-emerald-700' : 'text-slate-600'}>
            🖌️ {strokeCount}/{currentStage.minStrokeTarget} Goresan
          </span>
        </div>
      </div>

      {/* ─── KANVAS UTAMA BERKUALITAS (DUAL LAYER) ────────────────── */}
      <main className="relative flex-1 bg-white overflow-hidden flex items-center justify-center p-2 sm:p-4 select-none">
        {/* Frame Pigura Kertas Gambar - Lebar menyesuaikan proporsi gambar asli */}
        <div
          className="relative w-full max-h-[500px] bg-white border-3 border-black rounded-2xl shadow-[5px_5px_0px_0px_#000] overflow-hidden transition-all duration-300"
          style={{
            aspectRatio: currentStage?.aspectRatio || '8/5',
            maxWidth: currentStage?.maxWidth || '800px',
          }}
        >
          {/* LAYER 1: TEMPLATE VEKTOR SVG HITAM PUTIH (FILL BUCKET TARGET) */}
          <svg
            id="paint-svg-template"
            viewBox={currentStage?.viewBox || '0 0 800 500'}
            className="absolute inset-0 w-full h-full block"
            style={{ touchAction: 'none' }}
          >
            {/* 1. Render Bidang-Bidang Tertutup (Target Klik Ember) */}
            {currentStage.regions.map((region) => {
              const fillColor = filledAreas[region.id] || region.defaultFill;
              const isHovered = hoveredRegionId === region.id && activeTool === 'fill';

              return (
                <path
                  key={region.id}
                  id={region.id}
                  d={region.d}
                  fill={fillColor}
                  stroke={isHovered ? '#1D4ED8' : (currentStage.regionStroke || '#0F172A')}
                  strokeWidth={isHovered ? '4.5' : (currentStage.regionStrokeWidth || '3.2')}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  onPointerEnter={() => {
                    if (activeTool === 'fill') setHoveredRegionId(region.id);
                  }}
                  onPointerLeave={() => {
                    if (activeTool === 'fill') setHoveredRegionId(null);
                  }}
                  onClick={() => handleRegionClick(region.id)}
                  className={`transition-colors duration-150 ${
                    activeTool === 'fill' ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                  }`}
                >
                  <title>{`${region.name} (Klik dengan Ember untuk mewarnai)`}</title>
                </path>
              );
            })}

            {/* 2. Render Garis-Garis Dekorasi Artistik Buku Gambar (Detail, Mata, Senyum, Tekstur) */}
            {currentStage.decorationsGroup ? (
              <g className="pointer-events-none select-none">
                {currentStage.decorationsGroup}
              </g>
            ) : currentStage.decorations ? (
              <g className="pointer-events-none select-none">
                {currentStage.decorations.map((dec, idx) => (
                  <path
                    key={`dec-${idx}`}
                    d={dec.d}
                    fill={dec.fill || 'none'}
                    stroke={dec.stroke || (dec.fill ? 'none' : '#0F172A')}
                    strokeWidth={dec.strokeWidth || 2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray={dec.strokeDasharray || undefined}
                  />
                ))}
              </g>
            ) : null}
          </svg>

          {/* LAYER 2: HTML5 CANVAS UNTUK GORESAN KUAS / PENSIL / SPRAY BEBAS */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`absolute inset-0 w-full h-full block select-none ${
              activeTool === 'fill'
                ? 'pointer-events-none cursor-default'
                : activeTool === 'eraser'
                ? 'pointer-events-auto cursor-cell'
                : 'pointer-events-auto cursor-crosshair'
            }`}
            style={{ touchAction: 'none' }}
          />
        </div>
      </main>

      {/* ─── MODAL 1: IDLE WELCOME & TUTORIAL ──────────────────────── */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-md w-full text-center space-y-3.5 sm:space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200 text-black">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-3xl">
              🎨
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <div className="inline-block bg-rose-300 border-2 border-black px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                Game 6 • Fokus: Koordinasi Motorik Total
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                Seniman Cilik Paint
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                Asah kelenturan jemari dan stabilitas memegang mouse! Warnai template pemandangan dengan <strong>alat Ember (Fill)</strong> dan gambar goresan indah dengan <strong>Kuas (Brush)</strong>.
              </p>
            </div>

            {/* Kotak Petunjuk Praktis */}
            <div className="bg-sky-50 border-2 border-black rounded-xl p-3 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-sky-900">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>Panduan Alat Pelukis:</span>
              </div>
              <ul className="space-y-1 text-[10px] sm:text-[11px] text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-sm">🪣</span>
                  <span><strong>Ember Tumpah (Fill):</strong> Klik 1x pada area tertutup untuk mengisi warna secara instan.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">🖌️</span>
                  <span><strong>Kuas Lukis (Brush):</strong> Tahan klik kiri dan geser mouse untuk menggambar bebas di atas kanvas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">🎨</span>
                  <span><strong>16 Warna Cerah:</strong> Pilih warna favoritmu dan penuhi target untuk memajang karya di galeri!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-amber-400 hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 text-black border-3 border-black font-heading font-black text-sm sm:text-base py-2.5 sm:py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer uppercase transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Buka Studio Lukis Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: PAUSED SCREEN ─────────────────────────────────── */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-sm w-full text-center space-y-3.5 text-black">
            <h2 className="font-heading font-black text-xl text-black">
              Studio Dilukis Dijeda
            </h2>
            <p className="text-xs text-slate-600">
              Karyamu tersimpan aman di atas kanvas kerja.
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
                title="Mulai Ulang Kanvas Ini"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: TIMEOUT (WAKTU HABIS) ─────────────────────────── */}
      {gameState === 'timeout' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-sm w-full text-center space-y-3 text-black">
            <div className="w-12 h-12 bg-rose-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl">
              ⏰
            </div>

            <h2 className="font-heading font-black text-xl text-rose-600">
              Waktu Mewarnai Selesai!
            </h2>
            <p className="text-xs text-slate-600">
              Jangan berkecil hati! Gerakkan mouse lebih lincah dan warnai bidang yang tersisa.
            </p>

            <button
              onClick={retryStage}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Mewarnai Lagi</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: STAGE CLEAR (PIGURA KARYA SENI) ────────────────── */}
      {gameState === 'stage_clear' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 max-w-md w-full text-center space-y-3.5 text-black">
            <div className="w-12 h-12 bg-amber-400 border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl mx-auto flex items-center justify-center text-2xl">
              🖼️
            </div>

            <div>
              <div className="inline-block bg-emerald-300 border border-black px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-1">
                Karya Berhasil Dipajang!
              </div>
              <h2 className="font-heading font-black text-xl text-black">
                {currentStage.title} Selesai!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Kombinasi warna ember dan goresan kuasmu sungguh memukau!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 border-2 border-black rounded-xl p-2.5 font-mono text-xs">
              <div className="text-left">
                <span className="text-slate-500 text-[10px]">Area Diwarnai:</span>
                <p className="font-black text-sm text-black">
                  {filledCount} / {totalAreas} Area
                </p>
              </div>
              <div className="text-left">
                <span className="text-slate-500 text-[10px]">Goresan Kuas:</span>
                <p className="font-black text-sm text-emerald-600">
                  {strokeCount} Goresan
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadArtwork}
                className="bg-white hover:bg-slate-100 text-black border-2 border-black font-heading font-black text-xs px-3 py-2.5 rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1 cursor-pointer"
                title="Unduh Karya PNG"
              >
                <Download className="w-4 h-4" />
                <span>Unduh</span>
              </button>

              <button
                onClick={handleNextStage}
                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <span>Lanjut ke Kanvas {currentStageIdx + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: GRAND FINALE / MAESTRO SENI GALERI ────────────── */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-40 overflow-y-auto">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-5 sm:p-6 max-w-lg w-full text-center space-y-4 text-black my-auto">
            <div className="w-14 h-14 bg-amber-400 border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl mx-auto flex items-center justify-center text-3xl">
              🏆
            </div>

            <div className="space-y-1">
              <div className="inline-block bg-rose-300 border-2 border-black px-2.5 py-0.5 rounded text-xs font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                Maestro Seni Cilik Nusantara!
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                Seluruh 5 Kanvas Telah Terlukis!
              </h2>
              <p className="text-xs sm:text-sm text-slate-700">
                Hebat sekali! Koordinasi motorik halus tanganmu memegang mouse telah teruji sempurna melalui 5 karya bertingkat penuh warna.
              </p>
            </div>

            {/* Rekap Galeri 5 Karya */}
            <div className="bg-amber-50 border-2 border-black rounded-xl p-3 text-left space-y-2">
              <div className="text-[11px] font-mono font-black text-slate-800 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Galeri 5 Mahakarya Seniman:</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                {completedGalleries.map((g, idx) => (
                  <div
                    key={`gal-${idx}`}
                    className="flex items-center justify-between bg-white border border-black/30 p-1.5 rounded-lg text-[11px]"
                  >
                    <span className="font-bold truncate max-w-[240px]">{g.title}</span>
                    <span className="text-emerald-700 font-bold shrink-0">
                      ✓ {g.filled} Area • {g.strokes} Goresan
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 border-2 border-black rounded-xl p-2.5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500">Total Skor Seni:</span>
                <p className="font-black text-sm text-black">{score}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Predikat:</span>
                <p className="font-black text-sm text-amber-600">Pelukis Bintang 5 ⭐</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black border-3 border-black font-heading font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Lukis Ulang</span>
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
