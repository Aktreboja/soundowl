import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Clear Spotify tokens
  cookieStore.delete('spotify_access_token');
  cookieStore.delete('spotify_refresh_token');
  cookieStore.delete('spotify_auth_state');
  cookieStore.delete('spotify_code_verifier');

  return NextResponse.json({ success: true });
}
