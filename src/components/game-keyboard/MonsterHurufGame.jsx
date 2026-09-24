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
  Delete as DeleteIcon,
  ArrowLeft,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { monsterAudio } from '@/lib/monsterAudio';

// ─── KONFIGURASI 5 MISI BABAK (TOTAL ~4.5 - 5 MENIT) ───────────────────
const MISSIONS_CONFIG = [
  {
    mission: 1,
    title: 'Babak 1: Taman Pemula (Serbuan Huruf Kiri)',
    subtitle: 'Fokus: Mengenal tombol BACKSPACE untuk memakan huruf di sebelah kiri kursor',
    duration: 60, // 60 detik
    targetCount: 10,
    type: 'backspace_only',
    bgTheme: 'from-emerald-900 via-teal-950 to-slate-950',
    cardBorder: 'border-emerald-400',
    tip: 'Perhatikan huruf di sebelah KIRI kursor! Tekan tombol BACKSPACE (⌫) untuk memerintahkan Monster Baki memakannya!',
  },
  {
    mission: 2,
    title: 'Babak 2: Lembah Kristal (Serbuan Huruf Kanan)',
    subtitle: 'Fokus: Mengenal tombol DELETE untuk memakan huruf di sebelah kanan kursor',
    duration: 65, // 65 detik
    targetCount: 12,
    type: 'delete_only',
    bgTheme: 'from-sky-900 via-blue-950 to-slate-950',
    cardBorder: 'border-sky-400',
    tip: 'Perhatikan huruf di sebelah KANAN kursor! Tekan tombol DELETE (⌦ / Del) untuk memerintahkan Monster Deli melahapnya!',
  },
  {
    mission: 3,
    title: 'Babak 3: Hutan Kembar (Kiri atau Kanan?)',
    subtitle: 'Fokus: Membedakan fungsi tombol Backspace vs Delete secara tepat',
    duration: 70, // 70 detik
    targetCount: 14,
    type: 'choice_left_right',
    bgTheme: 'from-purple-900 via-indigo-950 to-slate-950',
    cardBorder: 'border-purple-400',
    tip: 'Analisis letak huruf sampah: Jika di sebelah KIRI kursor tekan BACKSPACE, jika di sebelah KANAN tekan DELETE!',
  },
  {
    mission: 4,
    title: 'Babak 4: Gua Karang (Pembersihan Ganda)',
    subtitle: 'Fokus: Kombinasi Backspace & Delete untuk membersihkan beberapa huruf berlebih',
    duration: 75, // 75 detik
    targetCount: 15,
    type: 'multi_junk',
    bgTheme: 'from-rose-900 via-pink-950 to-slate-950',
    cardBorder: 'border-rose-400',
    tip: 'Ada lebih dari satu huruf penyusup! Gunakan kombinasi Backspace dan Delete hingga kata menjadi bersih dan benar.',
  },
  {
    mission: 5,
    title: 'Babak 5: Puncak Gunung Kosmik (Grand Finale)',
    subtitle: 'Fokus: Kecepatan analisis kata sains & navigasi kursor mandiri',
    duration: 90, // 90 detik
    targetCount: 18,
    type: 'nav_challenge',
    bgTheme: 'from-amber-950 via-slate-950 to-black',
    cardBorder: 'border-amber-400',
    tip: 'Tantangan puncak! Geser kursor dengan panah ◀ / ▶ jika perlu, lalu bersihkan seluruh huruf pengganggu secepat kilat!',
  },
];

// Bank kata edukasi anak SD (benda sekolah, komputer, dan sains)
const WORD_BANK = [
  'KOMPUTER',
  'BUKU',
  'MEJA',
  'PENA',
  'GURU',
  'KELAS',
  'SISWA',
  'SEKOLAH',
  'BELAJAR',
  'PINTAR',
  'KEYBOARD',
  'MOUSE',
  'LAYAR',
  'KABEL',
  'INTERNET',
  'ROBOT',
  'FOLDER',
  'APLIKASI',
  'KURSOR',
  'PRINTER',
  'SPEAKER',
  'KAMERA',
  'MODEM',
  'TABLET',
  'PROGRAM',
];

// Generator puzzle berdasarkan babak
function generatePuzzle(missionType) {
  const targetWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  const len = targetWord.length;

  if (missionType === 'backspace_only') {
    // Sisipkan 1 huruf kembar atau salah di sembarang posisi, kursor tepat setelah huruf kembar
    const insertIdx = Math.floor(Math.random() * len);
    const junkChar = targetWord[insertIdx];
    // Contoh target 'BUKU', insertIdx=1 ('U') -> 'BU' + 'U' + 'KU' = 'BUUKU'
    const scrambled = targetWord.slice(0, insertIdx) + junkChar + targetWord.slice(insertIdx);
    const cursorPos = insertIdx + 1; // Kursor ada tepat di kanan huruf sampah (sehingga butuh Backspace)
    return {
      targetWord,
      currentText: scrambled,
      cursorPos,
      expectedKey: 'Backspace',
      hint: `Huruf berlebih '${junkChar}' ada di KIRI kursor. Tekan BACKSPACE (⌫)!`,
    };
  }

  if (missionType === 'delete_only') {
    // Sisipkan 1 huruf kembar di posisi tertentu, kursor tepat sebelum huruf kembar
    const insertIdx = Math.floor(Math.random() * len);
    const junkChar = targetWord[insertIdx];
    // Contoh target 'BUKU', insertIdx=1 -> 'B' + 'U' + 'UKU' = 'BUUKU'
    const scrambled = targetWord.slice(0, insertIdx) + junkChar + targetWord.slice(insertIdx);
    const cursorPos = insertIdx; // Kursor ada tepat di kiri huruf sampah (sehingga butuh Delete)
    return {
      targetWord,
      currentText: scrambled,
      cursorPos,
      expectedKey: 'Delete',
      hint: `Huruf berlebih '${junkChar}' ada di KANAN kursor. Tekan DELETE (⌦)!`,
    };
  }

  if (missionType === 'choice_left_right') {
    // Acak apakah sampah di kiri (Backspace) atau di kanan (Delete)
    const isLeft = Math.random() < 0.5;
    const insertIdx = Math.floor(Math.random() * (len - 1)) + 1;
    const junkPool = 'ZXQABCDE';
    const junkChar = Math.random() < 0.6 ? targetWord[insertIdx - 1] : junkPool[Math.floor(Math.random() * junkPool.length)];
    const scrambled = targetWord.slice(0, insertIdx) + junkChar + targetWord.slice(insertIdx);
    const cursorPos = isLeft ? insertIdx + 1 : insertIdx;
    return {
      targetWord,
      currentText: scrambled,
      cursorPos,
      expectedKey: isLeft ? 'Backspace' : 'Delete',
      hint: isLeft
        ? `Huruf sampah '${junkChar}' ada di KIRI kursor. Tekan BACKSPACE (⌫)!`
        : `Huruf sampah '${junkChar}' ada di KANAN kursor. Tekan DELETE (⌦)!`,
    };
  }

  if (missionType === 'multi_junk') {
    // Sisipkan 2 huruf sampah di sekitar kursor
    const insertIdx = Math.floor(Math.random() * (len - 2)) + 1;
    const junkChar1 = targetWord[insertIdx - 1];
    const junkChar2 = targetWord[insertIdx];
    const scrambled =
      targetWord.slice(0, insertIdx) + junkChar1 + junkChar2 + targetWord.slice(insertIdx);
    const cursorPos = insertIdx + 1; // Kursor di antara kedua huruf sampah
    return {
      targetWord,
      currentText: scrambled,
      cursorPos,
      expectedKey: 'any_valid', // Bisa Backspace atau Delete
      hint: `Ada 2 huruf kembar di kiri dan kanan kursor! Gunakan Backspace & Delete.`,
    };
  }

  // Babak 5: Navigasi & kata teknologi panjang
  const insertIdx = Math.floor(Math.random() * (len - 1)) + 1;
  const junkChar = targetWord[insertIdx];
  const scrambled = targetWord.slice(0, insertIdx) + junkChar + targetWord.slice(insertIdx);
  // Kursor diletakkan acak
  const randomCursor = Math.floor(Math.random() * (scrambled.length + 1));
  return {
    targetWord,
    currentText: scrambled,
    cursorPos: randomCursor,
    expectedKey: 'nav_needed',
    hint: `Geser kursor ke dekat huruf kembar '${junkChar}', lalu hapus dengan tepat!`,
  };
}

// Memeriksa apakah target adalah subsequence dari text
// (menghapus huruf sampah dari text harus tetap bisa menghasilkan targetWord tanpa mengubah urutan kata yang benar)
function isSubsequence(target, text) {
  if (text.length < target.length) return false;
  let targetIdx = 0;
  for (let i = 0; i < text.length && targetIdx < target.length; i++) {
    if (text[i] === target[targetIdx]) {
      targetIdx++;
    }
  }
  return targetIdx === target.length;
}

export default function MonsterHurufGame() {
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
  const [shields, setShields] = useState(3); // 3 hati/perisai
  const [soundOn, setSoundOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null); // 'time_up' | 'shields_depleted' | null

  // Puzzle state saat ini
  const [puzzle, setPuzzle] = useState({
    targetWord: 'KOMPUTER',
    currentText: 'KKOOMPUTER',
    cursorPos: 2,
    expectedKey: 'Backspace',
    hint: 'Tekan Backspace untuk menghapus K di kiri kursor!',
  });

  // Animasi monster: 'idle' | 'eating' | 'choke'
  const [bakiState, setBakiState] = useState('idle');
  const [deliState, setDeliState] = useState('idle');
  const [erasedEffect, setErasedEffect] = useState(null); // { id, char, direction: 'left' | 'right', x, y }
  const [shakeError, setShakeError] = useState(false);
  const [activeVirtualKey, setActiveVirtualKey] = useState(null); // 'Backspace' | 'Delete' | 'ArrowLeft' | 'ArrowRight'

  const containerRef = useRef(null);
  const arenaRef = useRef(null);
  const missionStartScoreRef = useRef(0);
  const currentMission = MISSIONS_CONFIG[currentMissionIdx] || MISSIONS_CONFIG[0];

  // Inisialisasi puzzle baru
  const spawnNewWordPuzzle = useCallback(() => {
    const next = generatePuzzle(currentMission.type);
    setPuzzle(next);
    setBakiState('idle');
    setDeliState('idle');
    setErasedEffect(null);
    setShakeError(false);
  }, [currentMission]);

  // Mulai babak misi
  const initMission = useCallback(
    (missionIdx) => {
      const cfg = MISSIONS_CONFIG[missionIdx];
      setCurrentMissionIdx(missionIdx);
      setTimeLeft(cfg.duration);
      setMissionWordCount(0);
      setShields(3);
      setGameOverReason(null);
      spawnNewWordPuzzle();
      monsterAudio.playWaveStart();
    },
    [spawnNewWordPuzzle]
  );

  // Mulai game dari awal (Babak 1)
  const handleStartGame = useCallback(() => {
    monsterAudio.init();
    monsterAudio.playKeyClick();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setWordCount(0);
    setMissionWordCount(0);
    setShields(3);
    setCurrentMissionIdx(0);
    setMissionCountdown(3);
    setGameOverReason(null);
    missionStartScoreRef.current = 0;
    setGameState('countdown');
  }, []);

  // Ulangi babak yang sama (saat waktu habis)
  const handleRetryCurrentMission = useCallback(() => {
    monsterAudio.init();
    monsterAudio.playKeyClick();
    setScore(missionStartScoreRef.current);
    setCombo(0);
    setMissionWordCount(0);
    setShields(3);
    setGameOverReason(null);
    setMissionCountdown(3);
    setGameState('countdown');
  }, []);

  // Hitung mundur 3, 2, 1
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (missionCountdown > 0) {
      const timer = setTimeout(() => {
        setMissionCountdown((prev) => prev - 1);
        if (missionCountdown > 1) {
          monsterAudio.playAlertPulse();
        } else {
          monsterAudio.playWaveStart();
        }
      }, 900);
      return () => clearTimeout(timer);
    } else {
      initMission(currentMissionIdx);
      setGameState('playing');
    }
  }, [gameState, missionCountdown, currentMissionIdx, initMission]);

  // Transisi manual ke babak berikutnya
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
      monsterAudio.playVictory();
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    }
  }, [currentMissionIdx, score]);

  // Selesai & Keluar dari permainan (tutup modal popup & keluar dari layar penuh)
  const handleFinishGame = useCallback(() => {
    monsterAudio.playKeyClick();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
    setGameState('idle');
    setBakiState('idle');
    setDeliState('idle');
    setErasedEffect(null);
    setShakeError(false);
  }, []);

  // Timer game per detik
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState((curr) => {
            if (curr === 'playing') {
              setGameOverReason('time_up');
              monsterAudio.playShieldDamage();
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

  // Logika Eksekusi Tombol BACKSPACE (Memakan huruf di sebelah kiri kursor)
  const handleTriggerBackspace = useCallback(() => {
    if (gameState !== 'playing' || puzzle.currentText === puzzle.targetWord) return;
    const { currentText, cursorPos, targetWord } = puzzle;

    if (cursorPos <= 0) {
      // Tidak ada huruf di kiri kursor
      monsterAudio.playChoke();
      setBakiState('choke');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 350);
      setTimeout(() => setBakiState('idle'), 400);
      return;
    }

    const removedIndex = cursorPos - 1;
    const removedChar = currentText[removedIndex];
    const newText = currentText.slice(0, removedIndex) + currentText.slice(cursorPos);
    const newCursor = cursorPos - 1;

    // Cek apakah aksi ini valid: targetWord HARUS merupakan subsequence dari newText
    // Jika user menghapus huruf yang bukan semestinya (misal 'L' pada 'LAAYAR'), isSubsequence akan false!
    const isJunkRemoval = isSubsequence(targetWord, newText);

    if (isJunkRemoval) {
      // Hitung koordinat letak persis huruf yang dihapus dalam kanvas arena sebelum kartu dihilangkan
      let originX = undefined;
      let originY = undefined;
      if (typeof document !== 'undefined') {
        const targetEl = document.getElementById(`letter-card-${removedIndex}`);
        const arenaEl = arenaRef.current;
        if (targetEl && arenaEl) {
          const targetRect = targetEl.getBoundingClientRect();
          const arenaRect = arenaEl.getBoundingClientRect();
          originX = targetRect.left + targetRect.width / 2 - arenaRect.left;
          originY = targetRect.top + targetRect.height / 2 - arenaRect.top;
        }
      }

      // SUKSES: Monster Backspace makan huruf kiri!
      monsterAudio.playMunchBackspace();
      setBakiState('eating');
      const effectId = Date.now();
      setErasedEffect({
        id: effectId,
        char: removedChar,
        direction: 'left',
        x: originX,
        y: originY,
      });
      setTimeout(() => {
        setErasedEffect((curr) => (curr?.id === effectId ? null : curr));
      }, 480);

      // LANGSUNG HILANGKAN HURUF DARI KATA: Update teks puzzle secara instan!
      setPuzzle((p) => ({
        ...p,
        currentText: newText,
        cursorPos: newCursor,
      }));

      const basePts = 100 + combo * 20;
      setScore((s) => s + basePts);
      setCombo((c) => {
        const nc = c + 1;
        setMaxCombo((m) => Math.max(m, nc));
        return nc;
      });

      // Cek apakah kata sudah bersih sempurna
      if (newText === targetWord) {
        monsterAudio.playWordComplete();
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
        setScore((s) => s + 250);
        setWordCount((w) => w + 1);

        setTimeout(() => {
          setMissionWordCount((curr) => {
            const nextCount = curr + 1;
            if (nextCount >= currentMission.targetCount) {
              setTimeout(() => {
                if (currentMissionIdx + 1 >= MISSIONS_CONFIG.length) {
                  setGameState('victory');
                  monsterAudio.playVictory();
                  confetti({ particleCount: 160, spread: 95, origin: { y: 0.55 } });
                } else {
                  setGameState('wave_clear');
                  monsterAudio.playWaveStart();
                  confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
                }
              }, 400);
            } else {
              spawnNewWordPuzzle();
            }
            return nextCount;
          });
        }, 650);
      }

      setTimeout(() => setBakiState('idle'), 350);
    } else {
      // SALAH MAKAN: Memakan huruf yang benar!
      monsterAudio.playChoke();
      setBakiState('choke');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 450);
      setCombo(0);
      setShields((s) => {
        const ns = Math.max(0, s - 1);
        if (ns <= 0) {
          setGameOverReason('shields_depleted');
          setGameState('gameover');
          monsterAudio.playShieldDamage();
        }
        return ns;
      });
      setTimeout(() => setBakiState('idle'), 450);
    }
  }, [gameState, puzzle, combo, currentMission, currentMissionIdx, spawnNewWordPuzzle]);

  // Logika Eksekusi Tombol DELETE (Memakan huruf di sebelah kanan kursor)
  const handleTriggerDelete = useCallback(() => {
    if (gameState !== 'playing' || puzzle.currentText === puzzle.targetWord) return;
    const { currentText, cursorPos, targetWord } = puzzle;

    if (cursorPos >= currentText.length) {
      // Tidak ada huruf di kanan kursor
      monsterAudio.playChoke();
      setDeliState('choke');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 350);
      setTimeout(() => setDeliState('idle'), 400);
      return;
    }

    const removedIndex = cursorPos;
    const removedChar = currentText[removedIndex];
    const newText = currentText.slice(0, removedIndex) + currentText.slice(removedIndex + 1);
    const newCursor = cursorPos; // Kursor tetap di indeks yang sama

    // Cek apakah aksi ini valid: targetWord HARUS merupakan subsequence dari newText
    const isJunkRemoval = isSubsequence(targetWord, newText);

    if (isJunkRemoval) {
      // Hitung koordinat letak persis huruf yang dihapus dalam kanvas arena sebelum kartu dihilangkan
      let originX = undefined;
      let originY = undefined;
      if (typeof document !== 'undefined') {
        const targetEl = document.getElementById(`letter-card-${removedIndex}`);
        const arenaEl = arenaRef.current;
        if (targetEl && arenaEl) {
          const targetRect = targetEl.getBoundingClientRect();
          const arenaRect = arenaEl.getBoundingClientRect();
          originX = targetRect.left + targetRect.width / 2 - arenaRect.left;
          originY = targetRect.top + targetRect.height / 2 - arenaRect.top;
        }
      }

      // SUKSES: Monster Delete makan huruf kanan!
      monsterAudio.playMunchDelete();
      setDeliState('eating');
      const effectId = Date.now();
      setErasedEffect({
        id: effectId,
        char: removedChar,
        direction: 'right',
        x: originX,
        y: originY,
      });
      setTimeout(() => {
        setErasedEffect((curr) => (curr?.id === effectId ? null : curr));
      }, 480);

      // LANGSUNG HILANGKAN HURUF DARI KATA: Update teks puzzle secara instan!
      setPuzzle((p) => ({
        ...p,
        currentText: newText,
        cursorPos: newCursor,
      }));

      const basePts = 100 + combo * 20;
      setScore((s) => s + basePts);
      setCombo((c) => {
        const nc = c + 1;
        setMaxCombo((m) => Math.max(m, nc));
        return nc;
      });

      // Cek apakah kata sudah bersih sempurna
      if (newText === targetWord) {
        monsterAudio.playWordComplete();
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
        setScore((s) => s + 250);
        setWordCount((w) => w + 1);

        setTimeout(() => {
          setMissionWordCount((curr) => {
            const nextCount = curr + 1;
            if (nextCount >= currentMission.targetCount) {
              setTimeout(() => {
                if (currentMissionIdx + 1 >= MISSIONS_CONFIG.length) {
                  setGameState('victory');
                  monsterAudio.playVictory();
                  confetti({ particleCount: 160, spread: 95, origin: { y: 0.55 } });
                } else {
                  setGameState('wave_clear');
                  monsterAudio.playWaveStart();
                  confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
                }
              }, 400);
            } else {
              spawnNewWordPuzzle();
            }
            return nextCount;
          });
        }, 650);
      }

      setTimeout(() => setDeliState('idle'), 350);
    } else {
      // SALAH MAKAN: Memakan huruf yang benar!
      monsterAudio.playChoke();
      setDeliState('choke');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 450);
      setCombo(0);
      setShields((s) => {
        const ns = Math.max(0, s - 1);
        if (ns <= 0) {
          setGameOverReason('shields_depleted');
          setGameState('gameover');
          monsterAudio.playShieldDamage();
        }
        return ns;
      });
      setTimeout(() => setDeliState('idle'), 450);
    }
  }, [gameState, puzzle, combo, currentMission, currentMissionIdx, spawnNewWordPuzzle]);

  // Geser kursor ke kiri
  const handleMoveCursorLeft = useCallback(() => {
    if (gameState !== 'playing') return;
    setPuzzle((prev) => {
      if (prev.cursorPos > 0) {
        monsterAudio.playCursorMove();
        return { ...prev, cursorPos: prev.cursorPos - 1 };
      }
      return prev;
    });
  }, [gameState]);

  // Geser kursor ke kanan
  const handleMoveCursorRight = useCallback(() => {
    if (gameState !== 'playing') return;
    setPuzzle((prev) => {
      if (prev.cursorPos < prev.currentText.length) {
        monsterAudio.playCursorMove();
        return { ...prev, cursorPos: prev.cursorPos + 1 };
      }
      return prev;
    });
  }, [gameState]);

  // Klik langsung celah huruf untuk menaruh kursor
  const handleSetCursorPosition = useCallback(
    (index) => {
      if (gameState !== 'playing') return;
      monsterAudio.playCursorMove();
      setPuzzle((prev) => ({
        ...prev,
        cursorPos: Math.max(0, Math.min(prev.currentText.length, index)),
      }));
    },
    [gameState]
  );

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Tombol Navigasi Enter / Spacebar untuk Modal Dialog
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

      // 3. Tombol Aksi Game Saat Bermain
      if (gameState === 'playing') {
        if (e.key === 'Backspace') {
          e.preventDefault();
          setActiveVirtualKey('Backspace');
          setTimeout(() => setActiveVirtualKey(null), 160);
          handleTriggerBackspace();
        } else if (e.key === 'Delete') {
          e.preventDefault();
          setActiveVirtualKey('Delete');
          setTimeout(() => setActiveVirtualKey(null), 160);
          handleTriggerDelete();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setActiveVirtualKey('ArrowLeft');
          setTimeout(() => setActiveVirtualKey(null), 160);
          handleMoveCursorLeft();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setActiveVirtualKey('ArrowRight');
          setTimeout(() => setActiveVirtualKey(null), 160);
          handleMoveCursorRight();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    gameOverReason,
    timeLeft,
    handleStartGame,
    handleNextMission,
    handleFinishGame,
    handleRetryCurrentMission,
    handleTriggerBackspace,
    handleTriggerDelete,
    handleMoveCursorLeft,
    handleMoveCursorRight,
  ]);

  // Toggle suara
  const handleToggleSound = () => {
    const next = monsterAudio.toggleSound();
    setSoundOn(next);
  };

  // Toggle fullscreen
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

  // Hitung selisih kemiripan kata
  function countDiff(str, target) {
    let diff = Math.abs(str.length - target.length);
    for (let i = 0; i < Math.min(str.length, target.length); i++) {
      if (str[i] !== target[i]) diff++;
    }
    return diff;
  }

  const { currentText, cursorPos, targetWord, hint } = puzzle;
  const leftChar = cursorPos > 0 ? currentText[cursorPos - 1] : null;
  const rightChar = cursorPos < currentText.length ? currentText[cursorPos] : null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-950 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] overflow-hidden select-none font-sans flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen bg-slate-950' : ''
      }`}
    >
      {/* ── TOP HUD NAVIGATION & STATUS BAR ─────────────────────────── */}
      <div className="bg-amber-300 border-b-3 border-black px-3.5 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-black font-mono">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-heading font-black text-sm sm:text-base flex items-center gap-1.5 bg-white px-2.5 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
            <span>👾</span>
            <span className="hidden sm:inline">Monster Pemakan Huruf</span>
          </span>

          <span className="bg-emerald-300 border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-black" />
            <span>Skor: {score}</span>
          </span>

          {combo > 1 && (
            <span className="bg-rose-400 border-2 border-black px-2 py-1 rounded-lg text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] animate-bounce flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-black" />
              <span>{combo}x Kombo!</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nyawa / Perisai Hati */}
          <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
            {[1, 2, 3].map((shieldIdx) => (
              <Heart
                key={shieldIdx}
                className={`w-3.5 h-3.5 transition-all ${
                  shieldIdx <= shields
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
            aria-label="Toggle Fullscreen"
            className="p-1.5 bg-white hover:bg-yellow-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── SUB-HEADER MISI & TARGET PROGRESS BAR ───────────────────── */}
      <div className="bg-slate-900 border-b-2 border-black/40 px-3.5 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-rose-500 text-white font-black rounded border border-black text-[11px]">
            {gameState === 'idle' ? 'PERSIAPAN MISI' : `BABAK ${currentMission.mission} / 5`}
          </span>
          <span className="font-bold text-slate-300">
            {gameState === 'idle'
              ? 'Latihan Motorik: Tombol Backspace (⌫) & Delete (⌦)'
              : currentMission.title}
          </span>
        </div>

        {/* Progress kuota kata / Informasi Durasi */}
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
                  className="bg-gradient-to-r from-emerald-400 to-green-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (missionWordCount / currentMission.targetCount) * 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── ARENA UTAMA MONSTER & KATA (RESPONSIVE FLEX / CANVAS) ───── */}
      <div
        ref={arenaRef}
        className={`relative flex-1 min-h-[500px] sm:min-h-[540px] md:min-h-[570px] bg-gradient-to-b ${
          gameState === 'idle'
            ? 'from-slate-900 via-indigo-950 to-slate-950'
            : currentMission.bgTheme
        } p-3 sm:p-5 flex flex-col justify-between overflow-hidden`}
      >
        {/* Dekorasi Partikel Latar */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-white animate-ping" />
          <div className="absolute top-24 right-20 w-3 h-3 rounded-full bg-amber-300 animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
        </div>

        {/* EFEK TERHAPUS: MUNCUL PERSIS DARI POSISI HURUF YANG DIHAPUS */}
        {erasedEffect && (
          <div
            key={erasedEffect.id}
            className="absolute pointer-events-none z-40 overflow-visible"
            style={{
              left: erasedEffect.x !== undefined ? `${erasedEffect.x}px` : '50%',
              top: erasedEffect.y !== undefined ? `${erasedEffect.y}px` : '50%',
            }}
          >
            {/* Huruf yang terbang disedot ke mulut monster */}
            <div
              className={`absolute flex flex-col items-center justify-center ${
                erasedEffect.direction === 'left'
                  ? 'animate-fly-left-to-baki'
                  : 'animate-fly-right-to-deli'
              }`}
            >
              <div
                className={`w-11 h-14 sm:w-14 sm:h-18 rounded-xl border-3 border-black flex items-center justify-center font-heading font-black text-2xl sm:text-3xl text-white shadow-[4px_4px_0px_#000] ${
                  erasedEffect.direction === 'left'
                    ? 'bg-rose-500 ring-4 ring-rose-300 shadow-rose-950/80'
                    : 'bg-sky-500 ring-4 ring-sky-300 shadow-sky-950/80'
                }`}
              >
                <span>{erasedEffect.char}</span>
              </div>
              <span
                className={`mt-1 px-2 py-0.5 rounded-full border border-black text-[10px] sm:text-xs font-mono font-black shadow-[2px_2px_0px_#000] whitespace-nowrap ${
                  erasedEffect.direction === 'left'
                    ? 'bg-rose-300 text-rose-950'
                    : 'bg-sky-300 text-sky-950'
                }`}
              >
                {erasedEffect.direction === 'left' ? '⌫ DIMAKAN BAKI!' : '⌦ DILAHAP DELI!'}
              </span>
            </div>

            {/* Efek POOF & Serpihan Debu Terhapus */}
            <div className="absolute animate-poof-burst flex items-center justify-center pointer-events-none select-none">
              <div className="relative flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">💨</span>
                <span className="absolute -top-3 -right-3 text-2xl animate-ping">✨</span>
                <span className="absolute -bottom-2 -left-3 text-xl">💥</span>
              </div>
              <span className="ml-2 font-heading font-black text-xs sm:text-sm text-amber-300 bg-black/85 px-2 py-0.5 rounded-md border border-amber-400 shadow-[2px_2px_0px_#000]">
                TERHAPUS!
              </span>
            </div>
          </div>
        )}

        {gameState === 'idle' ? (
          /* ── KONTEN KANVAS MULAI PERMAINAN (LANGSUNG DI KANVAS, BUKAN POPUP) ── */
          <div className="flex-1 flex flex-col justify-between items-center text-center py-2 sm:py-3 px-2 sm:px-4 relative z-10 my-auto w-full max-w-4xl mx-auto space-y-4">
            {/* Header Judul Game */}
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300 border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_#000] uppercase text-black">
                <span>🎮</span>
                <span>Game 3 • Fokus Motorik: Backspace vs Delete</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white drop-shadow-[3px_3px_0px_#000]">
                Monster Pemakan Huruf
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
                Rapikan kata yang berantakan! Panggil monster yang tepat sesuai posisi huruf kembar atau penyusup terhadap kursor.
              </p>
            </div>

            {/* Stage Tiga Kolom: Monster Baki - Papan Contoh Interaktif - Monster Deli */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
              {/* 1. Monster Baki (Kiri / Backspace) */}
              <div className="bg-rose-950/80 border-3 border-rose-500/80 rounded-2xl p-3 sm:p-4 text-center space-y-2.5 shadow-[4px_4px_0px_#000] flex flex-col items-center">
                {/* Wajah Imut Baki */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-black p-2 flex flex-col items-center justify-center bg-gradient-to-b from-rose-400 to-rose-600 shadow-[3px_3px_0px_#000] animate-bounce-slow">
                  {/* Tanduk */}
                  <div className="absolute -top-3 flex gap-4">
                    <div className="w-2.5 h-3 bg-amber-300 border border-black rounded-t-full -rotate-12" />
                    <div className="w-2.5 h-3 bg-amber-300 border border-black rounded-t-full rotate-12" />
                  </div>
                  {/* Mata */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white border-2 border-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    <div className="w-5 h-5 bg-white border-2 border-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  </div>
                  {/* Mulut Senyum */}
                  <div className="mt-1.5 w-6 h-3 bg-black rounded-b-full border border-white/60 flex items-center justify-center">
                    <div className="w-1.5 h-1 bg-white rounded-b-xs" />
                  </div>
                </div>

                <div>
                  <span className="inline-block px-2 py-0.5 bg-rose-400 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    ◀ MONSTER BAKI
                  </span>
                  <h3 className="font-heading font-black text-sm text-rose-200 mt-1">
                    Makan Huruf di KIRI Kursor
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    Gunakan tombol: <strong className="text-rose-400">BACKSPACE (⌫)</strong>
                  </p>
                </div>
              </div>

              {/* 2. Papan Contoh Edukatif (Tengah) */}
              <div className="bg-slate-900 border-3 border-black rounded-2xl p-3 sm:p-4 text-center space-y-2.5 shadow-[4px_4px_0px_#000]">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
                  💡 Cara Kerja Kursor & Tombol
                </span>

                {/* Simulasi Huruf & Kursor */}
                <div className="bg-slate-950 border-2 border-slate-700 p-2.5 rounded-xl flex items-center justify-center gap-1">
                  <div className="w-8 h-10 bg-rose-400 border-2 border-black rounded-lg flex items-center justify-center font-heading font-black text-lg text-black shadow-[1px_1px_0px_#000]">
                    K
                  </div>
                  <div className="w-8 h-10 bg-rose-400 border-2 border-black rounded-lg flex items-center justify-center font-heading font-black text-lg text-black shadow-[1px_1px_0px_#000]">
                    K
                  </div>
                  {/* Kursor Aktif */}
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-10 bg-amber-400 border border-black rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  </div>
                  <div className="w-8 h-10 bg-sky-400 border-2 border-black rounded-lg flex items-center justify-center font-heading font-black text-lg text-black shadow-[1px_1px_0px_#000]">
                    O
                  </div>
                  <div className="w-8 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center font-heading font-black text-lg text-black shadow-[1px_1px_0px_#000]">
                    M
                  </div>
                </div>

                {/* Indikator Panah Kiri - Kanan */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold">
                  <div className="bg-rose-900/60 border border-rose-500/50 p-1.5 rounded text-rose-200 text-left">
                    <span>◀ ⌫ BACKSPACE:</span>
                    <span className="block text-[9px] text-slate-300 font-normal">Hapus 'K' di kiri kursor</span>
                  </div>
                  <div className="bg-sky-900/60 border border-sky-500/50 p-1.5 rounded text-sky-200 text-left">
                    <span>DELETE ⌦ ▶:</span>
                    <span className="block text-[9px] text-slate-300 font-normal">Hapus 'O' di kanan kursor</span>
                  </div>
                </div>

                <div className="bg-amber-400/20 border border-amber-400/50 p-1.5 rounded text-[10px] sm:text-[11px] font-mono text-amber-200">
                  <span>🎯 Geser kursor bebas dengan tombol panah <strong>◀</strong> dan <strong>▶</strong></span>
                </div>
              </div>

              {/* 3. Monster Deli (Kanan / Delete) */}
              <div className="bg-sky-950/80 border-3 border-sky-500/80 rounded-2xl p-3 sm:p-4 text-center space-y-2.5 shadow-[4px_4px_0px_#000] flex flex-col items-center">
                {/* Wajah Imut Deli */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-black p-2 flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-sky-600 shadow-[3px_3px_0px_#000] animate-bounce-slow">
                  {/* Antena */}
                  <div className="absolute -top-3 flex gap-2">
                    <div className="w-1.5 h-3 bg-yellow-400 border border-black rounded-t-full" />
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full border border-black -ml-1 -mt-1" />
                  </div>
                  {/* Kacamata */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-black p-1 rounded-lg">
                    <div className="w-4 h-4 bg-cyan-300 border border-black rounded flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                    <div className="w-4 h-4 bg-cyan-300 border border-black rounded flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                  </div>
                  {/* Mulut Senyum */}
                  <div className="mt-1.5 w-6 h-3 bg-black rounded-b-full border border-white/60 flex items-center justify-center">
                    <div className="w-1.5 h-1 bg-cyan-400 rounded-full" />
                  </div>
                </div>

                <div>
                  <span className="inline-block px-2 py-0.5 bg-sky-400 border border-black rounded-md text-[11px] font-mono font-black text-black shadow-[1px_1px_0px_#000]">
                    MONSTER DELI ▶
                  </span>
                  <h3 className="font-heading font-black text-sm text-sky-200 mt-1">
                    Makan Huruf di KANAN Kursor
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    Gunakan tombol: <strong className="text-sky-400">DELETE (⌦ / DEL)</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Baris Tombol Mulai & Info Babak */}
            <div className="w-full max-w-xl space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-300">
                <span className="bg-black/50 border border-white/20 px-2.5 py-1 rounded-full">
                  ⭐ 5 Babak Tantangan (~4–5 Menit)
                </span>
                <span className="bg-black/50 border border-white/20 px-2.5 py-1 rounded-full">
                  🎯 Target 69 Kata Bersih
                </span>
                <span className="bg-black/50 border border-white/20 px-2.5 py-1 rounded-full">
                  ❤️ 3 Perisai / Babak
                </span>
              </div>

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
            {/* ── BAGIAN ATAS: PANDUAN CEPAT MISI ── */}
            <div className="text-center space-y-1 relative z-10">
              <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-slate-200 text-xs px-3 py-1 rounded-full font-mono">
                💡 {hint}
              </span>
            </div>

            {/* ── BAGIAN TENGAH: ARENA DUA MONSTER & PAPAN KATA ── */}
            <div className="my-auto py-2 relative z-10 flex flex-col items-center justify-center gap-6">
              <div className="w-full max-w-5xl flex items-center justify-between gap-1 sm:gap-4 md:gap-6 px-1">
                {/* 1. MONSTER BACKSPACE "BAKI" (SISI KIRI) */}
                <div className="flex flex-col items-center text-center transition-all duration-300 w-20 sm:w-28 md:w-36 flex-shrink-0">
                  <div
                    className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl border-3 sm:border-4 border-black p-2 flex flex-col items-center justify-center transition-transform duration-200 ${
                      bakiState === 'eating'
                        ? 'scale-110 bg-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.8)]'
                        : bakiState === 'choke'
                        ? 'scale-90 rotate-12 bg-slate-700 shadow-none'
                        : 'bg-gradient-to-b from-rose-400 to-rose-600 shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {/* Wajah Monster Baki */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      {/* Tanduk Monster */}
                      <div className="absolute -top-4 flex gap-4 sm:gap-6">
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-amber-300 border-2 border-black rounded-t-full -rotate-12" />
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-amber-300 border-2 border-black rounded-t-full rotate-12" />
                      </div>

                      {/* Mata Baki */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-8 sm:h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-black rounded-full" />
                        </div>
                        <div className="w-5 h-5 sm:w-8 sm:h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-black rounded-full" />
                        </div>
                      </div>

                      {/* Mulut Baki */}
                      <div className="mt-1.5 sm:mt-2 relative">
                        {bakiState === 'eating' ? (
                          <div className="w-9 sm:w-12 h-6 sm:h-8 bg-black rounded-b-full border-2 border-white flex items-center justify-center overflow-hidden animate-pulse">
                            <div className="w-4 sm:w-6 h-2.5 sm:h-3 bg-red-500 rounded-t-full mt-2 sm:mt-3" />
                          </div>
                        ) : bakiState === 'choke' ? (
                          <div className="w-6 sm:w-8 h-1.5 sm:h-2 bg-black rounded-full" />
                        ) : (
                          <div className="w-6 sm:w-8 h-3 sm:h-4 bg-black rounded-b-full border border-white/50 flex items-center justify-center">
                            <div className="w-1.5 sm:w-2 h-1 sm:h-1.5 bg-white rounded-b-sm" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Badge Arah: Panah ke KIRI */}
                    <div className="absolute -bottom-3 bg-rose-200 border-2 border-black px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-black font-mono shadow-[2px_2px_0px_#000] text-black flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                      <span>◀</span>
                      <span>Makan Kiri</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="font-heading font-black text-xs sm:text-sm text-rose-300 uppercase tracking-wide block">
                      Monster Backspace
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-rose-500/40 mt-1 inline-block">
                      Tombol ⌫
                    </span>
                  </div>
                </div>

                {/* 2. AREA KATA INTERAKTIF DI TENGAH (SELALU SATU BARIS / FLEX-NOWRAP) */}
                <div className="flex-1 flex flex-col items-center justify-center px-1 sm:px-2 min-w-0 max-w-full">
                  {/* Petunjuk Target Kata */}
                  <div className="text-center mb-2.5">
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">
                      Kata Sasaran Bersih:
                    </span>
                    <span className="font-heading font-black text-emerald-400 text-lg sm:text-2xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
                      "{targetWord}"
                    </span>
                  </div>

                  {/* Kotak-Kotak Huruf dengan Kursor Dinamis (SATU BARIS / STRICTLY SINGLE LINE) */}
                  {(() => {
                    const textLen = currentText.length;
                    const cardSizeClass =
                      textLen <= 6
                        ? 'w-10 h-13 sm:w-13 sm:h-17 text-2xl sm:text-3xl'
                        : textLen <= 8
                        ? 'w-8 h-11 sm:w-11 sm:h-15 text-xl sm:text-2xl'
                        : textLen <= 10
                        ? 'w-7 h-10 sm:w-9 sm:h-13 text-lg sm:text-xl'
                        : 'w-6 h-9 sm:w-8 sm:h-12 text-sm sm:text-lg';
                    const cursorHeightClass =
                      textLen <= 6
                        ? 'h-10 sm:h-14'
                        : textLen <= 8
                        ? 'h-8 sm:h-12'
                        : 'h-7 sm:h-10';

                    return (
                      <div
                        className={`relative bg-slate-900/95 border-3 sm:border-4 border-black p-2.5 sm:p-4 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-nowrap items-center justify-center gap-0.5 sm:gap-1.5 max-w-full overflow-x-auto scrollbar-none transition-all duration-300 ${
                          shakeError ? 'border-rose-500 animate-shake ring-4 ring-rose-400' : ''
                        } ${
                          currentText === targetWord
                            ? 'border-emerald-400 ring-4 ring-emerald-400/80 bg-emerald-950/90 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-[1.02]'
                            : ''
                        }`}
                      >
                        {/* Badge Bersih saat Kata Sempurna */}
                        {currentText === targetWord && (
                          <div className="absolute -top-3.5 bg-emerald-300 border-2 border-black px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-heading font-black text-black shadow-[2px_2px_0px_#000] animate-bounce z-20 flex items-center gap-1 whitespace-nowrap">
                            <span>✨</span>
                            <span>KATA BERSIH SEMPURNA!</span>
                            <span>✨</span>
                          </div>
                        )}

                        {/* Posisi Kursor 0 (sebelum huruf pertama) */}
                        {currentText !== targetWord && (
                          <div
                            onClick={() => handleSetCursorPosition(0)}
                            className={`cursor-pointer group flex items-center justify-center ${cursorHeightClass} w-1 sm:w-2 hover:w-2.5 transition-all flex-shrink-0`}
                            title="Klik untuk menaruh kursor di sini"
                          >
                            {cursorPos === 0 ? (
                              <div className={`w-1.5 sm:w-2 ${cursorHeightClass} bg-amber-400 border border-black rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]`} />
                            ) : (
                              <div className="w-0.5 h-5 sm:h-6 bg-slate-700 group-hover:bg-slate-500 rounded-full" />
                            )}
                          </div>
                        )}

                        {currentText.split('').map((char, idx) => {
                          const isLeftZone = idx === cursorPos - 1;
                          const isRightZone = idx === cursorPos;
                          const isWordClean = currentText === targetWord;

                          return (
                            <div key={idx} className="flex items-center flex-shrink-0">
                              {/* Kartu Huruf */}
                              <div
                                id={`letter-card-${idx}`}
                                className={`relative ${cardSizeClass} rounded-xl border-2 sm:border-3 border-black flex items-center justify-center font-heading font-black transition-all duration-200 select-none flex-shrink-0 ${
                                  isWordClean
                                    ? 'bg-emerald-400 text-black shadow-[3px_3px_0px_#000] ring-2 ring-emerald-300 scale-105'
                                    : isLeftZone
                                    ? 'bg-rose-400 text-black shadow-[3px_3px_0px_#000] ring-2 ring-rose-300 scale-105'
                                    : isRightZone
                                    ? 'bg-sky-400 text-black shadow-[3px_3px_0px_#000] ring-2 ring-sky-300 scale-105'
                                    : 'bg-white text-slate-900 shadow-[2px_2px_0px_#000]'
                                }`}
                              >
                                <span>{char}</span>

                                {/* Indikator Zona Kiri / Kanan */}
                                {!isWordClean && isLeftZone && (
                                  <span className="absolute -top-2.5 -left-1 bg-rose-600 text-white text-[8px] sm:text-[9px] font-mono px-1 rounded border border-black font-black">
                                    ⌫
                                  </span>
                                )}
                                {!isWordClean && isRightZone && (
                                  <span className="absolute -top-2.5 -right-1 bg-sky-600 text-white text-[8px] sm:text-[9px] font-mono px-1 rounded border border-black font-black">
                                    Del
                                  </span>
                                )}
                              </div>

                              {/* Celah Kursor Antara Huruf (idx + 1) */}
                              {!isWordClean && (
                                <div
                                  onClick={() => handleSetCursorPosition(idx + 1)}
                                  className={`cursor-pointer group flex items-center justify-center ${cursorHeightClass} w-1 sm:w-2 hover:w-2.5 transition-all mx-0.5 flex-shrink-0`}
                                  title="Klik untuk menaruh kursor di sini"
                                >
                                  {cursorPos === idx + 1 ? (
                                    <div className={`w-1.5 sm:w-2 ${cursorHeightClass} bg-amber-400 border border-black rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]`} />
                                  ) : (
                                    <div className="w-0.5 h-5 sm:h-6 bg-slate-700 group-hover:bg-slate-500 rounded-full" />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Status Analisis Kursor */}
                  <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-rose-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black" />
                      <span>Kiri: {leftChar ? `'${leftChar}' (Backspace)` : 'Kosong'}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-700" />
                    <div className="flex items-center gap-1.5 text-sky-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-black" />
                      <span>Kanan: {rightChar ? `'${rightChar}' (Delete)` : 'Kosong'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. MONSTER DELETE "DELI" (SISI KANAN) */}
                <div className="flex flex-col items-center text-center transition-all duration-300 w-20 sm:w-28 md:w-36 flex-shrink-0">
                  <div
                    className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl border-3 sm:border-4 border-black p-2 flex flex-col items-center justify-center transition-transform duration-200 ${
                      deliState === 'eating'
                        ? 'scale-110 bg-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.8)]'
                        : deliState === 'choke'
                        ? 'scale-90 -rotate-12 bg-slate-700 shadow-none'
                        : 'bg-gradient-to-b from-sky-400 to-sky-600 shadow-[4px_4px_0px_#000]'
                    }`}
                  >
                    {/* Wajah Monster Deli */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      {/* Antena Sensor Deli */}
                      <div className="absolute -top-4 flex gap-2">
                        <div className="w-2 h-4 bg-yellow-400 border border-black rounded-t-full" />
                        <div className="w-3 h-3 bg-red-500 rounded-full border border-black -ml-1 -mt-1" />
                      </div>

                      {/* Kacamata / Mata Deli */}
                      <div className="flex items-center gap-2 bg-slate-900 border-2 border-black p-1 rounded-xl">
                        <div className="w-5 h-5 sm:w-7 sm:h-7 bg-cyan-300 border border-black rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full" />
                        </div>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 bg-cyan-300 border border-black rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full" />
                        </div>
                      </div>

                      {/* Mulut Deli */}
                      <div className="mt-2 relative">
                        {deliState === 'eating' ? (
                          <div className="w-12 h-8 bg-black rounded-b-full border-2 border-white flex items-center justify-center overflow-hidden animate-pulse">
                            <div className="w-4 h-3 bg-cyan-400 rounded-full" />
                          </div>
                        ) : deliState === 'choke' ? (
                          <div className="w-8 h-2 bg-black rounded-full" />
                        ) : (
                          <div className="w-8 h-4 bg-black rounded-b-full border border-white/50 flex items-center justify-center">
                            <div className="w-2 h-1.5 bg-white rounded-b-sm" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Badge Arah: Panah ke KANAN */}
                    <div className="absolute -bottom-3 bg-sky-200 border-2 border-black px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black font-mono shadow-[2px_2px_0px_#000] text-black flex items-center gap-1">
                      <span>Makan Kanan</span>
                      <span>▶</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="font-heading font-black text-xs sm:text-sm text-sky-300 uppercase tracking-wide block">
                      Monster Delete
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-sky-500/40 mt-1 inline-block">
                      Tombol Del ⌦
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BAGIAN BAWAH: VIRTUAL KEYBOARD CONTROLS UNTUK ANAK ── */}
            <div className="relative z-10 pt-2 border-t-2 border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* Tombol Backspace Kiri */}
              <button
                onClick={handleTriggerBackspace}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeVirtualKey === 'Backspace'
                    ? 'bg-rose-500 text-white translate-x-1 translate-y-1 shadow-none'
                    : 'bg-rose-400 hover:bg-rose-300 text-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1'
                }`}
              >
                <DeleteIcon className="w-5 h-5 rotate-180" />
                <span className="hidden sm:inline">MONSTER BAKI:</span>
                <span>BACKSPACE (⌫)</span>
              </button>

              {/* Tombol Navigasi Panah Kursor */}
              <div className="flex items-center gap-2 bg-slate-900 border-2 border-black p-1 rounded-xl shadow-[3px_3px_0px_#000]">
                <span className="text-[11px] font-mono font-bold text-slate-300 px-2 hidden md:inline">
                  GESER KURSOR:
                </span>
                <button
                  onClick={handleMoveCursorLeft}
                  aria-label="Geser Kursor ke Kiri"
                  className={`p-2 rounded-lg border-2 border-black font-black text-xs transition-all cursor-pointer ${
                    activeVirtualKey === 'ArrowLeft'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white hover:bg-amber-100 text-black shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleMoveCursorRight}
                  aria-label="Geser Kursor ke Kanan"
                  className={`p-2 rounded-lg border-2 border-black font-black text-xs transition-all cursor-pointer ${
                    activeVirtualKey === 'ArrowRight'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white hover:bg-amber-100 text-black shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tombol Delete Kanan */}
              <button
                onClick={handleTriggerDelete}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl border-3 border-black font-heading font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeVirtualKey === 'Delete'
                    ? 'bg-sky-500 text-white translate-x-1 translate-y-1 shadow-none'
                    : 'bg-sky-400 hover:bg-sky-300 text-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1'
                }`}
              >
                <span>DELETE (⌦ / DEL)</span>
                <span className="hidden sm:inline">: MONSTER DELI</span>
                <DeleteIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* ── MODAL 2: COUNTDOWN 3, 2, 1 ────────────────────────────── */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <span className="text-white font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 font-bold">
              Bersiap Memanggil Monster...
            </span>
            <div className="font-heading font-black text-7xl sm:text-8xl text-amber-400 drop-shadow-[4px_4px_0px_#000] animate-ping">
              {missionCountdown > 0 ? missionCountdown : 'GO!'}
            </div>
          </div>
        )}

        {/* ── MODAL 3: WAVE CLEAR / REKAP BABAK ANTARA ─────────────── */}
        {gameState === 'wave_clear' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="max-w-md w-full bg-white border-3 sm:border-4 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] text-center space-y-2.5 sm:space-y-3.5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-300 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000]">
                ⭐
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-emerald-200 border border-black rounded-full text-[10px] sm:text-xs font-mono font-black shadow-[1px_1px_0px_0px_#000] uppercase text-emerald-950">
                  Babak {currentMission.mission} Selesai!
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-black">
                  Kata Berhasil Dirapikan!
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-mono">
                  Kedua monster sangat kenyang dan bahagia memakan huruf sampah!
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3 rounded-xl space-y-1.5 text-left font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Skor Saat Ini:</span>
                  <span className="font-black text-black">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Kombo Tertinggi:</span>
                  <span className="font-black text-rose-600">{maxCombo}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Perisai Baru Babak Berikutnya:</span>
                  <span className="font-black text-emerald-600">3 / 3 (Dipulihkan Penuh!)</span>
                </div>
              </div>

              {currentMissionIdx + 1 < MISSIONS_CONFIG.length && (
                <div className="bg-amber-100 border-2 border-black p-2 sm:p-2.5 rounded-xl text-left text-[11px] sm:text-xs font-mono text-amber-900">
                  <span className="font-bold block">💡 Info Babak Berikutnya:</span>
                  <span>{MISSIONS_CONFIG[currentMissionIdx + 1].subtitle}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={handleNextMission}
                  className="flex-[2] py-2.5 sm:py-3 bg-emerald-400 hover:bg-emerald-300 border-3 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
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

        {/* ── MODAL 4: PAUSED SCREEN ───────────────────────────────── */}
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
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 border-2 border-black rounded-xl font-heading font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                LANJUTKAN PERMAINAN
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL 5: GAME OVER SCREEN (RETRY VS RESTART) ─────────── */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="max-w-md w-full bg-white border-3 sm:border-4 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] text-center space-y-2.5 sm:space-y-3.5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-400 border-2 sm:border-3 border-black rounded-xl mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000]">
                💥
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-rose-200 border border-black rounded-full text-[10px] sm:text-xs font-mono font-black shadow-[1px_1px_0px_0px_#000] uppercase text-rose-950">
                  {gameOverReason === 'time_up' ? 'Waktu Babak Habis!' : 'Nyawa Monster Habis!'}
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-black">
                  {gameOverReason === 'time_up' ? 'Ayo Coba Lagi!' : 'Monster Tersedak!'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-mono leading-relaxed">
                  {gameOverReason === 'time_up'
                    ? `Target kata belum terpenuhi (${missionWordCount} dari ${currentMission.targetCount} kata). Tekan tombol ulangi untuk mencoba kembali babak ini!`
                    : 'Kamu salah memakan huruf yang benar sebanyak 3 kali. Tenang, ayo latih kembali ketelitianmu!'}
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

        {/* ── MODAL 6: VICTORY SCREEN (GRAND FINALE) ────────────────── */}
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
                  Pawang Monster Huruf Sejati!
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-mono">
                  Luar biasa! Kamu telah menguasai tombol <strong>Backspace (⌫)</strong> dan <strong>Delete (⌦)</strong> dengan sangat tangkas melewati seluruh 5 babak!
                </p>
              </div>

              <div className="bg-amber-50 border-2 sm:border-3 border-black p-3 sm:p-3.5 rounded-xl space-y-1.5 text-left font-mono text-xs shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Skor Akhir:</span>
                  <span className="font-heading font-black text-base sm:text-lg text-emerald-600">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Kata Dibersihkan:</span>
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

        {/* ── CSS KEYFRAMES UNTUK EFEK TERHAPUS & SHAKE ERROR ────── */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes flyLeftToBaki {
                0% {
                  transform: translate(-50%, -50%) scale(1) rotate(0deg);
                  opacity: 1;
                }
                30% {
                  transform: translate(calc(-50% - 70px), calc(-50% - 30px)) scale(1.15) rotate(-15deg);
                  opacity: 1;
                }
                70% {
                  transform: translate(calc(-50% - 180px), calc(-50% - 15px)) scale(0.6) rotate(-45deg);
                  opacity: 0.9;
                }
                100% {
                  transform: translate(calc(-50% - 280px), calc(-50% + 0px)) scale(0.1) rotate(-90deg);
                  opacity: 0;
                }
              }

              @keyframes flyRightToDeli {
                0% {
                  transform: translate(-50%, -50%) scale(1) rotate(0deg);
                  opacity: 1;
                }
                30% {
                  transform: translate(calc(-50% + 70px), calc(-50% - 30px)) scale(1.15) rotate(15deg);
                  opacity: 1;
                }
                70% {
                  transform: translate(calc(-50% + 180px), calc(-50% - 15px)) scale(0.6) rotate(45deg);
                  opacity: 0.9;
                }
                100% {
                  transform: translate(calc(-50% + 280px), calc(-50% + 0px)) scale(0.1) rotate(90deg);
                  opacity: 0;
                }
              }

              @keyframes poofBurst {
                0% {
                  transform: translate(-50%, -50%) scale(0.4) rotate(0deg);
                  opacity: 1;
                }
                50% {
                  transform: translate(-50%, -50%) scale(1.3) rotate(10deg);
                  opacity: 0.9;
                }
                100% {
                  transform: translate(-50%, -50%) scale(1.7) rotate(20deg);
                  opacity: 0;
                }
              }

              @keyframes shakeError {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-8px); }
                40%, 80% { transform: translateX(8px); }
              }

              @keyframes bounceSlow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }

              .animate-fly-left-to-baki {
                animation: flyLeftToBaki 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
              }

              .animate-fly-right-to-deli {
                animation: flyRightToDeli 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
              }

              .animate-poof-burst {
                animation: poofBurst 0.45s ease-out forwards;
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
