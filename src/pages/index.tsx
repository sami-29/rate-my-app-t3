import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";

import { useUser } from "@clerk/nextjs";

const Home: NextPage = () => {
  const { data, isLoading } = api.apps.getAll.useQuery();

  const user = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Something went wrong</div>;
  }
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Rate my app website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* The button to open modal */}
      {!!user.isSignedIn && (
        <button className="btn-primary btn-circle btn fixed bottom-4 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Home;
