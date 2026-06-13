import { parseCsv } from "./csv";
import { parseHbPredictions } from "./hb-template";
import type { PredictionsByPair } from "./predictions-core";
import { getLinks } from "./sheets";
import { normTeam, pairKey } from "./team-name";

/** Convert a Google Sheets "/edit" link into a CSV export URL. */
function exportUrl(link: string): string | null {
  const id = link.match(/\/spreadsheets\/d\/([A-Za-z0-9_-]+)/)?.[1];
  if (!id) return null;
  const gid = link.match(/[?&#]gid=(\d+)/)?.[1];
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv${gid ? `&gid=${gid}` : ""}`;
}

/**
 * Read every player's (locked, final) prediction sheet and aggregate by team
 * pair. Predictions never change, so each sheet is cached 6h. One failed sheet
 * just omits that player rather than breaking the page.
 */
export async function getPredictionsByPair(): Promise<PredictionsByPair> {
  let links: Map<string, string>;
  try {
    links = await getLinks("isr");
  } catch {
    return {};
  }

  const results = await Promise.allSettled(
    [...links.entries()].map(async ([player, link]) => {
      const url = exportUrl(link);
      if (!url) return null;
      const res = await fetch(url, { next: { revalidate: 21600 } });
      if (!res.ok) return null;
      return { player, preds: parseHbPredictions(parseCsv(await res.text())) };
    }),
  );

  const byPair: PredictionsByPair = {};
  for (const r of results) {
    if (r.status !== "fulfilled" || !r.value) continue;
    const { player, preds } = r.value;
    for (const p of preds) {
      const key = pairKey(p.home, p.away);
      (byPair[key] ??= []).push({
        player,
        homeKey: normTeam(p.home),
        homeScore: p.homeScore,
        awayScore: p.awayScore,
      });
    }
  }
  return byPair;
}
