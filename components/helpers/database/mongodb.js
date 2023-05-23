import { MongoClient } from "mongodb";

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("Error connecting to database: ", error);
    throw error;
  }
}

export function getClient() {
  return cachedClient;
}
