"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiswaProvider, useSiswa } from "@/context/SiswaContext";
import SiswaNavbar from "@/components/siswa/SiswaNavbar";

function PortalGuard({ children }) {
  const { currentSiswa, isLoading } = useSiswa();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentSiswa) {
      router.replace("/siswa/login");
    }
  }, [currentSiswa, isLoading, router]);

  if (isLoading || !currentSiswa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] bg-retro-dots p-4">
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] p-6 max-w-sm w-full text-center space-y-3">
          <div className="w-10 h-10 border-3 border-black border-t-orange-500 rounded-full animate-spin mx-auto" />
          <div className="font-mono text-xs font-bold uppercase text-black">
            &gt;_ Memuat Sesi Siswa...
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            [SYS_AUTHENTICATING // GWA_LMS]
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default function PortalSiswaLayout({ children }) {
  return (
    <SiswaProvider>
      <PortalGuard>
        <div className="min-h-screen bg-[#FFFDF5] text-slate-950 flex flex-col">
          <SiswaNavbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t-3 border-black bg-white py-4 px-4 text-center">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs font-bold text-slate-700">
              <span>© 2026 GWA TECH COURSE · PORTAL SISWA LMS</span>
              <span className="bg-amber-300 text-black px-2 py-0.5 border border-black text-[10px]">
                SYS_STATUS: 200_OK
              </span>
            </div>
          </footer>
        </div>
      </PortalGuard>
    </SiswaProvider>
  );
}
