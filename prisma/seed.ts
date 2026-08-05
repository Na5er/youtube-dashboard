import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Yt@2026Pass";

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      name: "مدير الشبكة",
      email: "admin@network.local",
      passwordHash,
      role: "ADMIN",
    },
  });

  const usersData = [
    { username: "user1", name: "صانع المحتوى الأول" },
    { username: "user2", name: "صانع المحتوى الثاني" },
    { username: "user3", name: "صانع المحتوى الثالث" },
  ];

  const sampleChannels = [
    {
      name: "قناة الألعاب اليومية",
      link: "https://youtube.com/@daily-gaming",
      liveStreamsCount: 12,
      regularVideosCount: 48,
      publishedAt: new Date("2024-01-15"),
      totalEarnings: 1450.75,
      videos: [
        { title: "بث مباشر - تحدي الأسبوع", earnings: 220.5 },
        { title: "أفضل لحظات الشهر", earnings: 130.25 },
      ],
    },
    {
      name: "قناة الطبخ السريع",
      link: "https://youtube.com/@quick-cooking",
      liveStreamsCount: 4,
      regularVideosCount: 76,
      publishedAt: new Date("2023-11-02"),
      totalEarnings: 980.4,
      videos: [
        { title: "وصفة الكنافة بالقشطة", earnings: 95.1 },
        { title: "أسرع 5 وصفات للعشاء", earnings: 140.0 },
      ],
    },
  ];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        name: u.name,
        email: `${u.username}@network.local`,
        passwordHash,
        role: "USER",
      },
    });

    const existingChannels = await prisma.channel.count({
      where: { ownerId: user.id },
    });

    if (existingChannels === 0) {
      for (const ch of sampleChannels) {
        await prisma.channel.create({
          data: {
            name: ch.name,
            link: ch.link,
            liveStreamsCount: ch.liveStreamsCount,
            regularVideosCount: ch.regularVideosCount,
            publishedAt: ch.publishedAt,
            totalEarnings: ch.totalEarnings,
            ownerId: user.id,
            videos: {
              create: ch.videos,
            },
          },
        });
      }
    }
  }

  console.log("تمت تهيئة قاعدة البيانات بنجاح ✅");
  console.log(`Admin: admin / ${DEFAULT_PASSWORD}`);
  console.log(`Users: user1, user2, user3 / ${DEFAULT_PASSWORD}`);
  console.log(`Admin id: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
