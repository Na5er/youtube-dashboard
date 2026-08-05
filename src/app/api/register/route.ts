import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
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
    { id: user.id, username: user.username },
    { status: 201 }
  );
}
