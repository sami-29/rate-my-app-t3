import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const { id, title, description, type, sourceCodeUrl, url, ownerId } =
      req.body;

    const updatedApp = await prisma.app.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        type: type,
        sourceCodeUrl: sourceCodeUrl,
        url: url,
      },
    });

    res.json(updatedApp);
  }
};

export default handler;
