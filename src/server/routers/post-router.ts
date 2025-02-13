import { posts } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { j, privateProcedure, publicProcedure } from "../jstack";

export const postRouter = j.router({
  recent: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const [recentPost] = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(1);

    return c.superjson(recentPost ?? null);
  }),

  all: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;

    const recentPosts = await db.query.posts.findMany({
      // orderBy: desc(posts.createdAt),
      where: (model, { eq }) => eq(model.createdById, user.id),
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });

    return c.superjson(recentPosts);
  }),

  create: privateProcedure
    .input(
      z.object({ name: z.string().min(1, { message: "Name is required" }) }),
    )
    .mutation(async ({ ctx, c, input }) => {
      const { name } = input;
      const { db, user } = ctx;

      const post = await db
        .insert(posts)
        .values({ name, createdById: user.id });

      return c.superjson(post);
    }),
});
