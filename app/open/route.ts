import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fdvId = params.get('fdv_id');
  const planetId = params.get('planet_id');

  if (fdvId) {
    redirect(`/player/${fdvId}`);
  }

  if (planetId) {
    redirect(`/leaderboards/planets/${planetId}`);
  }

  // No valid params — go home
  redirect('/');
}
