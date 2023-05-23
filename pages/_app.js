import { PodcastContextProvider } from "../store/podcastContext";
import "../styles/globals.css";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <PodcastContextProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </PodcastContextProvider>
  );
}

export default MyApp;
