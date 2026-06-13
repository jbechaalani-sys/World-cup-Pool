# WC26 Pool — FIFA World Cup 2026 Prediction League

A premium, mobile-first live web app for our 18-player World Cup 2026 prediction pool.
Built with **Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui**, deployed on **Vercel**.

## How it works

There is **no database**. The single source of truth is a **published Google Sheet**.
The organizer keeps editing scores/predictions in the spreadsheet exactly as before; the app
reads the published CSV tabs server-side, validates them with Zod, and renders them.

- **First paint / SEO / share image:** server components fetch the sheet with `revalidate: 60` (ISR).
- **Live updates:** the home leaderboard polls `/api/leaderboard` every 60s (cache-busted,
  `no-store`) so standings refresh without a reload, with ↑/↓ movement arrows since your last visit.

The sheet tabs and their gids live in [`lib/config.ts`](lib/config.ts). Column layout per tab is
mapped in [`lib/schemas.ts`](lib/schemas.ts); CSV is parsed by a small RFC-4180 parser in
[`lib/csv.ts`](lib/csv.ts) (handles quoted fields, embedded commas, `\r\n`).

## Pages

- `/` — live leaderboard, podium, countdown/next match, winner-pick tracker, prize fund
- `/fixtures` — all matches grouped by stage, with live/FT/upcoming + today markers
- `/players` — per-player cards linking to each player's prediction sheet
- `/stats` — accuracy leaderboard (Stats Score = Exact × 2 + Correct Winners)
- `/rules` — scoring, prizes and tie-breakers

## Features

- Live auto-refresh + rank-change arrows · "This is me" highlight (localStorage)
- Group-stage prize context · installable PWA · dynamic OG image showing the current leader
- Confetti + toast when you climb to #1

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must be clean)
```

## Notes for the organizer

- **Update scores/predictions in the Google Sheet** — the site updates within ~60 seconds.
- The **Group-Stage standings** currently use total points (correct during the group stage).
  To keep it exact once knockouts begin, add a dedicated "Group Stage Points" column to the
  sheet and point the board at it.
- The old static site is preserved under [`legacy/`](legacy/) for reference.
