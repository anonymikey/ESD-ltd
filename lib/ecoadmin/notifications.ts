import "server-only";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SEVERITY, type ActivityType, type EntityType, type NotificationSeverity } from "./activityTypes";

export interface NotificationRecord {
  id: string;
  actorAdminId: string | null;
  actorName: string | null;
  type: ActivityType | string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotifyParams {
  /** Who performed the action. Omit (or pass null) for system-generated notices. */
  actorAdminId?: string | null;
  /** Denormalized display name/email of the actor — see migration 0003 for why. */
  actorName?: string | null;
  type: ActivityType;
  title: string;
  message: string;
  /** Defaults to a sensible value per type (see activityTypes.ts) if omitted. */
  severity?: NotificationSeverity;
  entityType?: EntityType | string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface ActivityFilters {
  unreadOnly?: boolean;
  type?: ActivityType | ActivityType[];
  severity?: NotificationSeverity;
  actorAdminId?: string;
}

export interface ActivityPage {
  items: NotificationRecord[];
  total: number;
  page: number;
  pageSize: number;
}

const MAX_METADATA_BYTES = 4000; // generous but bounded — this is a small operational note, not a data store
const DANGEROUS_METADATA_KEYS = [
  "password",
  "apikey",
  "api_key",
  "token",
  "secret",
  "authorization",
  "cookie",
  "session",
  "service_role",
  "resend_api_key",
];

/**
 * Strips anything that looks like a credential by key name (defense in
 * depth — call sites shouldn't be passing these anyway) and caps the total
 * size, so a notification can never become an unbounded or sensitive data
 * store. Message bodies specifically are never passed in here by any
 * existing call site and should never be added.
 */
function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!metadata) return {};

  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (DANGEROUS_METADATA_KEYS.some((bad) => key.toLowerCase().includes(bad))) continue;
    cleaned[key] = value;
  }

  const serialized = JSON.stringify(cleaned);
  if (serialized.length <= MAX_METADATA_BYTES) return cleaned;

  // Oversized — keep the notification useful rather than dropping it, but
  // don't store an unbounded payload.
  return { truncated: true, note: "metadata omitted — exceeded size limit" };
}

function toRecord(row: Record<string, unknown>): NotificationRecord {
  return {
    id: row.id as string,
    actorAdminId: (row.actor_admin_id as string | null) ?? null,
    actorName: (row.actor_name as string | null) ?? null,
    type: row.type as string,
    title: row.title as string,
    message: row.message as string,
    severity: row.severity as NotificationSeverity,
    entityType: (row.entity_type as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    isRead: row.is_read as boolean,
    createdAt: row.created_at as string,
  };
}

/**
 * Logs a notification-layer failure server-side only — never rethrown,
 * never surfaced to the client, never includes secrets (just the
 * notification `type`, which is safe, non-sensitive metadata about the
 * failure itself).
 */
function logFailure(context: string, type: string, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`[ecoadmin:notifications] ${context} failed for type=${type}: ${message}`);
}

/**
 * Resolves a human-readable actor label from whatever identity info a
 * caller has on hand — used so every wired-in action produces consistent
 * "Tony did X" phrasing without each one re-deriving it. Never falls back
 * to a hardcoded name; "An admin" only appears if neither a display name
 * nor an email is available, which shouldn't happen in practice since
 * Supabase Auth users always have an email.
 */
export function resolveActorLabel(displayName: string | null | undefined, email: string | null | undefined): string {
  return displayName?.trim() || email?.trim() || "An admin";
}

// ----------------------------------------------------------------------------
// Writes
// ----------------------------------------------------------------------------

/**
 * Notifies a single specific admin. Never throws — a notification failure
 * must never break the operation that triggered it. Callers should still
 * `await` this (rather than fire-and-forget) so the write has a chance to
 * complete before a serverless function's response is sent.
 */
export async function notifyAdmin(recipientAdminId: string, params: NotifyParams): Promise<void> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("admin_notifications").insert({
      admin_user_id: recipientAdminId,
      actor_admin_id: params.actorAdminId ?? null,
      actor_name: params.actorName ?? null,
      type: params.type,
      title: params.title,
      message: params.message,
      severity: params.severity ?? DEFAULT_SEVERITY[params.type],
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      metadata: sanitizeMetadata(params.metadata),
      // An admin notifying themselves about their own action (e.g. a
      // confirmation-style notice) starts pre-read — they were there.
      is_read: params.actorAdminId === recipientAdminId,
    });
    if (error) logFailure("notifyAdmin", params.type, error);
  } catch (err) {
    logFailure("notifyAdmin", params.type, err);
  }
}

/**
 * Fans out one notification row to every currently active admin (via the
 * narrow get_active_admin_ids() function — see migration 0003). The
 * actor's own copy is created already-read, so performing an action never
 * inflates your own unread count; every other admin's copy starts unread.
 * Never throws.
 */
export async function notifyAllAdmins(params: NotifyParams): Promise<void> {
  try {
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("get_active_admin_ids");

    if (rpcError) {
      logFailure("notifyAllAdmins (lookup)", params.type, rpcError);
      return;
    }

    // Defensive normalization — a `returns setof uuid` function should come
    // back as a plain array of strings via PostgREST, but this tolerates a
    // row-object shape too rather than crashing if that assumption is off.
    const recipientIds: string[] = (data ?? [])
      .map((row: unknown) => {
        if (typeof row === "string") return row;
        if (row && typeof row === "object" && "get_active_admin_ids" in row) {
          return String((row as Record<string, unknown>).get_active_admin_ids);
        }
        return null;
      })
      .filter((id: string | null): id is string => Boolean(id));

    if (recipientIds.length === 0) return;

    const severity = params.severity ?? DEFAULT_SEVERITY[params.type];
    const metadata = sanitizeMetadata(params.metadata);

    const rows = recipientIds.map((recipientId) => ({
      admin_user_id: recipientId,
      actor_admin_id: params.actorAdminId ?? null,
      actor_name: params.actorName ?? null,
      type: params.type,
      title: params.title,
      message: params.message,
      severity,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      metadata,
      is_read: params.actorAdminId === recipientId,
    }));

    const { error } = await supabase.from("admin_notifications").insert(rows);
    if (error) logFailure("notifyAllAdmins (insert)", params.type, error);
  } catch (err) {
    logFailure("notifyAllAdmins", params.type, err);
  }
}

// ----------------------------------------------------------------------------
// Reads
// ----------------------------------------------------------------------------

/** Bounded — for the future bell badge, not a full count of all history. */
export async function getUnreadCount(adminId: string): Promise<number> {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("admin_notifications")
      .select("id", { count: "exact", head: true })
      .eq("admin_user_id", adminId)
      .eq("is_read", false);

    if (error) {
      logFailure("getUnreadCount", "n/a", error);
      return 0;
    }
    return count ?? 0;
  } catch (err) {
    logFailure("getUnreadCount", "n/a", err);
    return 0;
  }
}

/** For the future bell popover — a small, bounded recent list, not full history. */
export async function getRecentNotifications(adminId: string, limit = 10): Promise<NotificationRecord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("*")
      .eq("admin_user_id", adminId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logFailure("getRecentNotifications", "n/a", error);
      return [];
    }
    return (data ?? []).map(toRecord);
  } catch (err) {
    logFailure("getRecentNotifications", "n/a", err);
    return [];
  }
}

/** For the future /ecoadmin/activity page — filtered + paginated. */
export async function getActivity(
  adminId: string,
  options: { page?: number; pageSize?: number; filters?: ActivityFilters } = {}
): Promise<ActivityPage> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 25));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient();
    let query = supabase
      .from("admin_notifications")
      .select("*", { count: "exact" })
      .eq("admin_user_id", adminId)
      .order("created_at", { ascending: false })
      .range(from, to);

    const filters = options.filters;
    if (filters?.unreadOnly) query = query.eq("is_read", false);
    if (filters?.severity) query = query.eq("severity", filters.severity);
    if (filters?.actorAdminId) query = query.eq("actor_admin_id", filters.actorAdminId);
    if (filters?.type) {
      query = Array.isArray(filters.type) ? query.in("type", filters.type) : query.eq("type", filters.type);
    }

    const { data, count, error } = await query;

    if (error) {
      logFailure("getActivity", "n/a", error);
      return { items: [], total: 0, page, pageSize };
    }

    return { items: (data ?? []).map(toRecord), total: count ?? 0, page, pageSize };
  } catch (err) {
    logFailure("getActivity", "n/a", err);
    return { items: [], total: 0, page, pageSize };
  }
}

// ----------------------------------------------------------------------------
// Read-state mutations
// ----------------------------------------------------------------------------

/**
 * Marks one notification read. Scoped to the given adminId even though RLS
 * already enforces "only your own rows" — belt and suspenders, and it means
 * this function is safe to call with a recipient id that was merely
 * asserted by the caller, not just trusted blindly.
 */
export async function markNotificationRead(notificationId: string, adminId: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("admin_user_id", adminId);

    if (error) {
      logFailure("markNotificationRead", "n/a", error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    logFailure("markNotificationRead", "n/a", err);
    return { error: "Failed to mark notification read." };
  }
}

export async function markAllNotificationsRead(adminId: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("admin_user_id", adminId)
      .eq("is_read", false);

    if (error) {
      logFailure("markAllNotificationsRead", "n/a", error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    logFailure("markAllNotificationsRead", "n/a", err);
    return { error: "Failed to mark notifications read." };
  }
}
