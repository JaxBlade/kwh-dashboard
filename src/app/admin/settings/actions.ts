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
