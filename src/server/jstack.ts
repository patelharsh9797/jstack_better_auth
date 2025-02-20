import { HTTPException } from "hono/http-exception";
import { jstack } from "jstack";

import { auth } from "./auth";
import { db } from "./db";

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

/**
 * Type-safely injects database into all procedures
 * @see https://jstack.app/docs/backend/middleware
 *
 * For deployment to Cloudflare Workers
 * @see https://developers.cloudflare.com/workers/tutorials/postgres/
 */
const databaseMiddleware = j.middleware(async ({ next }) => {
  return await next({ db });
});

const authMiddleware = j.middleware(async ({ c, next }) => {
  // const { db } = ctx as InferMiddlewareOutput<typeof databaseMiddleware>;

  const session = await auth.api.getSession({
    headers: new Headers(c.req.header()),
  });

  if (!session?.user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return await next({
    user: session.user,
  });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware);

export const privateProcedure = publicProcedure.use(authMiddleware);
