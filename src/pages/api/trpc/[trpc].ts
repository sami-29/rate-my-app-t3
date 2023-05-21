import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "@/env.mjs";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import { NextApiRequest, NextApiResponse } from "next";

// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // We can use the response object to enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  return nextApiHandler;
}
