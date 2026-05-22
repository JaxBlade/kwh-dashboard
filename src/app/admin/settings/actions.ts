"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  try {
    const ratePerKwh = parseFloat(formData.get("ratePerKwh") as string);
    const adminFee = parseFloat(formData.get("adminFee") as string);

    if (isNaN(ratePerKwh) || isNaN(adminFee)) {
      return { error: "Nilai tarif harus berupa angka yang valid." };
    }

    await prisma.settings.upsert({
      where: { id: "default" },
      update: {
        ratePerKwh,
        adminFee
      },
      create: {
        id: "default",
        ratePerKwh,
        adminFee
      }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/billing");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { error: "Terjadi kesalahan saat menyimpan pengaturan." };
  }
}

export async function addAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Semua field harus diisi." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email sudah terdaftar di sistem." };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "ADMIN",
      },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to add admin:", error);
    return { error: "Gagal menambahkan admin baru." };
  }
}
