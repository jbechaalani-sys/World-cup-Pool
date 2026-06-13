/**
 * Tournament-specific configuration. 2026 World Cup only — hardcoding here is
 * intentional (see plan). Nothing here is secret: the Google Sheet is published.
 */

export const SHEET_PUB_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGUvaOJD7YamWr78XRNEv47WxBqnOWWM3SoJxZ11iqqY-0tXseAzlsgtheed1OaVQYr-YOxjm3cI74/pub";

/** Sheet tab gids. The "leaderboard" tab is intentionally unused — the players
 * tab is a superset (name, rank, points, exact, winners, pick). */
export const GID = {
  players: "816094404",
  fixtures: "186871962",
  links: "1313899245",
  stats: "889827253",
} as const;

export function csvUrl(gid: string): string {
  return `${SHEET_PUB_BASE}?gid=${gid}&single=true&output=csv`;
}

/** First match kickoff — Mexico vs South Africa, 11 Jun 2026, 23:00 Dubai (GST, GMT+4). */
export const KICKOFF_ISO = "2026-06-11T23:00:00+04:00";
export const KICKOFF = new Date(KICKOFF_ISO);
export const TZ_LABEL = "Dubai time";

/** Live-poll cadence (client) and ISR window (server first paint). */
export const POLL_MS = 60_000;
export const REVALIDATE_SECONDS = 60;

export const PRIZES = {
  currency: "AED",
  champion: 1000,
  runnerUp: 500,
  groupStage: 300,
  total: 1800,
} as const;

export const TOURNAMENT = {
  title: "FIFA World Cup 2026",
  subtitle: "Prediction League",
  matches: 104,
} as const;

/** Used for absolute URLs in metadata / OG. Set NEXT_PUBLIC_APP_URL on Vercel. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://world-cup-pool.vercel.app";
