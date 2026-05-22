import prisma from "@/lib/prisma";
import SettingsClient from "./settings-client";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: "default" }
  });

  const ratePerKwh = settings?.ratePerKwh || 1500.0;
  const adminFee = settings?.adminFee || 50000.0;

  // Fetch all admin users
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  });

  const mappedAdmins = admins.map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    joinDate: a.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  }));

  return <SettingsClient initialRate={ratePerKwh} initialFee={adminFee} admins={mappedAdmins} />;
}
