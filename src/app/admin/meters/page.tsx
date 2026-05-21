import prisma from "@/lib/prisma";
import MetersClient from "./meters-client";

export const dynamic = 'force-dynamic';

export default async function MetersPage() {
  // Fetch all meters with their latest reading and assigned tenant
  const meters = await prisma.meter.findMany({
    include: {
      user: {
        select: {
          name: true,
        }
      },
      readings: {
        orderBy: {
          timestamp: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      floor: 'asc'
    }
  });

  // Map the data into a simpler format for the client
  const mappedMeters = meters.map(meter => ({
    id: meter.id,
    floor: meter.floor,
    tenant: meter.user?.name || null,
    status: meter.status,
    lastReading: meter.readings.length > 0 ? meter.readings[0].kwhValue : 0,
    lastUpdate: meter.readings.length > 0 ? meter.readings[0].timestamp.toLocaleString('id-ID') : 'Belum ada data',
  }));

  return <MetersClient initialMeters={mappedMeters} />;
}
