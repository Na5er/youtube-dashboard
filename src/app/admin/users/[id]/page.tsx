import { ChannelsView } from "@/components/channels/channels-view";
import { UserNotes } from "@/components/admin/user-notes";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ChannelDTO, NoteDTO } from "@/types/models";
import { ArrowRight, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      channels: {
        include: { videos: true, notes: { include: { author: { select: { id: true, name: true, username: true } } } } },
        orderBy: { createdAt: "desc" },
      },
      notes: { include: { author: { select: { id: true, name: true, username: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user || user.role !== "USER") notFound();

  const channels = JSON.parse(JSON.stringify(user.channels)) as ChannelDTO[];
  const notes = JSON.parse(JSON.stringify(user.notes)) as NoteDTO[];

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-rose-500"
      >
        <ArrowRight className="size-4" />
        رجوع إلى لوحة التحكم
      </Link>

      <Card className="flex flex-wrap items-center gap-4 p-5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white">
          <UserIcon className="size-7" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold">{user.name}</h1>
          <p className="text-sm text-foreground/50">@{user.username}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/50">
            <Mail className="size-3.5" />
            {user.email}
          </p>
        </div>
      </Card>

      <UserNotes userId={user.id} initialNotes={notes} />

      <ChannelsView
        initialChannels={channels}
        ownerId={user.id}
        canManageNotes
        title={`قنوات ${user.name}`}
      />
    </div>
  );
}
