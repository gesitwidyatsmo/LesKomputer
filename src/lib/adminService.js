import { supabase } from './supabase';

export async function loginAdmin(username, password) {
  const { data, error } = await supabase
    .rpc('validasi_password_admin', { p_username: username, p_pass: password });

  if (error || !data) {
    console.error("Admin login error:", error);
    return { success: false, message: 'Username atau Password salah.' };
  }
  return { success: true, data };
}

export async function getDashboardStats() {
  // Get active students
  const { count: siswaCount, error: err1 } = await supabase
    .from('siswa')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Aktif');

  // Get active classes
  const { count: kelasCount, error: err2 } = await supabase
    .from('kelas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Berjalan');
  // Get lulus students
  const { count: lulusCount, error: err3 } = await supabase
    .from('siswa')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Lulus');
    
  // Chart Data: Distribusi siswa per kelas (via FK kelas_id)
  const { data: siswaData, error: err4 } = await supabase
    .from('siswa')
    .select('kelas:kelas_id(nama)');
    
  let chartData = [];
  if (siswaData) {
      const counts = siswaData.reduce((acc, curr) => {
          const k = curr.kelas?.nama || 'Belum Ada';
          acc[k] = (acc[k] || 0) + 1;
          return acc;
      }, {});
      chartData = Object.keys(counts).map(k => ({ name: k, siswa: counts[k] }));
  }
    
  return {
    totalSiswaAktif: siswaCount || 0,
    totalKelasAktif: kelasCount || 0,
    totalSiswaLulus: lulusCount || 0,
    chartData: chartData,
    error: err1 || err2 || err3 || err4
  };
}

export async function uploadSertifikat(fileBlob, siswaId, modul) {
  const fileName = `sertifikat_${siswaId}_${modul.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  const filePath = `sertifikat/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('materi-pdf') 
    .upload(filePath, fileBlob, {
      contentType: 'application/pdf'
    });
    
  if (error) return { error };
  
  const { data: { publicUrl } } = supabase.storage
    .from('materi-pdf')
    .getPublicUrl(filePath);
    
  return { url: publicUrl, error: null };
}

export async function simpanSertifikatRecord(dataSertifikat) {
  const { data, error } = await supabase
    .from('sertifikat')
    .upsert(dataSertifikat)
    .select()
    .single();
    
  return { data, error };
}

export async function getLulusanSiswa() {
  // Ambil siswa yang lulus beserta data kuisnya untuk dihitung rata-rata
  const { data, error } = await supabase
    .from('siswa')
    .select('*, modul:modul_id(nama), kelas:kelas_id(nama)')
    .eq('status', 'Lulus');
    
  if (data) {
    // We will attach quiz average logic in the component or we can fetch quiz here
    // But since admin page loops, let's fetch quiz hasil once and map it
    const { data: allQuizData } = await supabase
        .from('siswa_quiz_hasil')
        .select('*');
        
    data.forEach(d => {
        d.modul = d.modul?.nama;
        d.kelas = d.kelas?.nama;
        
        // Calculate real average grade
        const studentQuizzes = allQuizData?.filter(q => q.siswa_id === d.id) || [];
        if (studentQuizzes.length > 0) {
            d.nilaiAkhir = Math.round(studentQuizzes.reduce((acc, q) => acc + (q.nilai || 0), 0) / studentQuizzes.length);
        } else {
            d.nilaiAkhir = 80; // Fallback minimum lulus
        }
        
        d.predikat = d.nilaiAkhir >= 90 ? "Sangat Baik" : (d.nilaiAkhir >= 75 ? "Baik" : "Cukup");
    });
  }
    
  return { data, error };
}

export async function getRiwayatSertifikat() {
    const { data, error } = await supabase
      .from('sertifikat')
      .select('*, siswa:siswa_id(nama, id, modul:modul_id(nama))')
      .order('tanggal_lulus', { ascending: false });
      
    return { data, error };
}
