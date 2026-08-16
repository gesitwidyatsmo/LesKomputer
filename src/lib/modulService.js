import { supabase } from './supabase';

export async function getSemuaModul() {
  const { data, error } = await supabase
    .from('modul')
    .select('*')
    .order('urutan', { ascending: true });
  return { data, error };
}

export async function upsertModul(modulData) {
  const { data, error } = await supabase
    .from('modul')
    .upsert(modulData)
    .select()
    .single();
  return { data, error };
}

export async function deleteModul(id) {
  const { error } = await supabase
    .from('modul')
    .delete()
    .eq('id', id);
  return { error };
}

export async function updateUrutanModul(modulList) {
  // Gunakan Promise.all untuk update individual agar tidak error field mandatory yang kosong saat upsert
  const promises = modulList.map(modul => 
    supabase
      .from('modul')
      .update({ urutan: modul.urutan })
      .eq('id', modul.id)
  );
  
  try {
    await Promise.all(promises);
    return { data: true, error: null };
  } catch (error) {
    console.error("Error update urutan:", error);
    return { data: null, error };
  }
}
