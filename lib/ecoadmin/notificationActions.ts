"use server";

import { checkAdmin } from "./auth";
import {
  getRecentNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRecord,
} from "./notifications";

// A small number of recent notifications for the bell popover — never the
// full activity history. The activity page (a later phase) will use
// getActivity() directly with real pagination instead.
const BELL_RECENT_LIMIT = 12;

export interface NotificationSummary {
  unreadCount: number;
  recent: NotificationRecord[];
}

export type NotificationSummaryResult = NotificationSummary | { error: string };

/**
 * Everything the bell needs in one round trip. Independently re-verifies
 * the caller is an authorized admin (via checkAdmin()) rather than trusting
 * that the client only renders this for already-authorized users — the
 * same defense-in-depth pattern every other server action in this codebase
 * already follows.
 */
export async function getNotificationSummaryAction(): Promise<NotificationSummaryResult> {
  const result = await checkAdmin();
  if (!result.ok) return { error: "Not authorized." };

  const [unreadCount, recent] = await Promise.all([
    getUnreadCount(result.context.adminId),
    getRecentNotifications(result.context.adminId, BELL_RECENT_LIMIT),
  ]);

  return { unreadCount, recent };
}

export async function markNotificationReadAction(notificationId: string): Promise<{ error: string | null }> {
  const result = await checkAdmin();
  if (!result.ok) return { error: "Not authorized." };
  return markNotificationRead(notificationId, result.context.adminId);
}

export async function markAllNotificationsReadAction(): Promise<{ error: string | null }> {
  const result = await checkAdmin();
  if (!result.ok) return { error: "Not authorized." };
  return markAllNotificationsRead(result.context.adminId);
}
