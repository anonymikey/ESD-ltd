import "server-only";
import { createClient } from "@/lib/supabase/server";

// Deliberately DB-backed rather than in-memory: Vercel serverless functions
// don't share memory between invocations, so an in-memory counter would
// reset on almost every request and provide no real protection. Reusing
// email_logs (which we're already writing to) avoids adding a separate
// Redis/Upstash dependency for something the existing Postgres instance can
// already do.

const WINDOW_MINUTES = 10;
const MAX_SENDS_PER_WINDOW = 20;

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

export async function checkRateLimit(adminId: string): Promise<RateLimitResult> {
  try {
    const supabase = createClient();
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from("email_logs")
      .select("id", { count: "exact", head: true })
      .eq("admin_user_id", adminId)
      .gte("created_at", since);

    if (error) {
      // If we can't verify the limit, fail closed rather than allow
      // unlimited sends.
      return { allowed: false, reason: "Unable to verify send rate — try again shortly." };
    }

    if ((count ?? 0) >= MAX_SENDS_PER_WINDOW) {
      return {
        allowed: false,
        reason: `Rate limit reached: max ${MAX_SENDS_PER_WINDOW} emails per ${WINDOW_MINUTES} minutes.`,
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: false, reason: "Unable to verify send rate — try again shortly." };
  }
}

/** Prevents the same compose submission (e.g. a double-click, or a retried
 * request) from sending twice. The composer generates one idempotency key
 * per submission attempt and resends it on retry. */
export async function checkDuplicateSubmission(idempotencyKey: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("email_logs")
      .select("id")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    return Boolean(data);
  } catch {
    // If we can't check, don't block the send on this alone — the UI-level
    // "prevent duplicate submissions while sending" guard is the primary
    // defense; this is a server-side backstop, not the only layer.
    return false;
  }
}
