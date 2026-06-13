"use client";

import { CheckCheck, Info, Target } from "lucide-react";
import { useMe } from "@/components/me/me-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { StatRow } from "@/lib/schemas";
import { cn } from "@/lib/utils";

function LeaderCard({
  icon,
  label,
  name,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="truncate font-display text-lg font-bold">{name}</div>
      </div>
      <div className="ml-auto font-display text-2xl font-extrabold nums text-primary">
        {value}
      </div>
    </div>
  );
}

export function StatsBoard({ rows }: { rows: StatRow[] }) {
  const { me } = useMe();

  const sorted = [...rows].sort(
    (a, b) =>
      b.statsScore - a.statsScore ||
      b.exactScores - a.exactScores ||
      a.name.localeCompare(b.name),
  );

  const mostExact = [...rows].sort((a, b) => b.exactScores - a.exactScores)[0];
  const mostWinners = [...rows].sort(
    (a, b) => b.correctWinners - a.correctWinners,
  )[0];

  return (
    <div className="space-y-4">
      <Alert className="border-primary/30 bg-primary/5">
        <Info className="size-4 text-primary" aria-hidden />
        <AlertTitle>How the Stats Score works</AlertTitle>
        <AlertDescription>
          Stats Score = (Exact Scores × 2) + Correct Winners — a fun accuracy
          ranking, separate from the official tournament points.
        </AlertDescription>
      </Alert>

      {mostExact && mostWinners && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LeaderCard
            icon={<Target className="size-4" aria-hidden />}
            label="Most exact scores"
            name={mostExact.name}
            value={mostExact.exactScores}
          />
          <LeaderCard
            icon={<CheckCheck className="size-4" aria-hidden />}
            label="Most correct winners"
            name={mostWinners.name}
            value={mostWinners.correctWinners}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Player</th>
              <th className="px-2 py-2.5 text-center font-medium">Exact</th>
              <th className="px-2 py-2.5 text-center font-medium">Won</th>
              <th className="px-3 py-2.5 text-right font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const isMe = me === r.name;
              return (
                <tr
                  key={r.name}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    isMe && "bg-gold/10",
                  )}
                >
                  <td className="px-3 py-2.5 font-medium">
                    {r.name}
                    {isMe && (
                      <span className="ml-2 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-center nums">{r.exactScores}</td>
                  <td className="px-2 py-2.5 text-center nums">
                    {r.correctWinners}
                  </td>
                  <td className="px-3 py-2.5 text-right font-display font-bold nums text-primary">
                    {r.statsScore}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
