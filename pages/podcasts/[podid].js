import { useRouter } from "next/router";

export default function PodcastDetailPage() {
  const router = useRouter();

  console.log(router.query.podid, "query");
  return (
    <div>
      <h1>Podcast Detail Page</h1>
    </div>
  );
}
