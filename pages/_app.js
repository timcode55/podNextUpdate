import { PodcastContextProvider } from "../store/podcastContext";
import "../styles/globals.css";
import Script from "next/script";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-T4C827WN5N"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T4C827WN5N', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />

      {/* <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-T4C827WN5N"
      ></Script>
      <Script>
        window.dataLayer = window.dataLayer || []; function gtag()
        {dataLayer.push(arguments)}
        gtag('js', new Date()); gtag('config', 'G-T4C827WN5N');
      </Script> */}
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
