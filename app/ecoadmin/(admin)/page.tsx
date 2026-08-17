import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getActiveSenders } from "@/lib/ecoadmin/senders";

export const dynamic = "force-dynamic";

export default async function EcoAdminDashboard() {
  const supabase = createClient();
  const senders = await getActiveSenders();

  const { count: sentCount } = await supabase
    .from("email_logs")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent");

  const { count: failedCount } = await supabase
    .from("email_logs")
    .select("id", { count: "exact", head: true })
    .eq("status", "failed");

  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">
        Overview of the EcoStruct Dynamics admin email system.
      </p>

      {!resendConfigured && (
        <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3">
          <p className="font-body text-sm text-charcoal/80">
            <strong className="font-semibold">Outbound email is not active yet.</strong>{" "}
            Set <code className="font-mono text-xs">RESEND_API_KEY</code> and complete domain
            verification to enable sending. See{" "}
            <Link href="/ecoadmin/settings" className="text-bronze underline underline-offset-2">
              Settings
            </Link>{" "}
            for details.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-charcoal/10 bg-white p-6">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-charcoal/45">Sent</span>
          <p className="mt-2 font-display text-3xl font-semibold text-charcoal">{sentCount ?? 0}</p>
        </div>
        <div className="rounded-sm border border-charcoal/10 bg-white p-6">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-charcoal/45">Failed</span>
          <p className="mt-2 font-display text-3xl font-semibold text-charcoal">{failedCount ?? 0}</p>
        </div>
        <div className="rounded-sm border border-charcoal/10 bg-white p-6">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-charcoal/45">Active Senders</span>
          <p className="mt-2 font-display text-3xl font-semibold text-charcoal">{senders.length}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/ecoadmin/compose"
          className="inline-flex items-center justify-center rounded-sm bg-charcoal px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite transition-colors duration-200 hover:bg-charcoal/85"
        >
          Compose Email
        </Link>
        <Link
          href="/ecoadmin/sent"
          className="inline-flex items-center justify-center rounded-sm border border-charcoal/20 px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors duration-200 hover:border-charcoal"
        >
          View Sent
        </Link>
      </div>
    </div>
  );
}
