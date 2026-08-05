import { ChannelsView } from "@/components/channels/channels-view";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChannelDTO } from "@/types/models";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const channels = await prisma.channel.findMany({
    where: { ownerId: session!.user.id },
    include: { videos: true, notes: { include: { author: { select: { id: true, name: true, username: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return <ChannelsView initialChannels={JSON.parse(JSON.stringify(channels)) as ChannelDTO[]} />;
}
