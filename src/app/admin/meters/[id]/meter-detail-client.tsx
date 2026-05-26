"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, ArrowLeft, Building2, UserCircle2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { getChartData } from "@/app/actions/chart";

type MeterSummary = {
  id: string;
  floor: number;
  status: string;
  tenantName: string | null;
  currentUsage: number;
  estimatedCost: number;
  chartData: any[];
};

export default function MeterDetailClient({ summary }: { summary: MeterSummary }) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [chartData, setChartData] = useState(summary.chartData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function updateChart() {
      if (timeRange === "24h" && summary.chartData.length > 0) {
        // We already have initial 24h data from server
        // but if they click it again after 7d, we can re-fetch or use cache
      }
      
      setIsLoading(true);
      try {
        const newData = await getChartData([summary.id], timeRange);
        setChartData(newData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch if it's not the initial render (which is 24h)
    // Actually, simple way: fetch every time it changes
    updateChart();
  }, [timeRange, summary.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/meters"
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Detail Meter: {summary.id}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Monitoring pergerakan kWh historis per meteran.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lokasi Lantai</h3>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white">Lantai {summary.floor}</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pengguna (Tenant)</h3>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <UserCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {summary.tenantName ? (
              <span className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{summary.tenantName}</span>
            ) : (
              <span className="text-xl font-bold text-slate-400 italic">Belum Ada</span>
            )}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-500/10 dark:text-emerald-400/5 transition-transform duration-500 group-hover:scale-110">
            <Zap className="h-32 w-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Konsumsi Bulan Ini</h3>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{summary.currentUsage}</span>
              <span className="text-sm font-bold text-slate-500">kWh</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-wider">Estimasi Biaya</h3>
              {summary.status === 'ACTIVE' ? (
                <div className="flex items-center text-indigo-100 bg-black/20 px-2 py-1 rounded-md text-xs font-bold">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Online
                </div>
              ) : (
                <div className="flex items-center text-red-200 bg-red-500/20 px-2 py-1 rounded-md text-xs font-bold">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Anomali
                </div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-white">
                Rp {summary.estimatedCost.toLocaleString('id-ID')}
              </span>
              <p className="text-indigo-200 mt-1 text-sm font-medium">Bulan berjalan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grafik Pergerakan kWh</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pantauan penggunaan meteran dalam 24 jam terakhir</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as "24h"|"7d"|"30d")}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  timeRange === range 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorKwhAdmin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 600
                }}
                itemStyle={{ color: '#818cf8', fontWeight: 700 }}
              />
              <Area 
                type="monotone" 
                dataKey="kwh" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorKwhAdmin)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
