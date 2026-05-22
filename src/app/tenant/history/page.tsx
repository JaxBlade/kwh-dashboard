import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import HistoryClient from "./history-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TenantHistoryPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/");
  }

  // Fetch all invoices for this tenant
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: session.user.id,
      // Optional: If you only want to show PAID invoices
      // status: 'PAID'
    },
    include: {
      user: true
    },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' }
    ]
  });

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const mappedInvoices = invoices.map(inv => ({
    id: inv.id,
    no: `INV-${inv.year.toString().slice(-2)}${inv.month.toString().padStart(2, '0')}-${inv.id.slice(0, 4).toUpperCase()}`,
    period: `${monthNames[inv.month - 1]} ${inv.year}`,
    date: inv.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    totalKwh: inv.totalKwh,
    amount: inv.totalAmount,
    status: inv.status,
    tenant: inv.user.name,
    details: {
      startKwh: inv.startKwh,
      endKwh: inv.endKwh,
      rate: inv.rate,
      adminFee: inv.adminFee
    }
  }));

  return <HistoryClient initialInvoices={mappedInvoices} />;
}
