"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LastUpdated } from "@/components/common/last-updated";
import { MeControl } from "@/components/me/me-control";
import { useMe } from "@/components/me/me-provider";
import { POLL_MS, PRIZES } from "@/lib/config";
import { readStore, saveSnapshot } from "@/lib/me-storage";
import { movement } from "@/lib/rank-delta";
import { positionMap, type RankedPlayer } from "@/lib/ranking";
import { LeaderboardRow } from "./leaderboard-row";
import { Podium } from "./podium";

async function fireConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.3 },
      colors: ["#F5C518", "#2DD4BF", "#FFFFFF"],
    });
  } catch {
    /* non-fatal */
  }
}

interface LiveResponse {
  asOf: number;
  players: RankedPlayer[];
}

export function LeaderboardLive({
  initialPlayers,
  initialAsOf,
}: {
  initialPlayers: RankedPlayer[];
  initialAsOf: number;
}) {
  const { me } = useMe();
  const [players, setPlayers] = useState(initialPlayers);
  const [asOf, setAsOf] = useState(initialAsOf);
  const [mounted, setMounted] = useState(false);
  const baselineRef = useRef<Record<string, number> | null>(null);
  const meRef = useRef(me);
  meRef.current = me;

  useEffect(() => {
    const store = readStore();
    baselineRef.current = store.lastSeen?.ranks ?? null;
    setMounted(true);
    saveSnapshot(positionMap(initialPlayers), Date.now());

    let prevMyPos =
      baselineRef.current && meRef.current
        ? baselineRef.current[meRef.current]
        : undefined;

    const poll = async () => {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as LiveResponse;
        setPlayers(data.players);
        setAsOf(data.asOf);
        saveSnapshot(positionMap(data.players), Date.now());

        const myName = meRef.current;
        const my = myName ? data.players.find((p) => p.name === myName) : undefined;
        if (my && prevMyPos !== undefined && my.position < prevMyPos) {
          if (my.position === 1) {
            void fireConfetti();
            toast.success("🏆 You've taken the top spot!");
          } else {
            toast.success(`📈 You climbed to #${my.position}`);
          }
        }
        if (my) prevMyPos = my.position;
      } catch {
        /* keep last good data on screen */
      }
    };

    void poll();
    const id = setInterval(() => {
      if (!document.hidden) void poll();
    }, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) void poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const names = players.map((p) => p.name);
  const leader = players[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-2 py-1 font-bold uppercase tracking-wide text-teal">
            <span className="size-1.5 animate-pulse rounded-full bg-teal" /> Live
          </span>
          <LastUpdated asOf={asOf} />
        </div>
        <MeControl names={names} autoPrompt />
      </div>

      <Podium players={players} me={me} />

      {leader && (
        <div className="rounded-2xl border border-bronze/30 bg-bronze/5 p-3 text-sm">
          <span className="font-bold text-bronze">
            🏅 Group-Stage prize ({PRIZES.groupStage} {PRIZES.currency}):
          </span>{" "}
          <span className="font-medium">{leader.name}</span> leads the race.{" "}
          <span className="text-muted-foreground">
            Knockout-qualification points are excluded from this prize.
          </span>
        </div>
      )}

      <ol className="space-y-2">
        {players.map((p) => (
          <LeaderboardRow
            key={p.name}
            position={p.position}
            name={p.name}
            points={p.points}
            movement={movement(p.name, p.position, baselineRef.current)}
            isMe={me === p.name}
            showMovement={mounted}
          />
        ))}
      </ol>
    </div>
  );
}
