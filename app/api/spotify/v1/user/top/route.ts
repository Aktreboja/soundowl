import { fetchWithSpotifyAuth } from '@/app/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('time_range') || 'short_term';
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';
  const type = searchParams.get('type') || 'tracks';

  const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`;

  // fetchWithSpotifyAuth handles:
  // - Getting access token from cookies
  // - Refreshing token if missing or expired
  // - Making authenticated request with retry on 401
  // - Returning NextResponse with data or error
  return fetchWithSpotifyAuth(url);
}
