'use client';

import { useState } from 'react';
import BalloonHuntGame from './BalloonHuntGame';
import TreasureHuntGame from './TreasureHuntGame';
import BurgerFactoryGame from './BurgerFactoryGame';
import MagicLensGame from './MagicLensGame';
import GameHubSelector from './GameHubSelector';

export default function GameMouseArena() {
  const [activeGame, setActiveGame] = useState('balon-terbang'); // 'balon-terbang' | 'harta-karun' | 'pabrik-burger'

  const handleSelectGame = (gameId) => {
    setActiveGame(gameId);
    // Scroll mulus ke area game jika pengguna mengklik kartu di bawah
    const arenaEl = document.getElementById('arena-game-section');
    if (arenaEl) {
      arenaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* ── SELECTOR TAB WAHANA GAME AKTIF ───────────────────────── */}
      <section id="arena-game-section" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveGame('balon-terbang')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'balon-terbang'
                  ? 'bg-amber-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-amber-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🎈</span>
              <span>Game 1: Buru Balon</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Klik Kiri
              </span>
            </button>

            <button
              onClick={() => setActiveGame('harta-karun')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'harta-karun'
                  ? 'bg-purple-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-purple-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>💎</span>
              <span>Game 2: Harta Karun</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Double Click
              </span>
            </button>

            <button
              onClick={() => setActiveGame('pabrik-burger')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'pabrik-burger'
                  ? 'bg-emerald-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-emerald-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🍔</span>
              <span>Game 3: Pabrik Burger</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Drag & Drop
              </span>
            </button>

            <button
              onClick={() => setActiveGame('kaca-pembesar')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-heading font-black text-xs sm:text-sm uppercase border-3 border-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeGame === 'kaca-pembesar'
                  ? 'bg-cyan-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white hover:bg-cyan-100 text-slate-800 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <span>🔍</span>
              <span>Game 4: Kaca Pembesar</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-black/30">
                Klik Kanan
              </span>
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-slate-600 bg-white border border-black px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_#000]">
            {activeGame === 'balon-terbang'
              ? 'Fokus: Klik Kiri & Akurasi • 5 Babak'
              : activeGame === 'harta-karun'
              ? 'Fokus: Double Click & Kestabilan • 5 Ruang'
              : activeGame === 'pabrik-burger'
              ? 'Fokus: Drag & Drop (Seret & Lepas) • 5 Shift'
              : 'Fokus: Klik Kanan & Menu Rahasia • 5 Lokasi'}
          </div>
        </div>

        {/* Render Game Sesuai Pilihan */}
        {activeGame === 'balon-terbang' && <BalloonHuntGame />}
        {activeGame === 'harta-karun' && <TreasureHuntGame />}
        {activeGame === 'pabrik-burger' && <BurgerFactoryGame />}
        {activeGame === 'kaca-pembesar' && <MagicLensGame />}
      </section>

      {/* ── ETALASE 6 GAME PENGUASAAN MOUSE ──────────────────────── */}
      <section aria-label="Daftar 6 Game Penguasaan Mouse">
        <GameHubSelector
          activeGameId={activeGame}
          onSelectGame={handleSelectGame}
        />
      </section>
    </div>
  );
}
