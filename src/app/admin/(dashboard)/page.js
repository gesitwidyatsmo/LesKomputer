"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar as CalendarIcon, ArrowUpRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "@/lib/adminService";
import { getSemuaKelas } from "@/lib/kelasService";

export default function DashboardOverview() {
  const [dashboardStats, setDashboardStats] = useState({
    totalSiswaAktif: 0,
    totalKelasAktif: 0,
    totalSiswaLulus: 0,
    chartData: []
  });
  
  const [jadwalAktif, setJadwalAktif] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getDashboardStats();
      if (!stats.error) {
        setDashboardStats(stats);
      }
      
      const { data } = await getSemuaKelas();
      if (data) {
        // Hanya ambil kelas berjalan
        setJadwalAktif(data.filter(k => k.status === 'Berjalan'));
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { 
      metric: "SYS_METRIC // 01", 
      name: "Siswa Aktif", 
      value: dashboardStats.totalSiswaAktif, 
      sub: "Peserta Kursus", 
      icon: <Users className="w-5 h-5 text-black" />, 
      bgIcon: "bg-cyan-300", 
      accentColor: "bg-cyan-500" 
    },
    { 
      metric: "SYS_METRIC // 02", 
      name: "Kelas Berjalan", 
      value: dashboardStats.totalKelasAktif, 
      sub: "Slot Lab Aktif", 
      icon: <BookOpen className="w-5 h-5 text-black" />, 
      bgIcon: "bg-orange-300", 
      accentColor: "bg-orange-500" 
    },
    { 
      metric: "SYS_METRIC // 03", 
      name: "Siswa Lulus", 
      value: dashboardStats.totalSiswaLulus, 
      sub: "Telah Bersertifikat", 
      icon: <GraduationCap className="w-5 h-5 text-black" />, 
      bgIcon: "bg-emerald-300", 
      accentColor: "bg-emerald-500" 
    },
    { 
      metric: "SYS_METRIC // 04", 
      name: "Tingkat Kehadiran", 
      value: "94.8%", 
      sub: "Bulan Berjalan", 
      icon: <TrendingUp className="w-5 h-5 text-black" />, 
      bgIcon: "bg-amber-300", 
      accentColor: "bg-amber-400" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-yellow-300 border border-black text-black">
              [SYS_OVERVIEW // LIVE]
            </span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              HOST: LOCALHOST
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black">
            Dashboard Kontrol Admin
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-600 mt-0.5">
            Ringkasan data real-time, monitoring kelas 5-PC, dan progres siswa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/siswa"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-bold text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span className="font-mono">{">_"}</span> Kelola Siswa
          </Link>
          <Link
            href="/admin/kelas"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-cyan-100 text-black font-heading font-bold text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Jadwal Lab
          </Link>
        </div>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 transition-transform"
          >
            {/* Top Accent Strip */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.accentColor}`}></div>
            
            <div className="flex items-start justify-between mt-1">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {stat.metric}
                </span>
                <p className="text-xs font-bold text-slate-700 uppercase mt-0.5">{stat.name}</p>
                <h4 className="text-3xl font-heading font-black text-black mt-1">
                  {stat.value}
                </h4>
              </div>
              <div className={`p-2.5 ${stat.bgIcon} border-2 border-black shadow-[2px_2px_0px_0px_#000]`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="mt-4 pt-2.5 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-xs font-mono">
              <span className="text-black font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {stat.sub}
              </span>
              <span className="text-slate-400">[OK]</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Window */}
        <div className="lg:col-span-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col overflow-hidden">
          {/* Retro Window Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span>analytics_siswa_distribution.exe</span>
            </div>
            <span className="text-[10px] text-cyan-300">[CHART_ACTIVE]</span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-black text-black uppercase tracking-tight">
                  Distribusi Siswa per Modul & Kelas
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Visualisasi kapasitas dan alokasi peserta kursus
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-yellow-100 border border-black text-xs font-mono font-bold">
                <Activity className="w-3.5 h-3.5 text-orange-600" /> REALTIME_FEED
              </div>
            </div>

            <div className="h-56 sm:h-72 w-full min-w-0 bg-[#FFFDF5] p-3 border-2 border-black">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardStats.chartData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSiswa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={{ stroke: '#000000', strokeWidth: 1.5 }} 
                    tickLine={false} 
                    tick={{ fill: '#0F172A', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' }} 
                    dy={5} 
                  />
                  <YAxis 
                    axisLine={{ stroke: '#000000', strokeWidth: 1.5 }} 
                    tickLine={false} 
                    tick={{ fill: '#0F172A', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '2px solid #000000', 
                      boxShadow: '3px 3px 0px 0px #000000',
                      borderRadius: '0px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    labelStyle={{ fontWeight: '900', color: '#000000', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="siswa" 
                    name="Jumlah Siswa"
                    stroke="#FF6B00" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorSiswa)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Schedules Window */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col overflow-hidden">
          {/* Retro Window Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span>live_classes_queue.exe</span>
            </div>
            <span className="text-[10px] text-emerald-400">[ACTIVE]</span>
          </div>
          
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-base font-heading font-black text-black uppercase tracking-tight">
                Kelas Aktif Berjalan
              </h3>
              <span className="px-2 py-0.5 bg-emerald-300 border border-black text-black font-mono text-[10px] font-bold">
                {jadwalAktif.length} KELAS
              </span>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[290px]">
              {jadwalAktif.map((jadwal) => (
                <div 
                  key={jadwal.id} 
                  className="p-3.5 bg-[#FFFDF5] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-heading font-bold text-sm text-black">{jadwal.nama}</h4>
                  </div>
                  <div className="text-xs font-mono text-slate-700 flex justify-between items-center mt-2 pt-2 border-t border-dashed border-slate-300">
                    <span className="font-semibold">{jadwal.jadwal} // {jadwal.waktu}</span>
                    <span className="flex items-center gap-1 font-bold text-orange-600">
                      <span className="w-1.5 h-1.5 bg-orange-500 inline-block"></span>
                      {jadwal.mentor || 'Mentor'}
                    </span>
                  </div>
                </div>
              ))}
              {jadwalAktif.length === 0 && (
                <div className="text-center py-10 bg-[#FFFDF5] border-2 border-dashed border-slate-300 text-slate-500 text-xs font-mono">
                  [EMPTY] Belum ada kelas aktif berjalan saat ini.
                </div>
              )}
            </div>
            
            <Link 
              href="/admin/kelas"
              className="w-full mt-4 py-2.5 bg-white hover:bg-yellow-300 text-black font-heading font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              Lihat Manajemen Jadwal Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
