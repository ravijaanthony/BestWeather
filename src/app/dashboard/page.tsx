import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <DashboardClient
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      userPicture={session.user.picture ?? ""}
    />
  );
}
