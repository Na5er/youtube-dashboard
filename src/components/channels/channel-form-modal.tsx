"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ChannelDTO } from "@/types/models";
import { FormEvent, useState } from "react";

interface ChannelFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (channel: ChannelDTO) => void;
  channel?: ChannelDTO | null;
  ownerId?: string;
}

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

export function ChannelFormModal({ open, onClose, onSaved, channel, ownerId }: ChannelFormModalProps) {
  const isEdit = Boolean(channel);
  const [name, setName] = useState(channel?.name ?? "");
  const [link, setLink] = useState(channel?.link ?? "");
  const [liveStreamsCount, setLiveStreamsCount] = useState(channel?.liveStreamsCount ?? 0);
  const [regularVideosCount, setRegularVideosCount] = useState(channel?.regularVideosCount ?? 0);
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(channel?.publishedAt));
  const [totalEarnings, setTotalEarnings] = useState(channel?.totalEarnings ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setName(channel?.name ?? "");
    setLink(channel?.link ?? "");
    setLiveStreamsCount(channel?.liveStreamsCount ?? 0);
    setRegularVideosCount(channel?.regularVideosCount ?? 0);
    setPublishedAt(toDateInputValue(channel?.publishedAt));
    setTotalEarnings(channel?.totalEarnings ?? 0);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      link,
      liveStreamsCount,
      regularVideosCount,
      publishedAt,
      totalEarnings,
      ...(ownerId ? { ownerId } : {}),
    };

    const res = await fetch(isEdit ? `/api/channels/${channel!.id}` : "/api/channels", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "حدث خطأ ما");
      return;
    }

    onSaved(data);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={isEdit ? "تعديل القناة" : "إضافة قناة جديدة"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">اسم القناة</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="link">رابط القناة</Label>
          <Input
            id="link"
            type="url"
            placeholder="https://youtube.com/@channel"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="live">عدد البثوث المباشرة</Label>
            <Input
              id="live"
              type="number"
              min={0}
              value={liveStreamsCount}
              onChange={(e) => setLiveStreamsCount(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="regular">الفيديوهات العادية</Label>
            <Input
              id="regular"
              type="number"
              min={0}
              value={regularVideosCount}
              onChange={(e) => setRegularVideosCount(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="published">تاريخ النشر</Label>
            <Input
              id="published"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="earnings">الأرباح الإجمالية ($)</Label>
            <Input
              id="earnings"
              type="number"
              min={0}
              step="0.01"
              value={totalEarnings}
              onChange={(e) => setTotalEarnings(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "حفظ التعديلات" : "إضافة القناة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
