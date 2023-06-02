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
  const podcastCtx = useContext(PodcastContext);

  const handleRatingInput = (e) => {
    e.preventDefault();
    podcastCtx.setRating(e.target.value);
    setRating(e.target.value);
  };

  const handleGenreInput = (e) => {
    e.preventDefault();
    podcastCtx.setGenre(e.target.value);
    setGenre(e.target.value);
  };

  const handleNumRatingsInput = (e) => {
    e.preventDefault();
    podcastCtx.setNumberRatings(e.target.value);
    setNumRatingsFilter(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();

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
      const result = topPods.data.data.sort((a, b) => {
        return b.rating - a.rating;
      });
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
        <h1 className={classes.title}>SEARCH BY RATING</h1>
        <form className={classes.formWrapper}>
          <div className={classes.filterSelection}>
            <div className={classes.filterWrapper}>
              <p className={classes.filterTitle}>Enter Min Rating</p>
              <select
                className="selection"
                name="scripts"
                onChange={handleRatingInput}
                style={{ marginLeft: "10px" }}
              >
                {ratings.map((item) => (
                  <option key={item.id} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={classes.filterSelection}>
            <div className={classes.filterWrapper}>
              <p className={classes.filterTitle}>Enter # of Ratings</p>
              <select
                className="selection"
                name="scripts"
                onChange={handleNumRatingsInput}
                style={{ marginLeft: "10px" }}
              >
                {filterNumberRatings.map((item) => (
                  <option key={item.id} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={classes.filterSelection}>
            <div className={classes.filterWrapper}>
              <p className={classes.filterTitle}>Genre</p>
              <select
                className="selection"
                name="scripts"
                onChange={handleGenreInput}
                style={{ marginLeft: "10px" }}
              >
                {categoriesArray.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
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
