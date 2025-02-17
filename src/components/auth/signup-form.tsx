"use client";

import { useState } from "react";

import { LoadingButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signUpSchema, type SignUpSchemaType } from "@/lib/zod";
import { authClient } from "@/server/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [pending, setPending] = useState(false);
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => setPending(true),
        onSuccess: () => {
          toast.success("Account created", {
            description:
              "Your account has been created. Check your email for a verification link.",
          });
        },
        onError: (ctx) => {
          toast.error("Something went wrong", {
            description: ctx.error.message,
          });
        },
      },
    );

    setPending(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Enter your email below to sign up for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof SignUpSchemaType}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                                ? "email"
                                : "text"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={pending}>Sign up</LoadingButton>
              {/* <Button type="button" variant="outline" className="w-full"> */}
              {/*   Login with Google */}
              {/* </Button> */}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
