import { fetchWithSoundCloudAuth } from '@/app/utils';
import { NextRequest } from 'next/server';

import type { SoundCloudTrackSearchRequest } from '@/lib/store/soundcloudApi';
export async function GET(request: NextRequest) {
  const { ids, limit, linked_partitioning, q, urns } = request.nextUrl
    .searchParams as unknown as SoundCloudTrackSearchRequest;

  const params = new URLSearchParams();

  // Optional Params if existing
  if (ids) params.append('ids', ids);
  if (urns) params.append('urns', urns);
  if (limit !== undefined) params.append('limit', limit.toString());
  if (linked_partitioning !== undefined)
    params.append('linked_partitioning', linked_partitioning.toString());

  const appendedLink = params.toString();
  return fetchWithSoundCloudAuth(
    `https://api.soundcloud.com/tracks?q=${q}&${appendedLink}`
  );
}
