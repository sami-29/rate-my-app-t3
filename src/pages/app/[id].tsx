import RatingComponent from "@/components/ui/Rating";
import { prisma } from "@/server/db";
import ensureAbsoluteURL from "@/utils/ensureAbsoluteUrl";
import { App, AppImage, Donation, Rating, User, Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

interface AppDetailsProps {
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
}

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
        orderBy: [
          {
            created_at: "desc",
          },
        ],
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

  if (res) {
    await prisma.app.update({
      where: {
        id,
      },
      data: {
        views: res.views + 1,
      },
    });
  }

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
async function submitRatingAndComment(
  data: Record<string, string>,
  userId: string,
  appId: string,
  username: string
) {
  const {
    Comment,
    "UI-rating": uiRating,
    "CODE-rating": codeRating,
    "IDEA-rating": ideaRating,
  } = data;

  const ratingPromises = [
    fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "UI",
        score: parseInt(uiRating!),
        appId: appId,
        userId: userId,
      }),
    }),
    fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "CODE",
        score: parseInt(codeRating!),
        appId: appId,
        userId: userId,
      }),
    }),
    fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "IDEA",
        score: parseInt(ideaRating!),
        appId: appId,
        userId: userId,
      }),
    }),
  ];

  let commentPromise: Promise<Response> | null = null;
  if (Comment) {
    commentPromise = fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: Comment,
        userId: userId,
        appId: appId,
      }),
    });
  }

  try {
    const ratingResponses = await Promise.all(ratingPromises);
    let commentResponse: Response | null = null;
    if (commentPromise) {
      commentResponse = await commentPromise;
    }

    const responses: (Response | null)[] = [...ratingResponses];
    if (commentResponse) {
      responses.push(commentResponse);
    }

    const errorResponses = responses.filter(
      (response) => response && !response.ok
    );
    if (errorResponses.length > 0) {
      throw new Error("Error submitting rating and comment");
    }

    // All requests were successful

    // Create notification
    const notificationResponse = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `User ${username} submitted a rating and comment for app with ID ${appId}`,
        userId: userId,
      }),
    });

    if (notificationResponse.ok) {
      console.log("Rating, comment, and notification submitted successfully");
    } else {
      console.error("Failed to create notification");
    }
  } catch (error) {
    console.error(error);
  }
}

function getAverageRatingByType(ratings: Rating[], type: string) {
  const filteredRatings = ratings.filter((rating) => rating.type === type);
  const sum = filteredRatings.reduce(
    (total, rating) => total + rating.score,
    0
  );
  const average = sum / filteredRatings.length;

  return average.toFixed(1) !== "NaN" ? `${average.toFixed(1)} ⭐️` : "";
}

function getRatingsCount(ratings: Rating[], type: string) {
  const filteredRatings = ratings.filter((rating) => rating.type === type);
  return filteredRatings.length > 0 ? `(${filteredRatings.length})` : `(${0})`;
}

export default function AppDetails({ app, id }: AppDetailsProps) {
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      submitRatingAndComment(data, user.user?.id!, app?.id!, app?.User.name!);
    },
    onSuccess: () => {
      router.push(`/app/${id}`);
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);

    mutation.mutate(data);
  };

  const user = useUser();
  if (!app) {
    return <div>There is no app with this ID</div>;
  }
  const router = useRouter();
  const deleteAppMutation = useMutation({
    mutationKey: ["DeleteApp"],
    mutationFn: async function deleteApp(id: string) {
      const res = await fetch(`/api/apps/delete?id=${id}`, {
        method: "DELETE",
      });

      const body = await res.json();
      console.log(body);
      return body;
    },
    onSuccess: (res) => {
      console.log(res);
      router.push(`/`);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationKey: ["DeleteComment"],
    mutationFn: async function deleteApp(id: string) {
      const res = await fetch(`/api/comments?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();
      console.log(body);
      return body;
    },
  });

  return (
    <div className="max-w-full overflow-hidden">
      {!!(user.user?.id === app.User.id) && (
        <div
          className=" btn-error btn-sm btn  absolute top-[0.5rem] md:btn-md  sm:right-4 sm:top-16 "
          onClick={() => {
            deleteAppMutation.mutate(app.id);
          }}
        >
          Delete
        </div>
      )}
      <div className="text-center text-5xl text-primary ">{app.title}</div>
      <div className="mt-16  flex flex-col gap-20 md:flex-row ">
        <div className="carousel-vertical carousel rounded-box relative h-64 w-screen  flex-shrink-0 sm:h-96 md:w-96">
          {app.AppImages.map((image) => {
            return (
              <div key={image.id} className="carousel-item  h-full">
                <Image src={image.url} fill className="object-cover" alt="" />
              </div>
            );
          })}
        </div>
        <div className="mx-auto flex w-full flex-col gap-6">
          <div className="flex  gap-4">
            <div className="self-center">Created By </div>
            <div className="flex gap-2">
              <Image
                src={app.User.profilePic}
                width={48}
                height={48}
                alt="Profile pic of the Owner"
                className="rounded-full"
              ></Image>
              <div className="self-center">{app.User.name}</div>
            </div>
            <div className="self-center">
              . posted {dayjs().to(app.created_at)}
            </div>
          </div>
          <div>{`Seen ${app.views} amount of times`}</div>
          <div className="min-h-[8rem] border border-info-content p-4">
            {app.description}
          </div>
          <div className="flex flex-col md:flex-row md:gap-28 ">
            <div className="flex flex-col gap-6">
              <div className="">
                Platform(s){" "}
                <span className="badge-primary badge ">{app.type}</span>
              </div>
              <div className="flex flex-col gap-3 ">
                <div className="flex gap-2">
                  <span className="w-24">UI Rating</span>
                  {`${getRatingsCount(app.Ratings, "UI")} `}
                  {getAverageRatingByType(app.Ratings, "UI")}
                </div>
                <div className="flex gap-2">
                  <span className="w-24">CODE Rating</span>
                  {`${getRatingsCount(app.Ratings, "CODE")} `}
                  {getAverageRatingByType(app.Ratings, "CODE")}
                </div>
                <div className="flex gap-2">
                  <span className="w-24">IDEA Rating</span>
                  {`${getRatingsCount(app.Ratings, "IDEA")} `}
                  {getAverageRatingByType(app.Ratings, "IDEA")}
                </div>
              </div>
              <div className="flex gap-4">
                <a
                  href={app.url ? ensureAbsoluteURL(app.url) : ""}
                  className={`btn w-24 ${
                    app.url ? "btn-primary link" : "btn-disabled"
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
                    app.sourceCodeUrl ? "btn-primary link" : "btn-disabled"
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
            {user.isSignedIn ? (
              !(user.user?.id === app.User.id) && (
                <div>
                  {" "}
                  <div className="mx-auto mt-12 max-w-xs">
                    <label htmlFor="my-modal" className="btn-accent btn">
                      Leave a rating and comment
                    </label>
                    <input
                      type="checkbox"
                      id="my-modal"
                      className="modal-toggle"
                    />
                    <label htmlFor="my-modal" className="modal cursor-pointer">
                      <label className="modal-box relative" htmlFor="">
                        <form
                          className="flex flex-col gap-4"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <RatingComponent
                            register={register}
                            type="UI"
                          ></RatingComponent>
                          <RatingComponent
                            register={register}
                            type="CODE"
                          ></RatingComponent>
                          <RatingComponent
                            register={register}
                            type="IDEA"
                          ></RatingComponent>
                          <input
                            type="text"
                            defaultValue={"Great Application!"}
                            {...register("Comment")}
                            className="input-bordered input w-full max-w-xs"
                          />
                          <div className="modal-action">
                            <label
                              htmlFor="my-modal"
                              className="btn-primary btn"
                            >
                              <input type="submit" />
                            </label>
                          </div>
                        </form>
                      </label>
                    </label>
                  </div>
                </div>
              )
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary btn">
                  Leave a rating and comment
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-screen-xl  flex-col gap-6 pt-4">
        <h3 className="text-xl text-info-content">Comments</h3>
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
                {!!(user.user?.id === comment.userId) && (
                  <div
                    className=" btn-error  btn ml-auto  "
                    onClick={() => {
                      deleteCommentMutation.mutate(comment.id);
                    }}
                  >
                    X
                  </div>
                )}
              </div>
              <div className="">{comment.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
