"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, CheckCircle2, AlertCircle } from "lucide-react";

// Dummy data for meters
const dummyMeters = Array.from({ length: 52 }).map((_, i) => ({
  id: `M-${String(i + 1).padStart(3, '0')}`,
  floor: i + 1,
  tenant: i === 9 ? 'PT Maju Bersama' : i === 14 ? 'CV Sentosa Abadi' : null,
  status: i === 14 ? 'WARNING' : 'ACTIVE',
  lastReading: Math.floor(Math.random() * 5000) + 1000,
  lastUpdate: 'Baru saja'
}));

export default function MetersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Monitoring Meteran</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Pantau status fisik dari 52 meteran Modbus (Schneider) di gedung ini.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Cari ID Meter atau Lantai..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-neutral-100"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 font-medium">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">ID Meter</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Lantai</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Tenant Assigned</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Status Modbus</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Total kWh Terakhir</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Update Terakhir</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600 dark:text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {dummyMeters.map((meter) => (
                <tr key={meter.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{meter.id}</td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">Lantai {meter.floor}</td>
                  <td className="px-6 py-4">
                    {meter.tenant ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {meter.tenant}
                      </span>
                    ) : (
                      <span className="text-neutral-400 italic">Kosong</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {meter.status === 'ACTIVE' ? (
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        <span>Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4 mr-1.5" />
                        <span>Anomali</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-neutral-700 dark:text-neutral-300">
                    {meter.lastReading.toLocaleString('id-ID')} kWh
                  </td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                    {meter.lastUpdate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <p className="text-sm text-neutral-500">Menampilkan 1 hingga 52 dari 52 meteran</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50" disabled>Seb</button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50" disabled>Sel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
