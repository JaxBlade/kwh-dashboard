"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle, KeyRound } from "lucide-react";
import { requestPasswordReset } from "../actions/password";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);
    
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(true);
    }
    
    setLoading(false);
  }

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
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Lupa Kata Sandi</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Masukkan email Anda untuk menerima tautan reset kata sandi.</p>
          </div>
        </div>
        
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
                Jika email terdaftar, Anda akan segera menerima tautan reset kata sandi. Cek folder Inbox atau Spam Anda.
              </div>
              <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali ke halaman Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 font-bold disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
              
              <div className="text-center mt-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
