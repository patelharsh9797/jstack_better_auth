import { env } from "@/env.mjs";
import type { Session } from "@/server/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/signin", "/signup"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const adminRoutes = ["/admin"];
// const noAuthRoutes = ["/test"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);
  // const isOnlyProtectedRoutes = onlyProtectedRoutes.includes(pathName);
  // const isNoAuthRoute = noAuthRoutes.includes(pathName);

  // if (isNoAuthRoute) {
  //   return NextResponse.next();
  // }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: env.BETTER_AUTH_URL,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  if (!session) {
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)",
  ],
};
