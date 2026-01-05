import { fetchWithSpotifyAuth } from '@/app/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artistIds = searchParams.get('artist_ids');
  const url = `https://api.spotify.com/v1/artists/${artistIds}`;

  return fetchWithSpotifyAuth(url);
}
