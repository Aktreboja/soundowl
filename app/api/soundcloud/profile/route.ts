import { fetchWithSoundCloudAuth } from '@/app/utils';

export async function GET() {
  // fetchWithSoundCloudAuth handles:
  // - Getting access token from cookies
  // - Refreshing token if missing or expired
  // - Making authenticated request with retry on 401
  // - Returning NextResponse with data or error
  return fetchWithSoundCloudAuth('https://api.soundcloud.com/me');
}
