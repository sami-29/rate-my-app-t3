import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    const { id } = req.body;

    const deletedApp = await prisma.app.delete({
      where: {
        id: id,
      },
    });

    res.json(deletedApp);
  }
};

export default handler;
