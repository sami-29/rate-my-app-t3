import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const app = await prisma.app.findUnique({
      where: {
        id: req.body.id,
      },
    });

    if (!app) {
      res.status(404);
      return;
    }

    const images = await prisma.appImage.findMany({
      where: {
        appId: app.id,
      },
    });

    const appWithImages = {
      ...app,
      images: images,
    };

    res.json(appWithImages);
  }
};

export default handler;
