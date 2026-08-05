import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    email: z.email("بريد إلكتروني غير صالح"),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل").optional(),
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: "يجب إدخال كلمة المرور الحالية لتعيين كلمة مرور جديدة",
    path: ["currentPassword"],
  });

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" },
      { status: 400 }
    );
  }

  const { name, username, email, currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  const duplicate = await prisma.user.findFirst({
    where: {
      id: { not: user.id },
      OR: [{ username }, { email }],
    },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "اسم المستخدم أو البريد الإلكتروني مستخدم من قبل" },
      { status: 409 }
    );
  }

  let passwordHash = user.passwordHash;
  if (newPassword) {
    const isValid = await bcrypt.compare(currentPassword!, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 });
    }
    passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, username, email, passwordHash },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    username: updated.username,
    email: updated.email,
  });
}
