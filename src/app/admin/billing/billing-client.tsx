"use client";

import { useState } from "react";
import { Search, Filter, FileText, Download, CheckCircle2, Clock } from "lucide-react";
import { generateInvoices } from "./actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BillingClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const filteredInvoices = initialInvoices.filter(inv => 
    inv.no.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inv.tenant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleGenerate() {
    setLoading(true);
    setMessage("");
    const res = await generateInvoices();
    if (res?.error) {
      setMessage(`Gagal: ${res.error}`);
    } else if (res?.success) {
      if (res.count === 0) {
        setMessage("Semua tenant sudah memiliki tagihan untuk bulan ini.");
      } else {
        setMessage(`Berhasil membuat ${res.count} tagihan baru!`);
      }
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 5000);
  }

  function downloadPDF(invoice: any) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("INVOICE TAGIHAN LISTRIK", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`BMS 52 Floors Building`, 105, 28, { align: "center" });
    
    // Invoice Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`No Invoice: ${invoice.no}`, 14, 45);
    doc.text(`Tanggal: ${invoice.date}`, 14, 52);
    
    // Tenant Info
    doc.text(`Ditujukan kepada:`, 140, 45);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.tenant, 140, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`Periode Tagihan: ${invoice.period}`, 140, 59);

    // Table Data
    const tableData = [
      ["Meteran Awal", `${invoice.details.startKwh.toLocaleString('id-ID')} kWh`],
      ["Meteran Akhir", `${invoice.details.endKwh.toLocaleString('id-ID')} kWh`],
      ["Total Pemakaian", `${invoice.usage.toLocaleString('id-ID')} kWh`],
      ["Tarif Dasar", `Rp ${invoice.details.rate.toLocaleString('id-ID')} / kWh`],
      ["Biaya Pemakaian", `Rp ${(invoice.usage * invoice.details.rate).toLocaleString('id-ID')}`],
      ["Biaya Admin / Beban", `Rp ${invoice.details.adminFee.toLocaleString('id-ID')}`],
    ];

    autoTable(doc, {
      startY: 70,
      head: [['Deskripsi', 'Jumlah']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: { 1: { halign: 'right' } }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    
    // Total Amount
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL TAGIHAN: Rp ${invoice.amount.toLocaleString('id-ID')}`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Status: ${invoice.status === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}`, 14, finalY + 22);

    doc.setFont('helvetica', 'normal');
    doc.text("Harap melakukan pembayaran sebelum tanggal 10 bulan depan.", 105, 280, { align: "center" });

    doc.save(`${invoice.no}.pdf`);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tagihan & Invoice</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kelola dan cetak tagihan listrik bulanan untuk semua tenant.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 font-bold disabled:opacity-50 disabled:transform-none"
          >
            <FileText className="h-5 w-5" />
            {loading ? 'Memproses...' : 'Generate Tagihan Bulan Ini'}
          </button>
          {message && (
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 animate-in fade-in">{message}</p>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari No Invoice atau Nama Tenant..." 
            className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100 shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">No Invoice</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Perusahaan / Tenant</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Periode</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Total Pemakaian</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Total Tagihan</th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5 font-bold font-mono text-indigo-600 dark:text-indigo-400">{inv.no}</td>
                  <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">{inv.tenant}</td>
                  <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium">{inv.period}</td>
                  <td className="px-6 py-5 font-mono text-slate-700 dark:text-slate-300 font-semibold">{inv.usage.toLocaleString('id-ID')} kWh</td>
                  <td className="px-6 py-5 font-bold text-slate-900 dark:text-white">Rp {inv.amount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-5">
                    {inv.status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" /> Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => downloadPDF(inv)}
                      className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl flex items-center gap-2 transition-colors ml-auto"
                    >
                      <Download className="h-4 w-4" /> Unduh PDF
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-base">Tidak ada invoice ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
