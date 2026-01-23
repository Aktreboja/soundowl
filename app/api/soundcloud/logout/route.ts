import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Logs out the user from SoundCloud by clearing authentication cookies.
 */
export async function GET() {
  const cookieStore = await cookies();
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://127.0.0.1:3000';

  // Clear SoundCloud authentication cookies
  cookieStore.delete('soundcloud_access_token');
  cookieStore.delete('soundcloud_refresh_token');

  // Redirect to soundcloud page
  return NextResponse.redirect(`${baseUrl}/soundcloud`);
}
