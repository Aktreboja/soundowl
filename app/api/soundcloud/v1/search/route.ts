import { fetchWithSoundCloudAuth } from '@/app/utils';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');

  if (q == null || !q.trim()) {
    return Response.json([], { status: 200 });
  }

  const ids = searchParams.get('ids');
  const urns = searchParams.get('urns');
  const limit = searchParams.get('limit');
  const linkedPartitioning = searchParams.get('linked_partitioning');

  const params = new URLSearchParams();
  if (ids) params.append('ids', ids);
  if (urns) params.append('urns', urns);
  if (limit) params.append('limit', limit);
  if (linkedPartitioning)
    params.append('linked_partitioning', linkedPartitioning);

  const appendedLink = params.toString();
  const encodedQ = encodeURIComponent(q.trim());
  const url = `https://api.soundcloud.com/tracks?q=${encodedQ}&${appendedLink}&access=playable&limit=10&linked_partitioning=true`;

  const response = await fetchWithSoundCloudAuth(url);

  if (!response.ok) {
    return response;
  }

  const data = await response.json();
  const tracks = Array.isArray(data) ? data : data.collection ?? [];
  return Response.json(tracks, { status: 200 });
}
