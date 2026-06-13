import { Trophy } from "lucide-react";
import { PrizeCards } from "@/components/common/prize-cards";
import { DataError, EmptyState } from "@/components/common/states";
import { KickoffCard } from "@/components/leaderboard/kickoff-card";
import { LeaderboardLive } from "@/components/leaderboard/leaderboard-live";
import { WinnerPickTracker } from "@/components/leaderboard/winner-pick-tracker";
import { rankPlayers } from "@/lib/ranking";
import { getFixtures, getPlayers } from "@/lib/sheets";

export const revalidate = 60;

export default async function Home() {
  const [playersRes, fixturesRes] = await Promise.allSettled([
    getPlayers("isr"),
    getFixtures("isr"),
  ]);

  const players =
    playersRes.status === "fulfilled" ? rankPlayers(playersRes.value) : [];
  const fixtures = fixturesRes.status === "fulfilled" ? fixturesRes.value : [];
  const failed = playersRes.status === "rejected";

  return (
    <div className="space-y-6">
      {fixtures.length > 0 && <KickoffCard fixtures={fixtures} />}

      {failed ? (
        <DataError what="the leaderboard" />
      ) : players.length === 0 ? (
        <EmptyState
          icon={<Trophy className="size-6" aria-hidden />}
          title="Standings unlock at kickoff"
          description="Once results start coming in, the live leaderboard appears here."
        />
      ) : (
        <>
          <LeaderboardLive initialPlayers={players} initialAsOf={Date.now()} />
          <WinnerPickTracker players={players} />
          <PrizeCards />
        </>
      )}
    </div>
  );
}
