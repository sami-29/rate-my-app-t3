import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { score, type, appId, userId } = req.body;

    const rating = await prisma.rating.create({
      data: {
        score: score,
        type: type,
        appId: appId,
        userId: userId,
      },
    });

    res.json({
      id: rating.id,
    });
  } else if (req.method === "PUT") {
    const { id, score, type } = req.body;

    const updatedRating = await prisma.rating.update({
      where: {
        id: id,
      },
      data: {
        score: score,
        type: type,
      },
    });

    res.json(updatedRating);
  } else if (req.method === "GET") {
    const { appId, userId } = req.query;

    if (appId) {
      const ratingsByApp = await prisma.rating.findMany({
        where: {
          appId: String(appId),
        },
      });

      res.json(ratingsByApp);
    } else if (userId) {
      const ratingsByUser = await prisma.rating.findMany({
        where: {
          userId: String(userId),
        },
      });

      res.json(ratingsByUser);
    } else {
      const ratings = await prisma.rating.findMany();
      res.json(ratings);
    }
  }
};

export default handler;
