import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TenantClient from "./tenant-client";
import { redirect } from "next/navigation";
import { getChartData } from "@/app/actions/chart";

export const dynamic = 'force-dynamic';

export default async function TenantOverview() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/");
  }

  // Get User Name
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { meters: true }
  });

  if (!user) redirect("/");

  // Get current settings for rate calculation
  const settings = await prisma.settings.findUnique({
    where: { id: "default" }
  });
  const ratePerKwh = settings?.ratePerKwh || 1500;
  const adminFee = settings?.adminFee || 50000;

  // Calculate current month's usage
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const meterIds = user.meters.map(m => m.id);

  let currentMonthUsage = 0;
  let lastMonthUsage = 0; // For comparison
  let chartData: any[] = [];

  if (meterIds.length > 0) {
    // Current month readings
    const currentReadings = await prisma.meterReading.findMany({
      where: {
        meterId: { in: meterIds },
        timestamp: { gte: startOfMonth }
      },
      orderBy: { timestamp: 'asc' }
    });

    if (currentReadings.length > 0) {
      // Group by meter to find max-min
      const meterGroups: Record<string, number[]> = {};
      currentReadings.forEach(r => {
        if (!meterGroups[r.meterId]) meterGroups[r.meterId] = [];
        meterGroups[r.meterId].push(r.kwhValue);
      });

      for (const mId in meterGroups) {
        const vals = meterGroups[mId];
        const max = Math.max(...vals);
        const min = Math.min(...vals);
        currentMonthUsage += (max - min);
      }
    }

    // Prepare initial 24h chart data using Server Action
    chartData = await getChartData(meterIds, "24h");
  } else {
    // Dummy chart if no meters assigned
    chartData = Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      kwh: 0,
    }));
  }

  const estimatedBill = (currentMonthUsage * ratePerKwh) + adminFee;

  const summary = {
    name: user.name,
    currentUsage: parseFloat(currentMonthUsage.toFixed(2)),
    estimatedBill,
    adminFee,
    nextDueDate: `10 ${nextMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
    chartData,
    meterIds
  };

  return <TenantClient summary={summary} />;
}
