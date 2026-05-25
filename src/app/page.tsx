"use client";

import { useState } from "react";
import { Zap, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { loginUser } from "./actions/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await loginUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      // Redirect based on role
      if (res.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/tenant";
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 dark:bg-violet-600/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        <div className="p-10 text-center relative overflow-hidden pb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-10 dark:opacity-20 z-0"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30 transform transition hover:scale-105 duration-300">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Smart Power</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Sistem Monitoring Terpusat 52 Lantai</p>
          </div>
        </div>
        
        <div className="p-8 pt-2">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-3 font-semibold text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Akses</label>
              <input 
                type="email" 
                name="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 font-medium"
                placeholder="nama@perusahaan.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 font-medium pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 font-bold disabled:opacity-50 disabled:transform-none mt-2"
            >
              {loading ? 'Mengautentikasi...' : 'Masuk Sistem'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
      
      <p className="mt-12 text-slate-400 dark:text-slate-600 text-sm font-medium tracking-wide">
        &copy; {new Date().getFullYear()} BMS Intelligence. All rights reserved.
      </p>
    </div>
  );
}
