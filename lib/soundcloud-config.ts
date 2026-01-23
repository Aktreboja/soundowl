/**
 * Gets the SoundCloud redirect URI from environment variables or constructs a default
 * This ensures consistency across all SoundCloud OAuth flows
 */
export function getSoundCloudRedirectUri(): string {
  if (process.env.SOUNDCLOUD_REDIRECT_URI) {
    return process.env.SOUNDCLOUD_REDIRECT_URI;
  }

  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/soundcloud/callback`;
}
