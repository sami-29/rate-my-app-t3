import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = await req.body;
    console.log(data);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        id: data.id,
        name: data.name,
        profilePic: data.profilePic,
      },
    });

    res.json({
      id: user.id,
    });
  }
};

export default handler;
