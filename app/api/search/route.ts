import { NextRequest, NextResponse } from 'next/server';
import { searchPlayers } from '@/lib/queries/search';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q || q.length < 2) return NextResponse.json([]);
  const results = await searchPlayers(q);
  return NextResponse.json(results);
}
