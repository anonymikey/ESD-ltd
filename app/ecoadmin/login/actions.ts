"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured) {
    redirect("/ecoadmin/login?error=unconfigured");
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/ecoadmin");

  if (!email || !password) {
    redirect("/ecoadmin/login?error=missing");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/ecoadmin/login?error=invalid");
  }

  // Authentication succeeded, but authentication alone doesn't grant
  // access — the (admin) layout re-checks admin_users on every load and
  // will bounce back to login if this account isn't an authorized admin.
  redirect(next.startsWith("/ecoadmin") ? next : "/ecoadmin");
}
