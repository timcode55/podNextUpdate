import classes from "./filter.module.css";
import PodcastContext from "../store/podcastContext";
import { categoriesArray } from "../utils/category-list";
import { useState, useContext } from "react";
import axios from "axios";
import { filterNumberRatings } from "../utils/filterNumberRatings";
import { ratings } from "../utils/ratings";

const Filter = (props) => {
  const [rating, setRating] = useState("");
  const [genre, setGenre] = useState("AI & Data Science");
  const [numRatingsFilter, setNumRatingsFilter] = useState(10);
  // const [numberRatings, setNumberRatings] = useState("");
  // const [topPodcasts, setTopPodcasts] = useState(null);
  // const [loader, setLoader] = useState(true);
  const podcastCtx = useContext(PodcastContext);
  // console.log(podcastCtx, "PODCASTCTX IN FILTER");

  const handleRatingInput = (e) => {
    e.preventDefault();
    console.log(e.target.value, "VALUE IN SELECT BOX IN RATING 71**");
    setRating(e.target.value);
    // podcastCtx.setRating(e.target.value);
  };
  // const handleNumberRatingsInput = (e) => {
  //   e.preventDefault();
  //   setNumberRatings(e.target.value);
  //   // podcastCtx.setNumberRatings(e.target.value);
  // };

  const handleGenreInput = (e) => {
    e.preventDefault();
    console.log(e.target.value, "VALUE IN SELECT BOX IN GENRE 71**");
    setGenre(e.target.value);
  };

  const handleNumRatingsInput = (e) => {
    e.preventDefault();
    console.log(e.target.value, "VALUE IN SELECT BOX IN numratingsfilter 60**");
    setNumRatingsFilter(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(rating, "rating on click");
    console.log(genre, "genre on click");
    console.log(numRatingsFilter, "numberRatings on click");

    try {
      podcastCtx.setLoader(true);
      const stringGenre = encodeURIComponent(genre);
      const topPods = await axios.get(
        `/api/getTopPodcasts?rating=${rating}&numberRatings=${numRatingsFilter}&genre=${stringGenre}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(topPods, "topPods");
      const result = topPods.data.data.sort((a, b) => {
        return b.rating - a.rating;
      });
      console.log(result, "RESULT in Filter after sort");
      // setNumberRatings("");
      // setRating("");
      podcastCtx.setRecommend(result);
      podcastCtx.setRecentUpdate("recommend");
      podcastCtx.setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={classes.filterContainer}>
      <div className={classes.formContainer}>
        <h1 className={classes.title}>
          SEARCH BY RATING
          {/* {category.toUpperCase() || "most popular".toUpperCase()} */}
        </h1>
        <form className={classes.formWrapper}>
          <div className={classes.filterSelection}>
            <label>
              <p>Enter Min Rating</p>
              <select
                className="selection"
                name="scripts"
                onChange={handleRatingInput}
              >
                {ratings.map((item) => {
                  return (
                    <option key={item.id} value={item.value}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className={classes.filterSelection}>
            <label>
              <p>Enter # of Ratings</p>
              <select
                className="selection"
                name="scripts"
                onChange={handleNumRatingsInput}
              >
                {filterNumberRatings.map((item) => {
                  return (
                    <option key={item.id} value={item.value}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className={classes.filterSelection}>
            <label>
              <p>Genre</p>
              <select
                className="selection"
                name="scripts"
                onChange={handleGenreInput}
              >
                {categoriesArray.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className={classes.buttonWrapper}>
            <button
              className={classes.filterButton}
              type="submit"
              onClick={handleClick}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Filter;
