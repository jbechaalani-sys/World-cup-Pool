"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV, isActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-12 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                {active && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary" />
                )}
                <Icon className="size-5" aria-hidden />
                <span>{item.shortLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
