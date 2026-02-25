import { db, sql as neonSql } from '../db';
import { gameMatchStarted, users } from '../schema';
import { eq, desc } from 'drizzle-orm';

export async function getPlayerScapeSummary(fdvId: number) {
  const rows = await neonSql`
    SELECT
      COUNT(*)::int as total_matches,
      COUNT(*) FILTER (WHERE match_result = 'Win')::int as wins,
      COUNT(*) FILTER (WHERE match_result = 'Lose')::int as losses,
      COUNT(*) FILTER (WHERE match_result = 'Abandon')::int as abandons,
      COALESCE(SUM(monster_killed_total), 0)::int as total_kills,
      COALESCE(SUM(received_xp), 0)::int as total_xp_earned,
      COALESCE(MAX(player_level), 0)::int as max_level,
      COALESCE(MAX(player_total_xp), 0)::bigint as max_total_xp,
      MIN(timestamp) as first_match,
      MAX(timestamp) as last_match,
      CASE WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100), 1)
        ELSE 0 END as win_rate
    FROM web_card_game_prod.game_match_resulted
    WHERE player_fdv_id = ${fdvId}
  `;
  return rows[0] || null;
}

export async function getPlayerMaterials(fdvId: number) {
  const rows = await neonSql`
    SELECT
      COALESCE(SUM(received_materials_fds::numeric), 0) as fds,
      COALESCE(SUM(received_materials_vsa), 0)::int as vsa,
      COALESCE(SUM(received_materials_admt), 0)::int as admt,
      COALESCE(SUM(received_materials_aths), 0)::int as aths,
      COALESCE(SUM(received_materials_biog), 0)::int as biog,
      COALESCE(SUM(received_materials_bstr), 0)::int as bstr,
      COALESCE(SUM(received_materials_crm), 0)::int as crm,
      COALESCE(SUM(received_materials_drs), 0)::int as drs,
      COALESCE(SUM(received_materials_ncc), 0)::int as ncc,
      COALESCE(SUM(received_materials_nrfm), 0)::int as nrfm,
      COALESCE(SUM(received_materials_obs), 0)::int as obs,
      COALESCE(SUM(received_materials_pmf), 0)::int as pmf,
      COALESCE(SUM(received_materials_qtpc), 0)::int as qtpc
    FROM web_card_game_prod.game_match_resulted
    WHERE player_fdv_id = ${fdvId}
  `;
  return rows[0] || null;
}

export async function getPlayerEquipment(fdvId: number) {
  const result = await db
    .select({
      weapon: gameMatchStarted.player_wearable_weapon,
      chest: gameMatchStarted.player_wearable_chest,
      boots: gameMatchStarted.player_wearable_boots,
      gloves: gameMatchStarted.player_wearable_gloves,
      head: gameMatchStarted.player_wearable_head,
      pants: gameMatchStarted.player_wearable_pants,
      cloak: gameMatchStarted.player_wearable_cloak,
      accessory: gameMatchStarted.player_wearable_accessory,
      skin: gameMatchStarted.player_wearable_skin,
    })
    .from(gameMatchStarted)
    .where(eq(gameMatchStarted.player_fdv_id, fdvId))
    .orderBy(desc(gameMatchStarted.timestamp))
    .limit(1);
  return result[0] || null;
}

export async function getPlayerMatchHistory(fdvId: number, limit: number = 20) {
  const rows = await neonSql`
    SELECT id, timestamp, match_result,
      COALESCE(monster_killed_total, 0)::int as monsters_killed,
      COALESCE(received_xp, 0)::int as xp_earned,
      COALESCE(player_level, 0)::int as level
    FROM web_card_game_prod.game_match_resulted
    WHERE player_fdv_id = ${fdvId}
    ORDER BY timestamp DESC LIMIT ${limit}
  `;
  return rows;
}

export async function getPlayerPlanetSummary(fdvId: number) {
  const rows = await neonSql`
    SELECT
      (SELECT COUNT(DISTINCT planet_id)::int FROM web_freedom_planet_prod.planet_activated WHERE fdv_user_id = ${fdvId}) as total_planets,
      (SELECT COUNT(*)::int FROM web_freedom_planet_prod.planet_structure_built WHERE fdv_user_id = ${fdvId}) as total_structures,
      COALESCE((SELECT SUM(claimed_amount::numeric) FROM web_freedom_planet_prod.planet_reward_claimed WHERE fdv_user_id = ${fdvId}), 0) as total_fds_earned
  `;
  return rows[0] || null;
}

export async function getPlayerInfo(fdvId: number) {
  const result = await db
    .select({ fdv_id: users.fdv_id, avatar_name: users.avatar_name, context_locale: users.context_locale })
    .from(users)
    .where(eq(users.fdv_id, fdvId))
    .limit(1);
  return result[0] || null;
}

export async function getPlayerCombatStats(fdvId: number) {
  const rows = await neonSql`
    SELECT
      COALESCE(MAX(player_stats_damage_increase), 0)::int as max_damage,
      COALESCE(MAX(player_stats_block_increase), 0)::int as max_block,
      COALESCE(MAX(player_stats_heal_increase), 0)::int as max_heal
    FROM web_card_game_prod.game_match_resulted WHERE player_fdv_id = ${fdvId}
  `;
  return rows[0] || null;
}

export async function getTotalNFTs(fdvId: number): Promise<number> {
  const rows = await neonSql`
    SELECT COALESCE(SUM(received_nft::int), 0)::int as total_nfts
    FROM web_card_game_prod.game_match_resulted WHERE player_fdv_id = ${fdvId}
  `;
  return (rows[0] as { total_nfts: number })?.total_nfts || 0;
}

export async function getPlayerNexusStats(fdvId: number) {
  const rows = await neonSql`
    SELECT
      COUNT(*)::int as nexus_total,
      COUNT(*) FILTER (WHERE match_result = 'Win')::int as nexus_wins,
      COUNT(*) FILTER (WHERE match_result = 'Lose')::int as nexus_losses,
      CASE WHEN COUNT(*) > 0
        THEN ROUND((COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100), 1)
        ELSE 0 END as nexus_win_rate,
      COALESCE(AVG(monster_killed_total)::numeric, 0)::int as nexus_avg_kills
    FROM web_card_game_prod.game_match_resulted
    WHERE player_fdv_id = ${fdvId} AND is_nexus = true
  `;
  return rows[0] as { nexus_total: number; nexus_wins: number; nexus_losses: number; nexus_win_rate: number; nexus_avg_kills: number } | null;
}

export async function getPlayerWinStreak(fdvId: number) {
  const rows = await neonSql`
    SELECT match_result
    FROM web_card_game_prod.game_match_resulted
    WHERE player_fdv_id = ${fdvId}
    ORDER BY timestamp ASC
  `;
  let bestStreak = 0;
  let currentStreak = 0;
  let latestStreak = 0;

  for (const row of rows as Array<{ match_result: string }>) {
    if (row.match_result === 'Win') {
      currentStreak++;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }
  // Calculate current streak from most recent backwards
  for (let i = rows.length - 1; i >= 0; i--) {
    if ((rows[i] as { match_result: string }).match_result === 'Win') {
      latestStreak++;
    } else {
      break;
    }
  }
  return { bestStreak, currentStreak: latestStreak };
}

export async function getPlayerDominantRole(fdvId: number) {
  const rows = await neonSql`
    SELECT
      COALESCE(MAX(player_stats_damage_increase), 0)::int as peak_damage,
      COALESCE(MAX(player_stats_block_increase), 0)::int as peak_block,
      COALESCE(MAX(player_stats_heal_increase), 0)::int as peak_heal
    FROM web_card_game_prod.game_match_resulted
    WHERE player_fdv_id = ${fdvId}
  `;
  const stats = rows[0] as { peak_damage: number; peak_block: number; peak_heal: number };
  if (!stats) return null;

  const roles = [
    { name: 'DPS', icon: '⚔️', value: stats.peak_damage },
    { name: 'Tank', icon: '🛡️', value: stats.peak_block },
    { name: 'Healer', icon: '💚', value: stats.peak_heal },
  ].sort((a, b) => b.value - a.value);

  return {
    primary: roles[0],
    secondary: roles[1],
    stats,
  };
}

export async function getPlayerRadarStats(fdvId: number) {
  const rows = await neonSql`
    WITH player_agg AS (
      SELECT
        player_fdv_id,
        COALESCE(MAX(player_stats_damage_increase), 0) as peak_damage,
        COALESCE(MAX(player_stats_block_increase), 0) as peak_block,
        COALESCE(MAX(player_stats_heal_increase), 0) as peak_heal,
        CASE WHEN COUNT(*) > 0
          THEN (COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100)
          ELSE 0 END as win_rate,
        CASE WHEN COUNT(*) > 0
          THEN (COALESCE(SUM(monster_killed_total), 0)::numeric / COUNT(*)::numeric)
          ELSE 0 END as avg_kills,
        CASE WHEN COUNT(*) FILTER (WHERE is_nexus = true) > 0
          THEN (COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::numeric / COUNT(*) FILTER (WHERE is_nexus = true)::numeric * 100)
          ELSE 0 END as nexus_win_rate
      FROM web_card_game_prod.game_match_resulted
      GROUP BY player_fdv_id
      HAVING COUNT(*) >= 10
    ),
    ranked AS (
      SELECT
        player_fdv_id,
        ROUND(PERCENT_RANK() OVER (ORDER BY peak_damage) * 100)::int as might_pct,
        ROUND(PERCENT_RANK() OVER (ORDER BY peak_block) * 100)::int as vitality_pct,
        ROUND(PERCENT_RANK() OVER (ORDER BY peak_heal) * 100)::int as spirit_pct,
        ROUND(PERCENT_RANK() OVER (ORDER BY win_rate) * 100)::int as precision_pct,
        ROUND(PERCENT_RANK() OVER (ORDER BY avg_kills) * 100)::int as lethality_pct,
        ROUND(PERCENT_RANK() OVER (ORDER BY nexus_win_rate) * 100)::int as nexus_pct
      FROM player_agg
    )
    SELECT * FROM ranked WHERE player_fdv_id = ${fdvId}
  `;
  return rows[0] as {
    might_pct: number; vitality_pct: number; spirit_pct: number;
    precision_pct: number; lethality_pct: number; nexus_pct: number;
  } | null;
}

export async function getPlayerPercentiles(fdvId: number) {
  const rows = await neonSql`
    WITH player_agg AS (
      SELECT
        player_fdv_id,
        CASE WHEN COUNT(*) > 0
          THEN (COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100)
          ELSE 0 END as win_rate,
        CASE WHEN COUNT(*) FILTER (WHERE is_nexus = true) > 0
          THEN (COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::numeric / COUNT(*) FILTER (WHERE is_nexus = true)::numeric * 100)
          ELSE 0 END as nexus_win_rate,
        COALESCE(SUM(monster_killed_total), 0) as total_kills,
        CASE WHEN COUNT(*) > 0
          THEN (COALESCE(SUM(monster_killed_total), 0)::numeric / COUNT(*)::numeric)
          ELSE 0 END as avg_kills,
        COALESCE(SUM(received_nft::int), 0) as total_nfts
      FROM web_card_game_prod.game_match_resulted
      GROUP BY player_fdv_id
      HAVING COUNT(*) >= 10
    ),
    ranked AS (
      SELECT
        player_fdv_id,
        ROUND((PERCENT_RANK() OVER (ORDER BY win_rate) * 100)::numeric, 1) as win_rate_pct,
        ROUND((PERCENT_RANK() OVER (ORDER BY nexus_win_rate) * 100)::numeric, 1) as nexus_pct,
        ROUND((PERCENT_RANK() OVER (ORDER BY total_kills) * 100)::numeric, 1) as kills_pct,
        ROUND((PERCENT_RANK() OVER (ORDER BY avg_kills) * 100)::numeric, 1) as avg_kills_pct,
        ROUND((PERCENT_RANK() OVER (ORDER BY total_nfts) * 100)::numeric, 1) as nfts_pct
      FROM player_agg
    )
    SELECT * FROM ranked WHERE player_fdv_id = ${fdvId}
  `;
  return rows[0] as {
    win_rate_pct: number; nexus_pct: number; kills_pct: number;
    avg_kills_pct: number; nfts_pct: number;
  } | null;
}

export async function getPlayerCombatRating(fdvId: number) {
  const rows = await neonSql`
    WITH player_stats AS (
      SELECT
        CASE WHEN COUNT(*) > 0
          THEN (COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100)
          ELSE 0 END as win_rate,
        CASE WHEN COUNT(*) FILTER (WHERE is_nexus = true) > 0
          THEN (COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::numeric / COUNT(*) FILTER (WHERE is_nexus = true)::numeric * 100)
          ELSE 0 END as nexus_win_rate,
        CASE WHEN COUNT(*) > 0
          THEN (COALESCE(SUM(monster_killed_total), 0)::numeric / COUNT(*)::numeric)
          ELSE 0 END as avg_kills,
        COALESCE(SUM(received_nft::int), 0)::numeric as total_nfts,
        GREATEST(
          COALESCE(MAX(player_stats_damage_increase), 0),
          COALESCE(MAX(player_stats_block_increase), 0),
          COALESCE(MAX(player_stats_heal_increase), 0)
        ) as peak_stat
      FROM web_card_game_prod.game_match_resulted
      WHERE player_fdv_id = ${fdvId}
    )
    SELECT
      ROUND(
        (LEAST(win_rate, 100) * 0.30) +
        (LEAST(nexus_win_rate, 100) * 0.25) +
        (LEAST(avg_kills / 10.0 * 100, 100) * 0.15) +
        (LEAST(peak_stat / 1000.0 * 100, 100) * 0.10) +
        (LEAST(total_nfts / 50.0 * 100, 100) * 0.10) +
        (LEAST(nexus_win_rate * 0.5 + win_rate * 0.5, 100) * 0.10)
      )::int as combat_rating,
      win_rate, nexus_win_rate, avg_kills
    FROM player_stats
  `;
  return rows[0] as { combat_rating: number; win_rate: number; nexus_win_rate: number; avg_kills: number } | null;
}

export async function getCombatRatingPercentile(fdvId: number) {
  const rows = await neonSql`
    WITH all_ratings AS (
      SELECT
        player_fdv_id,
        ROUND(
          (LEAST(CASE WHEN COUNT(*) > 0
            THEN (COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100)
            ELSE 0 END, 100) * 0.30) +
          (LEAST(CASE WHEN COUNT(*) FILTER (WHERE is_nexus = true) > 0
            THEN (COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::numeric / COUNT(*) FILTER (WHERE is_nexus = true)::numeric * 100)
            ELSE 0 END, 100) * 0.25) +
          (LEAST(CASE WHEN COUNT(*) > 0
            THEN (COALESCE(SUM(monster_killed_total), 0)::numeric / COUNT(*)::numeric / 10.0 * 100)
            ELSE 0 END, 100) * 0.15) +
          (LEAST(GREATEST(
            COALESCE(MAX(player_stats_damage_increase), 0),
            COALESCE(MAX(player_stats_block_increase), 0),
            COALESCE(MAX(player_stats_heal_increase), 0)
          )::numeric / 1000.0 * 100, 100) * 0.10) +
          (LEAST(COALESCE(SUM(received_nft::int), 0)::numeric / 50.0 * 100, 100) * 0.10) +
          (LEAST(
            (CASE WHEN COUNT(*) FILTER (WHERE is_nexus = true) > 0
              THEN (COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::numeric / COUNT(*) FILTER (WHERE is_nexus = true)::numeric * 100)
              ELSE 0 END * 0.5) +
            (CASE WHEN COUNT(*) > 0
              THEN (COUNT(*) FILTER (WHERE match_result = 'Win')::numeric / COUNT(*)::numeric * 100)
              ELSE 0 END * 0.5)
          , 100) * 0.10)
        ) as rating
      FROM web_card_game_prod.game_match_resulted
      GROUP BY player_fdv_id
      HAVING COUNT(*) >= 10
    ),
    ranked AS (
      SELECT player_fdv_id, rating,
        ROUND((PERCENT_RANK() OVER (ORDER BY rating) * 100)::numeric, 1) as percentile
      FROM all_ratings
    )
    SELECT percentile FROM ranked WHERE player_fdv_id = ${fdvId}
  `;
  return (rows[0] as { percentile: number })?.percentile || 0;
}
