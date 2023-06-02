import { useContext, useState } from "react";
import PodCard from "./podCard";
import classes from "./podList.module.css";
import Arrow from "./arrow";
import PodcastContext from "../store/podcastContext";

const PodList = (props) => {
  const PodcastCtx = useContext(PodcastContext);
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
              props?.podcasts?.map((pod) => (
                <div key={pod.id}>
                  <PodCard key={pod.id} podcast={pod} />
                </div>
              ))}
          </div>
        </div>
      )}
      {!PodcastCtx.loader && PodcastCtx.recent !== "recommend" ? (
        <Arrow
          getNewPodcasts={props.getNewPodcasts}
          renderCache={props.renderCache}
          podCache={props.podCache}
        />
      ) : null}
    </div>
  );
};

export default PodList;
