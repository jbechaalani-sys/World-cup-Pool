"use client";

import { useMe } from "@/components/me/me-provider";
import type { MatchPrediction } from "@/lib/predictions-core";
import { cn } from "@/lib/utils";

type Kind = "exact" | "winner" | "wrong" | "none";

function parseScore(s: string): [number, number] | null {
  const m = s.match(/^(\d+)-(\d+)$/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

const ORDER: Record<Kind, number> = { exact: 0, winner: 1, none: 2, wrong: 3 };

export function MatchPredictions({
  predictions,
  resultH,
  resultA,
}: {
  predictions: MatchPrediction[];
  resultH: number | null;
  resultA: number | null;
}) {
  const { me } = useMe();
  const hasResult = resultH !== null && resultA !== null;

  const evaluated = predictions.map((p) => {
    const ps = parseScore(p.score);
    let kind: Kind = "none";
    if (hasResult && ps) {
      const [h, a] = ps;
      if (h === resultH && a === resultA) kind = "exact";
      else if (Math.sign(h - a) === Math.sign(resultH! - resultA!)) kind = "winner";
      else kind = "wrong";
    }
    return { ...p, kind, isMe: me === p.player };
  });

  evaluated.sort(
    (a, b) =>
      Number(b.isMe) - Number(a.isMe) ||
      ORDER[a.kind] - ORDER[b.kind] ||
      a.player.localeCompare(b.player),
  );

  const counts = new Map<string, number>();
  for (const p of predictions) counts.set(p.score, (counts.get(p.score) ?? 0) + 1);
  const popular = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )[0];
  const exactCount = evaluated.filter((p) => p.kind === "exact").length;

  return (
    <div className="mt-2 rounded-lg border border-border bg-secondary/30 p-2.5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {popular && (
          <span>
            Most predicted:{" "}
            <span className="font-mono font-semibold text-foreground">
              {popular[0]}
            </span>{" "}
            ×{popular[1]}
          </span>
        )}
        {hasResult && (
          <span className={cn(exactCount > 0 && "font-semibold text-teal")}>
            {exactCount} spot-on 🎯
          </span>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {evaluated.map((p) => (
          <li
            key={p.player}
            className={cn(
              "flex items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs",
              p.kind === "exact" && "bg-teal/15 text-teal",
              p.kind === "winner" && "bg-up/10",
              p.kind === "wrong" && "opacity-60",
              p.isMe && "ring-1 ring-gold",
            )}
          >
            <span className="truncate font-medium">
              {p.player}
              {p.isMe && <span className="text-gold"> ·you</span>}
            </span>
            <span className="shrink-0 font-mono font-bold nums">
              {p.score}
              {p.kind === "exact" && " 🎯"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
