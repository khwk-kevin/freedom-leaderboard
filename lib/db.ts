import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.NEON_DATABASE_URL);
export const db = drizzle(sql);

/** Execute a raw SQL string (no tagged template). Use for dynamic queries. */
export async function rawQuery<T = Record<string, unknown>>(query: string): Promise<T[]> {
  // Neon's sql function is a tagged template, so we pass a TemplateStringsArray-like object
  const strings = Object.assign([query], { raw: [query] }) as unknown as TemplateStringsArray;
  return sql(strings) as unknown as T[];
}
