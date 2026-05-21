import prisma from "@/lib/prisma";
import SettingsClient from "./settings-client";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: "default" }
  });

  const ratePerKwh = settings?.ratePerKwh || 1500.0;
  const adminFee = settings?.adminFee || 50000.0;

  return <SettingsClient initialRate={ratePerKwh} initialFee={adminFee} />;
}
