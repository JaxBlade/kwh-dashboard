import prisma from "@/lib/prisma";
import TenantsClient from "./tenants-client";

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  // Fetch all tenants
  const tenants = await prisma.user.findMany({
    where: {
      role: 'TENANT'
    },
    include: {
      meters: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch available meters (not assigned to any tenant yet)
  const availableMeters = await prisma.meter.findMany({
    where: {
      userId: null
    },
    orderBy: {
      floor: 'asc'
    }
  });

  // Map the tenants data for the client
  const mappedTenants = tenants.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    email: tenant.email,
    password: tenant.password, // Only for demo purposes to show in connection guide
    metersCount: tenant.meters.length,
    assignedMeters: tenant.meters.map(m => m.id).join(", "),
    status: "AKTIF",
    joinDate: tenant.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }));

  const mappedAvailableMeters = availableMeters.map(m => ({
    id: m.id,
    floor: m.floor
  }));

  return <TenantsClient initialTenants={mappedTenants} availableMeters={mappedAvailableMeters} />;
}
