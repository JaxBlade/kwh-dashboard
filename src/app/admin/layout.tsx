"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Receipt, 
  Settings, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Zap
} from "lucide-react";
import { useTheme } from "next-themes";

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Meteran & Lantai', href: '/admin/meters', icon: Building2 },
  { name: 'Manajemen Tenant', href: '/admin/tenants', icon: Users },
  { name: 'Tagihan & Invoice', href: '/admin/billing', icon: Receipt },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col md:flex-row relative selection:bg-indigo-500/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 transform transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] md:relative md:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-200/60 dark:border-slate-800/60">
          <a href="/admin" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl tracking-tight group">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span>PowerPanel</span>
          </a>
          <button className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                {item.name}
              </a>
            )
          })}
        </div>

        <div className="p-6 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 group"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" /> : <Moon className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          )}
          <a
            href="/"
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-rose-500/70 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
            Logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative Background Blob for Main Content */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <a href="/admin" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
            <Zap className="h-5 w-5" />
            <span>PowerPanel</span>
          </a>
          <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
