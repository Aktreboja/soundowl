import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/dashboard?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/dashboard?error=missing_code_or_state`
    );
  }

  // Verify state
  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_auth_state')?.value;
  const codeVerifier = cookieStore.get('spotify_code_verifier')?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/dashboard?error=state_mismatch`
    );
  }

  if (!codeVerifier) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/dashboard?error=missing_code_verifier`
    );
  }

  // Clear the state and code verifier cookies
  cookieStore.delete('spotify_auth_state');
  cookieStore.delete('spotify_code_verifier');

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ||
    `${
      process.env.AUTH0_BASE_URL || 'http://localhost:3000'
    }/api/spotify/callback`;

  if (!clientId) {
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/dashboard?error=spotify_not_configured`
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
      console.error('Redirect URI used:', redirectUri);
      const errorMessage = errorData.includes('redirect_uri')
        ? 'redirect_uri_mismatch'
        : 'token_exchange_failed';
      return NextResponse.redirect(
        `${
          process.env.AUTH0_BASE_URL || 'http://localhost:3000'
        }/dashboard?error=${errorMessage}`
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
      `${process.env.AUTH0_BASE_URL || 'http://localhost:3000'}/dashboard`
    );
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${
        process.env.AUTH0_BASE_URL || 'http://localhost:3000'
      }/dashboard?error=callback_error`
    );
  }
}
