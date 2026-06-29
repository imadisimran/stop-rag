import { MongoClient, Collection, Document } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) throw new Error('Missing "MONGODB_URI"');
if (!process.env.MONGODB_DB) throw new Error('Missing "MONGODB_DB"');

const client = new MongoClient(process.env.MONGODB_URI);

const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ??= client.connect())
    : client.connect();


type Collections = "users" | "incidents" | "universities";
export async function dbConnect<T extends Document>(
  collectionName: Collections
): Promise<Collection<T>> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB).collection<T>(collectionName);
}