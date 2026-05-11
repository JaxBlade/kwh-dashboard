"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  History, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Zap,
  UserCircle
} from "lucide-react";
import { useTheme } from "next-themes";

const navigation = [
  { name: 'Dashboard Unit', href: '/tenant', icon: Home },
  { name: 'Riwayat Tagihan', href: '/tenant/history', icon: History },
];

export default function TenantLayout({
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800">
          <a href="/tenant" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold text-xl">
            <Zap className="h-6 w-6" />
            <span>TenantPanel</span>
          </a>
          <button className="md:hidden text-neutral-500" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tenant Profile Box */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">PT Maju Bersama</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Lantai 10 (M-010)</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
            Menu Utama
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-400'}`} />
                {item.name}
              </a>
            )
          })}
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-neutral-400" /> : <Moon className="h-5 w-5 text-neutral-400" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          )}
          <a
            href="/"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <a href="/tenant" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold text-xl">
            <Zap className="h-6 w-6" />
            <span>TenantPanel</span>
          </a>
          <button className="text-neutral-500" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
