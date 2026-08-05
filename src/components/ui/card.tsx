import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30",
        className
      )}
      {...props}
    />
  );
}
