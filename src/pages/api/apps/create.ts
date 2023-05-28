import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = await req.body;
    console.log(data);
    const app = await prisma.app.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        sourceCodeUrl: data.sourceCodeUrl,
        url: data.url,
        ownerId: data.ownerId,
      },
    });

    data.images.forEach(async (image: string) => {
      await prisma.appImage.create({
        data: {
          url: image,
          appId: app.id,
        },
      });
    });

    console.log(app);

    res.json({
      id: app.id,
    });
  }
};

export default handler;
