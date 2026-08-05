"use client";

import { UserFormModal } from "@/components/admin/user-form-modal";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { UserSummaryDTO } from "@/types/models";
import { motion } from "framer-motion";
import { ChevronLeft, DollarSign, Plus, Radio, Users, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AdminOverview({ users: initialUsers }: { users: UserSummaryDTO[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [formOpen, setFormOpen] = useState(false);

  const totalEarnings = users.reduce((sum, u) => sum + u.totalEarnings, 0);
  const totalVideos = users.reduce((sum, u) => sum + u.totalVideos, 0);
  const totalLive = users.reduce((sum, u) => sum + u.totalLiveStreams, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="عدد صناع المحتوى" value={String(users.length)} icon={Users} accent="rose" index={0} />
        <StatCard label="أرباح الشبكة الإجمالية" value={formatCurrency(totalEarnings)} icon={DollarSign} accent="emerald" index={1} />
        <StatCard label="إجمالي الفيديوهات" value={String(totalVideos)} icon={Video} accent="sky" index={2} />
        <StatCard label="إجمالي البثوث المباشرة" value={String(totalLive)} icon={Radio} accent="amber" index={3} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">صناع المحتوى</h2>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" />
            إضافة صانع محتوى
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/admin/users/${user.id}`}>
                <Card className="group flex items-center justify-between p-5 transition-transform hover:-translate-y-0.5">
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-foreground/50">@{user.username}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-foreground/60">{user.channelsCount} قناة</span>
                      <span className="font-bold text-emerald-500">
                        {formatCurrency(user.totalEarnings)}
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="size-5 text-foreground/30 transition-transform group-hover:-translate-x-1 group-hover:text-rose-500" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {users.length === 0 && (
          <Card className="p-10 text-center text-foreground/50">لا يوجد صناع محتوى مسجلين حتى الآن</Card>
        )}
      </div>

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={(user) => setUsers((prev) => [...prev, user])}
      />
    </div>
  );
}
