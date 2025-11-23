import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import PodList from "../../components/podList";
import EpisodeCard from "../../components/episodeCard";
import PodcastContext from "../../store/podcastContext";
import classes from "../../styles/PodcastDetail.module.css";

export default function PodcastDetailPage() {
  const router = useRouter();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(true);
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
        podcastCtx.setRecommend(response.data.data);
        podcastCtx.setRecentUpdate("podcasts");
        setPodcast(response.data.data);
        return response.data.data;
      })
      .catch((error) => {
        console.error("Error fetching similar podcasts:", error);
      })
      .finally(() => {
        podcastCtx.setLoader(false);
      });
  }

  async function getEpisodes(podId) {
    setEpisodesLoading(true);
    try {
      const response = await axios.get(`/api/getPodcastEpisodes?id=${podId}`);
      setEpisodes(response.data.episodes || []);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setEpisodesLoading(false);
    }
  }

  useEffect(() => {
    const fetchPodcast = async () => {
      const podId = router.query.id;
      console.log(podId, "PODID IN USEEFFECT [ID]");
      if (podId) {
        try {
          const podcastData = await getPodcast(podId);
          setPodcast(podcastData);
          // Also fetch episodes
          await getEpisodes(podId);
        } catch (error) {
          console.error("Error fetching podcast:", error);
        }
      }
    };
    fetchPodcast();
  }, [router.query.id]);

  if (!podcast) {
    return <div className={classes.loading}>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <Link href="/podcasts" className={classes.backButton}>
        ← Back to Podcasts
      </Link>
      <div className={classes.toggleSection}>
        <button
          className={showEpisodes ? classes.activeTab : classes.tab}
          onClick={() => setShowEpisodes(true)}
        >
          Episodes
        </button>
        <button
          className={!showEpisodes ? classes.activeTab : classes.tab}
          onClick={() => setShowEpisodes(false)}
        >
          Similar Podcasts
        </button>
      </div>

      {showEpisodes ? (
        <div className={classes.episodesSection}>
          <h1 className={classes.sectionTitle}>Recent Episodes</h1>
          {episodesLoading ? (
            <div className={classes.loading}>Loading episodes...</div>
          ) : episodes.length > 0 ? (
            <div className={classes.episodesList}>
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          ) : (
            <p className={classes.noEpisodes}>No episodes available</p>
          )}
        </div>
      ) : (
        <div className={classes.similarSection}>
          <h1 className={classes.sectionTitle}>Recommended Similar Podcasts</h1>
          <PodList podcasts={podcastCtx.recommend} />
        </div>
      )}
    </div>
  );
}
