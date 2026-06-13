/**
 * Normalize a team name to a comparable key so sheet names and football-API
 * names match despite spelling differences (USA vs United States, South Korea
 * vs Korea Republic, Czech Republic vs Czechia, ...). Pure — safe on client.
 *
 * normalize("NFD") splits accented letters into base + combining mark, then the
 * final [^a-z0-9] filter drops the combining marks (and all punctuation/spaces).
 */
const ALIASES: Record<string, string> = {
  unitedstates: "usa",
  unitedstatesofamerica: "usa",
  korearepublic: "southkorea",
  republicofkorea: "southkorea",
  koreadpr: "northkorea",
  czechia: "czechrepublic",
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

export function matchKey(home: string, away: string): string {
  return `${normTeam(home)}|${normTeam(away)}`;
}
