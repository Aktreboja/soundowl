/**
 * OAuth State Management
 *
 * Stores OAuth state tokens in MongoDB instead of cookies to avoid
 * browser cookie issues during OAuth redirect flows.
 *
 * Features:
 * - Automatic expiration (10 minutes TTL)
 * - One-time use (state is deleted after verification)
 * - Supports additional metadata storage
 */

import crypto from 'crypto';
import { connectToDatabase } from './index';

interface OAuthState {
  state: string;
  provider: 'spotify' | 'soundcloud' | 'other';
  createdAt: Date;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
  codeVerifier?: string; // PKCE code verifier for OAuth 2.1 flows
}

const COLLECTION_NAME = 'oauth_states';
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Generates a cryptographically secure random state string
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Stores an OAuth state in MongoDB
 * @param state - The state string to store
 * @param provider - The OAuth provider (e.g., 'spotify')
 * @param metadata - Optional additional data to store with the state
 */
export async function storeOAuthState(
  state: string,
  provider: 'spotify' | 'soundcloud' | 'other' = 'spotify',
  metadata?: Record<string, unknown>,
  codeVerifier?: string
): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection<OAuthState>(COLLECTION_NAME);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + STATE_TTL_MS);

  await collection.insertOne({
    state,
    provider,
    createdAt: now,
    expiresAt,
    metadata,
    codeVerifier,
  });
}

/**
 * Verifies and consumes an OAuth state from MongoDB
 * The state is deleted after verification (one-time use)
 *
 * @param state - The state string to verify
 * @param provider - The OAuth provider to match
 * @returns The state document if valid, null if invalid or expired
 */
export async function verifyAndConsumeOAuthState(
  state: string,
  provider: 'spotify' | 'soundcloud' | 'other' = 'spotify'
): Promise<OAuthState | null> {
  const db = await connectToDatabase();
  const collection = db.collection<OAuthState>(COLLECTION_NAME);

  // Find and delete the state in one atomic operation
  const result = await collection.findOneAndDelete({
    state,
    provider,
    expiresAt: { $gt: new Date() }, // Only match non-expired states
  });

  return result ?? null;
}

/**
 * Creates a TTL index on the oauth_states collection for automatic cleanup
 * This should be called once during app initialization or migration
 */
export async function ensureOAuthStateIndexes(): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection<OAuthState>(COLLECTION_NAME);

  // Create TTL index - MongoDB will automatically delete expired documents
  await collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, background: true }
  );

  // Create index on state + provider for fast lookups
  await collection.createIndex({ state: 1, provider: 1 }, { background: true });
}
