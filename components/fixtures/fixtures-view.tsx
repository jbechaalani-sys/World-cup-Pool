"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MatchCard, type LiveOverlay } from "./match-card";
import type { Fixture } from "@/lib/schemas";
import type { LiveMatch } from "@/lib/live-scores";
import {
  predictionsForFixture,
  type PredictionsByPair,
} from "@/lib/predictions-core";
import type { StageGroup } from "@/lib/stages";
import { matchKey } from "@/lib/team-name";

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function dateKey(date: string): string | null {
  const m = date.trim().match(/(\d{1,2})\s*[-\s]\s*([A-Za-z]{3})/);
  if (!m) return null;
  const day = Number(m[1]);
  const mon = MONTHS[m[2].toLowerCase()];
  if (!mon) return null;
  return `${mon}-${day}`;
}

function keyFor(f: Fixture): string {
  return `${f.matchNo}-${f.home}-${f.away}`;
}

export function FixturesView({
  groups,
  predictionsByPair,
}: {
  groups: StageGroup[];
  predictionsByPair: PredictionsByPair;
}) {
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [live, setLive] = useState<Record<string, LiveOverlay>>({});

  useEffect(() => {
    const n = new Date();
    setTodayKey(`${n.getMonth() + 1}-${n.getDate()}`);
  }, []);

  // Live-score overlay (API-Football). No-ops unless a key is configured.
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setInterval> | undefined;
    const pull = async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        if (!res.ok || !active) return;
        const data = (await res.json()) as {
          enabled: boolean;
          matches: LiveMatch[];
        };
        if (!data.enabled) {
          if (timer) clearInterval(timer);
          return;
        }
        const map: Record<string, LiveOverlay> = {};
        for (const m of data.matches) {
          if (m.inProgress) {
            map[matchKey(m.home, m.away)] = {
              homeGoals: m.homeGoals,
              awayGoals: m.awayGoals,
              elapsed: m.elapsed,
            };
          }
        }
        setLive(map);
      } catch {
        /* keep last overlay */
      }
    };
    void pull();
    timer = setInterval(() => {
      if (!document.hidden) void pull();
    }, 120_000);
    const onVisible = () => {
      if (!document.hidden) void pull();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const isToday = (f: Fixture) => todayKey !== null && dateKey(f.date) === todayKey;
  const liveFor = (f: Fixture) => live[matchKey(f.home, f.away)];
  const predsFor = (f: Fixture) =>
    predictionsForFixture(predictionsByPair, f.home, f.away);

  const tabs = useMemo(
    () => [
      { key: "all", label: "All" },
      ...groups.map((g) => ({ key: g.stage.key, label: g.stage.short })),
    ],
    [groups],
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <TabsList className="mb-4 w-max">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsContent value="all" className="space-y-6">
        {groups.map((g) => (
          <section key={g.stage.key}>
            <h2 className="sticky top-14 z-10 -mx-1 mb-2 bg-background/85 px-1 py-1 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground backdrop-blur">
              {g.stage.label}
            </h2>
            <div className="space-y-2">
              {g.fixtures.map((f) => (
                <MatchCard
                  key={keyFor(f)}
                  fixture={f}
                  today={isToday(f)}
                  live={liveFor(f)}
                  predictions={predsFor(f)}
                />
              ))}
            </div>
          </section>
        ))}
      </TabsContent>

      {groups.map((g) => (
        <TabsContent key={g.stage.key} value={g.stage.key} className="space-y-2">
          {g.fixtures.map((f) => (
            <MatchCard
              key={keyFor(f)}
              fixture={f}
              today={isToday(f)}
              live={liveFor(f)}
              predictions={predsFor(f)}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
