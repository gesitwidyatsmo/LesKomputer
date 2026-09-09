import { supabase } from './supabase';

export async function getMateriByModul(modulId) {
  const { data, error } = await supabase
    .from('materi')
    .select(`
      *,
      lampiran:materi_lampiran(*)
    `)
    .eq('modul_id', modulId)
    .order('pertemuan', { ascending: true });
    
  return { data, error };
}

export async function getAksesSiswa(siswaId) {
  const { data, error } = await supabase
    .from('siswa_akses_materi')
    .select('*')
    .eq('siswa_id', siswaId);
    
  // Return as a map object: { materiId: status } for easier lookup
  const aksesMap = {};
  if (data) {
    data.forEach(item => {
      aksesMap[item.materi_id] = item.status;
    });
  }
  
  return { data, aksesMap, error };
}

export async function bukaAkses(siswaId, materiId) {
  const { data, error } = await supabase
    .from('siswa_akses_materi')
    .upsert({
      siswa_id: siswaId,
      materi_id: materiId,
      status: 'terbuka',
      dibuka_pada: new Date().toISOString()
    }, { onConflict: 'siswa_id, materi_id' })
    .select();
    
  return { data, error };
}

export async function tandaiSelesai(siswaId, materiId, nextMateriId = null) {
  // Tandai selesai materi saat ini
  const { error: err1 } = await supabase
    .from('siswa_akses_materi')
    .upsert({
      siswa_id: siswaId,
      materi_id: materiId,
      status: 'selesai'
    }, { onConflict: 'siswa_id, materi_id' });
    
  if (err1) return { error: err1 };
  
  // Buka materi berikutnya jika diberikan
  if (nextMateriId) {
    const { error: err2 } = await supabase
      .from('siswa_akses_materi')
      .upsert({
        siswa_id: siswaId,
        materi_id: nextMateriId,
        status: 'terbuka',
        dibuka_pada: new Date().toISOString()
      }, { onConflict: 'siswa_id, materi_id' });
      
    if (err2) return { error: err2 };
  }
  
  return { success: true };
}

export async function kunciUlang(siswaId, materiId) {
  const { data, error } = await supabase
    .from('siswa_akses_materi')
    .upsert({
      siswa_id: siswaId,
      materi_id: materiId,
      status: 'terkunci'
    }, { onConflict: 'siswa_id, materi_id' })
    .select();
    
  return { data, error };
}

export async function bukaSemuaAkses(siswaId, allMateriIds) {
  const upsertData = allMateriIds.map(id => ({
    siswa_id: siswaId,
    materi_id: id,
    status: 'terbuka',
    dibuka_pada: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('siswa_akses_materi')
    .upsert(upsertData, { onConflict: 'siswa_id, materi_id' });
    
  return { data, error };
}

export function uploadPDFWithProgress(file, modul, fileName, onProgress) {
  return new Promise((resolve) => {
    const rawFileName = fileName || file?.name || "modul_materi.pdf";
    const cleanName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const cleanModul = (modul || "modul").replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${cleanModul}/${Date.now()}_${cleanName}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const uploadUrl = `${supabaseUrl}/storage/v1/object/materi-pdf/${filePath}`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);

    xhr.setRequestHeader('apikey', supabaseAnonKey);
    xhr.setRequestHeader('Authorization', `Bearer ${supabaseAnonKey}`);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.setRequestHeader('Content-Type', file?.type || 'application/pdf');

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress({
            percent,
            loaded: event.loaded,
            total: event.total,
            loadedMB: (event.loaded / (1024 * 1024)).toFixed(2),
            totalMB: (event.total / (1024 * 1024)).toFixed(2),
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { data: { publicUrl } } = supabase.storage
          .from('materi-pdf')
          .getPublicUrl(filePath);

        resolve({
          path: filePath,
          url: publicUrl,
          error: null,
        });
      } else {
        let errMessage = 'Gagal upload PDF ke storage';
        try {
          const res = JSON.parse(xhr.responseText);
          errMessage = res.message || res.error || errMessage;
        } catch {
          errMessage = xhr.statusText || errMessage;
        }
        resolve({ error: new Error(errMessage) });
      }
    };

    xhr.onerror = () => {
      resolve({ error: new Error('Koneksi jaringan terputus saat mengunggah PDF.') });
    };

    xhr.ontimeout = () => {
      resolve({ error: new Error('Waktu pengunggahan berkas PDF habis (timeout).') });
    };

    xhr.send(file);
  });
}

export async function uploadPDF(file, modul, fileName, onProgress = null) {
  if (typeof window !== 'undefined' && typeof XMLHttpRequest !== 'undefined' && typeof onProgress === 'function') {
    return uploadPDFWithProgress(file, modul, fileName, onProgress);
  }

  const rawFileName = fileName || file?.name || "modul_materi.pdf";
  const cleanName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const cleanModul = (modul || "modul").replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${cleanModul}/${Date.now()}_${cleanName}`;
  
  const { data, error } = await supabase.storage
    .from('materi-pdf')
    .upload(filePath, file, {
      contentType: file?.type || 'application/pdf',
      upsert: true,
    });
    
  if (error) return { error };
  
  const { data: { publicUrl } } = supabase.storage
    .from('materi-pdf')
    .getPublicUrl(filePath);
    
  return { 
    path: data.path,
    url: publicUrl,
    error: null,
  };
}

export async function uploadBahanLatihan(file, modulName = "bahan") {
  const cleanName = (file.name || "bahan_latihan").replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `bahan-latihan/${modulName}/${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from('materi-pdf')
    .upload(filePath, file, { upsert: true });

  if (error) return { error };

  const { data: { publicUrl } } = supabase.storage
    .from('materi-pdf')
    .getPublicUrl(filePath);

  const ukuranMB = (file.size / (1024 * 1024)).toFixed(1);

  return {
    nama_file: file.name,
    url_file: publicUrl,
    ukuran_mb: ukuranMB === "0.0" ? "0.1" : ukuranMB,
    path: data.path,
  };
}

export async function deletePDF(path) {
  const { error } = await supabase.storage
    .from('materi-pdf')
    .remove([path]);
    
  return { error };
}

export async function upsertMateri(materiData) {
  const { data, error } = await supabase
    .from('materi')
    .upsert(materiData)
    .select()
    .single();
    
  return { data, error };
}

export async function upsertLampiran(lampiranData) {
  const { data, error } = await supabase
    .from('materi_lampiran')
    .upsert(lampiranData)
    .select()
    .single();
    
  return { data, error };
}

export async function deleteMateri(id) {
  const { error } = await supabase
    .from('materi')
    .delete()
    .eq('id', id);
    
  return { error };
}

export async function deleteLampiran(id) {
  const { error } = await supabase
    .from('materi_lampiran')
    .delete()
    .eq('id', id);
    
  return { error };
}
