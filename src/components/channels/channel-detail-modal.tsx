"use client";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { ChannelDTO, NoteDTO, VideoDTO } from "@/types/models";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface ChannelDetailModalProps {
  open: boolean;
  onClose: () => void;
  channel: ChannelDTO;
  onChannelChange: (channel: ChannelDTO) => void;
  canManageNotes?: boolean;
}

export function ChannelDetailModal({
  open,
  onClose,
  channel,
  onChannelChange,
  canManageNotes = false,
}: ChannelDetailModalProps) {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoEarnings, setVideoEarnings] = useState(0);
  const [addingVideo, setAddingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editEarnings, setEditEarnings] = useState(0);
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function handleAddVideo(e: FormEvent) {
    e.preventDefault();
    setAddingVideo(true);
    const res = await fetch(`/api/channels/${channel.id}/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: videoTitle, earnings: videoEarnings }),
    });
    const data = await res.json();
    setAddingVideo(false);
    if (res.ok) {
      onChannelChange({ ...channel, videos: [...channel.videos, data] });
      setVideoTitle("");
      setVideoEarnings(0);
    }
  }

  function startEditVideo(video: VideoDTO) {
    setEditingVideoId(video.id);
    setEditTitle(video.title);
    setEditEarnings(video.earnings);
  }

  async function saveEditVideo() {
    const res = await fetch(`/api/videos/${editingVideoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, earnings: editEarnings }),
    });
    const data = await res.json();
    if (res.ok) {
      onChannelChange({
        ...channel,
        videos: channel.videos.map((v) => (v.id === editingVideoId ? data : v)),
      });
      setEditingVideoId(null);
    }
  }

  async function deleteVideo(id: string) {
    const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
    if (res.ok) {
      onChannelChange({ ...channel, videos: channel.videos.filter((v) => v.id !== id) });
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSavingNote(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent, channelId: channel.id }),
    });
    const data: NoteDTO = await res.json();
    setSavingNote(false);
    if (res.ok) {
      onChannelChange({ ...channel, notes: [data, ...(channel.notes ?? [])] });
      setNoteContent("");
    }
  }

  async function deleteNote(id: string) {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (res.ok) {
      onChannelChange({ ...channel, notes: (channel.notes ?? []).filter((n) => n.id !== id) });
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={channel.name}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
            <p className="text-foreground/50">الأرباح الإجمالية</p>
            <p className="font-bold">{formatCurrency(channel.totalEarnings)}</p>
          </div>
          <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
            <p className="text-foreground/50">تاريخ النشر</p>
            <p className="font-bold">{formatDate(channel.publishedAt)}</p>
          </div>
        </div>

        <section>
          <h3 className="mb-2 font-bold">تفاصيل ربح كل فيديو</h3>
          <div className="scrollbar-thin max-h-48 space-y-2 overflow-y-auto pl-1">
            {channel.videos.length === 0 && (
              <p className="text-sm text-foreground/50">لا توجد فيديوهات مضافة بعد</p>
            )}
            {channel.videos.map((video) =>
              editingVideoId === video.id ? (
                <div key={video.id} className="flex items-center gap-2 rounded-xl border border-rose-500/30 p-2">
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1" />
                  <Input
                    type="number"
                    step="0.01"
                    value={editEarnings}
                    onChange={(e) => setEditEarnings(Number(e.target.value))}
                    className="w-24"
                  />
                  <Button size="sm" onClick={saveEditVideo}>
                    حفظ
                  </Button>
                </div>
              ) : (
                <div
                  key={video.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-black/5 p-2.5 dark:bg-white/5"
                >
                  <span className="truncate text-sm">{video.title}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-500">
                      {formatCurrency(video.earnings)}
                    </span>
                    <button
                      onClick={() => startEditVideo(video)}
                      className="rounded-lg p-1.5 text-foreground/50 hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="rounded-lg p-1.5 text-foreground/50 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <form onSubmit={handleAddVideo} className="mt-3 flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="vtitle">عنوان الفيديو</Label>
              <Input
                id="vtitle"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
              />
            </div>
            <div className="w-28">
              <Label htmlFor="vearn">الأرباح ($)</Label>
              <Input
                id="vearn"
                type="number"
                step="0.01"
                min={0}
                value={videoEarnings}
                onChange={(e) => setVideoEarnings(Number(e.target.value))}
                required
              />
            </div>
            <Button type="submit" size="md" loading={addingVideo} className="h-10">
              <Plus className="size-4" />
            </Button>
          </form>
        </section>

        <section>
          <h3 className="mb-2 font-bold">ملاحظات المدير</h3>
          <div className="scrollbar-thin max-h-36 space-y-2 overflow-y-auto pl-1">
            {(channel.notes ?? []).length === 0 && (
              <p className="text-sm text-foreground/50">لا توجد ملاحظات حتى الآن</p>
            )}
            {(channel.notes ?? []).map((note) => (
              <div
                key={note.id}
                className={cn(
                  "rounded-xl border-r-2 border-amber-400 bg-amber-400/10 p-3 text-sm"
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold">{note.author.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/40">{formatDate(note.createdAt)}</span>
                    {canManageNotes && (
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-foreground/40 hover:text-red-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-foreground/80">{note.content}</p>
              </div>
            ))}
          </div>

          {canManageNotes && (
            <form onSubmit={handleAddNote} className="mt-3 flex items-end gap-2">
              <Textarea
                placeholder="اكتب ملاحظة لهذه القناة..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button type="submit" loading={savingNote} className="h-full">
                إرسال
              </Button>
            </form>
          )}
        </section>
      </div>
    </Modal>
  );
}
