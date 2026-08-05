import { AdminOverview } from "@/components/admin/admin-overview";
import { prisma } from "@/lib/prisma";
import { UserSummaryDTO } from "@/types/models";

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: { channels: true },
    orderBy: { createdAt: "asc" },
  });

  const data: UserSummaryDTO[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    channelsCount: u.channels.length,
    totalEarnings: u.channels.reduce((sum, c) => sum + c.totalEarnings, 0),
    totalVideos: u.channels.reduce((sum, c) => sum + c.regularVideosCount, 0),
    totalLiveStreams: u.channels.reduce((sum, c) => sum + c.liveStreamsCount, 0),
  }));

  return <AdminOverview users={data} />;
}
