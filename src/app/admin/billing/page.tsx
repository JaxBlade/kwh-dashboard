"use client";

import { useState, useEffect } from "react";
import { Search, Download, FileText, CheckCircle2, Clock } from "lucide-react";

const dummyInvoices = [
  { id: 'INV-2605-001', tenant: 'PT Maju Bersama', floor: 10, period: 'Mei 2026', totalKwh: 1245.5, amount: 1918250, status: 'UNPAID' },
  { id: 'INV-2605-002', tenant: 'CV Sentosa Abadi', floor: 15, period: 'Mei 2026', totalKwh: 850.2, amount: 1325300, status: 'PAID' },
  { id: 'INV-2604-001', tenant: 'PT Maju Bersama', floor: 10, period: 'April 2026', totalKwh: 1100.0, amount: 1700000, status: 'PAID' },
];

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Manajemen Tagihan</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Kelola invoice tagihan listrik bulanan tenant.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm">
          <FileText className="h-4 w-4" />
          Generate Tagihan Bulan Ini
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm font-medium text-neutral-500 mb-1">Total Tagihan (Bulan Ini)</p>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Rp 3.243.550</h3>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm font-medium text-neutral-500 mb-1">Sudah Dibayar</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">Rp 1.325.300</h3>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm font-medium text-neutral-500 mb-1">Belum Dibayar</p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-500">Rp 1.918.250</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Cari No Invoice atau Nama Tenant..." 
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">No Invoice</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Tenant</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Periode</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Total Pemakaian</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Total Tagihan</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600 dark:text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {dummyInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{inv.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{inv.tenant}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Lantai {inv.floor}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{inv.period}</td>
                  <td className="px-6 py-4 font-mono text-neutral-600 dark:text-neutral-400">{inv.totalKwh.toLocaleString('id-ID')} kWh</td>
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    {inv.status === 'PAID' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Belum Lunas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors font-medium">
                      <Download className="h-4 w-4" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
