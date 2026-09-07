"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Keyboard,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Activity,
  Clock,
  Zap,
  Target,
  Maximize2,
  Minimize2,
  ArrowRight,
  Hand,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Star,
  Award,
  X
} from "lucide-react";
import SvgVirtualKeyboard from "./SvgVirtualKeyboard";
import Swal from "sweetalert2";
import { useSiswa } from "@/context/SiswaContext";

// Curriculum Lessons (Progressive Lessons from Home Row to Real Indonesian Words)
const LESSONS = [
  {
    id: 1,
    title: "Level 1: Jangkar F & J",
    desc: "Melatih kedua jari telunjuk pada tonjolan jangkar F dan J.",
    shortName: "1. F & J",
    text: "f j f j ff jj f f j j fj jf ff jj fjf jfj f j ff jj fj jf",
  },
  {
    id: 2,
    title: "Level 2: Home Row D & K",
    desc: "Melatih jari tengah kiri (D) dan jari tengah kanan (K).",
    shortName: "2. D & K",
    text: "d k d k f d j k dk kd fd jk fjdk dkf jkd d k dd kk dk kd",
  },
  {
    id: 3,
    title: "Level 3: Home Row S & L",
    desc: "Melatih jari manis kiri (S) dan jari manis kanan (L).",
    shortName: "3. S & L",
    text: "s l s l a s l k sl ls as lk fals slad laks s l ss ll sl ls",
  },
  {
    id: 4,
    title: "Level 4: Home Row Lengkap (ASDF JKL;)",
    desc: "Menggabungkan seluruh baris beranda dari A sampai titik koma (;).",
    shortName: "4. Home Row",
    text: "a s d f j k l ; asdf jkl; a; sl dk fj flask salad fall jakal",
  },
  {
    id: 5,
    title: "Level 5: Baris Atas E & I",
    desc: "Menjangkau baris atas dengan jari tengah kiri (E) dan kanan (I).",
    shortName: "5. E & I",
    text: "e i e i de ki fe ji ed ik feed die kid life like idea file",
  },
  {
    id: 6,
    title: "Level 6: Baris Atas R & U",
    desc: "Menjangkau baris atas dengan jari telunjuk kiri (R) dan kanan (U).",
    shortName: "6. R & U",
    text: "r u r u fr ju er iu rude true fire surf rule user fur sure",
  },
  {
    id: 7,
    title: "Level 7: Baris Atas T, Y, O, P",
    desc: "Melengkapi penguasaan seluruh baris atas keyboard.",
    shortName: "7. T Y O P",
    text: "t y o p ft jy lo ;p type post port your open play poet toy",
  },
  {
    id: 8,
    title: "Level 8: Baris Bawah V, M, C, Komma",
    desc: "Menjangkau baris bawah keyboard dengan jari telunjuk dan tengah.",
    shortName: "8. Baris Bawah",
    text: "v m c , fv jm dc k, view move calm live come mica voice",
  },
  {
    id: 9,
    title: "Level 9: Kata Bahasa Indonesia",
    desc: "Latihan mengetik kata-kata bahasa Indonesia yang sering digunakan.",
    shortName: "9. Kata Nyata",
    text: "ini adalah latihan mengetik sepuluh jari agar semakin mahir dan lincah mengoperasikan komputer di kelas kursus",
  },
  {
    id: 10,
    title: "Level 10: Tantangan Kecepatan & Kalimat",
    desc: "Uji kecepatan WPM dan akurasi dengan kalimat lengkap.",
    shortName: "10. Uji WPM",
    text: "belajar komputer dengan metode praktis dan menyenangkan membuat kita lebih percaya diri dalam dunia digital dan teknologi masa depan",
  },
];

// Color palette for 10 fingers
const FINGER_COLORS = {
  leftPinky: { bg: "bg-rose-400", text: "text-rose-950", border: "border-rose-600", name: "Kelingking Kiri" },
  leftRing: { bg: "bg-orange-400", text: "text-orange-950", border: "border-orange-600", name: "Jari Manis Kiri" },
  leftMiddle: { bg: "bg-amber-300", text: "text-amber-950", border: "border-amber-500", name: "Jari Tengah Kiri" },
  leftIndex: { bg: "bg-emerald-400", text: "text-emerald-950", border: "border-emerald-600", name: "Jari Telunjuk Kiri" },
  thumb: { bg: "bg-cyan-300", text: "text-cyan-950", border: "border-cyan-500", name: "Ibu Jari (Spasi)" },
  rightIndex: { bg: "bg-cyan-400", text: "text-cyan-950", border: "border-cyan-600", name: "Jari Telunjuk Kanan" },
  rightMiddle: { bg: "bg-blue-400", text: "text-blue-950", border: "border-blue-600", name: "Jari Tengah Kanan" },
  rightRing: { bg: "bg-indigo-400", text: "text-indigo-950", border: "border-indigo-600", name: "Jari Manis Kanan" },
  rightPinky: { bg: "bg-purple-400", text: "text-purple-950", border: "border-purple-600", name: "Kelingking Kanan" },
};

// Finger assignment mapping for each character/key
function getFingerForKey(char) {
  if (!char) return null;
  const c = char.toLowerCase();

  if (c === " ") return "thumb";
  if (["1", "q", "a", "z", "tab", "capslock", "shiftleft"].includes(c)) return "leftPinky";
  if (["2", "w", "s", "x"].includes(c)) return "leftRing";
  if (["3", "e", "d", "c"].includes(c)) return "leftMiddle";
  if (["4", "5", "r", "t", "f", "g", "v", "b"].includes(c)) return "leftIndex";

  if (["6", "7", "y", "u", "h", "j", "n", "m"].includes(c)) return "rightIndex";
  if (["8", "i", "k", ","].includes(c)) return "rightMiddle";
  if (["9", "o", "l", "."].includes(c)) return "rightRing";
  if (["0", "-", "=", "p", "[", "]", ";", "'", "/", "enter", "backspace", "shiftright"].includes(c)) return "rightPinky";

  return "thumb";
}

// Full QWERTY Virtual Keyboard Layout Rows
const KEYBOARD_ROWS = [
  [
    { key: "`", shift: "~", finger: "leftPinky", width: "w-10 sm:w-12" },
    { key: "1", shift: "!", finger: "leftPinky", width: "w-10 sm:w-12" },
    { key: "2", shift: "@", finger: "leftRing", width: "w-10 sm:w-12" },
    { key: "3", shift: "#", finger: "leftMiddle", width: "w-10 sm:w-12" },
    { key: "4", shift: "$", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "5", shift: "%", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "6", shift: "^", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: "7", shift: "&", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: "8", shift: "*", finger: "rightMiddle", width: "w-10 sm:w-12" },
    { key: "9", shift: "(", finger: "rightRing", width: "w-10 sm:w-12" },
    { key: "0", shift: ")", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "-", shift: "_", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "=", shift: "+", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "Backspace", label: "⌫", finger: "rightPinky", width: "w-16 sm:w-20" },
  ],
  [
    { key: "Tab", label: "Tab ⇥", finger: "leftPinky", width: "w-14 sm:w-16" },
    { key: "q", label: "Q", finger: "leftPinky", width: "w-10 sm:w-12" },
    { key: "w", label: "W", finger: "leftRing", width: "w-10 sm:w-12" },
    { key: "e", label: "E", finger: "leftMiddle", width: "w-10 sm:w-12" },
    { key: "r", label: "R", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "t", label: "T", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "y", label: "Y", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: "u", label: "U", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: "i", label: "I", finger: "rightMiddle", width: "w-10 sm:w-12" },
    { key: "o", label: "O", finger: "rightRing", width: "w-10 sm:w-12" },
    { key: "p", label: "P", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "[", shift: "{", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "]", shift: "}", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "\\", shift: "|", finger: "rightPinky", width: "w-12 sm:w-14" },
  ],
  [
    { key: "Caps", label: "Caps 🔒", finger: "leftPinky", width: "w-16 sm:w-20" },
    { key: "a", label: "A", finger: "leftPinky", width: "w-10 sm:w-12" },
    { key: "s", label: "S", finger: "leftRing", width: "w-10 sm:w-12" },
    { key: "d", label: "D", finger: "leftMiddle", width: "w-10 sm:w-12" },
    { key: "f", label: "F", finger: "leftIndex", bump: true, width: "w-10 sm:w-12" },
    { key: "g", label: "G", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "h", label: "H", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: "j", label: "J", finger: "rightIndex", bump: true, width: "w-10 sm:w-12" },
    { key: "k", label: "K", finger: "rightMiddle", width: "w-10 sm:w-12" },
    { key: "l", label: "L", finger: "rightRing", width: "w-10 sm:w-12" },
    { key: ";", shift: ":", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "'", shift: '"', finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "Enter", label: "Enter ↵", finger: "rightPinky", width: "w-16 sm:w-20" },
  ],
  [
    { key: "ShiftLeft", label: "Shift ⇧", finger: "leftPinky", width: "w-20 sm:w-24" },
    { key: "z", label: "Z", finger: "leftPinky", width: "w-10 sm:w-12" },
    { key: "x", label: "X", finger: "leftRing", width: "w-10 sm:w-12" },
    { key: "c", label: "C", finger: "leftMiddle", width: "w-10 sm:w-12" },
    { key: "v", label: "V", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "b", label: "B", finger: "leftIndex", width: "w-10 sm:w-12" },
    { key: "n", label: "N", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: "m", label: "M", finger: "rightIndex", width: "w-10 sm:w-12" },
    { key: ",", shift: "<", finger: "rightMiddle", width: "w-10 sm:w-12" },
    { key: ".", shift: ">", finger: "rightRing", width: "w-10 sm:w-12" },
    { key: "/", shift: "?", finger: "rightPinky", width: "w-10 sm:w-12" },
    { key: "ShiftRight", label: "Shift ⇧", finger: "rightPinky", width: "w-20 sm:w-24" },
  ],
  [
    { key: "Space", label: "SPACE BAR", finger: "thumb", width: "w-64 sm:w-96" },
  ],
];

// Web Audio API Synthesizer for typing feedback
function playTypingSound(type, isMuted) {
  if (isMuted || typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "space") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "victory") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
  } catch (e) {}
}

// Mapping active character to authentic TypingClub Hand SVG Assets in public/tangan/
function getHandSvgPath(char) {
  if (!char) return "/tangan/kanan/telunjuk_j.svg";
  const c = char.toLowerCase();

  // Left Hand
  if (c === "1") return "/tangan/kiri/kelingking_1.svg";
  if (c === "q") return "/tangan/kiri/kelingking_q.svg";
  if (c === "a") return "/tangan/kiri/kelingking_a.svg";
  if (c === "z") return "/tangan/kiri/kelingking_z.svg";

  if (c === "2") return "/tangan/kiri/manis_2.svg";
  if (c === "w") return "/tangan/kiri/manis_w.svg";
  if (c === "s") return "/tangan/kiri/manis_s.svg";
  if (c === "x") return "/tangan/kiri/manis_x.svg";

  if (c === "3") return "/tangan/kiri/tengah_3.svg";
  if (c === "e") return "/tangan/kiri/tengah_e.svg";
  if (c === "d") return "/tangan/kiri/tengah_d.svg";
  if (c === "c") return "/tangan/kiri/tengah_c.svg";

  if (c === "4") return "/tangan/kiri/telunjuk_4.svg";
  if (c === "5") return "/tangan/kiri/telunjuk_5.svg";
  if (c === "r") return "/tangan/kiri/telunjuk_r.svg";
  if (c === "t") return "/tangan/kiri/telunjuk_t.svg";
  if (c === "f") return "/tangan/kiri/telunjuk_f.svg";
  if (c === "g") return "/tangan/kiri/telunjuk_g.svg";
  if (c === "v") return "/tangan/kiri/telunjuk_v.svg";
  if (c === "b") return "/tangan/kiri/telunjuk_b.svg";

  // Thumbs
  if (c === " " || c === "space") return "/tangan/kanan/jempol_spasi.svg";

  // Right Hand
  if (c === "6") return "/tangan/kanan/telunjuk_6.svg";
  if (c === "7") return "/tangan/kanan/telunjuk_7.svg";
  if (c === "y") return "/tangan/kanan/telunjuk_y.svg";
  if (c === "u") return "/tangan/kanan/telunjuk_u.svg";
  if (c === "h") return "/tangan/kanan/telunjuk_h.svg";
  if (c === "j") return "/tangan/kanan/telunjuk_j.svg";
  if (c === "n") return "/tangan/kanan/telunjuk_n.svg";
  if (c === "m") return "/tangan/kanan/telunjuk_m.svg";

  if (c === "8") return "/tangan/kanan/tengah_8.svg";
  if (c === "i") return "/tangan/kanan/tengah_i.svg";
  if (c === "k") return "/tangan/kanan/tengah_k.svg";
  if (c === ",") return "/tangan/kanan/tengah_comma.svg";

  if (c === "9") return "/tangan/kanan/manis_9.svg";
  if (c === "o") return "/tangan/kanan/manis_o.svg";
  if (c === "l") return "/tangan/kanan/manis_l.svg";
  if (c === ".") return "/tangan/kanan/manis_titik.svg";

  if (c === "0") return "/tangan/kanan/kelingking_0.svg";
  if (c === "-") return "/tangan/kanan/kelingking_-.svg";
  if (c === "=") return "/tangan/kanan/kelingking_=.svg";
  if (c === "p") return "/tangan/kanan/kelingking_p.svg";
  if (c === "[") return "/tangan/kanan/kelingking_[.svg";
  if (c === "]") return "/tangan/kanan/kelingking_].svg";
  if (c === ";") return "/tangan/kanan/kelingking_semicolon.svg";
  if (c === "'") return "/tangan/kanan/kelingking_petiksatu.svg";
  if (c === "/") return "/tangan/kanan/kelingking_garismiring.svg";
  if (c === "enter" || c === "\n") return "/tangan/kanan/kelingking_enter.svg";

  // Shift & specials
  if (["!", "@", "#", "$", "%"].includes(char)) return "/tangan/kombinasi/shift kanan/telunjuk_$.svg";
  if (["^", "&", "*", "(", ")", "_", "+", "{", "}", ":", '"', "<", ">", "?"].includes(char)) return "/tangan/kombinasi/shift kiri/kelingking_+.svg";

  // Fallbacks
  if (["tab", "capslock", "shift", "`", "~"].includes(c)) return "/tangan/kiri/kelingking_a.svg";
  if (["\\", "|"].includes(c)) return "/tangan/kanan/kelingking_semicolon.svg";

  return "/tangan/kanan/telunjuk_j.svg";
}

export default function TypingTrainerGame() {
  const siswaCtx = useSiswa();
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHands, setShowHands] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // Statistics
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasErrorOnCurrentChar, setHasErrorOnCurrentChar] = useState(false);
  const [awardedXpInfo, setAwardedXpInfo] = useState(null);

  // Floating effects
  const [popups, setPopups] = useState([]);

  // Refs
  const timerIntervalRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const promptContainerRef = useRef(null);

  const lesson = LESSONS.find((l) => l.id === currentLevelId) || LESSONS[0];
  const targetText = lesson.text;
  const currentChar = targetText[currentIndex] || "";
  const activeFinger = getFingerForKey(currentChar);
  const activeFingerInfo = FINGER_COLORS[activeFinger] || FINGER_COLORS.thumb;

  // Split targetText into lines of characters (each line ~ chars that fit in one visual row)
  // We tokenize words + their following space so that 100% of characters (and spaces) keep their exact index in targetText.
  const CHARS_PER_LINE = 32;
  const textLines = useMemo(() => {
    const tokens = [];
    let currentToken = [];

    for (let i = 0; i < targetText.length; i++) {
      const char = targetText[i];
      const isSpace = char === " ";
      currentToken.push({ char, index: i, isSpace });

      if (isSpace || i === targetText.length - 1) {
        tokens.push(currentToken);
        currentToken = [];
      }
    }

    const lines = [];
    let currentLine = [];
    let currentLen = 0;

    tokens.forEach((token) => {
      // If adding this token exceeds CHARS_PER_LINE and line is not empty, wrap to next line
      if (currentLine.length > 0 && currentLen + token.length > CHARS_PER_LINE) {
        lines.push(currentLine);
        currentLine = [];
        currentLen = 0;
      }
      currentLine.push(...token);
      currentLen += token.length;
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }, [targetText]);

  // Which line index contains the current active character?
  const activeLineIndex = useMemo(() => {
    for (let li = 0; li < textLines.length; li++) {
      if (textLines[li].some((c) => c.index === currentIndex)) return li;
    }
    return 0;
  }, [textLines, currentIndex]);

  // Focus input automatically
  const focusInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Reset Lesson
  const resetLesson = useCallback((newLevelId = null) => {
    const lId = newLevelId !== null ? newLevelId : currentLevelId;
    setCurrentLevelId(lId);
    setCurrentIndex(0);
    setUserInput("");
    setCorrectCount(0);
    setErrorCount(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsFinished(false);
    setHasErrorOnCurrentChar(false);
    setAwardedXpInfo(null);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeout(() => {
      focusInput();
    }, 50);
  }, [currentLevelId]);

  // Handle closing victory modal with confirmation
  const handleCloseVictory = async () => {
    const res = await Swal.fire({
      title: "Tutup & Reset Latihan?",
      text: "Jika kamu menutup jendela skor ini, latihan level ini akan direset kembali dari awal.",
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
      resetLesson(currentLevelId);
    }
  };

  // Fullscreen toggle with real browser F11 Fullscreen API
  const toggleFullscreen = async () => {
    try {
      const isCurrentlyFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isCurrentlyFs && !isFullscreen) {
        // Request true browser fullscreen (mirip pencet F11)
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit true browser fullscreen
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            await document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            await document.msExitFullscreen();
          }
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      // Fallback if browser policy restricts fullscreen API
      setIsFullscreen((prev) => !prev);
    }
    setTimeout(() => {
      focusInput();
    }, 100);
  };

  // Sync state if user presses F11 or Esc natively in browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isNowFs);
      setTimeout(() => {
        focusInput();
      }, 50);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Listen to Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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

  // Trigger floating popup animation
  const triggerPopup = (text = "+1", isError = false) => {
    const id = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id, text, isError }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  };

  // Physical Keydown Event Handler
  const handleKeyDown = useCallback((e) => {
    if (isFinished) return;

    // If modal dialog is open (SweetAlert) or user is in another input/textarea, ignore
    if (typeof document !== "undefined") {
      if (document.querySelector(".swal2-container")) return;
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") &&
        activeEl !== hiddenInputRef.current
      ) {
        return;
      }
    }

    // Ignore modifier standalone keys
    if (["Alt", "Control", "Meta", "Tab", "CapsLock"].includes(e.key)) {
      if (e.key === "Tab") e.preventDefault();
      return;
    }

    const key = e.key;
    const code = e.code ? e.code.toLowerCase() : "";
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.add(key.toLowerCase());
      if (code) next.add(code);
      return next;
    });

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Handle Backspace
    if (key === "Backspace") {
      e.preventDefault();
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setUserInput((prev) => {
          const removed = prev.slice(-1);
          const expectedAtRemoved = targetText[currentIndex - 1];
          if (removed === expectedAtRemoved) {
            setCorrectCount((c) => Math.max(0, c - 1));
          }
          return prev.slice(0, -1);
        });
        setHasErrorOnCurrentChar(false);
      }
      return;
    }

    // Single character validation
    if (key.length === 1) {
      e.preventDefault();
      const expectedChar = targetText[currentIndex];

      if (key === expectedChar) {
        // Correct press
        playTypingSound(key === " " ? "space" : "click", isMuted);
        setCorrectCount((prev) => prev + 1);
        setUserInput((prev) => prev + key);
        setHasErrorOnCurrentChar(false);

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Check completion
        if (nextIndex >= targetText.length) {
          setIsFinished(true);
          playTypingSound("victory", isMuted);
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch (err) {}

          // Award XP to student if logged in
          if (siswaCtx?.awardXp) {
            const baseXP = 25;
            const finalTotal = (correctCount + 1) + errorCount;
            const finalAcc = finalTotal > 0 ? Math.min(100, Math.round(((correctCount + 1) / finalTotal) * 100)) : 100;
            const bonusXP = finalAcc >= 95 ? 15 : finalAcc >= 90 ? 10 : 0;
            const totalXp = baseXP + bonusXP;
            const reason = `Praktik Mengetik 10 Jari: ${lesson.shortName} (${finalAcc}% Akurasi)`;
            const res = siswaCtx.awardXp(totalXp, reason);
            setAwardedXpInfo({
              xp: totalXp,
              bonus: bonusXP,
              levelInfo: res?.levelInfo,
            });
          }
        }
      } else {
        // Error press
        playTypingSound("error", isMuted);
        setErrorCount((prev) => prev + 1);
        setHasErrorOnCurrentChar(true);
        triggerPopup("Salah!", true);
      }
    }
  }, [currentIndex, isFinished, isMuted, startTime, targetText, correctCount, errorCount, lesson.shortName, siswaCtx]);

  // Physical Keyup Event Handler
  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();
    const code = e.code ? e.code.toLowerCase() : "";
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      if (code) next.delete(code);
      return next;
    });
  }, []);

  // Global listener for key events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Realtime Statistics Calculations
  const totalTyped = correctCount + errorCount;
  const minutes = Math.max(elapsedTime / 60, 0.05);
  const wordsTyped = correctCount / 5;
  const wpm = startTime ? Math.round(wordsTyped / minutes) : 0;
  const accuracy = totalTyped > 0 ? Math.min(100, Math.round((correctCount / totalTyped) * 100)) : 100;
  const progressPct = Math.min(100, Math.round((currentIndex / targetText.length) * 100));

  // Format Elapsed Time
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  // Star rating calculation based on accuracy and WPM
  const calculateStars = () => {
    if (accuracy >= 98 && wpm >= 35) return 5;
    if (accuracy >= 95 && wpm >= 25) return 4;
    if (accuracy >= 90 && wpm >= 18) return 3;
    if (accuracy >= 80) return 2;
    return 1;
  };

  return (
    <div
      onClick={focusInput}
      className={`flex flex-col transition-all select-none ${
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-[#FFFDF5] p-1.5 sm:p-2.5 overflow-hidden flex flex-col"
          : "w-full"
      }`}
    >
      {/* Hidden input to ensure mobile/tablet & focus capture */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute pointer-events-none"
        autoFocus
      />

      {/* ── TOP CONTROL PANEL (Hanya tampil saat mode normal) ── */}
      {!isFullscreen && (
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl p-3.5 sm:p-4 mb-3 sm:mb-4">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-2 border-black pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-cyan-400 border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000] font-black text-black">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-black text-base sm:text-lg text-black">
                    {lesson.title}
                  </h1>
                  <span className="bg-black text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                    Touch Typing 10 Jari
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-mono font-medium mt-0.5">
                  {lesson.desc}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHands(!showHands);
                }}
                title={showHands ? "Sembunyikan Panduan Tangan" : "Tampilkan Panduan Tangan"}
                className={`p-1.5 sm:p-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer ${
                  showHands ? "bg-amber-300 text-black" : "bg-white text-slate-600"
                }`}
              >
                <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
                className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer text-slate-800"
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetLesson();
                }}
                title="Ulangi Level Ini"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-amber-300 hover:bg-amber-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Realtime Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {/* WPM Speed */}
            <div className="bg-cyan-50 border-2 border-black p-2 sm:p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-cyan-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase">Kecepatan</div>
                <div className="font-heading font-black text-sm sm:text-base text-black font-mono">
                  {wpm} <span className="text-[10px] sm:text-xs text-slate-500 font-mono">WPM</span>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-emerald-50 border-2 border-black p-2 sm:p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-emerald-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase">Akurasi</div>
                <div className="font-heading font-black text-sm sm:text-base text-emerald-800">
                  {accuracy}%
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-amber-50 border-2 border-black p-2 sm:p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-amber-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase">Progres</div>
                <div className="font-heading font-black text-sm sm:text-base text-black font-mono">
                  {progressPct}% <span className="text-[10px] sm:text-xs text-slate-500 font-mono">({currentIndex}/{targetText.length})</span>
                </div>
              </div>
            </div>

            {/* Errors */}
            <div className="bg-rose-50 border-2 border-black p-2 sm:p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-rose-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase">Kesalahan</div>
                <div className="font-heading font-black text-sm sm:text-base text-rose-700">
                  {errorCount} <span className="text-[10px] sm:text-xs text-slate-500 font-mono">huruf</span>
                </div>
              </div>
            </div>

            {/* Time Elapsed */}
            <div className="hidden lg:flex bg-purple-50 border-2 border-black p-2 sm:p-2.5 rounded-lg shadow-[2px_2px_0px_0px_#000] items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-purple-300 border-2 border-black flex items-center justify-center font-bold text-black shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase">Waktu</div>
                <div className="font-heading font-black text-sm sm:text-base text-purple-900 font-mono">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Level Selector Pills */}
          <div className="mt-3 pt-2.5 border-t border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono font-bold scrollbar-thin">
              <span className="text-slate-500 mr-1 shrink-0 text-[11px]">Pilih Level:</span>
              {LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    resetLesson(l.id);
                  }}
                  className={`px-2.5 py-1 rounded-md border-2 border-black shrink-0 transition-all cursor-pointer font-bold text-xs ${
                    currentLevelId === l.id
                      ? "bg-black text-white shadow-[2px_2px_0px_0px_#FF6B00] scale-105"
                      : "bg-white text-slate-800 hover:bg-amber-100 shadow-[1px_1px_0px_0px_#000]"
                  }`}
                >
                  {l.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Bar: Fullscreen Toggle */}
          <div className="mt-2.5 flex items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 font-bold text-[11px]">
              <span>💡 Panduan: Letakkan jari di baris beranda (ASDF - JKL;) dan tatap layar</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title="Aktifkan Mode Layar Penuh"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Layar Penuh</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN INTERACTIVE TYPING ARENA ────────────────── */}
      <div
        className={`relative w-full bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl flex flex-col transition-all ${
          isFullscreen ? "flex-1 w-full h-full max-h-full p-2 sm:p-3.5 overflow-hidden" : "p-3 sm:p-5"
        }`}
      >
        {/* Fullscreen Floating Top HUD */}
        {isFullscreen && (
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b-2 border-black mb-1 sm:mb-2 shrink-0">
            <div className="bg-white border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
              <span className="font-heading font-black text-xs text-black truncate max-w-[180px] sm:max-w-none">
                {lesson.title}
              </span>
            </div>

            <div className="bg-black text-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 sm:gap-3 font-mono text-xs font-bold">
              <div className="flex items-center gap-1 text-cyan-300">
                <Zap className="w-3.5 h-3.5" />
                <span>{wpm} WPM</span>
              </div>
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1 text-emerald-300">
                <Activity className="w-3.5 h-3.5" />
                <span>{accuracy}%</span>
              </div>
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1 text-amber-300">
                <Target className="w-3.5 h-3.5" />
                <span>{progressPct}%</span>
              </div>
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1 text-rose-300">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Salah: {errorCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHands(!showHands);
                }}
                className={`p-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                  showHands ? "bg-amber-300 text-black" : "bg-white text-slate-700"
                }`}
                title={showHands ? "Sembunyikan Panduan Tangan" : "Tampilkan Panduan Tangan"}
              >
                <Hand className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer text-slate-800"
                title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetLesson();
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-300 hover:bg-amber-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black cursor-pointer"
                title="Ulangi Level Ini"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black cursor-pointer"
                title="Keluar Layar Penuh"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar</span>
                <kbd className="hidden sm:inline bg-black text-white text-[10px] px-1 rounded font-mono">Esc</kbd>
              </button>
            </div>
          </div>
        )}

        {/* ── CENTERED CORE PLAY AREA (Canvas + Keyboard) ── */}
        <div
          className={`w-full flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4 ${
            isFullscreen ? "flex-1 min-h-0 overflow-y-auto my-auto" : "my-1"
          }`}
        >
          {/* ── LIVE TEXT PROMPT DISPLAY CANVAS (3-Row Centered, TypingClub Style) ── */}
          <div
            className={`w-full max-w-3xl lg:max-w-4xl bg-[#FFFDF5] bg-retro-dots border-3 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl relative overflow-hidden flex flex-col shrink-0 ${
              isFullscreen ? "shadow-[5px_5px_0px_0px_#000]" : ""
            }`}
          >
            {/* Top Status & Finger Guidance Header */}
            <div className="w-full bg-white/95 backdrop-blur-xs border-b-2 border-black px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-1.5 z-10 select-none">
              <div className="flex items-center gap-2">
                <span className="bg-amber-300 text-black font-mono text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] uppercase">
                  Petunjuk Ketik
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <span className="text-slate-500 text-xs hidden sm:inline">Tekan:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md border-2 border-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] transition-colors ${
                      currentChar === " " ? "bg-cyan-300 text-black" : "bg-cyan-400 text-black"
                    }`}
                  >
                    {currentChar === " " ? "␣ SPASI (Spacebar)" : currentChar}
                  </span>
                </div>
              </div>

              {/* Finger Helper Badge */}
              {activeFingerInfo && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 font-bold hidden sm:inline">Jari:</span>
                  <span
                    className={`font-mono text-xs sm:text-sm font-black px-3 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 ${activeFingerInfo.bg} ${activeFingerInfo.text}`}
                  >
                    <span>🖐️</span>
                    <span>{activeFingerInfo.name}</span>
                  </span>
                </div>
              )}
            </div>

            {/* 3-Row Centered Typing Canvas */}
            <div
              ref={promptContainerRef}
              className={`w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 select-none relative overflow-x-auto scrollbar-none ${
                isFullscreen
                  ? "py-3 sm:py-4 md:py-5 min-h-[140px] sm:min-h-[160px] md:min-h-[180px]"
                  : "py-3 sm:py-4 min-h-[120px] sm:min-h-[150px]"
              }`}
            >
              {/* Render exactly 3 rows: [activeLineIndex-1], [activeLineIndex], [activeLineIndex+1] */}
              {[-1, 0, 1].map((offset) => {
                const lineIndex = activeLineIndex + offset;
                const lineChars = textLines[lineIndex];
                const isActiveLine = offset === 0;

                // Placeholder to maintain 3-row height even if line doesn't exist
                if (!lineChars) {
                  return (
                    <div
                      key={`placeholder-${offset}`}
                      className="h-[1.6rem] sm:h-[2.2rem] md:h-[2.6rem] w-full"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <div
                    key={lineIndex}
                    className={`flex items-center justify-center gap-0 flex-nowrap transition-all duration-300 max-w-full ${
                      isActiveLine
                        ? "opacity-100"
                        : "opacity-35 scale-95 pointer-events-none"
                    }`}
                  >
                    {lineChars.map(({ char, index, isSpace }) => {
                      const isTyped = index < currentIndex;
                      const isCurrent = isActiveLine && index === currentIndex;

                      // Characters in non-active lines don't show per-char state (dimmed preview/history)
                      if (!isActiveLine) {
                        if (isSpace) {
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center justify-center font-mono text-slate-300 px-[1px] sm:px-[2px] text-sm sm:text-base md:text-xl lg:text-2xl w-[0.6em] select-none"
                            >
                              ·
                            </span>
                          );
                        }
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center justify-center font-mono font-bold tracking-normal sm:tracking-wider text-slate-400 px-[1px] sm:px-[2px] text-sm sm:text-base md:text-xl lg:text-2xl"
                          >
                            {char}
                          </span>
                        );
                      }

                      // Active line: full coloring with enhanced prominent cursor
                      let charClasses = "text-slate-400 border-2 border-transparent";
                      if (isTyped) {
                        charClasses = "text-emerald-800 bg-emerald-100 border-2 border-emerald-300";
                      } else if (isCurrent) {
                        charClasses = hasErrorOnCurrentChar
                          ? "bg-rose-500 text-white font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] scale-110 -translate-y-0.5 animate-pulse"
                          : "bg-cyan-300 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] scale-110 -translate-y-0.5 ring-2 ring-cyan-400/60";
                      }

                      if (isSpace && isCurrent) {
                        return (
                          <span
                            key={index}
                            className={`inline-flex items-center justify-center h-[1.4em] min-w-[1.4em] sm:min-w-[1.8em] px-1.5 mx-0.5 font-mono text-lg sm:text-2xl md:text-3xl lg:text-[2.25rem] font-black leading-none whitespace-nowrap select-none rounded-md border-2 border-black shadow-[3px_3px_0px_0px_#000] scale-110 -translate-y-0.5 transition-all duration-75 ${
                              hasErrorOnCurrentChar
                                ? "bg-rose-500 text-white animate-pulse"
                                : "bg-cyan-300 text-black ring-2 ring-cyan-400/60"
                            }`}
                            title="Tekan Spasi (Spacebar)"
                          >
                            ␣
                          </span>
                        );
                      }

                      if (isSpace) {
                        return (
                          <span
                            key={index}
                            className={`inline-flex items-center justify-center h-[1.4em] min-w-[0.65em] sm:min-w-[0.8em] font-mono text-base sm:text-xl md:text-2xl text-center select-none ${
                              isTyped ? "text-emerald-500 font-bold" : "text-slate-300 font-medium"
                            }`}
                          >
                            ·
                          </span>
                        );
                      }

                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center justify-center font-mono font-bold tracking-normal sm:tracking-wider h-[1.4em] min-w-[0.7em] sm:min-w-[0.8em] px-[1.5px] sm:px-[3px] rounded-md transition-all duration-75 text-lg sm:text-2xl md:text-3xl lg:text-[2.25rem] ${charClasses}`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                );
              })}

              {/* Floating popups */}
              {popups.map((p) => (
                <div
                  key={p.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-out fade-out slide-out-to-top duration-700"
                >
                  <span className="px-3 py-1 font-heading font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-rose-500 text-white">
                    {p.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Mini Progress Track */}
            <div className="w-full bg-slate-200/80 h-1.5 border-t border-black/10 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-150"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ── VECTOR ANSI VIRTUAL KEYBOARD WITH SVG PATHS & INTEGRATED VECTOR HAND OVERLAY ── */}
          {showKeyboard && (
            <div
              className={`relative mx-auto w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] select-none flex items-center justify-center shrink-0 ${
                isFullscreen
                  ? "max-w-[580px] sm:max-w-[660px] md:max-w-[720px] lg:max-w-[760px] p-2 sm:p-3"
                  : "max-w-2xl lg:max-w-3xl p-3 sm:p-4"
              }`}
            >
              {/* SVG Vector Keyboard with Locked 1:1 Hand Vector Layer */}
              <div className="relative z-10 w-full">
                <SvgVirtualKeyboard
                  currentChar={currentChar}
                  pressedKeys={pressedKeys}
                  hasError={hasErrorOnCurrentChar}
                  colorByFinger={false}
                  showHands={showHands}
                  handSvgPath={getHandSvgPath(currentChar)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── VICTORY & SCORECARD MODAL ── */}
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

              {/* Trophy & Stars */}
              <div className="space-y-2">
                <div className="w-16 h-16 bg-amber-300 border-3 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000] -rotate-3">
                  <Trophy className="w-9 h-9 text-black animate-bounce" />
                </div>
                {/* 5-Star Rating */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= calculateStars()
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Badge */}
              <div>
                <span className="bg-emerald-400 text-black font-mono text-xs font-black px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] uppercase inline-block mb-1.5">
                  🎉 Level Selesai!
                </span>
                <h2 className="font-heading font-black text-2xl text-black">
                  Luar Biasa, Jari Anda Cepat!
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Anda telah menyelesaikan <strong>{lesson.title}</strong>
                </p>
              </div>

              {/* Scorecard Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#FFFDF5] border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                <div className="p-2 bg-white border border-black rounded-lg">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Kecepatan</div>
                  <div className="font-heading font-black text-lg text-black font-mono">{wpm} WPM</div>
                </div>
                <div className="p-2 bg-white border border-black rounded-lg">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Akurasi</div>
                  <div className="font-heading font-black text-lg text-emerald-700 font-mono">{accuracy}%</div>
                </div>
                <div className="p-2 bg-white border border-black rounded-lg">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Waktu</div>
                  <div className="font-heading font-black text-lg text-black font-mono">{formatTime(elapsedTime)}</div>
                </div>
              </div>

              {/* XP Awarded info for Siswa */}
              {awardedXpInfo && (
                <div className="bg-amber-100 border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_#000] flex items-center justify-between text-xs font-mono font-bold">
                  <div className="flex items-center gap-2 text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Hadiah Siswa:</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-black font-black">
                    <span className="bg-amber-400 border border-black px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_#000] font-heading text-xs">
                      +{awardedXpInfo.xp} XP
                    </span>
                    {awardedXpInfo.bonus > 0 && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-200 border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                        ⭐ Bonus Akurasi!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={() => resetLesson()}
                  className="w-full sm:flex-1 py-3 bg-white hover:bg-slate-100 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Level Ini</span>
                </button>

                {currentLevelId < LESSONS.length ? (
                  <button
                    onClick={() => resetLesson(currentLevelId + 1)}
                    className="w-full sm:flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Lanjut Level {currentLevelId + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => resetLesson(1)}
                    className="w-full sm:flex-1 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Mulai dari Level 1</span>
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
