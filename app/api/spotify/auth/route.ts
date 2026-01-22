import { NextResponse } from 'next/server';
import { getSpotifyRedirectUri } from '../../../../lib/spotify-config';
import {
  generateState,
  storeOAuthState,
} from '../../../../lib/mongodb/oauth-state';

/**
 * Initiates Spotify OAuth Authorization Code flow.
 * Uses standard Authorization Code flow (with client secret) instead of PKCE
 * since this is a confidential client (server-side Next.js app).
 *
 * State is stored in MongoDB instead of cookies to avoid browser cookie
 * issues during OAuth redirect flows.
 */
export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = getSpotifyRedirectUri();

  if (!clientId) {
    return NextResponse.json(
      { error: 'Spotify Client ID not configured' },
      { status: 500 }
    );
  }

  // Generate a cryptographically secure state for CSRF protection
  const state = generateState();

  // Store state in MongoDB for verification in callback
  // This is more reliable than cookies which can be lost in OAuth redirect chains
  await storeOAuthState(state, 'spotify');

  const scope = process.env.SPOTIFY_API_SCOPES as string;
  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(authUrl);
}
