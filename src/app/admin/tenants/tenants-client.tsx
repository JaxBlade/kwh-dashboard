"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Building, Eye, X, CheckCircle2, Edit, Trash2, AlertTriangle } from "lucide-react";
import { addTenant, editTenant, deleteTenant } from "./actions";

export default function TenantsClient({ initialTenants, availableMeters }: { initialTenants: any[], availableMeters: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<any | null>(null);
  const [guideTenant, setGuideTenant] = useState<any | null>(null); // For connection guide modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredTenants = initialTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAddTenant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await addTenant(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setIsAddModalOpen(false);
    }
    setLoading(false);
  }

  async function handleEditTenant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.append("id", editingTenant.id);
    const res = await editTenant(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setEditingTenant(null);
    }
    setLoading(false);
  }

  async function handleDeleteTenant(id: string) {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("id", id);
    const res = await deleteTenant(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setDeletingTenant(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manajemen Tenant</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kelola daftar perusahaan penyewa yang menempati lantai gedung.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 font-bold"
        >
          <Plus className="h-5 w-5" />
          Tambah Tenant
        </button>
      </div>

      {/* Action Bar */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama perusahaan atau email..." 
          className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Perusahaan / Tenant</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Kontak Email</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Unit Assigned</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Bergabung Sejak</th>
                <th className="px-6 py-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTenants.length > 0 ? filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                      <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    {tenant.name}
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-600 dark:text-slate-300">{tenant.email}</td>
                  <td className="px-6 py-5">
                    {tenant.metersCount > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                        {tenant.assignedMeters}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium italic">Belum ada unit</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      <span>{tenant.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 dark:text-slate-400 font-medium text-xs">
                    {tenant.joinDate}
                  </td>
                  <td className="px-6 py-5 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => setGuideTenant(tenant)}
                      className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1 transition-colors"
                      title="Panduan"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => setEditingTenant(tenant)}
                      className="px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 rounded-lg flex items-center gap-1 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeletingTenant(tenant)}
                      className="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg flex items-center gap-1 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Building className="h-8 w-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-base">Tidak ada tenant ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Tenant */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Tenant Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTenant} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Perusahaan / Tenant</label>
                <input type="text" name="name" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Akses Tenant</label>
                <input type="email" name="email" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Meteran (Lantai)</label>
                <select name="meterId" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
                  <option value="">Pilih meteran kosong...</option>
                  {availableMeters.map(m => (
                    <option key={m.id} value={m.id}>{m.id} - Lantai {m.floor}</option>
                  ))}
                </select>
                {availableMeters.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1 font-medium">Semua meteran saat ini sudah memiliki tenant.</p>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Connection Guide */}
      {guideTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setGuideTenant(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Panduan Akses Tenant</h3>
              <button onClick={() => setGuideTenant(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Informasi Akun</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-1">Berikan kredensial berikut kepada penyewa ({guideTenant.name}) untuk mengakses Portal Tenant:</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl">
                    <span className="text-sm text-slate-500">URL Akses</span>
                    <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">kwh-dashboard.vercel.app/tenant</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl">
                    <span className="text-sm text-slate-500">Email Login</span>
                    <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">{guideTenant.email}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl">
                    <span className="text-sm text-slate-500">Status Aktivasi</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {guideTenant.isEmailVerified ? "Aktif" : "Menunggu Aktivasi"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Koneksi Hardware Modbus</p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                  <li>Meteran ID: <strong className="text-slate-800 dark:text-slate-200">{guideTenant.assignedMeters || 'Belum di-assign'}</strong></li>
                  <li>Protocol: Modbus RTU / TCP (via Gateway)</li>
                  <li>Sistem otomatis akan melakukan polling data kWh setiap 10 menit.</li>
                </ul>
              </div>

              <button onClick={() => setGuideTenant(null)} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Tenant */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingTenant(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Tenant</h3>
              <button onClick={() => setEditingTenant(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditTenant} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Perusahaan / Tenant</label>
                <input type="text" name="name" defaultValue={editingTenant.name} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Akses Tenant</label>
                <input type="email" name="email" defaultValue={editingTenant.email} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Meteran (Lantai)</label>
                <select name="meterId" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white">
                  <option value="">-- Biarkan jika tidak ingin diubah --</option>
                  {availableMeters.map(m => (
                    <option key={m.id} value={m.id}>{m.id} - Lantai {m.floor}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Meteran saat ini: {editingTenant.assignedMeters || 'Tidak ada'}</p>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingTenant(null)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {deletingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeletingTenant(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hapus Tenant?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Anda yakin ingin menghapus <strong>{deletingTenant.name}</strong>? Tindakan ini tidak dapat dibatalkan dan akan memutuskan hubungan dengan unit meteran mereka.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setDeletingTenant(null)} disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                Batal
              </button>
              <button onClick={() => handleDeleteTenant(deletingTenant.id)} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50">
                {loading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
