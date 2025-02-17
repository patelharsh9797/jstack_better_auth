import { cache } from "react";

import { env } from "@/env.mjs";
import {
  sendChangeEmailVerification,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "@/server/auth/email";
import { db } from "@/server/db";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: [env.BETTER_AUTH_URL],
  plugins: [
    openAPI(), // /api/auth/reference
    // admin({
    //     impersonationSessionDuration: 60 * 60 * 24 * 7, // 7 days
    // }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
    // additionalFields: {
    //     isPremium: {
    //         type: "boolean",
    //         required: true,
    //     },
    // },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        const { error } = await sendChangeEmailVerification({
          email: newEmail,
          verificationUrl: url,
        });
        if (error)
          return console.log("sendChangeEmailVerification Error: ", error);
      },
    },
  },
  rateLimit: {
    window: 60, // time window in seconds
    max: 5, // max requests in the window
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      redirectURI: env.BETTER_AUTH_URL + "/api/auth/callback/github",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await sendResetPasswordEmail({
        email: user.email,
        verificationUrl: url,
      });

      if (error) return console.log("sendResetPasswordEmail Error: ", error);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 1, // 1 HOUR
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      const { error } = await sendVerificationEmail({
        email: user.email,
        verificationUrl: verificationUrl,
      });

      if (error) return console.log("sendVerificationEmail Error: ", error);
    },
  },
} satisfies BetterAuthOptions);

// To get session in server components
export const getServerSession = cache(
  async () =>
    await auth.api.getSession({
      headers: await headers(),
    }),
);

export type Session = typeof auth.$Infer.Session;
export type AuthUserType = Session["user"];
