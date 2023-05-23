import React, { useContext } from "react";
import "./Arrow.css";
import PodcastContext from "../store/podcastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareLeft,
  faCaretSquareRight,
} from "@fortawesome/fontawesome-free-solid";

const Arrow = (props) => {
  // const PodcastCtx = useContext(PodcastContext);
  // //   const page = state.page;

  // const addPage = async () => {
  //   setState({ ...state, page: state.page + 1 });
  //   await props.getData(state.category, state.page + 1);
  //   setTimeout(function () {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }, 600);
  // };

  // const subPage = async () => {
  //   setState({ ...state, page: state.page - 1 });
  //   await props.getData(state.category, state.page - 1);
  //   setTimeout(function () {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }, 600);
  // };

  return (
    <div className="page">
      <FontAwesomeIcon
        icon="caret-square-left"
        className={`arrow-left ${page > 1 ? "visible" : null}`}
        onClick={subPage}
      />
      <FontAwesomeIcon
        icon="caret-square-right"
        className="arrow-right"
        onClick={addPage}
      />
    </div>
  );
};

export default Arrow;
