import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create Settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      ratePerKwh: 1500,
      adminFee: 50000,
    },
  })

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gedung.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@gedung.com',
      password: 'password', // In real app, this should be hashed
      role: 'ADMIN',
    },
  })

  // Create Tenants
  const tenant1 = await prisma.user.upsert({
    where: { email: 'tenant1@gmail.com' },
    update: {},
    create: {
      name: 'PT Maju Bersama (Lt 10)',
      email: 'tenant1@gmail.com',
      password: 'password',
      role: 'TENANT',
    },
  })

  const tenant2 = await prisma.user.upsert({
    where: { email: 'tenant2@gmail.com' },
    update: {},
    create: {
      name: 'CV Sentosa Abadi (Lt 15)',
      email: 'tenant2@gmail.com',
      password: 'password',
      role: 'TENANT',
    },
  })

  // Create Meters (Generate 52 meters for 52 floors)
  for (let i = 1; i <= 52; i++) {
    let userId = null;
    if (i === 10) userId = tenant1.id;
    if (i === 15) userId = tenant2.id;

    await prisma.meter.upsert({
      where: { id: `M-${i.toString().padStart(3, '0')}` },
      update: {},
      create: {
        id: `M-${i.toString().padStart(3, '0')}`,
        name: `Meter Lantai ${i}`,
        floor: i,
        userId: userId,
      },
    })
  }

  // Create some dummy readings for the past 24 hours for M-010 and M-015
  const meters = [`M-010`, `M-015`]
  const now = new Date()
  
  for (const meterId of meters) {
    let currentKwh = 1000.0 // Start reading
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      currentKwh += Math.random() * 5 // Add 0 to 5 kWh per hour
      
      await prisma.meterReading.create({
        data: {
          meterId: meterId,
          timestamp: timestamp,
          kwhValue: currentKwh,
        }
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
