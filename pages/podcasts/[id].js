import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import PodList from "../../components/podList";
import PodcastContext from "../../store/podcastContext";

export default function PodcastDetailPage() {
  const router = useRouter();
  const [podcast, setPodcast] = useState(null);
  const podcastCtx = useContext(PodcastContext);

  console.log(router, "ROUTER");

  async function getPodcast(podId) {
    podcastCtx.setLoader(true);
    console.log(podId, "PODID IN GETPODCAST FUNCTION");
    axios
      .get(`/api/getSimilarPodcasts?podId=${podId}`)
      .then((response) => {
        console.log(response.data.data, "response.data TESTING*********");
        podcastCtx.setPodcasts(response.data.data);
        podcastCtx.setRecentUpdate("podcasts");
        setPodcast(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching recommended podcasts:", error);
        podcastCtx.setLoader(false);
      });

    return response.data.data;
  }

  useEffect(() => {
    const fetchPodcast = async () => {
      const podId = router.query.id;
      console.log(podId, "PODID IN USEEFFECT [ID]");
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
  }, [router.query.podId]);

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
