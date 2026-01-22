import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSpotifyRedirectUri } from '../../../../lib/spotify-config';
import { verifyAndConsumeOAuthState } from '../../../../lib/mongodb/oauth-state';

/**
 * Handles Spotify OAuth callback.
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
      `${baseUrl}/?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/?error=missing_code_or_state`);
  }

  // Verify state for CSRF protection using MongoDB
  // This also consumes (deletes) the state to prevent replay attacks
  const storedState = await verifyAndConsumeOAuthState(state, 'spotify');

  if (!storedState) {
    console.error('State verification failed - state not found or expired:', {
      state,
    });
    return NextResponse.redirect(`${baseUrl}/?error=state_mismatch`);
  }

  const cookieStore = await cookies();

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify credentials');
    return NextResponse.redirect(`${baseUrl}/?error=spotify_not_configured`);
  }

  const redirectUri = getSpotifyRedirectUri();

  try {
    // Exchange code for access token using client credentials (standard Authorization Code flow)
    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
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
        `${baseUrl}/getting-started?error=${errorMessage}`
      );
    }

    const tokenData = await tokenResponse.json();

    // Store tokens in cookies
    cookieStore.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600, // Default to 1 hour
    });

    if (tokenData.refresh_token) {
      cookieStore.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Redirect to getting-started page
    return NextResponse.redirect(`${baseUrl}/getting-started`);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${baseUrl}/getting-started?error=callback_error`
    );
  }
}
