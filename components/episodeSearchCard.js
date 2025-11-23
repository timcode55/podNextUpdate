import classes from "./episodeSearchCard.module.css";
import Link from "next/link";
import { useContext } from "react";
import PodcastContext from "../store/podcastContext";

const EpisodeSearchCard = ({ episode }) => {
  const podcastCtx = useContext(PodcastContext);
  const isSaved = podcastCtx.isEpisodeSaved(episode.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      podcastCtx.removeFromSavedEpisodes(episode.id);
    } else {
      podcastCtx.addToSavedEpisodes(episode);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={classes.episodeSearchCard}>
      <button
        className={classes.saveButton}
        onClick={handleSaveClick}
        aria-label={isSaved ? "Remove from saved" : "Save for later"}
      >
        {isSaved ? "✓" : "+"}
      </button>
      <div className={classes.episodeContent}>
        <div className={classes.imageSection}>
          {episode.image && (
            <img
              src={episode.image}
              alt={episode.title}
              className={classes.episodeImage}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <div className={classes.episodeDetails}>
          <div className={classes.podcastInfo}>
            <Link
              href={`/podcasts/${episode.podcast.id}`}
              className={classes.podcastLink}
            >
              {episode.podcast.title}
            </Link>
            {episode.podcast.publisher && (
              <span className={classes.publisher}>
                by {episode.podcast.publisher}
              </span>
            )}
          </div>
          <h3 className={classes.episodeTitle}>{episode.title}</h3>
          <div className={classes.episodeMeta}>
            <span className={classes.episodeDate}>
              {formatDate(episode.pub_date_ms)}
            </span>
            <span className={classes.separator}>•</span>
            <span className={classes.episodeDuration}>
              {formatDuration(episode.audio_length_sec)}
            </span>
          </div>
          <p className={classes.episodeDescription}>
            {episode.description
              ? episode.description
                  .replace(/(<([^>]+)>)/gi, "")
                  .substring(0, 200)
              : "No description available"}
            ...
          </p>
          <div className={classes.episodeActions}>
            {episode.audio && (
              <a
                href={episode.audio}
                target="_blank"
                rel="noreferrer"
                className={classes.listenButton}
              >
                Listen
              </a>
            )}
            {episode.listennotes_url && (
              <a
                href={episode.listennotes_url}
                target="_blank"
                rel="noreferrer"
                className={classes.detailsButton}
              >
                More Info
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeSearchCard;
