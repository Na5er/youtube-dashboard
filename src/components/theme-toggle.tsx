"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe mount flag for next-themes
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-9 rounded-full" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-foreground/70 transition-colors hover:text-foreground dark:border-white/10 dark:bg-white/5"
      aria-label="تبديل المظهر"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
