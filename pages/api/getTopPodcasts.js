import { connectToDatabase } from "../../components/helpers/database/mongodb";

export default async function handler(req, res) {
  let value = decodeURIComponent(req.query.genre);

  if (req.method === "GET") {
    let mongoClient;
    try {
      mongoClient = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: "Could not connect to the DB" });
      return;
    }
    try {
      const db = mongoClient.db();
      const getTopPods = db.collection("ratings");

      const result = await getTopPods
        .find({
          rating: { $gte: Number(req.query.rating) },
          numberOfRatings: { $gte: Number(req.query.numberRatings) },
          listenNotesGenre: req.query.genre,
        })
        .toArray();

      // console.log(result, "gettoppodcasts from Mongodb");

      // client.close();

      res
        .status(201)
        .json({ message: "Top Podcasts Successfully found", data: result });
    } catch (e) {
      res
        .status(501)
        .json({ error: "There was an error getting the Top Podcasts" });
    }
  }
}
