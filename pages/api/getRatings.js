import {
  connectToDatabase,
  getClient,
} from "../../components/helpers/database/mongodb";

export default async function handler(req, res) {
  let id = req.query.id;
  console.log(id, "ID SENT TO GETRATINGS FUNCTION API");
  console.log(typeof id, "typeof id");

  let mongoClient;
  try {
    mongoClient = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "Could not connect to the DB" });
    return;
  }

  const db = mongoClient.db();
  const getRatingData = db.collection("ratings");

  if (req.method === "GET") {
    try {
      const getRatings = await getRatingData.findOne({ id: id });
      console.log(getRatings, "GETRATINGS FOR EACH ID***********");
      res.status(200).json({ data: getRatings });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Error finding the podcast in the database" });
    }
    res
      .status(201)
      .json({ message: "podcast successfully found in the database" });
  }
}
