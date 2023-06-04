import { useUser } from "@clerk/nextjs";
import { App, AppImage, User } from "@prisma/client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

const fetchApps = async () => {
  const res = await fetch("/api/apps/getAll");
  const body = await res.json();

  return body as (App & { AppImages: AppImage[]; User: User })[];
};

export default function Explore() {
  const user = useUser();
  const { data, isLoading, failureReason } = useQuery(["getApps"], fetchApps);

  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-11/12 translate-y-[-3rem]">
        <h3 className="text-lg">Filtres</h3>
        <div className="ml-auto flex gap-6">
          <div className="btn-outline btn text-xs ">By Platform</div>
        </div>
      </div>
      <div className="flex w-11/12  translate-y-[-2rem] border-t pt-4 ">
        <h3 className="= text-lg">Sort by</h3>

        <div className="ml-auto flex gap-6">
          <div className="btn-outline btn text-xs ">Date of creation</div>
          <div className="btn-outline btn text-xs ">Best average rating</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6  sm:grid-cols-2  xl:grid-cols-3">
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
    </div>
  );
}
