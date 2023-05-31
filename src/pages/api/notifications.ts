import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (req.method === "POST") {
      const { content, userId } = await req.body;
      const notification = await prisma.notification.create({
        data: {
          content: content,
          userId: userId,
        },
      });

      res.json({
        id: notification.id,
      });
    }
  } else if (req.method === "PUT") {
    const { id } = req.body;

    const updatedNotification = await prisma.notification.update({
      where: {
        id: id,
      },
      data: {
        isRead: true,
      },
    });

    res.json(updatedNotification);
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    const deletedNotification = await prisma.notification.delete({
      where: {
        id: id,
      },
    });

    res.json(deletedNotification);
  } else if (req.method === "GET") {
    const { id, userId } = req.query;

    if (id) {
      const notification = await prisma.notification.findUnique({
        where: {
          id: String(id),
        },
      });

      if (notification) {
        res.json(notification);
      } else {
        res.status(404).json({ error: "Notification not found" });
      }
    } else if (userId) {
      const notifications = await prisma.notification.findMany({
        where: {
          id: String(userId),
        },
      });
      res.json(notifications);
    }
  }
};

export default handler;
