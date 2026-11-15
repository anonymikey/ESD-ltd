"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { createClient } from "@/lib/supabase/server";
import { notifyAllAdmins, resolveActorLabel } from "@/lib/ecoadmin/notifications";
import { normalizeTheme, type AdminTheme } from "@/lib/ecoadmin/theme";

export async function updateRetentionDays(formData: FormData) {
  const result = await checkAdmin();
  if (!result.ok) redirect("/ecoadmin/login");

  const raw = String(formData.get("retentionDays") || "");
  const days = Number(raw);

  if (!Number.isFinite(days) || days < 1 || days > 3650) {
    // Invalid input — no-op rather than saving something nonsensical.
    return;
  }

  const supabase = createClient();

  // Read the previous value first so the notification can say what
  // actually changed, not just the new value in isolation.
  const { data: previous } = await supabase
    .from("retention_settings")
    .select("retention_days")
    .eq("id", 1)
    .maybeSingle();
  const previousDays = (previous?.retention_days as number | undefined) ?? null;

  const { error } = await supabase
    .from("retention_settings")
    .update({
      retention_days: Math.round(days),
      updated_by: result.context.adminId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (!error && previousDays !== Math.round(days)) {
    const actorName = resolveActorLabel(result.context.displayName, result.context.user.email);
    await notifyAllAdmins({
      actorAdminId: result.context.adminId,
      actorName,
      type: "SETTINGS_UPDATED",
      title: "Retention setting changed",
      message:
        previousDays !== null
          ? `${actorName} changed email retention from ${previousDays} to ${Math.round(days)} days.`
          : `${actorName} set email retention to ${Math.round(days)} days.`,
      entityType: "settings",
      entityId: "retention_days",
      metadata: { previousDays, newDays: Math.round(days) },
    });
  }

  revalidatePath("/ecoadmin/settings");
  revalidatePath("/ecoadmin/sent");
}

export async function saveAdminTheme(theme: AdminTheme) {
  const result = await checkAdmin();
  if (!result.ok) return { error: "Not authorized." };

  const safeTheme = normalizeTheme(theme);
  const supabase = createClient();
  const { error } = await supabase.from("admin_preferences").upsert(
    {
      admin_user_id: result.context.adminId,
      theme: safeTheme,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "admin_user_id" }
  );

  if (error) return { error: "Could not save the theme. Apply migration 0004 and try again." };

  const actorName = resolveActorLabel(result.context.displayName, result.context.user.email);
  await notifyAllAdmins({
    actorAdminId: result.context.adminId,
    actorName,
    type: "SETTINGS_UPDATED",
    title: "Admin theme updated",
    message: `${actorName} updated the EcoAdmin color and font theme.`,
    entityType: "settings",
    entityId: "admin_theme",
    metadata: { themeName: safeTheme.name, font: safeTheme.font },
  });

  revalidatePath("/ecoadmin", "layout");
  return { error: null };
}
