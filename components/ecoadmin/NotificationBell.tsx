"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  getNotificationSummaryAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
  type NotificationSummary,
} from "@/lib/ecoadmin/notificationActions";
import type { NotificationRecord } from "@/lib/ecoadmin/notifications";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 3.5c-2.3 0-4 1.9-4 4.3v2.1c0 .5-.2 1-.5 1.4l-.9 1.1c-.5.6-.1 1.6.7 1.6h9.4c.8 0 1.2-1 .7-1.6l-.9-1.1c-.3-.4-.5-.9-.5-1.4V7.8c0-2.4-1.7-4.3-4-4.3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.3 16c.3.6.9 1 1.7 1s1.4-.4 1.7-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SeverityIcon({ severity }: { severity: NotificationRecord["severity"] }) {
  const common = { width: 14, height: 14, viewBox: "0 0 14 14", "aria-hidden": true } as const;

  if (severity === "success") {
    return (
      <svg {...common}>
        <circle cx="7" cy="7" r="6" fill="#ECFDF5" stroke="#059669" strokeWidth="1" />
        <path d="M4.3 7.2 6.1 9l3.6-4" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (severity === "warning") {
    return (
      <svg {...common}>
        <path d="M7 1.6 12.8 11.6H1.2L7 1.6Z" fill="#FBF3E8" stroke="#4A8C2A" strokeWidth="1" strokeLinejoin="round" />
        <path d="M7 5.6v2.6" stroke="#4A8C2A" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7" cy="10" r="0.75" fill="#4A8C2A" />
      </svg>
    );
  }
  if (severity === "error") {
    return (
      <svg {...common}>
        <circle cx="7" cy="7" r="6" fill="#FBEAE7" stroke="#C2483B" strokeWidth="1" />
        <path d="M5 5l4 4M9 5l-4 4" stroke="#C2483B" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (severity === "system") {
    return (
      <svg {...common}>
        <path d="M7.5 1.2 3 7.8h3.2L6 12.8l4.9-6.9H7.6L7.5 1.2Z" fill="#F5EFE3" stroke="#4A8C2A" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    );
  }
  // info
  return (
    <svg {...common}>
      <circle cx="7" cy="7" r="6" fill="#F1F2F3" stroke="#767D85" strokeWidth="1" />
      <path d="M7 6.3v3.4" stroke="#767D85" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="4.3" r="0.7" fill="#767D85" />
    </svg>
  );
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 45) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-charcoal/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 animate-pulse rounded bg-charcoal/10" />
        <div className="h-2.5 w-4/5 animate-pulse rounded bg-charcoal/5" />
      </div>
    </div>
  );
}

export default function NotificationBell({ align = "right" }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NotificationSummary>({ unreadCount: 0, recent: [] });
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function loadSummary() {
    setLoading(true);
    setError(null);
    const result = await getNotificationSummaryAction();
    if ("error" in result) {
      setError("Notifications are temporarily unavailable.");
    } else {
      setSummary(result);
      setLoaded(true);
    }
    setLoading(false);
  }

  // Fetch once on mount so the unread badge is correct without requiring
  // the popover to be opened first.
  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh when opened — a simple "refetch on open" approach rather than
  // polling, per scope for this phase.
  function handleToggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next) loadSummary();
      return next;
    });
  }

  // Click-outside + Escape to close.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleMarkOne(notification: NotificationRecord) {
    if (notification.isRead) return;

    // Optimistic — the row updates immediately; a failure just leaves it
    // read locally without crashing anything, since read-state is low
    // stakes and the next full reload will reconcile it either way.
    setSummary((prev) => ({
      unreadCount: Math.max(0, prev.unreadCount - 1),
      recent: prev.recent.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    }));
    startTransition(async () => {
      await markNotificationReadAction(notification.id);
    });
  }

  function handleMarkAll() {
    if (summary.unreadCount === 0) return;
    setSummary((prev) => ({
      unreadCount: 0,
      recent: prev.recent.map((n) => ({ ...n, isRead: true })),
    }));
    startTransition(async () => {
      await markAllNotificationsReadAction();
    });
  }

  const badgeCount = summary.unreadCount > 99 ? "99+" : String(summary.unreadCount);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="ecoadmin-notification-panel"
        aria-label={summary.unreadCount > 0 ? `Notifications, ${summary.unreadCount} unread` : "Notifications"}
        className="relative flex h-9 w-9 items-center justify-center rounded-sm text-offwhite/75 transition-colors duration-150 hover:bg-offwhite/10 hover:text-offwhite"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {summary.unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-leaf px-1 font-mono text-[9px] font-semibold leading-none text-charcoal"
          >
            {badgeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id="ecoadmin-notification-panel"
          role="dialog"
          aria-label="Notifications"
          className={`absolute top-[calc(100%+10px)] z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-sm border border-charcoal/10 bg-white shadow-[0_20px_44px_-16px_rgba(20,23,26,0.28)] ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-charcoal/10 px-4 py-3">
            <span className="font-display text-sm font-semibold text-charcoal">Notifications</span>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={summary.unreadCount === 0 || isPending}
              className="font-body text-xs font-semibold uppercase tracking-[0.06em] text-leaf transition-colors duration-150 hover:text-leaf-deep disabled:cursor-not-allowed disabled:text-charcoal/25"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading && !loaded && (
              <div className="divide-y divide-charcoal/5">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            )}

            {error && (
              <p className="px-4 py-8 text-center font-body text-sm text-charcoal/50">{error}</p>
            )}

            {!error && loaded && summary.recent.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <BellIcon className="h-6 w-6 text-charcoal/20" />
                <p className="font-body text-sm font-medium text-charcoal/60">You&rsquo;re all caught up.</p>
                <p className="font-body text-xs text-charcoal/40">No new notifications.</p>
              </div>
            )}

            {!error &&
              summary.recent.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleMarkOne(notification)}
                  className={`flex w-full items-start gap-3 border-b border-charcoal/5 px-4 py-3 text-left transition-colors duration-150 last:border-0 hover:bg-offwhite-dim/60 ${
                    notification.isRead ? "" : "bg-leaf/[0.05]"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    <SeverityIcon severity={notification.severity} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`truncate font-body text-sm ${
                          notification.isRead ? "font-medium text-charcoal/75" : "font-semibold text-charcoal"
                        }`}
                      >
                        {notification.title}
                      </span>
                      {!notification.isRead && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                      )}
                    </span>
                    <span className="mt-0.5 block truncate font-body text-xs text-charcoal/55">
                      {notification.message}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-charcoal/35">
                      {notification.actorName && <span>{notification.actorName}</span>}
                      {notification.actorName && <span aria-hidden="true">·</span>}
                      <span>{formatRelativeTime(notification.createdAt)}</span>
                    </span>
                  </span>
                </button>
              ))}
          </div>

          <div className="border-t border-charcoal/10 px-4 py-2.5">
            <Link
              href="/ecoadmin/activity"
              onClick={() => setOpen(false)}
              className="block font-body text-xs font-semibold uppercase tracking-[0.06em] text-charcoal/60 transition-colors duration-150 hover:text-leaf"
            >
              View all activity →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
