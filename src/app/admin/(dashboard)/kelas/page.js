"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Calendar as CalendarIcon, Clock, Users, Edit2, Trash2, ChevronRight, Loader2, Play, X, ChevronLeft, RefreshCw, BookOpen, Layers } from "lucide-react";
import { getSemuaKelas, upsertKelas, deleteKelas } from "@/lib/kelasService";
import { getJadwalByKelas, upsertJadwal, deleteJadwal, deleteJadwalAndResequence, insertJadwalBatch, saveJadwalWithShift } from "@/lib/jadwalService";
import { getSemuaModul } from "@/lib/modulService";
import Swal from "sweetalert2";
import ClientPortal from "@/components/ClientPortal";

const HARI_PILIHAN = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function ManajemenKelasJadwal() {
  // ── States untuk Kelas ──
  const [kelasList, setKelasList] = useState([]);
  const [modulList, setModulList] = useState([]);
  const [kelasLoading, setKelasLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile: "list" | "detail"
  const [mobileView, setMobileView] = useState("list");

  // ── States untuk Jadwal (Sesi) ──
  const [jadwalList, setJadwalList] = useState([]);
  const [jadwalLoading, setJadwalLoading] = useState(false);

  // ── States Modal Kelas ──
  const [isKelasModalOpen, setIsKelasModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState(null);
  const [formKelas, setFormKelas] = useState({
    nama: "",
    modul_id: "",
    ruangan: "Lab 1 (5 PC)",
    mentor: "Gesit Widi Atmoko",
    selectedDays: ["Senin", "Rabu"],
    jamMulai: "09:00",
    jamSelesai: "11:00",
    status: "Berjalan"
  });

  // ── States Modal Edit / Tambah Sesi Fleksibel ──
  const [isSesiModalOpen, setIsSesiModalOpen] = useState(false);
  const [editingSesi, setEditingSesi] = useState(null);
  const [formSesi, setFormSesi] = useState({
    pertemuan_ke: 1,
    tanggal: "",
    jam_mulai: "09:00",
    jam_selesai: "11:00",
    status: "Terjadwal"
  });

  // ── States Modal Generate Jadwal ──
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    tanggalMulai: "",
    totalPertemuan: 10,
    jamMulai: "09:00",
    jamSelesai: "11:00",
    selectedDays: [1, 3] // Default: Senin (1) & Rabu (3)
  });

  // ── Load Data Awal ──
  const loadKelas = useCallback(async () => {
    setKelasLoading(true);
    const [{ data: kData }, { data: mData }] = await Promise.all([
      getSemuaKelas(),
      getSemuaModul()
    ]);
    if (kData) setKelasList(kData);
    if (mData) setModulList(mData);
    setKelasLoading(false);
  }, []);

  useEffect(() => { loadKelas(); }, [loadKelas]);

  // ── Load Jadwal saat kelas dipilih ──
  const loadJadwal = useCallback(async () => {
    if (!selectedKelas) { setJadwalList([]); return; }
    setJadwalLoading(true);
    const { data } = await getJadwalByKelas(selectedKelas.id);
    if (data) setJadwalList(data);
    setJadwalLoading(false);
  }, [selectedKelas]);

  useEffect(() => { loadJadwal(); }, [loadJadwal]);

  // ── Handlers Kelas ──
  const handleOpenKelasModal = (kelas = null) => {
    if (kelas) {
      setEditingKelas(kelas);
      let jMulai = "09:00";
      let jSelesai = "11:00";
      if (kelas.waktu) {
        const parts = kelas.waktu.split(/[-–]/).map(s => s.trim().replace('.', ':'));
        if (parts[0]) jMulai = parts[0];
        if (parts[1]) jSelesai = parts[1];
      }
      let days = ["Senin", "Rabu"];
      if (kelas.jadwal) {
        const splitDays = kelas.jadwal.split(/[&,]/).map(s => s.trim()).filter(Boolean);
        if (splitDays.length > 0) days = splitDays;
      }

      setFormKelas({
        nama: kelas.nama || "",
        modul_id: kelas.modul_id || "",
        ruangan: kelas.ruangan || "Lab 1 (5 PC)",
        mentor: kelas.mentor || "Gesit Widi Atmoko",
        selectedDays: days,
        jamMulai: jMulai,
        jamSelesai: jSelesai,
        status: kelas.status || "Berjalan"
      });
    } else {
      setEditingKelas(null);
      setFormKelas({
        nama: "",
        modul_id: modulList[0]?.id || "",
        ruangan: "Lab 1 (5 PC)",
        mentor: "Gesit Widi Atmoko",
        selectedDays: ["Senin", "Rabu"],
        jamMulai: "09:00",
        jamSelesai: "11:00",
        status: "Berjalan"
      });
    }
    setIsKelasModalOpen(true);
  };

  const handleSaveKelas = async () => {
    if (!formKelas.nama.trim()) {
      return Swal.fire({ icon: 'error', title: 'Oops...', text: 'Nama kelas harus diisi' });
    }
    if (!formKelas.selectedDays || formKelas.selectedDays.length === 0) {
      return Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Pilih minimal 1 hari rutin pertemuan' });
    }

    const kelasData = {
      nama: formKelas.nama.trim(),
      modul_id: formKelas.modul_id || null,
      ruangan: formKelas.ruangan,
      mentor: formKelas.mentor,
      jadwal: formKelas.selectedDays.join(" & "),
      waktu: `${formKelas.jamMulai} - ${formKelas.jamSelesai}`,
      status: formKelas.status
    };

    if (editingKelas?.id) {
      kelasData.id = editingKelas.id;
    }

    const { data, error } = await upsertKelas(kelasData);
    if (!error) { 
      setIsKelasModalOpen(false); 
      await loadKelas();
      Swal.fire({ 
        icon: 'success', 
        title: 'Berhasil', 
        text: editingKelas ? 'Kelas berhasil diperbarui' : 'Kelas baru berhasil dibuat', 
        timer: 1500, 
        showConfirmButton: false 
      });
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: 'Gagal Menyimpan Kelas', 
        text: error.message || 'Terjadi kesalahan saat menyimpan kelas' 
      });
    }
  };

  const handleDeleteKelas = async (id, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Hapus Kelas?',
      text: "Yakin ingin menghapus kelas ini? Semua jadwal di dalamnya akan terhapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      await deleteKelas(id);
      if (selectedKelas?.id === id) { setSelectedKelas(null); setMobileView("list"); }
      await loadKelas();
      Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Kelas telah dihapus.', timer: 1500, showConfirmButton: false });
    }
  };

  const handleSelectKelas = (kelas) => {
    setSelectedKelas(kelas);
    setMobileView("detail");
  };

  // ── Handlers Buka Modal Generate Jadwal Otomatis ──
  const handleOpenGenerateModal = (targetKelas = selectedKelas) => {
    if (!targetKelas) return;

    let days = [];
    if (targetKelas.jadwal) {
      const HARI_MAP = {
        minggu: 0,
        senin: 1,
        selasa: 2,
        rabu: 3,
        kamis: 4,
        jumat: 5,
        sabtu: 6,
      };
      const rawDays = targetKelas.jadwal.toLowerCase().split(/[&,]/).map(s => s.trim());
      rawDays.forEach(r => {
        Object.keys(HARI_MAP).forEach(k => {
          if (r.includes(k) && !days.includes(HARI_MAP[k])) {
            days.push(HARI_MAP[k]);
          }
        });
      });
    }
    if (days.length === 0) days = [1, 3];

    let jMulai = "09:00";
    let jSelesai = "11:00";
    if (targetKelas.waktu) {
      const parts = targetKelas.waktu.split(/[-–]/).map(s => s.trim().replace('.', ':'));
      if (parts[0] && parts[0].length >= 4) jMulai = parts[0].length === 4 ? `0${parts[0]}` : parts[0];
      if (parts[1] && parts[1].length >= 4) jSelesai = parts[1].length === 4 ? `0${parts[1]}` : parts[1];
    }

    let totalPertemuan = 10;
    if (targetKelas.modul_id) {
      const matchedModul = modulList.find(m => m.id === targetKelas.modul_id);
      if (matchedModul?.total_pertemuan) {
        totalPertemuan = matchedModul.total_pertemuan;
      }
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${yyyy}-${mm}-${dd}`;

    setGenerateForm({
      tanggalMulai: defaultDate,
      totalPertemuan,
      jamMulai: jMulai,
      jamSelesai: jSelesai,
      selectedDays: days
    });

    setIsGenerateModalOpen(true);
  };

  // ── Handlers Generate Jadwal Cerdas ──
  const handleGenerateJadwal = async () => {
    if (!generateForm.tanggalMulai) {
      return Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Pilih tanggal mulai terlebih dahulu' });
    }
    if (!generateForm.selectedDays || generateForm.selectedDays.length === 0) {
      return Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Pilih minimal 1 hari rutin pertemuan' });
    }

    if (jadwalList.length > 0) {
      const confirm = await Swal.fire({
        title: 'Perbarui Jadwal?',
        text: 'Kelas ini sudah memiliki sesi jadwal. Meng-generate ulang akan mengganti seluruh sesi yang ada. Lanjutkan?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#FF6B00',
        cancelButtonColor: '#000000',
        confirmButtonText: 'Ya, Generate Ulang',
        cancelButtonText: 'Batal'
      });
      if (!confirm.isConfirmed) return;
    }

    setIsGenerateModalOpen(false);
    setJadwalLoading(true);

    const targetDays = generateForm.selectedDays.map(Number);
    let cur = new Date(generateForm.tanggalMulai + "T00:00:00");
    const jadwalBaru = [];

    let safetyCounter = 0;
    while (jadwalBaru.length < generateForm.totalPertemuan && safetyCounter < 500) {
      safetyCounter++;
      const dayOfWeek = cur.getDay();
      if (targetDays.includes(dayOfWeek)) {
        const yyyy = cur.getFullYear();
        const mm = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        jadwalBaru.push({
          kelas_id: selectedKelas.id,
          pertemuan_ke: jadwalBaru.length + 1,
          tanggal: `${yyyy}-${mm}-${dd}`,
          jam_mulai: generateForm.jamMulai,
          jam_selesai: generateForm.jamSelesai,
          status: 'Terjadwal'
        });
      }
      cur.setDate(cur.getDate() + 1);
    }

    const { deleteJadwalByKelas } = await import("@/lib/jadwalService");
    await deleteJadwalByKelas(selectedKelas.id);

    const { error } = await insertJadwalBatch(jadwalBaru);
    if (!error) {
      await loadJadwal();
      Swal.fire({ icon: 'success', title: 'Berhasil', text: `${jadwalBaru.length} sesi pertemuan berhasil digenerate`, timer: 1500, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal meng-generate jadwal: ' + error.message });
    }
    setJadwalLoading(false);
  };

  // ── Handlers Edit & Tambah Sesi Fleksibel ──
  const handleOpenEditSesi = (sesi = null) => {
    if (sesi) {
      setEditingSesi(sesi);
      setFormSesi({
        pertemuan_ke: sesi.pertemuan_ke,
        tanggal: sesi.tanggal ? sesi.tanggal.split('T')[0] : "",
        jam_mulai: sesi.jam_mulai || "09:00",
        jam_selesai: sesi.jam_selesai || "11:00",
        status: sesi.status || "Terjadwal"
      });
    } else {
      setEditingSesi(null);
      const nextPertemuan = (jadwalList.length > 0 ? Math.max(...jadwalList.map(j => j.pertemuan_ke)) : 0) + 1;
      let jMulai = "09:00";
      let jSelesai = "11:00";
      if (selectedKelas?.waktu) {
        const parts = selectedKelas.waktu.split(/[-–]/).map(s => s.trim().replace('.', ':'));
        if (parts[0] && parts[0].length >= 4) jMulai = parts[0].length === 4 ? `0${parts[0]}` : parts[0];
        if (parts[1] && parts[1].length >= 4) jSelesai = parts[1].length === 4 ? `0${parts[1]}` : parts[1];
      }
      const todayStr = new Date().toISOString().split('T')[0];
      setFormSesi({
        pertemuan_ke: nextPertemuan,
        tanggal: todayStr,
        jam_mulai: jMulai,
        jam_selesai: jSelesai,
        status: "Terjadwal"
      });
    }
    setIsSesiModalOpen(true);
  };

  const handleSaveSesi = async () => {
    if (!formSesi.tanggal) {
      return Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Tanggal pertemuan harus diisi' });
    }
    if (!formSesi.jam_mulai || !formSesi.jam_selesai) {
      return Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Jam mulai dan jam selesai harus diisi' });
    }

    const conflict = jadwalList.find(s => {
      if (editingSesi && s.id === editingSesi.id) return false;
      const sTanggal = s.tanggal ? s.tanggal.split('T')[0] : "";
      const formTanggal = formSesi.tanggal ? formSesi.tanggal.split('T')[0] : "";
      if (sTanggal !== formTanggal) return false;
      const startA = formSesi.jam_mulai;
      const endA = formSesi.jam_selesai;
      const startB = s.jam_mulai;
      const endB = s.jam_selesai;
      if (startA && endA && startB && endB) {
        return startA < endB && endA > startB;
      }
      return false;
    });

    if (conflict) {
      const formatTgl = new Date(formSesi.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      return Swal.fire({
        icon: 'warning',
        title: 'Jadwal Bentrok!',
        html: `Sudah ada jadwal pada tanggal <strong>${formatTgl}</strong> pukul <strong>${conflict.jam_mulai} - ${conflict.jam_selesai}</strong> untuk <strong>Pertemuan ke-${conflict.pertemuan_ke}</strong>.<br/><br/><span class="text-xs text-slate-500">Pilih jam atau tanggal yang berbeda.</span>`
      });
    }

    const targetPertemuan = parseInt(formSesi.pertemuan_ke, 10) || 1;
    const sesiData = {
      kelas_id: selectedKelas.id,
      pertemuan_ke: targetPertemuan,
      tanggal: formSesi.tanggal,
      jam_mulai: formSesi.jam_mulai,
      jam_selesai: formSesi.jam_selesai,
      status: formSesi.status
    };

    if (editingSesi?.id) {
      sesiData.id = editingSesi.id;
    }

    const { error } = await saveJadwalWithShift(sesiData, !!editingSesi, editingSesi?.pertemuan_ke);
    if (!error) {
      setIsSesiModalOpen(false);
      await loadJadwal();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Sesi pertemuan ${targetPertemuan} berhasil disimpan.`,
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan Sesi',
        text: error.message || 'Terjadi kesalahan saat menyimpan sesi'
      });
    }
  };

  const handleDeleteSesi = async (sesiId, pertemuanKe, e) => {
    e?.stopPropagation();
    const result = await Swal.fire({
      title: `Hapus Pertemuan ${pertemuanKe}?`,
      text: `Sesi pertemuan ke-${pertemuanKe} akan dihapus dan nomor pertemuan berikutnya akan otomatis bergeser maju.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Ya, Hapus & Susun Ulang!'
    });

    if (result.isConfirmed) {
      const { error } = await deleteJadwalAndResequence(sesiId, selectedKelas.id);
      if (!error) {
        await loadJadwal();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Dihapus!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: error.message });
      }
    }
  };

  const handleStatusChange = async (jadwalId, newStatus) => {
    await upsertJadwal({ id: jadwalId, status: newStatus });
    await loadJadwal();
  };

  const filteredKelas = kelasList.filter(k =>
    k.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.mentor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Panel Kiri (Daftar Kelas) ──
  const LeftPanel = () => (
    <div className="flex flex-col h-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
      {/* Retro Window Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
          </div>
          <span>classes_batch_list.exe</span>
        </div>
        <span className="text-[10px] text-yellow-300 font-mono">[{kelasList.length} BATCH]</span>
      </div>

      <div className="p-4 border-b-2 border-black bg-yellow-50 shrink-0 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-heading font-black text-sm uppercase text-black">Daftar Batch Kelas</h2>
            <p className="font-mono text-[10px] text-slate-600">5 Unit PC Workstation per Batch</p>
          </div>
          <button
            onClick={() => handleOpenKelasModal()}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Tambah Kelas Baru"
          >
            <Plus className="w-3.5 h-3.5" /> TAMBAH
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="Cari kelas / mentor..."
            className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#FFFDF5]">
        {kelasLoading ? (
          <div className="flex flex-col justify-center items-center py-10 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="font-mono text-xs text-slate-500">[QUERY: LOADING_CLASSES...]</span>
          </div>
        ) : filteredKelas.length === 0 ? (
          <div className="text-center p-6 bg-white border-2 border-dashed border-slate-300 font-mono text-xs text-slate-500">
            [EMPTY] Belum ada kelas terdaftar.
          </div>
        ) : (
          filteredKelas.map((kelas) => {
            const isSelected = selectedKelas?.id === kelas.id;
            return (
              <div
                key={kelas.id}
                onClick={() => handleSelectKelas(kelas)}
                className={`group relative p-3.5 border-2 border-black transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-200 shadow-[3px_3px_0px_0px_#000] translate-x-1"
                    : "bg-white hover:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`px-1.5 py-0.5 border border-black font-mono text-[9px] font-bold uppercase ${
                        kelas.status === 'Berjalan' 
                          ? 'bg-emerald-300 text-black' 
                          : kelas.status === 'Pendaftaran'
                          ? 'bg-cyan-300 text-black'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {kelas.status}
                      </span>
                      <span className="font-mono text-[9px] text-slate-600 font-bold bg-white px-1 border border-black">
                        {kelas.ruangan || 'Lab 1'}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-sm text-black truncate uppercase">
                      {kelas.nama}
                    </h3>
                    <p className="font-mono text-xs text-slate-700 mt-1 truncate">
                      {kelas.jadwal} • {kelas.waktu}
                    </p>
                    <p className="font-mono text-[11px] text-orange-700 font-bold mt-0.5">
                      👤 {kelas.mentor || 'Mentor'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenKelasModal(kelas); }} 
                      className="p-1 bg-white hover:bg-yellow-300 text-black border border-black shadow-[1px_1px_0px_0px_#000] transition-colors"
                      title="Edit Kelas"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteKelas(kelas.id, e)} 
                      className="p-1 bg-white hover:bg-rose-400 text-black border border-black shadow-[1px_1px_0px_0px_#000] transition-colors"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // ── Panel Kanan (Sesi Pertemuan) ──
  const RightPanel = () => (
    <div className="flex flex-col h-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
      {!selectedKelas ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 bg-[#FFFDF5]">
          <CalendarIcon className="w-16 h-16 text-black/20 mb-3" />
          <p className="font-heading font-black text-base text-black uppercase">PILIH BATCH KELAS</p>
          <p className="font-mono text-xs text-slate-500 mt-1">[SYS_INFO] Klik salah satu kelas pada panel kiri untuk melihat dan mengelola sesi jadwal pertemuan.</p>
        </div>
      ) : (
        <>
          {/* Retro Window Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
              </div>
              <span>session_timeline_manager.exe</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">[BATCH_ACTIVE]</span>
          </div>

          <div className="p-4 sm:p-5 border-b-2 border-black bg-cyan-50 shrink-0">
            {/* Tombol kembali mobile */}
            <button
              onClick={() => setMobileView("list")}
              className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-black bg-white px-2 py-1 border border-black shadow-[1.5px_1.5px_0px_0px_#000] mb-3 lg:hidden"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Kelas
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-black text-black uppercase">{selectedKelas.nama}</h2>
                  <span className="px-2 py-0.5 bg-yellow-300 border border-black font-mono text-[10px] font-bold text-black">
                    {selectedKelas.ruangan || 'Lab 1'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 font-mono text-xs text-slate-800">
                  <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-orange-600" /> {selectedKelas.jadwal}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-600" /> {selectedKelas.waktu}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-orange-600" /> {selectedKelas.mentor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {jadwalList.length > 0 && (
                  <button
                    onClick={() => handleOpenGenerateModal(selectedKelas)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-yellow-200 text-black font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Atur Ulang
                  </button>
                )}
                <button
                  onClick={() => handleOpenEditSesi(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Sesi
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#FFFDF5]">
            {jadwalLoading ? (
              <div className="flex flex-col justify-center items-center py-12 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <span className="font-mono text-xs">[LOADING_SESSIONS...]</span>
              </div>
            ) : jadwalList.length === 0 ? (
              <div className="text-center py-16 bg-white border-2 border-dashed border-black p-6">
                <div className="w-14 h-14 bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center mx-auto mb-3 text-black">
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="text-base font-heading font-black text-black uppercase">Jadwal Sesi Belum Digenerate</h3>
                <p className="font-mono text-xs text-slate-600 max-w-md mx-auto mb-6 mt-1">
                  Kelas ini belum memiliki sesi pertemuan. Klik tombol di bawah untuk membuat seluruh jadwal otomatis mengikuti hari & jam kelas.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleOpenGenerateModal(selectedKelas)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Generate Jadwal Sesi Otomatis
                  </button>
                  <button
                    onClick={() => handleOpenEditSesi(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-black font-mono font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    Tambah Manual
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {jadwalList.map((sesi) => (
                  <div 
                    key={sesi.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-50/70 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-mono font-bold uppercase text-black">PRTM</span>
                        <span className="text-lg font-heading font-black text-black leading-none">{sesi.pertemuan_ke}</span>
                      </div>
                      <div>
                        <p className="font-heading font-black text-sm text-black">
                          {new Date(sesi.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="font-mono text-xs text-slate-700 flex items-center gap-1.5 mt-0.5 font-bold">
                          <Clock className="w-3.5 h-3.5 text-orange-600" /> {sesi.jam_mulai} - {sesi.jam_selesai} WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={sesi.status}
                        onChange={(e) => handleStatusChange(sesi.id, e.target.value)}
                        className={`text-xs font-mono font-bold uppercase px-2.5 py-1.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] outline-none cursor-pointer ${
                          sesi.status === 'Selesai' ? 'bg-emerald-300 text-black' :
                          sesi.status === 'Berlangsung' ? 'bg-cyan-300 text-black' :
                          sesi.status === 'Libur' ? 'bg-rose-300 text-black' :
                          'bg-white text-slate-800'
                        }`}
                      >
                        <option value="Terjadwal">TERJADWAL</option>
                        <option value="Berlangsung">BERLANGSUNG</option>
                        <option value="Selesai">SELESAI</option>
                        <option value="Libur">LIBUR / BATAL</option>
                      </select>
                      <button
                        onClick={() => handleOpenEditSesi(sesi)}
                        className="p-1.5 bg-yellow-300 hover:bg-yellow-200 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        title="Edit Sesi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSesi(sesi.id, sesi.pertemuan_ke, e)}
                        className="p-1.5 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        title="Hapus Sesi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-300 border border-black text-black">
              [SYS_SCHEDULE // LAB_5PC]
            </span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              WORKSTATIONS: 5 PC / LAB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black">
            Manajemen Batch Kelas & Jadwal Lab
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-600 mt-0.5">
            Atur batch kelas, alokasi ruang lab, dan generate timeline sesi pertemuan otomatis.
          </p>
        </div>
      </div>

      {/* ── DESKTOP: 2-PANEL SIDE BY SIDE ── */}
      <div className="hidden lg:flex flex-1 gap-6 min-h-0">
        <div className="w-1/3 min-h-0">
          <LeftPanel />
        </div>
        <div className="w-2/3 min-h-0">
          <RightPanel />
        </div>
      </div>

      {/* ── MOBILE: SINGLE PANEL VIEW TOGGLE ── */}
      <div className="flex-1 lg:hidden min-h-0">
        {mobileView === "list" ? (
          <div className="h-full">
            <LeftPanel />
          </div>
        ) : (
          <div className="h-full">
            <RightPanel />
          </div>
        )}
      </div>

      {/* ── MODAL KELAS (Tambah/Edit) ── */}
      {isKelasModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsKelasModalOpen(false)} />
            <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
              
              {/* Retro Window Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
                  </div>
                  <span>batch_class_editor.exe</span>
                </div>
                <button onClick={() => setIsKelasModalOpen(false)} className="px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[10px]">X</button>
              </div>

              <div className="px-5 py-3 bg-yellow-100 border-b-2 border-black shrink-0">
                <h3 className="font-heading font-black text-base uppercase text-black">{editingKelas ? "Edit Konfigurasi Kelas" : "Buat Batch Kelas Baru"}</h3>
                <p className="font-mono text-xs text-slate-700 mt-0.5">Konfigurasi jadwal rutin mingguan dan instruktur</p>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto bg-[#FFFDF5] flex-1">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[INPUT] Nama Batch / Kelas *</label>
                  <input
                    type="text"
                    value={formKelas.nama}
                    onChange={e => setFormKelas({...formKelas, nama: e.target.value})}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                    placeholder="Misal: MS Office – Batch 44"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[SELECT] Modul Kursus</label>
                    <select
                      value={formKelas.modul_id}
                      onChange={e => setFormKelas({...formKelas, modul_id: e.target.value})}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-bold bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                    >
                      <option value="">-- Pilih Modul --</option>
                      {modulList.map(m => (
                        <option key={m.id} value={m.id}>{m.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[SELECT] Ruangan Lab</label>
                    <select
                      value={formKelas.ruangan}
                      onChange={e => setFormKelas({...formKelas, ruangan: e.target.value})}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-bold bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                    >
                      <option value="Lab 1 (5 PC)">Lab 1 (5 PC)</option>
                      <option value="Lab 2 (5 PC)">Lab 2 (5 PC)</option>
                      <option value="Lab 3 (5 PC)">Lab 3 (5 PC)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[INPUT] Mentor Pengajar</label>
                  <input
                    type="text"
                    value={formKelas.mentor}
                    onChange={e => setFormKelas({...formKelas, mentor: e.target.value})}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                    placeholder="Nama Instruktur / Mentor"
                  />
                </div>

                {/* Pemilih Hari Rutin */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1.5">[SCHEDULE] Hari Rutin Pertemuan</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {HARI_PILIHAN.map(day => {
                      const isSelected = formKelas.selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setFormKelas(prev => {
                              const cur = prev.selectedDays || [];
                              const next = cur.includes(day)
                                ? cur.filter(d => d !== day)
                                : [...cur, day];
                              return { ...prev, selectedDays: next };
                            });
                          }}
                          className={`py-2 text-xs font-mono font-bold uppercase border-2 border-black transition-all cursor-pointer ${
                            isSelected
                              ? "bg-orange-500 text-black shadow-[2px_2px_0px_0px_#000] translate-y-0.5"
                              : "bg-white text-slate-700 hover:bg-yellow-100 shadow-[1px_1px_0px_0px_#000]"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                  {/* Preset Buttons */}
                  <div className="flex gap-2 mt-2 flex-wrap font-mono">
                    <button
                      type="button"
                      onClick={() => setFormKelas(prev => ({ ...prev, selectedDays: ["Senin", "Rabu"] }))}
                      className="text-[11px] px-2 py-1 bg-white hover:bg-yellow-200 text-black border border-black font-bold"
                    >
                      Sen & Rab
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormKelas(prev => ({ ...prev, selectedDays: ["Selasa", "Kamis"] }))}
                      className="text-[11px] px-2 py-1 bg-white hover:bg-yellow-200 text-black border border-black font-bold"
                    >
                      Sel & Kam
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormKelas(prev => ({ ...prev, selectedDays: ["Senin", "Kamis"] }))}
                      className="text-[11px] px-2 py-1 bg-white hover:bg-yellow-200 text-black border border-black font-bold"
                    >
                      Sen & Kam
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormKelas(prev => ({ ...prev, selectedDays: ["Sabtu", "Minggu"] }))}
                      className="text-[11px] px-2 py-1 bg-white hover:bg-yellow-200 text-black border border-black font-bold"
                    >
                      Sab & Min
                    </button>
                  </div>
                </div>

                {/* Pemilih Jam Pertemuan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TIME] Jam Mulai</label>
                    <input
                      type="time"
                      value={formKelas.jamMulai}
                      onChange={e => setFormKelas({...formKelas, jamMulai: e.target.value})}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TIME] Jam Selesai</label>
                    <input
                      type="time"
                      value={formKelas.jamSelesai}
                      onChange={e => setFormKelas({...formKelas, jamSelesai: e.target.value})}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[STATUS] Status Kelas</label>
                  <select
                    value={formKelas.status}
                    onChange={e => setFormKelas({...formKelas, status: e.target.value})}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                  >
                    <option value="Pendaftaran">PENDAFTARAN</option>
                    <option value="Berjalan">BERJALAN</option>
                    <option value="Selesai">SELESAI</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t-2 border-black bg-white flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setIsKelasModalOpen(false)} 
                  className="px-4 py-2 border-2 border-black text-black font-mono font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveKelas} 
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black uppercase text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Simpan Batch Kelas
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* ── MODAL GENERATE JADWAL CERDAS ── */}
      {isGenerateModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsGenerateModalOpen(false)} />
            <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
              
              {/* Retro Window Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
                  </div>
                  <span>auto_session_generator.exe</span>
                </div>
                <button onClick={() => setIsGenerateModalOpen(false)} className="px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[10px]">X</button>
              </div>

              <div className="px-5 py-3 bg-cyan-100 border-b-2 border-black shrink-0">
                <h3 className="font-heading font-black text-base uppercase text-black">Generate Sesi Pertemuan Otomatis</h3>
                <p className="font-mono text-xs text-slate-700 mt-0.5">Target Batch: <strong>{selectedKelas?.nama}</strong></p>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto bg-[#FFFDF5]">
                <div className="p-3 bg-yellow-100 text-black text-xs font-mono border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  [ALGO_INFO] Sistem akan mengkalkulasi tanggal sesi secara otomatis mengikuti <strong>hari rutin</strong> tanpa menabrak tanggal non-rutin.
                </div>
                
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[START_DATE] Tanggal Mulai (Pertemuan ke-1)</label>
                  <input
                    type="date"
                    value={generateForm.tanggalMulai}
                    onChange={e => {
                      const val = e.target.value;
                      setGenerateForm(prev => {
                        if (val) {
                          const d = new Date(val + "T00:00:00").getDay();
                          const days = prev.selectedDays.includes(d) ? prev.selectedDays : [...prev.selectedDays, d];
                          return { ...prev, tanggalMulai: val, selectedDays: days };
                        }
                        return { ...prev, tanggalMulai: val };
                      });
                    }}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                {/* Pilihan Hari Rutin */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1.5">[DAYS] Hari Rutin Pertemuan</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {[
                      { day: 1, label: "Sen" },
                      { day: 2, label: "Sel" },
                      { day: 3, label: "Rab" },
                      { day: 4, label: "Kam" },
                      { day: 5, label: "Jum" },
                      { day: 6, label: "Sab" },
                      { day: 0, label: "Min" }
                    ].map(item => {
                      const isSelected = generateForm.selectedDays?.includes(item.day);
                      return (
                        <button
                          key={item.day}
                          type="button"
                          onClick={() => {
                            setGenerateForm(prev => {
                              const cur = prev.selectedDays || [];
                              const next = cur.includes(item.day)
                                ? cur.filter(d => d !== item.day)
                                : [...cur, item.day];
                              return { ...prev, selectedDays: next };
                            });
                          }}
                          className={`py-2 text-xs font-mono font-bold uppercase border-2 border-black transition-all cursor-pointer ${
                            isSelected
                              ? "bg-orange-500 text-black shadow-[2px_2px_0px_0px_#000] translate-y-0.5"
                              : "bg-white text-slate-700 hover:bg-yellow-100 shadow-[1px_1px_0px_0px_#000]"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TOTAL] Total Sesi Pertemuan</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={generateForm.totalPertemuan}
                    onChange={e => {
                      const val = e.target.value;
                      setGenerateForm({ ...generateForm, totalPertemuan: val === "" ? "" : (parseInt(val, 10) || 0) });
                    }}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TIME] Jam Mulai</label>
                    <input
                      type="time"
                      value={generateForm.jamMulai}
                      onChange={e => setGenerateForm({...generateForm, jamMulai: e.target.value})}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TIME] Jam Selesai</label>
                    <input
                      type="time"
                      value={generateForm.jamSelesai}
                      onChange={e => setGenerateForm({...generateForm, jamSelesai: e.target.value})}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t-2 border-black bg-white flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 border-2 border-black text-black font-mono font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleGenerateJadwal}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black uppercase text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {">_"} Generate Jadwal
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* ── MODAL EDIT / TAMBAH SESI FLEKSIBEL ── */}
      {isSesiModalOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsSesiModalOpen(false)} />
            <div className="relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
              
              {/* Retro Window Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
                  </div>
                  <span>session_slot_editor.exe</span>
                </div>
                <button onClick={() => setIsSesiModalOpen(false)} className="px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[10px]">X</button>
              </div>

              <div className="px-5 py-3 bg-yellow-100 border-b-2 border-black shrink-0">
                <h3 className="font-heading font-black text-base uppercase text-black">
                  {editingSesi ? `Edit Sesi Pertemuan ${formSesi.pertemuan_ke || ""}` : "Tambah Sesi Pertemuan"}
                </h3>
                <p className="font-mono text-xs text-slate-700 mt-0.5">Target: {selectedKelas?.nama}</p>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto bg-[#FFFDF5]">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[PRTM] Nomor Pertemuan Ke-</label>
                  <input
                    type="number"
                    min="1"
                    value={formSesi.pertemuan_ke}
                    onChange={e => {
                      const val = e.target.value;
                      setFormSesi({ ...formSesi, pertemuan_ke: val === "" ? "" : (parseInt(val, 10) || "") });
                    }}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                    placeholder="Contoh: 1"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[DATE] Tanggal Sesi</label>
                  <input
                    type="date"
                    value={formSesi.tanggal}
                    onChange={e => setFormSesi({ ...formSesi, tanggal: e.target.value })}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:bg-yellow-50 focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TIME] Jam Mulai</label>
                    <input
                      type="time"
                      value={formSesi.jam_mulai}
                      onChange={e => setFormSesi({ ...formSesi, jam_mulai: e.target.value })}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[TIME] Jam Selesai</label>
                    <input
                      type="time"
                      value={formSesi.jam_selesai}
                      onChange={e => setFormSesi({ ...formSesi, jam_selesai: e.target.value })}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-black mb-1">[STATUS] Status Sesi</label>
                  <select
                    value={formSesi.status}
                    onChange={e => setFormSesi({ ...formSesi, status: e.target.value })}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-cyan-50 focus:outline-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                  >
                    <option value="Terjadwal">TERJADWAL</option>
                    <option value="Berlangsung">BERLANGSUNG</option>
                    <option value="Selesai">SELESAI</option>
                    <option value="Libur">LIBUR / BATAL</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t-2 border-black bg-white flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setIsSesiModalOpen(false)}
                  className="px-4 py-2 border-2 border-black text-black font-mono font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveSesi}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black uppercase text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {editingSesi ? "Simpan Perubahan" : "Tambah Sesi"}
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}
    </div>
  );
}
