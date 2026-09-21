// ─── Layanan Progres Latihan Shortcut Keyboard (GWA Tech Course) ──────────

const STORAGE_PREFIX = "gwa_shortcut_progress_";

/**
 * Hitung bintang kelulusan berdasarkan akurasi dan kecepatan respon (milidetik)
 */
export function calculateShortcutStars(isSuccess, reactionMs = 3000) {
  if (!isSuccess) return 0;
  if (reactionMs <= 1200) return 3; // Super Ninja (Refleks sangat cepat)
  if (reactionMs <= 2500) return 2; // Mahir
  return 1; // Lulus
}

/**
 * Dapatkan data progres dari localStorage
 */
export function getShortcutProgress(siswaId = "guest") {
  if (typeof window === "undefined") {
    return {
      completedLevels: {},
      totalStars: 0,
      unlockedUpTo: {
        officeNinja: 1,
        textNavigator: 1,
      },
    };
  }

  const key = `${STORAGE_PREFIX}${siswaId || "guest"}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        completedLevels: parsed.completedLevels || {},
        totalStars: parsed.totalStars || 0,
        unlockedUpTo: {
          officeNinja: parsed.unlockedUpTo?.officeNinja || 1,
          textNavigator: parsed.unlockedUpTo?.textNavigator || 1,
        },
      };
    }
  } catch (err) {
    console.error("Gagal membaca progres shortcut:", err);
  }

  return {
    completedLevels: {},
    totalStars: 0,
    unlockedUpTo: {
      officeNinja: 1,
      textNavigator: 1,
    },
  };
}

/**
 * Simpan hasil penyelesaian level shortcut
 */
export function saveShortcutResult(siswaId = "guest", mode, levelId, levelIndex, result) {
  if (typeof window === "undefined") return null;

  const currentProgress = getShortcutProgress(siswaId);
  const existingRecord = currentProgress.completedLevels[levelId] || null;

  const reactionMs = Number(result.reactionMs) || 2000;
  const starsEarned = calculateShortcutStars(result.isSuccess, reactionMs);

  if (starsEarned === 0) {
    return { isPassed: false, stars: 0, isNewBest: false };
  }

  const prevStars = existingRecord?.stars || 0;
  const isNewBest = starsEarned > prevStars;
  const finalStars = Math.max(prevStars, starsEarned);
  const bestReaction = existingRecord?.bestReactionMs
    ? Math.min(existingRecord.bestReactionMs, reactionMs)
    : reactionMs;

  currentProgress.completedLevels[levelId] = {
    stars: finalStars,
    bestReactionMs: bestReaction,
    completedAt: new Date().toISOString(),
  };

  // Hitung total bintang
  currentProgress.totalStars = Object.values(currentProgress.completedLevels).reduce(
    (sum, record) => sum + (record.stars || 0),
    0
  );

  // Buka level berikutnya
  const currentUnlocked = currentProgress.unlockedUpTo[mode] || 1;
  if (levelIndex + 2 > currentUnlocked) {
    currentProgress.unlockedUpTo[mode] = levelIndex + 2;
  }

  const key = `${STORAGE_PREFIX}${siswaId || "guest"}`;
  try {
    localStorage.setItem(key, JSON.stringify(currentProgress));
  } catch (err) {
    console.error("Gagal menyimpan progres shortcut:", err);
  }

  return {
    isPassed: true,
    stars: finalStars,
    isNewBest,
    reactionMs,
  };
}
