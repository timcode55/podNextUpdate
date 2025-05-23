import classes from "./podCard.module.css";
import Link from "next/link";

const PodCard = (props) => {
  const { podcast } = props;

  return (
    <div className={classes.divStyle}>
      <div className={classes.podcontainer}>
        <div className={classes.podcontent}>
          {/* <a href={podcast.listennotes_url} target="_blank" rel="noreferrer"> */}
          <Link href={`/podcasts/${podcast.id}`}>
            <img
              className={classes.podimage}
              src={podcast.image || "/gray_background.webp"}
              alt="pod1"
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent infinite loop
                e.currentTarget.src = "/gray_background.webp";
              }}
            />
          </Link>
          {/* </a> */}
          <div className={classes.podtitle}>
            <h1>{podcast.title.substring(0, 52)}</h1>
          </div>
          <div className={classes.desc}>
            <p className={classes.ptext}>
              {podcast.description
                .substring(0, 200)
                .replace(/(<([^>]+)>)/gi, "")}
              ...
            </p>
          </div>
          <div className={classes.podButtons}>
            <a href={podcast.website} target="_blank" rel="noreferrer">
              <button className={classes.webButton}>Website</button>
            </a>
            <a href={podcast.itunes} target="_blank" rel="noreferrer">
              <button className={classes.webButton}>iTunes Link</button>
            </a>
          </div>

          <div className={classes.contratings}>
            <div>
              <p className={classes.ratingtext}># of Ratings</p>
              <p className={classes.ratingtext}>{podcast.numberOfRatings}</p>
            </div>
            <div>
              <p className={classes.ratingtext}>iTunes Rating</p>
              <p className={classes.ratingtext}>{podcast.rating}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodCard;
