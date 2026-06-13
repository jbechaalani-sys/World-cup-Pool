import type { Player } from "./schemas";

export interface RankedPlayer extends Player {
  /** Standard competition rank (1, 2, 2, 4 …) derived from points. */
  position: number;
}

/**
 * Rank by points descending using standard competition ranking — equal points
 * share a position, the next distinct score skips accordingly. Matches the
 * sheet's own Rank convention and keeps movement arrows self-consistent.
 * Name is the deterministic tiebreaker so ordering is stable across polls.
 */
export function rankPlayers(players: Player[]): RankedPlayer[] {
  const sorted = [...players].sort(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name),
  );

  let lastPoints: number | null = null;
  let lastPosition = 0;

  return sorted.map((p, index) => {
    let position: number;
    if (lastPoints !== null && p.points === lastPoints) {
      position = lastPosition;
    } else {
      position = index + 1;
      lastPosition = position;
      lastPoints = p.points;
    }
    return { ...p, position };
  });
}

/** Snapshot of name -> position, persisted client-side to compute movement. */
export function positionMap(ranked: RankedPlayer[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const p of ranked) map[p.name] = p.position;
  return map;
}

export type MedalClass = "gold" | "silver" | "bronze" | null;

export function medalFor(position: number): MedalClass {
  if (position === 1) return "gold";
  if (position === 2) return "silver";
  if (position === 3) return "bronze";
  return null;
}
