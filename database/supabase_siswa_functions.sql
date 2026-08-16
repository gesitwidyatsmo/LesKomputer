-- ============================================================
-- SQL Functions yang dibutuhkan untuk fitur Admin Siswa
-- Jalankan ini di Supabase SQL Editor
-- ============================================================

-- 1. Function: buat_siswa_baru
--    Membuat record siswa baru dengan password di-hash menggunakan bcrypt (pgcrypto)
--    Dipanggil oleh: tambahSiswa() di siswaService.js
-- ============================================================
CREATE OR REPLACE FUNCTION buat_siswa_baru(
  p_id           TEXT,
  p_nama         TEXT,
  p_tanggal_lahir DATE,
  p_wa           TEXT,
  p_kelas_id     UUID,   -- sesuaikan tipe dengan kolom kelas.id di tabel Anda
  p_modul_id     TEXT,   -- sesuaikan tipe dengan kolom modul.id di tabel Anda
  p_status       TEXT DEFAULT 'Aktif',
  p_status_bayar TEXT DEFAULT 'Belum Lunas',
  p_password     TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  hashed_pass TEXT;
BEGIN
  -- Hash password jika diberikan (menggunakan pgcrypto bcrypt)
  IF p_password IS NOT NULL AND p_password != '' THEN
    hashed_pass := crypt(p_password, gen_salt('bf'));
  ELSE
    hashed_pass := crypt(p_id, gen_salt('bf')); -- fallback: password = ID siswa
  END IF;

  INSERT INTO siswa (id, nama, tanggal_lahir, wa, kelas_id, modul_id, status, status_bayar, password)
  VALUES (p_id, p_nama, p_tanggal_lahir, p_wa, p_kelas_id, p_modul_id, p_status, p_status_bayar, hashed_pass);

  RETURN p_id;
END;
$$;


-- 2. Function: reset_password_siswa
--    Mereset password siswa dengan bcrypt baru
--    Dipanggil oleh: resetPasswordSiswa() di siswaService.js
-- ============================================================
CREATE OR REPLACE FUNCTION reset_password_siswa(
  p_id           TEXT,
  p_password_baru TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE siswa
  SET password = crypt(p_password_baru, gen_salt('bf'))
  WHERE id = p_id;

  RETURN FOUND;
END;
$$;


-- ============================================================
-- CATATAN PENTING:
--
-- 1. Pastikan ekstensi pgcrypto sudah aktif di Supabase:
--    CREATE EXTENSION IF NOT EXISTS pgcrypto;
--
-- 2. Sesuaikan tipe data p_kelas_id dengan tipe kolom kelas.id:
--    - Jika kelas.id bertipe INTEGER, ubah p_kelas_id menjadi INTEGER
--    - Jika bertipe UUID, biarkan UUID
--    - Jika bertipe TEXT, ubah menjadi TEXT
--
-- 3. Sesuaikan tipe data p_modul_id dengan tipe kolom modul.id:
--    - Biasanya TEXT (slug seperti 'ms-office')
--
-- 4. Tabel siswa harus memiliki kolom berikut:
--    id, nama, tanggal_lahir, wa, kelas_id, modul_id, status, status_bayar, password
-- ============================================================
