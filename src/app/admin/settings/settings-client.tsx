"use client";

import { useState } from "react";
import { Save, AlertCircle, CheckCircle2, ShieldCheck, Plus, X, UserPlus } from "lucide-react";
import { updateSettings, addAdmin } from "./actions";

type AdminType = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
};

export default function SettingsClient({ initialRate, initialFee, admins }: { initialRate: number, initialFee: number, admins: AdminType[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState({ type: "", text: "" });

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

  async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdminLoading(true);
    setAdminMsg({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const res = await addAdmin(formData);

    if (res?.error) {
      setAdminMsg({ type: "error", text: res.error });
    } else {
      setAdminMsg({ type: "success", text: "Admin baru berhasil ditambahkan!" });
      setIsAddAdminOpen(false);
    }

    setAdminLoading(false);
    setTimeout(() => setAdminMsg({ type: "", text: "" }), 5000);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pengaturan Sistem</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Konfigurasi variabel global untuk perhitungan tagihan dan manajemen akses.</p>
      </div>

      {/* === Tarif Listrik === */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] max-w-3xl">
        <div className="p-6 md:p-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            ⚡ Konfigurasi Tarif Listrik
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

      {/* === Manajemen Akses Admin === */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] max-w-3xl">
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
              Akses Administrator
            </h2>
            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 font-bold text-sm"
            >
              <UserPlus className="h-4 w-4" />
              Tambah Admin
            </button>
          </div>

          {adminMsg.text && !isAddAdminOpen && (
            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-semibold ${
              adminMsg.type === 'error' 
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' 
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}>
              {adminMsg.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              {adminMsg.text}
            </div>
          )}

          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{admin.name}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{admin.email}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Sejak {admin.joinDate}</span>
              </div>
            ))}

            {admins.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-4">Belum ada admin terdaftar.</p>
            )}
          </div>
        </div>
      </div>

      {/* === Modal Tambah Admin === */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddAdminOpen(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Admin Baru</h3>
              <button onClick={() => setIsAddAdminOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              {adminMsg.text && adminMsg.type === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {adminMsg.text}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                <input type="text" name="name" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" placeholder="Contoh: Budi Setiawan" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input type="email" name="email" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" placeholder="admin2@bms.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <input type="text" name="password" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" placeholder="Buat password untuk admin baru" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddAdminOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={adminLoading} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                  {adminLoading ? 'Menyimpan...' : 'Simpan Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
