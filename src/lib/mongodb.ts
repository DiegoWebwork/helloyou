import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'coursenote_db'; // Default DB name if not in .env

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env or .env.local'
  );
}

// Cache a MongoClient connection to reuse across requests.
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    console.log('Successfully connected to MongoDB.');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    // If the connection fails, ensure we don't cache a failed client.
    cachedClient = null;
    cachedDb = null;
    throw error; // Re-throw the error to be handled by the caller.
  }
}
