import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fdvId: string }> }
) {
  const { fdvId } = await params;
  try {
    const upstream = await fetch(
      `https://gateway.freedom.world/api/freedom-wallet/profile/image/${fdvId}`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );
    const body = await upstream.arrayBuffer();
    if (!body.byteLength) {
      return new NextResponse(null, { status: 404 });
    }
    const contentType = upstream.headers.get('content-type') || 'image/png';
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
