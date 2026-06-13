"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Flag } from "@/components/common/flag";
import { MatchPredictions } from "@/components/fixtures/match-predictions";
import { TZ_LABEL } from "@/lib/config";
import {
  predictionsForFixture,
  type PredictionsByPair,
} from "@/lib/predictions-core";
import type { Fixture } from "@/lib/schemas";
import { isFinished } from "@/lib/stages";
import { cn } from "@/lib/utils";

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseFixtureDate(date: string, time: string): Date | null {
  const dm = date.trim().match(/(\d{1,2})\s*[-\s]\s*([A-Za-z]{3})/);
  if (!dm) return null;
  const day = Number(dm[1]);
  const mon = MONTHS[dm[2].toLowerCase()];
  if (!mon) return null;

  let h = 0;
  let min = 0;
  const tm = time.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (tm) {
    h = Number(tm[1]) % 12;
    min = Number(tm[2]);
    if (/pm/i.test(tm[3] ?? "")) h += 12;
  }
  const iso = `2026-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+04:00`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function format(ms: number): string {
  if (ms <= 0) return "Kicking off";
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  const secs = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${mins}m ${secs}s`;
}

export function KickoffCard({
  fixtures,
  predictionsByPair,
}: {
  fixtures: Fixture[];
  predictionsByPair: PredictionsByPair;
}) {
  const next = fixtures.find((f) => !isFinished(f));
  const [now, setNow] = useState<number | null>(null);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!next) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <div className="font-display text-lg font-bold">Tournament complete</div>
        <div className="text-sm text-muted-foreground">Thanks for playing! 🏆</div>
      </div>
    );
  }

  const target = parseFixtureDate(next.date, next.time);
  const countdown = now !== null && target ? format(target.getTime() - now) : null;
  const preds = predictionsForFixture(predictionsByPair, next.home, next.away);
  const finished = isFinished(next);
  const resultH = finished ? next.homeScore : null;
  const resultA = finished ? next.awayScore : null;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-secondary/40 to-card p-5 text-center">
      <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
        {countdown ? "Next kickoff" : "Up next"}
      </div>
      <div className="my-1.5 font-mono text-3xl font-bold tabular-nums md:text-4xl">
        {countdown ?? `${next.date}`}
      </div>
      <div className="flex items-center justify-center gap-2 text-base font-semibold">
        <Flag team={next.home} className="h-4 w-6" />
        <span className="truncate">{next.home}</span>
        <span className="text-xs text-muted-foreground">vs</span>
        <span className="truncate">{next.away}</span>
        <Flag team={next.away} className="h-4 w-6" />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {next.group} · {next.time} {TZ_LABEL}
      </div>

      {preds.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowPredictions((o) => !o)}
            aria-expanded={showPredictions}
            className="mx-auto mt-3 flex items-center justify-center gap-1 border-t border-border/60 pt-3 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPredictions ? "Hide" : "Show"} everyone&apos;s predictions ({preds.length})
            <ChevronDown
              className={cn(
                "size-3 transition-transform",
                showPredictions && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {showPredictions && (
            <div className="text-left">
              <MatchPredictions
                predictions={preds}
                resultH={resultH}
                resultA={resultA}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
