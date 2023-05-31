import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const app = await prisma.app.findUnique({
      where: {
        id: req.body.id,
      },
      include: {
        AppImages: true,
      },
    });

    if (!app) {
      res.status(404);
      return;
    }

    res.json(app);
  }
};

export default handler;
