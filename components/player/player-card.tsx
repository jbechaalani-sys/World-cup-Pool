import { ExternalLink } from "lucide-react";
import { Flag } from "@/components/common/flag";
import { Button } from "@/components/ui/button";
import { medalFor, type RankedPlayer } from "@/lib/ranking";
import { cn } from "@/lib/utils";

const MEDAL: Record<string, string> = { gold: "🥇", silver: "🥈", bronze: "🥉" };

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-2 py-1.5">
      <div className="font-display text-base font-bold nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function PlayerCard({
  player,
  link,
  isMe = false,
}: {
  player: RankedPlayer;
  link?: string;
  isMe?: boolean;
}) {
  const medal = medalFor(player.position);
  const initials = player.name.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors",
        isMe &&
          "ring-2 ring-gold shadow-[0_0_20px_-6px_rgba(245,197,24,0.45)]",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-bold text-secondary-foreground">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-lg font-bold">
              {player.name}
            </span>
            {isMe && (
              <span className="shrink-0 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                YOU
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {medal ? `${MEDAL[medal]} ` : ""}Rank #{player.position}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-extrabold nums text-primary">
            {player.points}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            points
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Exact" value={player.exactScores} />
        <Stat label="Winners" value={player.correctWinners} />
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-secondary/40 px-2 py-1.5">
          {player.winnerPick ? (
            <>
              <Flag team={player.winnerPick} className="h-3.5 w-5" />
              <div className="mt-0.5 truncate text-[10px] font-medium">
                {player.winnerPick}
              </div>
            </>
          ) : (
            <div className="text-base font-bold text-muted-foreground">—</div>
          )}
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Pick
          </div>
        </div>
      </div>

      {link ? (
        <Button asChild variant="secondary" size="sm" className="w-full gap-1.5">
          <a href={link} target="_blank" rel="noopener noreferrer">
            View prediction sheet
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </Button>
      ) : (
        <Button variant="secondary" size="sm" className="w-full" disabled>
          Sheet unavailable
        </Button>
      )}
    </div>
  );
}
