import { supabase } from './supabase';

export async function getJadwalByKelas(kelasId) {
  const { data, error } = await supabase
    .from('jadwal_pertemuan')
    .select('*')
    .eq('kelas_id', kelasId)
    .order('pertemuan_ke', { ascending: true });
    
  return { data, error };
}

export async function upsertJadwal(jadwalData) {
  const { data, error } = await supabase
    .from('jadwal_pertemuan')
    .upsert(jadwalData)
    .select()
    .single();
    
  return { data, error };
}

export async function saveJadwalWithShift(sesiData, isEdit = false, oldPertemuanKe = null) {
  const targetPertemuan = parseInt(sesiData.pertemuan_ke, 10) || 1;
  const kelasId = sesiData.kelas_id;

  // 1. Ambil semua sesi di kelas ini
  const { data: allSessions, error: fetchErr } = await supabase
    .from('jadwal_pertemuan')
    .select('*')
    .eq('kelas_id', kelasId)
    .order('pertemuan_ke', { ascending: true });

  if (fetchErr) return { error: fetchErr };

  const currentList = allSessions || [];

  if (!isEdit) {
    // KASUS TAMBAH SESI BARU:
    // Cek apakah nomor pertemuan target sudah ada
    const exists = currentList.some(s => s.pertemuan_ke === targetPertemuan);
    if (exists) {
      // Geser semua sesi yang >= targetPertemuan dengan +1 (update descending agar aman)
      const toShift = currentList
        .filter(s => s.pertemuan_ke >= targetPertemuan)
        .sort((a, b) => b.pertemuan_ke - a.pertemuan_ke);

      for (const item of toShift) {
        await supabase
          .from('jadwal_pertemuan')
          .update({ pertemuan_ke: item.pertemuan_ke + 1 })
          .eq('id', item.id);
      }
    }
    // Insert sesi baru
    const { data, error } = await supabase
      .from('jadwal_pertemuan')
      .insert({ ...sesiData, pertemuan_ke: targetPertemuan })
      .select()
      .single();

    return { data, error };
  } else {
    // KASUS EDIT SESI:
    const oldNum = parseInt(oldPertemuanKe, 10) || targetPertemuan;

    if (targetPertemuan === oldNum) {
      // Tidak ada perubahan nomor urut, langsung update
      const { data, error } = await supabase
        .from('jadwal_pertemuan')
        .update(sesiData)
        .eq('id', sesiData.id)
        .select()
        .single();
      return { data, error };
    }

    // Jika nomor urut berubah:
    if (targetPertemuan < oldNum) {
      // Geser maju sesi di range [targetPertemuan, oldNum - 1] dengan +1
      const toShift = currentList
        .filter(s => s.id !== sesiData.id && s.pertemuan_ke >= targetPertemuan && s.pertemuan_ke < oldNum)
        .sort((a, b) => b.pertemuan_ke - a.pertemuan_ke);

      for (const item of toShift) {
        await supabase
          .from('jadwal_pertemuan')
          .update({ pertemuan_ke: item.pertemuan_ke + 1 })
          .eq('id', item.id);
      }
    } else if (targetPertemuan > oldNum) {
      // Geser mundur sesi di range [oldNum + 1, targetPertemuan] dengan -1
      const toShift = currentList
        .filter(s => s.id !== sesiData.id && s.pertemuan_ke > oldNum && s.pertemuan_ke <= targetPertemuan)
        .sort((a, b) => a.pertemuan_ke - b.pertemuan_ke);

      for (const item of toShift) {
        await supabase
          .from('jadwal_pertemuan')
          .update({ pertemuan_ke: item.pertemuan_ke - 1 })
          .eq('id', item.id);
      }
    }

    // Update sesi yang sedang diedit
    const { data, error } = await supabase
      .from('jadwal_pertemuan')
      .update({ ...sesiData, pertemuan_ke: targetPertemuan })
      .eq('id', sesiData.id)
      .select()
      .single();

    return { data, error };
  }
}

export async function deleteJadwal(id) {
  const { error } = await supabase
    .from('jadwal_pertemuan')
    .delete()
    .eq('id', id);
    
  return { error };
}

export async function deleteJadwalAndResequence(id, kelasId) {
  // 1. Hapus sesi yang dipilih
  const { error: delError } = await supabase
    .from('jadwal_pertemuan')
    .delete()
    .eq('id', id);

  if (delError) return { error: delError };

  // 2. Ambil seluruh sesi tersisa di kelas tersebut, urutkan berdasarkan pertemuan_ke
  const { data: sisaJadwal, error: fetchError } = await supabase
    .from('jadwal_pertemuan')
    .select('id, pertemuan_ke, tanggal')
    .eq('kelas_id', kelasId)
    .order('pertemuan_ke', { ascending: true });

  if (fetchError || !sisaJadwal) return { error: fetchError };

  // 3. Susun ulang nomor pertemuan secara berurutan: 1, 2, 3, ...
  const updatePromises = sisaJadwal.map((sesi, index) => {
    const nomorBaru = index + 1;
    if (sesi.pertemuan_ke !== nomorBaru) {
      return supabase
        .from('jadwal_pertemuan')
        .update({ pertemuan_ke: nomorBaru })
        .eq('id', sesi.id);
    }
    return Promise.resolve();
  });

  await Promise.all(updatePromises);

  return { data: true, error: null };
}

export async function deleteJadwalByKelas(kelasId) {
  const { error } = await supabase
    .from('jadwal_pertemuan')
    .delete()
    .eq('kelas_id', kelasId);
    
  return { error };
}

export async function insertJadwalBatch(jadwalArray) {
  const { data, error } = await supabase
    .from('jadwal_pertemuan')
    .insert(jadwalArray)
    .select();
    
  return { data, error };
}
