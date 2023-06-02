import { useContext } from "react";
import Filter from "../../components/filter";
import PodList from "../../components/podList";
import classes from "./recommend.module.css";
import PodcastContext from "../../store/podcastContext";

export default function Recommend(props) {
  const podcastCtx = useContext(PodcastContext);

  return (
    <div className={classes.mainContainer}>
      <h1>Recommend Page</h1>
      <Filter />
      {podcastCtx.recommend && <PodList podcasts={podcastCtx.recommend} />}
    </div>
  );
}
