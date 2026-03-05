import { rawQuery } from '../db';

export type PlanetDetail = {
  planet_id: string;
  planet_name: string;
  fdv_user_id: number;
  owner_name: string | null;
  total_structure: number;
  total_food_structure: number;
  total_industrial_structure: number;
  food_workforce: number;
  industrial_workforce: number;
  available_workforce: number;
  activated_at: string | null;
  total_owner_planets: number;
  total_owner_fds: number;
  owner_fds_claims: number;
  rank: number;
};

export type StructureEvent = {
  timestamp: string;
  total_structure: number;
  total_food_structure: number;
  total_industrial_structure: number;
  structure_name: string;
  structure_type: string;
};

export type WorkforceEvent = {
  timestamp: string;
  food_workforce: number;
  industrial_workforce: number;
  available_workforce: number;
};

/** Get full planet detail */
export async function getPlanetDetail(planetId: string): Promise<PlanetDetail | null> {
  const rows = await rawQuery(`
    WITH latest_structure AS (
      SELECT DISTINCT ON (planet_id) *
      FROM web_freedom_planet_prod.planet_structure_built
      WHERE planet_id = '${planetId}'
      ORDER BY planet_id, timestamp DESC
    ),
    latest_workforce AS (
      SELECT DISTINCT ON (planet_id) *
      FROM web_freedom_planet_prod.planet_workforce_updated
      WHERE planet_id = '${planetId}'
      ORDER BY planet_id, timestamp DESC
    ),
    activation AS (
      SELECT timestamp, activated_planets, total_planets
      FROM web_freedom_planet_prod.planet_activated
      WHERE planet_id = '${planetId}'
      ORDER BY timestamp ASC LIMIT 1
    ),
    planet_rank AS (
      SELECT planet_id, RANK() OVER (ORDER BY total_structure::int DESC) as rank
      FROM (
        SELECT DISTINCT ON (planet_id) planet_id, total_structure
        FROM web_freedom_planet_prod.planet_structure_built
        ORDER BY planet_id, timestamp DESC
      ) sub
    )
    SELECT 
      ls.planet_id,
      ls.planet_name,
      ls.fdv_user_id::int,
      u.avatar_name as owner_name,
      ls.total_structure::int,
      COALESCE(ls.total_food_structure, 0)::int as total_food_structure,
      COALESCE(ls.total_industrial_structure, 0)::int as total_industrial_structure,
      COALESCE(lw.food_workforce, 0)::int as food_workforce,
      COALESCE(lw.industrial_workforce, 0)::int as industrial_workforce,
      COALESCE(lw.available_workforce, 0)::int as available_workforce,
      a.timestamp as activated_at,
      COALESCE(a.total_planets, 0)::int as total_owner_planets,
      COALESCE((
        SELECT SUM(claimed_amount::numeric) FROM web_freedom_planet_prod.planet_reward_claimed
        WHERE fdv_user_id = ls.fdv_user_id
      ), 0)::numeric as total_owner_fds,
      COALESCE((
        SELECT COUNT(*)::int FROM web_freedom_planet_prod.planet_reward_claimed
        WHERE fdv_user_id = ls.fdv_user_id
      ), 0) as owner_fds_claims,
      COALESCE(pr.rank, 0)::int as rank
    FROM latest_structure ls
    LEFT JOIN latest_workforce lw ON lw.planet_id = ls.planet_id
    LEFT JOIN activation a ON true
    LEFT JOIN web_card_game_prod.users u ON u.id = ls.fdv_user_id::text
    LEFT JOIN planet_rank pr ON pr.planet_id = ls.planet_id
  `);
  if (rows.length === 0) return null;
  return rows[0] as PlanetDetail;
}

/** Get structure build history for charts */
export async function getPlanetStructureHistory(planetId: string): Promise<StructureEvent[]> {
  const rows = await rawQuery(`
    SELECT 
      timestamp,
      total_structure::int,
      COALESCE(total_food_structure, 0)::int as total_food_structure,
      COALESCE(total_industrial_structure, 0)::int as total_industrial_structure,
      structure_name,
      structure_type
    FROM web_freedom_planet_prod.planet_structure_built
    WHERE planet_id = '${planetId}'
    ORDER BY timestamp ASC
  `);
  return rows as StructureEvent[];
}

/** Get workforce history for charts */
export async function getPlanetWorkforceHistory(planetId: string): Promise<WorkforceEvent[]> {
  const rows = await rawQuery(`
    SELECT 
      timestamp,
      food_workforce::int,
      industrial_workforce::int,
      available_workforce::int
    FROM web_freedom_planet_prod.planet_workforce_updated
    WHERE planet_id = '${planetId}'
    ORDER BY timestamp ASC
  `);
  return rows as WorkforceEvent[];
}
