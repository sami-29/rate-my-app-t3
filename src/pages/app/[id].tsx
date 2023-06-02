import RatingComponent from "@/components/ui/Rating";
import { prisma } from "@/server/db";
import ensureAbsoluteURL from "@/utils/ensureAbsoluteUrl";
import { App, AppImage, Donation, Rating, User, Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = await prisma.app.findUnique({
    where: { id },
    include: {
      AppImages: true,
      Comments: {
        include: {
          User: true,
        },
      },
      Donations: {
        include: {
          User: true,
        },
      },
      Ratings: true,
      User: true,
    },
  });

  console.log(id);

  return {
    props: {
      app: JSON.parse(JSON.stringify(res)) as
        | (App & {
            User: User;
            Ratings: Rating[];
            Comments: (Comment & {
              User: User;
            })[];
            Donations: (Donation & {
              User: User;
            })[];
            AppImages: AppImage[];
          })
        | null,
      id: id,
    },
  };
}

function getAverageRatingByType(ratings: Rating[], type: string) {
  const filteredRatings = ratings.filter((rating) => rating.type === type);
  const sum = filteredRatings.reduce(
    (total, rating) => total + rating.score,
    0
  );
  const average = sum / filteredRatings.length;
  return average.toFixed(1); // Return the average rating with one decimal place
}

export default function AppDetails({
  app,
  id,
}: {
  app:
    | (App & {
        User: User;
        Ratings: Rating[];
        Comments: (Comment & {
          User: User;
        })[];
        Donations: (Donation & {
          User: User;
        })[];
        AppImages: AppImage[];
      })
    | null;
  id: string;
}) {
  if (!app) {
    return <div>There is no app with this ID</div>;
  }

  return (
    <div className="">
      <div className="text-center text-5xl text-primary">{app.title}</div>
      <div className="mt-16  flex gap-20 ">
        <div className="carousel-vertical carousel rounded-box relative  h-96 w-96 flex-shrink-0">
          {app.AppImages.map((image) => {
            return (
              <div key={image.id} className="carousel-item  h-full">
                <Image src={image.url} fill alt="" />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-6">
          <div>{app.description}</div>
          <div className="flex gap-28">
            <div className="flex flex-col gap-6">
              <div>Type : {app.type}</div>
              <div>
                <div>
                  UI Rating: {getAverageRatingByType(app.Ratings, "UI")} ⭐️
                </div>
                <div>
                  CODE Rating: {getAverageRatingByType(app.Ratings, "CODE")} ⭐️
                </div>
                <div>
                  IDEA Rating: {getAverageRatingByType(app.Ratings, "IDEA")} ⭐️
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={app.url ? ensureAbsoluteURL(app.url) : ""}
                  className={`btn w-24 ${
                    app.url ? "btn-primary" : "btn-disabled"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  URL
                </a>
                <a
                  href={
                    app.sourceCodeUrl
                      ? ensureAbsoluteURL(app.sourceCodeUrl)
                      : ""
                  }
                  className={`btn ${
                    app.sourceCodeUrl ? "btn-primary" : "btn-disabled"
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source code URL
                </a>
                <a
                  href={""}
                  className="btn-disabled btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Donation
                </a>
              </div>
            </div>
            <div>
              {" "}
              <div className="mx-auto mt-12 max-w-xs">
                <label htmlFor="my-modal" className="btn-accent btn">
                  Leave a rating and comment
                </label>
                <input type="checkbox" id="my-modal" className="modal-toggle" />
                <label htmlFor="my-modal" className="modal cursor-pointer">
                  <label className="modal-box relative" htmlFor="">
                    <form className="flex flex-col gap-4">
                      <RatingComponent type="UI"></RatingComponent>
                      <RatingComponent type="CODE"></RatingComponent>
                      <RatingComponent type="IDEA"></RatingComponent>
                      <input
                        type="text"
                        placeholder="Enter your comment..."
                        className="input-bordered input w-full max-w-xs"
                      />
                      <div className="modal-action">
                        <label htmlFor="my-modal" className="btn-primary btn">
                          Submit!
                        </label>
                      </div>
                    </form>
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-screen-xl gap-6  pt-4">
        {app.Comments.map((comment) => {
          return (
            <div
              key={comment.id}
              className="flex flex-col gap-2 border border-accent p-2"
            >
              <div className="flex gap-2">
                <Link href={`/user/${comment.userId}`}>
                  <Image
                    src={comment.User.profilePic}
                    alt=""
                    className="rounded-full"
                    width={32}
                    height={32}
                  ></Image>
                </Link>
                <div>{comment.User.name}</div>
                <div>. {dayjs().to(comment.created_at)}</div>
              </div>
              <div className="">{comment.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
