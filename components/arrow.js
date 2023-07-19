import arrow from "./arrow.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareLeft,
  faCaretSquareRight,
} from "@fortawesome/free-solid-svg-icons";
import PodcastContext from "../store/podcastContext";
import { useContext } from "react";

const Arrow = (props) => {
  const PodcastCtx = useContext(PodcastContext);
  const page = PodcastCtx.page;

  const addPage = async () => {
    PodcastCtx.setPage(PodcastCtx.page + 1);
    const key = `${PodcastCtx.category?.id}_${PodcastCtx.page + 1}`;
    console.log(props.podCache, "PROPS.PODCACHE IN ARROW");
    if (props.podCache[key]) {
      props.renderCache(key);
    } else {
      await props.getNewPodcasts(PodcastCtx.category?.id, PodcastCtx.page + 1);
    }
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const subPage = async () => {
    PodcastCtx.setPage(PodcastCtx.page - 1);
    const key = `${PodcastCtx.category?.id}_${PodcastCtx.page - 1}`;
    if (props.podCache[key]) {
      props.renderCache(key);
    } else {
      await props.getNewPodcasts(PodcastCtx.category?.id, PodcastCtx.page - 1);
    }
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };
  return (
    <div className={arrow.page}>
      {page > 1 && (
        <FontAwesomeIcon
          icon={faCaretSquareLeft}
          className={arrow.arrow_left}
          onClick={subPage}
        />
      )}
      <FontAwesomeIcon
        icon={faCaretSquareRight}
        className={arrow.arrow_right}
        onClick={addPage}
      />
    </div>
  );
};

export default Arrow;
