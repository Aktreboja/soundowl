import { fetchWithSpotifyAuth } from '@/app/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const url = `https://api.spotify.com/v1/albums/${id}`;
  return fetchWithSpotifyAuth(url);
}
