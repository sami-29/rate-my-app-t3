import { prisma } from "@/server/db";
import { formatViews } from "@/utils/formatViews";
import { App, Donation, Rating, User } from "@prisma/client";
import { useEffect, useState } from "react";

interface AppDetailsProps {
  user:
    | (User & {
        Apps: App[];
        Ratings: Rating[];
        Comments: Comment[];
        Donations: Donation[];
      })
    | null;
  id: string;
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = await prisma.user.findUnique({
    where: { id },
    include: {
      Apps: true,
      Comments: true,
      Donations: true,
      Ratings: true,
    },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(res)) as
        | (User & {
            Apps: App[];
            Ratings: Rating[];
            Comments: Comment[];
            Donations: Donation[];
          })
        | null,
      id: id,
    },
  };
}

const AppDetails: React.FC<AppDetailsProps> = ({ user, id }) => {
  const [appCount, setAppCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [donationCount, setDonationCount] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setAppCount(user.Apps.length);
      setCommentCount(user.Comments.length);
      setDonationCount(user.Donations.length);
      setTotalViews(user.Apps.reduce((sum, app) => sum + app.views, 0));
    }
  }, [user]);

  if (!user) {
    return <div>There is no user with this ID</div>;
  }

  return (
    <div className="rounded-lg bg-base-100 p-4">
      <h1 className="mb-2 text-2xl font-bold">{user.name}</h1>
      <div className="flex items-center space-x-2">
        <img
          src={user.profilePic}
          alt={`${user.name}'s profile picture`}
          className="h-10 w-10 rounded-full"
        />
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="mt-4">
        <div className="badge badge-info mx-1">{appCount} Apps Posted</div>
        <div className="badge badge-warning mx-1">
          {commentCount} Comments Commented
        </div>
        <div className="badge badge-success mx-1">
          {donationCount} Donations Done
        </div>
        <div className="badge badge-primary mx-1">
          {formatViews(totalViews)} across all Apps
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
