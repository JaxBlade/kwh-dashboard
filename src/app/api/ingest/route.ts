import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In a real scenario, this endpoint should be protected with an API Key or Token
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Expected format from Modbus Gateway:
    // { "meter_id": "M-010", "kwh_total": 1250.5 }
    
    if (!data.meter_id || typeof data.kwh_total !== 'number') {
      return NextResponse.json(
        { error: 'Invalid payload. Required: meter_id (string), kwh_total (number)' },
        { status: 400 }
      );
    }

    // Check if meter exists
    const meter = await prisma.meter.findUnique({
      where: { id: data.meter_id }
    });

    if (!meter) {
      return NextResponse.json({ error: `Meter ${data.meter_id} not found` }, { status: 404 });
    }

    // Save the reading
    const reading = await prisma.meterReading.create({
      data: {
        meterId: data.meter_id,
        kwhValue: data.kwh_total,
      }
    });

    // We could also update the meter's status to 'ACTIVE' if it was offline
    await prisma.meter.update({
      where: { id: data.meter_id },
      data: { status: 'ACTIVE' }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Reading recorded successfully',
      data: reading
    });

  } catch (error) {
    console.error('Error processing ingest data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
