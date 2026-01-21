/**
 * MongoDB Connection Module
 *
 * WINDOWS 11 FIXES APPLIED:
 * =========================
 * Node.js on Windows 11 has issues resolving MongoDB Atlas SRV DNS records (querySrv ECONNREFUSED).
 *
 * Solutions implemented:
 * 1. DNS Configuration: Force Node.js to use reliable DNS servers (Cloudflare, Google) that support SRV records
 * 2. IPv4 Preference: Set DNS to prefer IPv4 over IPv6 (Windows often prioritizes IPv6 which causes issues)
 * 3. SRV to Standard Conversion: Automatically convert mongodb+srv:// connection strings to mongodb:// format
 *    - This bypasses the MongoDB driver's internal SRV resolution which fails on Windows
 *    - Manually resolves SRV records using Node.js DNS (which works) and builds standard connection string
 * 4. TLS Configuration: MongoDB Atlas requires TLS for standard connection strings (non-SRV)
 *
 * These fixes ensure MongoDB Atlas connections work reliably on Windows 11 without requiring
 * OS-level DNS changes or firewall modifications.
 */

import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import dns from 'dns';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MongoDB URI');
}

const MONGODB_URI: string = uri;

// Configure DNS for Windows 11 compatibility
// Use reliable DNS servers that support SRV records and prefer IPv4
try {
  dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']); // Cloudflare, Google DNS
  dns.setDefaultResultOrder('ipv4first'); // Prefer IPv4 over IPv6
} catch (error) {
  console.warn('Could not configure DNS servers:', error);
}

// MongoDB connection options
const clientOptions: MongoClientOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 1,
  // TLS required for MongoDB Atlas standard connection strings
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
};

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Converts MongoDB SRV connection string to standard format
 * This bypasses Windows DNS SRV resolution issues
 */
async function convertSrvToStandard(uri: string): Promise<string | null> {
  // Parse MongoDB SRV URI: mongodb+srv://[username:password@]host[/database][?options]
  const srvMatch = uri.match(
    /^mongodb\+srv:\/\/(?:([^:]+):([^@]+)@)?([^/?]+)(\/[^?]*)?(\?.*)?$/
  );
  if (!srvMatch) {
    return null;
  }

  const [, username, password, hostname, database, options] = srvMatch;

  try {
    // Resolve SRV records manually using configured DNS servers
    const srvRecords = await new Promise<dns.SrvRecord[]>((resolve, reject) => {
      dns.resolveSrv(`_mongodb._tcp.${hostname}`, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });

    if (srvRecords.length === 0) {
      return null;
    }

    // Build standard connection string from SRV records
    const hosts = srvRecords
      .map((record) => `${record.name}:${record.port || 27017}`)
      .join(',');
    const auth =
      username && password
        ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
        : '';
    const dbPath = database || '';

    // Parse and merge options
    const queryParams = new URLSearchParams();
    if (options) {
      const cleanOptions = options.startsWith('?') ? options.slice(1) : options;
      new URLSearchParams(cleanOptions).forEach((value, key) => {
        queryParams.set(key, value);
      });
    }

    // Ensure required Atlas options
    if (!queryParams.has('retryWrites')) queryParams.set('retryWrites', 'true');
    if (!queryParams.has('w')) queryParams.set('w', 'majority');
    if (!queryParams.has('tls')) queryParams.set('tls', 'true');

    return `mongodb://${auth}${hosts}${dbPath}?${queryParams.toString()}`;
  } catch (error) {
    console.error('Failed to convert SRV to standard format:', error);
    return null;
  }
}

/**
 * Initializes MongoDB client with Windows 11 compatibility fixes
 */
async function initializeMongoClient(): Promise<MongoClient> {
  let connectionUri = MONGODB_URI;

  // Convert SRV connection strings to standard format to bypass Windows DNS issues
  if (MONGODB_URI.startsWith('mongodb+srv://')) {
    const standardUri = await convertSrvToStandard(MONGODB_URI);
    if (standardUri) {
      connectionUri = standardUri;
    } else {
      throw new Error(
        'Failed to convert SRV connection string. ' +
          'Please use a standard MongoDB connection string from Atlas, or check your DNS configuration.'
      );
    }
  }

  return new MongoClient(connectionUri, clientOptions);
}

// Initialize client promise
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = initializeMongoClient()
      .then((client) => client.connect())
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = initializeMongoClient()
    .then((client) => client.connect())
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
}

/**
 * Connects to the MongoDB database
 * @returns Database instance
 */
export async function connectToDatabase(): Promise<Db> {
  const client = await clientPromise;
  // Use 'Soundowl' to match existing database (MongoDB is case-sensitive)
  return client.db('Soundowl');
}

export default clientPromise;
