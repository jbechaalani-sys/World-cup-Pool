import { Flag } from "@/components/common/flag";
import type { Fixture } from "@/lib/schemas";
import { isFinished } from "@/lib/stages";
import { cn } from "@/lib/utils";

export interface LiveOverlay {
  homeGoals: number | null;
  awayGoals: number | null;
  elapsed: number | null;
}

function LiveBadge({ elapsed }: { elapsed: number | null }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal">
      <span className="size-1.5 animate-pulse rounded-full bg-teal" />
      {elapsed ? `Live ${elapsed}'` : "Live"}
    </span>
  );
}

function StatusBadge({ fixture }: { fixture: Fixture }) {
  if (isFinished(fixture)) {
    return (
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        Full time
      </span>
    );
  }
  return (
    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
      Upcoming
    </span>
  );
}

export function MatchCard({
  fixture,
  today = false,
  live,
}: {
  fixture: Fixture;
  today?: boolean;
  live?: LiveOverlay;
}) {
  const finished = isFinished(fixture);
  const liveNow = Boolean(live) && !finished;

  let score: string | null = null;
  if (liveNow && live) {
    score = `${live.homeGoals ?? 0}–${live.awayGoals ?? 0}`;
  } else if (finished) {
    score = `${fixture.homeScore ?? 0}–${fixture.awayScore ?? 0}`;
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3",
        liveNow && "ring-1 ring-teal/40",
        today && "border-l-2 border-l-teal",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="truncate">
          {fixture.group} · #{fixture.matchNo}
          {today && <span className="ml-2 font-bold text-teal">TODAY</span>}
        </span>
        {liveNow && live ? (
          <LiveBadge elapsed={live.elapsed} />
        ) : (
          <StatusBadge fixture={fixture} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate text-sm font-medium">{fixture.home}</span>
          <Flag team={fixture.home} className="shrink-0" />
        </div>
        <div className="shrink-0 px-2 text-center">
          {score ? (
            <span
              className={cn(
                "font-mono text-base font-bold nums",
                liveNow && "text-teal",
              )}
            >
              {score}
            </span>
          ) : (
            <span className="font-mono text-xs text-muted-foreground">
              {fixture.time || "vs"}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Flag team={fixture.away} className="shrink-0" />
          <span className="truncate text-sm font-medium">{fixture.away}</span>
        </div>
      </div>

      <div className="mt-1.5 text-center text-[11px] text-muted-foreground">
        {fixture.date}
        {fixture.time ? ` · ${fixture.time}` : ""}
      </div>
    </div>
  );
}
