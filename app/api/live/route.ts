import { NextResponse } from "next/server";
import { fetchTodayLive, liveScoresEnabled } from "@/lib/live-scores";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!liveScoresEnabled()) {
    return NextResponse.json(
      { enabled: false, matches: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  // Today's date in Dubai time, matching the sheet's fixture dates.
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
  }).format(new Date());

  const matches = await fetchTodayLive(date);
  return NextResponse.json(
    { enabled: true, matches },
    { headers: { "Cache-Control": "no-store" } },
  );
}
