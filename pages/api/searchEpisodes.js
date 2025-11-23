import axios from "axios";

export default async function handler(req, res) {
  const { q, page = 1 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const response = await axios.get(
      `https://listen-api.listennotes.com/api/v2/search`,
      {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
        },
        params: {
          q: q,
          type: "episode",
          page_size: 20,
          offset: (page - 1) * 20,
        },
      }
    );

    // Format episodes with podcast information
    const episodes = response.data.results.map((episode) => ({
      id: episode.id,
      title: episode.title_original || episode.title,
      description: episode.description_original || episode.description || "",
      audio: episode.audio || null,
      audio_length_sec: episode.audio_length_sec || 0,
      pub_date_ms: episode.pub_date_ms,
      image: episode.image || episode.thumbnail,
      listennotes_url: episode.listennotes_url,
      podcast: {
        id: episode.podcast?.id,
        title: episode.podcast?.title_original || episode.podcast_title_original,
        image: episode.podcast?.image || episode.podcast_thumbnail,
        publisher: episode.podcast?.publisher_original || episode.publisher_original,
        listennotes_url: episode.podcast?.listennotes_url,
      },
    }));

    res.status(200).json({
      data: episodes,
      total: response.data.total,
      count: response.data.count,
      next_offset: response.data.next_offset,
    });
  } catch (error) {
    console.error("Episode search error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to search episodes",
      details: error.response?.data?.error || error.message,
    });
  }
}
