import { createContext, useState } from "react";

const PodcastContext = createContext({
  podcasts: [],
  setCategory: function () {},
  showLoader: false,
});

export function PodcastContextProvider(props) {
  const [podcasts, setPodcasts] = useState([]);
  const [category, setCategory] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState(null);
  const [numberRatings, setNumberRatings] = useState(null);
  const [genre, setGenre] = useState(null);
  const [recent, setRecentUpdate] = useState(null);

  function setCategoryHandler(categoryName, categoryId) {
    console.log(category, "CATEGORY IN setCategoryHandler");
    setCategory({ page: 1, category: categoryName, id: categoryId });
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

  const context = {
    podcasts: podcasts,
    category: category,
    recommend: recommend,
    rating,
    numberRatings,
    genre,
    recent,
    loader: loader,
    setCategory: setCategoryHandler,
    setLoader: setLoaderHandler,
    setPodcasts: setPodcastsHandler,
    setRecommend: setRecommendHandler,
    setRating: setRatingHandler,
    setNumberRatings: setNumberRatingsHandler,
    setGenre: setGenreHandler,
    setRecentUpdate: setRecentUpdateHandler,
  };

  return (
    <PodcastContext.Provider value={context}>
      {props.children}
    </PodcastContext.Provider>
  );
}

export default PodcastContext;
