"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginSiswa, getKehadiranSiswa } from "@/lib/siswaService";
import { getAksesSiswa } from "@/lib/materiService";
import { getQuizHasilSiswa } from "@/lib/quizService";
import { getGamificationState, addXp, unlockBadge } from "@/lib/gamificationService";

// ── Context ─────────────────────────────────────────────────────────────────
const SiswaContext = createContext(null);

export function SiswaProvider({ children }) {
  const router = useRouter();
  const [currentSiswa, setCurrentSiswa] = useState(null);
  const [aksesMateri, setAksesMateri] = useState({}); // map of materi_id -> status
  const [gamification, setGamification] = useState({
    xp: 0,
    badges: [],
    history: [],
    levelInfo: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Restore session dari sessionStorage saat mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("gwa_siswa_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentSiswa(parsed);
        // Refresh akses materi & gamifikasi saat reload
        refreshAkses(parsed.id);
        refreshGamification(parsed.id);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGamification = (siswaId) => {
    const state = getGamificationState(siswaId);
    setGamification(state);
    return state;
  };

  const awardXp = (amount, reason) => {
    const siswaId = currentSiswa?.id || "guest";
    const updated = addXp(siswaId, amount, reason);
    if (updated) {
      setGamification(updated);
    }
    return updated;
  };

  const triggerUnlockBadge = (badgeId) => {
    const siswaId = currentSiswa?.id || "guest";
    const updated = unlockBadge(siswaId, badgeId);
    if (updated) {
      setGamification(updated);
    }
    return updated;
  };

  const refreshAkses = async (siswaId, existingSiswaData = null) => {
    // 1. Fetch Akses
    const { aksesMap } = await getAksesSiswa(siswaId);
    if (aksesMap) setAksesMateri(aksesMap);
    
    // 2. Fetch Kehadiran & Quiz
    const { data: kehadiranData } = await getKehadiranSiswa(siswaId);
    const { data: quizData } = await getQuizHasilSiswa(siswaId);
    
    // Hitung pertemuan selesai dari aksesMap atau kehadiran
    let selesaiCount = 0;
    if (aksesMap) {
      selesaiCount = Object.values(aksesMap).filter(st => st === 'selesai').length;
    } else if (kehadiranData) {
      selesaiCount = kehadiranData.filter(k => k.status === 'Hadir').length;
    }

    setCurrentSiswa(prev => {
        const baseData = prev || existingSiswaData;
        if (!baseData) return null;
        
        const updated = {
            ...baseData,
            kehadiran: kehadiranData || [],
            nilaiQuiz: quizData || [],
            pertemuanSelesai: selesaiCount,
            totalPertemuan: baseData.totalPertemuan || 10
        };
        sessionStorage.setItem("gwa_siswa_session", JSON.stringify(updated));
        return updated;
    });

    // Also refresh gamification
    refreshGamification(siswaId);
  };

  const login = async (idSiswa, password) => {
    const { success, message, data } = await loginSiswa(idSiswa, password);
    
    if (success && data) {
      setCurrentSiswa(data);
      sessionStorage.setItem("gwa_siswa_session", JSON.stringify(data));
      await refreshAkses(data.id, data);
      refreshGamification(data.id);
      return { success: true };
    }
    
    return { success: false, message: message || "ID Siswa atau Password salah." };
  };

  const logout = () => {
    setCurrentSiswa(null);
    setAksesMateri({});
    sessionStorage.removeItem("gwa_siswa_session");
    router.replace("/siswa/login");
  };

  return (
    <SiswaContext.Provider
      value={{
        currentSiswa,
        aksesMateri,
        gamification,
        awardXp,
        triggerUnlockBadge,
        refreshGamification,
        refreshAkses,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </SiswaContext.Provider>
  );
}

export function useSiswa() {
  const ctx = useContext(SiswaContext);
  if (!ctx) throw new Error("useSiswa harus digunakan di dalam SiswaProvider");
  return ctx;
}
