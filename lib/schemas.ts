import { z } from "zod";

/**
 * Zod schemas + positional row mappers for each sheet tab.
 * Every numeric field uses `.catch()` so one weird cell never drops a whole row;
 * only a missing name (the identity key) drops a row. Invalid rows are filtered out.
 */

const scoreOrNull = z.preprocess((v) => {
  const s = typeof v === "string" ? v.trim() : v;
  if (s === "" || s == null) return null;
  const num = Number(s);
  return Number.isFinite(num) ? num : null;
}, z.number().nullable());

// ---------------- Players (master tab) ----------------
// cols: Name, Rank, Points, Correct Winner/Exact Scores, Correct Winners/Wrong Score, Winners Pick
export const PlayerSchema = z.object({
  name: z.string().trim().min(1),
  rank: z.coerce.number().int().catch(0),
  points: z.coerce.number().catch(0),
  exactScores: z.coerce.number().int().catch(0),
  correctWinners: z.coerce.number().int().catch(0),
  winnerPick: z.string().trim().catch(""),
});
export type Player = z.infer<typeof PlayerSchema>;

export function parsePlayers(rows: string[][]): Player[] {
  return rows
    .map((c) =>
      PlayerSchema.safeParse({
        name: c[0],
        rank: c[1],
        points: c[2],
        exactScores: c[3],
        correctWinners: c[4],
        winnerPick: c[5] ?? "",
      }),
    )
    .filter((r) => r.success)
    .map((r) => r.data);
}

// ---------------- Fixtures ----------------
// cols: Match #, Date, Time, Group/Round, Home Team, Away Team, Home Score, Away Score, Status
export const FixtureSchema = z.object({
  matchNo: z.coerce.number().int().catch(0),
  date: z.string().trim().catch(""),
  time: z.string().trim().catch(""),
  group: z.string().trim().catch(""),
  home: z.string().trim().min(1),
  away: z.string().trim().min(1),
  homeScore: scoreOrNull,
  awayScore: scoreOrNull,
  status: z.string().trim().catch("Upcoming"),
});
export type Fixture = z.infer<typeof FixtureSchema>;

export function parseFixtures(rows: string[][]): Fixture[] {
  return rows
    .map((c) =>
      FixtureSchema.safeParse({
        matchNo: c[0],
        date: c[1],
        time: c[2],
        group: c[3],
        home: c[4],
        away: c[5],
        homeScore: c[6] ?? "",
        awayScore: c[7] ?? "",
        status: c[8] ?? "Upcoming",
      }),
    )
    .filter((r) => r.success)
    .map((r) => r.data);
}

// ---------------- Links ----------------
// cols: Player, Link
export const LinkSchema = z.object({
  name: z.string().trim().min(1),
  url: z
    .string()
    .trim()
    .refine((u) => /^https:\/\//i.test(u), "must be an https URL"),
});
export type PredictionLink = z.infer<typeof LinkSchema>;

export function parseLinks(rows: string[][]): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of rows) {
    const parsed = LinkSchema.safeParse({ name: c[0], url: c[1] });
    if (parsed.success) map.set(parsed.data.name, parsed.data.url);
  }
  return map;
}

// ---------------- Stats ----------------
// cols: Player, Exact Scores, Correct Winners, Stats Score
export const StatSchema = z.object({
  name: z.string().trim().min(1),
  exactScores: z.coerce.number().int().catch(0),
  correctWinners: z.coerce.number().int().catch(0),
  statsScore: z.coerce.number().catch(0),
});
export type StatRow = z.infer<typeof StatSchema>;

export function parseStats(rows: string[][]): StatRow[] {
  return rows
    .map((c) =>
      StatSchema.safeParse({
        name: c[0],
        exactScores: c[1],
        correctWinners: c[2],
        statsScore: c[3],
      }),
    )
    .filter((r) => r.success)
    .map((r) => r.data);
}
