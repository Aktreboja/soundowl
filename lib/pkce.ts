import crypto from 'crypto';

/**
 * Generates a cryptographically random code verifier for PKCE
 * Returns a base64url-encoded string of 32 random bytes
 */
export function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

/**
 * Generates a code challenge from a code verifier using SHA256
 * This is the S256 method required by SoundCloud OAuth 2.1
 */
export function generateCodeChallenge(verifier: string): string {
  return base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
}

/**
 * Base64 URL-safe encoding (RFC 4648)
 * Converts base64 to base64url by replacing + with -, / with _, and removing padding =
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
