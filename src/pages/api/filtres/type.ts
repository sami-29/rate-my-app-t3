import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { type, filter } = await req.body;
    const app = await prisma.app.findMany({
      where: {
        type,
      },
      orderBy: [filter],
      include: {
        AppImages: true,
        User: true,
      },
    });

    res.json({
      apps: app,
    });
  }
};

export default handler;
