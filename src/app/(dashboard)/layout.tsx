import { AppLayout } from "@/components/layout/app-layout";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppLayout user={session.user}>
      {children}
    </AppLayout>
  );
}
