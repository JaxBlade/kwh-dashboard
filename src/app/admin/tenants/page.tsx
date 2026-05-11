"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MoreVertical, Building } from "lucide-react";

export default function TenantsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Manajemen Tenant</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Kelola daftar perusahaan penyewa yang menempati lantai gedung.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm">
          <Plus className="h-4 w-4" />
          Tambah Tenant Baru
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm p-8 text-center">
        <Building className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Modul Manajemen Tenant Aktif</h3>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2 mb-6">
          Gunakan modul ini untuk menghubungkan meteran fisik (Modbus) dengan akun pengguna (Tenant) agar mereka dapat mengakses portal pribadi mereka.
        </p>
        <button className="px-6 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
          Lihat Panduan Koneksi
        </button>
      </div>
    </div>
  );
}
