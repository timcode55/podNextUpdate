import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import PodList from "./podList";
import EpisodeSearchCard from "./episodeSearchCard";
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
  const [searchInput, setSearchInput] = useState("");
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

      // Check cache first before making API call - include sort method in key
      const key = `${podcastCtx.category.id}_${podcastCtx.page}_${podcastCtx.order}`;
      if (podCache[key]) {
        console.log("Using cached data for", key);
        podcastCtx.setPodcasts(podCache[key]);
        return;
      }

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

  podCache["67_1_listen_score"] = props.podcasts || [];

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
    const key = `${categoryId}_${podcastCtx.page}_${podcastCtx.order}`;
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

      const key = `${categoryId}_${page}_${sortMethod}`;
      podCache[key] = data.data || [];

      podcastCtx.setPodcasts(data.data);
      podcastCtx.setRecentUpdate("podcasts");
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    } finally {
      podcastCtx.setLoader(false);
    }
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    try {
      podcastCtx.setLoader(true);
      podcastCtx.setSearchQuery(searchInput);

      if (podcastCtx.searchType === "podcasts") {
        const { data } = await axios.get(
          `/api/searchPodcasts?q=${encodeURIComponent(searchInput)}&page=1`
        );
        podcastCtx.setSearchResults(data.data);
        podcastCtx.setEpisodeSearchResults(null);
        podcastCtx.setRecentUpdate("search");
      } else {
        const { data } = await axios.get(
          `/api/searchEpisodes?q=${encodeURIComponent(searchInput)}&page=1`
        );
        podcastCtx.setEpisodeSearchResults(data.data);
        podcastCtx.setSearchResults(null);
        podcastCtx.setRecentUpdate("episodeSearch");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      podcastCtx.setLoader(false);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    podcastCtx.setSearchQuery("");
    podcastCtx.setSearchResults(null);
    podcastCtx.setEpisodeSearchResults(null);
    podcastCtx.setRecentUpdate("podcasts");
  };

  useEffect(() => {
    // podcastCtx.setCategory("Podcasts", 67);
    if (podcastCtx.recent === "recommend") {
      setPodcasts(podcastCtx.recommend);
      setMostRecentUpdate("recommend");
    } else if (podcastCtx.recent === "search") {
      setPodcasts(podcastCtx.searchResults);
      setMostRecentUpdate("search");
    } else if (podcastCtx.recent === "podcasts") {
      setPodcasts(podcastCtx.podcasts);
      setMostRecentUpdate("podcasts");
    }
  }, [podcastCtx.recommend, podcastCtx.podcasts, podcastCtx.recent, podcastCtx.searchResults]);

  console.log(array1, "ARRAY1");
  console.log(array2, "array2");

  return (
    <div className={classes.backgroundContainer}>
      <nav className={classes.navigation}>
        <div className={classes.navContent}>
          <div className={classes.navLeft}>
            <Link href="/podcasts" className={classes.navLink}>
              Home
            </Link>
            <Link href="/favorites" className={classes.navLink}>
              ❤️ Favorites ({podcastCtx.favorites.length})
            </Link>
          </div>
          <div className={classes.navRight}>
            <Link href="/saved-episodes" className={classes.navLink}>
              🎧 Saved Episodes ({podcastCtx.savedEpisodes.length})
            </Link>
          </div>
        </div>
      </nav>
      <div className={classes.searchContainer}>
        <div className={classes.searchTypeToggle}>
          <button
            type="button"
            className={
              podcastCtx.searchType === "podcasts"
                ? classes.searchTypeActive
                : classes.searchTypeInactive
            }
            onClick={() => podcastCtx.setSearchType("podcasts")}
          >
            Podcasts
          </button>
          <button
            type="button"
            className={
              podcastCtx.searchType === "episodes"
                ? classes.searchTypeActive
                : classes.searchTypeInactive
            }
            onClick={() => podcastCtx.setSearchType("episodes")}
          >
            Episodes
          </button>
        </div>
        <form onSubmit={handleSearchSubmit} className={classes.searchForm}>
          <input
            type="text"
            placeholder={
              podcastCtx.searchType === "podcasts"
                ? "Search podcasts..."
                : "Search episodes..."
            }
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={classes.searchInput}
          />
          <button type="submit" className={classes.searchButton}>
            Search
          </button>
          {podcastCtx.searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className={classes.clearButton}
            >
              Clear
            </button>
          )}
        </form>
      </div>
      <div className={classes.headerContainer}>
        {podcastCtx.recent === "recommend" ? (
          <h1 className={classes.title}>FILTERED BY RATING</h1>
        ) : podcastCtx.recent === "episodeSearch" ? (
          <h1 className={classes.title}>
            EPISODE RESULTS FOR &quot;{podcastCtx.searchQuery.toUpperCase()}&quot;
          </h1>
        ) : podcastCtx.recent === "search" ? (
          <h1 className={classes.title}>
            PODCAST RESULTS FOR &quot;{podcastCtx.searchQuery.toUpperCase()}&quot;
          </h1>
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
            <p className={classes.sortTitle}>Sort By:</p>
            <div className={classes.sortToggle}>
              <button
                type="button"
                className={
                  sortOption === "listen_score"
                    ? classes.sortActive
                    : classes.sortInactive
                }
                onClick={() => handleSelect({ target: { value: "listen_score" } })}
              >
                Popular
              </button>
              <button
                type="button"
                className={
                  sortOption === "recent_added_first"
                    ? classes.sortActive
                    : classes.sortInactive
                }
                onClick={() => handleSelect({ target: { value: "recent_added_first" } })}
              >
                Recent
              </button>
            </div>
          </div>
          {/* ORIGINAL RADIO BUTTON CODE (commented out for reference):
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
          */}
        </div>
        <div className={classes.filterWrapper}></div>
      </div>
      {loader ? (
        "....loading"
      ) : podcastCtx.recent === "episodeSearch" && podcastCtx.episodeSearchResults ? (
        <div className={classes.episodeSearchResults}>
          {podcastCtx.episodeSearchResults.length > 0 ? (
            podcastCtx.episodeSearchResults.map((episode) => (
              <EpisodeSearchCard key={episode.id} episode={episode} />
            ))
          ) : (
            <p className={classes.noResults}>
              No episodes found for &quot;{podcastCtx.searchQuery}&quot;
            </p>
          )}
        </div>
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
