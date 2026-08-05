"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock, Mail, Tv, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "حدث خطأ ما");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-rose-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-pink-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-600/30">
              <Tv className="size-7" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold">إنشاء حساب جديد</h1>
              <p className="mt-1 text-sm text-foreground/60">
                انضم إلى شبكة يوتيوب وابدأ بإدارة قنواتك
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="pr-9"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="pr-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pr-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-9"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              إنشاء الحساب
            </Button>

            <p className="text-center text-sm text-foreground/60">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="font-semibold text-rose-500 hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
