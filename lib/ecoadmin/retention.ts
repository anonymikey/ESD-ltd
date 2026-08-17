import "server-only";
import { createClient } from "@/lib/supabase/server";

export const RETENTION_PRESETS = [30, 90, 180, 365] as const;
export const DEFAULT_RETENTION_DAYS = 180;

export interface RetentionSettings {
  retentionDays: number;
  updatedAt: string | null;
}

export interface CleanupRun {
  id: string;
  runType: "individual" | "bulk_selection" | "older_than";
  retentionDays: number | null;
  recordsDeleted: number;
  createdAt: string;
}

export async function getRetentionSettings(): Promise<RetentionSettings> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("retention_settings")
      .select("retention_days, updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (!data) return { retentionDays: DEFAULT_RETENTION_DAYS, updatedAt: null };

    return {
      retentionDays: data.retention_days as number,
      updatedAt: (data.updated_at as string) ?? null,
    };
  } catch {
    return { retentionDays: DEFAULT_RETENTION_DAYS, updatedAt: null };
  }
}

export async function countEligibleForDeletion(retentionDays: number): Promise<number> {
  try {
    const supabase = createClient();
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("email_logs")
      .select("id", { count: "exact", head: true })
      .lt("created_at", cutoff);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getLastCleanupRun(): Promise<CleanupRun | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("cleanup_runs")
      .select("id, run_type, retention_days, records_deleted, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id as string,
      runType: data.run_type as CleanupRun["runType"],
      retentionDays: (data.retention_days as number | null) ?? null,
      recordsDeleted: data.records_deleted as number,
      createdAt: data.created_at as string,
    };
  } catch {
    return null;
  }
}
