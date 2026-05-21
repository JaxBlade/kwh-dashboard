"use client";

import { useState } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateSettings } from "./actions";

export default function SettingsClient({ initialRate, initialFee }: { initialRate: number, initialFee: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    const formData = new FormData(e.currentTarget);
    const res = await updateSettings(formData);
    
    if (res?.error) {
      setMessage({ type: "error", text: res.error });
    } else {
      setMessage({ type: "success", text: "Pengaturan berhasil disimpan!" });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pengaturan Sistem</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Konfigurasi variabel global untuk perhitungan tagihan dan sistem.</p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] max-w-3xl">
        <div className="p-6 md:p-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            Konfigurasi Tarif Listrik
          </h2>
          
          {message.text && (
            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-semibold ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' 
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}>
              {message.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tarif Dasar per kWh (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input 
                    type="number" 
                    name="ratePerKwh"
                    defaultValue={initialRate}
                    step="0.01"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">Tarif dasar B2/B3 yang berlaku untuk tenant.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Biaya Beban / Admin per Bulan (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input 
                    type="number" 
                    name="adminFee"
                    defaultValue={initialFee}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">Biaya tetap bulanan (maintenance/admin).</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 font-bold disabled:opacity-50 disabled:transform-none"
              >
                <Save className="h-5 w-5" />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
