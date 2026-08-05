import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "rose" | "emerald" | "sky" | "amber";
  index?: number;
}

const accents = {
  rose: "from-rose-600 to-pink-500",
  emerald: "from-emerald-500 to-teal-400",
  sky: "from-sky-500 to-blue-400",
  amber: "from-amber-500 to-orange-400",
};

export function StatCard({ label, value, icon: Icon, accent = "rose", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="flex items-center gap-4 p-5">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr text-white shadow-lg",
            accents[accent]
          )}
        >
          <Icon className="size-6" />
        </span>
        <div>
          <p className="text-sm text-foreground/60">{label}</p>
          <p className="text-xl font-extrabold">{value}</p>
        </div>
      </Card>
    </motion.div>
  );
}
