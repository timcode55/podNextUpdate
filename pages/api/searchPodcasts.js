import axios from "axios";
import { connectToDatabase } from "../../components/helpers/database/mongodb";

export default async function handler(req, res) {
  const searchQuery = req.query.q;
  const page = Number(req.query.page) || 1;

  if (req.method === "GET") {
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

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

      // Search using ListenNotes API
      const url = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(
        searchQuery
      )}&type=podcast&page_size=20&offset=${(page - 1) * 20}`;

      console.log(`Search Request URL: ${url}`);
      const response = await axios.get(url, {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
        },
      });

      // Enrich search results with MongoDB ratings (same pattern as getPodcastsByCategory)
      const finalArray = await Promise.all(
        response.data.results.map(async (pod) => {
          const result = await getTopPods.findOne({ id: pod.id });

          // Construct iTunes link from itunes_id
          const itunesLink = pod.itunes_id
            ? `https://podcasts.apple.com/us/podcast/id${pod.itunes_id}?uo=4`
            : result?.itunes ?? null;

          return {
            ...pod,
            // Map search API field names to match category API structure
            title: pod.title_original || pod.podcast_title_original || "Untitled",
            description: pod.description_original || pod.description || "",
            website: pod.website || pod.listennotes_url || null,
            rating: result?.rating ?? null,
            numberOfRatings: result?.numberOfRatings ?? null,
            itunes: itunesLink,
          };
        })
      );

      res.status(200).json({
        data: finalArray,
        total: response.data.total,
        count: response.data.count,
        next_offset: response.data.next_offset,
      });
    } catch (err) {
      console.error("Search error:", err);
      res.status(401).json({ message: "Search failed", error: err.message });
    }
  }
}
