import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      channels: {
        include: {
          videos: true,
          notes: { include: { author: { select: { id: true, name: true, username: true } } }, orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      },
      notes: { include: { author: { select: { id: true, name: true, username: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    channels: user.channels,
    notes: user.notes,
  });
}
