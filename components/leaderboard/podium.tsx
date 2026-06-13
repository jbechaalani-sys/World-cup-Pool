import { Crown } from "lucide-react";
import { CountUp } from "@/components/common/count-up";
import { Flag } from "@/components/common/flag";
import type { RankedPlayer } from "@/lib/ranking";
import { cn } from "@/lib/utils";

const STYLES = {
  1: {
    ring: "ring-gold/70",
    glow: "shadow-[0_0_30px_-8px_rgba(245,197,24,0.6)]",
    text: "text-gold",
    medal: "🥇",
    bg: "bg-gradient-to-b from-gold/10 to-card",
  },
  2: { ring: "ring-silver/50", glow: "", text: "text-silver", medal: "🥈", bg: "bg-card" },
  3: { ring: "ring-bronze/50", glow: "", text: "text-bronze", medal: "🥉", bg: "bg-card" },
} as const;

function PodiumCard({
  player,
  isMe,
  hero = false,
}: {
  player: RankedPlayer;
  isMe: boolean;
  hero?: boolean;
}) {
  const tier = (player.position <= 3 ? player.position : 3) as 1 | 2 | 3;
  const s = STYLES[tier];
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-2xl border border-border p-4 text-center ring-1 ring-inset",
        s.ring,
        s.glow,
        s.bg,
        hero && "py-5",
        isMe && "border-gold",
      )}
    >
      {hero && (
        <Crown className="absolute -top-3 size-6 text-gold drop-shadow" aria-hidden />
      )}
      <div className="text-2xl" aria-hidden>
        {s.medal}
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "font-display font-extrabold",
            hero ? "text-xl" : "text-base",
          )}
        >
          {player.name}
        </span>
        {isMe && (
          <span className="rounded bg-gold px-1 py-0.5 text-[9px] font-bold text-primary-foreground">
            YOU
          </span>
        )}
      </div>
      <div className={cn("font-display font-extrabold nums", s.text, hero ? "text-4xl" : "text-2xl")}>
        <CountUp value={player.points} />
        <span className="ml-1 text-xs font-bold text-muted-foreground">PTS</span>
      </div>
      {player.winnerPick && (
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Flag team={player.winnerPick} className="h-3 w-4" />
          {player.winnerPick}
        </div>
      )}
    </div>
  );
}

export function Podium({
  players,
  me,
}: {
  players: RankedPlayer[];
  me: string | null;
}) {
  const top = players.slice(0, 3);
  if (top.length === 0) return null;
  const [first, second, third] = top;

  return (
    <div className="space-y-3">
      <PodiumCard player={first} isMe={me === first.name} hero />
      {(second || third) && (
        <div className="grid grid-cols-2 gap-3">
          {second && <PodiumCard player={second} isMe={me === second.name} />}
          {third && <PodiumCard player={third} isMe={me === third.name} />}
        </div>
      )}
    </div>
  );
}
