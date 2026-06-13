import { ImageResponse } from "next/og";
import { rankPlayers } from "@/lib/ranking";
import { getPlayers } from "@/lib/sheets";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FIFA World Cup 2026 Prediction League";

export default async function OpengraphImage() {
  let leader: { name: string; points: number } | null = null;
  let count = 0;
  try {
    const players = rankPlayers(await getPlayers("isr"));
    count = players.length;
    if (players[0]) leader = { name: players[0].name, points: players[0].points };
  } catch {
    /* fall back to generic card */
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0a0e1a",
          color: "#f4f6fb",
          padding: 80,
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#f5c518",
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          🏆 WC26 POOL
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 30, color: "#8a97b1" }}>
            FIFA World Cup 2026 · Prediction League
          </div>
          {leader ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, color: "#8a97b1", marginTop: 18 }}>
                Current leader
              </div>
              <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
                {leader.name}
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#f5c518" }}>
                {`${leader.points} PTS`}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 72, fontWeight: 800 }}>Live Leaderboard</div>
          )}
        </div>

        <div style={{ fontSize: 26, color: "#8a97b1" }}>
          {`${count ? `${count} players · ` : ""}104 matches · 1800 AED on the line`}
        </div>
      </div>
    ),
    { ...size },
  );
}
