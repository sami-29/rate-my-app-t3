import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      take: 100,
      orderBy: [{ created_at: "desc" }],
    });
  }),
  getUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({ where: { id: input.userId } });
    }),
  createUser: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        name: z.string(),
        email: z.string().email(),
        profilePic: z.union([z.string().url().nullish(), z.literal("")]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.create({
        data: input,
      });
      return true;
    }),
  deleteUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.userId } });

      return {
        message: "Deleted user successfully",
      };
    }),
});
