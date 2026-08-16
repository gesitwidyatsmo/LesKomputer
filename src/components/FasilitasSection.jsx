"use client";

import { 
  Users, 
  AirVent, 
  Monitor, 
  GraduationCap, 
  Building, 
  Wifi, 
  ShieldCheck, 
  Sparkles,
  Terminal,
  Cpu,
  CheckCircle2,
  HardDrive,
  Clock
} from "lucide-react";
import { useState } from "react";

export default function FasilitasSection() {
  const [selectedPc, setSelectedPc] = useState(1);

  const pcStations = [
    {
      id: 1,
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
      name: "PC-05 // WORKSTATION",
      status: "TERSEDIA",
      isOnline: true,
      specs: "Intel Core i5 // 16GB RAM // Dual Monitor // Office 365 Pro",
      session: "Shift Pagi / Sore / Malam",
      color: "bg-emerald-300",
      accent: "border-emerald-500"
    }
  ];

  const facilities = [
    {
      title: "Maksimal 5 Siswa / Kelas",
      desc: "Suasana belajar privat & intensif. Mentor selalu standby di samping Anda untuk membimbing setiap kendala rumus dan tugas.",
      icon: <Users className="w-6 h-6 text-black" />,
      color: "bg-orange-300"
    },
    {
      title: "1 Siswa 1 Unit Komputer",
      desc: "Tidak perlu repot membawa laptop sendiri. Setiap siswa disediakan 1 workstation PC spesifikasi mumpuni siap pakai.",
      icon: <Monitor className="w-6 h-6 text-black" />,
      color: "bg-cyan-300"
    },
    {
      title: "Ruangan Ber-AC Dingin & Nyaman",
      desc: "Fasilitas ruang belajar ber-AC yang sejuk, bersih, bebas kebisingan, dan nyaman untuk konsentrasi belajar maksimal.",
      icon: <AirVent className="w-6 h-6 text-black" />,
      color: "bg-emerald-300"
    },
    {
      title: "Modul Cetak + Portal LMS 24/7",
      desc: "Dapatkan buku panduan fisik eksklusif serta akses akun portal siswa untuk ujian kuis mandiri & download bahan latihan.",
      icon: <HardDrive className="w-6 h-6 text-black" />,
      color: "bg-amber-300"
    },
    {
      title: "Free High-Speed WiFi Internet",
      desc: "Koneksi internet cepat untuk download data latihan, referensi riset dokumen, dan simulasi pengiriman email tugas kantor.",
      icon: <Wifi className="w-6 h-6 text-black" />,
      color: "bg-purple-300"
    },
    {
      title: "Garansi Bimbingan Sampai Bisa",
      desc: "Belum paham di pertemuan tertentu? Bebas konsultasi tambahan dengan mentor tanpa biaya sepeserpun sampai benar-benar mahir.",
      icon: <ShieldCheck className="w-6 h-6 text-black" />,
      color: "bg-rose-300"
    }
  ];

  const stats = [
    { value: "500+", label: "Siswa Lulus Mahir", sub: "Tersebar di berbagai kantor & instansi" },
    { value: "1 : 5", label: "Rasio Mentor Siswa", sub: "Maksimal 5 siswa per sesi pertemuan" },
    { value: "98%", label: "Tingkat Kepuasan", sub: "Rekomendasi langsung dari alumni" },
    { value: "100%", label: "Praktik Langsung", sub: "Bukan teori hafalan semata" }
  ];

  const currentStation = pcStations.find((pc) => pc.id === selectedPc);

  return (
    <section id="fasilitas" className="py-20 lg:py-28 bg-[#FFFDF5] border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-purple-300 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] mb-4">
            <Cpu className="w-3.5 h-3.5" /> [LAB_ARCHITECTURE // PRIVATE_ROOM]
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black tracking-tight mb-4 uppercase">
            DENAH KELAS 5-WORKSTATION: <br />
            <span className="bg-purple-300 px-2 py-0.5 border-2 border-black inline-block mt-1 shadow-[3px_3px_0px_0px_#000]">
              1 SISWA 1 UNIT KOMPUTER
            </span>
          </h2>
          
          <p className="text-base sm:text-lg font-medium text-slate-700 mt-4 leading-relaxed">
            Kami menolak konsep kelas massal yang berisik dan tidak terarah. Di GWA Tech Course, setiap sesi hanya diisi 5 orang untuk menjamin bimbingan intensif dan pemahaman penuh.
          </p>
        </div>

        {/* 5-Workstation Interactive Seating Map */}
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
                      : "bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold mb-3">
                      <span className="bg-black text-white px-1.5 py-0.5 border border-black">
                        SLOT 0{pc.id}
                      </span>
                      <span className={`px-1.5 py-0.5 border border-black font-black ${
                        pc.isOnline ? "bg-emerald-400 text-black" : "bg-rose-500 text-white"
                      }`}>
                        {pc.isOnline ? "ONLINE" : "BOOKED"}
                      </span>
                    </div>

                    {/* Visual Screen Icon */}
                    <div className="py-3 flex flex-col items-center justify-center">
                      <div className={`w-16 h-12 border-2 border-black rounded-xs flex items-center justify-center ${
                        isSelected ? "bg-white text-black" : "bg-slate-900 text-emerald-400"
                      } font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_#000]`}>
                        <Monitor className="w-6 h-6" />
                      </div>
                      <div className="w-6 h-1.5 bg-black mt-1"></div>
                      <div className="w-12 h-1 bg-black"></div>
                    </div>

                    <h4 className="font-heading font-black text-center text-sm mt-2">
                      {pc.name.split(" ")[0]}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/20 text-center font-mono text-[10px] font-bold">
                    <span>{isSelected ? "▶ SEDANG DIPILIH" : "KLIK UNTUK CEK"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Workstation Inspector Box */}
          {currentStation && (
            <div className="bg-white text-black border-2 border-black p-4 sm:p-5 font-mono text-xs shadow-[4px_4px_0px_0px_#000]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-black text-amber-300 px-2 py-0.5 font-bold uppercase text-[11px]">
                      {currentStation.name}
                    </span>
                    <span className={`px-2 py-0.5 font-bold uppercase text-[11px] border border-black ${
                      currentStation.isOnline ? "bg-emerald-300 text-black" : "bg-rose-300 text-black"
                    }`}>
                      STATUS: {currentStation.status}
                    </span>
                  </div>
                  <p className="text-slate-800 font-bold mt-2">
                    Spesifikasi: <span className="font-normal text-slate-700">{currentStation.specs}</span>
                  </p>
                  <p className="text-slate-800 font-bold mt-0.5">
                    Opsi Jadwal: <span className="font-normal text-slate-700">{currentStation.session}</span>
                  </p>
                </div>

                <a 
                  href={`https://wa.me/6280000000000?text=Halo%20Admin%20GWA,%20saya%20ingin%20booking%20kursi%20komputer%20Slot%200${currentStation.id}%20(${currentStation.name}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap self-start md:self-center flex items-center gap-2"
                >
                  <span>&gt;_</span> BOOKING SLOT 0{currentStation.id} SEKARANG
                </a>
              </div>
            </div>
          )}

        </div>

        {/* 6 Lab Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facilities.map((fac, idx) => (
            <div 
              key={idx}
              className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`${fac.color} w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0`}>
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

        {/* Stats Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-amber-300 border-3 border-black shadow-[6px_6px_0px_0px_#000]">
          {stats.map((st, idx) => (
            <div key={idx} className="text-center sm:text-left border-r-0 sm:border-r-2 last:border-r-0 border-black pr-0 sm:pr-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black">
                {st.value}
              </div>
              <div className="font-mono text-xs sm:text-sm font-black text-black uppercase mt-1">
                {st.label}
              </div>
              <p className="text-[11px] font-medium text-slate-900 mt-0.5 hidden sm:block">
                {st.sub}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
