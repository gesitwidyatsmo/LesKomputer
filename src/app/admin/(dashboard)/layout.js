"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Award,
  LogOut,
  Menu,
  X,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  LayoutTemplate
} from "lucide-react";
import { useState, useEffect } from "react";

function AdminGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem("admin_session");
      if (session) {
        setIsAuthenticated(true);
      } else {
        router.replace("/admin/login");
      }
    } catch {
      router.replace("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] bg-retro-dots">
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] p-6 flex flex-col items-center gap-3">
          <div className="flex gap-1.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block animate-pulse"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block animate-pulse delay-75"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block animate-pulse delay-150"></span>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-xs font-mono font-bold uppercase text-black">[SYS_AUTH: CHECKING_CREDENTIALS...]</p>
        </div>
      </div>
    );
  }

  return children;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState("Administrator");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.nama) setAdminUser(parsed.nama);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.replace("/admin/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" />, badge: "SYS" },
    { name: "Data Siswa", href: "/admin/siswa", icon: <Users className="w-4 h-4" /> },
    { name: "Kelas & Jadwal", href: "/admin/kelas", icon: <Calendar className="w-4 h-4" /> },
    { name: "Kelola Materi", href: "/admin/materi", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Sertifikat", href: "/admin/sertifikat", icon: <Award className="w-4 h-4" /> },
    { name: "Kelola Beranda", href: "/admin/landing", icon: <LayoutTemplate className="w-4 h-4" /> },
  ];

  const SidebarContent = ({ isMobile }) => {
    const collapsed = isMobile ? false : isCollapsed;
    
    return (
      <div className={`relative h-full flex flex-col bg-slate-950 text-white border-r-3 border-black shadow-[4px_0px_0px_0px_#000] transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Retro Window Titlebar Header */}
        <div className="px-3 py-2 bg-black border-b-2 border-black flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block"></span>
            </div>
            {!collapsed && <span className="font-mono text-[10px] text-slate-400">gwa_admin.exe</span>}
          </div>
          {!collapsed && <span className="text-[10px] text-emerald-400 font-mono font-bold">[ONLINE]</span>}
        </div>

        {/* Brand Header */}
        <div className={`h-16 flex items-center bg-slate-900 border-b-2 border-black relative ${collapsed ? 'justify-center' : 'px-4 justify-between'}`}>
          <div className="flex items-center">
            <div className={`w-9 h-9 bg-orange-500 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black font-heading font-black text-xl shrink-0 ${collapsed ? '' : 'mr-3'}`}>
              G
            </div>
            {!collapsed && (
              <div>
                <span className="font-heading font-black text-base tracking-wider uppercase text-white block leading-none">
                  GWA Admin
                </span>
                <span className="font-mono text-[10px] text-amber-400 font-bold block mt-1">
                  SYS_CTRL // v2.0
                </span>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-8 h-8 text-slate-300 bg-slate-800 hover:bg-orange-500 hover:text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              title={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {/* Navigation Items */}
        <div className={`flex-1 overflow-y-auto py-5 space-y-2 overflow-x-hidden ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && (
            <div className="px-2 mb-2">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                MAIN_MENU //
              </span>
            </div>
          )}
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center py-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  collapsed ? "justify-center px-0" : "px-3"
                } ${
                  isActive 
                    ? "bg-orange-500 text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] translate-x-1" 
                    : "text-slate-300 bg-slate-900/60 hover:bg-slate-800 hover:text-white border-2 border-slate-800 hover:border-black shadow-[2px_2px_0px_0px_#000]"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <div className={`${collapsed ? "" : "mr-2.5"} ${isActive ? "text-black" : "text-amber-400"} shrink-0`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="whitespace-nowrap flex-1">{item.name}</span>
                )}
                {!collapsed && isActive && (
                  <span className="font-mono text-[9px] bg-black text-white px-1.5 py-0.5 rounded-none font-bold">
                    ACTIVE
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Footer Logout */}
        <div className="p-3 border-t-2 border-black bg-slate-900">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border-2 border-rose-600/50 hover:border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className={`${collapsed ? "" : "mr-2.5"} w-4 h-4 shrink-0`} />
            {!collapsed && <span>{">_"} Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminGuard>
      <div className="h-screen bg-[#FFFDF5] flex overflow-hidden font-sans">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Desktop */}
        <div 
          className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-50 transition-all duration-200"
          style={{ width: isCollapsed ? '5rem' : '16rem' }}
        >
          <SidebarContent isMobile={false} />
        </div>

        {/* Sidebar Mobile */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <SidebarContent isMobile={true} />
        </div>

        {/* Spacer for Desktop Sidebar */}
        <div 
          aria-hidden="true" 
          className="hidden lg:flex shrink-0 transition-all duration-200" 
          style={{ width: isCollapsed ? '5rem' : '16rem' }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b-3 border-black shadow-[0px_3px_0px_0px_#000]">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-black bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all lg:hidden cursor-pointer"
                title="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Status Ticker */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono text-xs font-bold text-black uppercase tracking-wide">
                  GWA_SYSTEM: STABLE // PORT: 3000
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-mono font-bold text-black uppercase">{adminUser}</p>
                <span className="inline-block font-mono text-[10px] font-bold uppercase bg-cyan-200 text-black px-1.5 py-0.2 border border-black">
                  [SYS_SUPERADMIN]
                </span>
              </div>
              <div className="w-10 h-10 bg-amber-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black font-heading font-black text-sm">
                AD
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex flex-col bg-[#FFFDF5] bg-retro-dots">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

