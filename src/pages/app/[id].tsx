import { prisma } from "@/server/db";
import { App } from "@prisma/client";

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = await prisma.app.findUnique({
    where: { id },
  });

  return {
    props: {
      app: JSON.parse(JSON.stringify(res)) as App,
      id: id,
    },
  };
}

export default function AppDetails({
  app,
  id,
}: {
  app: App | null;
  id: string;
}) {
  if (!app) {
    return <div>There is no app with this ID</div>;
  }

  return (
    <div>
      <h1>{app.title}</h1>
      <p>{app.description}</p>
    </div>
  );
}
