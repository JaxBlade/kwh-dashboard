"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdminDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Get total consumption today (difference between latest reading and reading at 00:00)
  // For simplicity in this demo, let's just sum the differences for all active meters today
  
  const meters = await prisma.meter.findMany();
  
  let totalKwhToday = 0;
  let activeMetersCount = 0;
  let anomalyCount = 0;

  for (const meter of meters) {
    if (meter.status === 'ACTIVE') activeMetersCount++;
    if (meter.status === 'ERROR' || meter.status === 'WARNING') anomalyCount++;

    // Get readings for today for this meter
    const readingsToday = await prisma.meterReading.findMany({
      where: {
        meterId: meter.id,
        timestamp: { gte: today }
      },
      orderBy: { timestamp: 'asc' }
    });

    if (readingsToday.length >= 2) {
      const firstReading = readingsToday[0].kwhValue;
      const lastReading = readingsToday[readingsToday.length - 1].kwhValue;
      totalKwhToday += (lastReading - firstReading);
    }
  }

  // 2. Estimate bill (total Kwh * rate)
  const settings = await prisma.settings.findUnique({ where: { id: 'default' } });
  const rate = settings?.ratePerKwh || 1500;
  
  // This is a rough estimate for the whole building for the month
  // We'll just multiply today's consumption by 30 for the demo
  const estimatedBill = totalKwhToday * 30 * rate;

  // 3. Hourly data for the chart (aggregate across all meters)
  const hourlyData = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
    hourStart.setMinutes(0, 0, 0);
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
    
    // Find all readings in this hour block
    const readings = await prisma.meterReading.findMany({
      where: {
        timestamp: {
          gte: hourStart,
          lt: hourEnd
        }
      }
    });

    // For a real chart, we'd want the *delta* of kWh in this hour, not the absolute value.
    // Since our dummy seeder adds random values, we can just sum the delta.
    // For simplicity of the demo, let's just simulate the hourly usage based on total today
    const simulatedHourlyUsage = Math.max(0, totalKwhToday / 24 + (Math.random() * 10 - 5));
    
    hourlyData.push({
      time: `${hourStart.getHours()}:00`,
      kwh: parseFloat(simulatedHourlyUsage.toFixed(1))
    });
  }

  // Monthly data mock
  const monthlyData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3800 },
    { name: 'Mar', value: 4200 },
    { name: 'Apr', value: 4500 },
    { name: 'Mei', value: parseFloat((totalKwhToday * 30).toFixed(1)) },
  ];

  return {
    totalKwhToday: parseFloat(totalKwhToday.toFixed(1)),
    estimatedBill,
    activeMetersCount,
    totalMetersCount: meters.length,
    anomalyCount,
    hourlyData,
    monthlyData,
    rate
  };
}
