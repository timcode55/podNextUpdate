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
      console.log(
        PodcastCtx.category?.id,
        PodcastCtx.page + 1,
        PodcastCtx.order,
        "category.id, page, order&&&&&&&&&&&&&&"
      );
      await props.getNewPodcasts(
        PodcastCtx.category?.id,
        PodcastCtx.page + 1,
        PodcastCtx.order
      );
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
      console.log(
        PodcastCtx.category?.id,
        PodcastCtx.page + 1,
        PodcastCtx.order,
        "category.id, page, order&&&&&&&&&&&&&&"
      );
      await props.getNewPodcasts(
        PodcastCtx.category?.catId,
        PodcastCtx.page,
        PodcastContext.order
      );
    }
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };
  return (
    <div className={arrow.page}>
      {page > 1 && !PodcastCtx.recommend && (
        <FontAwesomeIcon
          icon={faCaretSquareLeft}
          className={arrow.arrow_left}
          onClick={subPage}
        />
      )}
      {!PodcastCtx.recommend && (
        <FontAwesomeIcon
          icon={faCaretSquareRight}
          className={arrow.arrow_right}
          onClick={addPage}
        />
      )}
    </div>
  );
};

export default Arrow;
