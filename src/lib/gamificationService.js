// ─── Gamification Service for GWA Student Portal ─────────────────────────────

export const LEVELS = [
  { level: 1, minXp: 0, maxXp: 99, title: "Novice Explorer", icon: "🌱", color: "bg-lime-300" },
  { level: 2, minXp: 100, maxXp: 299, title: "Junior Operator", icon: "💻", color: "bg-cyan-300" },
  { level: 3, minXp: 300, maxXp: 599, title: "Computer Specialist", icon: "⚡", color: "bg-amber-300" },
  { level: 4, minXp: 600, maxXp: 999, title: "Digital Wizard", icon: "🧙‍♂️", color: "bg-purple-300" },
  { level: 5, minXp: 1000, maxXp: 99999, title: "Master Commander", icon: "👑", color: "bg-orange-400" },
];

export const BADGES = [
  {
    id: "first_step",
    title: "Langkah Pertama",
    desc: "Mulai membuka dan membaca materi pelatihan.",
    icon: "🚀",
    color: "bg-cyan-200",
  },
  {
    id: "mission_master",
    title: "Penyelesai Misi",
    desc: "Menyelesaikan semua checklist Misi Praktik dalam 1 pertemuan.",
    icon: "🎯",
    color: "bg-emerald-200",
  },
  {
    id: "flashcard_pro",
    title: "Pakar Shortcut",
    desc: "Membuka dan mempelajari Kartu Pintar Shortcut keyboard.",
    icon: "🃏",
    color: "bg-amber-200",
  },
  {
    id: "note_taker",
    title: "Siswa Rajin",
    desc: "Menulis catatan belajar pribadi pada sesi materi.",
    icon: "📝",
    color: "bg-yellow-200",
  },
  {
    id: "quiz_champion",
    title: "Bintang Kuis",
    desc: "Menyelesaikan kuis evaluasi dengan skor 100.",
    icon: "⚡",
    color: "bg-purple-200",
  },
  {
    id: "persistent_learner",
    title: "Pemberani Digital",
    desc: "Mencapai Level 3: Computer Specialist.",
    icon: "🔥",
    color: "bg-rose-200",
  },
];

export function calculateLevel(xp = 0) {
  const current = LEVELS.find((l) => xp >= l.minXp && xp <= l.maxXp) || LEVELS[LEVELS.length - 1];
  const nextLevel = LEVELS.find((l) => l.level === current.level + 1);

  const levelMin = current.minXp;
  const levelMax = nextLevel ? nextLevel.minXp : current.maxXp;
  const range = levelMax - levelMin;
  const progressInLevel = xp - levelMin;
  const progressPct = nextLevel ? Math.min(100, Math.max(0, Math.round((progressInLevel / range) * 100))) : 100;

  return {
    ...current,
    nextLevelXp: nextLevel ? nextLevel.minXp : current.maxXp,
    progressPct,
    xpToNext: nextLevel ? Math.max(0, nextLevel.minXp - xp) : 0,
  };
}

export function getGamificationState(siswaId) {
  if (typeof window === "undefined") {
    return {
      xp: 0,
      badges: ["first_step"],
      history: [],
      levelInfo: calculateLevel(0),
    };
  }

  const key = `gwa_gamification_${siswaId || "guest"}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      const xp = parsed.xp || 0;
      const badges = Array.isArray(parsed.badges) ? parsed.badges : ["first_step"];
      return {
        xp,
        badges,
        history: parsed.history || [],
        levelInfo: calculateLevel(xp),
      };
    }
  } catch (e) {
    // ignore
  }

  // Default state for new student
  const defaultState = {
    xp: 50, // Welcome bonus XP
    badges: ["first_step"],
    history: [{ reason: "Bonus Selamat Datang 🎉", amount: 50, timestamp: new Date().toISOString() }],
  };

  try {
    localStorage.setItem(key, JSON.stringify(defaultState));
  } catch (e) {
    // ignore
  }

  return {
    ...defaultState,
    levelInfo: calculateLevel(defaultState.xp),
  };
}

export function addXp(siswaId, amount, reason = "Aktivitas Belajar") {
  if (typeof window === "undefined") return null;
  const key = `gwa_gamification_${siswaId || "guest"}`;

  try {
    const current = getGamificationState(siswaId);
    const newXp = (current.xp || 0) + amount;
    const newHistory = [
      { reason, amount, timestamp: new Date().toISOString() },
      ...(current.history || []).slice(0, 20),
    ];

    const updatedBadges = [...(current.badges || [])];

    // Check automatic badge conditions
    if (newXp >= 300 && !updatedBadges.includes("persistent_learner")) {
      updatedBadges.push("persistent_learner");
    }

    const updatedState = {
      xp: newXp,
      badges: updatedBadges,
      history: newHistory,
    };

    localStorage.setItem(key, JSON.stringify(updatedState));

    return {
      ...updatedState,
      levelInfo: calculateLevel(newXp),
      awarded: amount,
      reason,
      newBadge: updatedBadges.length > current.badges.length ? updatedBadges[updatedBadges.length - 1] : null,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function unlockBadge(siswaId, badgeId) {
  if (typeof window === "undefined") return null;
  const key = `gwa_gamification_${siswaId || "guest"}`;

  try {
    const current = getGamificationState(siswaId);
    if (current.badges.includes(badgeId)) return current;

    const updatedBadges = [...current.badges, badgeId];
    // Bonus XP for unlocking a badge
    const newXp = (current.xp || 0) + 30;
    const newHistory = [
      { reason: `Lencana Terbuka: ${BADGES.find((b) => b.id === badgeId)?.title || badgeId} 🏅`, amount: 30, timestamp: new Date().toISOString() },
      ...(current.history || []).slice(0, 20),
    ];

    const updatedState = {
      xp: newXp,
      badges: updatedBadges,
      history: newHistory,
    };

    localStorage.setItem(key, JSON.stringify(updatedState));

    return {
      ...updatedState,
      levelInfo: calculateLevel(newXp),
      newBadge: badgeId,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
