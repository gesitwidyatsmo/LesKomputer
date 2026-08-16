import { SiswaProvider } from "@/context/SiswaContext";

export const metadata = {
  title: "Portal Siswa | GWA Tech Course",
  description: "Portal belajar online siswa GWA Tech Course. Akses materi, jadwal, quiz, dan nilai kursus Anda.",
};

export default function SiswaLoginLayout({ children }) {
  return <SiswaProvider>{children}</SiswaProvider>;
}
