import { useContext } from "react";
import Link from "next/link";
import PodcastContext from "../store/podcastContext";
import PodList from "../components/podList";
import classes from "../styles/Favorites.module.css";

export default function FavoritesPage() {
  const podcastCtx = useContext(PodcastContext);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Link href="/podcasts" className={classes.backButton}>
          ← Back to Podcasts
        </Link>
        <h1 className={classes.title}>My Favorite Podcasts</h1>
        <p className={classes.subtitle}>
          {podcastCtx.favorites.length === 0
            ? "You haven't added any favorites yet"
            : `${podcastCtx.favorites.length} podcast${
                podcastCtx.favorites.length === 1 ? "" : "s"
              } saved`}
        </p>
      </div>

      {podcastCtx.favorites.length === 0 ? (
        <div className={classes.emptyState}>
          <p className={classes.emptyMessage}>
            Start exploring podcasts and click the heart icon to save your
            favorites!
          </p>
          <Link href="/podcasts" className={classes.browseButton}>
            Browse Podcasts
          </Link>
        </div>
      ) : (
        <PodList podcasts={podcastCtx.favorites} />
      )}
    </div>
  );
}
