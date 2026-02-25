import { fetchWithSoundCloudAuth } from '@/app/utils';

// Retrieve related tracks for a SoundCloud track by its ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  const { trackId } = await params;

  const url = `https://api.soundcloud.com/tracks/${trackId}/related`;
  return fetchWithSoundCloudAuth(url);
}
