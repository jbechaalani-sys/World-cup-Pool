import type { Metadata } from "next";
import { ChartColumn } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { DataError, EmptyState } from "@/components/common/states";
import { StatsBoard } from "@/components/stats/stats-board";
import { getStats } from "@/lib/sheets";

export const metadata: Metadata = { title: "Stats" };
export const revalidate = 60;

export default async function StatsPage() {
  let body;
  try {
    const rows = await getStats("isr");
    body = rows.length ? (
      <StatsBoard rows={rows} />
    ) : (
      <EmptyState title="No stats yet" description="Stats populate as results come in." />
    );
  } catch {
    body = <DataError what="stats" />;
  }

  return (
    <div>
      <PageTitle
        title="Stats"
        subtitle="Prediction accuracy leaderboard"
        icon={<ChartColumn className="size-5" aria-hidden />}
      />
      {body}
    </div>
  );
}
