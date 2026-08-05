import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  link: z.url().optional(),
  liveStreamsCount: z.coerce.number().int().min(0).optional(),
  regularVideosCount: z.coerce.number().int().min(0).optional(),
  publishedAt: z.coerce.date().optional(),
  totalEarnings: z.coerce.number().min(0).optional(),
});

async function getChannelOrForbid(channelId: string, userId: string, role: string) {
  const channel = await prisma.channel.findUnique({ where: { id: channelId } });
  if (!channel) return { error: NextResponse.json({ error: "غير موجود" }, { status: 404 }) };
  if (channel.ownerId !== userId && role !== "ADMIN") {
    return { error: NextResponse.json({ error: "غير مصرح" }, { status: 403 }) };
  }
  return { channel };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const { error } = await getChannelOrForbid(id, session.user.id, session.user.role);
  if (error) return error;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const updated = await prisma.channel.update({
    where: { id },
    data: parsed.data,
    include: { videos: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const { error } = await getChannelOrForbid(id, session.user.id, session.user.role);
  if (error) return error;

  await prisma.channel.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
