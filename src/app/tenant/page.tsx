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
} from "recharts";
import { Zap, DollarSign, Calendar, TrendingDown } from "lucide-react";

// Dummy data for charts
const hourlyData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  kwh: Math.floor(Math.random() * 5) + 5,
}));

export default function TenantOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Halo, PT Maju Bersama</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Ini adalah ringkasan pemakaian listrik unit Anda bulan ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Zap className="h-32 w-32 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pemakaian Berjalan (Bulan Ini)</p>
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">145.5 <span className="text-lg text-neutral-400">kWh</span></h3>
            <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-max px-2 py-1 rounded">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>-5% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Estimasi Tagihan Sementara</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">Rp 218.250</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>+ Biaya beban Rp 50.000</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Jatuh Tempo Berikutnya</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">20 Mei 2026</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>Pencatatan meter setiap tanggal 20</span>
          </div>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Grafik Konsumsi (24 Jam Terakhir)</h3>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="kwh" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
