import { supabase } from './supabase';

export async function generateIdKelas() {
  const { data } = await supabase.from('kelas').select('id');
  const nums = (data || []).map(k => {
    const match = k.id?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `K-${String(max + 1).padStart(3, '0')}`;
}

export async function getSemuaKelas() {
  const { data, error } = await supabase
    .from('kelas')
    .select('*')
    .order('nama', { ascending: true });
    
  return { data, error };
}

export async function upsertKelas(kelasData) {
  const dataToSave = { ...kelasData };
  if (!dataToSave.id) {
    dataToSave.id = await generateIdKelas();
  }
  const { data, error } = await supabase
    .from('kelas')
    .upsert(dataToSave)
    .select()
    .single();
    
  return { data, error };
}

export async function deleteKelas(id) {
  const { error } = await supabase
    .from('kelas')
    .delete()
    .eq('id', id);
    
  return { error };
}
