import SentTable, { type SentLogRow } from "@/components/ecoadmin/SentTable";
import { createClient } from "@/lib/supabase/server";
import { getRetentionSettings } from "@/lib/ecoadmin/retention";
import { getActiveSenders } from "@/lib/ecoadmin/senders";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function SentPage({
  searchParams,
}: {
  searchParams: { q?: string; sender?: string; page?: string };
}) {
  const supabase = createClient();
  const senders = await getActiveSenders();
  const { retentionDays } = await getRetentionSettings();
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("email_logs")
    .select("id, to_addresses, subject, status, resend_message_id, created_at, sender_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (searchParams.sender) {
    query = query.eq("sender_id", searchParams.sender);
  }
  if (searchParams.q) {
    query = query.ilike("subject", `%${searchParams.q}%`);
  }

  const { data: logs, count, error } = await query;

  const rows: SentLogRow[] = (logs ?? []).map((log) => ({
    id: log.id as string,
    to: (log.to_addresses as string[]) ?? [],
    subject: log.subject as string,
    status: log.status as string,
    createdAt: log.created_at as string,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Sent</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">
        Audit log of emails sent through EcoAdmin. Message bodies are not stored.
      </p>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search by subject…"
          className="min-w-[200px] flex-1 rounded-sm border border-charcoal/15 bg-white px-4 py-2.5 font-body text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze"
        />
        <select
          name="sender"
          defaultValue={searchParams.sender ?? ""}
          className="rounded-sm border border-charcoal/15 bg-white px-4 py-2.5 font-body text-sm text-charcoal focus:border-bronze"
        >
          <option value="">All senders</option>
          {senders.map((s) => (
            <option key={s.id} value={s.id}>
              {s.displayName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-sm border border-charcoal/20 px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.08em] text-charcoal hover:border-charcoal"
        >
          Filter
        </button>
      </form>

      <div className="mt-6">
        {error ? (
          <p className="rounded-sm border border-charcoal/10 bg-white p-6 font-body text-sm text-[#C2483B]">
            Could not load sent emails. If this is a fresh deployment, the `email_logs` table may
            not be migrated yet — see supabase/migrations.
          </p>
        ) : (
          <SentTable logs={rows} defaultRetentionDays={retentionDays} />
        )}
      </div>

      {!error && count !== null && count! > PAGE_SIZE && (
        <p className="mt-4 font-body text-xs text-charcoal/40">
          Showing {from + 1}–{Math.min(to + 1, count ?? 0)} of {count}
        </p>
      )}
    </div>
  );
}
