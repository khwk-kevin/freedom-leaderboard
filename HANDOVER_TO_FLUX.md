# Freedom Data Service — Handover Brief
**From:** Atlas (Lead Architect, atlas container)
**To:** Flux (Freedom Data Service Lead, freedom-squad container)
**Date:** 2026-03-04
**Authorized by:** Kevin (Founder/CEO)

---

## 1. What This Handover Covers

Kevin has appointed Flux as **product lead** for the Freedom Data Service project. This document transfers full ownership of:

1. **The Freedom Player Hub** — live Next.js analytics app on Replit
2. **The Community Commerce Dashboard** — planned 6-sprint implementation (approved, ready to build)
3. **All DB schemas, query patterns, and data discoveries** made during the research phase
4. **Context on all data sources** — what exists, what's connected, what's missing

This is a full handover. Atlas steps back to advisory-only. Flux owns execution.

---

## 2. What's Live Right Now

### 2.1 Freedom Player Hub
- **Repo:** `https://github.com/khwk-kevin/freedom-leaderboard`
- **Live URL:** `https://43cad451-8343-4737-bc9d-62152fb682a7-00-1mw5gzpdqi5hu.pike.replit.dev`
- **Stack:** Next.js 16 / React 19 / Tailwind v4 / Neon PostgreSQL / Recharts / Drizzle ORM
- **Local workspace:** `/clawd/freedom-player-hub/` (atlas container — see §4 for access)
- **Deployment:** Replit, SSH access via key at `/clawd/atlas/.ssh/id_ed25519`

**Live pages:**
| Route | Status | Description |
|-------|--------|-------------|
| `/` | ✅ Live | Player Hub home — search players by FDV ID |
| `/player/[fdvId]` | ✅ Live | Player profile — XP, level, match history, loadout |
| `/leaderboards` | ✅ Live | Game leaderboards (kills, XP, wins, materials, etc.) |
| `/leaderboards/planets` | ✅ Live | Planet leaderboard — Population/FDS toggle, top 5 hero cards |

### 2.2 Codebase Structure
```
/clawd/freedom-player-hub/
├── app/
│   ├── layout.tsx               ← Root layout + Sidebar
│   ├── page.tsx                 ← Player search home
│   ├── leaderboards/page.tsx    ← Game leaderboards
│   ├── leaderboards/planets/    ← Planet leaderboard
│   └── api/                     ← API routes (avatar, search, planet leaderboard)
├── components/
│   ├── Sidebar.tsx              ← Main navigation
│   ├── StatCard.tsx             ← KPI card (reuse for dashboard)
│   ├── TimeFilter.tsx           ← Date range filter (reuse for dashboard)
│   ├── LeaderboardTable.tsx     ← Podium + rank rows
│   ├── Planet*.tsx              ← Planet leaderboard components
│   └── ...                      ← Player profile components
├── lib/
│   ├── db.ts                    ← Neon DB connection (exports: sql, db, rawQuery)
│   ├── schema.ts                ← Drizzle schema for game + planet tables
│   └── queries/
│       ├── leaderboards.ts      ← Game leaderboard queries
│       ├── planet-leaderboards.ts  ← Planet leaderboard queries
│       └── player.ts            ← Player profile queries
├── COMMUNITY_DASHBOARD_PLAN.md  ← ⭐ Full implementation plan (read this first)
└── HANDOVER_TO_FLUX.md          ← This document
```

---

## 3. The Next Build: Community Commerce Dashboard

### What It Is
A **private analytics dashboard** for Freedom World merchants/communities. Each community gets their own view of their commerce, engagement, and quest data — completely isolated from other communities.

### Why It Matters
We have data that Shopify, Circle.so, and Mighty Networks each have in isolation — we have it all unified. A single community can see: how much revenue they made, how many members they added, how many social posts were created, and how many quests were completed — all in one place, filtered for just their community.

### The Full Plan
**Read this first:** `/clawd/freedom-player-hub/COMMUNITY_DASHBOARD_PLAN.md`

It contains:
- Full DB schema reference (all tables, row counts, column names, sample data)
- Community identity mapping (how the same community appears across different tables)
- 6-sprint breakdown with exact file specs and query templates
- Agent instruction template for spawning coding agents
- Design system specs

### Sprint Summary
| Sprint | What Gets Built | Parallelizable? |
|--------|----------------|-----------------|
| 1 — Foundation | Layout, sidebar, community config, KPICard, ChartCard, DateRangeFilter | ❌ First |
| 2 — Command Center | Home page with KPI cards + sparklines | ❌ After Sprint 1 |
| 3 — Commerce | Revenue charts, payment breakdown, top products | ✅ After Sprint 2 |
| 4 — Members | Member growth, social engagement heatmap | ✅ After Sprint 2 |
| 5 — Customer Intelligence | Buyer segments, repeat analysis, activity heatmap | ⚠️ After Sprint 3 |
| 6 — Quests | Quest completions, reward breakdown, NFT tickets | ✅ After Sprint 2 |

---

## 4. Database Access

### Primary DB (Neon PostgreSQL)
The `.env.local` with the connection string is in the Replit workspace. Access via:
```bash
ssh -i /clawd/atlas/.ssh/id_ed25519 -p 22 \
  43cad451-8343-4737-bc9d-62152fb682a7@43cad451-8343-4737-bc9d-62152fb682a7-00-1mw5gzpdqi5hu.pike.replit.dev
# Then: cat /home/runner/workspace/.env.local
```

### Available Schemas
| Schema | What's In It | Row Count |
|--------|-------------|-----------|
| `web_card_game_prod` | Game matches, users, XP, kills | ~100K |
| `web_freedom_planet_prod` | Planet activations, structures, rewards | ~12K |
| `server_side_http_api_prod` | Payments, tokens, community joins, social, sign-ups | ~100K |
| `questlabs_server_side_http_api_prod` | Quest completions, reward claims | ~103K |
| `public` | planets table (empty), leaderboard_snapshots (empty) | 0 |

### Key Tables for the Dashboard
```sql
-- Commerce
server_side_http_api_prod.fdp_payment_completed   -- 4,236 rows, has merchant_name, org_id
server_side_http_api_prod.item_purchased           -- 1,676 rows, has shop_id, merchandise JSON
server_side_http_api_prod.token_purchased          -- 1,169 rows, payment channels by community

-- Community
server_side_http_api_prod.community_joined         -- 43,737 rows, member acquisition
server_side_http_api_prod.social_post_created      -- 3,172 rows
server_side_http_api_prod.social_comment_created   -- 9,264 rows
server_side_http_api_prod.social_reaction_created  -- 17,162 rows
server_side_http_api_prod.social_follow_created    -- 1,604 rows
server_side_http_api_prod.nft_ticket_validated     -- 25 rows

-- Quests
questlabs_server_side_http_api_prod.quest_completed      -- 91,828 rows
questlabs_server_side_http_api_prod.quest_reward_claimed -- 11,270 rows

-- Auth
server_side_http_api_prod.fdw_signed_up    -- 8,954 rows
server_side_http_api_prod.fdw_signed_in    -- 9,291 rows
```

### Community Identity Mapping (Critical)
Each community appears under different field names in different tables:
- `fdp_payment_completed` → filter by `merchant_name` (e.g., `'Raja Ferry'`) or `org_id`
- `item_purchased` → filter by `original_shop_id` (e.g., `'711'`)
- `token_purchased` → filter by `community_id` (e.g., `'39'`)
- `community_joined`, `social_*` → filter by `community_id`
- `quest_completed`, `quest_reward_claimed` → filter by `entity_id` (UUID format)

The `lib/community-config.ts` file (to be created in Sprint 1) resolves all these for each community.

### Known Communities with Rich Data
| Community | ID | Highlights |
|-----------|----|-----------|
| **Raja Ferry** | 39 | Highest revenue: 1.79M THB + 1.78M RAJA tokens. 84 buyers, 43 are power buyers (10x+). SCB/KBank/PromptPay channels. |
| **The Scape** | 711 | 6,014 members. Commerce (FDM), social activity, quests. Top products: Booster Packs, Potions. |
| **Freedom** | 35 | 8,954 members. Most diverse — FDS + USD revenue, 77K+ quest completions. |
| **Roon Khanom Khai** | 1085 | NFT ticket validation (physical food products). THB + ROON token economy. |
| **Bitazza Thailand** | 118 | 3,305 members. Social-only (no commerce) — excellent engagement data. |
| **Freedom Planets** | 177 | 380 members. Planet-themed commerce (FDM). |

---

## 5. Replit SSH Access

```bash
# SSH to Replit (from atlas container or any machine with the key)
ssh -o StrictHostKeyChecking=no \
    -i /clawd/atlas/.ssh/id_ed25519 \
    -p 22 \
    43cad451-8343-4737-bc9d-62152fb682a7@43cad451-8343-4737-bc9d-62152fb682a7-00-1mw5gzpdqi5hu.pike.replit.dev

# Build and start
cd /home/runner/workspace
npm run build && npm run start

# The app runs on port 3000
# Replit exposes it via their public URL above
```

**The SSH key** is at `/clawd/atlas/.ssh/id_ed25519` in the atlas container. Flux will need this key copied to her workspace or Kevin to authorize a new key in Replit.

---

## 6. GitHub Repo

- **URL:** `https://github.com/khwk-kevin/freedom-leaderboard`
- **Default branch:** `main`
- **Pattern:** Push from local → SSH to Replit → `git pull origin main` → `npm run build`
- **Recent commits:**
  - `0da2f09` — Community dashboard implementation plan
  - `312395b` — Planet leaderboard (live)
  - `8ab3a71` — Initial Player Hub

---

## 7. What Flux Needs to Know About Flux's Existing Work

Flux's workspace (`/clawd/freedom-data-service/`) already has:
- **Architecture spec** (`ARCHITECTURE.md`) — the data pipeline vision
- **Sync collectors** (`src/collectors/`) — planet data sync from Freedom World API
- **DB schema** (`src/db/schema.ts`) — `freedom_planets`, `freedom_seasons`, `freedom_leaderboard_snapshots`
- **Leaderboard frontend** (`leaderboard/`) — separate Next.js app already started

**Important distinction for Flux:**
- The `freedom-data-service` leaderboard is about **Freedom World's API data** (planet populations from the game's own API, synced hourly via Cognito auth)
- The Player Hub leaderboard/dashboard is about **Freedom World's analytics events** (Segment/RudderStack events in Neon — what users did in the app)

These are complementary, not competing. The Player Hub reads event data; Flux's pipeline reads the game's live state data. **Both feed into the community dashboard vision.**

---

## 8. Open Blockers Flux Inherits

| # | Blocker | Impact | Owner |
|---|---------|--------|-------|
| B-001 | Freedom World API global planets endpoint not confirmed (Kunny) | Blocks Flux's sync pipeline | Kevin → Kunny |
| B-002 | Cognito token pattern for service-to-service not designed | Blocks sync auth | Atlas advisory |
| B-003 | Replit SSH key authorization for Flux | Blocks Flux from deploying directly | Kevin → Replit |
| B-004 | Community auth model for dashboard (Phase 1 = URL param) | Dashboard currently unprotected | Flux decision |

---

## 9. Immediate Next Actions for Flux

**Week 1 — Orient**
- [ ] Read `COMMUNITY_DASHBOARD_PLAN.md` in full
- [ ] SSH into Replit and browse the live codebase (`ls /home/runner/workspace`)
- [ ] Run the test queries in `merchant-check2.mjs` and `community-deep.mjs` (already on Replit) to see the data first-hand
- [ ] Review existing components (`StatCard`, `TimeFilter`, `Sidebar`) — these get reused in the dashboard

**Week 1 — Sprint 1 kickoff**
- [ ] Spawn a coding agent for Sprint 1 (Foundation) using the agent instruction template in `COMMUNITY_DASHBOARD_PLAN.md §7`
- [ ] Start with community_config for The Scape (711) and Raja Ferry (39) — richest data

**Week 2 — Parallel build**
- [ ] Sprint 2 (Command Center) starts after Sprint 1 passes `npm run build`
- [ ] Sprints 3 + 4 + 6 can run in parallel after Sprint 2

---

## 10. Atlas's Advisory Role Post-Handover

Atlas remains available for:
- Schema review before any DB migrations
- API contract review (if new consumers added)
- Architecture decisions (extraction to standalone service, new data sources)
- Cross-product dependency coordination

Atlas does **not** own implementation decisions going forward. That's Flux.

---

## 11. Key Contacts

| Person/Agent | Role | Channel |
|-------------|------|---------|
| Kevin | Founder/CEO, final authority | Telegram |
| Atlas | Architecture advisory | atlas container, #engineering |
| Wanda | Frontend consumer of leaderboard APIs | freedom-squad container |
| Nova | Timeline/task coordination | freedom-squad container |
| Friday | Implementation execution partner | freedom-squad container |
| Kunny | Freedom World API team (external) | Kevin as relay |

---

*This document is the single source of truth for the handover. All referenced files are committed to the GitHub repo and available in `/clawd/freedom-player-hub/`.*
