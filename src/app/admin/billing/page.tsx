import prisma from "@/lib/prisma";
import BillingClient from "./billing-client";

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const mappedInvoices = invoices.map(inv => ({
    id: inv.id,
    no: `INV-${inv.year}${String(inv.month).padStart(2, '0')}-${inv.id.substring(0, 4).toUpperCase()}`,
    tenant: inv.user.name,
    period: `${inv.month}/${inv.year}`,
    usage: inv.totalKwh,
    amount: inv.totalAmount,
    status: inv.status,
    date: inv.createdAt.toLocaleDateString('id-ID'),
    // include details for PDF
    details: {
      rate: inv.rate,
      adminFee: inv.adminFee,
      startKwh: inv.startKwh,
      endKwh: inv.endKwh
    }
  }));

  return <BillingClient initialInvoices={mappedInvoices} />;
}
