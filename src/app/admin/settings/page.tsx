"use client";

import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Pengaturan Sistem</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Konfigurasi dasar sistem penagihan dan Modbus.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5 text-neutral-500" />
          Konfigurasi Tarif Listrik
        </h3>
        
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tarif per kWh (Rupiah)</label>
            <input 
              type="number" 
              defaultValue={1500}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Biaya Beban / Admin Bulanan (Rupiah)</label>
            <input 
              type="number" 
              defaultValue={50000}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm">
            <Save className="h-4 w-4" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
