import { NextResponse } from "next/server";
import { rankPlayers } from "@/lib/ranking";
import { getPlayers } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const players = rankPlayers(await getPlayers("live"));
    return NextResponse.json(
      { asOf: Date.now(), players },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "fetch_failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
