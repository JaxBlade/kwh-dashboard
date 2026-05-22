"use client";

import { useState } from "react";
import { Download, CheckCircle2, Clock, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function HistoryClient({ initialInvoices }: { initialInvoices: any[] }) {
  function downloadPDF(invoice: any) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald 500 for tenant
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
      ["Total Pemakaian", `${invoice.totalKwh.toLocaleString('id-ID')} kWh`],
      ["Tarif Dasar", `Rp ${invoice.details.rate.toLocaleString('id-ID')} / kWh`],
      ["Biaya Pemakaian", `Rp ${(invoice.totalKwh * invoice.details.rate).toLocaleString('id-ID')}`],
      ["Biaya Admin / Beban", `Rp ${invoice.details.adminFee.toLocaleString('id-ID')}`],
    ];

    autoTable(doc, {
      startY: 70,
      head: [['Deskripsi', 'Jumlah']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Emerald header
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Riwayat Tagihan</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Daftar tagihan bulanan unit Anda.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
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
              {initialInvoices.length > 0 ? initialInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">{inv.period}</td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{inv.date}</td>
                  <td className="px-6 py-4 font-mono font-medium text-neutral-600 dark:text-neutral-400">{inv.totalKwh.toLocaleString('id-ID')} kWh</td>
                  <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    {inv.status === 'PAID' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => downloadPDF(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Unduh
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
                    <p className="font-semibold text-base">Belum ada tagihan.</p>
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
