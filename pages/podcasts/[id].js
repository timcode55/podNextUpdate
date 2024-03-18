import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import PodList from "../../components/podList";

async function getPodcast(podId) {
  const response = await axios.get(
    `https://listen-api.listennotes.com/api/v2/podcasts/${podId}/recommendations?safe_mode=0`,
    {
      headers: {
        "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
      },
    }
  );
  console.log(response.data, "RESPONSE.DATA");
  return response.data;
}

export default function PodcastDetailPage() {
  const router = useRouter();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      const podId = router.query.id;
      if (podId) {
        try {
          const podcastData = await getPodcast(podId);
          setPodcast(podcastData);
        } catch (error) {
          console.error("Error fetching podcast:", error);
        }
      }
    };
    fetchPodcast();
  }, [router.query.id]);

  if (!podcast) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="recommend-title">Recommended Similar Podcasts</h1>
      <h2>{podcast.description}</h2>
      <PodList podcasts={podcast.recommendations} />
    </div>
  );
}
