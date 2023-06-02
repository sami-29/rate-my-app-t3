import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { userId } = req.query;
    let apps;
    if (!userId) {
      apps = await prisma.app.findMany({
        take: 100,
        orderBy: [req.body.filter ? req.body.filter : { created_at: "desc" }],
        include: {
          AppImages: true,
          User: true,
        },
      });
      console.log(apps);
      res.json(apps);
      return;
    }
    console.log(userId);
    apps = await prisma.app.findMany({
      where: {
        ownerId: String(userId),
      },
      orderBy: [req.body.filter ? req.body.filter : { created_at: "desc" }],
      include: {
        AppImages: true,
        User: true,
      },
    });

    console.log(apps);
    res.json(apps);
  }
};

export default handler;
