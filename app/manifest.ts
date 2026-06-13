import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WC26 Pool — World Cup 2026 Prediction League",
    short_name: "WC26 Pool",
    description:
      "Live leaderboard, fixtures and stats for our World Cup 2026 prediction pool.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0e1a",
    theme_color: "#0a0e1a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
