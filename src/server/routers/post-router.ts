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

  create: privateProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, c, input }) => {
      const { name } = input;
      const { db, user } = ctx;

      const post = await db
        .insert(posts)
        .values({ name, createdById: user.id });

      return c.superjson(post);
    }),
});
