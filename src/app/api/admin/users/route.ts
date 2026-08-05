import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: { channels: true },
    orderBy: { createdAt: "asc" },
  });

  const data = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    channelsCount: u.channels.length,
    totalEarnings: u.channels.reduce((sum, c) => sum + c.totalEarnings, 0),
    totalVideos: u.channels.reduce((sum, c) => sum + c.regularVideosCount, 0),
    totalLiveStreams: u.channels.reduce((sum, c) => sum + c.liveStreamsCount, 0),
  }));

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const { name, username, email, password } = parsed.data;

  const duplicate = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "اسم المستخدم أو البريد الإلكتروني مستخدم من قبل" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, username, email, passwordHash, role: "USER" },
  });

  return NextResponse.json(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      channelsCount: 0,
      totalEarnings: 0,
      totalVideos: 0,
      totalLiveStreams: 0,
    },
    { status: 201 }
  );
}
