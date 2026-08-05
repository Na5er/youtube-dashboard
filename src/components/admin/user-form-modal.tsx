"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UserSummaryDTO } from "@/types/models";
import { FormEvent, useState } from "react";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (user: UserSummaryDTO) => void;
}

export function UserFormModal({ open, onClose, onCreated }: UserFormModalProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/users", {
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

    onCreated(data);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="إضافة صانع محتوى جديد"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="user-name">الاسم الكامل</Label>
          <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="user-username">اسم المستخدم</Label>
          <Input
            id="user-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="user-email">البريد الإلكتروني</Label>
          <Input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="user-password">كلمة المرور</Label>
          <Input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" loading={loading}>
            إضافة المستخدم
          </Button>
        </div>
      </form>
    </Modal>
  );
}
