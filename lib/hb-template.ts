/**
 * Parse the "hb v4.2.5" World Cup prediction template (the spreadsheet every
 * player submitted) into a list of {home, away, score} predictions.
 *
 * We key on TEAMS, not the template's match numbers — those differ from the
 * fixtures tab's "Match #" for some games (e.g. Brazil–Morocco is #7 here but #6
 * in fixtures), so joining by number mismatches games.
 *
 * Group stage only (matches 1–72): verified geometry — 6 five-row bands
 * ([match#/city, date, teams, score, blank]), 12 group columns wide, each group
 * occupying 3 CSV columns. The match number is used only to gate to the group
 * stage; the knockout bracket (different layout) is skipped until verified.
 */
const GROUPS = 12;
const MAX_GROUP_MATCH = 72;

const isInt = (v: string | undefined): boolean =>
  v !== undefined && /^\d+$/.test(v.trim());

export interface HbPrediction {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
}

export function parseHbPredictions(rows: string[][]): HbPrediction[] {
  const out: HbPrediction[] = [];

  for (let i = 0; i + 3 < rows.length; i++) {
    const city = rows[i];
    const teams = rows[i + 2];
    const score = rows[i + 3];
    if (!isInt(city[0]) || !isInt(city[3])) continue;

    let matched = false;
    for (let k = 0; k < GROUPS; k++) {
      const mn = Number((city[k * 3] ?? "").trim());
      const home = (teams[k * 3 + 1] ?? "").trim();
      const away = (teams[k * 3 + 2] ?? "").trim();
      const h = (score[k * 3 + 1] ?? "").trim();
      const a = (score[k * 3 + 2] ?? "").trim();
      if (
        mn >= 1 &&
        mn <= MAX_GROUP_MATCH &&
        home &&
        away &&
        /^\d+$/.test(h) &&
        /^\d+$/.test(a)
      ) {
        out.push({ home, away, homeScore: Number(h), awayScore: Number(a) });
        matched = true;
      }
    }
    if (matched) i += 4;
  }

  return out;
}
