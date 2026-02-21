import { pgSchema, varchar, bigint, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

// Scape Game Schema
const scapeSchema = pgSchema('web_card_game_prod');

export const users = scapeSchema.table('users', {
  id: varchar('id').primaryKey(),
  fdv_id: bigint('fdv_id', { mode: 'number' }),
  avatar_name: text('avatar_name'),
  received_at: timestamp('received_at', { withTimezone: true }),
  context_locale: text('context_locale'),
});

export const gameMatchStarted = scapeSchema.table('game_match_started', {
  id: varchar('id').primaryKey(),
  player_fdv_id: bigint('player_fdv_id', { mode: 'number' }),
  player_level: bigint('player_level', { mode: 'number' }),
  player_total_xp: bigint('player_total_xp', { mode: 'number' }),
  player_current_hp: bigint('player_current_hp', { mode: 'number' }),
  player_max_hp: bigint('player_max_hp', { mode: 'number' }),
  player_wearable_weapon: text('player_wearable_weapon'),
  player_wearable_chest: text('player_wearable_chest'),
  player_wearable_boots: text('player_wearable_boots'),
  player_wearable_gloves: text('player_wearable_gloves'),
  player_wearable_head: text('player_wearable_head'),
  player_wearable_pants: text('player_wearable_pants'),
  player_wearable_cloak: text('player_wearable_cloak'),
  player_wearable_accessory: text('player_wearable_accessory'),
  player_wearable_skin: text('player_wearable_skin'),
  game_location_id: text('game_location_id'),
  location_lat: text('location_lat'),
  location_long: text('location_long'),
  monsters: text('monsters'),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

export const gameMatchResulted = scapeSchema.table('game_match_resulted', {
  id: varchar('id').primaryKey(),
  player_fdv_id: bigint('player_fdv_id', { mode: 'number' }),
  player_level: bigint('player_level', { mode: 'number' }),
  player_total_xp: bigint('player_total_xp', { mode: 'number' }),
  match_result: text('match_result'),
  monster_killed_total: bigint('monster_killed_total', { mode: 'number' }),
  received_xp: bigint('received_xp', { mode: 'number' }),
  is_nexus: boolean('is_nexus'),
  received_materials_fds: numeric('received_materials_fds'),
  received_materials_vsa: bigint('received_materials_vsa', { mode: 'number' }),
  received_materials_admt: bigint('received_materials_admt', { mode: 'number' }),
  received_materials_aths: bigint('received_materials_aths', { mode: 'number' }),
  received_materials_biog: bigint('received_materials_biog', { mode: 'number' }),
  received_materials_bstr: bigint('received_materials_bstr', { mode: 'number' }),
  received_materials_crm: bigint('received_materials_crm', { mode: 'number' }),
  received_materials_drs: bigint('received_materials_drs', { mode: 'number' }),
  received_materials_ncc: bigint('received_materials_ncc', { mode: 'number' }),
  received_materials_nrfm: bigint('received_materials_nrfm', { mode: 'number' }),
  received_materials_obs: bigint('received_materials_obs', { mode: 'number' }),
  received_materials_pmf: bigint('received_materials_pmf', { mode: 'number' }),
  received_materials_qtpc: bigint('received_materials_qtpc', { mode: 'number' }),
  received_nft: bigint('received_nft', { mode: 'number' }),
  player_stats_damage_increase: bigint('player_stats_damage_increase', { mode: 'number' }),
  player_stats_block_increase: bigint('player_stats_block_increase', { mode: 'number' }),
  player_stats_heal_increase: bigint('player_stats_heal_increase', { mode: 'number' }),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

export const gameMatchEnded = scapeSchema.table('game_match_ended', {
  id: varchar('id').primaryKey(),
  player_fdv_id: bigint('player_fdv_id', { mode: 'number' }),
  player_avatar_name: text('player_avatar_name'),
  player_level: bigint('player_level', { mode: 'number' }),
  match_result: text('match_result'),
  match_match_result: text('match_match_result'),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

// Planet Schema
const planetSchema = pgSchema('web_freedom_planet_prod');

export const planetActivated = planetSchema.table('planet_activated', {
  id: varchar('id').primaryKey(),
  fdv_user_id: bigint('fdv_user_id', { mode: 'number' }),
  planet_id: text('planet_id'),
  planet_name: text('planet_name'),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

export const planetDeactivated = planetSchema.table('planet_deactivated', {
  id: varchar('id').primaryKey(),
  fdv_user_id: bigint('fdv_user_id', { mode: 'number' }),
  planet_id: text('planet_id'),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

export const planetStructureBuilt = planetSchema.table('planet_structure_built', {
  id: varchar('id').primaryKey(),
  fdv_user_id: bigint('fdv_user_id', { mode: 'number' }),
  planet_id: text('planet_id'),
  planet_name: text('planet_name'),
  structure_name: text('structure_name'),
  structure_type: text('structure_type'),
  total_structure: bigint('total_structure', { mode: 'number' }),
  total_food_structure: bigint('total_food_structure', { mode: 'number' }),
  total_industrial_structure: bigint('total_industrial_structure', { mode: 'number' }),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

export const planetWorkforceUpdated = planetSchema.table('planet_workforce_updated', {
  id: varchar('id').primaryKey(),
  fdv_user_id: bigint('fdv_user_id', { mode: 'number' }),
  planet_id: text('planet_id'),
  planet_name: text('planet_name'),
  food_workforce: bigint('food_workforce', { mode: 'number' }),
  industrial_workforce: bigint('industrial_workforce', { mode: 'number' }),
  available_workforce: bigint('available_workforce', { mode: 'number' }),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});

export const planetRewardClaimed = planetSchema.table('planet_reward_claimed', {
  id: varchar('id').primaryKey(),
  fdv_user_id: bigint('fdv_user_id', { mode: 'number' }),
  claimed_reward: text('claimed_reward'),
  claimed_amount: numeric('claimed_amount'),
  timestamp: timestamp('timestamp', { withTimezone: true }),
});
