/**
 * The full set of meaningful admin actions that generate a notification.
 * Deliberately NOT constrained at the database level (see migration 0003) —
 * adding a new type here is a code change, not a migration.
 *
 * Kept to genuinely meaningful administrative actions, per the brief: no
 * entry here for trivial UI interactions (opening a panel, typing in a
 * field, navigating between pages).
 */
export const ACTIVITY_TYPES = [
  "AUTH_LOGIN",
  "AUTH_LOGOUT",

  "EMAIL_SENT",
  "EMAIL_FAILED",

  "SENDER_PROPOSED",
  "SENDER_ACTIVATED",
  "SENDER_DEACTIVATED",

  "TEMPLATE_CREATED",
  "TEMPLATE_UPDATED",
  "TEMPLATE_DELETED",

  "EMAIL_LOG_DELETED",
  "EMAIL_LOGS_BULK_DELETED",
  "EMAIL_LOGS_CLEANED",

  "SETTINGS_UPDATED",

  "SYSTEM_UPDATE",
  "SYSTEM_NOTICE",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type NotificationSeverity = "success" | "info" | "warning" | "error" | "system";

/**
 * Sensible default severity per type, so most call sites don't need to
 * think about it. Callers can still override per-call (e.g. EMAIL_SENT is
 * usually "success", but a caller could reasonably pass "info" for a
 * lower-key variant).
 */
export const DEFAULT_SEVERITY: Record<ActivityType, NotificationSeverity> = {
  AUTH_LOGIN: "info",
  AUTH_LOGOUT: "info",

  EMAIL_SENT: "success",
  EMAIL_FAILED: "error",

  SENDER_PROPOSED: "info",
  SENDER_ACTIVATED: "success",
  SENDER_DEACTIVATED: "warning",

  TEMPLATE_CREATED: "success",
  TEMPLATE_UPDATED: "info",
  TEMPLATE_DELETED: "warning",

  EMAIL_LOG_DELETED: "info",
  EMAIL_LOGS_BULK_DELETED: "info",
  EMAIL_LOGS_CLEANED: "info",

  SETTINGS_UPDATED: "info",

  SYSTEM_UPDATE: "system",
  SYSTEM_NOTICE: "system",
};

/**
 * The entity_type conventions used in metadata/entity_type for each
 * activity type — documented here so future call sites stay consistent
 * rather than each inventing their own string.
 */
export const ENTITY_TYPES = [
  "auth",
  "sender",
  "template",
  "email_log",
  "settings",
  "system",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];
