import RatingComponent from "@/components/ui/Rating";
import { prisma } from "@/server/db";
import ensureAbsoluteURL from "@/utils/ensureAbsoluteUrl";
import { App, AppImage, Donation, Rating, User, Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

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
  appId: string
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

    // Check the responses for any error status codes and handle accordingly
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
    console.log("Rating and comment submitted successfully");
  } catch (error) {
    console.error(error);
    // Handle error
  }
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
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      submitRatingAndComment(data, user.user?.id!, app?.id!);
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
    mutationFn: async (id: string) => {
      const res = await fetch("/api/apps/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          id: id,
        }),
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

  const queryClient = useQueryClient();

  return (
    <div className="">
      {!!(user.user?.id === app.User.id) && (
        <div
          className=" btn-error  btn absolute right-4  "
          onClick={() => {
            deleteAppMutation.mutate(app.id);
          }}
        >
          Delete
        </div>
      )}
      <div className="text-center text-5xl text-primary">{app.title}</div>
      <div className="mt-16  flex gap-20 ">
        <div className="carousel-vertical carousel rounded-box relative  h-96 w-96 flex-shrink-0">
          {app.AppImages.map((image) => {
            return (
              <div key={image.id} className="carousel-item  h-full">
                <Image src={image.url} fill className="object-cover" alt="" />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
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
            <div className="ml-auto self-center">
              posted {dayjs().to(app.created_at)}
            </div>
          </div>
          <div className="min-h-[8rem]  border border-info-content p-4">
            {app.description}
          </div>
          <div className="flex gap-28">
            <div className="flex flex-col gap-6">
              <div className="">
                Platform(s){" "}
                <span className="btn-info btn-sm btn ">{app.type}</span>
              </div>
              <div className="flex flex-col gap-3 ">
                <div className="flex gap-2">
                  <span className="w-24">UI Rating</span>{" "}
                  {getAverageRatingByType(app.Ratings, "UI")} ⭐️
                </div>
                <div className="flex gap-2">
                  <span className="w-24">CODE Rating</span>
                  {getAverageRatingByType(app.Ratings, "CODE")} ⭐️
                </div>
                <div className="flex gap-2">
                  <span className="w-24">IDEA Rating</span>{" "}
                  {getAverageRatingByType(app.Ratings, "IDEA")} ⭐️
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
            {!(user.user?.id === app.User.id) && (
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
                          <label htmlFor="my-modal" className="btn-primary btn">
                            <input type="submit" />
                          </label>
                        </div>
                      </form>
                    </label>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-screen-xl  flex-col gap-6 pt-4">
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
