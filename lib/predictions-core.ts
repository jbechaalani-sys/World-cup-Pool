import { normTeam, pairKey } from "./team-name";

/** One player's prediction, stored in the orientation the player's sheet used. */
export interface RawPrediction {
  player: string;
  homeKey: string; // normTeam of the team the player listed as home
  homeScore: number;
  awayScore: number;
}

/** Order-independent team pair key -> every player's prediction for that match. */
export type PredictionsByPair = Record<string, RawPrediction[]>;

/** What the UI consumes: a player + their score oriented to the fixture. */
export interface MatchPrediction {
  player: string;
  score: string; // "home-away" in the FIXTURE's orientation
}

/**
 * Resolve predictions for a fixture, orienting each player's score to the
 * fixture's home/away (the player template may list the sides in either order).
 */
export function predictionsForFixture(
  byPair: PredictionsByPair,
  home: string,
  away: string,
): MatchPrediction[] {
  const preds = byPair[pairKey(home, away)];
  if (!preds) return [];
  const homeKey = normTeam(home);
  return preds.map((p) => ({
    player: p.player,
    score:
      p.homeKey === homeKey
        ? `${p.homeScore}-${p.awayScore}`
        : `${p.awayScore}-${p.homeScore}`,
  }));
}
