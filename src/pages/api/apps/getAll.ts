import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const apps = await prisma.app.findMany({
      take: 100,
      orderBy: [{ created_at: "desc" }],
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
