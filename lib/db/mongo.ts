import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const options = {
  maxPoolSize: 10,
  connectTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
} else {
  const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
}

export async function getDb() {
  const client = await clientPromise;
  const dbName = (uri ?? "").match(/\/([^\/?]+)(?:\?|$)/)?.[1] ?? "osama";
  return client.db(dbName);
}

/** Lowercase, trimmed email used as the user partition key for all collections. */
export function userKey(email: string): string {
  return email.trim().toLowerCase();
}
