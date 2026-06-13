import type { Fixture } from "./schemas";

export type StageKey = "group" | "r32" | "r16" | "qf" | "sf" | "final";

export interface StageDef {
  key: StageKey;
  label: string;
  short: string;
}

export const STAGES: StageDef[] = [
  { key: "group", label: "Group Stage", short: "Groups" },
  { key: "r32", label: "Round of 32", short: "R32" },
  { key: "r16", label: "Round of 16", short: "R16" },
  { key: "qf", label: "Quarter-finals", short: "QF" },
  { key: "sf", label: "Semi-finals", short: "SF" },
  { key: "final", label: "Final & 3rd Place", short: "Final" },
];

const STAGE_ORDER: Record<StageKey, number> = {
  group: 0,
  r32: 1,
  r16: 2,
  qf: 3,
  sf: 4,
  final: 5,
};

/** Classify the sheet's "Group/Round" cell into a tournament stage. */
export function stageOf(groupRound: string): StageKey {
  const s = groupRound.toLowerCase();
  if (s.includes("group")) return "group";
  if (s.includes("32")) return "r32";
  if (s.includes("16")) return "r16";
  if (s.includes("quarter") || /\bqf\b/.test(s)) return "qf";
  if (s.includes("semi") || /\bsf\b/.test(s)) return "sf";
  if (s.includes("third") || s.includes("3rd") || s.includes("final"))
    return "final";
  return "group";
}

export interface StageGroup {
  stage: StageDef;
  fixtures: Fixture[];
}

/** Group fixtures by stage, in tournament order, each sorted by match number. */
export function groupByStage(fixtures: Fixture[]): StageGroup[] {
  const buckets = new Map<StageKey, Fixture[]>();
  for (const f of fixtures) {
    const key = stageOf(f.group);
    const arr = buckets.get(key) ?? [];
    arr.push(f);
    buckets.set(key, arr);
  }
  return STAGES.filter((s) => buckets.has(s.key)).map((stage) => ({
    stage,
    fixtures: (buckets.get(stage.key) ?? []).sort(
      (a, b) => a.matchNo - b.matchNo,
    ),
  }));
}

export function stageRank(key: StageKey): number {
  return STAGE_ORDER[key];
}

/** A fixture is finished when both scores are present (not null). */
export function isFinished(f: Fixture): boolean {
  return f.homeScore !== null && f.awayScore !== null;
}

/** Best-effort "is this match live" from the Status cell. */
export function isLive(f: Fixture): boolean {
  return /live|1st|2nd|half|ht|playing/i.test(f.status) && !isFinished(f);
}
