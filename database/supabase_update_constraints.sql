-- ============================================================
-- SQL Migration: Update Check Constraints pada Tabel Siswa
-- Jalankan script ini di menu "SQL Editor" pada dashboard Supabase Anda.
-- ============================================================

-- 1. Mengizinkan status siswa: 'Aktif', 'Lulus', 'Cuti', 'Berhenti'
ALTER TABLE siswa DROP CONSTRAINT IF EXISTS siswa_status_check;
ALTER TABLE siswa ADD CONSTRAINT siswa_status_check 
  CHECK (status IN ('Aktif', 'Lulus', 'Cuti', 'Berhenti'));

-- 2. Mengizinkan status pembayaran: 'Lunas', 'Belum Lunas', 'Cicilan'
ALTER TABLE siswa DROP CONSTRAINT IF EXISTS siswa_status_bayar_check;
ALTER TABLE siswa ADD CONSTRAINT siswa_status_bayar_check 
  CHECK (status_bayar IN ('Lunas', 'Belum Lunas', 'Cicilan'));
