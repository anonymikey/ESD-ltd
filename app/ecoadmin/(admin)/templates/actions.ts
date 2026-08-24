"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { createClient } from "@/lib/supabase/server";
import { notifyAllAdmins, resolveActorLabel } from "@/lib/ecoadmin/notifications";

async function requireAdmin() {
  const result = await checkAdmin();
  if (!result.ok) redirect("/ecoadmin/login");
  return result.context;
}

export async function createTemplate(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!name || !subject || !body) return;

  const { error } = await supabase.from("templates").insert({
    name,
    subject,
    body,
    created_by: admin.adminId,
  });

  if (!error) {
    const actorName = resolveActorLabel(admin.displayName, admin.user.email);
    await notifyAllAdmins({
      actorAdminId: admin.adminId,
      actorName,
      type: "TEMPLATE_CREATED",
      title: "Template created",
      message: `${actorName} created template "${name}".`,
      entityType: "template",
      metadata: { name },
    });
  }

  revalidatePath("/ecoadmin/templates");
  redirect("/ecoadmin/templates");
}

export async function updateTemplate(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!name || !subject || !body) return;

  const { error } = await supabase
    .from("templates")
    .update({ name, subject, body, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (!error) {
    const actorName = resolveActorLabel(admin.displayName, admin.user.email);
    await notifyAllAdmins({
      actorAdminId: admin.adminId,
      actorName,
      type: "TEMPLATE_UPDATED",
      title: "Template updated",
      message: `${actorName} updated template "${name}".`,
      entityType: "template",
      entityId: id,
      metadata: { name },
    });
  }

  revalidatePath("/ecoadmin/templates");
  redirect("/ecoadmin/templates");
}

export async function deleteTemplate(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  // Fetched before deleting — the delete form only submits the id, and
  // the row (with its name) won't exist to look up afterward.
  const { data: existing } = await supabase.from("templates").select("name").eq("id", id).maybeSingle();

  const { error } = await supabase.from("templates").delete().eq("id", id);

  if (!error) {
    const actorName = resolveActorLabel(admin.displayName, admin.user.email);
    const name = (existing?.name as string | undefined) ?? "template";
    await notifyAllAdmins({
      actorAdminId: admin.adminId,
      actorName,
      type: "TEMPLATE_DELETED",
      title: "Template deleted",
      message: `${actorName} deleted template "${name}".`,
      entityType: "template",
      entityId: id,
      metadata: { name },
    });
  }

  revalidatePath("/ecoadmin/templates");
}
