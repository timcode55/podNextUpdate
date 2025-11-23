import { createContext, useState, useEffect } from "react";

const PodcastContext = createContext({
  podcasts: [],
  setCategory: function () {},
  showLoader: false,
});

export function PodcastContextProvider(props) {
  const [podcasts, setPodcasts] = useState([]);
  const [category, setCategory] = useState({ category: "podcasts", id: 67 });
  const [recommend, setRecommend] = useState(null);
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState("⭐️ 1.0");
  const [numberRatings, setNumberRatings] = useState(20);
  const [genre, setGenre] = useState("AI & Data Science");
  const [recent, setRecentUpdate] = useState(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("listen_score");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchType, setSearchType] = useState("podcasts"); // "podcasts" or "episodes"
  const [episodeSearchResults, setEpisodeSearchResults] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [savedEpisodes, setSavedEpisodes] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("podcastFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Load saved episodes from localStorage on mount
  useEffect(() => {
    const storedEpisodes = localStorage.getItem("savedEpisodes");
    if (storedEpisodes) {
      setSavedEpisodes(JSON.parse(storedEpisodes));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length >= 0) {
      localStorage.setItem("podcastFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  // Save episodes to localStorage whenever they change
  useEffect(() => {
    if (savedEpisodes.length >= 0) {
      localStorage.setItem("savedEpisodes", JSON.stringify(savedEpisodes));
    }
  }, [savedEpisodes]);

  function setCategoryHandler(categoryName, categoryId) {
    setCategory({ category: categoryName, id: categoryId });
  }

  function setPodcastsHandler(podcasts) {
    setPodcasts(podcasts);
  }

  function setLoaderHandler(loader) {
    setLoader(loader);
  }

  function setRecommendHandler(podcasts) {
    setRecommend(podcasts);
  }

  function setRatingHandler(rating) {
    setRating(rating);
  }

  function setNumberRatingsHandler(numberRatings) {
    setNumberRatings(numberRatings);
  }

  function setGenreHandler(genre) {
    setGenre(genre);
  }
  function setRecentUpdateHandler(recent) {
    setRecentUpdate(recent);
  }
  function setPageHandler(page) {
    setPage(page);
  }

  function setSortOrder(order) {
    setOrder(order);
  }

  function setSearchQueryHandler(query) {
    setSearchQuery(query);
  }

  function setSearchResultsHandler(results) {
    setSearchResults(results);
  }

  function setSearchTypeHandler(type) {
    setSearchType(type);
  }

  function setEpisodeSearchResultsHandler(results) {
    setEpisodeSearchResults(results);
  }

  function addToFavoritesHandler(podcast) {
    setFavorites((prevFavorites) => {
      // Check if already in favorites
      const exists = prevFavorites.find((fav) => fav.id === podcast.id);
      if (exists) {
        return prevFavorites;
      }
      return [...prevFavorites, podcast];
    });
  }

  function removeFromFavoritesHandler(podcastId) {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== podcastId)
    );
  }

  function isFavoriteHandler(podcastId) {
    return favorites.some((fav) => fav.id === podcastId);
  }

  function addToSavedEpisodesHandler(episode) {
    setSavedEpisodes((prevEpisodes) => {
      // Check if already in saved episodes
      const exists = prevEpisodes.find((ep) => ep.id === episode.id);
      if (exists) {
        return prevEpisodes;
      }
      return [...prevEpisodes, episode];
    });
  }

  function removeFromSavedEpisodesHandler(episodeId) {
    setSavedEpisodes((prevEpisodes) =>
      prevEpisodes.filter((ep) => ep.id !== episodeId)
    );
  }

  function isEpisodeSavedHandler(episodeId) {
    return savedEpisodes.some((ep) => ep.id === episodeId);
  }

  const context = {
    podcasts: podcasts,
    category: category,
    recommend: recommend,
    rating,
    numberRatings,
    genre,
    recent,
    loader: loader,
    page,
    order,
    searchQuery,
    searchResults,
    searchType,
    episodeSearchResults,
    favorites,
    savedEpisodes,
    setCategory: setCategoryHandler,
    setLoader: setLoaderHandler,
    setPodcasts: setPodcastsHandler,
    setRecommend: setRecommendHandler,
    setRating: setRatingHandler,
    setNumberRatings: setNumberRatingsHandler,
    setGenre: setGenreHandler,
    setRecentUpdate: setRecentUpdateHandler,
    setPage: setPageHandler,
    setOrder: setSortOrder,
    setSearchQuery: setSearchQueryHandler,
    setSearchResults: setSearchResultsHandler,
    setSearchType: setSearchTypeHandler,
    setEpisodeSearchResults: setEpisodeSearchResultsHandler,
    addToFavorites: addToFavoritesHandler,
    removeFromFavorites: removeFromFavoritesHandler,
    isFavorite: isFavoriteHandler,
    addToSavedEpisodes: addToSavedEpisodesHandler,
    removeFromSavedEpisodes: removeFromSavedEpisodesHandler,
    isEpisodeSaved: isEpisodeSavedHandler,
  };

  return (
    <PodcastContext.Provider value={context}>
      {props.children}
    </PodcastContext.Provider>
  );
}

export default PodcastContext;
