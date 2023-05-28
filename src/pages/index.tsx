import { type NextPage } from "next";
import Head from "next/head";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { App, AppImage, User } from "@prisma/client";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

const fetchApps = async () => {
  const res = await fetch("/api/apps/getAll");
  const body = await res.json();

  return body as (App & { AppImages: AppImage[]; User: User })[];
};

const Home: NextPage = () => {
  const { data, isLoading, failureReason } = useQuery(["getApps"], fetchApps);
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
        <title>Create T3 App</title>
        <meta name="description" content="Rate my app website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-4 gap-6  sm:grid-cols-2  xl:grid-cols-3">
        {data.map((app) => {
          return (
            <div key={app.id} className="rounded-xl">
              <div className="relative  h-64 ">
                <Image
                  src={app.AppImages[0]?.url!}
                  alt={""}
                  fill
                  className="rounded-xl object-cover"
                ></Image>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="relative flex-shrink-0 ">
                  <Link href={`/user/${app.User.id}`}>
                    <Image
                      src={app.User.profilePic}
                      alt=""
                      height={32}
                      width={32}
                      className="rounded-full pt-1"
                    ></Image>
                  </Link>
                </div>
                <div className="flex flex-col overflow-hidden text-ellipsis">
                  <div className="text-2xl">{app.title}</div>
                  <div className="max-h-[3rem] overflow-hidden break-words">
                    {app.description}
                  </div>
                  <div className="flex-shrink-0">
                    {dayjs().to(app.created_at as unknown as string)}
                  </div>
                </div>
                <Link
                  href={`/app/${app.id}`}
                  className="btn-secondary btn ml-auto "
                >
                  More details
                </Link>
              </div>
            </div>
          );
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

export default Home;
