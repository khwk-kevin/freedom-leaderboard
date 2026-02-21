import { db } from '../db';
import { users } from '../schema';
import { eq, ilike } from 'drizzle-orm';

export async function searchPlayers(query: string) {
  const fdvId = parseInt(query, 10);
  if (!isNaN(fdvId)) {
    const exact = await db.select({ fdv_id: users.fdv_id, avatar_name: users.avatar_name })
      .from(users).where(eq(users.fdv_id, fdvId)).limit(1);
    if (exact.length > 0) return exact;
  }
  return db.select({ fdv_id: users.fdv_id, avatar_name: users.avatar_name })
    .from(users).where(ilike(users.avatar_name, `%${query}%`)).limit(20);
}
