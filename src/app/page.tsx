import SignoutButton from "@/components/auth/signout-button";
import { RecentPost } from "@/components/post";
import { cn } from "@/lib/utils";
import { getServerSession } from "@/server/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col items-center justify-center relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <h1
          className={cn(
            "inline-flex tracking-tight flex-col gap-1 transition text-center",
            "font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-none lg:text-[4rem]",
            "bg-gradient-to-r from-20% bg-clip-text text-transparent",
            "from-white to-gray-50",
          )}
        >
          <span>JStack</span>
        </h1>

        <p className="text-[#ececf399] text-lg/7 md:text-xl/8 text-pretty sm:text-wrap sm:text-center text-center mb-8">
          The stack for building seriously fast, lightweight and{" "}
          <span className="inline sm:block">
            end-to-end typesafe Next.js apps.
          </span>
        </p>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>

            {!session ? (
              <Link
                href={session ? "/signout" : "/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            ) : (
              <SignoutButton />
            )}
          </div>
        </div>

        {/* {session?.user && <RecentPost />} */}
        <RecentPost />
      </div>
    </main>
  );
}
