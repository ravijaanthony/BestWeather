import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import DashboardClient from "./DashboardClient";
import { DashboardSkeleton } from "./DashboardSkeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <DashboardClient
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
    />
  );
}
