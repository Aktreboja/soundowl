import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSpotifyRedirectUri } from '../../../../lib/spotify-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/?error=missing_code_or_state`
    );
  }

  // Verify state
  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_auth_state')?.value;
  const codeVerifier = cookieStore.get('spotify_code_verifier')?.value;
  const storedRedirectUri = cookieStore.get('spotify_redirect_uri')?.value;

  console.log('storedState', storedState);
  console.log('state', state);
  console.log('codeVerifier', codeVerifier);
  console.log('storedRedirectUri', storedRedirectUri);

  if (!storedState || storedState !== state) {
    console.error('State mismatch:', storedState, state);
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/?error=state_mismatch`
    );
  }

  if (!codeVerifier) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/?error=missing_code_verifier`
    );
  }

  // Use stored redirect URI if available, otherwise construct it (backward compatibility)
  const redirectUri = storedRedirectUri || getSpotifyRedirectUri();

  // Clear the state, code verifier, and redirect URI cookies
  cookieStore.delete('spotify_auth_state');
  cookieStore.delete('spotify_code_verifier');
  cookieStore.delete('spotify_redirect_uri');

  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/?error=spotify_not_configured`
    );
  }

  try {
    // Exchange code for access token using PKCE (no client secret needed!)
    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      console.error('Redirect URI used in token exchange:', redirectUri);
      console.error('Stored redirect URI from cookie:', storedRedirectUri);
      console.error(
        'Constructed redirect URI (fallback):',
        getSpotifyRedirectUri()
      );

      // Try to parse error for more details
      let errorDetails = errorData;
      try {
        const parsed = JSON.parse(errorData);
        errorDetails = JSON.stringify(parsed, null, 2);
        console.error('Parsed error details:', parsed);
      } catch {
        // Not JSON, use as-is
      }

      const errorMessage = errorData.includes('redirect_uri')
        ? 'redirect_uri_mismatch'
        : 'token_exchange_failed';
      return NextResponse.redirect(
        `${
          process.env.AUTH0_BASE_URL || 'http://localhost:3000/getting-started'
        }/?error=${errorMessage}`
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

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.AUTH0_BASE_URL || 'http://localhost:3000/getting-started'}`
    );
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000/getting-started'
      }/?error=callback_error`
    );
  }
}
