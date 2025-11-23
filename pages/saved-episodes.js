import { useContext } from "react";
import Link from "next/link";
import PodcastContext from "../store/podcastContext";
import EpisodeCard from "../components/episodeCard";
import classes from "../styles/SavedEpisodes.module.css";

export default function SavedEpisodesPage() {
  const podcastCtx = useContext(PodcastContext);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Link href="/podcasts" className={classes.backButton}>
          ← Back to Podcasts
        </Link>
        <h1 className={classes.title}>Saved Episodes</h1>
        <p className={classes.subtitle}>
          {podcastCtx.savedEpisodes.length === 0
            ? "You haven't saved any episodes yet"
            : `${podcastCtx.savedEpisodes.length} episode${
                podcastCtx.savedEpisodes.length === 1 ? "" : "s"
              } saved to listen later`}
        </p>
      </div>

      {podcastCtx.savedEpisodes.length === 0 ? (
        <div className={classes.emptyState}>
          <p className={classes.emptyMessage}>
            Start exploring episodes and click the bookmark icon to save them
            for later!
          </p>
          <Link href="/podcasts" className={classes.browseButton}>
            Browse Podcasts
          </Link>
        </div>
      ) : (
        <div className={classes.episodesList}>
          {podcastCtx.savedEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}
    </div>
  );
}
