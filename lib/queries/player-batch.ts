import { sql as neonSql } from '../db';

/**
 * Batch query: fetches ALL player data in a single SQL call using CTEs.
 * Replaces 14 individual queries with 1 round trip to the database.
 */
export async function getPlayerBatch(fdvId: number) {
  const rows = await neonSql`
    WITH player_summary AS (
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
          ELSE 0 END as win_rate,
        -- Combat stats
        COALESCE(MAX(player_stats_damage_increase), 0)::int as max_damage,
        COALESCE(MAX(player_stats_block_increase), 0)::int as max_block,
        COALESCE(MAX(player_stats_heal_increase), 0)::int as max_heal,
        -- Nexus stats
        COUNT(*) FILTER (WHERE is_nexus = true)::int as nexus_total,
        COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::int as nexus_wins,
        COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Lose')::int as nexus_losses,
        CASE WHEN COUNT(*) FILTER (WHERE is_nexus = true) > 0
          THEN ROUND((COUNT(*) FILTER (WHERE is_nexus = true AND match_result = 'Win')::numeric / COUNT(*) FILTER (WHERE is_nexus = true)::numeric * 100), 1)
          ELSE 0 END as nexus_win_rate,
        COALESCE(AVG(monster_killed_total) FILTER (WHERE is_nexus = true), 0)::int as nexus_avg_kills,
        -- Materials
        COALESCE(SUM(received_materials_fds::numeric), 0) as mat_fds,
        COALESCE(SUM(received_materials_vsa), 0)::int as mat_vsa,
        COALESCE(SUM(received_materials_admt), 0)::int as mat_admt,
        COALESCE(SUM(received_materials_aths), 0)::int as mat_aths,
        COALESCE(SUM(received_materials_biog), 0)::int as mat_biog,
        COALESCE(SUM(received_materials_bstr), 0)::int as mat_bstr,
        COALESCE(SUM(received_materials_crm), 0)::int as mat_crm,
        COALESCE(SUM(received_materials_drs), 0)::int as mat_drs,
        COALESCE(SUM(received_materials_ncc), 0)::int as mat_ncc,
        COALESCE(SUM(received_materials_nrfm), 0)::int as mat_nrfm,
        COALESCE(SUM(received_materials_obs), 0)::int as mat_obs,
        COALESCE(SUM(received_materials_pmf), 0)::int as mat_pmf,
        COALESCE(SUM(received_materials_qtpc), 0)::int as mat_qtpc,
        -- NFTs
        COALESCE(SUM(CASE WHEN received_nft ~ '^[0-9]+$' THEN received_nft::int ELSE 0 END), 0)::int as total_nfts,
        -- Combat rating inputs
        CASE WHEN COUNT(*) > 0
          THEN (COALESCE(SUM(monster_killed_total), 0)::numeric / COUNT(*)::numeric)
          ELSE 0 END as avg_kills
      FROM web_card_game_prod.game_match_resulted
      WHERE player_fdv_id = ${fdvId}
    )
    SELECT * FROM player_summary
  `;

  const s = rows[0] as Record<string, number> | null;
  if (!s || s.total_matches === 0) return null;

  // Compute combat rating locally (avoids expensive PERCENT_RANK scan)
  const winRate = Number(s.win_rate) || 0;
  const nexusWinRate = Number(s.nexus_win_rate) || 0;
  const avgKills = Number(s.avg_kills) || 0;
  const peakStat = Math.max(s.max_damage, s.max_block, s.max_heal);
  const totalNfts = s.total_nfts;

  const combatRating = Math.round(
    (Math.min(winRate, 100) * 0.30) +
    (Math.min(nexusWinRate, 100) * 0.25) +
    (Math.min((avgKills / 10.0) * 100, 100) * 0.15) +
    (Math.min((peakStat / 1000.0) * 100, 100) * 0.10) +
    (Math.min((totalNfts / 50.0) * 100, 100) * 0.10) +
    (Math.min(nexusWinRate * 0.5 + winRate * 0.5, 100) * 0.10)
  );

  // Compute dominant role locally
  const roles = [
    { name: 'DPS', icon: '⚔️', value: s.max_damage },
    { name: 'Tank', icon: '🛡️', value: s.max_block },
    { name: 'Healer', icon: '💚', value: s.max_heal },
  ].sort((a, b) => b.value - a.value);

  return {
    summary: {
      total_matches: s.total_matches, wins: s.wins, losses: s.losses, abandons: s.abandons,
      total_kills: s.total_kills, total_xp_earned: s.total_xp_earned, max_level: s.max_level,
      max_total_xp: s.max_total_xp, first_match: s.first_match, last_match: s.last_match,
      win_rate: s.win_rate, total_xp: s.total_xp_earned,
    },
    combat: { max_damage: s.max_damage, max_block: s.max_block, max_heal: s.max_heal },
    nexus: {
      nexus_total: s.nexus_total, nexus_wins: s.nexus_wins, nexus_losses: s.nexus_losses,
      nexus_win_rate: s.nexus_win_rate, nexus_avg_kills: s.nexus_avg_kills,
    },
    materials: {
      fds: s.mat_fds, vsa: s.mat_vsa, admt: s.mat_admt, aths: s.mat_aths, biog: s.mat_biog,
      bstr: s.mat_bstr, crm: s.mat_crm, drs: s.mat_drs, ncc: s.mat_ncc, nrfm: s.mat_nrfm,
      obs: s.mat_obs, pmf: s.mat_pmf, qtpc: s.mat_qtpc,
    },
    nfts: totalNfts,
    combatRating,
    dominantRole: { primary: roles[0], secondary: roles[1], stats: { peak_damage: s.max_damage, peak_block: s.max_block, peak_heal: s.max_heal } },
  };
}
