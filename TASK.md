# Frontend Rewrite Task

## Goal
Rewrite the Freedom Player Hub frontend to match the design templates in `ux-pilot-html/`. The current components are basic gray cards with emoji icons. The templates show a polished RPG-style dark theme with sidebar nav, glow effects, Plotly radar charts, rarity color system, and proper visual hierarchy.

## Reference Templates (in `ux-pilot-html/`)
1. `01-hero-header.html` — Player profile hero section with avatar, level badge, XP progress, combat rating circle, dashboard grid with stat cards and radar chart
2. `04-combat-record.html` — Full combat record with sidebar nav, win/loss/abandon breakdown, match history table, performance charts
3. `05-nexus.html` — Nexus performance stats, nexus-specific win rates and charts
4. `06-build-identity.html` — Character build identity (DPS/Tank/Healer role), dominant role display, stat breakdown
5. `07-equipment.html` — Equipment loadout with rarity-colored cards, slot-based grid layout, item details
6. `08-materials-nfts.html` — Materials inventory grid with quantities, NFT collection display

## Design System (already in globals.css)
- Page bg: #0A0E10, Card bg: #0D1215, Inner: #1A1A1A
- Border: #1E2529, Border hover: #2A2A2A
- Primary (neon green): #00FF88, Primary hover: #00FFB8
- Text: white/#B8C5D0/#7A8A99
- Rarity colors: epic=#9D4EDD, rare=#3B82F6, gold=#FFD700
- Stat colors: might=#FF6B6B, spirit=#A78BFA, vitality=#00FF88
- Font: Inter
- Glow effects, neon shadows already defined in CSS

## Architecture
- Next.js 16 with App Router (NOT pages router)
- `app/player/[fdvId]/page.tsx` — the player profile page (server component)
- `lib/queries/player.ts` — all DB queries (already working, don't change)
- `lib/db.ts` + `lib/schema.ts` — Drizzle ORM setup (don't change)
- `components/` — React components
- Tailwind CSS v4 (via `@import "tailwindcss"` in globals.css)

## What to Do
1. Study ALL 6 HTML templates carefully — understand the layout, spacing, colors, hover effects, glow effects
2. Rewrite `app/player/[fdvId]/page.tsx` to match the hero header template layout (01)
3. Create/update components to match the template sections:
   - Hero header with avatar, level badge, combat rating circle
   - Combat record section (from 04)
   - Nexus stats section (from 05) 
   - Build identity / dominant role (from 06)
   - Equipment loadout with rarity colors (from 07)
   - Materials & NFTs grid (from 08)
4. Update `components/Navigation.tsx` to use sidebar nav style from templates (desktop sidebar + mobile hamburger)
5. Use Font Awesome icons (already loaded via CDN in layout) instead of emoji
6. Add Plotly.js for the radar chart (replace current Recharts implementation)
7. Ensure all hover effects, glow effects, transitions match the templates

## Critical Rules
- DO NOT modify `lib/queries/player.ts`, `lib/db.ts`, or `lib/schema.ts` — the data layer works
- DO NOT change the data fetching logic in the page — only change the JSX/rendering
- Keep all existing query function calls — just make the UI match the templates
- The page is a Server Component — client interactivity needs 'use client' in separate components
- Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base` — already configured correctly
- Make sure `npm run build` passes when done

## Font Awesome
Add to layout.tsx head if not already present:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

## Plotly.js
For the radar chart, add via CDN in layout or use `plotly.js-dist-min` npm package. The radar chart shows: Might, Vitality, Spirit, Precision, Lethality, Nexus percentiles.
