"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MatchCard } from "./match-card";
import type { Fixture } from "@/lib/schemas";
import type { StageGroup } from "@/lib/stages";

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

export function FixturesView({ groups }: { groups: StageGroup[] }) {
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    const n = new Date();
    setTodayKey(`${n.getMonth() + 1}-${n.getDate()}`);
  }, []);

  const isToday = (f: Fixture) => todayKey !== null && dateKey(f.date) === todayKey;

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
                <MatchCard key={keyFor(f)} fixture={f} today={isToday(f)} />
              ))}
            </div>
          </section>
        ))}
      </TabsContent>

      {groups.map((g) => (
        <TabsContent key={g.stage.key} value={g.stage.key} className="space-y-2">
          {g.fixtures.map((f) => (
            <MatchCard key={keyFor(f)} fixture={f} today={isToday(f)} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
