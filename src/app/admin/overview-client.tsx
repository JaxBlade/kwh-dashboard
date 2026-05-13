"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Pemantauan konsumsi energi waktu nyata untuk 52 lantai.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Hari Ini</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.totalKwhToday.toLocaleString('id-ID')} <span className="text-lg font-medium text-slate-400">kWh</span></h3>
            </div>
            <div className="p-3.5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-5 flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            <span>Real-time Sync Active</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimasi Tagihan</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">Rp {stats.estimatedBill.toLocaleString('id-ID')}</h3>
            </div>
            <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-5 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>Tarif: Rp {stats.rate.toLocaleString('id-ID')}/kWh</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Meteran Aktif</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.activeMetersCount} <span className="text-lg font-medium text-slate-400">/ {stats.totalMetersCount}</span></h3>
            </div>
            <div className="p-3.5 bg-violet-500/10 dark:bg-violet-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-black text-violet-600 dark:text-violet-400 leading-none">M</span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="relative flex h-2.5 w-2.5">
              {stats.activeMetersCount === stats.totalMetersCount && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${stats.activeMetersCount === stats.totalMetersCount ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            Online Modbus Node
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-7 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform hover:scale-[1.02] duration-300 relative overflow-hidden">
          {stats.anomalyCount > 0 && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          )}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peringatan</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.anomalyCount}</h3>
            </div>
            <div className={`p-3.5 rounded-2xl ${stats.anomalyCount > 0 ? 'bg-amber-500/10 dark:bg-amber-500/20' : 'bg-slate-500/10 dark:bg-slate-500/20'}`}>
              <AlertTriangle className={`h-6 w-6 ${stats.anomalyCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
            </div>
          </div>
          <div className={`mt-5 flex items-center text-sm font-semibold ${stats.anomalyCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'} relative z-10`}>
            <span>{stats.anomalyCount > 0 ? 'Perlu pengecekan teknisi' : 'Semua sistem normal'}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Konsumsi Gedung Per Jam</h3>
            <span className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-full font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Live Data
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.hourlyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value) => [`${value ?? 0} kWh`, 'Pemakaian']}
                />
                <Area 
                  type="monotone" 
                  dataKey="kwh" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorKwh)" 
                  activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Tren 5 Bulan Terakhir</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value) => [`${value ?? 0} kWh`, 'Pemakaian']}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
