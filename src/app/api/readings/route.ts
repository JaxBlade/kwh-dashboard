import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Kunci rahasia untuk memvalidasi permintaan dari Node-RED
// Dalam produksi, simpan ini di dalam file .env
const API_SECRET_KEY = process.env.API_SECRET_KEY || "bms-nodered-secret-key-2026";

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Keamanan
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing Bearer Token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (token !== API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized: Invalid Token" }, { status: 403 });
    }

    // 2. Parse Body JSON dari Node-RED
    const body = await request.json();
    const { meterId, kwh, kw, power } = body;
    const activePower = kw !== undefined ? kw : (power !== undefined ? power : 0);

    if (!meterId || kwh === undefined) {
      return NextResponse.json({ error: "Bad Request: meterId dan kwh wajib diisi" }, { status: 400 });
    }

    // 3. Verifikasi apakah Meter ID tersebut ada di database
    const meter = await prisma.meter.findUnique({
      where: { id: meterId }
    });

    if (!meter) {
      return NextResponse.json({ error: `Not Found: Meter dengan ID ${meterId} tidak ditemukan` }, { status: 404 });
    }

    // 4. Simpan data ke database
    const reading = await prisma.meterReading.create({
      data: {
        meterId,
        kwhValue: parseFloat(kwh),
        kwValue: parseFloat(activePower),
      }
    });

    return NextResponse.json({ success: true, message: "Data berhasil disimpan", data: reading }, { status: 201 });

  } catch (error: any) {
    console.error("API /readings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
