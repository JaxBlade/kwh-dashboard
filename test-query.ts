import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
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

    console.log("Tenants fetched successfully:", tenants.length);

    const availableMeters = await prisma.meter.findMany({
      where: {
        userId: null
      },
      orderBy: {
        floor: 'asc'
      }
    });

    console.log("Available meters fetched successfully:", availableMeters.length);

    const mappedTenants = tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      password: tenant.password,
      metersCount: tenant.meters.length,
      assignedMeters: tenant.meters.map(m => m.id).join(", "),
      status: "AKTIF",
      joinDate: tenant.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }));

    console.log("Mapping successful");
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
