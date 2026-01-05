import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Cookie configuration for Spotify access tokens
 */
const SPOTIFY_ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 3600, // 1 hour
};

/**
 * Gets the Spotify access token from cookies, refreshing if necessary.
 * Returns the token or null if authentication is not available.
 */
export async function getSpotifyAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('spotify_access_token')?.value ?? null;

  // If no access token, try to refresh
  if (!accessToken) {
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken);
      if (newToken) {
        accessToken = newToken;
        cookieStore.set(
          'spotify_access_token',
          accessToken,
          SPOTIFY_ACCESS_TOKEN_COOKIE_OPTIONS
        );
      }
    }
  }

  return accessToken;
}

/**
 * Ensures a valid Spotify access token is available.
 * Returns the token or an error response if authentication fails.
 */
export async function ensureSpotifyAccessToken(): Promise<
  { success: true; token: string } | { success: false; response: NextResponse }
> {
  const token = await getSpotifyAccessToken();

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Not authenticated with Spotify' },
        { status: 401 }
      ),
    };
  }

  return { success: true, token };
}

/**
 * Makes an authenticated request to the Spotify API with automatic token refresh on 401.
 * Returns a NextResponse with the data or an error response if authentication fails.
 */
export async function fetchWithSpotifyAuth(
  url: string,
  options: RequestInit = {}
): Promise<NextResponse> {
  const tokenResult = await ensureSpotifyAccessToken();
  if (!tokenResult.success) {
    return tokenResult.response;
  }

  let accessToken = tokenResult.token;

  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If we get a 401, try refreshing the token once
    if (response.status === 401) {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          accessToken = newAccessToken;
          cookieStore.set(
            'spotify_access_token',
            accessToken,
            SPOTIFY_ACCESS_TOKEN_COOKIE_OPTIONS
          );

          // Retry the request with the new token
          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
      }

      // If still 401 after refresh attempt, return error
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Spotify authentication expired' },
          { status: 401 }
        );
      }
    }

    // Convert fetch Response to NextResponse
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Spotify API request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
