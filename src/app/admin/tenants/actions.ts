"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTenant(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const meterId = formData.get('meterId') as string;

  if (!name || !email || !meterId) {
    return { error: "Semua field harus diisi." };
  }

  try {
    // Generate token for activation
    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah digunakan oleh tenant lain." };
    }

    // 1. Create User
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: "", // Empty password, tenant will set it
        role: "TENANT",
        isEmailVerified: false,
        verificationToken: token,
      }
    });

    // 2. Assign Meter to User
    await prisma.meter.update({
      where: { id: meterId },
      data: { userId: newUser.id }
    });

    // 3. Send Activation Email
    const { sendActivationEmail } = await import("@/lib/email");
    await sendActivationEmail(newUser.email, token);

    revalidatePath('/admin/tenants');
    revalidatePath('/admin/meters');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add tenant:", error);
    if (error.code === 'P2002') {
      return { error: "Email sudah digunakan." };
    }
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function editTenant(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const meterId = formData.get('meterId') as string;

  if (!id || !name || !email) {
    return { error: "ID, Nama, dan Email harus diisi." };
  }

  try {
    // Cari user
    const user = await prisma.user.findUnique({ where: { id }, include: { meters: true } });
    if (!user) return { error: "Tenant tidak ditemukan." };

    // Update profil dasar
    await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    // Update meter (opsional jika meterId diganti)
    if (meterId) {
      // Bebaskan semua meteran milik user ini dulu (asumsi 1 tenant 1 meter untuk skenario ini)
      await prisma.meter.updateMany({
        where: { userId: id },
        data: { userId: null }
      });
      // Assign meteran baru
      await prisma.meter.update({
        where: { id: meterId },
        data: { userId: id }
      });
    }

    revalidatePath('/admin/tenants');
    revalidatePath('/admin/meters');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to edit tenant:", error);
    if (error.code === 'P2002') return { error: "Email sudah digunakan." };
    return { error: "Terjadi kesalahan pada server." };
  }
}

export async function deleteTenant(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return { error: "ID tidak valid." };

  try {
    // Putuskan hubungan meteran terlebih dahulu (set userId null)
    await prisma.meter.updateMany({
      where: { userId: id },
      data: { userId: null }
    });
    
    // Hapus user
    await prisma.user.delete({
      where: { id }
    });

    revalidatePath('/admin/tenants');
    revalidatePath('/admin/meters');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete tenant:", error);
    return { error: "Terjadi kesalahan saat menghapus tenant." };
  }
}
