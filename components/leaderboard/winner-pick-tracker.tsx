import { Flag } from "@/components/common/flag";
import type { Player } from "@/lib/schemas";

export function WinnerPickTracker({ players }: { players: Player[] }) {
  const counts = new Map<string, number>();
  for (const p of players) {
    if (p.winnerPick) counts.set(p.winnerPick, (counts.get(p.winnerPick) ?? 0) + 1);
  }
  const entries = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  if (entries.length === 0) return null;
  const max = entries[0][1];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 font-display text-base font-bold">
        Picked to lift the trophy 🏆
      </h2>
      <ul className="space-y-2.5">
        {entries.map(([team, count]) => (
          <li key={team} className="flex items-center gap-3">
            <Flag team={team} className="shrink-0" />
            <span className="w-24 shrink-0 truncate text-sm font-medium sm:w-36">
              {team}
            </span>
            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </span>
            <span className="w-5 shrink-0 text-right font-display text-sm font-bold nums">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
