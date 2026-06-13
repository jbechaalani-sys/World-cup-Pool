export type Direction = "up" | "down" | "same" | "new";

export interface Movement {
  dir: Direction;
  /** Number of positions gained (up) or lost (down); 0 otherwise. */
  delta: number;
}

/**
 * Movement of a player's position vs a previous snapshot.
 * Lower position number = better, so was - now > 0 means moved up.
 * On the first visit (no snapshot) every player is "new" → rendered as a dash.
 */
export function movement(
  name: string,
  currentPosition: number,
  previous: Record<string, number> | null,
): Movement {
  if (!previous || !(name in previous)) return { dir: "new", delta: 0 };
  const was = previous[name];
  const delta = was - currentPosition;
  if (delta > 0) return { dir: "up", delta };
  if (delta < 0) return { dir: "down", delta: -delta };
  return { dir: "same", delta: 0 };
}
