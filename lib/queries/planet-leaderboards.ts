import { rawQuery } from '../db';

export type TimeFilter = 'all-time' | 'month' | 'week' | 'today';

function timeFilterSQL(filter: TimeFilter, col: string = 'timestamp', prefix: string = 'WHERE'): string {
  if (filter === 'all-time') return '';
  const clause = filter === 'today' ? `${col} >= CURRENT_DATE` :
    filter === 'week' ? `${col} >= CURRENT_DATE - INTERVAL '7 days'` :
    `${col} >= CURRENT_DATE - INTERVAL '1 month'`;
  return prefix === 'AND' ? `AND ${clause}` : `WHERE ${clause}`;
}

export type PlanetStructureEntry = {
  planet_id: string;
  planet_name: string;
  fdv_user_id: number;
  owner_name: string | null;
  total_structure: number;
  total_food_structure: number;
  total_industrial_structure: number;
  last_updated: string;
};

export type FDSEarnerEntry = {
  fdv_user_id: number;
  owner_name: string | null;
  top_planet_id: string | null;
  top_planet_name: string | null;
  total_fds: number;
  claims: number;
  planet_count: number;
};

/** Top planets ranked by total structures built (Population mode) */
export async function getTopPlanetsByStructures(timeFilter: TimeFilter = 'all-time'): Promise<PlanetStructureEntry[]> {
  const tf = timeFilterSQL(timeFilter, 'psb.timestamp', 'WHERE');
  const rows = await rawQuery(`
    WITH ranked AS (
      SELECT DISTINCT ON (psb.planet_id)
        psb.planet_id,
        psb.planet_name,
        psb.fdv_user_id::int as fdv_user_id,
        psb.total_structure::int as total_structure,
        COALESCE(psb.total_food_structure, 0)::int as total_food_structure,
        COALESCE(psb.total_industrial_structure, 0)::int as total_industrial_structure,
        psb.timestamp as last_updated
      FROM web_freedom_planet_prod.planet_structure_built psb
      ${tf}
      ORDER BY psb.planet_id, psb.timestamp DESC
    )
    SELECT r.*, u.avatar_name as owner_name
    FROM ranked r
    LEFT JOIN web_card_game_prod.users u ON u.id = r.fdv_user_id::text
    ORDER BY r.total_structure DESC
    LIMIT 100
  `);
  return rows as PlanetStructureEntry[];
}

/** Top users ranked by FDS earned (FDS mode) */
export async function getTopUsersByFDS(timeFilter: TimeFilter = 'all-time'): Promise<FDSEarnerEntry[]> {
  const tf = timeFilterSQL(timeFilter);
  const rows = await rawQuery(`
    SELECT 
      prc.fdv_user_id::int,
      u.avatar_name as owner_name,
      SUM(prc.claimed_amount::numeric)::numeric as total_fds,
      COUNT(*)::int as claims,
      COALESCE((
        SELECT COUNT(DISTINCT pa.planet_id)::int 
        FROM web_freedom_planet_prod.planet_activated pa 
        WHERE pa.fdv_user_id = prc.fdv_user_id
      ), 0) as planet_count,
      (
        SELECT psb.planet_id FROM web_freedom_planet_prod.planet_structure_built psb
        WHERE psb.fdv_user_id = prc.fdv_user_id
        ORDER BY psb.total_structure::int DESC, psb.timestamp DESC LIMIT 1
      ) as top_planet_id,
      (
        SELECT psb.planet_name FROM web_freedom_planet_prod.planet_structure_built psb
        WHERE psb.fdv_user_id = prc.fdv_user_id
        ORDER BY psb.total_structure::int DESC, psb.timestamp DESC LIMIT 1
      ) as top_planet_name
    FROM web_freedom_planet_prod.planet_reward_claimed prc
    LEFT JOIN web_card_game_prod.users u ON u.id = prc.fdv_user_id::text
    ${tf}
    GROUP BY prc.fdv_user_id, u.avatar_name
    ORDER BY total_fds DESC
    LIMIT 100
  `);
  return rows as FDSEarnerEntry[];
}

/** Global planet stats */
export async function getPlanetGlobalStats() {
  const rows = await rawQuery(`
    SELECT 
      (SELECT COUNT(DISTINCT fdv_user_id)::int FROM web_freedom_planet_prod.planet_activated) as total_users,
      (SELECT COUNT(DISTINCT planet_id)::int FROM web_freedom_planet_prod.planet_activated) as total_planets,
      (SELECT COUNT(*)::int FROM web_freedom_planet_prod.planet_structure_built) as total_structures,
      (SELECT COALESCE(SUM(claimed_amount::numeric), 0) FROM web_freedom_planet_prod.planet_reward_claimed) as total_fds_earned
  `);
  return rows[0] as { total_users: number; total_planets: number; total_structures: number; total_fds_earned: number };
}
