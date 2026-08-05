"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { NoteDTO } from "@/types/models";
import { MessageSquareText, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

export function UserNotes({ userId, initialNotes }: { userId: string; initialNotes: NoteDTO[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, targetUserId: userId }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setNotes((prev) => [data, ...prev]);
      setContent("");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (res.ok) setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2 font-bold">
        <MessageSquareText className="size-4 text-rose-500" />
        ملاحظات المدير العامة
      </div>

      <div className="scrollbar-thin mb-3 max-h-40 space-y-2 overflow-y-auto">
        {notes.length === 0 && (
          <p className="text-sm text-foreground/50">لا توجد ملاحظات عامة بعد</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl border-r-2 border-amber-400 bg-amber-400/10 p-3 text-sm">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">{note.author.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/40">{formatDate(note.createdAt)}</span>
                <button onClick={() => handleDelete(note.id)} className="text-foreground/40 hover:text-red-500">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="text-foreground/80">{note.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex items-end gap-2">
        <Textarea
          placeholder="اكتب ملاحظة عامة عن هذا المستخدم..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="flex-1"
        />
        <Button type="submit" loading={loading} className="h-full">
          إرسال
        </Button>
      </form>
    </Card>
  );
}
