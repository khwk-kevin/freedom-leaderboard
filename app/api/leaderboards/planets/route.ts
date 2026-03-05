import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getTopPlanetsByStructures, getTopUsersByFDS, getPlanetGlobalStats, type TimeFilter } from '@/lib/queries/planet-leaderboards';

export const revalidate = 600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'population';
  const time = (searchParams.get('time') || 'all-time') as TimeFilter;

  try {
    const cached = unstable_cache(
      async () => {
        const [stats, data] = await Promise.all([
          getPlanetGlobalStats(),
          mode === 'fds' ? getTopUsersByFDS(time) : getTopPlanetsByStructures(time),
        ]);
        return { stats, data };
      },
      [`planet-api-${mode}-${time}`],
      { revalidate: 600 }
    );
    const { stats, data } = await cached();

    return NextResponse.json({ mode, time, stats, data });
  } catch (error) {
    console.error('Planet leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
}
