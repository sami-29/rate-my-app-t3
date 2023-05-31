import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const { id, name, email, profilePic } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        profilePic: profilePic,
      },
    });

    res.json(updatedUser);
  }
};

export default handler;
