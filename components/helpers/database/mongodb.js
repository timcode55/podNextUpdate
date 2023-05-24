import { MongoClient } from "mongodb";

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    console.log("Using cached database connection.");
    return cachedClient;
  }

  try {
    console.log("Connecting to the database...");
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedClient = client;
    console.log("New database connection established.");
    return client;
  } catch (error) {
    console.error("Error connecting to database: ", error);
    throw error;
  }
}

// export function getClient() {
//   return cachedClient;
// }
