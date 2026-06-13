"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV, isActive } from "./nav-items";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 md:max-w-5xl md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="WC26 Pool home">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/25">
            <Trophy className="size-4" aria-hidden />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            WC26 <span className="text-primary">POOL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
