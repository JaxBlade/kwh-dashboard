"use client";

import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Zap, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OverviewClient({ stats }: { stats: any }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Refresh data every 30 seconds to show real-time updates
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Overview Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Ringkasan penggunaan energi gedung 52 lantai hari ini (Real-time).</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Konsumsi Hari Ini</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">{stats.totalKwhToday.toLocaleString('id-ID')} kWh</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Real-time Update</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Estimasi Tagihan (Bulan Ini)</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">Rp {stats.estimatedBill.toLocaleString('id-ID')}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>Berdasarkan tarif Rp {stats.rate.toLocaleString('id-ID')}/kWh</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Meteran Aktif</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">{stats.activeMetersCount} / {stats.totalMetersCount}</h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="h-5 w-5 text-indigo-600 dark:text-indigo-400 font-bold text-center leading-none">M</div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stats.activeMetersCount === stats.totalMetersCount ? 'bg-emerald-500' : 'bg-amber-500'}`}></span> 
              Status Modbus
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Peringatan / Anomali</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">{stats.anomalyCount}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stats.anomalyCount > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-neutral-50 dark:bg-neutral-800'}`}>
              <AlertTriangle className={`h-5 w-5 ${stats.anomalyCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-400'}`} />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-sm ${stats.anomalyCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            <span>{stats.anomalyCount > 0 ? 'Cek detail meteran' : 'Semua sistem normal'}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Konsumsi Gedung Hari Ini (Per Jam)</h3>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium animate-pulse">Live</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.hourlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} kWh`, 'Pemakaian']}
                />
                <Line 
                  type="monotone" 
                  dataKey="kwh" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">Tren 5 Bulan Terakhir</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} kWh`, 'Total']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
