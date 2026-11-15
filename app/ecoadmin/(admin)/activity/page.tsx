import Link from "next/link";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { getActivity } from "@/lib/ecoadmin/notifications";
import { markAllNotificationsReadFormAction } from "@/lib/ecoadmin/notificationActions";

export const dynamic = "force-dynamic";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: { page?: string; unread?: string };
}) {
  const admin = await checkAdmin();
  if (!admin.ok) redirect("/ecoadmin/login");

  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const unreadOnly = searchParams.unread === "1";
  const activity = await getActivity(admin.context.adminId, {
    page,
    pageSize: 25,
    filters: { unreadOnly },
  });
  const pageCount = Math.max(1, Math.ceil(activity.total / activity.pageSize));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Activity</h1>
          <p className="mt-1 font-body text-sm text-charcoal/55">
            Recent EcoAdmin actions and email events for your account.
          </p>
        </div>
        <form action={markAllNotificationsReadFormAction}>
          <button
            type="submit"
            className="rounded-sm border border-charcoal/20 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal hover:border-charcoal"
          >
            Mark all as read
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/ecoadmin/activity"
          className={`rounded-full border px-4 py-2 font-body text-xs font-semibold ${!unreadOnly ? "border-leaf bg-leaf/10 text-leaf" : "border-charcoal/15 text-charcoal/60"}`}
        >
          All activity
        </Link>
        <Link
          href="/ecoadmin/activity?unread=1"
          className={`rounded-full border px-4 py-2 font-body text-xs font-semibold ${unreadOnly ? "border-leaf bg-leaf/10 text-leaf" : "border-charcoal/15 text-charcoal/60"}`}
        >
          Unread only
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        {activity.items.length === 0 ? (
          <p className="p-10 text-center font-body text-sm text-charcoal/50">No activity to show.</p>
        ) : (
          activity.items.map((item) => (
            <div key={item.id} className={`border-b border-charcoal/5 px-5 py-4 last:border-0 ${item.isRead ? "" : "bg-leaf/[0.04]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-body text-sm font-semibold text-charcoal">{item.title}</p>
                  <p className="mt-1 font-body text-sm text-charcoal/65">{item.message}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-charcoal/40">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-between font-body text-xs text-charcoal/55">
          {page > 1 ? <Link href={`/ecoadmin/activity?page=${page - 1}${unreadOnly ? "&unread=1" : ""}`} className="text-leaf hover:underline">Previous</Link> : <span />}
          <span>Page {page} of {pageCount}</span>
          {page < pageCount ? <Link href={`/ecoadmin/activity?page=${page + 1}${unreadOnly ? "&unread=1" : ""}`} className="text-leaf hover:underline">Next</Link> : <span />}
        </div>
      )}
    </div>
  );
}
