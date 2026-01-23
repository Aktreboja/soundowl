import { fetchWithSoundCloudAuth } from '@/app/utils';

export async function GET() {
  return fetchWithSoundCloudAuth('https://api.soundcloud.com/me/likes/tracks');
}
