/**
 * Gets the Spotify redirect URI from environment variables or constructs a default
 * This ensures consistency across all Spotify OAuth flows
 */
export function getSpotifyRedirectUri(): string {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }

  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/api/spotify/callback`;
}
