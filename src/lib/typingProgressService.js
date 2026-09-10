// ─── Layanan Progres Latihan Mengetik (Typing Progress & Unlocking) ──────────

import { TYPING_LESSONS } from "@/data/typingCurriculum";

const STORAGE_PREFIX = "gwa_typing_progress_";

/**
 * Hitung bintang berdasarkan akurasi dan kecepatan WPM
 */
export function calculateStars(accuracy, wpm, minAccuracy = 80) {
  if (accuracy < minAccuracy) return 0; // Gagal / Belum memenuhi syarat kelulusan
  if (accuracy >= 98 && wpm >= 35) return 5;
  if (accuracy >= 95 && wpm >= 25) return 4;
  if (accuracy >= 90 && wpm >= 18) return 3;
  if (accuracy >= 85) return 2;
  return 1;
}

/**
 * Dapatkan data progres dari localStorage
 */
export function getTypingProgress(siswaId = "guest") {
  if (typeof window === "undefined") {
    return {
      completedLevels: {},
      unlockedUpTo: 1,
      bypassUnlocked: false,
    };
  }

  const key = `${STORAGE_PREFIX}${siswaId || "guest"}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        completedLevels: parsed.completedLevels || {},
        unlockedUpTo: Math.max(1, parsed.unlockedUpTo || 1),
        bypassUnlocked: !!parsed.bypassUnlocked,
      };
    }
  } catch (err) {
    console.error("Gagal membaca progres mengetik:", err);
  }

  return {
    completedLevels: {},
    unlockedUpTo: 1,
    bypassUnlocked: false,
  };
}

/**
 * Simpan hasil penyelesaian suatu level
 */
export function saveLevelResult(siswaId = "guest", levelId, result) {
  if (typeof window === "undefined") return null;

  const currentProgress = getTypingProgress(siswaId);
  const existingRecord = currentProgress.completedLevels[levelId] || null;

  const accuracy = Number(result.accuracy) || 0;
  const wpm = Number(result.wpm) || 0;
  const minAccuracy = Number(result.minAccuracy) || 80;
  const starsEarned = calculateStars(accuracy, wpm, minAccuracy);
  const isPassed = starsEarned > 0;

  // Jika lulus, simpan atau perbarui rekor tertinggi
  const prevStars = existingRecord?.stars || 0;
  const prevWpm = existingRecord?.bestWpm || 0;
  const prevAcc = existingRecord?.bestAccuracy || 0;

  const newRecord = {
    stars: Math.max(prevStars, starsEarned),
    bestWpm: Math.max(prevWpm, wpm),
    bestAccuracy: Math.max(prevAcc, accuracy),
    passed: isPassed || !!existingRecord?.passed,
    lastPlayedAt: new Date().toISOString(),
  };

  const updatedCompleted = {
    ...currentProgress.completedLevels,
    [levelId]: newRecord,
  };

  // Jika lulus, buka level berikutnya
  let nextUnlocked = currentProgress.unlockedUpTo;
  if (isPassed) {
    nextUnlocked = Math.max(nextUnlocked, levelId + 1);
  }

  const updatedProgress = {
    ...currentProgress,
    completedLevels: updatedCompleted,
    unlockedUpTo: nextUnlocked,
  };

  try {
    const key = `${STORAGE_PREFIX}${siswaId || "guest"}`;
    localStorage.setItem(key, JSON.stringify(updatedProgress));

    // Kirim custom event untuk sinkronisasi state UI
    window.dispatchEvent(
      new CustomEvent("gwa-typing-progress-updated", {
        detail: { siswaId, progress: updatedProgress },
      })
    );
  } catch (err) {
    console.error("Gagal menyimpan progres mengetik:", err);
  }

  return {
    progress: updatedProgress,
    starsEarned,
    isPassed,
    isNewUnlock: isPassed && nextUnlocked > currentProgress.unlockedUpTo,
  };
}

/**
 * Periksa apakah suatu level terbuka
 */
export function isLevelUnlocked(progress, levelId) {
  if (!progress) return levelId === 1;
  if (progress.bypassUnlocked) return true;
  if (levelId === 1) return true;
  if (levelId <= progress.unlockedUpTo) return true;

  // Cek apakah level sebelumnya sudah pernah lulus
  const prevLevelRecord = progress.completedLevels?.[levelId - 1];
  return !!prevLevelRecord?.passed;
}

/**
 * Toggle Mode Bypass Guru (Buka Semua Level untuk Pengajar/Testing)
 */
export function toggleBypassUnlock(siswaId = "guest", forceValue = null) {
  if (typeof window === "undefined") return false;

  const current = getTypingProgress(siswaId);
  const nextVal = forceValue !== null ? forceValue : !current.bypassUnlocked;
  const updated = {
    ...current,
    bypassUnlocked: nextVal,
  };

  try {
    const key = `${STORAGE_PREFIX}${siswaId || "guest"}`;
    localStorage.setItem(key, JSON.stringify(updated));

    window.dispatchEvent(
      new CustomEvent("gwa-typing-progress-updated", {
        detail: { siswaId, progress: updated },
      })
    );
  } catch (e) {}

  return nextVal;
}

/**
 * Reset seluruh progres
 */
export function resetTypingProgress(siswaId = "guest") {
  if (typeof window === "undefined") return;

  const empty = {
    completedLevels: {},
    unlockedUpTo: 1,
    bypassUnlocked: false,
  };

  try {
    const key = `${STORAGE_PREFIX}${siswaId || "guest"}`;
    localStorage.setItem(key, JSON.stringify(empty));

    window.dispatchEvent(
      new CustomEvent("gwa-typing-progress-updated", {
        detail: { siswaId, progress: empty },
      })
    );
  } catch (e) {}

  return empty;
}

/**
 * Hitung ringkasan statistik global
 */
export function getOverallProgressStats(progress) {
  const totalLessons = TYPING_LESSONS.length;
  const maxPossibleStars = totalLessons * 5;

  let totalStars = 0;
  let completedCount = 0;
  let totalWpm = 0;

  if (progress && progress.completedLevels) {
    Object.values(progress.completedLevels).forEach((record) => {
      if (record.passed) {
        completedCount++;
        totalStars += record.stars || 0;
        totalWpm += record.bestWpm || 0;
      }
    });
  }

  const averageWpm = completedCount > 0 ? Math.round(totalWpm / completedCount) : 0;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  return {
    totalLessons,
    maxPossibleStars,
    totalStars,
    completedCount,
    averageWpm,
    progressPct,
  };
}
