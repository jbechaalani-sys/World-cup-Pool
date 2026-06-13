import { CountUp } from "@/components/common/count-up";
import type { Movement } from "@/lib/rank-delta";
import { cn } from "@/lib/utils";
import { RankArrow } from "./rank-arrow";

export function LeaderboardRow({
  position,
  name,
  points,
  movement,
  isMe = false,
  showMovement,
}: {
  position: number;
  name: string;
  points: number;
  movement: Movement;
  isMe?: boolean;
  showMovement: boolean;
}) {
  return (
    <li
      data-me={isMe}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 sm:gap-3",
        isMe &&
          "ring-2 ring-gold shadow-[0_0_18px_-6px_rgba(245,197,24,0.45)]",
      )}
    >
      <RankArrow movement={movement} show={showMovement} />
      <span className="w-6 shrink-0 text-center font-display text-lg font-bold nums">
        {position}
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
        {name.slice(0, 2).toUpperCase()}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium">{name}</span>
        {isMe && (
          <span className="shrink-0 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            YOU
          </span>
        )}
      </span>
      <span className="shrink-0 font-display text-base font-bold nums">
        <CountUp value={points} />
      </span>
    </li>
  );
}
