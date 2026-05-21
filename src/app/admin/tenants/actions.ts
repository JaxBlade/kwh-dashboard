"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTenant(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const meterId = formData.get("meterId") as string;

  if (!name || !email || !password || !meterId) {
    return { error: "Semua field harus diisi." };
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah digunakan oleh tenant lain." };
    }

    // Create user and update meter in a transaction
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password, // In real app, we should hash this
          role: "TENANT",
        },
      });

      await tx.meter.update({
        where: { id: meterId },
        data: { userId: newUser.id },
      });
    });

    revalidatePath("/admin/tenants");
    revalidatePath("/admin/meters");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding tenant:", error);
    return { error: "Gagal menambahkan tenant. Silakan coba lagi." };
  }
}
