"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle2, AlertCircle, X, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

type MeterType = {
  id: string;
  floor: number;
  tenant: string | null;
  status: string;
  lastReading: number;
  lastUpdate: string;
};

export default function MetersClient({ initialMeters }: { initialMeters: MeterType[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "WARNING" | "UNASSIGNED">("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and search logic
  const filteredMeters = initialMeters.filter((meter) => {
    // 1. Search Query (ID or Floor or Tenant)
    const matchesSearch = 
      meter.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meter.floor.toString().includes(searchQuery) ||
      (meter.tenant && meter.tenant.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Status Filter
    let matchesFilter = true;
    if (filterStatus === "ACTIVE") matchesFilter = meter.status === "ACTIVE";
    if (filterStatus === "WARNING") matchesFilter = meter.status !== "ACTIVE";
    if (filterStatus === "UNASSIGNED") matchesFilter = meter.tenant === null;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Monitoring Meteran</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Pantau status fisik dari 52 meteran Modbus (Schneider) di gedung ini.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 relative">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID Meter, Lantai, atau Tenant..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 shadow-sm"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 font-semibold shadow-sm"
          >
            <Filter className="h-4 w-4" />
            Filter: {filterStatus === "ALL" ? "Semua" : filterStatus === "ACTIVE" ? "Online" : filterStatus === "WARNING" ? "Anomali" : "Kosong"}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <button onClick={() => { setFilterStatus("ALL"); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${filterStatus === "ALL" ? "font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10" : "text-slate-700 dark:text-slate-300"}`}>Semua Status</button>
              <button onClick={() => { setFilterStatus("ACTIVE"); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${filterStatus === "ACTIVE" ? "font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10" : "text-slate-700 dark:text-slate-300"}`}>Hanya Online</button>
              <button onClick={() => { setFilterStatus("WARNING"); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${filterStatus === "WARNING" ? "font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10" : "text-slate-700 dark:text-slate-300"}`}>Hanya Anomali</button>
              <button onClick={() => { setFilterStatus("UNASSIGNED"); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${filterStatus === "UNASSIGNED" ? "font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10" : "text-slate-700 dark:text-slate-300"}`}>Belum Ada Tenant</button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Filters Chips */}
      {(searchQuery || filterStatus !== "ALL") && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500 font-medium mr-2">Filter aktif:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              Pencarian: "{searchQuery}"
              <button onClick={() => setSearchQuery("")}><X className="h-3 w-3 hover:text-indigo-900 dark:hover:text-white" /></button>
            </span>
          )}
          {filterStatus !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Status: {filterStatus}
              <button onClick={() => setFilterStatus("ALL")}><X className="h-3 w-3 hover:text-slate-900 dark:hover:text-white" /></button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">ID Meter</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Lantai</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Tenant Assigned</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status Modbus</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Total kWh Terakhir</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Update Terakhir</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMeters.length > 0 ? (
                filteredMeters.map((meter) => (
                  <tr key={meter.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      <Link href={`/admin/meters/${meter.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {meter.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Lantai {meter.floor}</td>
                    <td className="px-6 py-4">
                      {meter.tenant ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                          {meter.tenant}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Kosong</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {meter.status === 'ACTIVE' ? (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          <span>Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600 dark:text-amber-400 font-semibold">
                          <AlertCircle className="h-4 w-4 mr-1.5" />
                          <span>Anomali</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {meter.lastReading.toLocaleString('id-ID')} kWh
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium text-xs">
                      {meter.lastUpdate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/meters/${meter.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-500 transition-all shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Lihat Detail Grafik"
                      >
                        <Activity className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-base">Tidak ada meteran yang cocok</p>
                    <p className="text-sm mt-1">Coba ubah kata kunci atau filter pencarian Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Menampilkan {filteredMeters.length} meteran</p>
        </div>
      </div>
    </div>
  );
}
