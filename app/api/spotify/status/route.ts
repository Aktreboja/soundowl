import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Lightweight endpoint to check if user is authenticated with Spotify.
 * Returns { authenticated: boolean } without making any external API calls.
 */
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

  // User is considered authenticated if they have either token
  // (access token can be refreshed if expired but refresh token exists)
  const authenticated = Boolean(accessToken || refreshToken);

  return NextResponse.json({ authenticated });
}
