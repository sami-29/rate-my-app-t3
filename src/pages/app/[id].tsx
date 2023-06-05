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
import { useEffect, useState } from "react";
import { formatViews } from "@/utils/formatViews";

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
  username: string,
  appName: string,
  appUserId: string
): Promise<void> {
  const {
    Comment,
    "UI-rating": uiRating,
    "CODE-rating": codeRating,
    "IDEA-rating": ideaRating,
  } = data;

  const ratingPromises: Promise<Response>[] = [
    fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "UI",
        score: parseInt(uiRating!, 10) || 1,
        appId,
        userId,
      }),
    }),
    fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "CODE",
        score: parseInt(codeRating!, 10) || 1,
        appId,
        userId,
      }),
    }),
    fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "IDEA",
        score: parseInt(ideaRating!, 10) || 1,
        appId,
        userId,
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
        userId,
        appId,
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
      (response): response is Response => response! && !response.ok
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
        content: `User ${username} submitted a rating for ${appName}`,
        userId: appUserId,
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [message]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      submitRatingAndComment(
        data,
        user.user?.id!,
        app?.id!,
        user.user?.username!,
        app?.title!,
        app?.User.id!
      );
    },
    onSuccess: () => {
      setMessage("Review submitted successfully!");
      router.push(`/app/${id}`);
    },
  });
  const {
    register,
    handleSubmit,
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
  console.log(user.user?.id!);
  console.log(id!);

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
    onSuccess: (res) => {
      router.push(`/app/${app.id}`);
    },
  });

  return (
    <div className="max-w-full overflow-hidden">
      {message && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}
      {!!(user.user?.id === app.User.id) && (
        <>
          <button
            className="btn-error btn-outline btn"
            onClick={() => (window as any).my_modal_1.showModal()}
          >
            Delete
          </button>
          <dialog id="my_modal_1" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="text-lg font-bold">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
              <div className="modal-action">
                <button
                  className="btn-error btn"
                  onClick={() => {
                    deleteAppMutation.mutate(app.id);
                  }}
                >
                  Delete
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </dialog>
        </>
      )}
      <div className="text-center text-5xl text-primary ">{app.title}</div>
      <div className="mt-16  flex flex-col gap-20 md:flex-row ">
        <div className="carousel w-full">
          {app.AppImages.map((image, index) => {
            const previousIndex =
              index === 0 ? app.AppImages.length - 1 : index - 1;
            const nextIndex =
              index === app.AppImages.length - 1 ? 0 : index + 1;
            const previousSlideId = `slide${previousIndex}`;
            const nextSlideId = `slide${nextIndex}`;

            return (
              <div
                key={image.id}
                id={`slide${index}`}
                className="carousel-item relative w-full rounded"
              >
                <Image src={image.url} className="w-full" alt="" fill />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between rounded">
                  <button
                    className="btn-circle btn"
                    onClick={() => {
                      const previousSlide =
                        document.getElementById(previousSlideId);
                      if (previousSlide) {
                        previousSlide.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }}
                  >
                    ❮
                  </button>
                  <button
                    className="btn-circle btn"
                    onClick={() => {
                      const nextSlide = document.getElementById(nextSlideId);
                      if (nextSlide) {
                        nextSlide.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }}
                  >
                    ❯
                  </button>
                </div>
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
          <div>{`${formatViews(app.views)}`}</div>
          <div className="min-h-[8rem] border border-info-content p-4">
            {app.description}
          </div>
          <div className="flex flex-col md:flex-row md:gap-28 ">
            <div className="flex flex-col gap-6">
              <div className="">
                Platform(s){" "}
                <span className="badge badge-primary ">{app.type}</span>
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
              <ul className="menu rounded-box menu-vertical bg-base-200 lg:menu-horizontal">
                <li
                  className={`${app.url ? "" : "disabled cursor-not-allowed"}`}
                >
                  <a
                    className={`${
                      app.url ? "" : "disabled cursor-not-allowed"
                    }`}
                    href={app.url ? ensureAbsoluteURL(app.url) : ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    URL
                  </a>
                </li>
                <li
                  className={`${
                    app.sourceCodeUrl ? "" : "disabled cursor-not-allowed"
                  }`}
                >
                  <a
                    className={`${
                      app.sourceCodeUrl ? "" : "disabled cursor-not-allowed"
                    }`}
                    href={
                      app.sourceCodeUrl
                        ? ensureAbsoluteURL(app.sourceCodeUrl)
                        : ""
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code URL
                  </a>
                </li>
                <li className="disabled ">
                  <a className="cursor-not-allowed" href={""}>
                    Donation
                  </a>
                </li>
              </ul>
            </div>
            {user.isSignedIn ? (
              !(user.user?.id === app.User.id) && (
                <div>
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
                          <button type="submit" className="modal-action">
                            <label
                              htmlFor="my-modal"
                              className="btn-primary btn"
                            >
                              Submit
                            </label>
                          </button>
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
        {!app.Comments ||
          (app.Comments.length === 0 && <div>There are no comments yet!</div>)}
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
                  <>
                    <button
                      className="btn-error btn-outline btn-sm btn-circle btn ml-auto"
                      onClick={() => (window as any).my_modal_1.showModal()}
                    >
                      X
                    </button>
                    <dialog id="my_modal_1" className="modal">
                      <form method="dialog" className="modal-box">
                        <h3 className="text-lg font-bold">
                          Are you sure you want to delete your comment!
                        </h3>
                        <p className="py-4">
                          Press ESC key or click the button below to close
                        </p>
                        <div className="modal-action">
                          <button
                            className="btn"
                            onClick={() => {
                              deleteCommentMutation.mutate(comment.id);
                            }}
                          >
                            Delete
                          </button>
                          <button className="btn">Close</button>
                        </div>
                      </form>
                    </dialog>
                  </>
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
