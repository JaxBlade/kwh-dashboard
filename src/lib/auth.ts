import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Menggunakan secret key yang aman (dalam production sebaiknya simpan di .env)
const secretKey = "bms-super-secret-key-12345";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // Sesi berlaku 1 hari
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function login(user: { id: string; email: string; role: string; name: string }) {
  // 1. Buat token session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 Hari
  const session = await encrypt({ user, expires });

  // 2. Simpan token di Cookie HTTP-Only
  const cookieStore = await cookies();
  cookieStore.set("session", session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
