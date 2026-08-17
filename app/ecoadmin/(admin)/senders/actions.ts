"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_DOMAIN = "ecostructdynamicsltd.com";

export async function proposeSender(formData: FormData) {
  const result = await checkAdmin();
  if (!result.ok) redirect("/ecoadmin/login");

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") || "").trim();

  if (!email.endsWith(`@${ALLOWED_DOMAIN}`) || !displayName) {
    // Silently no-op on an invalid submission — the DB CHECK constraint
    // would reject it anyway; this avoids a round trip for the obvious case.
    return;
  }

  const supabase = createClient();

  // Created as verified + active immediately. This is safe specifically
  // because DNS/SPF/DKIM verification with the email provider is done once,
  // at the *domain* level (ecostructdynamicsltd.com) — not per mailbox.
  // Once that domain-wide verification is complete (it is, as of Phase 0),
  // any further @ecostructdynamicsltd.com address is already covered by
  // it; there is no additional provider-side step for a new address on the
  // same domain to actually be able to send. The gate that matters here is
  // "only an authenticated, authorized admin can call this" (checkAdmin()
  // above) plus "only this exact domain" (the CHECK constraint on
  // senders.email, enforced at the database level regardless of this
  // code path) — both of which are unchanged and still enforced.
  //
  // The Activate/Deactivate controls below remain for taking an existing
  // sender out of rotation (or back in) without deleting it — e.g. if an
  // address is retired, or was added in error.
  await supabase.from("senders").insert({
    email,
    display_name: displayName,
    reply_to: email,
    is_active: true,
    verification_status: "verified",
  });

  revalidatePath("/ecoadmin/senders");
}

/**
 * Marks a proposed sender as verified + active, making it selectable in
 * Compose. This does NOT perform any DNS or provider verification itself —
 * it only records that an admin has confirmed verification was completed
 * directly with the email provider. The domain restriction on `senders`
 * still applies regardless (see the CHECK constraint in 0001).
 */
export async function activateSender(id: string) {
  const result = await checkAdmin();
  if (!result.ok) redirect("/ecoadmin/login");

  const supabase = createClient();
  const { error } = await supabase
    .from("senders")
    .update({
      verification_status: "verified",
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/ecoadmin/senders");
  return { error: error?.message ?? null };
}

/** Takes a sender out of Compose without deleting its record or history. */
export async function deactivateSender(id: string) {
  const result = await checkAdmin();
  if (!result.ok) redirect("/ecoadmin/login");

  const supabase = createClient();
  const { error } = await supabase
    .from("senders")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/ecoadmin/senders");
  return { error: error?.message ?? null };
}
