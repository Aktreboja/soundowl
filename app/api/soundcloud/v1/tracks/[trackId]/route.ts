import { fetchWithSoundCloudAuth } from '@/app/utils';

// Retrieve a SoundCloud track by its ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  const { trackId } = await params;

  const url = `https://api.soundcloud.com/tracks/${trackId}`;
  return fetchWithSoundCloudAuth(url);
}
