import { appRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest) => {
  const evt = req.body.evt as WebhookEvent;
  const caller = appRouter.createCaller({} as any);

  switch (evt.type) {
    case "user.created":
      const { username, email_addresses, id, profile_image_url } = evt.data;

      const result = await caller.users.createUser({
        clerkId: id,
        email: email_addresses[0]?.email_address!,
        name: username!,
        profilePic: profile_image_url,
      });
  }
};
