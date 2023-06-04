import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { userId, query } = req.query;

    let apps;

    if (!userId) {
      if (query && query !== "") {
        console.log(query);
        apps = await prisma.app.findMany({
          take: 100,
          where: {
            OR: [
              { title: { contains: query as string } },
              { description: { contains: query as string } },
              { type: { equals: String(query).toUpperCase() as any } },
              { User: { name: { contains: query as string } } },
            ],
          },
          include: {
            AppImages: true,
            User: true,
          },
        });
      } else {
        apps = await prisma.app.findMany({
          take: 100,
          include: {
            AppImages: true,
            User: true,
          },
        });
      }

      res.json(apps);
      return;
    }

    apps = await prisma.app.findMany({
      where: {
        ownerId: String(userId),
      },
      orderBy: req.body.filter ? req.body.filter : { created_at: "desc" },
      include: {
        AppImages: true,
        User: true,
      },
    });

    res.json(apps);
  }
};

export default handler;
