import { redirect } from "next/navigation";
import AdminShell from "@/components/ecoadmin/AdminShell";
import { checkAdmin } from "@/lib/ecoadmin/auth";

// Every route inside this group re-verifies admin status server-side, in
// addition to the middleware check — a deliberate second layer. Middleware
// only confirms "there's a valid Supabase session"; this confirms "and that
// session belongs to an active row in admin_users".
export default async function EcoAdminLayout({ children }: { children: React.ReactNode }) {
  const result = await checkAdmin();

  if (!result.ok) {
    redirect("/ecoadmin/login");
  }

  const displayName = result.context.displayName ?? result.context.user.email ?? "Admin";

  return <AdminShell displayName={displayName}>{children}</AdminShell>;
}
