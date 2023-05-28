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
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log(input.id);
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      return user;
    }),
  createUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        profilePic: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          id: input.id,
          name: input.name,
          profilePic: input.profilePic,
        },
      });
    }),
  deleteUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.id } });

      return {
        message: "Deleted user successfully",
      };
    }),
});
