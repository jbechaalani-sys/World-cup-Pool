"use client";

import { useMe } from "@/components/me/me-provider";
import { MeControl } from "@/components/me/me-control";
import { PlayerCard } from "./player-card";
import type { RankedPlayer } from "@/lib/ranking";

export function PlayersGrid({
  players,
  links,
}: {
  players: RankedPlayer[];
  links: Record<string, string>;
}) {
  const { me } = useMe();
  const names = players.map((p) => p.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{players.length} players</p>
        <MeControl names={names} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((p) => (
          <PlayerCard
            key={p.name}
            player={p}
            link={links[p.name]}
            isMe={me === p.name}
          />
        ))}
      </div>
    </div>
  );
}
