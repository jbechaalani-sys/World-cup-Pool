/**
 * API-Football (api-sports.io v3) adapter — server only.
 * Display layer: pulls today's World Cup fixtures with current status/goals so
 * the app can overlay LIVE scores. Does NOT touch the sheet or player scoring.
 *
 * Disabled (returns []) unless API_FOOTBALL_KEY is set, so the app ships and
 * runs unchanged until a key is added. Upstream fetch is cached 5 min globally
 * to stay well under the free 100 req/day quota.
 */
const KEY = process.env.API_FOOTBALL_KEY;
const LEAGUE = process.env.API_FOOTBALL_LEAGUE_ID ?? "1"; // World Cup
const SEASON = process.env.API_FOOTBALL_SEASON ?? "2026";

const IN_PROGRESS = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "SUSP", "INT"]);
const FINISHED = new Set(["FT", "AET", "PEN"]);

export interface LiveMatch {
  home: string;
  away: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
  elapsed: number | null;
  inProgress: boolean;
  finished: boolean;
}

export function liveScoresEnabled(): boolean {
  return Boolean(KEY);
}

interface ApiFixture {
  fixture?: { status?: { short?: string; elapsed?: number | null } };
  teams?: { home?: { name?: string }; away?: { name?: string } };
  goals?: { home?: number | null; away?: number | null };
}

/** dateISO = YYYY-MM-DD in Dubai time, so it lines up with the sheet's dates. */
export async function fetchTodayLive(dateISO: string): Promise<LiveMatch[]> {
  if (!KEY) return [];
  const url =
    `https://v3.football.api-sports.io/fixtures` +
    `?league=${LEAGUE}&season=${SEASON}&date=${dateISO}&timezone=Asia/Dubai`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": KEY },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const rows: ApiFixture[] = Array.isArray((data as { response?: unknown }).response)
      ? ((data as { response: ApiFixture[] }).response)
      : [];

    return rows
      .map((r): LiveMatch | null => {
        const home = r.teams?.home?.name?.trim();
        const away = r.teams?.away?.name?.trim();
        const status = r.fixture?.status?.short ?? "NS";
        if (!home || !away) return null;
        return {
          home,
          away,
          homeGoals: r.goals?.home ?? null,
          awayGoals: r.goals?.away ?? null,
          status,
          elapsed: r.fixture?.status?.elapsed ?? null,
          inProgress: IN_PROGRESS.has(status),
          finished: FINISHED.has(status),
        };
      })
      .filter((m): m is LiveMatch => m !== null);
  } catch {
    return [];
  }
}
