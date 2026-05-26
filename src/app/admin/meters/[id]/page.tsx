import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getChartData } from "@/app/actions/chart";
import MeterDetailClient from "./meter-detail-client";

export const dynamic = 'force-dynamic';

export default async function MeterDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Fetch meter details
  const meter = await prisma.meter.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!meter) {
    redirect("/admin/meters");
  }

  // 2. Fetch settings
  const settings = await prisma.settings.findUnique({
    where: { id: "default" }
  });
  const ratePerKwh = settings?.ratePerKwh || 1500;
  const adminFee = settings?.adminFee || 50000;

  // 3. Current month usage
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const currentMonthReadings = await prisma.meterReading.findMany({
    where: {
      meterId: id,
      timestamp: { gte: startOfMonth }
    },
    orderBy: { timestamp: 'asc' }
  });

  let currentUsage = 0;
  if (currentMonthReadings.length > 0) {
    const min = currentMonthReadings[0].kwhValue;
    const max = currentMonthReadings[currentMonthReadings.length - 1].kwhValue;
    currentUsage = max - min;
  }

  // 4. Fetch initial 24h chart data using Server Action
  const chartData = await getChartData([id], "24h");

  const estimatedCost = (currentUsage * ratePerKwh) + (meter.userId ? adminFee : 0);

  const summary = {
    id: meter.id,
    floor: meter.floor,
    status: meter.status,
    tenantName: meter.user?.name || null,
    currentUsage: parseFloat(currentUsage.toFixed(2)),
    estimatedCost,
    chartData,
  };

  return <MeterDetailClient summary={summary} />;
}
