import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { User } from "@supabase/supabase-js";

export interface AdminContext {
  user: User;
  adminId: string;
  displayName: string | null;
}

export type AdminCheckResult =
  | { ok: true; context: AdminContext }
  | { ok: false; reason: "unauthenticated" | "unauthorized" | "unconfigured" };

/**
 * The single source of truth for "is this request allowed to use the
 * ecoadmin panel". Used by both the layout (redirects) and the API routes
 * (returns a JSON error) — the two entry points share this instead of each
 * re-implementing the check.
 *
 * Authentication (a valid Supabase session) is necessary but not
 * sufficient: the caller must also have an active row in `admin_users`.
 * Any authenticated-but-not-admin user is treated the same as a signed-out
 * visitor for every admin route and API endpoint.
 */
export async function checkAdmin(): Promise<AdminCheckResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, reason: "unconfigured" };
  }

  const supabase = createClient();

  let user: User | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return { ok: false, reason: "unconfigured" };
  }

  if (!user) {
    return { ok: false, reason: "unauthenticated" };
  }

  const { data: adminRow, error } = await supabase
    .from("admin_users")
    .select("id, display_name, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !adminRow) {
    return { ok: false, reason: "unauthorized" };
  }

  return {
    ok: true,
    context: {
      user,
      adminId: adminRow.id as string,
      displayName: (adminRow.display_name as string | null) ?? null,
    },
  };
}
