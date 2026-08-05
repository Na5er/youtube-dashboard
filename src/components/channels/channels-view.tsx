"use client";

import { ChannelDetailModal } from "@/components/channels/channel-detail-modal";
import { ChannelFormModal } from "@/components/channels/channel-form-modal";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { ChannelDTO } from "@/types/models";
import { motion } from "framer-motion";
import { DollarSign, ExternalLink, Pencil, Plus, Radio, Trash2, Tv, Video } from "lucide-react";
import { useState } from "react";

interface ChannelsViewProps {
  initialChannels: ChannelDTO[];
  ownerId?: string;
  canManageNotes?: boolean;
  title?: string;
}

export function ChannelsView({
  initialChannels,
  ownerId,
  canManageNotes = false,
  title = "قنواتي",
}: ChannelsViewProps) {
  const [channels, setChannels] = useState(initialChannels);
  const [formOpen, setFormOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChannelDTO | null>(null);
  const [detailChannel, setDetailChannel] = useState<ChannelDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalEarnings = channels.reduce((sum, c) => sum + c.totalEarnings, 0);
  const totalVideos = channels.reduce((sum, c) => sum + c.regularVideosCount, 0);
  const totalLive = channels.reduce((sum, c) => sum + c.liveStreamsCount, 0);

  function handleSaved(channel: ChannelDTO) {
    setChannels((prev) => {
      const exists = prev.some((c) => c.id === channel.id);
      return exists ? prev.map((c) => (c.id === channel.id ? { ...c, ...channel } : c)) : [channel, ...prev];
    });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/channels/${id}`, { method: "DELETE" });
    if (res.ok) {
      setChannels((prev) => prev.filter((c) => c.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="عدد القنوات" value={String(channels.length)} icon={Tv} accent="rose" index={0} />
        <StatCard label="الأرباح الإجمالية" value={formatCurrency(totalEarnings)} icon={DollarSign} accent="emerald" index={1} />
        <StatCard label="الفيديوهات المضافة" value={String(totalVideos)} icon={Video} accent="sky" index={2} />
        <StatCard label="البثوث المباشرة" value={String(totalLive)} icon={Radio} accent="amber" index={3} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button
          onClick={() => {
            setEditingChannel(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          إضافة قناة
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[800px] text-right text-sm">
          <thead>
            <tr className="border-b border-black/5 text-foreground/50 dark:border-white/10">
              <th className="px-4 py-3 font-medium">اسم القناة</th>
              <th className="px-4 py-3 font-medium">البثوث المباشرة</th>
              <th className="px-4 py-3 font-medium">الفيديوهات العادية</th>
              <th className="px-4 py-3 font-medium">تاريخ النشر</th>
              <th className="px-4 py-3 font-medium">الأرباح الإجمالية</th>
              <th className="px-4 py-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel, i) => (
              <motion.tr
                key={channel.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "cursor-pointer border-b border-black/5 transition-colors hover:bg-black/[0.03] dark:border-white/5 dark:hover:bg-white/[0.04]"
                )}
                onClick={() => setDetailChannel(channel)}
              >
                <td className="px-4 py-3">
                  <div className="font-semibold">{channel.name}</div>
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-foreground/50 hover:text-rose-500"
                  >
                    <ExternalLink className="size-3" />
                    {channel.link}
                  </a>
                </td>
                <td className="px-4 py-3">{channel.liveStreamsCount}</td>
                <td className="px-4 py-3">{channel.regularVideosCount}</td>
                <td className="px-4 py-3 text-foreground/70">{formatDate(channel.publishedAt)}</td>
                <td className="px-4 py-3 font-bold text-emerald-500">
                  {formatCurrency(channel.totalEarnings)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChannel(channel);
                        setFormOpen(true);
                      }}
                      className="rounded-lg p-2 text-foreground/50 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(channel.id);
                      }}
                      disabled={deletingId === channel.id}
                      className="rounded-lg p-2 text-foreground/50 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {channels.length === 0 && (
          <div className="p-10 text-center text-foreground/50">
            لا توجد قنوات بعد، اضغط على &quot;إضافة قناة&quot; لبدء الإدخال
          </div>
        )}
      </Card>

      <ChannelFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        channel={editingChannel}
        ownerId={ownerId}
      />

      {detailChannel && (
        <ChannelDetailModal
          open={Boolean(detailChannel)}
          onClose={() => setDetailChannel(null)}
          channel={channels.find((c) => c.id === detailChannel.id) ?? detailChannel}
          onChannelChange={(updated) => {
            handleSaved(updated);
            setDetailChannel(updated);
          }}
          canManageNotes={canManageNotes}
        />
      )}
    </div>
  );
}
