import { NextResponse } from 'next/server';
import { ensureSpotifyAccessToken } from '@/app/utils';

const SPOTIFY_BASE = 'https://api.spotify.com/v1';
const WEEKS_CUTOFF = 12;
const MAX_ALBUMS = 50;
const BATCH_SIZE = 15;

type SimplifiedAlbum = {
  id: string;
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  artists: Array<{ id: string; name: string; href: string; uri: string; external_urls: { spotify: string } }>;
  images: Array<{ url: string; height: number | null; width: number | null }>;
  album_type: string;
  total_tracks: number;
  href: string;
  uri: string;
  external_urls: { spotify: string };
  type: 'album';
  available_markets?: string[];
};

function parseReleaseDate(rd: string, precision: string): number {
  const [y, m, d] = rd.split('-').map((n) => parseInt(n, 10) || 0);
  const year = y || 0;
  const month = m || 1;
  const day = d || 1;
  return new Date(year, month - 1, day).getTime();
}

async function fetchWithToken(
  url: string,
  token: string
): Promise<Response> {
  return fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function GET() {
  const tokenResult = await ensureSpotifyAccessToken();
  if (!tokenResult.success) {
    return tokenResult.response;
  }
  const token = tokenResult.token;

  const artistIds: string[] = [];
  let followingUrl: string | null = `${SPOTIFY_BASE}/me/following?type=artist&limit=50`;

  while (followingUrl) {
    const res = await fetchWithToken(followingUrl, token);
    if (res.status === 403) {
      const fallback = await fetchWithToken(
        `${SPOTIFY_BASE}/browse/new-releases?limit=${MAX_ALBUMS}`,
        token
      );
      if (fallback.ok) {
        const data = await fallback.json();
        return NextResponse.json(data);
      }
      return NextResponse.json(
        { error: 'Missing user-follow-read scope. Add it to SPOTIFY_API_SCOPES.' },
        { status: 403 }
      );
    }
    if (!res.ok) {
      const fallback = await fetchWithToken(
        `${SPOTIFY_BASE}/browse/new-releases?limit=${MAX_ALBUMS}`,
        token
      );
      if (fallback.ok) {
        const data = await fallback.json();
        return NextResponse.json(data);
      }
      return NextResponse.json(
        { error: 'Failed to load followed artists' },
        { status: res.status }
      );
    }
    const data = await res.json();
    const items = data?.artists?.items ?? [];
    items.forEach((a: { id: string }) => artistIds.push(a.id));
    const next = data?.artists?.next;
    followingUrl = next || null;
  }

  if (artistIds.length === 0) {
    const fallback = await fetchWithToken(
      `${SPOTIFY_BASE}/browse/new-releases?limit=${MAX_ALBUMS}`,
      token
    );
    if (fallback.ok) {
      const data = await fallback.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({
      albums: {
        href: `${SPOTIFY_BASE}/browse/new-releases`,
        limit: MAX_ALBUMS,
        offset: 0,
        next: null,
        previous: null,
        total: 0,
        items: [],
      },
    });
  }

  const cutoffMs = Date.now() - WEEKS_CUTOFF * 7 * 24 * 60 * 60 * 1000;
  const seen = new Set<string>();
  const albums: SimplifiedAlbum[] = [];

  for (let i = 0; i < artistIds.length; i += BATCH_SIZE) {
    const batch = artistIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((id) =>
        fetchWithToken(
          `${SPOTIFY_BASE}/artists/${id}/albums?include_groups=album,single&limit=10`,
          token
        ).then((r) => r.json())
      )
    );
    for (const body of results) {
      const items = body?.items ?? [];
      for (const album of items) {
        if (seen.has(album.id)) continue;
        const ts = parseReleaseDate(album.release_date, album.release_date_precision);
        if (ts < cutoffMs) continue;
        seen.add(album.id);
        albums.push(album);
      }
    }
  }

  albums.sort((a, b) => {
    const ta = parseReleaseDate(a.release_date, a.release_date_precision);
    const tb = parseReleaseDate(b.release_date, b.release_date_precision);
    return tb - ta;
  });

  const items = albums.slice(0, MAX_ALBUMS).map((a) => ({
    ...a,
    is_playable: (a as { is_playable?: boolean }).is_playable ?? true,
  }));

  return NextResponse.json({
    albums: {
      href: `${SPOTIFY_BASE}/browse/new-releases`,
      limit: MAX_ALBUMS,
      offset: 0,
      next: null,
      previous: null,
      total: items.length,
      items,
    },
  });
}
