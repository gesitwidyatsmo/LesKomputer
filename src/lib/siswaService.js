import { supabase } from './supabase';

/**
 * Generate ID siswa otomatis dengan format GWA-YYYYMM-XXX
 * Contoh: GWA-202608-001
 */
export async function generateIdSiswa() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `GWA-${year}${month}-`;

  // Ambil semua ID siswa bulan ini untuk mencari nomor urut tertinggi secara numerik
  const { data } = await supabase
    .from('siswa')
    .select('id')
    .like('id', `${prefix}%`);

  let maxNum = 0;
  if (data && data.length > 0) {
    data.forEach(item => {
      const parts = item.id.split('-');
      if (parts.length >= 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
  }

  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(3, '0')}`;
}

/**
 * Tambah siswa baru dengan password yang di-hash oleh Supabase RPC
 */
export async function tambahSiswa(siswaData) {
  // Gunakan RPC untuk insert siswa dengan bcrypt password
  const { data, error } = await supabase
    .rpc('buat_siswa_baru', {
      p_id: siswaData.id,
      p_nama: siswaData.nama,
      p_tanggal_lahir: siswaData.tanggal_lahir,
      p_wa: siswaData.wa,
      p_kelas_id: siswaData.kelas_id || null,
      p_modul_id: siswaData.modul_id,
      p_status: siswaData.status || 'Tidak Aktif',
      p_status_bayar: siswaData.status_bayar || 'Belum Lunas',
      p_password: siswaData.password,
    });

  if (error) return { error };
  return { data, error: null };
}

/**
 * Aktivasi siswa manual oleh Admin
 */
export async function aktivasiSiswa(id, { kelas_id, status_bayar = 'Belum Lunas' } = {}) {
  const updatePayload = {
    status: 'Aktif',
    status_bayar: status_bayar,
  };
  if (kelas_id) {
    updatePayload.kelas_id = kelas_id;
  }

  const { data, error } = await supabase
    .from('siswa')
    .update(updatePayload)
    .eq('id', id)
    .select('*, modul:modul_id(id, nama, total_pertemuan), kelas:kelas_id(id, nama)')
    .single();

  return { data, error };
}

/**
 * Edit data profil siswa (tidak mengubah password)
 */
export async function editSiswa(id, siswaData) {
  const updatePayload = {
    nama: siswaData.nama,
    tanggal_lahir: siswaData.tanggal_lahir,
    wa: siswaData.wa,
    kelas_id: siswaData.kelas_id,
    modul_id: siswaData.modul_id,
    status: siswaData.status,
    status_bayar: siswaData.status_bayar,
  };

  if (siswaData.nilai_akhir !== undefined) updatePayload.nilai_akhir = siswaData.nilai_akhir;
  if (siswaData.predikat !== undefined) updatePayload.predikat = siswaData.predikat;
  if (siswaData.tanggal_lulus !== undefined) updatePayload.tanggal_lulus = siswaData.tanggal_lulus;

  const { data, error } = await supabase
    .from('siswa')
    .update(updatePayload)
    .eq('id', id)
    .select('*, modul:modul_id(id, nama, total_pertemuan, icon), kelas:kelas_id(id, nama, jadwal, waktu, ruangan, mentor)')
    .single();

  return { data, error };
}

/**
 * Simpan hasil penilaian kelulusan siswa (Nilai Akhir, Predikat, Tanggal Lulus, dan Status Lulus)
 */
export async function simpanKelulusanSiswa(id, { nilai_akhir, predikat, tanggal_lulus, status = "Lulus" }) {
  const { data, error } = await supabase
    .from('siswa')
    .update({
      nilai_akhir: parseInt(nilai_akhir, 10),
      predikat: predikat,
      tanggal_lulus: tanggal_lulus || new Date().toISOString().split('T')[0],
      status: status,
    })
    .eq('id', id)
    .select('*, modul:modul_id(id, nama, total_pertemuan), kelas:kelas_id(id, nama)')
    .single();

  return { data, error };
}

/**
 * Reset / ganti password siswa
 */
export async function resetPasswordSiswa(id, passwordBaru) {
  const { data, error } = await supabase
    .rpc('reset_password_siswa', { p_id: id, p_password_baru: passwordBaru });

  return { data, error };
}

/**
 * Hapus siswa beserta seluruh data terkait (kehadiran, akses materi, dll.)
 */
export async function deleteSiswa(id) {
  const { error } = await supabase
    .from('siswa')
    .delete()
    .eq('id', id);

  return { error };
}

export async function loginSiswa(idSiswa, password) {
  // Panggil RPC untuk memvalidasi password menggunakan pgcrypto bcrypt
  const { data: validId, error: authError } = await supabase
    .rpc('validasi_password_siswa', { p_id: idSiswa, p_pass: password });

  if (authError || !validId) {
    console.error("Login validation error:", authError);
    return { success: false, message: 'ID Siswa atau Password salah.' };
  }

  // Jika password cocok, ambil profil lengkap siswa
  const { data, error } = await supabase
    .from('siswa')
    .select('*, modul:modul_id(id, nama, total_pertemuan, icon), kelas:kelas_id(id, nama, jadwal, waktu, ruangan, mentor)')
    .eq('id', validId)
    .single();

  if (error || !data) {
    console.error("Fetch profile error:", error);
    return { success: false, message: 'Gagal mengambil data profil.' };
  }

  // Periksa apakah status siswa masih Tidak Aktif (menunggu aktivasi admin)
  if (data.status === 'Tidak Aktif') {
    return {
      success: false,
      isInactive: true,
      data: { id: data.id, nama: data.nama, wa: data.wa },
      message: 'Akun Anda belum aktif (Sedang menunggu verifikasi & aktivasi oleh Admin). Silakan konfirmasi ke Admin via WhatsApp untuk mengaktifkan akun Anda.'
    };
  }

  if (data.status === 'Berhenti') {
    return {
      success: false,
      message: 'Akun Anda dinonaktifkan (Status: Berhenti). Silakan hubungi Admin GWA Tech Course.'
    };
  }
  
  // Format the data to match context structure expectations
  const formattedData = {
    ...data,
    modul: data.modul?.nama || 'MS Office',
    modul_id: data.modul_id,
    totalPertemuan: data.modul?.total_pertemuan || 10,
    kelas: data.kelas?.nama || 'Kelas Standar',
    jadwal: data.kelas?.jadwal || 'Senin & Rabu',
    waktu: data.kelas?.waktu || '16.00 - 18.00',
    ruangan: data.kelas?.ruangan || 'Lab Komputer',
    mentor: data.kelas?.mentor || data.mentor || 'Instruktur GWA',
    tanggalLulus: data.tanggal_lulus || data.tanggalLulus || null,
    nilaiAkhir: data.nilai_akhir || data.nilaiAkhir || null,
    predikat: data.predikat || null
  };

  return { success: true, data: formattedData };
}

export async function getSiswaById(id) {
  const { data, error } = await supabase
    .from('siswa')
    .select('*, modul:modul_id(id, nama, total_pertemuan, icon), kelas:kelas_id(id, nama, jadwal, waktu, ruangan, mentor)')
    .eq('id', id)
    .single();
    
  if (data) {
    data.modul = data.modul?.nama || data.modul;
    data.totalPertemuan = data.modul?.total_pertemuan || 10;
    data.kelas = data.kelas?.nama || data.kelas;
    data.jadwal = data.kelas?.jadwal || data.jadwal || 'Senin & Rabu';
    data.waktu = data.kelas?.waktu || data.waktu || '16.00 - 18.00';
    data.ruangan = data.kelas?.ruangan || data.ruangan || 'Lab Komputer';
    data.mentor = data.kelas?.mentor || data.mentor || 'Instruktur GWA';
  }
    
  return { data, error };
}

export async function getKehadiranSiswa(siswaId) {
  const { data, error } = await supabase
    .from('kehadiran')
    .select('*, materi:materi_id(judul)')
    .eq('siswa_id', siswaId)
    .order('pertemuan', { ascending: true });
    
  if (data) {
    data.forEach(item => {
      item.materi_judul = item.materi?.judul || `Pertemuan ${item.pertemuan}`;
    });
  }
    
  return { data, error };
}

export async function getSemuaSiswa() {
   const { data, error } = await supabase
    .from('siswa')
    .select('*, modul:modul_id(id, nama, total_pertemuan), kelas:kelas_id(id, nama)')
    .order('id', { ascending: true });
    
  if (data) {
    data.forEach(d => {
        d.modul = d.modul?.nama;
        d.kelas = d.kelas?.nama;
    });
  }
    
  return { data, error };
}

export async function upsertKehadiran(kehadiranData) {
  const { data, error } = await supabase
    .from('kehadiran')
    .upsert(kehadiranData, { onConflict: 'siswa_id, pertemuan' })
    .select()
    .single();
    
  return { data, error };
}


