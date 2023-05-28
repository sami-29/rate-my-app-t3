import { prisma } from "@/server/db";
import { User } from "@prisma/client";

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = await prisma.user.findUnique({
    where: { id },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(res)) as User,
      id: id,
    },
  };
}

export default function AppDetails({
  user,
  id,
}: {
  user: User | null;
  id: string;
}) {
  if (!user) {
    return <div>There is no app with this ID</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}
