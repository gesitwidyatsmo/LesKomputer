"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  MousePointer,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  CheckCircle,
  AlertCircle,
  Play,
  Maximize2,
  Minimize2,
  ArrowRight,
  Zap,
  Target,
  Clock,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Mouse,
  Move,
  FileCode,
  FolderDown,
  Compass,
  X
} from "lucide-react";
import Swal from "sweetalert2";

// Stage definitions
const STAGES = [
  {
    id: 1,
    name: "Tahap 1: Sorot Pointer (Hover)",
    shortName: "1. Sorot (Hover)",
    color: "bg-rose-500 hover:bg-rose-600 text-white",
    borderColor: "border-rose-700",
    bgLight: "bg-rose-50",
    textLabel: "Sorot ini",
    desc: "Arahkan kursor tepat ke dalam kotak merah dan tahan sebentar sampai warna berubah.",
    instruction: "Gerakkan mouse dan sorot kotak di bawah tanpa perlu mengklik!",
    type: "hover",
  },
  {
    id: 2,
    name: "Tahap 2: Klik Kiri (Single Click)",
    shortName: "2. Klik Kiri",
    color: "bg-blue-600 hover:bg-blue-700 text-white",
    borderColor: "border-blue-800",
    bgLight: "bg-blue-50",
    textLabel: "Klik ini",
    desc: "Arahkan pointer ke kotak biru lalu tekan tombol kiri mouse 1 kali.",
    instruction: "Klik kiri tepat pada kotak biru. Jangan menyeret mouse saat mengklik!",
    type: "click",
  },
  {
    id: 3,
    name: "Tahap 3: Klik Kanan (Right Click)",
    shortName: "3. Klik Kanan",
    color: "bg-amber-500 hover:bg-amber-600 text-black",
    borderColor: "border-amber-700",
    bgLight: "bg-amber-50",
    textLabel: "Klik Kanan",
    desc: "Arahkan pointer dan tekan tombol kanan mouse (jari tengah).",
    instruction: "Tekan tombol kanan mouse tepat di atas kotak kuning.",
    type: "contextmenu",
  },
  {
    id: 4,
    name: "Tahap 4: Klik Ganda (Double Click)",
    shortName: "4. Klik Ganda (2x)",
    color: "bg-purple-600 hover:bg-purple-700 text-white",
    borderColor: "border-purple-800",
    bgLight: "bg-purple-50",
    textLabel: "Klik 2x Cepat",
    desc: "Tekan tombol kiri 2 kali berturut-turut secara cepat dan stabil.",
    instruction: "Lakukan Double Click (klik 2x cepat) di dalam kotak ungu.",
    type: "dblclick",
  },
  {
    id: 5,
    name: "Tahap 5: Seret & Lepas (Drag & Drop)",
    shortName: "5. Drag & Drop",
    color: "bg-emerald-600 hover:bg-emerald-700 text-white",
    borderColor: "border-emerald-800",
    bgLight: "bg-emerald-50",
    textLabel: "Seret ke Folder",
    desc: "Klik dan tahan kotak file, geser pointer ke dalam folder target, lalu lepaskan.",
    instruction: "Seret (Drag) file dokumen ke dalam Folder Sasaran lalu lepaskan.",
    type: "drag",
  },
  {
    id: 6,
    name: "Tahap 6: Gulir Layar (Scroll Wheel)",
    shortName: "6. Scroll Wheel",
    color: "bg-cyan-600 hover:bg-cyan-700 text-white",
    borderColor: "border-cyan-800",
    bgLight: "bg-cyan-50",
    textLabel: "Scroll & Temukan",
    desc: "Target berpindah di 10 sektor halaman. Putar roda mouse ke atas atau ke bawah untuk mencarinya.",
    instruction: "Gulir roda mouse ke atas atau ke bawah untuk mencari target di 10 sektor halaman!",
    type: "scroll",
  },
  {
    id: 7,
    name: "Tahap 7: Target Bergerak (Moving Target)",
    shortName: "7. Target Bergerak",
    color: "bg-orange-500 hover:bg-orange-600 text-black",
    borderColor: "border-orange-700",
    bgLight: "bg-orange-50",
    textLabel: "Bidik & Klik!",
    desc: "Target akan melayang memantul perlahan. Latih refleks dan ketepatan koordinasi.",
    instruction: "Bidik target yang sedang bergerak dan klik tepat sasaran!",
    type: "moving",
  },
];

// Target sizes (Width x Height)
const SIZES = {
  large: { name: "Besar (Mudah)", width: 180, height: 60, font: "text-base font-bold" },
  medium: { name: "Standar (150x50)", width: 150, height: 50, font: "text-sm font-bold" },
  small: { name: "Kecil (Tantangan)", width: 105, height: 40, font: "text-xs font-bold" },
};

// Web Audio API Synthesizer (Zero External Dependencies)
function playTone(type, isMuted) {
  if (isMuted || typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "hit") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "miss") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "complete") {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.25);
      });
    }
  } catch (e) {
    // Ignore audio context errors if browser blocked autoplay
  }
}

export default function MouseTrainerGame() {
  const [currentStageId, setCurrentStageId] = useState(1);
  const [targetCount, setTargetCount] = useState(50);
  const [currentTarget, setCurrentTarget] = useState(0);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Statistics
  const [totalClicks, setTotalClicks] = useState(0);
  const [missClicks, setMissClicks] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [lastHitTimestamp, setLastHitTimestamp] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);

  // Target coordinates & size
  const [targetPos, setTargetPos] = useState({ x: 100, y: 100 });
  const [movingVelocity, setMovingVelocity] = useState({ dx: 2, dy: 1.5 });
  const [hoverProgress, setHoverProgress] = useState(0);

  // Stage 5 Drag & drop state
  const [dragItemPos, setDragItemPos] = useState({ x: 80, y: 150 });
  const [dropZonePos, setDropZonePos] = useState({ x: 400, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Floating particles & popups
  const [popups, setPopups] = useState([]);

  // DOM Refs
  const gameAreaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Stage 6 Scroll Target Section
  const [scrollTargetSection, setScrollTargetSection] = useState(2);

  const stage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];
  const sizeConfig = SIZES[selectedSize] || SIZES.medium;

  // Utility to generate random coordinates within container (Excluding top HUD area)
  const getRandomPosition = useCallback((targetWidth, targetHeight, customContainer = null) => {
    const area = customContainer || gameAreaRef.current;
    if (!area) return { x: 50, y: 100 };

    const topPadding = isFullscreen ? 85 : 75; // Exclude top info/HUD completely
    const bottomPadding = 25;
    const leftRightPadding = 25;

    const maxW = Math.max(area.clientWidth - targetWidth - leftRightPadding * 2, 20);
    const maxH = Math.max(area.clientHeight - targetHeight - topPadding - bottomPadding, 20);

    const x = Math.floor(Math.random() * maxW) + leftRightPadding;
    const y = Math.floor(Math.random() * maxH) + topPadding;
    return { x, y };
  }, [isFullscreen]);

  // Spawn new target for current stage
  const spawnTarget = useCallback(() => {
    if (stage.type === "drag") {
      const dropW = 140;
      const dropH = 120;
      const itemW = 80;
      const itemH = 80;

      // Position dropzone and item far enough apart (both below top HUD)
      const itemPos = getRandomPosition(itemW, itemH);
      let dropPos = getRandomPosition(dropW, dropH);

      // Ensure minimum distance
      const dist = Math.hypot(dropPos.x - itemPos.x, dropPos.y - itemPos.y);
      if (dist < 150) {
        dropPos = {
          x: (itemPos.x + 200) % (gameAreaRef.current?.clientWidth - 160 || 300),
          y: Math.max(isFullscreen ? 85 : 75, (itemPos.y + 120) % (gameAreaRef.current?.clientHeight - 140 || 200)),
        };
      }
      setDragItemPos(itemPos);
      setDropZonePos(dropPos);
    } else if (stage.type === "scroll") {
      // Pick a new random sector between 1 and 10 (different from previous)
      setScrollTargetSection((prev) => {
        const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((c) => c !== prev);
        return candidates[Math.floor(Math.random() * candidates.length)] || 5;
      });
      // Tetap pada posisi scroll saat ini agar siswa melatih scroll ke atas maupun ke bawah
    } else {
      const pos = getRandomPosition(sizeConfig.width, sizeConfig.height);
      setTargetPos(pos);
      setHoverProgress(0);

      if (stage.type === "moving") {
        const speed = 2.2;
        const angle = Math.random() * Math.PI * 2;
        setMovingVelocity({
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
        });
      }
    }
  }, [getRandomPosition, isFullscreen, sizeConfig.width, sizeConfig.height, stage.type]);

  // Start / Reset Session
  const resetGame = useCallback((newStageId = null, newCount = null) => {
    const sId = newStageId !== null ? newStageId : currentStageId;
    const count = newCount !== null ? newCount : targetCount;

    setCurrentStageId(sId);
    setTargetCount(count);
    setCurrentTarget(0);
    setTotalClicks(0);
    setMissClicks(0);
    setElapsedTime(0);
    setIsFinished(false);
    setStartTime(null);
    setLastHitTimestamp(null);
    setReactionTimes([]);
    setHoverProgress(0);
    setIsDragging(false);

    if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (sId === 6 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
      spawnTarget();
    }, 50);
  }, [currentStageId, targetCount, spawnTarget]);

  // Handle closing victory modal with confirmation
  const handleCloseVictory = async () => {
    const res = await Swal.fire({
      title: "Tutup & Reset Latihan?",
      text: "Jika kamu menutup jendela skor ini, latihan tahap ini akan direset kembali dari awal.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Tutup & Reset",
      cancelButtonText: "Batal",
      customClass: {
        popup: "border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] font-sans bg-white",
        title: "font-heading font-black text-black text-lg sm:text-xl",
        htmlContainer: "text-xs sm:text-sm font-medium text-slate-700",
        confirmButton: "bg-orange-500 hover:bg-orange-600 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-4 py-2.5 cursor-pointer ml-2",
        cancelButton: "bg-slate-200 hover:bg-slate-300 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] px-4 py-2.5 cursor-pointer mr-2",
      },
      buttonsStyling: false,
    });

    if (res.isConfirmed) {
      setIsFinished(false);
      resetGame(currentStageId);
    }
  };

  // Initialize position on mount or resize
  useEffect(() => {
    const timer = setTimeout(() => {
      spawnTarget();
    }, 100);

    const handleResize = () => {
      spawnTarget();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedSize, currentStageId, spawnTarget]);

  // Timer Tick
  useEffect(() => {
    if (startTime && !isFinished) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [startTime, isFinished]);

  // Moving target animation loop for Stage 7
  useEffect(() => {
    if (stage.type !== "moving" || isFinished) return;

    let localPos = { ...targetPos };
    let localVel = { ...movingVelocity };

    const animate = () => {
      const area = gameAreaRef.current;
      if (area) {
        const topBound = isFullscreen ? 85 : 75; // Exclude top info/HUD completely
        const bottomBound = area.clientHeight - sizeConfig.height - 15;
        const leftBound = 15;
        const rightBound = area.clientWidth - sizeConfig.width - 15;

        let nextX = localPos.x + localVel.dx;
        let nextY = localPos.y + localVel.dy;

        if (nextX <= leftBound) {
          nextX = leftBound;
          localVel.dx = Math.abs(localVel.dx);
        } else if (nextX >= rightBound) {
          nextX = rightBound;
          localVel.dx = -Math.abs(localVel.dx);
        }

        if (nextY <= topBound) {
          nextY = topBound;
          localVel.dy = Math.abs(localVel.dy);
        } else if (nextY >= bottomBound) {
          nextY = bottomBound;
          localVel.dy = -Math.abs(localVel.dy);
        }

        localPos = { x: nextX, y: nextY };
        setTargetPos({ x: nextX, y: nextY });
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stage.type, isFinished, movingVelocity, sizeConfig.width, sizeConfig.height, isFullscreen]);

  // Trigger popup animation on hit
  const triggerHitEffect = (x, y, text = "+1") => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, x, y, text }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  };

  // On successful target completed
  const handleTargetSuccess = useCallback((e, customText = "Tepat!") => {
    const now = Date.now();
    if (!startTime) {
      setStartTime(now);
    }

    // Measure reaction time
    if (lastHitTimestamp) {
      const reactTime = now - lastHitTimestamp;
      setReactionTimes((prev) => [...prev, reactTime]);
    }
    setLastHitTimestamp(now);

    // Audio & Visual feedback
    playTone(stage.type === "hover" ? "hover" : "hit", isMuted);
    
    // Popup coordinate
    let clientX = targetPos.x + sizeConfig.width / 2;
    let clientY = targetPos.y;
    if (e && e.nativeEvent) {
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (rect) {
        clientX = e.clientX - rect.left;
        clientY = e.clientY - rect.top;
      }
    }
    triggerHitEffect(clientX, clientY, customText);

    const nextCount = currentTarget + 1;
    setCurrentTarget(nextCount);

    // Check if stage is finished (or if unlimited mode, keep going)
    if (targetCount !== 0 && nextCount >= targetCount) {
      setIsFinished(true);
      playTone("complete", isMuted);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    } else {
      spawnTarget();
    }
  }, [startTime, lastHitTimestamp, stage.type, isMuted, targetPos.x, sizeConfig.width, targetPos.y, currentTarget, targetCount, spawnTarget]);

  // Background Click (Miss Click detection)
  const handleAreaClick = (e) => {
    if (isFinished) return;
    if (!startTime) setStartTime(Date.now());
    
    setTotalClicks((prev) => prev + 1);
    setMissClicks((prev) => prev + 1);
    playTone("miss", isMuted);

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect && e) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerHitEffect(clickX, clickY, "Meleset!");
    }
  };

  // Prevent default right-click and detect Right-Click Misses
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isFinished) return;
    if (!startTime) setStartTime(Date.now());

    setTotalClicks((prev) => prev + 1);
    setMissClicks((prev) => prev + 1);
    playTone("miss", isMuted);

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect && e) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerHitEffect(clickX, clickY, "Meleset!");
    }
  };

  // Hover Stage Handler (requires staying on target for 280ms)
  const handleTargetMouseEnter = () => {
    if (stage.type !== "hover" || isFinished) return;
    if (!startTime) setStartTime(Date.now());

    let progress = 0;
    hoverTimerRef.current = setInterval(() => {
      progress += 25;
      setHoverProgress(progress);
      if (progress >= 100) {
        clearInterval(hoverTimerRef.current);
        handleTargetSuccess(null, "Bagus!");
      }
    }, 45);
  };

  const handleTargetMouseLeave = () => {
    if (stage.type !== "hover") return;
    if (hoverTimerRef.current) {
      clearInterval(hoverTimerRef.current);
      setHoverProgress(0);
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e) => {
    if (stage.type !== "drag" || isFinished) return;
    if (!startTime) setStartTime(Date.now());
    setIsDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDragMove = (e) => {
    if (!isDragging || stage.type !== "drag" || !gameAreaRef.current) return;
    const areaRect = gameAreaRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(e.clientX - areaRect.left - dragOffset.x, areaRect.width - 90));
    const newY = Math.max(10, Math.min(e.clientY - areaRect.top - dragOffset.y, areaRect.height - 90));
    setDragItemPos({ x: newX, y: newY });
  };

  const handleDragEnd = (e) => {
    if (!isDragging || stage.type !== "drag") return;
    setIsDragging(false);

    // Check collision with dropzone
    const itemCenter = {
      x: dragItemPos.x + 40,
      y: dragItemPos.y + 40,
    };
    const dropW = 140;
    const dropH = 120;

    if (
      itemCenter.x >= dropZonePos.x &&
      itemCenter.x <= dropZonePos.x + dropW &&
      itemCenter.y >= dropZonePos.y &&
      itemCenter.y <= dropZonePos.y + dropH
    ) {
      handleTargetSuccess(e, "Sukses Masuk!");
    } else {
      playTone("miss", isMuted);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      setTimeout(() => {
        spawnTarget();
      }, 100);
      return next;
    });
  };

  // Listen to Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => {
          spawnTarget();
        }, 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, spawnTarget]);

  // Calculate Accuracy
  const hits = currentTarget;
  const recordedActions = stage.type === "hover" ? hits : Math.max(totalClicks, hits);
  const accuracy = recordedActions > 0 ? Math.min(100, Math.round((hits / (hits + missClicks)) * 100)) : 100;

  // Average reaction time
  const avgReaction =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  // Format Elapsed Time
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div
      className={`flex flex-col transition-all select-none ${
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-[#FFFDF5] p-2 sm:p-3 overflow-hidden flex flex-col justify-between"
          : "w-full"
      }`}
    >
      {/* ── TOP CONTROL PANEL (Hanya Tampil Saat Mode Normal, Tersembunyi di Fullscreen) ── */}
      {!isFullscreen && (
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-4 sm:p-5 mb-4">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-300 border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000] font-black text-black">
                <Mouse className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-black text-lg sm:text-xl text-black">
                    {stage.name}
                  </h1>
                  <span className="bg-black text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                    Praktik Mouse
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-mono font-medium mt-0.5">
                  {stage.instruction}
                </p>
              </div>
            </div>

            {/* Quick Actions in Normal Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
                className="p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-slate-800"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-600" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
              </button>
              <button
                onClick={() => resetGame()}
                title="Ulangi Tahap Ini"
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-mono text-xs font-black text-black"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Realtime Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Target Counter */}
            <div className="bg-amber-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Target</div>
                <div className="font-heading font-black text-base sm:text-lg text-black">
                  {currentTarget} <span className="text-xs text-slate-500 font-mono">/ {targetCount === 0 ? "∞" : targetCount}</span>
                </div>
              </div>
            </div>

            {/* Time Elapsed */}
            <div className="bg-cyan-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Waktu</div>
                <div className="font-heading font-black text-base sm:text-lg text-black font-mono">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-emerald-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Akurasi</div>
                <div className="font-heading font-black text-base sm:text-lg text-emerald-800">
                  {accuracy}%
                </div>
              </div>
            </div>

            {/* Miss Clicks */}
            <div className="bg-rose-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-rose-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Meleset</div>
                <div className="font-heading font-black text-base sm:text-lg text-rose-700">
                  {missClicks} <span className="text-xs text-slate-500 font-mono">kali</span>
                </div>
              </div>
            </div>

            {/* Average Reaction Time */}
            <div className="hidden lg:flex bg-purple-50 border-2 border-black p-2.5 rounded-lg shadow-[3px_3px_0px_0px_#000] items-center gap-3">
              <div className="w-8 h-8 rounded bg-purple-300 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Kecepatan</div>
                <div className="font-heading font-black text-sm text-purple-900 font-mono">
                  {avgReaction > 0 ? `${avgReaction} ms` : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Stage Selector Pills */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono font-bold scrollbar-thin">
              <span className="text-slate-500 mr-1 shrink-0">Pilih Tahap:</span>
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => resetGame(s.id)}
                  className={`px-3 py-1.5 rounded-md border-2 border-black shrink-0 transition-all cursor-pointer font-bold ${
                    currentStageId === s.id
                      ? "bg-black text-white shadow-[2px_2px_0px_0px_#FF6B00] scale-105"
                      : "bg-white text-slate-800 hover:bg-amber-100 shadow-[1px_1px_0px_0px_#000]"
                  }`}
                >
                  {s.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Options Row (Target Count, Box Size, & Fullscreen Button) */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Target Count Option */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Jumlah Target:</span>
                {[10, 25, 50, 0].map((count) => (
                  <button
                    key={count}
                    onClick={() => resetGame(currentStageId, count)}
                    className={`px-2.5 py-1 rounded border border-black font-bold transition-all cursor-pointer ${
                      targetCount === count
                        ? "bg-orange-500 text-black shadow-[1px_1px_0px_0px_#000]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {count === 0 ? "Bebas (∞)" : `${count}x`}
                  </button>
                ))}
              </div>

              {/* Size Option */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Ukuran Kotak:</span>
                {Object.keys(SIZES).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSize(key)}
                    className={`px-2.5 py-1 rounded border border-black font-bold transition-all cursor-pointer ${
                      selectedSize === key
                        ? "bg-cyan-400 text-black shadow-[1px_1px_0px_0px_#000]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {SIZES[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Repositioned Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title="Aktifkan Mode Layar Penuh"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Layar Penuh</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN INTERACTIVE GAME CANVAS / PLAYGROUND ────────────────── */}
      <div
        ref={gameAreaRef}
        onClick={handleAreaClick}
        onContextMenu={handleContextMenu}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        className={`relative w-full bg-[#f4f4f4] bg-retro-grid border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl overflow-hidden cursor-crosshair select-none transition-all ${
          isFullscreen ? "flex-1 w-full h-full min-h-[500px]" : "h-[480px] sm:h-[540px]"
        }`}
      >
        {/* Stage watermark background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-8xl sm:text-9xl font-black font-heading text-black">
            STAGE {stage.id}
          </span>
        </div>

        {/* ── FULLSCREEN FLOATING HUD OVERLAY (Hanya Muncul Saat Mode Layar Penuh) ── */}
        {isFullscreen ? (
          <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Left: Stage Title & Instruction */}
            <div className="bg-white/95 backdrop-blur border-2 border-black px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 pointer-events-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xs text-black leading-tight">
                  {stage.name}
                </span>
                <span className="font-mono text-[10px] text-slate-600 font-medium">
                  {stage.instruction}
                </span>
              </div>
            </div>

            {/* Center: Realtime Stats Badges */}
            <div className="bg-black/90 backdrop-blur text-white border-2 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center gap-3 sm:gap-4 font-mono text-xs font-bold pointer-events-auto select-none">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Target className="w-3.5 h-3.5" />
                <span>Target: {currentTarget}/{targetCount === 0 ? "∞" : targetCount}</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700"></div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700"></div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <Activity className="w-3.5 h-3.5" />
                <span>{accuracy}%</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700"></div>
              <div className="flex items-center gap-1.5 text-rose-300">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Meleset: {missClicks}</span>
              </div>
            </div>

            {/* Right: Actions & Exit Fullscreen Button */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
                className="p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer text-slate-800"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => resetGame()}
                title="Ulangi Tahap Ini"
                className="flex items-center gap-1 px-3 py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={toggleFullscreen}
                title="Keluar Layar Penuh (Tekan Esc)"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 font-mono text-xs font-black transition-all cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Keluar Layar Penuh</span>
                <kbd className="hidden sm:inline bg-black text-white text-[10px] px-1 py-0.5 rounded font-mono">Esc</kbd>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Mode: Top Pinned Instructions Banner & Inside-Canvas Fullscreen Button */
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <div className="bg-white/95 backdrop-blur border-2 border-black px-3.5 py-2 rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-mono text-xs font-bold text-slate-900">
                {stage.desc}
              </span>
            </div>

            {/* Quick fullscreen trigger inside canvas */}
            <button
              onClick={toggleFullscreen}
              title="Perbesar ke Layar Penuh"
              className="pointer-events-auto p-2 bg-white hover:bg-orange-300 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-black flex items-center gap-1.5 font-mono text-xs font-bold"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Layar Penuh</span>
            </button>
          </div>
        )}

        {/* ── STAGES 1, 2, 3, 4, 7: Standard Target Box ────────────────── */}
        {stage.type !== "drag" && stage.type !== "scroll" && !isFinished && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (stage.type === "click" || stage.type === "moving") {
                setTotalClicks((prev) => prev + 1);
                handleTargetSuccess(e, "Klik Bagus!");
              } else if (stage.type === "contextmenu") {
                // Left-click on a right-click target counts as miss!
                setTotalClicks((prev) => prev + 1);
                setMissClicks((prev) => prev + 1);
                playTone("miss", isMuted);
                triggerHitEffect(targetPos.x + sizeConfig.width / 2, targetPos.y, "Gunakan Klik Kanan!");
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (stage.type === "contextmenu") {
                setTotalClicks((prev) => prev + 1);
                handleTargetSuccess(e, "Klik Kanan Tepat!");
              } else {
                // Right-click on left-click target counts as miss!
                setTotalClicks((prev) => prev + 1);
                setMissClicks((prev) => prev + 1);
                playTone("miss", isMuted);
                triggerHitEffect(targetPos.x + sizeConfig.width / 2, targetPos.y, "Meleset!");
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (stage.type === "dblclick") {
                setTotalClicks((prev) => prev + 2);
                handleTargetSuccess(e, "Double Click Hebat!");
              }
            }}
            onMouseEnter={handleTargetMouseEnter}
            onMouseLeave={handleTargetMouseLeave}
            style={{
              position: "absolute",
              left: `${targetPos.x}px`,
              top: `${targetPos.y}px`,
              width: `${sizeConfig.width}px`,
              height: `${sizeConfig.height}px`,
              transition: stage.type === "moving" ? "none" : "transform 0.1s ease-out",
            }}
            className={`flex flex-col items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] cursor-pointer select-none rounded-lg overflow-hidden ${stage.color} hover:brightness-105 group animate-in fade-in zoom-in-90 duration-150`}
          >
            {/* Hover progress bar inside box */}
            {stage.type === "hover" && (
              <div
                className="absolute bottom-0 left-0 top-0 bg-white/40 transition-all duration-75"
                style={{ width: `${hoverProgress}%` }}
              />
            )}

            <div className="relative z-10 flex items-center gap-1.5 text-center font-heading">
              <span className={sizeConfig.font}>{stage.textLabel}</span>
            </div>

            {stage.type === "hover" && (
              <span className="relative z-10 text-[9px] font-mono opacity-90">
                {hoverProgress > 0 ? `Menahan... ${hoverProgress}%` : "Tahan kursor disini"}
              </span>
            )}
          </div>
        )}

        {/* ── STAGE 5: Drag and Drop Interaction ────────────────── */}
        {stage.type === "drag" && !isFinished && (
          <>
            {/* Drop Zone (Target Folder) */}
            <div
              style={{
                position: "absolute",
                left: `${dropZonePos.x}px`,
                top: `${dropZonePos.y}px`,
                width: "140px",
                height: "120px",
              }}
              className="border-3 border-dashed border-emerald-700 bg-emerald-100/90 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] pointer-events-none select-none"
            >
              <FolderDown className="w-10 h-10 text-emerald-800 mb-1 animate-bounce" />
              <span className="font-heading font-black text-xs text-emerald-900">
                FOLDER SASARAN
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Lepas file di sini
              </span>
            </div>

            {/* Draggable File Item */}
            <div
              onMouseDown={handleDragStart}
              style={{
                position: "absolute",
                left: `${dragItemPos.x}px`,
                top: `${dragItemPos.y}px`,
                width: "84px",
                height: "84px",
                zIndex: isDragging ? 50 : 20,
              }}
              className={`bg-amber-300 border-3 border-black rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] cursor-grab active:cursor-grabbing hover:bg-amber-200 transition-shadow ${
                isDragging ? "scale-110 rotate-3 shadow-[8px_8px_0px_0px_#000]" : ""
              }`}
            >
              <FileCode className="w-7 h-7 text-black mb-0.5" />
              <span className="font-mono font-bold text-[10px] text-black leading-tight">
                Data.pdf
              </span>
              <span className="text-[8px] font-mono bg-black text-white px-1 rounded mt-0.5">
                SERET ME
              </span>
            </div>
          </>
        )}

        {/* ── STAGE 6: Scroll Wheel Playground (10 Sektor dengan Latihan Scroll Ke Atas & Ke Bawah) ── */}
        {stage.type === "scroll" && !isFinished && (
          <div
            ref={scrollContainerRef}
            onClick={handleAreaClick}
            onContextMenu={handleContextMenu}
            className="absolute inset-0 overflow-y-auto p-4 sm:p-6 space-y-16 scroll-smooth pt-20"
          >
            {/* Top Start Banner */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAreaClick(e);
              }}
              className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] max-w-lg mx-auto text-center space-y-2 select-none"
            >
              <Compass className="w-8 h-8 text-cyan-600 mx-auto animate-pulse" />
              <h3 className="font-heading font-black text-sm text-black">
                ⬆️ Ujung Paling Atas Halaman (Sektor #1 - #10)
              </h3>
              <p className="text-xs text-slate-600 font-mono">
                Putar roda mouse <strong>ke bawah (scroll down)</strong> atau <strong>ke atas (scroll up)</strong> untuk mencari Target #{currentTarget + 1} di 10 sektor ini!
              </p>
            </div>

            {/* 10 Distinct Scroll Landmark Sectors */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sectionNum) => {
              const isTargetHere = scrollTargetSection === sectionNum;
              return (
                <div
                  key={sectionNum}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAreaClick(e);
                  }}
                  className={`max-w-lg mx-auto py-8 px-5 border-2 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 relative transition-all ${
                    isTargetHere
                      ? "border-cyan-500 bg-cyan-50/90 shadow-[4px_4px_0px_0px_#06B6D4]"
                      : "border-dashed border-slate-300 bg-white/80 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-800 bg-amber-300 px-3 py-1 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
                      📍 Sektor #{sectionNum} dari 10
                    </span>
                    {isTargetHere && (
                      <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-200 px-2 py-0.5 rounded border border-cyan-400 animate-pulse">
                        Target Ditemukan!
                      </span>
                    )}
                  </div>

                  {isTargetHere ? (
                    <div className="py-3 animate-in zoom-in-95 duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTotalClicks((prev) => prev + 1);
                          handleTargetSuccess(e, `Sektor #${sectionNum} Sukses!`);
                        }}
                        className="px-6 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-heading font-black text-base border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer animate-bounce flex items-center gap-2"
                      >
                        <Target className="w-6 h-6" />
                        <span>🎯 KLIK TARGET #{currentTarget + 1} DI SEKTOR INI!</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 text-xs font-mono text-slate-400">
                      Target tidak berada di Sektor #{sectionNum}. Gulir roda mouse ke atas atau ke bawah...
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom End Banner */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleAreaClick(e);
              }}
              className="h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 font-mono text-xs max-w-lg mx-auto bg-slate-50 p-3 text-center space-y-1"
            >
              <span className="font-bold">⬇️ Ujung Paling Bawah Halaman</span>
              <span className="text-[11px] text-slate-400">Jika target belum ditemukan di sini, gulir roda mouse <strong>ke atas</strong> ⬆️</span>
            </div>
          </div>
        )}

        {/* Floating popups (+1, Tepat!, etc) */}
        {popups.map((popup) => (
          <div
            key={popup.id}
            style={{
              position: "absolute",
              left: `${popup.x}px`,
              top: `${popup.y}px`,
            }}
            className="pointer-events-none -translate-x-1/2 -translate-y-full z-50 animate-out fade-out slide-out-to-top duration-700"
          >
            <span
              className={`inline-block px-3 py-1 font-heading font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
                popup.text.includes("Meleset")
                  ? "bg-rose-500 text-white"
                  : "bg-amber-300 text-black"
              }`}
            >
              {popup.text}
            </span>
          </div>
        ))}

        {/* ── STAGE COMPLETED MODAL (Victory Dialog) ────────────────── */}
        {isFinished && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseVictory();
            }}
          >
            <div className="relative bg-white border-4 border-black shadow-[10px_10px_0px_0px_#000] rounded-2xl max-w-md w-full p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-200">
              {/* Close / Dismiss Button with Warning Confirmation */}
              <button
                type="button"
                onClick={handleCloseVictory}
                className="absolute top-3.5 right-3.5 w-8 h-8 bg-white hover:bg-rose-500 hover:text-white text-black border-2 border-black rounded-lg flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer z-10"
                title="Tutup & Reset Latihan"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Trophy Icon */}
              <div className="w-16 h-16 bg-amber-300 border-3 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000] -rotate-3">
                <Trophy className="w-9 h-9 text-black animate-bounce" />
              </div>

              {/* Title & Badge */}
              <div>
                <span className="bg-emerald-400 text-black font-mono text-xs font-black px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] uppercase inline-block mb-2">
                  🎉 Latihan Selesai!
                </span>
                <h2 className="font-heading font-black text-2xl text-black">
                  Selamat, Kamu Hebat!
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Kamu telah menyelesaikan <strong>{stage.name}</strong> dengan sangat baik.
                </p>
              </div>

              {/* Scorecard Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#FFFDF5] border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                <div className="p-2 bg-white border border-black rounded-lg">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Target</div>
                  <div className="font-heading font-black text-lg text-black">{currentTarget}</div>
                </div>
                <div className="p-2 bg-white border border-black rounded-lg">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Waktu</div>
                  <div className="font-heading font-black text-lg text-black font-mono">{formatTime(elapsedTime)}</div>
                </div>
                <div className="p-2 bg-white border border-black rounded-lg">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Akurasi</div>
                  <div className="font-heading font-black text-lg text-emerald-700">{accuracy}%</div>
                </div>
              </div>

              {/* Evaluation Message */}
              <div className="bg-amber-50 border-2 border-black p-3 rounded-lg text-left flex items-start gap-2.5 text-xs text-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-black block font-heading">
                    {accuracy >= 90
                      ? "🎯 Evaluasi: Sangat Mahir & Presisi!"
                      : accuracy >= 75
                      ? "👍 Evaluasi: Cukup Bagus & Lancar"
                      : "💡 Saran: Latih lagi kestabilan tangan"}
                  </strong>
                  <span className="text-slate-600 text-[11px]">
                    {accuracy >= 90
                      ? "Gerakan kursor dan ritme klik mouse kamu sudah sangat presisi, lincah, dan terkontrol!"
                      : "Pertahankan ketenangan saat mengklik dan jangan terburu-buru menyeret pointer."}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={() => resetGame()}
                  className="w-full sm:flex-1 py-3 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Tahap Ini</span>
                </button>

                {currentStageId < STAGES.length ? (
                  <button
                    onClick={() => resetGame(currentStageId + 1)}
                    className="w-full sm:flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Lanjut Tahap {currentStageId + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => resetGame(1)}
                    className="w-full sm:flex-1 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Mulai dari Tahap 1</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
