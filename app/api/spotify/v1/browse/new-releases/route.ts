import { fetchWithSpotifyAuth } from '@/app/utils';

export async function GET(request: Request) {
  const url = `https://api.spotify.com/v1/browse/new-releases?limit=50`;
  return fetchWithSpotifyAuth(url);
}
