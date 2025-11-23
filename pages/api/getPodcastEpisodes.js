import axios from "axios";

export default async function handler(req, res) {
  const podcastId = req.query.id;
  const nextEpisodePubDate = req.query.next_episode_pub_date || null;

  if (req.method === "GET") {
    if (!podcastId) {
      return res.status(400).json({ message: "Podcast ID is required" });
    }

    try {
      // Fetch podcast details with episodes from ListenNotes API
      let url = `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}?sort=recent_first`;

      // Add pagination parameter if provided
      if (nextEpisodePubDate) {
        url += `&next_episode_pub_date=${nextEpisodePubDate}`;
      }

      console.log(`Fetching episodes for podcast ${podcastId}`);
      const response = await axios.get(url, {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
        },
      });

      const podcastData = response.data;

      res.status(200).json({
        title: podcastData.title,
        publisher: podcastData.publisher,
        description: podcastData.description,
        image: podcastData.image,
        website: podcastData.website,
        total_episodes: podcastData.total_episodes,
        episodes: podcastData.episodes || [],
        next_episode_pub_date: podcastData.next_episode_pub_date || null,
      });
    } catch (err) {
      console.error("Error fetching podcast episodes:", err);
      res.status(500).json({
        message: "Failed to fetch episodes",
        error: err.message
      });
    }
  }
}
