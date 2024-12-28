import axios from "axios";
import { connectToDatabase } from "../../components/helpers/database/mongodb";

export default async function handler(req, res) {
  // console.log(req.query.asPath, "REQ IN HANDLERFUNCTION GETSIMILARPODCASTS");
  const podId = req.query.podId;
  //   const page = Number(req.query.page);
  //   const sortOption = req.query.sort;
  console.log(podId, "podId");

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

      const url = `https://listen-api.listennotes.com/api/v2/podcasts/${podId}/recommendations?safe_mode=0`;

      console.log(`Request URL: ${url}`);
      const response = await axios.get(url, {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
        },
      });
      // console.log(response.data, "RESPONSE.DATA for RECOMMENDATIONS");

      //   async function getPodcast(podId) {
      //     const response = await axios.get(
      //       `https://listen-api.listennotes.com/api/v2/podcasts/${podId}/recommendations?safe_mode=0`,
      //       {
      //         headers: {
      //           "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
      //         },
      //       }
      //     );
      //     console.log(response.data, "RESPONSE.DATA");
      //     return response.data;
      //   }

      //Update Cache
      //   const finalArray = [];
      console.log("ACCESS TO DATABASE CALLED%%%%%%");

      const finalArray = await Promise.all(
        response.data.recommendations.map(async (pod) => {
          const result = await getTopPods.findOne({ id: pod.id });
          // console.log(pod.id, "RESULT FROM DB CALL");
          return {
            ...pod,
            rating: result?.rating ?? null,
            numberOfRatings: result?.numberOfRatings ?? null,
            itunes: result?.itunes ?? null,
          };
        })
      );
      console.log(finalArray, "FINALARRAY");
      res.status(200).json({ data: finalArray });
    } catch (err) {
      res.status(401).json({ message: "Shit did not work" });
    }
  }
}
