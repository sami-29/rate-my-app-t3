import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const AppField = z.object({
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

  create: publicProcedure
    .input(
      AppField.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("RUNNING");
      const app = await ctx.prisma.app.create({
        data: {
          description: input.description,
          title: input.title,
          type: input.type,
          ownerId: input.id,
          url: input.url,
          sourceCodeUrl: input.sourceCodeUrl,
        },
      });
      console.log(app);
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

  modify: protectedProcedure
    .input(
      AppField.partial().extend({
        appId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const app = await ctx.prisma.app.update({
        where: { id: input.appId },
        data: input,
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
