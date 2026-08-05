"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Settings, Tv } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopbarProps {
  name: string;
  roleLabel: string;
  links: { href: string; label: string; icon: "dashboard" }[];
}

const icons = {
  dashboard: LayoutDashboard,
};

export function Topbar({ name, roleLabel, links }: TopbarProps) {
  const pathname = usePathname();

  return (
    <header className="glass sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2 font-extrabold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white">
            <Tv className="size-5" />
          </span>
          <span className="hidden sm:inline">شبكة الإبداع</span>
        </div>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const Icon = icons[link.icon];
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-rose-600/15 text-rose-500"
                    : "text-foreground/60 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/profile"
          className="hidden items-center gap-2 rounded-xl px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10 sm:flex"
        >
          <Settings className="size-4 text-foreground/50" />
          <span className="font-medium">{name}</span>
          <span className="rounded-full bg-rose-600/15 px-2 py-0.5 text-xs text-rose-500">
            {roleLabel}
          </span>
        </Link>
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex size-9 items-center justify-center rounded-full border border-black/10 text-foreground/70 transition-colors hover:border-red-500/40 hover:text-red-500 dark:border-white/10"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}
