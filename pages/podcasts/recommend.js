import { useContext } from "react";
import Filter from "../../components/filter";
import PodList from "../../components/podList";
import classes from "./recommend.module.css";
import PodcastContext from "../../store/podcastContext";

export default function Recommend(props) {
  console.log(props, "props in recoomend from DB");
  const podcastCtx = useContext(PodcastContext);
  console.log(podcastCtx, "PODCASTCTX IN recommend.js");

  return (
    <div className={classes.mainContainer}>
      <h1>Recommend Page</h1>
      <Filter />
      {podcastCtx.recommend && <PodList podcasts={podcastCtx.recommend} />}
    </div>
  );
}
