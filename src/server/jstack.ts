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
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  return await next({ db });
});

const auth_databaseMiddleware = j.middleware(async ({ c, next }) => {
  const session = await auth.api.getSession({
    headers: new Headers(c.req.header()),
  });

  if (!session?.user) {
    throw new HTTPException(401, {
      message: "Unauthorized, sign in to continue.",
    });
  }

  return await next({ db, user: session.user });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware);

export const privateProcedure = j.procedure.use(auth_databaseMiddleware);
