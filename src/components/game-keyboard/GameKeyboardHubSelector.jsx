'use client';

import { Play, Lock, Clock, Sparkles } from 'lucide-react';

export const KEYBOARD_GAMES = [
  {
    id: 'katak-melompat',
    title: 'Katak Melompat',
    focus: 'Fokus: Spacebar (Tunggal & Ganda)',
    desc: 'Latih timing jempol menekan Spacebar di waktu yang tepat agar katak melompat ke teratai. Ketuk 2x cepat untuk lompatan ganda melewati celah sungai!',
    icon: '🐸',
    duration: '4-5 Menit',
    status: 'ready', // 'ready' | 'upcoming'
    color: 'bg-emerald-300',
    tagColor: 'bg-emerald-300 text-black',
    tagText: 'SIAP DIMAINKAN',
    waves: '5 Babak Ekspedisi',
  },
  {
    id: 'peluncuran-roket',
    title: 'Peluncuran Roket Antariksa',
    focus: 'Fokus: Enter (Eksekusi & Ignisi)',
    desc: 'Isi tekanan bahan bakar dengan mengetik kata sandi peluncuran lalu tekan tombol ENTER pada zona hijau untuk ignisi roket menuju orbit luar angkasa.',
    icon: '🚀',
    duration: '4-5 Menit',
    status: 'upcoming',
    color: 'bg-blue-200',
    tagColor: 'bg-amber-200 text-amber-900',
    tagText: 'SEGERA HADIR',
    waves: '5 Lapisan Orbit',
  },
  {
    id: 'monster-huruf',
    title: 'Monster Pemakan Huruf',
    focus: 'Fokus: Backspace vs Delete',
    desc: 'Pahami perbedaan arah kursor! Monster Kiri hanya memakan huruf di sebelah kiri kursor (Backspace), sedangkan Monster Kanan memakan huruf di sebelah kanan (Delete).',
    icon: '👾',
    duration: '4-5 Menit',
    status: 'upcoming',
    color: 'bg-rose-200',
    tagColor: 'bg-amber-200 text-amber-900',
    tagText: 'SEGERA HADIR',
    waves: '5 Teka-Teki Kata',
  },
  {
    id: 'teriak-bisik',
    title: 'Mode Berteriak vs Berbisik',
    focus: 'Fokus: Tombol Caps Lock',
    desc: 'Bantu robot penyusup menyesuaikan diri: nyalakan Caps Lock untuk mode berteriak di keramaian konser, dan matikan Caps Lock untuk mode berbisik huruf kecil di malam hari.',
    icon: '📢',
    duration: '4-5 Menit',
    status: 'upcoming',
    color: 'bg-purple-200',
    tagColor: 'bg-amber-200 text-amber-900',
    tagText: 'SEGERA HADIR',
    waves: '5 Ruang Misi',
  },
  {
    id: 'lampu-sorot',
    title: 'Lampu Sorot Jari Ajaib',
    focus: 'Fokus: Shift & Simbol Khusus',
    desc: 'Nyalakan lampu sorot mercusuar untuk mengungkap simbol misterius (!, @, #, $, %, &, *) yang berterbangan di langit malam dengan menahan tombol Shift.',
    icon: '🔦',
    duration: '4-5 Menit',
    status: 'upcoming',
    color: 'bg-cyan-200',
    tagColor: 'bg-amber-200 text-amber-900',
    tagText: 'SEGERA HADIR',
    waves: '5 Langit Simbol',
  },
  {
    id: 'mesin-pengganda',
    title: 'Mesin Pengganda Robot',
    focus: 'Fokus: Kombinasi Ctrl+C & Ctrl+V',
    desc: 'Pabrik robotika otomatis membutuhkan bantuanmu! Salin pola cetakan blueprint suku cadang (Ctrl+C) dan tempelkan (Ctrl+V) berkali-kali pada ban berjalan pabrik.',
    icon: '🤖',
    duration: '4-5 Menit',
    status: 'upcoming',
    color: 'bg-amber-200',
    tagColor: 'bg-amber-200 text-amber-900',
    tagText: 'SEGERA HADIR',
    waves: '5 Jalur Pabrik',
  },
];

export default function GameKeyboardHubSelector({ activeGameId = 'katak-melompat', onSelectGame }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-3">
        <div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-black flex items-center gap-2">
            <span>⌨️</span>
            <span>Koleksi 6 Game Penguasaan Keyboard Siswa</span>
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-0.5">
            Setiap game dirancang selesai dalam <strong>4–5 menit</strong> guna membentuk memori otot jemari untuk tombol fungsi esensial.
          </p>
        </div>
        <div className="bg-amber-300 border-2 border-black px-3 py-1 rounded-md text-[11px] font-mono font-bold shadow-[2px_2px_0px_0px_#000]">
          Total 6 Game Edukasi Keyboard
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KEYBOARD_GAMES.map((game) => {
          const isCurrentActive = activeGameId === game.id;
          const isReady = game.status === 'ready';

          return (
            <div
              key={game.id}
              onClick={() => {
                if (isReady && onSelectGame) onSelectGame(game.id);
              }}
              className={`border-3 border-black rounded-xl p-4 transition-all relative flex flex-col justify-between ${
                isCurrentActive
                  ? 'bg-amber-300 shadow-[5px_5px_0px_0px_#000] -translate-y-0.5'
                  : isReady
                  ? 'bg-white hover:bg-emerald-50 shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] cursor-pointer'
                  : 'bg-slate-100 opacity-85 shadow-[2px_2px_0px_0px_#cbd5e1] cursor-not-allowed'
              }`}
            >
              {/* Top Header Card */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000] shrink-0">
                    {game.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border border-black uppercase shadow-[1px_1px_0px_0px_#000] ${game.tagColor}`}
                    >
                      {game.tagText}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{game.duration}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-black text-base text-black leading-tight">
                    {game.title}
                  </h3>
                  <div className="inline-block mt-1 px-2 py-0.5 bg-black text-amber-300 text-[10px] font-mono font-bold rounded">
                    {game.focus}
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-3">
                  {game.desc}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                {isReady ? (
                  <div className="flex items-center gap-1 text-xs font-mono font-black text-black">
                    <Play className={`w-3.5 h-3.5 ${isCurrentActive ? 'fill-black' : ''}`} />
                    <span>{isCurrentActive ? 'Sedang Dimainkan' : 'Klik untuk Main'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Dalam Pengembangan</span>
                  </div>
                )}
                <span className="text-[10px] font-mono font-bold bg-white border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                  {game.waves}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
