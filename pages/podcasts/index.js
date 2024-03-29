import { useContext, useState } from "react";
import PodcastContext from "../../store/podcastContext";
import Header from "../../components/header";
import Filter from "../../components/filter";
import classes from "./podcasts.module.css";
import {
  connectToDatabase,
  getClient,
} from "../../components/helpers/database/mongodb";

function Podcasts(props) {
  const podcastCtx = useContext(PodcastContext);

  return (
    <div className={classes.mainContainer}>
      <Filter podcasts={podcastCtx.recommend} />
      <Header podcasts={props?.finalArray} />
    </div>
  );
}

export async function getStaticProps() {
  let mongoClient;
  try {
    mongoClient = getClient();
  } catch (error) {
    console.log(error, "ERROR GETTING MONGO CLIENT*****");
  }
  if (!mongoClient) {
    mongoClient = await connectToDatabase();
  }

  try {
    const db = mongoClient.db();
    const getTopPods = db.collection("ratings");

    const response = await fetch(
      `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${67}&page=${1}&region=us&sort=listen_score&safe_mode=0`,
      {
        headers: {
          "X-ListenAPI-Key": process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY,
          "Cache-Control": "max-age=86400",
          "CDN-Cache-Control": "max-age=86400",
          "Vercel-CDN-Cache-Control": "max-age=86400",
        },
      },
      { cache: "no-store" },
      {
        next: {
          revalidate: 86400, // 1 day
        },
      }
    );
    const data = await response.json();
    const finalArray = [];
    for (const pod of data?.podcasts) {
      const result = await getTopPods.findOne({ id: pod.id });
      pod.rating = result?.rating ?? null;
      pod.numberOfRatings = result?.numberOfRatings ?? null;
      pod.itunes = result?.itunes ?? null;
      finalArray.push(pod);
    }
    return {
      props: { isConnected: true, finalArray },
    };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return { props: { isConnected: false }, revalidate: 86500 };
  }
}

export default Podcasts;
