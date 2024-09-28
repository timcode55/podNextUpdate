import axios from "axios";
import { connectToDatabase } from "../../components/helpers/database/mongodb";

export default async function handler(req, res) {
  console.log(req.query, "REQ.QUERY");
  const categoryId = Number(req.query.categoryId);
  const page = Number(req.query.page);
  const sortOption = req.query.sort;
  // const categoryId = 67;
  // const page = 1;
  // const sortOption = "listen_score";
  if (req.method === "GET") {
    let mongoClient;
    try {
      mongoClient = await connectToDatabase();
    } catch (error) {
      return res.status(401).json({
        message: "Sorry, DB is not working",
      });
    }
    try {
      const db = mongoClient.db();
      const getTopPods = db.collection("ratings");
      console.log(categoryId, page, sortOption, "SORTOPTION##############");
      // let sort = "listen_score";
      // if (sortOption === "recent") {
      //   sort = "recent_added_first";
      // } else if (sortOption === "popular") {
      //   sort = "listen_score";
      // }
      // console.log(sortOption, "SORT%%%%");

      const url = `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${categoryId}&page=${page}&region=us&sort=${sortOption}&safe_mode=0`;
      // const url = `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=67&page=1&region=us&sort=listen_score&safe_mode=0`;
      // const url = `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=67&page=1&region=us&sort=recent_added_first&safe_mode=0`;

      console.log(`Request URL: ${url}`); // Log the full URL to debug
      const response = await axios.get(url, {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
        },
      });
      //Update Cache
      const finalArray = [];
      console.log("ACCESS TO DATABASE CALLED%%%%%%");
      for (let pod of response.data.podcasts) {
        const result = await getTopPods.find({ id: pod.id }).toArray();
        if (result.length > 0) {
          pod.rating = result[0].rating;
          pod.numberOfRatings = result[0].numberOfRatings;
          pod.itunes = result[0].itunes;
          pod.TESTING = "TESTING";
        } else {
          pod.rating = null;
          pod.numberOfRatings = null;
          pod.itunes = null;
        }

        finalArray.push(pod);
      }
      // console.log(finalArray, "FINALARRAY");
      res.status(200).json({ data: finalArray });
    } catch (err) {
      res.status(401).json({ message: "Shit did not work" });
    }
  }
}
