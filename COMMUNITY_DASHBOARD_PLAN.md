# Community Commerce Dashboard — Implementation Plan

**Author:** Atlas (Lead Architect)
**Date:** 2026-03-04
**Status:** APPROVED — Ready for implementation
**Target:** Freedom Player Hub (Next.js 16 / React 19 / Tailwind v4 / Neon PostgreSQL)

---

## 1. Product Overview

A **private analytics dashboard** for Freedom World merchants/communities. Each community logs in and sees only their own commerce, engagement, and growth data — giving them technology leverage they can't get elsewhere.

**Key differentiator:** Unified commerce + social + quest data in one view. Shopify sees purchases. Circle sees engagement. Freedom sees both — a member who bought 3 times, liked 40 posts, and completed 12 quests.

### URL Structure
```
/dashboard/[communityId]                → Command Center (home)
/dashboard/[communityId]/commerce       → Commerce & Revenue
/dashboard/[communityId]/members        → Community & Members
/dashboard/[communityId]/customers      → Customer Intelligence
/dashboard/[communityId]/quests         → Quests & Rewards
```

### Auth Model (Phase 1)
Community ID from URL param. No auth gate in Phase 1 — communities access via direct link. Auth can be layered on later via middleware.

---

## 2. Database Schema Reference

All data lives in **Neon PostgreSQL**. Community isolation is achieved by filtering on `community_id`, `org_id`, `merchant_name`, or `entity_id` depending on the table.

### 2.1 Community Identity Mapping

A community can appear under different identifiers across tables. We need a resolver.

| Table | Community Key | Example (Raja Ferry) | Example (The Scape) |
|-------|--------------|---------------------|---------------------|
| `fdp_payment_completed` | `org_id`, `merchant_name` | org_id=`?`, merchant_name=`Raja Ferry` | org_id=`423155`, merchant_name=`The Scape` |
| `item_purchased` | `community_id`, `original_shop_id` | — | community_id=`711`, shop_id=`711` |
| `token_purchased` | `community_id` | community_id=`39` | — |
| `community_joined` | `community_id` | community_id=`39` | community_id=`711` |
| `social_post_created` | `community_id` | — | — |
| `social_comment_created` | — (no community_id) | — | — |
| `social_reaction_created` | `community_id` | — | — |
| `quest_completed` | `entity_id` | — | — |
| `quest_reward_claimed` | `entity_id` | — | — |
| `nft_ticket_validated` | `community_id` | — | community_id=`1085` |
| `fdw_signed_up` | `entity_id` | — | — |

**Solution:** Create a `community_config` mapping (JSON or DB table) that maps a `communityId` to all its identifiers across tables. For Sprint 1, use a static lookup. For later, build an admin UI.

### 2.2 Tables & Row Counts (as of 2026-03-04)

| Schema | Table | Rows | Key Fields |
|--------|-------|------|------------|
| `server_side_http_api_prod` | `fdp_payment_completed` | 4,236 | merchant_name, org_id, org_name, user_id, payment_amount, currency, payment_method, product_category_code, timestamp |
| `server_side_http_api_prod` | `item_purchased` | 1,676 | original_shop_id, original_shop_name, community_id, user_id, merchandise_name, merchandise_category, merchandise_id, total_payment, total_quantity, unit_price, currency, order_id, merchandise (JSON array), timestamp |
| `server_side_http_api_prod` | `token_purchased` | 1,169 | community_id, community_name, user_id, token_name, token_amount, topup_amount, payment_channel, topup_type, product, timestamp |
| `server_side_http_api_prod` | `community_joined` | 43,737 | community_id, community_name, user_id, join_type, timestamp |
| `server_side_http_api_prod` | `social_post_created` | 3,172 | community_id, community_name, user_id, post_id, text, files, community_category, timestamp |
| `server_side_http_api_prod` | `social_comment_created` | 9,264 | user_id, comment_text, reference_type, reference_id, target_id, target_type, timestamp |
| `server_side_http_api_prod` | `social_reaction_created` | 17,162 | community_id, community_name, user_id, reaction_type, react_to, target_id, timestamp |
| `server_side_http_api_prod` | `social_follow_created` | 1,604 | user_id, followed_user_id, timestamp |
| `server_side_http_api_prod` | `social_post_approved` | 307 | community_id, community_name, user_id, post_id, text, timestamp |
| `server_side_http_api_prod` | `social_post_deleted` | 137 | community_id, community_name, user_id, post_id, timestamp |
| `server_side_http_api_prod` | `nft_ticket_validated` | 25 | community_id, community_name, user_id, product_name, product_id, validator_id, validation_code, contract_address, timestamp |
| `server_side_http_api_prod` | `fdw_signed_up` | 8,954 | entity_id, user_id, fdw_email, timestamp |
| `server_side_http_api_prod` | `fdw_signed_in` | 9,291 | entity_id, user_id, timestamp |
| `questlabs_server_side_http_api_prod` | `quest_completed` | 91,828 | entity_id, quest_id, user_id, name, rewards (JSON), timestamp |
| `questlabs_server_side_http_api_prod` | `quest_reward_claimed` | 11,270 | entity_id, quest_id, user_id, name, rewards (JSON), is_frequency, timestamp |

### 2.3 Known Communities (Top 20 by member count)

| Community | ID | Members | Has Commerce | Has Social | Has Quests |
|-----------|----|---------|-------------|------------|------------|
| Freedom | 35 | 8,954 | ✅ (FDS/USD) | ✅ | ✅ |
| The Scape | 711 | 6,014 | ✅ (FDM) | ✅ | ✅ |
| Freedom Fashion X | 212 | 4,307 | ❌ | ❌ | ❌ |
| Freedom Fashion | 82 | 4,286 | ❌ | ❌ | ❌ |
| Freedom Run | 113 | 4,044 | ❌ | ✅ | ❌ |
| The Scape - Thailand | 1573 | 3,873 | ❌ | ✅ | ❌ |
| Freedom World - Thailand | 1577 | 3,439 | ❌ | ✅ | ❌ |
| Bitazza Thailand | 118 | 3,305 | ❌ | ✅ | ❌ |
| Discover Thailand | 409 | 729 | ❌ | ❌ | ❌ |
| Roon Khanom Khai | 1085 | 453 | ✅ (THB/ROON) | ❌ | ❌ |
| Freedom Planets | 177 | 360 | ✅ (FDM) | ✅ | ❌ |
| Raja Ferry | 39 | 33 | ✅ (THB/RAJA) | ❌ | ❌ |

---

## 3. File Structure

```
app/
  dashboard/
    [communityId]/
      layout.tsx              ← Dashboard layout with sidebar nav (Sprint 1)
      page.tsx                ← Command Center / Home (Sprint 2)
      commerce/
        page.tsx              ← Commerce & Revenue (Sprint 3)
      members/
        page.tsx              ← Community & Members (Sprint 4)
      customers/
        page.tsx              ← Customer Intelligence (Sprint 5)
      quests/
        page.tsx              ← Quests & Rewards (Sprint 6)
  api/
    dashboard/
      [communityId]/
        overview/route.ts     ← KPI summary endpoint (Sprint 2)
        commerce/route.ts     ← Commerce data endpoint (Sprint 3)
        members/route.ts      ← Members data endpoint (Sprint 4)
        customers/route.ts    ← Customer intelligence endpoint (Sprint 5)
        quests/route.ts       ← Quest data endpoint (Sprint 6)

components/
  dashboard/
    DashboardSidebar.tsx      ← Dashboard-specific nav sidebar (Sprint 1)
    KPICard.tsx               ← KPI card with sparkline + delta (Sprint 1)
    ChartCard.tsx             ← Wrapper for chart sections (Sprint 1)
    DateRangeFilter.tsx       ← Date range picker (Sprint 1)
    RevenueChart.tsx          ← Revenue over time line chart (Sprint 3)
    PaymentMethodPie.tsx      ← Payment method breakdown (Sprint 3)
    TopProductsBar.tsx        ← Top products horizontal bar (Sprint 3)
    MemberGrowthChart.tsx     ← Member growth curve (Sprint 4)
    SocialHeatmap.tsx         ← Weekly engagement heatmap (Sprint 4)
    BuyerSegments.tsx         ← Buyer cohort donut/table (Sprint 5)
    ActivityHeatmap.tsx       ← Day/hour heatmap (Sprint 5)
    QuestCompletionChart.tsx  ← Quest completions over time (Sprint 6)
    RewardBreakdown.tsx       ← Reward types claimed (Sprint 6)

lib/
  queries/
    dashboard.ts              ← All dashboard query functions (Sprint 1+)
  community-config.ts         ← Community identity resolver (Sprint 1)
```

---

## 4. Sprint Breakdown

Each sprint is scoped to be completable by a coding agent within a single context window (~60-80K tokens). Each sprint has clear inputs, outputs, and a test command.

---

### Sprint 1 — Foundation: Layout, Navigation, Community Resolver
**Estimated files:** 6 new, 1 modified
**Estimated lines:** ~400

#### Objective
Create the dashboard layout, sidebar navigation, community identity resolver, and shared UI components (KPICard, ChartCard, DateRangeFilter).

#### Files to Create

**1. `lib/community-config.ts`**
```typescript
// Static community configuration mapping
// Maps communityId to all its identifiers across tables
export type CommunityConfig = {
  id: string;                      // communityId (URL param)
  name: string;                    // Display name
  merchantNames: string[];         // For fdp_payment_completed
  orgIds: string[];                // For fdp_payment_completed
  shopIds: string[];               // For item_purchased
  communityIds: string[];          // For community_joined, social tables, token_purchased
  entityIds: string[];             // For quest tables, sign-up/sign-in
  currencies: string[];            // Known currencies (THB, FDM, RAJA, etc.)
  hasCommerce: boolean;
  hasSocial: boolean;
  hasQuests: boolean;
  hasNFT: boolean;
};

// Build from DB query later; hardcode the top communities for now
export const COMMUNITIES: Record<string, CommunityConfig> = {
  '711': {
    id: '711',
    name: 'The Scape',
    merchantNames: ['The Scape'],
    orgIds: ['423155'],
    shopIds: ['711'],
    communityIds: ['711', '1573'],  // The Scape + The Scape - Thailand
    entityIds: ['e-15f9fa5f-2169-41ab-a4a0-5909df4cb994'],
    currencies: ['FDM'],
    hasCommerce: true,
    hasSocial: true,
    hasQuests: true,
    hasNFT: false,
  },
  '39': {
    id: '39',
    name: 'Raja Ferry',
    merchantNames: ['Raja Ferry'],
    orgIds: [],
    shopIds: [],
    communityIds: ['39'],
    entityIds: [],
    currencies: ['THB', 'RAJA'],
    hasCommerce: true,
    hasSocial: false,
    hasQuests: false,
    hasNFT: false,
  },
  '35': {
    id: '35',
    name: 'Freedom',
    merchantNames: ['Freedom'],
    orgIds: [],
    shopIds: ['35'],
    communityIds: ['35', '1577'],  // Freedom + Freedom World - Thailand
    entityIds: ['e-a0bc4913-3ba1-4424-9e35-7968386e645b'],
    currencies: ['FDS', 'USD'],
    hasCommerce: true,
    hasSocial: true,
    hasQuests: true,
    hasNFT: false,
  },
  '177': {
    id: '177',
    name: 'Freedom Planets',
    merchantNames: ['Freedom Planets'],
    orgIds: [],
    shopIds: ['177'],
    communityIds: ['177'],
    entityIds: [],
    currencies: ['FDM'],
    hasCommerce: true,
    hasSocial: true,
    hasQuests: false,
    hasNFT: false,
  },
  '1085': {
    id: '1085',
    name: 'Roon Khanom Khai',
    merchantNames: ['Roon Khanom Khai'],
    orgIds: [],
    shopIds: ['1085'],
    communityIds: ['1085'],
    entityIds: [],
    currencies: ['THB', 'ROON'],
    hasCommerce: true,
    hasSocial: false,
    hasQuests: false,
    hasNFT: true,
  },
  '118': {
    id: '118',
    name: 'Bitazza Thailand',
    merchantNames: [],
    orgIds: [],
    shopIds: [],
    communityIds: ['118'],
    entityIds: [],
    currencies: [],
    hasCommerce: false,
    hasSocial: true,
    hasQuests: false,
    hasNFT: false,
  },
};

export function getCommunityConfig(communityId: string): CommunityConfig | null {
  return COMMUNITIES[communityId] || null;
}

export function getAllCommunities(): CommunityConfig[] {
  return Object.values(COMMUNITIES);
}
```

**2. `components/dashboard/KPICard.tsx`**
- Display: value, label, delta % vs prior period, sparkline (mini line chart)
- Props: `{ label, value, previousValue?, format?: 'number'|'currency'|'percent', color?, icon?, sparkData?: number[] }`
- Delta: green up arrow if positive, red down if negative, gray if no prior data
- Sparkline: use simple SVG polyline (no external lib)
- Style: dark card matching existing design system (`bg-[#0D1215]`, border `#1E2529`)

**3. `components/dashboard/ChartCard.tsx`**
- Wrapper component for chart sections
- Props: `{ title, subtitle?, children, className? }`
- Dark card with title bar, consistent padding, matching design system

**4. `components/dashboard/DateRangeFilter.tsx`**
- Client component with preset buttons: 7d, 30d, 90d, All Time
- Updates URL search params (`?range=7d`)
- Returns `{ startDate, endDate }` for queries
- Style: matches existing TimeFilter component pattern

**5. `components/dashboard/DashboardSidebar.tsx`**
- Client component
- Shows community name + logo placeholder at top
- Nav links: Home, Commerce, Members, Customers, Quests
- Each link conditionally shown based on `CommunityConfig.hasCommerce`, etc.
- Active state highlighting
- Mobile responsive (hamburger menu)
- Back link to main Player Hub

**6. `app/dashboard/[communityId]/layout.tsx`**
- Server component
- Reads `communityId` from params
- Loads `CommunityConfig` — returns 404 if not found
- Renders `DashboardSidebar` + `{children}`
- Sets page metadata with community name

#### Files to Modify

**7. `components/Sidebar.tsx`**
- Add "Community Dashboard" link in main sidebar nav (under Leaderboards)

#### Validation
```bash
npm run build  # Should compile with no errors
# Visit /dashboard/711 — should show layout with sidebar
# Visit /dashboard/999 — should show 404
```

---

### Sprint 2 — Command Center (Home Page)
**Estimated files:** 3 new, 1 modified
**Estimated lines:** ~500

#### Objective
Build the main dashboard home page with KPI cards and overview charts.

#### Dependencies
Sprint 1 must be complete.

#### Files to Create

**1. `lib/queries/dashboard.ts`** (initial version — overview queries only)

Query functions needed for the Command Center. All accept `communityConfig: CommunityConfig` and `dateRange: { start: Date; end: Date }`.

```typescript
// Revenue KPIs
export async function getRevenueOverview(config, range, priorRange)
// Returns: { revenue, txns, aov, uniqueBuyers } for current + prior period

// Member KPIs
export async function getMemberOverview(config, range, priorRange)
// Returns: { totalMembers, newMembers, newMembersPrior }

// Engagement KPIs (if hasSocial)
export async function getEngagementOverview(config, range)
// Returns: { posts, comments, reactions, activeMembers }

// Quest KPIs (if hasQuests)
export async function getQuestOverview(config, range)
// Returns: { questsCompleted, uniqueQuesters, rewardsClaimed }

// Revenue sparkline (daily for last 30d)
export async function getRevenueSpark(config, days = 30)
// Returns: Array<{ date: string, revenue: number }>

// Member growth sparkline
export async function getMemberGrowthSpark(config, days = 30)
// Returns: Array<{ date: string, joins: number }>
```

**Query patterns:**
- Use `rawQuery()` from `lib/db.ts`
- Filter by `merchant_name IN (...)` for commerce tables
- Filter by `community_id IN (...)` for social/member tables
- Filter by `entity_id IN (...)` for quest tables
- Always parameterize community IDs (SQL injection safe)
- Handle empty config arrays gracefully (return zeros)

**2. `app/api/dashboard/[communityId]/overview/route.ts`**
- GET endpoint
- Accepts `?range=7d|30d|90d|all`
- Loads community config, runs all overview queries in parallel
- Returns JSON with all KPI data + sparklines

**3. `app/dashboard/[communityId]/page.tsx`**
- Server component that fetches initial data
- Renders client component `CommandCenter` with:
  - Row of KPI cards (4-6 depending on community capabilities)
  - Revenue sparkline chart (if hasCommerce)
  - Member growth sparkline (always shown)
  - Quick stats summary
- DateRangeFilter at top
- KPIs shown:
  - **Always:** Total Members, New Members (with delta)
  - **If hasCommerce:** Revenue, Transactions, AOV, Unique Buyers
  - **If hasSocial:** Active Members (posted/reacted), Posts Created
  - **If hasQuests:** Quests Completed, Unique Questers

#### Layout Grid
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Revenue    │  Transactions│  New Members│  Active     │
│  ▲ +12.3%   │  ▲ +8.1%    │  ▲ +15.2%  │  Members    │
│  ~~~spark~~ │  ~~~spark~~ │  ~~~spark~~ │  ~~~spark~~ │
├─────────────┴─────────────┼─────────────┴─────────────┤
│  Revenue Over Time (30d)  │  Member Growth (30d)      │
│  [Line Chart]             │  [Area Chart]             │
└───────────────────────────┴───────────────────────────┘
```

#### Validation
```bash
npm run build
# Visit /dashboard/711 — should show KPIs for The Scape
# Visit /dashboard/39 — should show KPIs for Raja Ferry (no social/quest cards)
# Toggle date range — KPIs should update
```

---

### Sprint 3 — Commerce & Revenue Page
**Estimated files:** 5 new, 1 modified
**Estimated lines:** ~600

#### Objective
Build the full commerce analytics page with revenue trends, payment breakdowns, and product performance.

#### Dependencies
Sprint 2 must be complete (uses `lib/queries/dashboard.ts` which gets extended).

#### Files to Create

**1. `components/dashboard/RevenueChart.tsx`**
- Recharts `AreaChart` or `LineChart`
- Daily/weekly/monthly granularity toggle
- Multi-currency support (separate lines per currency)
- Tooltip with formatted values
- Props: `{ data: Array<{date, revenue, currency}>, granularity }`

**2. `components/dashboard/PaymentMethodPie.tsx`**
- Recharts `PieChart` or `RadialBarChart`
- Shows breakdown: FDM, THB, RAJA, etc. or by payment_method (kbank, scb, promptpay)
- Toggle between "by currency" and "by payment channel"
- Legend with percentages

**3. `components/dashboard/TopProductsBar.tsx`**
- Recharts horizontal `BarChart`
- Top 10 products by orders or revenue (toggle)
- Shows product name, category badge, bar
- Click for drill-down (future)

**4. `app/dashboard/[communityId]/commerce/page.tsx`**
- Server component, fetches initial commerce data
- Sections:
  1. Revenue KPIs row (revenue, txns, AOV, unique buyers — reuse KPICard)
  2. Revenue Over Time chart (full width)
  3. Two-column: Payment Method Breakdown | Product Categories
  4. Top Selling Products table/chart
  5. Items Sold volume chart
- Only accessible if `config.hasCommerce` — redirect otherwise

**5. `app/api/dashboard/[communityId]/commerce/route.ts`**
- GET endpoint with `?range=30d&granularity=daily`
- Returns: revenueTimeSeries, paymentMethodBreakdown, productCategoryBreakdown, topProducts, itemsSoldTimeSeries

#### Queries to Add to `lib/queries/dashboard.ts`

```typescript
// Revenue time series
export async function getRevenueTimeSeries(config, range, granularity: 'daily'|'weekly'|'monthly')
// Query: SELECT DATE_TRUNC(granularity, timestamp), SUM(payment_amount), currency, COUNT(*)
// FROM fdp_payment_completed WHERE merchant_name IN (...) AND timestamp BETWEEN ...

// Payment method breakdown
export async function getPaymentMethodBreakdown(config, range)
// Query: SELECT payment_method, COUNT(*), SUM(payment_amount)
// FROM fdp_payment_completed WHERE merchant_name IN (...)

// Product category breakdown
export async function getProductCategoryBreakdown(config, range)
// Query: SELECT product_category_code, COUNT(*), SUM(payment_amount)
// FROM fdp_payment_completed WHERE ...

// Top products
export async function getTopProducts(config, range, limit = 15)
// Query: SELECT merchandise_name, merchandise_category, COUNT(*), SUM(total_quantity::int), AVG(unit_price::numeric)
// FROM item_purchased WHERE original_shop_id IN (...)

// Token purchase breakdown (for communities with tokens)
export async function getTokenPurchases(config, range)
// Query: SELECT payment_channel, COUNT(*), SUM(token_amount), AVG(topup_amount)
// FROM token_purchased WHERE community_id IN (...)
```

#### Validation
```bash
npm run build
# /dashboard/711/commerce — The Scape: booster packs, potions, FDM payments
# /dashboard/39/commerce — Raja Ferry: THB/RAJA revenue, mobile banking channels
# /dashboard/118/commerce — Should redirect (Bitazza has no commerce)
```

---

### Sprint 4 — Community & Members Page
**Estimated files:** 4 new, 1 modified
**Estimated lines:** ~500

#### Objective
Build member growth analytics and social engagement visualizations.

#### Dependencies
Sprint 2 must be complete.

#### Files to Create

**1. `components/dashboard/MemberGrowthChart.tsx`**
- Dual chart: cumulative members (area) + net new per period (bar)
- Recharts `ComposedChart` with `Area` + `Bar`
- Shows join_type breakdown (freedom_pay vs manual)

**2. `components/dashboard/SocialHeatmap.tsx`**
- Weekly engagement grid (7 days × N weeks)
- Color intensity = total social actions (posts + comments + reactions)
- Similar to GitHub contribution graph
- Built with SVG/divs (no external heatmap lib)

**3. `app/dashboard/[communityId]/members/page.tsx`**
- Sections:
  1. Member KPIs: Total Members, New (30d), Growth Rate %, Active Members
  2. Member Growth Over Time (full width chart)
  3. Join Type Breakdown (pie: freedom_pay vs manual)
  4. Social Engagement Summary (if hasSocial):
     - Posts, Comments, Reactions counts
     - Weekly engagement heatmap
     - Top content contributors (table: user_id, posts, reactions received)
  5. Follow Growth (if hasSocial)

**4. `app/api/dashboard/[communityId]/members/route.ts`**

#### Queries to Add

```typescript
// Member growth time series
export async function getMemberGrowthTimeSeries(config, range, granularity)
// Query: SELECT DATE_TRUNC(...), join_type, COUNT(*)
// FROM community_joined WHERE community_id IN (...)

// Cumulative member count
export async function getCumulativeMembers(config)
// Query: SELECT DATE_TRUNC('month', timestamp), COUNT(*), SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', timestamp))
// FROM community_joined WHERE community_id IN (...)

// Social engagement summary
export async function getSocialEngagement(config, range)
// Queries posts, comments, reactions counts per period
// UNION across social_post_created, social_comment_created, social_reaction_created

// Social activity by day (for heatmap)
export async function getSocialActivityByDay(config, weeks = 12)
// Query: SELECT DATE(timestamp), COUNT(*) FROM (
//   SELECT timestamp FROM social_post_created WHERE community_id IN (...)
//   UNION ALL SELECT timestamp FROM social_reaction_created WHERE community_id IN (...)
// ) GROUP BY DATE(timestamp)

// Top contributors
export async function getTopContributors(config, range, limit = 20)
// Query: posts + reactions per user
```

#### Validation
```bash
npm run build
# /dashboard/711/members — The Scape: 6K+ members, growth chart
# /dashboard/118/members — Bitazza: 3.3K members + rich social data
# /dashboard/39/members — Raja Ferry: 33 members, minimal social
```

---

### Sprint 5 — Customer Intelligence Page
**Estimated files:** 4 new, 1 modified
**Estimated lines:** ~550

#### Objective
Build customer segmentation, repeat buyer analysis, and behavioral heatmaps.

#### Dependencies
Sprint 3 must be complete (needs commerce data patterns).

#### Files to Create

**1. `components/dashboard/BuyerSegments.tsx`**
- Horizontal stacked bar or donut chart
- Segments: 1-time, 2-3x, 4-10x, Power (10x+)
- Shows: count of buyers, avg spend per segment, % of total revenue
- Click segment to see user list (future)

**2. `components/dashboard/ActivityHeatmap.tsx`**
- Two visualizations:
  a. Day-of-week bar chart (Mon-Sun)
  b. Hour-of-day curve (0-23)
- Shows transaction volume by time
- Helps merchants know when their community is most active

**3. `app/dashboard/[communityId]/customers/page.tsx`**
- Only accessible if `config.hasCommerce`
- Sections:
  1. Customer KPIs: Unique Buyers, Repeat Rate %, Avg LTV, Top Buyer Spend
  2. Buyer Segmentation chart + table
  3. Repeat Purchase Metrics:
     - % of buyers with 2+ purchases
     - Avg time between purchases
  4. Activity Heatmap: Day-of-week + Hour-of-day
  5. Revenue Concentration: Top 10% of buyers = X% of revenue

**4. `app/api/dashboard/[communityId]/customers/route.ts`**

#### Queries to Add

```typescript
// Buyer segments
export async function getBuyerSegments(config, range)
// Query:
// SELECT segment, COUNT(*) as buyers, AVG(total_spend) as avg_spend, SUM(total_spend) as segment_revenue
// FROM (
//   SELECT user_id, COUNT(*) as orders, SUM(payment_amount) as total_spend,
//     CASE WHEN COUNT(*) = 1 THEN '1-time'
//          WHEN COUNT(*) <= 3 THEN '2-3x'
//          WHEN COUNT(*) <= 10 THEN '4-10x'
//          ELSE 'Power 10x+' END as segment
//   FROM fdp_payment_completed WHERE merchant_name IN (...) AND timestamp BETWEEN ...
//   GROUP BY user_id
// ) GROUP BY segment

// Day of week distribution
export async function getDayOfWeekActivity(config, range)
// Query: SELECT EXTRACT(DOW FROM timestamp), COUNT(*)
// FROM fdp_payment_completed WHERE merchant_name IN (...)

// Hour of day distribution
export async function getHourOfDayActivity(config, range)
// Query: SELECT EXTRACT(HOUR FROM timestamp), COUNT(*)
// FROM fdp_payment_completed WHERE merchant_name IN (...)

// Revenue concentration
export async function getRevenueConcentration(config, range)
// Query: Per-user revenue, sorted desc, compute cumulative %

// Repeat purchase metrics
export async function getRepeatPurchaseMetrics(config, range)
// Query: Users with 2+ orders, avg days between orders
```

#### Validation
```bash
npm run build
# /dashboard/39/customers — Raja Ferry: 84 buyers, strong repeat (43 power buyers!)
# /dashboard/711/customers — The Scape: 111 buyers
# /dashboard/118/customers — Should redirect (no commerce)
```

---

### Sprint 6 — Quests & Rewards Page
**Estimated files:** 4 new, 1 modified
**Estimated lines:** ~450

#### Objective
Build quest completion analytics and reward tracking.

#### Dependencies
Sprint 2 must be complete.

#### Files to Create

**1. `components/dashboard/QuestCompletionChart.tsx`**
- Line chart: quest completions over time
- Dual axis: completions count + unique users
- Recharts `ComposedChart`

**2. `components/dashboard/RewardBreakdown.tsx`**
- Parse `rewards` JSON from quest tables
- Show breakdown by reward type: FDS, custom items, XP
- Bar chart of top quest names by completion count
- Table: quest name, completions, unique users, avg rewards

**3. `app/dashboard/[communityId]/quests/page.tsx`**
- Only accessible if `config.hasQuests`
- Sections:
  1. Quest KPIs: Total Completions, Unique Questers, Rewards Claimed, Avg Completions/User
  2. Quest Completions Over Time (line chart)
  3. Top Quests by Completions (bar chart + table)
  4. Reward Types Breakdown (pie/bar)
  5. NFT Ticket Validations (if hasNFT — table with product, user, validator, date)

**4. `app/api/dashboard/[communityId]/quests/route.ts`**

#### Queries to Add

```typescript
// Quest completion time series
export async function getQuestCompletionTimeSeries(config, range, granularity)
// Query: SELECT DATE_TRUNC(...), COUNT(*), COUNT(DISTINCT user_id)
// FROM quest_completed WHERE entity_id IN (...)

// Top quests
export async function getTopQuests(config, range, limit = 15)
// Query: SELECT name, COUNT(*), COUNT(DISTINCT user_id)
// FROM quest_completed WHERE entity_id IN (...) GROUP BY name

// Reward breakdown (requires JSON parsing)
export async function getRewardBreakdown(config, range)
// Query: SELECT rewards FROM quest_reward_claimed WHERE entity_id IN (...)
// Parse JSON in application layer, aggregate by rewardType

// NFT ticket validations
export async function getNFTValidations(config, range)
// Query: SELECT * FROM nft_ticket_validated WHERE community_id IN (...)
// ORDER BY timestamp DESC
```

#### Validation
```bash
npm run build
# /dashboard/711/quests — The Scape: quest completions + rewards
# /dashboard/35/quests — Freedom: 77K+ quest completions
# /dashboard/39/quests — Should redirect (Raja Ferry has no quests)
```

---

## 5. Design System

### Shared with Player Hub
- Background: `#0A0E10` (--bg-page)
- Card background: `#0D1215` (--bg-card)
- Border: `#1E2529`
- Primary accent: `#00FF88`
- Text primary: `#FFFFFF`
- Text secondary: `#B8C5D0`
- Text muted: `#7A8A99`
- Font: Inter

### Dashboard-Specific Additions
- **Revenue green:** `#10B981` (emerald)
- **Revenue red (decline):** `#EF4444`
- **Chart colors palette:** `['#00FF88', '#3B82F6', '#A78BFA', '#F59E0B', '#EC4899', '#14B8A6']`
- **Heatmap scale:** `#1A1A2E` (empty) → `#00FF88` (max)
- **KPI delta up:** `#10B981` with `▲`
- **KPI delta down:** `#EF4444` with `▼`

### Chart Library
- **Recharts** (already installed: `recharts@^3.7.0`)
- Consistent dark theme: `fill: '#0D1215'`, grid: `'#1E2529'`, text: `'#7A8A99'`
- No Plotly needed (Recharts covers all chart types)

---

## 6. Cross-Sprint Dependencies

```
Sprint 1 (Foundation) ──────────────────────────────┐
    │                                                │
    ├── Sprint 2 (Command Center) ───────────────────┤
    │       │                                        │
    │       ├── Sprint 3 (Commerce) ──── Sprint 5 ───┤
    │       │                         (Customers)    │
    │       ├── Sprint 4 (Members) ──────────────────┤
    │       │                                        │
    │       └── Sprint 6 (Quests) ───────────────────┘
    │
    └── Can be built independently: Sprint 3, 4, 6
        Sprint 5 depends on Sprint 3 patterns
```

**Parallelizable after Sprint 2:** Sprints 3, 4, and 6 can run in parallel.
Sprint 5 should run after Sprint 3 (reuses commerce query patterns).

---

## 7. Agent Instructions Template

Each sprint should be given to the agent with this context:

```
CONTEXT:
- Working directory: /path/to/freedom-player-hub
- Read these files first: lib/db.ts, lib/community-config.ts, package.json, app/globals.css
- Tech: Next.js 16, React 19, Tailwind v4, Recharts 3, Neon PostgreSQL
- DB connection: lib/db.ts exports { sql, db, rawQuery }
- Existing pattern: see components/StatCard.tsx for card styling
- Existing pattern: see app/leaderboards/page.tsx for server component + data fetching
- Design: dark theme, colors in CSS vars (see globals.css :root)

SPRINT TASK:
[paste sprint description]

CONSTRAINTS:
- Use rawQuery() for all SQL (not drizzle ORM for dashboard queries)
- All queries MUST filter by community identifiers from CommunityConfig
- Handle empty arrays in config (e.g., community with no commerce data)
- Server components for pages, client components for interactive charts
- Do NOT modify existing files outside the dashboard/ directory (except Sidebar.tsx in Sprint 1)
- Use Recharts for all charts (already installed)
- Match existing design system colors
- Export query functions from lib/queries/dashboard.ts
- Do NOT run npm install — all deps are already available
```

---

## 8. Testing Strategy

### Per-Sprint
- `npm run build` must pass (type-check + compilation)
- Manual smoke test: visit dashboard for 2-3 different communities
- Verify community isolation: Raja Ferry should NOT see The Scape data

### End-to-End
- Visit `/dashboard/711` (The Scape) — all 5 pages work, commerce/social/quests visible
- Visit `/dashboard/39` (Raja Ferry) — commerce + customers visible, social/quests hidden
- Visit `/dashboard/118` (Bitazza) — only members page visible (social only)
- Visit `/dashboard/999` — 404 page
- Date range filter changes data on all pages

---

## 9. Future Enhancements (Post-MVP)

- [ ] Authentication layer (community admins only)
- [ ] CSV/PDF export of dashboard data
- [ ] Custom date range picker (calendar)
- [ ] Email digest: weekly stats summary sent to community admin
- [ ] Comparison mode: compare this month vs last month side by side
- [ ] Alerts: notify when revenue drops >20%, or member growth spikes
- [ ] Admin panel to add new communities to `community-config.ts`
- [ ] Real-time WebSocket updates for live transaction feed
- [ ] Cohort retention curves (Month 1 buyers → Month 2 return rate)
- [ ] Member overlap analysis (users who belong to multiple communities)
