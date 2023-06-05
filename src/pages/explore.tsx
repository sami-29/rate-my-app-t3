import { App, AppImage, Rating, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useState } from "react";
import AppCard from "@/components/AppCard";
import { useRouter } from "next/router";
import Head from "next/head";

dayjs.extend(relativeTime);

const fetchApps = async (query: string) => {
  const url =
    query !== ""
      ? `/api/apps/getAll?query=${encodeURIComponent(query)}`
      : "/api/apps/getAll";
  const res = await fetch(url);
  const body = await res.json();

  return body as (App & {
    AppImages: AppImage[];
    User: User;
    Ratings: Rating[];
  })[];
};

function getAverageRating(ratings: Rating[]) {
  if (!ratings || ratings.length === 0) {
    return 0;
  }

  const sum = ratings.reduce((total, rating) => total + rating.score, 0);
  const average = sum / ratings.length;

  return average;
}

export default function Explore() {
  const router = useRouter();
  const { query } = router.query;
  const searchQuery = typeof query === "string" ? query : "";
  const { data, isLoading } = useQuery(["getApps"], () => {
    return fetchApps(searchQuery);
  });

  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("creationDate");
  const [sortOrder, setSortOrder] = useState("desc");

  if (isLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  let filteredApps = data;

  if (filterType !== "All") {
    filteredApps = data.filter((app) => app.type === filterType);
  }

  let sortedApps = [...filteredApps];

  if (sortBy === "creationDate") {
    sortedApps.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  } else if (sortBy === "averageRating") {
    sortedApps.sort((a, b) => {
      console.log(a.Ratings, b.Ratings);
      const avgRatingA = getAverageRating(a.Ratings);
      const avgRatingB = getAverageRating(b.Ratings);
      return sortOrder === "desc"
        ? avgRatingB - avgRatingA
        : avgRatingA - avgRatingB;
    });
  } else if (sortBy === "views") {
    sortedApps.sort((a, b) => {
      return sortOrder === "desc" ? b.views - a.views : a.views - b.views;
    });
  }

  return (
    <>
      <Head>
        <title>Explore</title>
        <meta name="description" content="Rate my app website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto mt-8">
        <div className="sm:translate-y-[-5rem] md:max-w-[90%]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Filters</h3>
            <div className="flex gap-4">
              <span className="self-center text-sm font-medium">
                By Platform:
              </span>
              <div className="join">
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="platform"
                  aria-label="All"
                  onClick={() => setFilterType("All")}
                  defaultChecked
                />
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="platform"
                  aria-label="Web"
                  onClick={() => setFilterType("WEB")}
                />
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="platform"
                  aria-label="Mobile"
                  onClick={() => setFilterType("MOBILE")}
                />
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="platform"
                  aria-label="Desktop"
                  onClick={() => setFilterType("DESKTOP")}
                />
              </div>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between">
            <h3 className="text-lg font-medium">Sort</h3>
            <div className="flex gap-4">
              <span className="self-center text-sm font-medium">
                Sort Order:
              </span>
              <div className="join">
                <input
                  className={`join-item btn `}
                  type="radio"
                  name="sort-order"
                  defaultChecked
                  aria-label="Descending"
                  onClick={() => setSortOrder("desc")}
                />
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="sort-order"
                  aria-label="Ascending"
                  onClick={() => setSortOrder("asc")}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <span className="self-center text-sm font-medium">Sort By:</span>
              <div className="join">
                <input
                  className={`join-item btn `}
                  type="radio"
                  name="sort-by"
                  defaultChecked
                  aria-label="Date of Creation"
                  onClick={() => setSortBy("creationDate")}
                />
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="sort-by"
                  aria-label="Best Average Rating"
                  onClick={() => setSortBy("averageRating")}
                />
                <input
                  className={`join-item btn`}
                  type="radio"
                  name="sort-by"
                  aria-label="Most Viewed"
                  onClick={() => setSortBy("views")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedApps.length === 0 && (
            <div className="text-2xl text-error">There are no apps</div>
          )}
          {sortedApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </>
  );
}
