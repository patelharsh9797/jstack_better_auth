import type { AppRouter } from "@/server";
import { createClient } from "jstack";

/**
 * Your type-safe API client
 * @see https://jstack.app/docs/backend/api-client
 */
export const client = createClient<AppRouter>({
  baseUrl: getBaseUrl(),
});

function getBaseUrl() {
  let url: string = "";
  // 👇 Adjust for wherever you deploy
  if (process.env.VERCEL_URL) url = `https://${process.env.VERCEL_URL}`;
  if (process.env.NETLIFY_URL) url = `https://${process.env.NETLIFY_URL}`;

  url = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api`;

  return url;
}
