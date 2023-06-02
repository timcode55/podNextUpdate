import { PodcastContextProvider } from "../store/podcastContext";
import "../styles/globals.css";
import Script from "next/script";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-T4C827WN5N"
      ></script>
      <script>
        window.dataLayer = window.dataLayer || []; function gtag()
        {dataLayer.push(arguments)}
        gtag('js', new Date()); gtag('config', 'G-T4C827WN5N');
      </script>
      <PodcastContextProvider>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
      </PodcastContextProvider>
    </>
  );
}

export default MyApp;
