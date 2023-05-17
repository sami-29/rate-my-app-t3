import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

/**
 * Router for managing applications.
 */
export const appsRouter = createTRPCRouter({
  /**
   * Retrieves a list of all applications.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of application objects.
   */
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.app.findMany({
      take: 100,
      orderBy: [{ created_at: "desc" }],
    });
  }),

  /**
   * Creates a new application.
   * @param {Object} input - The input object containing application details.
   * @param {string} input.title - The title of the application.
   * @param {string} input.description - The description of the application.
   * @param {string} input.type - The type of the application (one of "WEB", "MOBILE", or "DESKTOP").
   * @param {string|null} input.url - The URL of the application (can be null or an empty string).
   * @param {string|null} input.sourceCodeUrl - The URL of the application's source code (can be null or an empty string).
   * @returns {Promise<Object>} A promise that resolves to the created application object.
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(80),
        description: z.string().min(1).max(2000),
        type: z.enum(["WEB", "MOBILE", "DESKTOP"]),
        url: z.union([z.string().url().nullish(), z.literal("")]),
        sourceCodeUrl: z.union([z.string().url().nullish(), z.literal("")]),
      })
    )
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
      return app;
    }),
});
