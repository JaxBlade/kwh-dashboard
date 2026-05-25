"use client";

import { useState, Suspense } from "react";
import { ArrowRight, AlertCircle, CheckCircle, KeyRound, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../actions/password";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Token tidak ditemukan pada URL.");
      return;
    }

    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    const res = await resetPassword(formData);
    
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(true);
    }
    
    setLoading(false);
  }

  if (!token && !success && !error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-3 font-semibold text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          Tautan tidak valid atau token hilang.
        </div>
        <Link href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
          Kembali ke Lupa Kata Sandi
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 pt-2">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 flex items-center gap-3 font-semibold text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center">
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex flex-col items-center gap-3 font-semibold text-sm animate-in fade-in zoom-in duration-500">
            <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
            Kata sandi Anda berhasil diperbarui! Anda sekarang dapat masuk menggunakan kata sandi baru.
          </div>
          <Link href="/" className="inline-flex justify-center items-center gap-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 font-bold mt-4">
            Masuk Sekarang
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi Baru</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 font-medium pr-12"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 font-bold disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
      
      <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
        <div className="p-10 text-center relative overflow-hidden pb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-10 dark:opacity-20 z-0"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Reset Kata Sandi</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Silakan buat kata sandi baru untuk akun Anda.</p>
          </div>
        </div>
        
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
