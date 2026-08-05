import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  earnings: z.coerce.number().min(0).optional(),
});

async function getVideoOrForbid(videoId: string, userId: string, role: string) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { channel: true },
  });
  if (!video) return { error: NextResponse.json({ error: "غير موجود" }, { status: 404 }) };
  if (video.channel.ownerId !== userId && role !== "ADMIN") {
    return { error: NextResponse.json({ error: "غير مصرح" }, { status: 403 }) };
  }
  return { video };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const { error } = await getVideoOrForbid(id, session.user.id, session.user.role);
  if (error) return error;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const updated = await prisma.video.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const { error } = await getVideoOrForbid(id, session.user.id, session.user.role);
  if (error) return error;

  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
