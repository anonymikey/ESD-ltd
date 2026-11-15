"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { createClient } from "@/lib/supabase/server";
import { notifyAllAdmins, resolveActorLabel } from "@/lib/ecoadmin/notifications";

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

  // Proposing a sender never activates it. An admin must first verify the
  // address with the provider, then use the explicit Activate control below.
  // This keeps the approval boundary visible even when the domain itself has
  // already been verified.
  const { error } = await supabase.from("senders").insert({
    email,
    display_name: displayName,
    reply_to: email,
    is_active: false,
    verification_status: "pending",
  });

  // Notification only follows a genuinely successful insert — a rejected
  // insert (e.g. a duplicate email tripping the unique constraint) must not
  // produce a "sender added" notification for a sender that doesn't exist.
  if (!error) {
    const actorName = resolveActorLabel(result.context.displayName, result.context.user.email);
    await notifyAllAdmins({
      actorAdminId: result.context.adminId,
      actorName,
      type: "SENDER_PROPOSED",
      title: "Sender proposed",
      message: `${actorName} proposed sender ${email}. Verify it with the provider, then activate it before sending.`,
      entityType: "sender",
      entityId: email,
      metadata: { email, displayName },
    });
  }

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
  const { error, data } = await supabase
    .from("senders")
    .update({
      verification_status: "verified",
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("email")
    .maybeSingle();

  if (!error) {
    const actorName = resolveActorLabel(result.context.displayName, result.context.user.email);
    const senderEmail = (data?.email as string | undefined) ?? id;
    await notifyAllAdmins({
      actorAdminId: result.context.adminId,
      actorName,
      type: "SENDER_ACTIVATED",
      title: "Sender activated",
      message: `${actorName} activated sender ${senderEmail}. It's available in Compose now.`,
      entityType: "sender",
      entityId: id,
      metadata: { email: senderEmail },
    });
  }

  revalidatePath("/ecoadmin/senders");
  return { error: error?.message ?? null };
}

/** Takes a sender out of Compose without deleting its record or history. */
export async function deactivateSender(id: string) {
  const result = await checkAdmin();
  if (!result.ok) redirect("/ecoadmin/login");

  const supabase = createClient();
  const { error, data } = await supabase
    .from("senders")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("email")
    .maybeSingle();

  if (!error) {
    const actorName = resolveActorLabel(result.context.displayName, result.context.user.email);
    const senderEmail = (data?.email as string | undefined) ?? id;
    await notifyAllAdmins({
      actorAdminId: result.context.adminId,
      actorName,
      type: "SENDER_DEACTIVATED",
      title: "Sender deactivated",
      message: `${actorName} deactivated sender ${senderEmail}. It can no longer be used to send emails.`,
      entityType: "sender",
      entityId: id,
      metadata: { email: senderEmail },
    });
  }

  revalidatePath("/ecoadmin/senders");
  return { error: error?.message ?? null };
}
