import { supabase } from './supabase';

export async function getQuizByMateri(materiId) {
  const { data: quizData, error: quizError } = await supabase
    .from('quiz')
    .select('*')
    .eq('materi_id', materiId)
    .single();
    
  if (quizError || !quizData) {
    return { error: quizError, data: null };
  }
  
  const { data: soalData, error: soalError } = await supabase
    .from('quiz_soal')
    .select(`
      *,
      pilihan:quiz_pilihan(*)
    `)
    .eq('quiz_id', quizData.id)
    .order('urutan', { ascending: true });
    
  // Pilihan order
  if (soalData) {
      soalData.forEach(s => {
          if (s.pilihan) {
             s.pilihan.sort((a, b) => a.urutan - b.urutan);
          }
      });
  }
    
  quizData.soal = soalData || [];
    
  return { data: quizData, error: soalError };
}

export async function getQuizHasilSiswa(siswaId) {
  const { data, error } = await supabase
    .from('siswa_quiz_hasil')
    .select(`
      *,
      quiz:quiz_id (
        judul,
        materi:materi_id (
          modul_id,
          pertemuan
        )
      )
    `)
    .eq('siswa_id', siswaId)
    .order('dikerjakan_pada', { ascending: false });
    
  return { data, error };
}

export async function submitQuizHasil(siswaId, quizId, nilai, status) {
  const { data, error } = await supabase
    .from('siswa_quiz_hasil')
    .upsert({
      siswa_id: siswaId,
      quiz_id: quizId,
      nilai: nilai,
      status: status,
      dikerjakan_pada: new Date().toISOString()
    }, { onConflict: 'siswa_id, quiz_id' })
    .select();
    
  return { data, error };
}

export async function upsertQuiz(quizData) {
  const { data, error } = await supabase
    .from('quiz')
    .upsert(quizData)
    .select()
    .single();
    
  return { data, error };
}

export async function deleteQuiz(id) {
  const { error } = await supabase
    .from('quiz')
    .delete()
    .eq('id', id);
    
  return { error };
}

// Helper function to save soal and pilihan for admin
export async function saveSoalPilihan(quizId, soalList) {
  if (!quizId) throw new Error("quizId is required to save soal");
  if (!soalList || !Array.isArray(soalList)) throw new Error("soalList must be an array");

  // First, we delete all existing soal for this quiz (cascade deletes pilihan)
  const { error: delErr } = await supabase.from('quiz_soal').delete().eq('quiz_id', quizId);
  if (delErr) throw delErr;
  
  // Insert soal and pilihan
  for (let i = 0; i < soalList.length; i++) {
    const soal = soalList[i];
    if (!soal) continue;

    const soalPayload = {
      quiz_id: quizId,
      pertanyaan: soal.pertanyaan || "",
      penjelasan: soal.penjelasan || "",
      urutan: i,
      poin: soal.poin || 10,
    };
    if (soal.gambar_url) {
      soalPayload.gambar_url = soal.gambar_url;
    }

    const { data: insertedSoal, error: errSoal } = await supabase
      .from('quiz_soal')
      .insert(soalPayload)
      .select()
      .single();
      
    if (errSoal) throw errSoal;
      
    if (insertedSoal && soal.pilihan && Array.isArray(soal.pilihan)) {
      const pilihanData = soal.pilihan.map((pil, idx) => {
        const pData = {
          soal_id: insertedSoal.id,
          teks: pil?.teks || "",
          adalah_benar: pil?.adalah_benar || false,
          urutan: idx,
        };
        if (pil?.gambar_url) {
          pData.gambar_url = pil.gambar_url;
        }
        return pData;
      });
      const { error: errPil } = await supabase.from('quiz_pilihan').insert(pilihanData);
      if (errPil) throw errPil;
    }
  }
  
  return { success: true };
}

// Upload quiz image helper
export async function uploadQuizImage(file) {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `quiz/${Date.now()}_${cleanName}`;
  
  const { data, error } = await supabase.storage
    .from('materi-pdf')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) return { error, url: null };
  
  const { data: { publicUrl } } = supabase.storage
    .from('materi-pdf')
    .getPublicUrl(filePath);
    
  return { url: publicUrl, error: null };
}
