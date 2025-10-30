import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      name: "Jane Smith",
    },
  });

  console.log("✅ Created users:", { user1, user2 });

  // Create meetings
  const meeting1 = await prisma.meeting.create({
    data: {
      title: "Team Standup",
      description: "Daily team sync meeting",
      startTime: new Date("2025-11-01T09:00:00Z"),
      endTime: new Date("2025-11-01T09:30:00Z"),
      location: "Conference Room A",
      userId: user1.id,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      title: "Client Presentation",
      description: "Q4 results presentation",
      startTime: new Date("2025-11-02T14:00:00Z"),
      endTime: new Date("2025-11-02T15:30:00Z"),
      location: "Virtual - Zoom",
      userId: user2.id,
    },
  });

  console.log("✅ Created meetings:", { meeting1, meeting2 });
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
