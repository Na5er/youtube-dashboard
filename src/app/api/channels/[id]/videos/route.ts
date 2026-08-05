import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const videoSchema = z.object({
  title: z.string().min(1, "عنوان الفيديو مطلوب"),
  earnings: z.coerce.number().min(0),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const channel = await prisma.channel.findUnique({ where: { id } });
  if (!channel) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  if (channel.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const video = await prisma.video.create({
    data: { ...parsed.data, channelId: id },
  });

  return NextResponse.json(video, { status: 201 });
}
