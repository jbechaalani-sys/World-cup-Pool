import {
  CalendarDays,
  ChartColumn,
  Gift,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { href: "/", label: "Leaderboard", shortLabel: "Table", icon: Trophy },
  { href: "/fixtures", label: "Fixtures", shortLabel: "Fixtures", icon: CalendarDays },
  { href: "/players", label: "Players", shortLabel: "Players", icon: Users },
  { href: "/stats", label: "Stats", shortLabel: "Stats", icon: ChartColumn },
  { href: "/rules", label: "Rules & Prizes", shortLabel: "Rules", icon: Gift },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
