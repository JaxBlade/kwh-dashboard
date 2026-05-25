"use server";

import prisma from "@/lib/prisma";

export async function activateAccount(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  
  if (!token || !password) {
    return { error: "Token dan password wajib diisi." };
  }

  if (password.length < 6) {
    return { error: "Kata sandi minimal 6 karakter." };
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) {
    return { error: "Link aktivasi tidak valid atau akun sudah diaktifkan." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: password, // In production, hash this password!
      isEmailVerified: true,
      verificationToken: null,
    },
  });

  return { success: true };
}
