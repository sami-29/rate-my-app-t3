import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const appsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.app.findMany();
  }),
});
