import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { DataError, EmptyState } from "@/components/common/states";
import { PlayersGrid } from "@/components/player/players-grid";
import { rankPlayers } from "@/lib/ranking";
import { getLinks, getPlayers } from "@/lib/sheets";

export const metadata: Metadata = { title: "Players" };
export const revalidate = 60;

export default async function PlayersPage() {
  const [playersRes, linksRes] = await Promise.allSettled([
    getPlayers("isr"),
    getLinks("isr"),
  ]);

  if (playersRes.status === "rejected") {
    return (
      <div>
        <PageTitle title="Players" icon={<Users className="size-5" aria-hidden />} />
        <DataError what="players" />
      </div>
    );
  }

  const ranked = rankPlayers(playersRes.value);
  const links =
    linksRes.status === "fulfilled" ? Object.fromEntries(linksRes.value) : {};

  return (
    <div>
      <PageTitle title="Players" icon={<Users className="size-5" aria-hidden />} />
      {ranked.length ? (
        <PlayersGrid players={ranked} links={links} />
      ) : (
        <EmptyState title="No players yet" description="Players will appear here once added." />
      )}
    </div>
  );
}
