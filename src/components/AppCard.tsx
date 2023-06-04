import { AppImage, User, App } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import Image from "next/image";
dayjs.extend(relativeTime);

type AppCardProps = {
  app: App & { AppImages: AppImage[]; User: User };
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <div className="rounded-xl">
      <div className="relative h-64">
        <Image
          src={app.AppImages[0]?.url!}
          alt=""
          fill
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="relative flex-shrink-0">
          <Link href={`/user/${app.User.id}`}>
            <Image
              src={app.User.profilePic}
              alt=""
              height={32}
              width={32}
              className="rounded-full pt-1"
            />
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
        <Link href={`/app/${app.id}`} className="btn-secondary btn ml-auto">
          More details
        </Link>
      </div>
    </div>
  );
};

export default AppCard;
