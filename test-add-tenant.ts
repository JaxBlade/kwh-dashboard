import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testAddTenant() {
  const name = "Test Tenant";
  const email = "test" + Date.now() + "@bms.com";
  const password = "password";
  const meterId = "M-101";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Email exists");
      return;
    }

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password, 
          role: "TENANT",
        },
      });

      await tx.meter.update({
        where: { id: meterId },
        data: { userId: newUser.id },
      });
      console.log("Tenant created successfully");
    });

  } catch (error: any) {
    console.error("Error adding tenant:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAddTenant();
