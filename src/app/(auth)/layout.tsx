import { getServerSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session?.user) redirect("/");

  return children;
}
