import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function refreshAccessToken(
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

export async function GET() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('spotify_access_token')?.value;

  // If no access token, try to refresh
  if (!accessToken) {
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken);
      if (newToken) {
        accessToken = newToken;
        // Store the new access token
        cookieStore.set('spotify_access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 3600,
        });
      }
    }
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated with Spotify' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken !== null) {
          cookieStore.set('spotify_access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600,
          });

          // Retry the request
          const retryResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          if (retryResponse.ok) {
            const profile = await retryResponse.json();
            return NextResponse.json(profile);
          }
        }
      }

      return NextResponse.json(
        { error: 'Spotify authentication expired' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Spotify profile' },
        { status: response.status }
      );
    }

    const profile = await response.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
