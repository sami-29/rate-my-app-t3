import { appRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const evt = req.body.evt as WebhookEvent;
  const caller = appRouter.createCaller({} as any);

  switch (evt.type) {
    case "user.created":
      const { username, email_addresses, id, profile_image_url } = evt.data;

      try {
        const result = await caller.users.createUser({
          clerkId: id,
          email: email_addresses[0]?.email_address!,
          name: username!,
          profilePic: profile_image_url,
        });

        res.status(200).json({ data: { success: result ? true : false } });
      } catch (err) {
        // If this a tRPC error, we can extract additional information.
        if (err instanceof TRPCError) {
          // We can get the specific HTTP status code coming from tRPC (e.g. 404 for `NOT_FOUND`).
          const httpStatusCode = getHTTPStatusCodeFromError(err);

          res.status(httpStatusCode).json({ error: { message: err.message } });
          return;
        }

        // This is not a tRPC error, so we don't have specific information.
        res.status(500).json({
          error: { message: `Error while creating user` },
        });
      }
  }
};
