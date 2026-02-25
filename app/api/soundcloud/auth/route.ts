import { NextResponse } from 'next/server';
import { getSoundCloudRedirectUri } from '../../../../lib/soundcloud-config';
import {
  generateState,
  storeOAuthState,
} from '../../../../lib/mongodb/oauth-state';
import {
  generateCodeVerifier,
  generateCodeChallenge,
} from '../../../../lib/pkce';

/**
 * Initiates SoundCloud OAuth 2.1 Authorization Code flow with PKCE.
 * SoundCloud requires PKCE (Proof Key for Code Exchange) for all OAuth flows.
 *
 * State and code_verifier are stored in MongoDB instead of cookies to avoid
 * browser cookie issues during OAuth redirect flows.
 */
export async function GET() {
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const redirectUri = getSoundCloudRedirectUri();

  if (!clientId) {
    return NextResponse.json(
      { error: 'SoundCloud Client ID not configured' },
      { status: 500 }
    );
  }

  // Generate PKCE code verifier and challenge (required by SoundCloud OAuth 2.1)
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Generate a cryptographically secure state for CSRF protection
  const state = generateState();

  // Store state and code_verifier in MongoDB for verification in callback
  // This is more reliable than cookies which can be lost in OAuth redirect chains
  await storeOAuthState(state, 'soundcloud', undefined, codeVerifier);

  // Create the SoundCloud OAuth 2.1 Authorization Code flow URL
  const authUrl =
    `https://secure.soundcloud.com/authorize?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `code_challenge=${encodeURIComponent(codeChallenge)}&` +
    `code_challenge_method=S256&` +
    `state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(authUrl);
}
