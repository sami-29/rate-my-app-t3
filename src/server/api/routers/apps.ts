import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const AppField = z.object({
  ownerId: z.string().min(1, { message: "required" }),
  title: z.string().min(1).max(63),
  description: z.string().min(1).max(1023),
  images: z.array(z.string().url()).min(1).max(5),
  type: z.enum(["WEB", "MOBILE", "DESKTOP"]),
  url: z.union([z.string().url().nullish(), z.literal("")]),
  sourceCodeUrl: z.union([z.string().url().nullish(), z.literal("")]),
});

export const appsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.app.findMany({
      take: 100,
      orderBy: [{ created_at: "desc" }],
    });
  }),

  create: protectedProcedure
    .input(AppField)
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.auth.userId;

      const app = await ctx.prisma.app.create({
        data: {
          ownerId: authorId!,
          title: input.title,
          description: input.description,
          type: input.type,
          url: input.url,
          sourceCodeUrl: input.sourceCodeUrl,
        },
      });

      input.images.forEach(async (imageUrl) => {
        await ctx.prisma.appImage.create({
          data: {
            url: imageUrl,
            appId: app.id,
          },
        });
      });

      return app;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        appId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const app = await ctx.prisma.app.delete({
        where: {
          id: input.appId,
        },
      });

      return app;
    }),
});
