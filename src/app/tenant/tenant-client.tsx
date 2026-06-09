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
import { Zap, DollarSign, Calendar, Activity, Loader2 } from "lucide-react";
import { getChartData } from "@/app/actions/chart";

export default function TenantClient({ summary }: { summary: any }) {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [chartData, setChartData] = useState(summary.chartData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function updateChart() {
      if (timeRange === "24h" && summary.chartData.length > 0) {
        // use initial data
      }
      if (!summary.meterIds || summary.meterIds.length === 0) return;

      setIsLoading(true);
      try {
        const newData = await getChartData(summary.meterIds, timeRange);
        setChartData(newData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted) {
      updateChart();
    }
  }, [timeRange, summary.meterIds, mounted]);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Halo, {summary.name}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Ini adalah ringkasan pemakaian listrik unit Anda bulan ini.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transform translate-x-4 -translate-y-4 transition-all duration-500">
            <Zap className="h-32 w-32 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Pemakaian Berjalan (Bulan Ini)</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
              {summary.currentUsage.toLocaleString('id-ID')} <span className="text-lg text-neutral-400 font-semibold">kWh</span>
            </h3>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-max px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/20">
              <Activity className="h-3.5 w-3.5 mr-1" />
              <span>Realtime Polling</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transform translate-x-4 -translate-y-4 transition-all duration-500">
            <Activity className="h-32 w-32 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Beban Daya Aktif</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
              {summary.currentKw.toLocaleString('id-ID')} <span className="text-lg text-neutral-400 font-semibold">kW</span>
            </h3>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 w-max px-2.5 py-1 rounded-md border border-amber-100 dark:border-amber-500/20">
              <Activity className="h-3.5 w-3.5 mr-1" />
              <span>Current Load</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Estimasi Tagihan Sementara</p>
              <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
                Rp {summary.estimatedBill.toLocaleString('id-ID')}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 w-max px-2.5 py-1 rounded-md">
            <span>Sudah termasuk biaya beban Rp {summary.adminFee.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Jatuh Tempo Berikutnya</p>
              <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
                {summary.nextDueDate}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 w-max px-2.5 py-1 rounded-md">
            <span>Pencatatan meter setiap akhir bulan</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Konsumsi Energi (kWh)
            </h3>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              {['24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as "24h"|"7d"|"30d")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    timeRange === range 
                      ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[250px] w-full relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl">
                <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value) => [`${value} kWh`, 'Konsumsi']}
                />
                <Line 
                  type="monotone" 
                  dataKey="kwh" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Beban Daya Aktif (kW)
            </h3>
          </div>
          <div className="h-[250px] w-full relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl">
                <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#f59e0b' }}
                  formatter={(value) => [`${value} kW`, 'Beban Daya']}
                />
                <Line 
                  type="monotone" 
                  dataKey="kw" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
