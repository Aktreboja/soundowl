import { NextResponse } from 'next/server';
import { getSpotifyRedirectUri } from '../../../../lib/spotify-config';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = getSpotifyRedirectUri();
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';

  return NextResponse.json({
    clientId: clientId ? `${clientId.substring(0, 10)}...` : 'NOT SET',
    redirectUri,
    baseUrl,
    message:
      'Make sure the redirectUri above EXACTLY matches what you have in your Spotify app settings (including http/https, port, and trailing slashes)',
  });
}
