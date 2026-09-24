'use client';

import { useState } from 'react';
import FrogJumpGame from './FrogJumpGame';
import RocketLaunchGame from './RocketLaunchGame';
import MonsterHurufGame from './MonsterHurufGame';
import TeriakBisikGame from './TeriakBisikGame';
import GameKeyboardHubSelector from './GameKeyboardHubSelector';
import { Sparkles, Clock, Lock, Play, ArrowRight } from 'lucide-react';

export default function GameKeyboardArena() {
  const [activeGame, setActiveGame] = useState('katak-melompat');

  const handleSelectGame = (gameId) => {
    setActiveGame(gameId);
    const arenaEl = document.getElementById('arena-keyboard-section');
    if (arenaEl) {
      arenaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* ── SELECTOR TAB WAHANA GAME AKTIF ───────────────────────── */}
      <section id="arena-keyboard-section" className="space-y-4 scroll-mt-24 sm:scroll-mt-28">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveGame('katak-melompat')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'katak-melompat'
                  ? 'bg-emerald-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-emerald-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🐸</span>
              <span>Game 1: Katak Melompat</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Spacebar
              </span>
            </button>

            <button
              onClick={() => setActiveGame('peluncuran-roket')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'peluncuran-roket'
                  ? 'bg-blue-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-blue-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🚀</span>
              <span>Game 2: Peluncuran Roket</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Enter
              </span>
            </button>

            <button
              onClick={() => setActiveGame('monster-huruf')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'monster-huruf'
                  ? 'bg-rose-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-rose-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>👾</span>
              <span>Game 3: Monster Huruf</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Backspace / Del
              </span>
            </button>

            <button
              onClick={() => setActiveGame('teriak-bisik')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'teriak-bisik'
                  ? 'bg-purple-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-purple-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>📢</span>
              <span>Game 4: Teriak vs Bisik</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Caps Lock
              </span>
            </button>

            <button
              onClick={() => setActiveGame('lampu-sorot')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'lampu-sorot'
                  ? 'bg-cyan-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-cyan-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🔦</span>
              <span>Game 5: Lampu Sorot</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Shift Simbol
              </span>
            </button>

            <button
              onClick={() => setActiveGame('mesin-pengganda')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'mesin-pengganda'
                  ? 'bg-amber-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-amber-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🤖</span>
              <span>Game 6: Mesin Pengganda</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Ctrl+C & Ctrl+V
              </span>
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-slate-600 bg-white border border-black px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_#000]">
            {activeGame === 'katak-melompat'
              ? 'Fokus: Spacebar (Lompat 1x & 2x Spasi Cepat) • 5 Babak (~5 Menit)'
              : activeGame === 'peluncuran-roket'
              ? 'Fokus: Enter (Eksekusi, Ignisi & Peluncuran) • 5 Lapisan Orbit'
              : activeGame === 'monster-huruf'
              ? 'Fokus: Backspace vs Delete (Kiri vs Kanan Kursor) • 5 Babak Kata'
              : activeGame === 'teriak-bisik'
              ? 'Fokus: Caps Lock (Toggle Kapital vs Huruf Kecil) • 5 Ruang Misi'
              : activeGame === 'lampu-sorot'
              ? 'Fokus: Shift & Karakter Khusus (!@#$%^&*) • 5 Langit Simbol'
              : 'Fokus: Duplikasi Cepat Ctrl+C & Ctrl+V • 5 Jalur Ban Pabrik'}
          </div>
        </div>

        {/* ── RENDER GAME SESUAI PILIHAN TAB ───────────────────────── */}
        {activeGame === 'katak-melompat' && <FrogJumpGame />}
        {activeGame === 'peluncuran-roket' && <RocketLaunchGame />}
        {activeGame === 'monster-huruf' && <MonsterHurufGame />}
        {activeGame === 'teriak-bisik' && <TeriakBisikGame />}

        {activeGame !== 'katak-melompat' &&
          activeGame !== 'peluncuran-roket' &&
          activeGame !== 'monster-huruf' &&
          activeGame !== 'teriak-bisik' && (
          <div className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-8 sm:p-12 text-center space-y-5">
            <div className="w-20 h-20 bg-amber-200 border-3 border-black rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#000]">
              {activeGame === 'teriak-bisik'
                ? '📢'
                : activeGame === 'lampu-sorot'
                ? '🔦'
                : '🤖'}
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-300 border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_0px_#000] uppercase">
                Dalam Tahap Persiapan Rilis
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-black">
                {activeGame === 'teriak-bisik'
                  ? 'Game 4: Mode Berteriak vs Berbisik (Fokus: Caps Lock)'
                  : activeGame === 'lampu-sorot'
                  ? 'Game 5: Lampu Sorot Jari (Fokus: Shift & Simbol Khusus)'
                  : 'Game 6: Mesin Pengganda (Fokus: Ctrl+C & Ctrl+V)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Modul ini sedang disiapkan dengan tantangan 5 babak (4–5 menit) untuk memperkuat penguasaan tombol fungsi keyboard. Silakan mainkan <strong>Game 1: Katak Melompat</strong>, <strong>Game 2: Peluncuran Roket</strong>, atau <strong>Game 3: Monster Pemakan Huruf</strong> terlebih dahulu!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveGame('katak-melompat')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
              >
                <span>🐸 Game 1: Katak Melompat</span>
              </button>
              <button
                onClick={() => setActiveGame('peluncuran-roket')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-400 hover:bg-blue-300 border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
              >
                <span>🚀 Game 2: Peluncuran Roket</span>
              </button>
              <button
                onClick={() => setActiveGame('monster-huruf')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-400 hover:bg-rose-300 border-3 border-black font-heading font-black text-xs sm:text-sm text-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
              >
                <span>👾 Game 3: Monster Huruf</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── ETALASE 6 GAME PENGUASAAN KEYBOARD ───────────────────── */}
      <section aria-label="Daftar 6 Game Penguasaan Keyboard">
        <GameKeyboardHubSelector
          activeGameId={activeGame}
          onSelectGame={handleSelectGame}
        />
      </section>
    </div>
  );
}
