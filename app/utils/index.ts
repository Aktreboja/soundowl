import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/types/User';

/**
 * Refreshes the Spotify access token using the refresh token.
 * Uses client credentials (client_id + client_secret) for secure token refresh.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify client credentials for token refresh');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token refresh failed:', errorData);
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
  console.log(token);

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
    } else if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data: ' + (await response.text()) },
        { status: response.status }
      );
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

/**
 * Refreshes the SoundCloud access token using the refresh token.
 * Uses client credentials (client_id + client_secret) for secure token refresh.
 */
export async function refreshSoundCloudAccessToken(
  refreshToken: string
): Promise<string | null> {
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing SoundCloud client credentials for token refresh');
    return null;
  }

  try {
    // SoundCloud uses secure.soundcloud.com/oauth/token for token operations
    const response = await fetch('https://secure.soundcloud.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json; charset=utf-8',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SoundCloud token refresh failed:', errorData);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('SoundCloud token refresh error:', error);
    return null;
  }
}

/**
 * Cookie configuration for SoundCloud access tokens
 */
const SOUNDCLOUD_ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 3600, // 1 hour
};

/**
 * Gets the SoundCloud access token from cookies, refreshing if necessary.
 * Returns the token or null if authentication is not available.
 */
export async function getSoundCloudAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('soundcloud_access_token')?.value ?? null;

  // If no access token, try to refresh
  if (!accessToken) {
    const refreshToken = cookieStore.get('soundcloud_refresh_token')?.value;
    if (refreshToken) {
      const newToken = await refreshSoundCloudAccessToken(refreshToken);
      if (newToken) {
        accessToken = newToken;
        cookieStore.set(
          'soundcloud_access_token',
          accessToken,
          SOUNDCLOUD_ACCESS_TOKEN_COOKIE_OPTIONS
        );
      }
    }
  }

  return accessToken;
}

/**
 * Ensures a valid SoundCloud access token is available.
 * Returns the token or an error response if authentication fails.
 */
export async function ensureSoundCloudAccessToken(): Promise<
  { success: true; token: string } | { success: false; response: NextResponse }
> {
  const token = await getSoundCloudAccessToken();

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Not authenticated with SoundCloud' },
        { status: 401 }
      ),
    };
  }

  return { success: true, token };
}

/**
 * Makes an authenticated request to the SoundCloud API with automatic token refresh on 401.
 * Returns a NextResponse with the data or an error response if authentication fails.
 */
export async function fetchWithSoundCloudAuth(
  url: string,
  options: RequestInit = {}
): Promise<NextResponse> {
  const tokenResult = await ensureSoundCloudAccessToken();
  if (!tokenResult.success) {
    return tokenResult.response;
  }

  let accessToken = tokenResult.token;

  try {
    // SoundCloud API requires "OAuth" prefix, not "Bearer"
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `OAuth ${accessToken}`,
        accept: 'application/json; charset=utf-8',
      },
    });

    // If we get a 401, try refreshing the token once
    if (response.status === 401) {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('soundcloud_refresh_token')?.value;

      if (refreshToken) {
        const newAccessToken = await refreshSoundCloudAccessToken(refreshToken);
        if (newAccessToken) {
          accessToken = newAccessToken;
          cookieStore.set(
            'soundcloud_access_token',
            accessToken,
            SOUNDCLOUD_ACCESS_TOKEN_COOKIE_OPTIONS
          );

          // Retry the request with the new token
          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `OAuth ${accessToken}`,
              accept: 'application/json; charset=utf-8',
            },
          });
        }
      }

      // If still 401 after refresh attempt, return error
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'SoundCloud authentication expired' },
          { status: 401 }
        );
      }
    } else if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data: ' + (await response.text()) },
        { status: response.status }
      );
    }

    // Convert fetch Response to NextResponse
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('SoundCloud API request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Fetches user account from MongoDB based on Auth0 email.
 * Returns the user account or null if not found.
 */
export async function getUserAccount(email: string): Promise<User | null> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<User>('Users');
    const user = await collection.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user account:', error);
    return null;
  }
}
