import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const channelSchema = z.object({
  name: z.string().min(1, "اسم القناة مطلوب"),
  link: z.url("رابط غير صالح"),
  liveStreamsCount: z.coerce.number().int().min(0),
  regularVideosCount: z.coerce.number().int().min(0),
  publishedAt: z.coerce.date(),
  totalEarnings: z.coerce.number().min(0),
  ownerId: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const channels = await prisma.channel.findMany({
    where: { ownerId: session.user.id },
    include: { videos: true, notes: { include: { author: { select: { id: true, name: true, username: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(channels);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = channelSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const { ownerId: requestedOwnerId, ...rest } = parsed.data;
  const ownerId =
    requestedOwnerId && session.user.role === "ADMIN" ? requestedOwnerId : session.user.id;

  const channel = await prisma.channel.create({
    data: { ...rest, ownerId },
    include: { videos: true },
  });

  return NextResponse.json(channel, { status: 201 });
}
