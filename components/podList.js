import { useContext, useState } from "react";
import PodCard from "./podCard";
import classes from "./podList.module.css";
import Arrow from "./arrow";
import PodcastContext from "../store/podcastContext";

const PodList = (props) => {
  // const [podcasts, setPodcasts] = useState(props.podcasts);
  const PodcastCtx = useContext(PodcastContext);
  console.log(PodcastCtx, "PODCASTCTX IN PODLIST");
  console.log(props, "PROPS IN PODLIST");
  // console.log(PodcastCtx.loader, "loader - isLoading?");
  return (
    <div className={classes.outerContainer}>
      {PodcastCtx.loader ? (
        <div className={classes.loadContainer}>
          <div className={classes.loader}>
            <div className={`${classes.inner} ${classes.one}`}></div>
            <div className={`${classes.inner} ${classes.two}`}></div>
            <div className={`${classes.inner} ${classes.three}`}></div>
          </div>
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.podcastDisplay}>
            {props.podcasts &&
              props.podcasts.map((pod) => (
                <div key={pod.id}>
                  <PodCard key={pod.id} podcast={pod} />
                </div>
              ))}
          </div>
        </div>
      )}
      {/* {!PodcastCtx.loader ? <Arrow /> : null} */}
      {<Arrow />}
    </div>
  );
};

export default PodList;
