import { fetchWithSpotifyAuth } from '@/app/utils';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single`;
  return fetchWithSpotifyAuth(url);
}
