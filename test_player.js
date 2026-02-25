const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.NEON_DATABASE_URL);
async function test() {
  try {
    const r = await sql`SELECT player_fdv_id FROM web_card_game_prod.game_match_resulted LIMIT 1`;
    console.log('Sample:', JSON.stringify(r[0]));
    const fdvId = Number(r[0].player_fdv_id);
    const { drizzle } = require('drizzle-orm/neon-http');
    const db = drizzle(sql);
    const { eq } = require('drizzle-orm');
    const { users } = require('./lib/schema');
    const result = await db.select({ fdv_id: users.fdv_id, avatar_name: users.avatar_name }).from(users).where(eq(users.fdv_id, fdvId)).limit(1);
    console.log('PlayerInfo:', JSON.stringify(result));
  } catch(e) { console.error('ERROR:', e.message); console.error('CODE:', e.code); }
}
test();
