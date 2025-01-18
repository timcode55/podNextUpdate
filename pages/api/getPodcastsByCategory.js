import axios from "axios";
import { connectToDatabase } from "../../components/helpers/database/mongodb";

export default async function handler(req, res) {
  const categoryId = Number(req.query.categoryId);
  const page = Number(req.query.page);
  const sortOption = req.query.sort;
  console.log(categoryId, page, sortOption, "category, page, sortOption");

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

      const url = `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${categoryId}&page=${page}&region=us&sort=${sortOption}&safe_mode=0`;

      console.log(`Request URL: ${url}`);
      const response = await axios.get(url, {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
        },
      });
      //Update Cache
      // const finalArray = [];
      console.log("ACCESS TO DATABASE CALLED%%%%%%");

      const finalArray = await Promise.all(
        response.data.podcasts.map(async (pod) => {
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

      res.status(200).json({ data: finalArray });
    } catch (err) {
      res.status(401).json({ message: "Shit did not work" });
    }
  }
}

// Simplified code to search:

// import { Client } from 'podcast-api';

// const client = Client({ apiKey: '89c65a60479f48a18b39223f8f721ef1' });

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Only GET requests are allowed' });
//   }

//   const { genreId = '67', page = '1', sortMethod = 'listen_score' } = req.query;

//   try {
//     const response = await client.fetchBestPodcasts({
//       genre_id: genreId,
//       page: parseInt(page, 10),
//       region: 'us',
//       sort: sortMethod,
//       safe_mode: 0,
//     });

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch podcasts' });
//   }
// }
