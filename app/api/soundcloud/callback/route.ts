import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSoundCloudRedirectUri } from '../../../../lib/soundcloud-config';
import { verifyAndConsumeOAuthState } from '../../../../lib/mongodb/oauth-state';

/**
 * Handles SoundCloud OAuth callback.
 * Exchanges authorization code for access/refresh tokens using client credentials.
 *
 * State verification is done via MongoDB instead of cookies to avoid
 * browser cookie issues during OAuth redirect flows.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(
      `${baseUrl}/soundcloud?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/soundcloud?error=missing_code_or_state`
    );
  }

  // Verify state for CSRF protection using MongoDB
  // This also consumes (deletes) the state to prevent replay attacks
  const storedState = await verifyAndConsumeOAuthState(state, 'soundcloud');

  if (!storedState) {
    console.error('State verification failed - state not found or expired:', {
      state,
    });
    return NextResponse.redirect(`${baseUrl}/soundcloud?error=state_mismatch`);
  }

  // Retrieve code_verifier from stored state (required for PKCE)
  const codeVerifier = storedState.codeVerifier;
  if (!codeVerifier) {
    console.error('Code verifier not found in stored state');
    return NextResponse.redirect(
      `${baseUrl}/soundcloud?error=missing_code_verifier`
    );
  }

  const cookieStore = await cookies();

  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing SoundCloud credentials');
    return NextResponse.redirect(
      `${baseUrl}/soundcloud?error=soundcloud_not_configured`
    );
  }

  const redirectUri = getSoundCloudRedirectUri();

  try {
    // Exchange code for access token using PKCE (OAuth 2.1 Authorization Code flow)
    // SoundCloud uses secure.soundcloud.com/oauth/token for token exchange
    const tokenResponse = await fetch(
      'https://secure.soundcloud.com/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json; charset=utf-8',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
          code: code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      console.error('Redirect URI used:', redirectUri);

      const errorMessage = errorData.includes('redirect_uri')
        ? 'redirect_uri_mismatch'
        : 'token_exchange_failed';
      return NextResponse.redirect(
        `${baseUrl}/soundcloud?error=${errorMessage}`
      );
    }

    const tokenData = await tokenResponse.json();

    // Store tokens in cookies
    cookieStore.set('soundcloud_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600, // Default to 1 hour
    });

    if (tokenData.refresh_token) {
      cookieStore.set('soundcloud_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Redirect to soundcloud page
    return NextResponse.redirect(`${baseUrl}/soundcloud`);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${baseUrl}/soundcloud?error=callback_error`);
  }
}
