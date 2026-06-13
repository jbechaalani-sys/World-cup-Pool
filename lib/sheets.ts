import { GID, REVALIDATE_SECONDS, csvUrl } from "./config";
import { parseCsv } from "./csv";
import {
  parseFixtures,
  parseLinks,
  parsePlayers,
  parseStats,
  type Fixture,
  type Player,
  type StatRow,
} from "./schemas";

/**
 * Two fetch modes:
 *  - "isr"  : server first paint / SEO / OG. Shared data cache, refreshed every 60s.
 *  - "live" : client-poll route handlers. no-store + cache-bust to defeat Google's
 *             ~5-min CDN cache so the leaderboard is genuinely fresh.
 */
export type FetchMode = "isr" | "live";

async function fetchRows(gid: string, mode: FetchMode): Promise<string[][]> {
  const base = csvUrl(gid);
  const url = mode === "live" ? `${base}&t=${Date.now()}` : base;
  const init: RequestInit & { next?: { revalidate: number } } =
    mode === "live"
      ? { cache: "no-store" }
      : { next: { revalidate: REVALIDATE_SECONDS } };

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Google Sheet tab ${gid} returned HTTP ${res.status}`);
  }
  const text = await res.text();
  const rows = parseCsv(text);
  return rows.slice(1); // drop header row
}

export async function getPlayers(mode: FetchMode = "isr"): Promise<Player[]> {
  return parsePlayers(await fetchRows(GID.players, mode));
}

export async function getFixtures(mode: FetchMode = "isr"): Promise<Fixture[]> {
  return parseFixtures(await fetchRows(GID.fixtures, mode));
}

export async function getStats(mode: FetchMode = "isr"): Promise<StatRow[]> {
  return parseStats(await fetchRows(GID.stats, mode));
}

export async function getLinks(mode: FetchMode = "isr"): Promise<Map<string, string>> {
  return parseLinks(await fetchRows(GID.links, mode));
}
