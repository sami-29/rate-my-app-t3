import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running");
  if (req.method === "DELETE") {
    const { id } = req.query;
    console.log(`deleting ${id}`);

    try {
      await prisma.$transaction(async (prisma) => {
        // Delete associated AppImages
        await prisma.appImage.deleteMany({
          where: {
            appId: String(id),
          },
        });

        // Delete the App
        const deletedApp = await prisma.app.delete({
          where: {
            id: String(id),
          },
          include: {
            Comments: true,
            Ratings: true,
            Donations: true,
          },
        });

        console.log(deletedApp);
        res.json(deletedApp);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default handler;
