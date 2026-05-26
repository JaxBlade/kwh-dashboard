"use server";

import prisma from "@/lib/prisma";

export async function getChartData(meterIds: string[], range: "24h" | "7d" | "30d") {
  if (!meterIds || meterIds.length === 0) {
    return Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      kwh: 0,
    }));
  }

  const now = new Date();
  let gteDate = new Date();

  if (range === "24h") {
    gteDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (range === "7d") {
    gteDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === "30d") {
    gteDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const readings = await prisma.meterReading.findMany({
    where: {
      meterId: { in: meterIds },
      timestamp: { gte: gteDate }
    },
    orderBy: { timestamp: 'asc' }
  });

  if (readings.length === 0) {
    // Fallback dummy
    return Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      kwh: 0,
    }));
  }

  // Jika datanya sangat banyak (misal: ribuan baris karena update tiap menit)
  // Kita melakukan downsampling menjadi maksimal 30 titik data (agar web tidak berat)
  const MAX_POINTS = 30;
  const downsampledReadings = [];
  
  const step = Math.max(1, Math.floor(readings.length / MAX_POINTS));
  
  for (let i = 0; i < readings.length; i += step) {
    downsampledReadings.push(readings[i]);
  }
  // Pastikan data terakhir juga selalu masuk agar data paling aktual ter-render
  if (downsampledReadings[downsampledReadings.length - 1] !== readings[readings.length - 1]) {
    downsampledReadings.push(readings[readings.length - 1]);
  }

  // Format data
  const chartData = downsampledReadings.map(r => {
    let timeLabel = "";
    
    if (range === "24h") {
      // 14:30
      timeLabel = r.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (range === "7d") {
      // 12 Mei 14:30
      const date = r.timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const time = r.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      timeLabel = `${date} ${time}`;
    } else {
      // 12 Mei
      timeLabel = r.timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }

    return {
      time: timeLabel,
      kwh: r.kwhValue
    };
  });

  return chartData;
}
