"use client";

import { 
  Users, 
  AirVent, 
  Monitor, 
  Wifi, 
  ShieldCheck, 
  HardDrive, 
  Cpu,
  Laptop,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  Zap,
  Heart,
  CheckCircle2,
  FileText,
  Printer,
  Coffee,
  Headphones,
  Video,
  Globe,
  Folder,
  Calendar,
  MapPin,
  Star,
  Bookmark,
  ThumbsUp,
  HelpCircle,
  Smile,
  Layers,
  Settings,
  Key,
  Lock,
  Gift,
  Search,
  Bell,
  CreditCard,
  Package
} from "lucide-react";
import { useState } from "react";
import { formatWhatsAppUrl } from "@/lib/landingService";

export default function FasilitasSection({ data, globalWhatsapp }) {
  const [selectedPc, setSelectedPc] = useState(1);

  const showBadge = data?.showBadge !== false;
  const badgeText = data?.badgeText || "[LAB_ARCHITECTURE // PRIVATE_ROOM]";
  const titlePrefix = data?.titlePrefix || "DENAH KELAS 5-WORKSTATION:";
  const titleHighlight = data?.titleHighlight || "1 SISWA 1 UNIT KOMPUTER";
  const description = data?.description || "Kami menolak konsep kelas massal yang berisik dan tidak terarah. Di GWA Tech Course, setiap sesi hanya diisi 5 orang untuk menjamin bimbingan intensif dan pemahaman penuh.";

  const showWorkstations = data?.showWorkstations !== false;
  const showFacilitiesList = data?.showFacilitiesList !== false;
  const showStats = data?.showStats !== false;

  const defaultPcStations = [
    {
      id: 1,
      isVisible: true,
      name: "PC-01 // WORKSTATION",
      status: "TERSEDIA",
      isOnline: true,
      specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
      session: "Shift Pagi / Sore / Malam",
      color: "bg-emerald-300",
      accent: "border-emerald-500"
    },
    {
      id: 2,
      isVisible: true,
      name: "PC-02 // WORKSTATION",
      status: "TERSEDIA",
      isOnline: true,
      specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
      session: "Shift Pagi / Sore / Malam",
      color: "bg-emerald-300",
      accent: "border-emerald-500"
    },
    {
      id: 3,
      isVisible: true,
      name: "PC-03 // WORKSTATION",
      status: "TERISI (BATCH PAGI)",
      isOnline: false,
      specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
      session: "Slot Siang & Malam Tersedia",
      color: "bg-rose-200",
      accent: "border-rose-500"
    },
    {
      id: 4,
      isVisible: true,
      name: "PC-04 // WORKSTATION",
      status: "TERSEDIA",
      isOnline: true,
      specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
      session: "Shift Pagi / Sore / Malam",
      color: "bg-emerald-300",
      accent: "border-emerald-500"
    },
    {
      id: 5,
      isVisible: true,
      name: "PC-05 // WORKSTATION",
      status: "TERSEDIA",
      isOnline: true,
      specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
      session: "Shift Pagi / Sore / Malam",
      color: "bg-emerald-300",
      accent: "border-emerald-500"
    }
  ];

  const defaultFacilities = [
    {
      isVisible: true,
      title: "Maksimal 5 Siswa / Kelas",
      desc: "Suasana belajar privat & intensif. Mentor selalu standby di samping Anda untuk membimbing setiap kendala rumus dan tugas.",
      icon: <Users className="w-6 h-6 text-black" />,
      color: "bg-orange-300"
    },
    {
      isVisible: true,
      title: "1 Siswa 1 Unit Komputer",
      desc: "Tidak perlu repot membawa laptop sendiri. Setiap siswa disediakan 1 workstation PC spesifikasi mumpuni siap pakai.",
      icon: <Monitor className="w-6 h-6 text-black" />,
      color: "bg-cyan-300"
    },
    {
      isVisible: true,
      title: "Ruangan Ber-AC Dingin & Nyaman",
      desc: "Fasilitas ruang belajar ber-AC yang sejuk, bersih, bebas kebisingan, dan nyaman untuk konsentrasi belajar maksimal.",
      icon: <AirVent className="w-6 h-6 text-black" />,
      color: "bg-emerald-300"
    },
    {
      isVisible: true,
      title: "Modul Cetak + Portal LMS 24/7",
      desc: "Dapatkan buku panduan fisik eksklusif serta akses akun portal siswa untuk ujian kuis mandiri & download bahan latihan.",
      icon: <HardDrive className="w-6 h-6 text-black" />,
      color: "bg-amber-300"
    },
    {
      isVisible: true,
      title: "Free High-Speed WiFi Internet",
      desc: "Koneksi internet cepat untuk download data latihan, referensi riset dokumen, dan simulasi pengiriman email tugas kantor.",
      icon: <Wifi className="w-6 h-6 text-black" />,
      color: "bg-purple-300"
    },
    {
      isVisible: true,
      title: "Garansi Bimbingan Sampai Bisa",
      desc: "Belum paham di pertemuan tertentu? Bebas konsultasi tambahan dengan mentor tanpa biaya sepeserpun sampai benar-benar mahir.",
      icon: <ShieldCheck className="w-6 h-6 text-black" />,
      color: "bg-rose-300"
    }
  ];

  const defaultStats = [
    { isVisible: true, value: "500+", label: "Siswa Lulus Mahir", sub: "Tersebar di berbagai kantor & instansi" },
    { isVisible: true, value: "1 : 5", label: "Rasio Mentor Siswa", sub: "Maksimal 5 siswa per sesi pertemuan" },
    { isVisible: true, value: "98%", label: "Tingkat Kepuasan", sub: "Rekomendasi langsung dari alumni" },
    { isVisible: true, value: "100%", label: "Praktik Langsung", sub: "Bukan teori hafalan semata" }
  ];

  const iconMap = {
    Users: <Users className="w-6 h-6 text-black" />,
    Monitor: <Monitor className="w-6 h-6 text-black" />,
    AirVent: <AirVent className="w-6 h-6 text-black" />,
    HardDrive: <HardDrive className="w-6 h-6 text-black" />,
    Wifi: <Wifi className="w-6 h-6 text-black" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-black" />,
    Laptop: <Laptop className="w-6 h-6 text-black" />,
    Cpu: <Cpu className="w-6 h-6 text-black" />,
    BookOpen: <BookOpen className="w-6 h-6 text-black" />,
    Clock: <Clock className="w-6 h-6 text-black" />,
    Award: <Award className="w-6 h-6 text-black" />,
    Sparkles: <Sparkles className="w-6 h-6 text-black" />,
    Zap: <Zap className="w-6 h-6 text-black" />,
    Heart: <Heart className="w-6 h-6 text-black" />,
    CheckCircle2: <CheckCircle2 className="w-6 h-6 text-black" />,
    FileText: <FileText className="w-6 h-6 text-black" />,
    Printer: <Printer className="w-6 h-6 text-black" />,
    Coffee: <Coffee className="w-6 h-6 text-black" />,
    Headphones: <Headphones className="w-6 h-6 text-black" />,
    Video: <Video className="w-6 h-6 text-black" />,
    Globe: <Globe className="w-6 h-6 text-black" />,
    Folder: <Folder className="w-6 h-6 text-black" />,
    Calendar: <Calendar className="w-6 h-6 text-black" />,
    MapPin: <MapPin className="w-6 h-6 text-black" />,
    Star: <Star className="w-6 h-6 text-black" />,
    Bookmark: <Bookmark className="w-6 h-6 text-black" />,
    ThumbsUp: <ThumbsUp className="w-6 h-6 text-black" />,
    HelpCircle: <HelpCircle className="w-6 h-6 text-black" />,
    Smile: <Smile className="w-6 h-6 text-black" />,
    Layers: <Layers className="w-6 h-6 text-black" />,
    Settings: <Settings className="w-6 h-6 text-black" />,
    Key: <Key className="w-6 h-6 text-black" />,
    Lock: <Lock className="w-6 h-6 text-black" />,
    Gift: <Gift className="w-6 h-6 text-black" />,
    Search: <Search className="w-6 h-6 text-black" />,
    Bell: <Bell className="w-6 h-6 text-black" />,
    CreditCard: <CreditCard className="w-6 h-6 text-black" />,
    Package: <Package className="w-6 h-6 text-black" />
  };

  const rawPcStations = data?.pcStations || defaultPcStations;
  const pcStations = rawPcStations.filter((pc) => pc.isVisible !== false);

  const rawFacilities = data?.facilities || defaultFacilities;
  const facilities = rawFacilities
    .filter((f) => f.isVisible !== false)
    .map((f) => ({
      ...f,
      icon: f.icon || (f.iconName && iconMap[f.iconName]) || <Monitor className="w-6 h-6 text-black" />
    }));

  const rawStats = data?.stats || defaultStats;
  const stats = rawStats.filter((st) => st.isVisible !== false);

  const currentStation = pcStations.find(pc => pc.id === selectedPc) || pcStations[0] || defaultPcStations[0];

  return (
    <section id="fasilitas" className="py-20 lg:py-28 bg-[#FFFDF5] border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {showBadge && badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-purple-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] mb-4">
              <Cpu className="w-3.5 h-3.5" /> {badgeText}
            </div>
          )}
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4 uppercase">
            {titlePrefix} <br />
            {titleHighlight && (
              <span className="bg-purple-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
                {titleHighlight}
              </span>
            )}
          </h2>
          
          {description && (
            <p className="text-base sm:text-lg font-medium text-slate-700 mt-4 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* 5-Workstation Interactive Seating Map */}
        {showWorkstations && pcStations.length > 0 && (
          <div className="mb-16 neo-box-lg bg-slate-900 p-6 sm:p-8 text-white overflow-hidden relative">
            
            {/* Header Map */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-700 pb-4 mb-6 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-sm sm:text-base font-bold text-amber-300 uppercase tracking-wider">
                  LAYOUT MEJA PRAKTIK GWA LAB (5 WORKSTATIONS)
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> HIJAU = TERSEDIA
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span> MERAH = TERISI
                </span>
              </div>
            </div>

            {/* Workstations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {pcStations.map((pc) => {
                const isSelected = selectedPc === pc.id;
                return (
                  <div
                    key={pc.id}
                    onClick={() => setSelectedPc(pc.id)}
                    className={`p-4 border-2 border-black transition-all cursor-pointer select-none flex flex-col justify-between ${
                      isSelected 
                        ? "bg-amber-300 text-black shadow-[4px_4px_0px_0px_#FFF] -translate-y-1" 
                        : "bg-slate-800 text-white hover:bg-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <div>
                      {/* PC Header Status */}
                      <div className="flex items-center justify-between font-mono text-[11px] mb-3">
                        <span className="font-black">{pc.name || `PC-0${pc.id}`}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${pc.isOnline ? "bg-emerald-400" : "bg-rose-500"}`}></span>
                      </div>

                      {/* Computer Icon Visual */}
                      <div className={`w-12 h-12 mx-auto my-2 border-2 border-black flex items-center justify-center ${
                        isSelected ? "bg-black text-amber-300" : "bg-slate-950 text-emerald-400"
                      }`}>
                        <Monitor className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/20 font-mono text-[10px] text-center">
                      <span className={`px-1.5 py-0.5 font-bold uppercase inline-block border border-black ${
                        pc.isOnline 
                          ? (isSelected ? "bg-black text-emerald-400" : "bg-emerald-400 text-black")
                          : (isSelected ? "bg-black text-rose-400" : "bg-rose-500 text-white")
                      }`}>
                        {pc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Station Detail Interactive Bar */}
            {currentStation && (
              <div className="bg-slate-950 border-2 border-slate-700 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-sm sm:text-base">{currentStation.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-black ${
                      currentStation.isOnline ? "bg-emerald-300 text-black" : "bg-rose-300 text-black"
                    }`}>
                      STATUS: {currentStation.status}
                    </span>
                  </div>
                  <p className="text-slate-300 font-bold mt-2">
                    Spesifikasi: <span className="font-normal text-slate-300">{currentStation.specs}</span>
                  </p>
                  <p className="text-slate-300 font-bold mt-0.5">
                    Opsi Jadwal: <span className="font-normal text-slate-300">{currentStation.session || "Shift Pagi / Sore / Malam"}</span>
                  </p>
                </div>

                <a 
                  href={formatWhatsAppUrl(globalWhatsapp, `Halo Admin GWA, saya ingin booking kursi komputer Slot 0${currentStation.id} (${currentStation.name || ""}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap self-start md:self-center flex items-center gap-2"
                >
                  <span>&gt;_</span> BOOKING SLOT 0{currentStation.id} SEKARANG
                </a>
              </div>
            )}

          </div>
        )}

        {/* 6 Lab Facilities Grid */}
        {showFacilitiesList && facilities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {facilities.map((fac, idx) => (
              <div 
                key={idx}
                className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`${fac.color || "bg-orange-300"} w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0`}>
                    {fac.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-black text-black mb-1.5">
                      {fac.title}
                    </h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Metrics Bar */}
        {showStats && stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-amber-300 border-3 border-black shadow-[6px_6px_0px_0px_#000]">
            {stats.map((st, idx) => (
              <div key={idx} className="text-center sm:text-left border-r-0 sm:border-r-2 last:border-r-0 border-black pr-0 sm:pr-4">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black">
                  {st.value}
                </div>
                <div className="font-mono text-xs sm:text-sm font-black text-black uppercase mt-1">
                  {st.label}
                </div>
                {st.sub && (
                  <p className="text-[11px] font-medium text-slate-900 mt-0.5 hidden sm:block">
                    {st.sub}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
