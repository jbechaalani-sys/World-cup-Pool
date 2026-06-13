import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { DataError, EmptyState } from "@/components/common/states";
import { FixturesView } from "@/components/fixtures/fixtures-view";
import { TZ_LABEL } from "@/lib/config";
import { getPredictionsByPair } from "@/lib/predictions";
import { getFixtures } from "@/lib/sheets";
import { groupByStage } from "@/lib/stages";

export const metadata: Metadata = { title: "Fixtures" };
export const revalidate = 60;

export default async function FixturesPage() {
  let view: ReactNode;
  try {
    const [fixtures, predictionsByPair] = await Promise.all([
      getFixtures("isr"),
      getPredictionsByPair().catch(() => ({})),
    ]);
    const groups = groupByStage(fixtures);
    view = groups.length ? (
      <FixturesView groups={groups} predictionsByPair={predictionsByPair} />
    ) : (
      <EmptyState
        title="No fixtures yet"
        description="The match list will appear here once it's published."
      />
    );
  } catch {
    view = <DataError what="fixtures" />;
  }

  return (
    <div>
      <PageTitle
        title="Fixtures"
        subtitle={`All times ${TZ_LABEL}`}
        icon={<CalendarDays className="size-5" aria-hidden />}
      />
      {view}
    </div>
  );
}
