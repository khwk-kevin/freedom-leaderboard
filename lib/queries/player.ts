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
    SELECT COALESCE(SUM(received_nft), 0)::int as total_nfts
    FROM web_card_game_prod.game_match_resulted WHERE player_fdv_id = ${fdvId}
  `;
  return (rows[0] as { total_nfts: number })?.total_nfts || 0;
}
