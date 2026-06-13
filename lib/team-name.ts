/**
 * Normalize a team name to a comparable key so the player template ("hb"), the
 * fixtures tab, and the football API all match despite spelling differences
 * (USA vs United States, Rep. of Korea vs South Korea, Czech Rep. vs Czechia,
 * Bosnia/Herzeg. vs Bosnia & Herzegovina, ...). Pure — safe on client.
 *
 * normalize("NFD") splits accented letters into base + combining mark, then the
 * final [^a-z0-9] filter drops the combining marks (and all punctuation/spaces).
 */
const ALIASES: Record<string, string> = {
  // USA
  unitedstates: "usa",
  unitedstatesofamerica: "usa",
  // Korea
  korearepublic: "southkorea",
  republicofkorea: "southkorea",
  repofkorea: "southkorea",
  koreadpr: "northkorea",
  // Czechia
  czechia: "czechrepublic",
  czechrep: "czechrepublic",
  // Bosnia
  bosniaherzeg: "bosniaandherzegovina",
  bosniaherzegovina: "bosniaandherzegovina",
  // misc abbreviations / variants
  iriran: "iran",
  turkiye: "turkey",
  cotedivoire: "ivorycoast",
  caboverde: "capeverde",
  chinapr: "china",
};

export function normTeam(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  return ALIASES[base] ?? base;
}

/** Ordered key (home|away) — used for the live-score overlay. */
export function matchKey(home: string, away: string): string {
  return `${normTeam(home)}|${normTeam(away)}`;
}

/** Order-independent key for the two teams — used to join predictions to
 * fixtures regardless of which side each source lists as home. */
export function pairKey(a: string, b: string): string {
  return [normTeam(a), normTeam(b)].sort().join("|");
}
