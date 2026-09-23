'use client';

import { 
  Play, 
  Lock, 
  Sparkles, 
  MousePointer2, 
  Layers, 
  Compass, 
  Palette, 
  Search, 
  ArrowUpCircle,
  Clock
} from 'lucide-react';

const MOUSE_GAMES = [
  {
    id: 'balon-terbang',
    title: 'Buru Balon Terbang',
    focus: 'Klik Kiri & Akurasi',
    desc: 'Balon aneka warna melayang dari bawah ke atas. Bidik kursor dan klik tepat pada sasaran untuk memecahkannya.',
    icon: '🎈',
    duration: '4-5 Menit',
    status: 'ready', // 'ready' | 'upcoming'
    color: 'bg-amber-300',
    borderColor: 'border-black',
    tagColor: 'bg-emerald-300 text-black',
    tagText: 'SIAP DIMAINKAN',
  },
  {
    id: 'harta-karun',
    title: 'Detektif Harta Karun',
    focus: 'Klik Ganda (Double Click)',
    desc: 'Buka peti rahasia, cangkang mutiara, dan pintu gua misterius menggunakan ketukan double-click yang cepat dan stabil.',
    icon: '💎',
    duration: '4-5 Menit',
    status: 'ready',
    color: 'bg-purple-200',
    borderColor: 'border-purple-900',
    tagColor: 'bg-purple-300 text-black',
    tagText: 'SIAP DIMAINKAN',
  },
  {
    id: 'pabrik-burger',
    title: 'Pabrik Burger Cilik',
    focus: 'Seret & Lepas (Drag-and-Drop)',
    desc: 'Rakit lapisan burger lezat ke atas piring saji dengan menahan klik kiri, menggeser bahan, dan melepasnya sesuai tiket pesanan pelanggan.',
    icon: '🍔',
    duration: '4-5 Menit',
    status: 'ready',
    color: 'bg-emerald-200',
    borderColor: 'border-emerald-900',
    tagColor: 'bg-emerald-300 text-black',
    tagText: 'SIAP DIMAINKAN',
  },
  {
    id: 'kaca-pembesar',
    title: 'Kaca Pembesar Ajaib',
    focus: 'Klik Kanan (Right Click)',
    desc: 'Gunakan tombol kanan mouse untuk membuka menu konteks rahasia, mengungkap benda tersembunyi, dan mengidentifikasi fosil.',
    icon: '🔍',
    duration: '4-5 Menit',
    status: 'ready',
    color: 'bg-cyan-200',
    borderColor: 'border-cyan-900',
    tagColor: 'bg-cyan-300 text-black',
    tagText: 'SIAP DIMAINKAN',
  },
  {
    id: 'penyelam-laut',
    title: 'Penyelam Laut Dalam',
    focus: 'Roda Gulir (Scroll Wheel)',
    desc: 'Putar roda scroll mouse untuk menyelam ke palung laut terdalam, menghindari terumbu karang, dan zoom melihat biota laut langka.',
    icon: '🌊',
    duration: '4-5 Menit',
    status: 'ready',
    color: 'bg-blue-200',
    borderColor: 'border-blue-900',
    tagColor: 'bg-blue-300 text-black',
    tagText: 'SIAP DIMAINKAN',
  },
  {
    id: 'seniman-cilik',
    title: 'Seniman Cilik Paint',
    focus: 'Koordinasi Motorik Total',
    desc: 'Hubungkan titik-titik berpola, warnai kanvas digital, dan gerakkan kuas bebas untuk menyempurnakan kelenturan tangan.',
    icon: '🎨',
    duration: '5 Menit',
    status: 'upcoming',
    color: 'bg-rose-200',
    borderColor: 'border-rose-900',
    tagColor: 'bg-slate-200 text-slate-700',
    tagText: 'SEGERA HADIR',
  },
];

export default function GameHubSelector({ activeGameId = 'balon-terbang', onSelectGame }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-3">
        <div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-black flex items-center gap-2">
            <span>🎮</span>
            <span>Koleksi 6 Game Penguasaan Mouse</span>
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-0.5">
            Setiap game dirancang selesai dalam 4–5 menit untuk melatih keterampilan fisik mouse yang berbeda.
          </p>
        </div>
        <div className="bg-amber-300 border-2 border-black px-3 py-1 rounded-md text-[11px] font-mono font-bold shadow-[2px_2px_0px_0px_#000]">
          Total 6 Modul Game Edukasi
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOUSE_GAMES.map((game) => {
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
                  ? 'bg-white hover:bg-amber-50 shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] cursor-pointer'
                  : 'bg-slate-100 opacity-80 shadow-[2px_2px_0px_0px_#cbd5e1] cursor-not-allowed'
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

                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
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
                {isReady && (
                  <span className="text-[10px] font-mono font-bold bg-white border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">
                    5 Babak
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
