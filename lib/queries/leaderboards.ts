import { db, sql as neonSql, rawQuery } from '../db';
import { gameMatchResulted, gameMatchStarted, users, planetStructureBuilt } from '../schema';
import { sql, desc, and, gte, count, sum, max } from 'drizzle-orm';

export type TimeFilter = 'all-time' | 'month' | 'week' | 'today';

function getTimeCondition(filter: TimeFilter, timestampCol: typeof gameMatchResulted.timestamp | typeof gameMatchStarted.timestamp | typeof planetStructureBuilt.timestamp) {
  const now = new Date();
  switch (filter) {
    case 'today':
      return gte(timestampCol, new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    case 'week':
      return gte(timestampCol, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    case 'month':
      return gte(timestampCol, new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()));
    default:
      return undefined;
  }
}

function timeFilterSQL(filter: TimeFilter, prefix: string = 'WHERE'): string {
  if (filter === 'all-time') return '';
  const clause = filter === 'today' ? `timestamp >= CURRENT_DATE` :
    filter === 'week' ? `timestamp >= CURRENT_DATE - INTERVAL '7 days'` :
    `timestamp >= CURRENT_DATE - INTERVAL '1 month'`;
  return prefix === 'AND' ? `AND ${clause}` : `WHERE ${clause}`;
}

export async function getTopPlayersByXP(timeFilter: TimeFilter = 'all-time') {
  const tc = getTimeCondition(timeFilter, gameMatchStarted.timestamp);
  return db
    .select({
      fdv_id: users.fdv_id,
      avatar_name: users.avatar_name,
      total_xp: max(gameMatchStarted.player_total_xp).as('total_xp'),
      max_level: max(gameMatchStarted.player_level).as('max_level'),
    })
    .from(gameMatchStarted)
    .innerJoin(users, sql`${users.fdv_id} = ${gameMatchStarted.player_fdv_id}`)
    .where(tc)
    .groupBy(users.fdv_id, users.avatar_name)
    .orderBy(desc(sql`max(${gameMatchStarted.player_total_xp})`))
    .limit(50);
}

export async function getTopPlayersByKills(timeFilter: TimeFilter = 'all-time') {
  const tc = getTimeCondition(timeFilter, gameMatchResulted.timestamp);
  return db
    .select({
      fdv_id: users.fdv_id,
      avatar_name: users.avatar_name,
      total_kills: sum(gameMatchResulted.monster_killed_total).as('total_kills'),
      max_level: max(gameMatchResulted.player_level).as('max_level'),
    })
    .from(gameMatchResulted)
    .innerJoin(users, sql`${users.fdv_id} = ${gameMatchResulted.player_fdv_id}`)
    .where(tc)
    .groupBy(users.fdv_id, users.avatar_name)
    .orderBy(desc(sql`sum(${gameMatchResulted.monster_killed_total})`))
    .limit(50);
}

export async function getTopPlayersByWins(timeFilter: TimeFilter = 'all-time') {
  const tc = getTimeCondition(timeFilter, gameMatchResulted.timestamp);
  const where = tc
    ? and(sql`${gameMatchResulted.match_result} = 'Win'`, tc)
    : sql`${gameMatchResulted.match_result} = 'Win'`;

  return db
    .select({
      fdv_id: users.fdv_id,
      avatar_name: users.avatar_name,
      total_wins: count().as('total_wins'),
      max_level: max(gameMatchResulted.player_level).as('max_level'),
    })
    .from(gameMatchResulted)
    .innerJoin(users, sql`${users.fdv_id} = ${gameMatchResulted.player_fdv_id}`)
    .where(where)
    .groupBy(users.fdv_id, users.avatar_name)
    .orderBy(desc(sql`count(*)`))
    .limit(50);
}

export async function getTopPlayersByWinRate(timeFilter: TimeFilter = 'all-time', minMatches: number = 50) {
  const tf = timeFilterSQL(timeFilter, 'AND');
  const rows = await rawQuery(
    `SELECT 
      u.fdv_id,
      u.avatar_name,
      COUNT(*)::int as total_matches,
      COUNT(*) FILTER (WHERE gmr.match_result = 'Win')::int as wins,
      ROUND((COUNT(*) FILTER (WHERE gmr.match_result = 'Win')::numeric / COUNT(*)::numeric * 100), 1) as win_rate,
      MAX(gmr.player_level)::int as max_level
    FROM web_card_game_prod.game_match_resulted gmr
    INNER JOIN web_card_game_prod.users u ON u.fdv_id = gmr.player_fdv_id
    WHERE 1=1 ${tf}
    GROUP BY u.fdv_id, u.avatar_name
    HAVING COUNT(*) >= ${minMatches}
    ORDER BY win_rate DESC
    LIMIT 50`
  );
  return rows as Array<{ fdv_id: number; avatar_name: string; total_matches: number; wins: number; win_rate: number; max_level: number }>;
}

export async function getTopPlayersByMaterials(timeFilter: TimeFilter = 'all-time') {
  const tf = timeFilterSQL(timeFilter, 'WHERE');
  const rows = await rawQuery(
    `SELECT 
      u.fdv_id, u.avatar_name,
      (COALESCE(SUM(gmr.received_materials_fds::numeric),0) + COALESCE(SUM(gmr.received_materials_vsa),0) +
       COALESCE(SUM(gmr.received_materials_admt),0) + COALESCE(SUM(gmr.received_materials_aths),0) +
       COALESCE(SUM(gmr.received_materials_biog),0) + COALESCE(SUM(gmr.received_materials_bstr),0) +
       COALESCE(SUM(gmr.received_materials_crm),0) + COALESCE(SUM(gmr.received_materials_drs),0) +
       COALESCE(SUM(gmr.received_materials_ncc),0) + COALESCE(SUM(gmr.received_materials_nrfm),0) +
       COALESCE(SUM(gmr.received_materials_obs),0) + COALESCE(SUM(gmr.received_materials_pmf),0) +
       COALESCE(SUM(gmr.received_materials_qtpc),0))::numeric as total_materials,
      MAX(gmr.player_level)::int as max_level
    FROM web_card_game_prod.game_match_resulted gmr
    INNER JOIN web_card_game_prod.users u ON u.fdv_id = gmr.player_fdv_id
    ${tf}
    GROUP BY u.fdv_id, u.avatar_name
    ORDER BY total_materials DESC
    LIMIT 50`
  );
  return rows as Array<{ fdv_id: number; avatar_name: string; total_materials: number; max_level: number }>;
}

export async function getMostActivePlayers(timeFilter: TimeFilter = 'all-time') {
  const tc = getTimeCondition(timeFilter, gameMatchStarted.timestamp);
  return db
    .select({
      fdv_id: users.fdv_id,
      avatar_name: users.avatar_name,
      total_matches: count().as('total_matches'),
      max_level: max(gameMatchStarted.player_level).as('max_level'),
    })
    .from(gameMatchStarted)
    .innerJoin(users, sql`${users.fdv_id} = ${gameMatchStarted.player_fdv_id}`)
    .where(tc)
    .groupBy(users.fdv_id, users.avatar_name)
    .orderBy(desc(sql`count(*)`))
    .limit(50);
}

export async function getTopEmpireBuilders(timeFilter: TimeFilter = 'all-time') {
  const tf = timeFilterSQL(timeFilter, 'WHERE');
  const rows = await rawQuery(
    `SELECT fdv_user_id, COUNT(*)::int as total_structures
     FROM web_freedom_planet_prod.planet_structure_built ${tf}
     GROUP BY fdv_user_id ORDER BY total_structures DESC LIMIT 50`
  );
  return rows as Array<{ fdv_user_id: number; total_structures: number }>;
}

export async function getTopPlanetLords(timeFilter: TimeFilter = 'all-time') {
  const tf = timeFilterSQL(timeFilter, 'WHERE');
  const rows = await rawQuery(
    `SELECT fdv_user_id, COUNT(DISTINCT planet_id)::int as planet_count
     FROM web_freedom_planet_prod.planet_activated ${tf}
     GROUP BY fdv_user_id ORDER BY planet_count DESC LIMIT 50`
  );
  return rows as Array<{ fdv_user_id: number; planet_count: number }>;
}

export async function getTopEarners(timeFilter: TimeFilter = 'all-time') {
  const tf = timeFilterSQL(timeFilter, 'WHERE');
  const rows = await rawQuery(
    `SELECT fdv_user_id, SUM(claimed_amount::numeric)::numeric as total_fds
     FROM web_freedom_planet_prod.planet_reward_claimed ${tf}
     GROUP BY fdv_user_id ORDER BY total_fds DESC LIMIT 50`
  );
  return rows as Array<{ fdv_user_id: number; total_fds: number }>;
}

export async function getGlobalStats() {
  const rows = await neonSql`
    SELECT
      (SELECT COUNT(DISTINCT fdv_id) FROM web_card_game_prod.users)::int as total_players,
      (SELECT COUNT(*) FROM web_card_game_prod.game_match_resulted)::int as total_matches,
      (SELECT COUNT(DISTINCT fdv_user_id) FROM web_freedom_planet_prod.planet_activated)::int as total_planet_users,
      (SELECT COUNT(*) FROM web_freedom_planet_prod.planet_activated)::int as total_planets
  `;
  return rows[0] as { total_players: number; total_matches: number; total_planet_users: number; total_planets: number };
}
