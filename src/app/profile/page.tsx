"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle2, KeyRound, Settings, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [loadedUserId, setLoadedUserId] = useState<string | undefined>(undefined);
  if (session?.user && session.user.id !== loadedUserId) {
    setLoadedUserId(session.user.id);
    setName(session.user.name ?? "");
    setUsername(session.user.username ?? "");
    setEmail(session.user.email ?? "");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        username,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "حدث خطأ ما");
      return;
    }

    await update({ name: data.name, username: data.username, email: data.email });
    setCurrentPassword("");
    setNewPassword("");
    setSuccess(true);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white">
          <Settings className="size-6" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold">إعدادات الملف الشخصي</h1>
          <p className="text-sm text-foreground/60">تحديث اسمك، بريدك الإلكتروني، وكلمة مرورك</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground/70">
            <UserCircle className="size-4" />
            المعلومات الشخصية
          </div>

          <div>
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="border-t border-black/5 pt-5 dark:border-white/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground/70">
              <KeyRound className="size-4" />
              تغيير كلمة المرور (اختياري)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">
              <CheckCircle2 className="size-4" />
              تم حفظ التغييرات بنجاح
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" loading={loading}>
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
