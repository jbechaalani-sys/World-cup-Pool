import { PRIZES } from "@/lib/config";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    label: "Champion",
    amount: PRIZES.champion,
    emoji: "🥇",
    ring: "ring-gold/60",
    glow: "shadow-[0_0_28px_-8px_rgba(245,197,24,0.55)]",
    text: "text-gold",
    featured: true,
  },
  {
    label: "Runner-Up",
    amount: PRIZES.runnerUp,
    emoji: "🥈",
    ring: "ring-silver/40",
    glow: "",
    text: "text-silver",
    featured: false,
  },
  {
    label: "Group Stage",
    amount: PRIZES.groupStage,
    emoji: "🏅",
    ring: "ring-bronze/40",
    glow: "",
    text: "text-bronze",
    featured: false,
  },
] as const;

export function PrizeCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-3", className)}>
      {TIERS.map((t) => (
        <div
          key={t.label}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 ring-1 ring-inset",
            t.ring,
            t.glow,
            t.featured && "sm:flex-col sm:items-start",
          )}
        >
          <span className="text-2xl" aria-hidden>
            {t.emoji}
          </span>
          <div>
            <div className={cn("font-display text-2xl font-extrabold nums", t.text)}>
              {t.amount}
              <span className="ml-1 text-sm font-bold text-muted-foreground">
                {PRIZES.currency}
              </span>
            </div>
            <div className="text-xs font-medium text-muted-foreground">{t.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
