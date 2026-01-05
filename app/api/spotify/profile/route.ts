import { fetchWithSpotifyAuth } from '@/app/utils';

export async function GET() {
  // fetchWithSpotifyAuth handles:
  // - Getting access token from cookies
  // - Refreshing token if missing or expired
  // - Making authenticated request with retry on 401
  // - Returning NextResponse with data or error
  return fetchWithSpotifyAuth('https://api.spotify.com/v1/me');
}
