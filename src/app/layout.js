import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata = {
  title: "GWA Tech Course // Kursus Komputer Eksklusif 1-on-5",
  description: "Belajar Komputer Gak Pakai Rumit. Dari Nol Sampai Mahir Praktik. Kuasai Microsoft Office (Word, Excel, PowerPoint) dengan metode eksklusif 1-on-5 mentoring.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-950 bg-[#FFFDF5] selection:bg-amber-300 selection:text-black">
        {children}
      </body>
    </html>
  );
}

