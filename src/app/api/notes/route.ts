import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const noteSchema = z.object({
  content: z.string().min(1, "محتوى الملاحظة مطلوب"),
  targetUserId: z.string().optional(),
  channelId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: { ...parsed.data, authorId: session.user.id },
    include: { author: { select: { id: true, name: true, username: true } } },
  });

  return NextResponse.json(note, { status: 201 });
}
