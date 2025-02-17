// import { adminClient } from "better-auth/client/plugins";
import { env } from "@/env.mjs";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL, // the base url of your auth server
  //   plugins: [adminClient()],
});
