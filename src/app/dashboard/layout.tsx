import { Topbar } from "@/components/topbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "USER") redirect("/admin");

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Topbar
        name={session.user.name ?? session.user.username}
        roleLabel="صانع محتوى"
        links={[{ href: "/dashboard", label: "قنواتي", icon: "dashboard" }]}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
