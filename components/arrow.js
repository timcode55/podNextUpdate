import arrow from "./arrow.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareLeft,
  faCaretSquareRight,
} from "@fortawesome/free-solid-svg-icons";

const Arrow = (props) => {
  return (
    <div className={arrow.page}>
      <FontAwesomeIcon icon={faCaretSquareLeft} className={arrow.arrow_left} />
      <FontAwesomeIcon
        icon={faCaretSquareRight}
        className={arrow.arrow_right}
      />
    </div>
  );
};

export default Arrow;
