import { prisma } from "@/server/db";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import type { NextApiRequest, NextApiResponse } from "next";

const clerkSyncHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const evt = req.body as WebhookEvent;

  switch (evt.type) {
    case "user.created":
      const { username, email_addresses, id, profile_image_url } = evt.data;

      try {
        const result = await prisma.user.create({
          data: {
            email: email_addresses[0]!.email_address,
            id: id,
            name: username ? username : evt.data.first_name,
            profilePic: profile_image_url,
          },
        });

        res.status(200).json({ data: { success: result } });
      } catch (err) {
        res.status(500).json({
          error: { message: `Error while creating user` },
        });
      }

    case "user.updated":
      const result = await prisma.user.update({
        where: {
          id: evt.data.id,
        },
        data: {
          email: evt.data.email_addresses[0]?.email_address,
          name: evt.data.username ? evt.data.username : evt.data.first_name,
          profilePic: evt.data.profile_image_url,
        },
      });

      res.status(200).json({ data: { success: result } });

    case "user.deleted":
      const user = await prisma.user.delete({
        where: {
          id: evt.data.id,
        },
      });

      res.status(200).json({ data: { success: user } });
  }
};

export default clerkSyncHandler;
