import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.body.id },
    });

    console.log(notifications);
    res.json(notifications);
  }
};

export default handler;
