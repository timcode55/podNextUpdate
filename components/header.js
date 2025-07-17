import React, { useState, useContext, useEffect } from "react";
import PodList from "./podList";
import { array1, array2, categoriesArray } from "../utils/category-list";
import PodcastContext from "../store/podcastContext";
import classes from "./header.module.css";
import axios from "axios";

const podCache = {};

const Header = (props) => {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState({
    catName: "Podcasts",
    catId: "67",
  });
  const [rating, setRating] = useState("");
  const [podcasts, setPodcasts] = useState(props.podcasts);
  const [loader, setLoader] = useState(false);
  const [mostRecentUpdate, setMostRecentUpdate] = useState("podcasts");
  const [sortOption, setSortOption] = useState("listen_score");
  const podcastCtx = useContext(PodcastContext);

  const handleSelect = (e) => {
    setSortOption(e.target.value);
    podcastCtx.setOrder(e.target.value);
  };

  useEffect(() => {
    async function getPodcastsAfterSort() {
      console.log(
        podcastCtx.category.id,
        podcastCtx.page,
        podcastCtx.order,
        "category.id, podcastCtx.page, sortOption********************"
      );
      try {
        await getNewPodcasts(
          podcastCtx.category.id,
          podcastCtx.page,
          podcastCtx.order
        );
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    }
    getPodcastsAfterSort();
  }, [sortOption]);

  const renderCache = (key) => {
    if (podCache[key]) {
      setPodcasts(podCache[key]);
    } else {
      getNewPodcasts(podcastCtx.category.id, podcastCtx.page, podcastCtx.order);
    }
  };

  podCache["67_1"] = props.podcasts || [];

  const handleChange = (e) => {
    setValue(e.target.value);
    let findValue = Number(e.target.value);
    let categoryName = categoriesArray.find(
      (item) => item.id === findValue
    ).name;
    let categoryId = categoriesArray.find((item) => item.id === findValue).id;
    setCategory({ catName: categoryName, catId: categoryId });
    podcastCtx.setCategory(categoryName, categoryId);
    podcastCtx.setPage(1);
    podcastCtx.setRecommend(null);
    const key = `${categoryId}_${podcastCtx.page}`;
    console.log(key, "KEY FOR CACHE");
    if (podCache[key]) {
      renderCache(key);
    } else {
      getNewPodcasts(e.target.value, 1, podcastCtx.order);
    }
  };

  async function getNewPodcasts(categoryId, page, sortMethod) {
    try {
      podcastCtx.setLoader(true);

      const { data } = await axios.get(
        `/api/getPodcastsByCategory?categoryId=${categoryId}&page=${page}&sort=${sortMethod}`
      );

      const key = `${categoryId}_${page}`;
      podCache[key] = data.data || [];

      podcastCtx.setPodcasts(data.data);
      podcastCtx.setRecentUpdate("podcasts");
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    } finally {
      podcastCtx.setLoader(false);
    }
  }

  useEffect(() => {
    // podcastCtx.setCategory("Podcasts", 67);
    if (podcastCtx.recent === "recommend") {
      setPodcasts(podcastCtx.recommend);
      setMostRecentUpdate("recommend");
    } else if (podcastCtx.recent === "podcasts") {
      setPodcasts(podcastCtx.podcasts);
      setMostRecentUpdate("podcasts");
    }
  }, [podcastCtx.recommend, podcastCtx.podcasts, podcastCtx.recent]);

  console.log(array1, "ARRAY1");
  console.log(array2, "array2");

  return (
    <div className={classes.backgroundContainer}>
      <div className={classes.headerContainer}>
        {podcastCtx.recent === "recommend" ? (
          <h1 className={classes.title}>FILTERED BY RATING</h1>
        ) : (
          <h1 className={classes.title}>
            TOP PODCASTS -{" "}
            {category.catName.toUpperCase() || "most popular".toUpperCase()}{" "}
          </h1>
        )}

        <div className={classes.selectionBoxContainer}>
          <div className={classes.selectionBox}>
            <form>
              <label>
                <span>Choose a Genre (A - M) </span>
              </label>
              <select
                id="selection"
                name="scripts"
                onChange={handleChange}
                className={classes.selection}
              >
                {array1.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </form>
          </div>

          <div className={classes.selectionBox}>
            <form>
              <label>
                <span className={classes.dropdownTitle}>
                  Choose a Genre (M - Z){" "}
                </span>
                <select
                  id="selection2"
                  name="scripts"
                  onChange={handleChange}
                  className={classes.selection}
                >
                  {array2.map((item) => {
                    return (
                      <option
                        className={classes.option}
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </label>
            </form>
          </div>
          <div>
            <p className="sort-title">Sort By:</p>
            <div className={classes.selectContainer}>
              <label className={classes.recentLabel}>
                <input
                  type="radio"
                  value="recent_added_first"
                  checked={sortOption === "recent_added_first"}
                  onChange={handleSelect}
                />
                Recent
              </label>
              <label className={classes.popularLabel}>
                <input
                  type="radio"
                  value="listen_score"
                  checked={sortOption === "listen_score"}
                  onChange={handleSelect}
                />
                Popular
              </label>
            </div>
          </div>
        </div>
        <div className={classes.filterWrapper}></div>
      </div>
      {loader ? (
        "....loading"
      ) : (
        <PodList
          podcasts={podcasts}
          category={parseInt(value)}
          getData={props.getApiData}
          status={props.status}
          cache={props.cache}
          getNewPodcasts={getNewPodcasts}
          renderCache={renderCache}
          podCache={podCache}
        />
      )}
    </div>
  );
};

export default Header;
