import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running");

  if (req.method === "DELETE") {
    const { id } = req.query;
    console.log(`deleting ${id}`);

    try {
      const userId = getAuth(req).userId;
      const app = await prisma.app.findUnique({
        where: { id: String(id) },
        select: { ownerId: true },
      });

      if (!app || app.ownerId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await prisma.appImage.deleteMany({
        where: { appId: String(id) },
      });

      await prisma.rating.deleteMany({
        where: { appId: String(id) },
      });

      await prisma.comment.deleteMany({
        where: { appId: String(id) },
      });

      const deletedApp = await prisma.app.delete({
        where: { id: String(id) },
      });

      console.log(deletedApp);
      return res.json(deletedApp);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
