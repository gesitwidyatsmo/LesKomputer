"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb,
  FileText,
  Brain,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Play,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Video,
  Download,
  BookOpen,
  Save,
  Check,
  Zap,
  Layers,
  Award,
} from "lucide-react";
import MateriViewer from "./MateriViewer";
import { useRouter } from "next/navigation";
import { useSiswa } from "@/context/SiswaContext";
import { formatWhatsAppUrl } from "@/lib/landingService";
import confetti from "canvas-confetti";

/**
 * Helper to convert various video URLs (YouTube, Loom, Vimeo, direct mp4)
 * into playable iframe or video elements.
 */
function getEmbedVideo(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // YouTube standard / short / embed / shorts
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
    };
  }

  // Loom
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return {
      type: "loom",
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct MP4 / WebM
  if (trimmed.match(/\.(mp4|webm|ogg)$/i)) {
    return {
      type: "direct",
      embedUrl: trimmed,
    };
  }

  // Generic https url fallback
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return {
      type: "iframe",
      embedUrl: trimmed,
    };
  }

  return null;
}

export default function MateriDropdownContent({ materi }) {
  const router = useRouter();
  const { currentSiswa, awardXp, triggerUnlockBadge } = useSiswa();

  const topik = Array.isArray(materi.topik)
    ? materi.topik
    : (() => {
        try {
          return JSON.parse(materi.topik || "[]");
        } catch {
          return [];
        }
      })();

  const rawMisi = materi.misi_praktik;
  const misiList = Array.isArray(rawMisi)
    ? rawMisi
    : (() => {
        try {
          return JSON.parse(rawMisi || "[]");
        } catch {
          return [];
        }
      })();

  // ── Bahan Latihan ──
  const rawBahan = materi.bahan_latihan;
  const bahanLatihan = Array.isArray(rawBahan)
    ? rawBahan
    : (() => {
        try {
          return JSON.parse(rawBahan || "[]");
        } catch {
          if (rawBahan && typeof rawBahan === "object") return [rawBahan];
          if (typeof rawBahan === "string" && rawBahan.startsWith("http")) {
            return [{ nama_file: "Bahan Latihan Praktik", url_file: rawBahan }];
          }
          return [];
        }
      })();

  // ── Kartu Pintar Flashcards ──
  const rawKartu = materi.kartu_pintar;
  const kartuList = Array.isArray(rawKartu)
    ? rawKartu
    : (() => {
        try {
          return JSON.parse(rawKartu || "[]");
        } catch {
          return [];
        }
      })();

  const showMateriSection =
    materi.tipe_konten !== "quiz_saja" &&
    materi.lampiran &&
    materi.lampiran.length > 0;
  const showQuizButton = materi.tipe_konten !== "materi_saja";

  const videoData = getEmbedVideo(materi.video_url);

  // ── Tab State ──
  const [activeTab, setActiveTab] = useState("panduan"); // 'panduan' | 'video' | 'praktik' | 'kartu_catatan'

  // ── 1. Misi Praktik Checked State (Persisted in localStorage) ──
  const storageKeyMisi = currentSiswa
    ? `gwa_misi_${currentSiswa.id}_${materi.id}`
    : `gwa_misi_guest_${materi.id}`;

  const [checkedMisi, setCheckedMisi] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKeyMisi);
      if (saved) {
        setCheckedMisi(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [storageKeyMisi]);

  const toggleMisi = (index) => {
    const isNowDone = !checkedMisi[index];
    const updated = {
      ...checkedMisi,
      [index]: isNowDone,
    };
    setCheckedMisi(updated);

    try {
      localStorage.setItem(storageKeyMisi, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (isNowDone) {
      if (awardXp) awardXp(15, `Misi Praktik: Langkah #${index + 1} Selesai 🎯`);
    }

    // Trigger celebration when all missions are checked
    const completedCount = misiList.filter((_, idx) => updated[idx]).length;
    if (completedCount === misiList.length && misiList.length > 0) {
      if (awardXp) awardXp(50, "🎉 Bonus: Menyelesaikan Semua Misi Pertemuan!");
      if (triggerUnlockBadge) triggerUnlockBadge("mission_master");
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.7 },
          colors: ["#10b981", "#facc15", "#f97316", "#38bdf8"],
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetMisi = () => {
    setCheckedMisi({});
    try {
      localStorage.removeItem(storageKeyMisi);
    } catch {
      // ignore
    }
  };

  const completedMisiCount = misiList.filter((_, idx) => checkedMisi[idx]).length;
  const progressMisiPct =
    misiList.length > 0
      ? Math.round((completedMisiCount / misiList.length) * 100)
      : 0;
  const isAllMisiCompleted =
    misiList.length > 0 && completedMisiCount === misiList.length;

  // ── 2. Kartu Pintar State ──
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [discoveredCards, setDiscoveredCards] = useState({});

  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (nextFlipped && !discoveredCards[currentCardIdx]) {
      setDiscoveredCards((prev) => ({ ...prev, [currentCardIdx]: true }));
      if (awardXp) awardXp(5, "Membuka Kartu Pintar Baru 🃏");
      if (triggerUnlockBadge) triggerUnlockBadge("flashcard_pro");
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev > 0 ? prev - 1 : kartuList.length - 1));
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev < kartuList.length - 1 ? prev + 1 : 0));
  };

  // ── 3. Catatan Pribadi Siswa State (Auto-save) ──
  const storageKeyNotes = currentSiswa
    ? `gwa_catatan_${currentSiswa.id}_${materi.id}`
    : `gwa_catatan_guest_${materi.id}`;

  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saving' | 'saved'

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKeyNotes);
      if (saved) setNotes(saved);
    } catch {
      // ignore
    }
  }, [storageKeyNotes]);

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    setSaveStatus("saving");

    try {
      localStorage.setItem(storageKeyNotes, value);
      setTimeout(() => {
        setSaveStatus("saved");
      }, 500);
    } catch {
      // ignore
    }

    // Award XP for creating first personal notes
    if (value.trim().length > 10) {
      const keyRewarded = `gwa_note_rewarded_${currentSiswa?.id || "guest"}_${materi.id}`;
      if (!localStorage.getItem(keyRewarded)) {
        localStorage.setItem(keyRewarded, "true");
        if (awardXp) awardXp(20, "Menulis Catatan Belajar Pribadi 📝");
        if (triggerUnlockBadge) triggerUnlockBadge("note_taker");
      }
    }
  };

  const waText = `Halo Guru/Instruktur GWA, saya ${
    currentSiswa?.nama || "Siswa"
  } (ID: ${currentSiswa?.id || "-"}) dari kelas ${
    currentSiswa?.kelas || "-"
  }. Saya ingin bertanya tentang materi: "${materi.judul}" (Pertemuan ${
    materi.pertemuan
  }).`;
  const waUrl = formatWhatsAppUrl("6280000000000", waText);

  // Tab definitions
  const tabs = [
    {
      id: "panduan",
      label: "📖 Materi & PDF",
      badge: materi.lampiran?.length ? `${materi.lampiran.length} PDF` : null,
    },
    ...(videoData
      ? [
          {
            id: "video",
            label: "🎬 Video Tutorial",
            badge: "Video",
          },
        ]
      : []),
    ...(misiList.length > 0 || bahanLatihan.length > 0
      ? [
          {
            id: "praktik",
            label: "🎯 Praktik & Bahan",
            badge: misiList.length
              ? isAllMisiCompleted
                ? "Selesai ✓"
                : `${completedMisiCount}/${misiList.length} Misi`
              : bahanLatihan.length
              ? `${bahanLatihan.length} File`
              : null,
            badgeColor: isAllMisiCompleted ? "bg-emerald-400 text-black" : "bg-amber-300 text-black",
          },
        ]
      : []),
    {
      id: "kartu_catatan",
      label: "🃏 Kartu & Catatan",
      badge: kartuList.length ? `${kartuList.length} Kartu` : null,
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white space-y-5 animate-in fade-in duration-150">
      {/* ── Sub-Tab Navigation Bar (Neobrutalism Pills) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b-2 border-black/20 no-scrollbar">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl font-heading text-xs sm:text-sm font-black border-2 border-black transition-all shrink-0 cursor-pointer flex items-center gap-2 select-none ${
                isActive
                  ? "bg-black text-amber-300 shadow-[3px_3px_0px_0px_#f59e0b] translate-x-0.5 translate-y-0.5"
                  : "bg-[#FFFDF5] hover:bg-yellow-200 text-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
              }`}
            >
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-black ${
                    isActive
                      ? "bg-amber-300 text-black"
                      : t.badgeColor || "bg-yellow-100 text-black"
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: 📖 Panduan Teori & Dokumen PDF ────────────────────────── */}
      {activeTab === "panduan" && (
        <div className="space-y-5 animate-in fade-in zoom-in-98 duration-150">
          {/* Deskripsi / Rangkuman */}
          {materi.deskripsi && (
            <div className="p-4 bg-slate-50 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Rangkuman Materi:
              </span>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {materi.deskripsi}
              </p>
            </div>
          )}

          {/* Topik & Tips Trik Grid */}
          {materi.tipe_konten !== "quiz_saja" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topik.length > 0 && (
                <div className="p-4 bg-cyan-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center gap-1.5 font-heading text-xs font-black text-black uppercase mb-3 border-b border-black/20 pb-2">
                    <span className="bg-cyan-300 px-2 py-0.5 border border-black rounded">
                      📌
                    </span>
                    <span>Topik yang Dipelajari</span>
                  </div>
                  <ul className="space-y-2">
                    {topik.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-900"
                      >
                        <span className="w-4 h-4 bg-black text-cyan-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 rounded">
                          ✓
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {materi.tips && (
                <div className="p-4 bg-amber-100 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center gap-1.5 font-heading text-xs font-black text-black uppercase mb-2 border-b border-black/20 pb-2">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    <span>Tips Cepat dari Guru</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {materi.tips}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dokumen Panduan & Latihan Belajar (.PDF) */}
          {showMateriSection && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-black border-b-2 border-black pb-2 font-heading">
                <FileText className="w-4 h-4 text-black" />
                <span>Dokumen Panduan &amp; Latihan Belajar (.PDF)</span>
              </div>

              <div className="space-y-4">
                {materi.lampiran.map((lamp) => (
                  <MateriViewer
                    key={lamp.id}
                    fileUrl={lamp.url_publik}
                    fileName={lamp.nama_file}
                    fileSize={lamp.ukuran_mb}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: 🎬 Video Tutorial Singkat ────────────────────────────── */}
      {activeTab === "video" && videoData && (
        <div className="space-y-3 animate-in fade-in zoom-in-98 duration-150">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-black font-heading">
              <span className="w-6 h-6 bg-rose-500 text-white rounded flex items-center justify-center text-xs border border-black shadow-[1px_1px_0px_0px_#000]">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
              <span>🎬 Video Tutorial &amp; Demonstrasi Praktik</span>
            </div>
            <span className="text-[11px] font-bold bg-yellow-200 text-black px-2.5 py-0.5 border border-black rounded shadow-[1px_1px_0px_0px_#000]">
              Video Pendukung
            </span>
          </div>

          <div className="bg-black border-3 border-black rounded-xl overflow-hidden shadow-[5px_5px_0px_0px_#000]">
            {videoData.type === "direct" ? (
              <video
                controls
                className="w-full max-h-[480px] bg-black focus:outline-none"
              >
                <source src={videoData.embedUrl} type="video/mp4" />
                Browser kamu tidak mendukung pemutaran video langsung.
              </video>
            ) : (
              <div className="relative w-full aspect-video">
                <iframe
                  src={videoData.embedUrl}
                  title={`Video Tutorial ${materi.judul}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 font-medium italic">
            💡 Tonton video di atas untuk melihat demonstrasi cara pengerjaan langsung di aplikasi komputer.
          </p>
        </div>
      )}

      {/* ── TAB 3: 🎯 Praktik & Bahan Latihan ──────────────────────────── */}
      {activeTab === "praktik" && (
        <div className="space-y-4 animate-in fade-in zoom-in-98 duration-150">
          {/* 📁 Bahan Latihan Siap Pakai */}
          {bahanLatihan.length > 0 && (
            <div className="p-5 bg-amber-100/80 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/20 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-yellow-300 border-2 border-black rounded-lg flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                    📁
                  </span>
                  <div>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-black uppercase">
                      Bahan Latihan Siap Pakai (Starter Template)
                    </h4>
                    <p className="text-[11px] text-slate-700 font-medium">
                      Unduh file mentahan berikut untuk langsung kamu buka dan kerjakan di aplikasi komputermu:
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 border border-black rounded self-start sm:self-auto">
                  {bahanLatihan.length} File Tersedia
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {bahanLatihan.map((file, fIdx) => (
                  <a
                    key={fIdx}
                    href={file.url_file}
                    download={file.nama_file || `Bahan_Praktik_P${materi.pertemuan}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-heading font-black uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>Unduh: {file.nama_file || `Bahan Latihan P${materi.pertemuan}`}</span>
                    {file.ukuran_mb && (
                      <span className="text-[10px] font-mono text-slate-800 bg-white/80 px-1.5 py-0.2 border border-black rounded">
                        {file.ukuran_mb} MB
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 🎯 Misi Praktik Hari Ini */}
          {misiList.length > 0 && (
            <div className="p-5 sm:p-6 bg-emerald-50/80 border-3 border-black rounded-xl shadow-[5px_5px_0px_0px_#000] space-y-4">
              {/* Misi Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-emerald-400 border-2 border-black rounded-lg flex items-center justify-center font-heading font-black text-base text-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                    🎯
                  </span>
                  <div>
                    <h3 className="font-heading font-black text-sm sm:text-base text-black uppercase tracking-wide">
                      Misi Praktik Hari Ini (Hands-on Quest)
                    </h3>
                    <p className="text-xs text-slate-700 font-medium">
                      Buka aplikasi komputermu dan centang setiap langkah tantangan setelah berhasil kamu selesaikan!
                    </p>
                  </div>
                </div>

                {/* Progress Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span
                    className={`text-xs font-heading font-black px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all ${
                      isAllMisiCompleted
                        ? "bg-emerald-400 text-black animate-pulse"
                        : "bg-white text-black"
                    }`}
                  >
                    {completedMisiCount} / {misiList.length} Selesai ({progressMisiPct}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-white border-2 border-black rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, progressMisiPct)}%` }}
                />
              </div>

              {/* All Complete Celebration Banner */}
              {isAllMisiCompleted && (
                <div className="p-3.5 bg-emerald-300 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-heading font-black text-black">
                    <CheckCircle2 className="w-5 h-5 text-emerald-950 shrink-0" />
                    <span>🎉 Luar Biasa! Semua misi praktik pertemuan ini telah tuntas kamu selesaikan! (+50 XP) 🚀</span>
                  </div>
                  <button
                    type="button"
                    onClick={resetMisi}
                    className="inline-flex items-center gap-1 text-xs font-heading font-bold text-slate-900 hover:text-black bg-white/80 hover:bg-white px-2.5 py-1 border border-black rounded shadow-[1px_1px_0px_0px_#000] shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Ulangi Misi
                  </button>
                </div>
              )}

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {misiList.map((misi, idx) => {
                  const isDone = !!checkedMisi[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleMisi(idx)}
                      className={`w-full p-3.5 border-2 border-black rounded-xl text-left flex items-start gap-3.5 transition-all cursor-pointer select-none ${
                        isDone
                          ? "bg-emerald-200/90 shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5"
                          : "bg-white hover:bg-amber-100/70 shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Custom Neobrutalist Checkbox */}
                      <div
                        className={`w-6 h-6 border-2 border-black rounded-md flex items-center justify-center shrink-0 mt-0.5 font-black text-xs transition-colors ${
                          isDone
                            ? "bg-black text-emerald-300 shadow-none"
                            : "bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </div>

                      {/* Step Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-xs text-slate-600">
                            Langkah #{idx + 1}
                          </span>
                          {isDone && (
                            <span className="text-[10px] font-bold bg-black text-emerald-300 px-1.5 py-0.2 rounded font-heading">
                              Selesai ✓ (+15 XP)
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs sm:text-sm font-heading font-bold mt-0.5 leading-snug ${
                            isDone
                              ? "text-slate-700 line-through decoration-black decoration-2"
                              : "text-black"
                          }`}
                        >
                          {misi}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: 🃏 Kartu Pintar & Catatan Pribadi ────────────────────── */}
      {activeTab === "kartu_catatan" && (
        <div className="space-y-6 animate-in fade-in zoom-in-98 duration-150">
          {/* 🃏 Kartu Pintar Shortcut & Istilah (Interactive 3D Flip Flashcard) */}
          {kartuList.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-black font-heading">
                  <span className="w-6 h-6 bg-purple-400 text-black rounded flex items-center justify-center text-xs border border-black shadow-[1px_1px_0px_0px_#000]">
                    🃏
                  </span>
                  <span>Kartu Pintar Shortcut &amp; Istilah (Flip Cards)</span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-purple-100 text-black px-2 py-0.5 border border-black rounded">
                  Kartu {currentCardIdx + 1} dari {kartuList.length}
                </span>
              </div>

              <div className="flex flex-col items-center">
                {/* 3D Flip Card Container */}
                <div
                  className="w-full max-w-lg h-56 cursor-pointer select-none"
                  style={{ perspective: "1000px" }}
                  onClick={handleFlipCard}
                  title="Klik untuk membalik kartu"
                >
                  <div
                    className="w-full h-full relative transition-transform duration-500 rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000]"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* ── Front Face ── */}
                    <div
                      className="absolute inset-0 w-full h-full bg-[#FFFDF5] p-6 rounded-2xl flex flex-col justify-between items-center text-center backface-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-black uppercase bg-purple-300 text-black px-2 py-0.5 border border-black rounded font-heading">
                          💡 TANTANGAN INGATAN
                        </span>
                        <span className="text-xs text-slate-500 font-bold font-mono">
                          #{currentCardIdx + 1}
                        </span>
                      </div>

                      <div className="my-auto space-y-2">
                        <span className="text-2xl block">❓</span>
                        <p className="font-heading font-black text-base sm:text-lg text-black">
                          {kartuList[currentCardIdx]?.depan || "Pertanyaan Shortcut"}
                        </p>
                      </div>

                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 font-heading">
                        <span>👆 Klik kartu untuk melihat kunci jawaban (+5 XP)</span>
                      </div>
                    </div>

                    {/* ── Back Face (Answer) ── */}
                    <div
                      className="absolute inset-0 w-full h-full bg-amber-200 p-6 rounded-2xl flex flex-col justify-between items-center text-center backface-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-black uppercase bg-emerald-400 text-black px-2 py-0.5 border border-black rounded font-heading">
                          ✓ KUNCI JAWABAN
                        </span>
                        <span className="text-xs text-black font-black font-mono">
                          ⭐ +5 XP
                        </span>
                      </div>

                      <div className="my-auto space-y-2.5">
                        {/* Visual Retro Keyboard Keys */}
                        {kartuList[currentCardIdx]?.shortcut && (
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {kartuList[currentCardIdx].shortcut
                              .split("+")
                              .map((key, kIdx) => (
                                <span key={kIdx} className="flex items-center gap-1">
                                  <kbd className="px-3 py-1.5 bg-white text-black font-mono font-black text-sm uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]">
                                    {key.trim()}
                                  </kbd>
                                  {kIdx < kartuList[currentCardIdx].shortcut.split("+").length - 1 && (
                                    <span className="font-black text-black text-xs">+</span>
                                  )}
                                </span>
                              ))}
                          </div>
                        )}

                        <p className="font-heading font-black text-sm sm:text-base text-black">
                          {kartuList[currentCardIdx]?.belakang}
                        </p>
                        {kartuList[currentCardIdx]?.tips && (
                          <p className="text-xs text-slate-800 font-medium italic">
                            💡 {kartuList[currentCardIdx].tips}
                          </p>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1 font-heading">
                        <span>👆 Klik lagi untuk membalik ke pertanyaan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flashcard Navigation Bar */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-black font-heading font-black text-xs border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Kartu Sebelumnya
                  </button>

                  <button
                    type="button"
                    onClick={handleFlipCard}
                    className="px-4 py-1.5 bg-purple-400 hover:bg-purple-300 text-black font-heading font-black text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    {isFlipped ? "Tutup Jawaban" : "Buka Jawaban"}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextCard}
                    className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-black font-heading font-black text-xs border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                  >
                    Kartu Berikutnya <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-purple-50 border-2 border-black rounded-xl text-center font-mono text-xs text-slate-600">
              🃏 Belum ada kartu pintar shortcut khusus untuk pertemuan ini.
            </div>
          )}

          {/* 📝 Kotak Catatan Pribadi Siswa */}
          <div className="p-5 bg-amber-50/90 border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black/20 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-300 border-2 border-black rounded-lg flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                  📝
                </span>
                <div>
                  <h4 className="font-heading font-black text-xs sm:text-sm text-black uppercase">
                    Buku Catatan Pribadiku (Study Notes)
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Tulis rumus, catatan penting, atau trik yang baru kamu pelajari di pertemuan ini.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-600">
                {saveStatus === "saving" ? (
                  <span className="text-amber-600 flex items-center gap-1 animate-pulse">
                    <Save className="w-3 h-3" /> Menyimpan...
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 border border-black rounded">
                    <Check className="w-3 h-3" /> Tersimpan Otomatis
                  </span>
                )}
              </div>
            </div>

            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Tulis catatan atau rumus penting di sini (contoh: Ctrl+Shift+L untuk filter Excel, rumus =IF(A1>75,'Lulus','Remedial'))..."
              rows={3}
              className="w-full p-3.5 bg-white border-2 border-black rounded-lg shadow-inner text-xs sm:text-sm font-medium text-slate-900 focus:bg-yellow-50 focus:outline-none leading-relaxed resize-y font-mono"
            />
          </div>
        </div>
      )}

      {/* ── Action Footer: Tanya Guru WhatsApp + Tombol Mulai Quiz (Selalu Tampak) ─ */}
      <div className="pt-3 border-t-2 border-dashed border-black flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
        <div className="space-y-1">
          <span className="font-heading font-black text-xs sm:text-sm text-black block">
            🎮 Kuis &amp; Bantuan Belajar
          </span>
          <p className="text-slate-600 text-xs font-medium">
            Ada materi atau rumus yang membingungkan? Langsung tanya gurumu ya!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Tombol Tanya Guru WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-heading text-xs font-bold border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-black" />
            <span>Tanya Guru</span>
          </a>

          {/* Tombol Mulai Kuis */}
          {showQuizButton && (
            <button
              onClick={() => router.push(`/siswa/quiz?materi=${materi.id}`)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wide border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
            >
              <Brain className="w-4 h-4" />
              <span>Mulai Kuis P{materi.pertemuan}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
