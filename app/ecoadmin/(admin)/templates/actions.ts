"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { createClient } from "@/lib/supabase/server";

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

  await supabase.from("templates").insert({
    name,
    subject,
    body,
    created_by: admin.adminId,
  });

  revalidatePath("/ecoadmin/templates");
  redirect("/ecoadmin/templates");
}

export async function updateTemplate(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!name || !subject || !body) return;

  await supabase
    .from("templates")
    .update({ name, subject, body, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/ecoadmin/templates");
  redirect("/ecoadmin/templates");
}

export async function deleteTemplate(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await supabase.from("templates").delete().eq("id", id);
  revalidatePath("/ecoadmin/templates");
}
