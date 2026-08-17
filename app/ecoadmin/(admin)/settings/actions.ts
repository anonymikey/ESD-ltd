"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { createClient } from "@/lib/supabase/server";

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
  await supabase
    .from("retention_settings")
    .update({
      retention_days: Math.round(days),
      updated_by: result.context.adminId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  revalidatePath("/ecoadmin/settings");
  revalidatePath("/ecoadmin/sent");
}
