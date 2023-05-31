import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = await req.body;

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        appId: data.appId,
        userId: data.userId,
      },
    });

    res.json({
      id: comment.id,
    });
  } else if (req.method === "PUT") {
    const { id, content } = req.body;

    const updatedComment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        content: content,
      },
    });

    res.json(updatedComment);
  } else if (req.method === "GET") {
    const { appId, userId } = req.query;

    if (appId) {
      const commentsByPost = await prisma.comment.findMany({
        where: {
          appId: String(appId),
        },
      });

      res.json(commentsByPost);
    } else if (userId) {
      const commentsByUser = await prisma.comment.findMany({
        where: {
          userId: String(userId),
        },
      });

      res.json(commentsByUser);
    } else {
      const comments = await prisma.comment.findMany();
      res.json(comments);
    }
  }
};

export default handler;
