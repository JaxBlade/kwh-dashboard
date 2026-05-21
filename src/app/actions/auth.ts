"use server";

import prisma from "@/lib/prisma";
import { login as setSession } from "@/lib/auth";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan Password wajib diisi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { error: "Email atau password salah." };
    }

    // Buat Session Token via JWT
    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }
}
