import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { NextApiRequest } from "next";

const handler = (req: NextApiRequest) => {
  const evt = req.body.evt as WebhookEvent;
  switch (evt.type) {
    case "user.created":
      evt.data.banned; // this is also typed
  }
};
