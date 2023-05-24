import React, { useState, useContext, useEffect } from "react";
import PodList from "./podList";
import { array1, array2, categoriesArray } from "../utils/category-list";
import PodcastContext from "../store/podcastContext";
import classes from "./header.module.css";
import axios from "axios";

let cacheObject = {},
  cacheArray = [];

const Header = (props) => {
  console.log(props.podcasts, "props in header");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [podcasts, setPodcasts] = useState(props.podcasts);
  const [loader, setLoader] = useState(false);
  const [mostRecentUpdate, setMostRecentUpdate] = useState("podcasts");
  const podcastCtx = useContext(PodcastContext);
  console.log(podcastCtx, "PODCASTCTX in header");

  const renderCache = async (genreId) => {
    const pageToFind = podcastCtx.page;
    const data = cacheArray[0][`${genreId}`];
    console.log(data, "DATA IN RENDERCACHE");
    await setPodcasts(data.data);
    // const toString = JSON.stringify(data);
    // localStorage.setItem("podcasts", toString);
  };

  cacheObject["67"] = {
    data: props.podcasts || [],
    page: podcastCtx.page,
  };
  cacheArray.push(cacheObject);

  const handleChange = (e) => {
    setValue(e.target.value);
    let findValue = Number(e.target.value);
    let categoryName = categoriesArray.find(
      (item) => item.id === findValue
    ).name;
    let categoryId = categoriesArray.find((item) => item.id === findValue).id;
    setCategory(categoryName, categoryId);
    podcastCtx.setCategory(categoryName, categoryId);
    console.log(e.target.value, "E.TARGET.VALUE FOR CACHE IN HANDLECHANGE");
    console.log(
      cacheArray[0][`${e.target.value}`],
      "cacheArray[0][`${e.target.value}`]"
    );
    if (cacheArray[0][`${e.target.value}`]) {
      renderCache(e.target.value);
    } else {
      getNewPodcasts(e.target.value, 1);
    }
  };

  async function getNewPodcasts(categoryId, page) {
    console.log("getnewpodcasts called");
    podcastCtx.setLoader(true);
    console.log(categoryId, page, "categoryid, page");
    axios
      .get(`/api/getPodcastsByCategory?categoryId=${categoryId}&page=${page}`, {
        body: {
          todo: { rating },
        },
      })
      .then((response) => {
        setPodcasts(response.data.data);
        podcastCtx.setPodcasts(response.data.data);
        podcastCtx.setRecentUpdate("podcasts");
        console.log(
          response.data.data,
          "RESPONSE.DATA IN HEADER FOR GETPODCASTSBYCATEGORY"
        );
        cacheObject[categoryId] = {
          data: response.data.data || [],
          page: podcastCtx.page,
        };
        podcastCtx.setLoader(false);
      });
  }

  useEffect(() => {
    if (podcastCtx.recent === "recommend") {
      setPodcasts(podcastCtx.recommend);
      setMostRecentUpdate("recommend");
    } else if (podcastCtx.recent === "podcasts") {
      setPodcasts(podcastCtx.podcasts);
      setMostRecentUpdate("podcasts");
    }
  }, [podcastCtx.recommend, podcastCtx.podcasts, podcastCtx.recent]);
  console.log(cacheArray, "CACHEARRAY");
  console.log(cacheObject, "CACHEOBJECT");
  console.log(podcasts, "PODCASTS IN HEADER%%%%%%%%");
  return (
    <div className={classes.backgroundContainer}>
      <div className={classes.headerContainer}>
        {podcastCtx.recent === "recommend" ? (
          <h1 className={classes.title}>FILTERED BY RATING</h1>
        ) : (
          <h1 className={classes.title}>
            TOP PODCASTS -{" "}
            {category.toUpperCase() || "most popular".toUpperCase()}{" "}
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
        />
      )}
    </div>
  );
};

export default Header;
