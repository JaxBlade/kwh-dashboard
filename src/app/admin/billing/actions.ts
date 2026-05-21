"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function generateInvoices() {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // 1. Get Settings
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    const ratePerKwh = settings?.ratePerKwh || 1500;
    const adminFee = settings?.adminFee || 50000;

    // 2. Get all Tenants with their assigned meters and readings
    const tenants = await prisma.user.findMany({
      where: { role: 'TENANT' },
      include: {
        meters: {
          include: {
            readings: {
              orderBy: { timestamp: 'desc' },
              take: 2 // Taking a simulated start and end for calculation purposes
            }
          }
        }
      }
    });

    // 3. Generate invoices for each tenant if they don't have one for this month
    let generatedCount = 0;

    for (const tenant of tenants) {
      // Check if invoice already exists
      const existing = await prisma.invoice.findFirst({
        where: { userId: tenant.id, month: currentMonth, year: currentYear }
      });

      if (existing) continue; // Skip if already generated

      // Calculate kWh from all meters assigned to this tenant
      let totalStartKwh = 0;
      let totalEndKwh = 0;

      tenant.meters.forEach(meter => {
        if (meter.readings.length > 0) {
          // In a real scenario, we find the reading at the 1st of the month, and the reading today.
          // For simulation, we use the latest reading as endKwh, and slightly less as startKwh
          const latestReading = meter.readings[0].kwhValue;
          const prevReading = meter.readings.length > 1 ? meter.readings[1].kwhValue : Math.max(0, latestReading - 500);
          
          totalStartKwh += prevReading;
          totalEndKwh += latestReading;
        }
      });

      const totalKwh = Math.max(0, totalEndKwh - totalStartKwh);
      // Fallback dummy usage if no meters/readings
      const finalTotalKwh = totalKwh > 0 ? totalKwh : Math.floor(Math.random() * 800) + 200;

      const kwhCost = finalTotalKwh * ratePerKwh;
      const totalAmount = kwhCost + adminFee;

      await prisma.invoice.create({
        data: {
          userId: tenant.id,
          month: currentMonth,
          year: currentYear,
          startKwh: totalStartKwh,
          endKwh: totalEndKwh > 0 ? totalEndKwh : finalTotalKwh,
          totalKwh: finalTotalKwh,
          rate: ratePerKwh,
          adminFee: adminFee,
          totalAmount: totalAmount,
          status: "UNPAID"
        }
      });

      generatedCount++;
    }

    revalidatePath("/admin/billing");
    return { success: true, count: generatedCount };

  } catch (error) {
    console.error("Failed to generate invoices:", error);
    return { error: "Terjadi kesalahan saat membuat tagihan." };
  }
}
