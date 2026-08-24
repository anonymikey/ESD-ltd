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

/**
 * Every delete path here removes rows from `email_logs` only — the
 * EcoAdmin audit record. None of this touches Resend, Gmail, Outlook, or
 * any mailbox; an email that was already sent stays sent.
 */

export async function deleteSingleLog(id: string) {
  const admin = await requireAdmin();
  const supabase = createClient();

  const { error, count } = await supabase
    .from("email_logs")
    .delete({ count: "exact" })
    .eq("id", id);

  if (!error && (count ?? 0) > 0) {
    await supabase.from("cleanup_runs").insert({
      performed_by: admin.adminId,
      run_type: "individual",
      records_deleted: count ?? 0,
    });

    const actorName = resolveActorLabel(admin.displayName, admin.user.email);
    await notifyAllAdmins({
      actorAdminId: admin.adminId,
      actorName,
      type: "EMAIL_LOG_DELETED",
      title: "Email record deleted",
      message: `${actorName} deleted an email record from Sent.`,
      entityType: "email_log",
      entityId: id,
      metadata: { count: count ?? 0 },
    });
  }

  revalidatePath("/ecoadmin/sent");
  revalidatePath("/ecoadmin/settings");
  return { error: error?.message ?? null, deleted: count ?? 0 };
}

export async function deleteSelectedLogs(ids: string[]) {
  const admin = await requireAdmin();
  if (ids.length === 0) return { error: "No records selected.", deleted: 0 };

  const supabase = createClient();
  const { error, count } = await supabase
    .from("email_logs")
    .delete({ count: "exact" })
    .in("id", ids);

  if (!error && (count ?? 0) > 0) {
    await supabase.from("cleanup_runs").insert({
      performed_by: admin.adminId,
      run_type: "bulk_selection",
      records_deleted: count ?? 0,
    });

    const actorName = resolveActorLabel(admin.displayName, admin.user.email);
    await notifyAllAdmins({
      actorAdminId: admin.adminId,
      actorName,
      type: "EMAIL_LOGS_BULK_DELETED",
      title: "Email records deleted",
      message: `${actorName} deleted ${count} email record${count === 1 ? "" : "s"} from Sent.`,
      entityType: "email_log",
      metadata: { count: count ?? 0 },
    });
  }

  revalidatePath("/ecoadmin/sent");
  revalidatePath("/ecoadmin/settings");
  return { error: error?.message ?? null, deleted: count ?? 0 };
}

export async function deleteLogsOlderThan(days: number) {
  const admin = await requireAdmin();
  if (!Number.isFinite(days) || days <= 0) {
    return { error: "Invalid retention period.", deleted: 0 };
  }

  const supabase = createClient();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { error, count } = await supabase
    .from("email_logs")
    .delete({ count: "exact" })
    .lt("created_at", cutoff);

  if (!error) {
    await supabase.from("cleanup_runs").insert({
      performed_by: admin.adminId,
      run_type: "older_than",
      retention_days: days,
      records_deleted: count ?? 0,
    });

    const actorName = resolveActorLabel(admin.displayName, admin.user.email);
    await notifyAllAdmins({
      actorAdminId: admin.adminId,
      actorName,
      type: "EMAIL_LOGS_CLEANED",
      title: "Email logs cleaned up",
      message: `${actorName} cleaned up ${count ?? 0} email record${(count ?? 0) === 1 ? "" : "s"} older than ${days} days.`,
      entityType: "email_log",
      metadata: { count: count ?? 0, retentionDays: days },
    });
  }

  revalidatePath("/ecoadmin/sent");
  revalidatePath("/ecoadmin/settings");
  return { error: error?.message ?? null, deleted: count ?? 0 };
}
