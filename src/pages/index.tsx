import { type NextPage } from "next";
import Head from "next/head";
import { SignedIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { App, AppImage, User } from "@prisma/client";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import AppCard from "@/components/AppCard";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading, failureReason } = useQuery(
    ["getUserApps"],
    async () => {
      const params = new URLSearchParams();
      params.append("userId", user.user?.id!);

      const res = await fetch(`/api/apps/getAll?${params.toString()}`, {
        method: "GET",
      });
      const body = await res.json();
      console.log(body);

      return body as (App & { AppImages: AppImage[]; User: User })[];
    }
  );

  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <>
      <Head>
        <title>HomePage</title>
        <meta name="description" content="Rate my app website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-4 text-center  text-3xl md:mb-8">Your Apps</h1>

      <div className="grid  gap-6  sm:grid-cols-2  xl:grid-cols-3">
        {data.map((app) => {
          return <AppCard key={app.id} app={app}></AppCard>;
        })}
      </div>
      {/* The button to open modal */}
      <SignedIn>
        <Link
          className="btn-primary btn-circle btn fixed bottom-4 right-4"
          href={"/CreateApp"}
        >
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
        </Link>
      </SignedIn>
    </>
  );
};

export const getServerSideProps = withServerSideAuth(async ({ req }) => {
  const { userId } = req.auth;

  if (!userId) {
    return {
      redirect: {
        destination: "/about",
        permanent: false,
      },
    };
  }

  // Load any data your application needs and pass to props

  return { props: {} };
});

export default Home;
