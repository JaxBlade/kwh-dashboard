"use client";

import { useState, useEffect } from "react";
import { Download, History, CheckCircle2 } from "lucide-react";

const dummyHistory = [
  { id: 'INV-2604-001', period: 'April 2026', totalKwh: 1100.0, amount: 1700000, date: '20 April 2026' },
  { id: 'INV-2603-001', period: 'Maret 2026', totalKwh: 1050.5, amount: 1625750, date: '20 Maret 2026' },
  { id: 'INV-2602-001', period: 'Februari 2026', totalKwh: 980.2, amount: 1520300, date: '20 Februari 2026' },
];

export default function TenantHistoryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Riwayat Tagihan</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Daftar tagihan bulanan unit Anda yang sudah lunas.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Periode Tagihan</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Tanggal Terbit</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Total Pemakaian</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Nominal Tagihan</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-400">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-600 dark:text-neutral-400">Invoice PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {dummyHistory.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{inv.period}</td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{inv.date}</td>
                  <td className="px-6 py-4 font-mono text-neutral-600 dark:text-neutral-400">{inv.totalKwh.toLocaleString('id-ID')} kWh</td>
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Lunas
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors font-medium">
                      <Download className="h-4 w-4" />
                      Unduh
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
