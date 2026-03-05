import { unstable_cache } from 'next/cache';

/**
 * Cache a function result for a given duration.
 * Uses Next.js data cache — persists across requests during revalidation window.
 */
export function cached<T>(
  fn: (...args: string[]) => Promise<T>,
  keyParts: string[],
  revalidateSeconds: number = 300
) {
  return unstable_cache(fn, keyParts, { revalidate: revalidateSeconds });
}
