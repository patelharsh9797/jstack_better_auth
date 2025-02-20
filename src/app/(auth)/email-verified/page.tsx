"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/server/auth/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EmailVerifiedPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const searchParams = useSearchParams();
  const email_error = searchParams.get("error");

  if (isSessionLoading)
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="w-full max-w-md py-4">
            <CardDescription>
              <div className="space-y-4">
                <p className="text-center text-gray-600">
                  Please wait while we are verifying your email...
                </p>
              </div>
            </CardDescription>
          </Card>
        </div>
      </div>
    );

  if (!session?.user && !email_error)
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card className="w-full max-w-md py-4">
            <CardDescription>
              <div className="space-y-4">
                <p className="text-center text-gray-600">
                  You are not logged in to access this page.
                </p>
              </div>
            </CardDescription>
          </Card>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <ResetPasswordForm /> */}

        {email_error ? (
          <>
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-bold text-gray-800">
                  Invalid Reset Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    This password reset link is invalid or has expired.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="w-full max-w-md flex flex-col items-center justify-center">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-bold text-gray-800">
                  Email Verified!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="mb-4 text-gray-600">
                    Your email has been successfully verified.
                  </p>
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full",
                    })}
                  >
                    Go to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
