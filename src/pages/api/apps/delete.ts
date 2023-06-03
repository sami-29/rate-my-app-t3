import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("running");
  if (req.method === "DELETE") {
    const { id } = req.body;
    console.log(`deleting ${id}`);
    const deletedApp = await prisma.app.delete({
      where: {
        id: id,
      },
      include: {
        AppImages: true,
      },
    });

    res.json(deletedApp);
  }
};

export default handler;
