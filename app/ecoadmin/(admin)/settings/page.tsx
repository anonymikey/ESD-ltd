import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { RETENTION_PRESETS, countEligibleForDeletion, getLastCleanupRun, getRetentionSettings } from "@/lib/ecoadmin/retention";
import { updateRetentionDays } from "./actions";

export const dynamic = "force-dynamic";

function ConfigRow({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4 last:border-0">
      <div>
        <p className="font-body text-sm font-medium text-charcoal">{label}</p>
        <p className="mt-0.5 font-body text-xs text-charcoal/50">{detail}</p>
      </div>
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] ${
          ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-bronze/30 bg-bronze/10 text-bronze"
        }`}
      >
        {ok ? "Configured" : "Not set"}
      </span>
    </div>
  );
}

function runTypeLabel(runType: string) {
  if (runType === "individual") return "Single record deleted";
  if (runType === "bulk_selection") return "Selected records deleted";
  if (runType === "older_than") return "Older-than cleanup";
  return runType;
}

export default async function SettingsPage() {
  const admin = await checkAdmin();
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const { retentionDays, updatedAt } = await getRetentionSettings();
  const eligibleCount = await countEligibleForDeletion(retentionDays);
  const lastCleanup = await getLastCleanupRun();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Settings</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">
        Configuration status for this deployment. No secret values are ever shown here.
      </p>

      <div className="mt-8 overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <ConfigRow
          label="Supabase authentication"
          ok={isSupabaseConfigured}
          detail="NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
        />
        <ConfigRow
          label="Resend (outbound email)"
          ok={resendConfigured}
          detail="RESEND_API_KEY — server-only, never exposed to the browser"
        />
      </div>

      {admin.ok && (
        <div className="mt-8 max-w-md rounded-sm border border-charcoal/10 bg-white p-6">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-charcoal/45">Signed in as</span>
          <p className="mt-1 font-body text-sm text-charcoal">{admin.context.user.email}</p>
        </div>
      )}

      {/* Retention & Cleanup */}
      <div className="mt-10 max-w-lg">
        <h2 className="font-display text-lg font-semibold text-charcoal">Retention &amp; Cleanup</h2>
        <p className="mt-1 font-body text-sm text-charcoal/55">
          Controls how long Sent audit records (not the emails themselves) are kept. Deleting a
          record here never affects an email already sent — see{" "}
          <Link href="/ecoadmin/sent" className="text-bronze underline underline-offset-2">
            Sent
          </Link>{" "}
          to actually run a cleanup.
        </p>

        <div className="mt-5 overflow-hidden rounded-sm border border-charcoal/10 bg-white">
          <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4">
            <span className="font-body text-sm text-charcoal/70">Current retention period</span>
            <span className="font-display text-sm font-semibold text-charcoal">{retentionDays} days</span>
          </div>
          <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4">
            <span className="font-body text-sm text-charcoal/70">Records eligible for deletion</span>
            <span className="font-display text-sm font-semibold text-charcoal">{eligibleCount}</span>
          </div>
          <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4">
            <span className="font-body text-sm text-charcoal/70">Last cleanup</span>
            <span className="font-body text-xs text-charcoal/60">
              {lastCleanup
                ? `${runTypeLabel(lastCleanup.runType)} · ${lastCleanup.recordsDeleted} record${lastCleanup.recordsDeleted === 1 ? "" : "s"} · ${new Date(lastCleanup.createdAt).toLocaleString()}`
                : "None yet"}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-body text-sm text-charcoal/70">Next scheduled cleanup</span>
            <span className="font-body text-xs text-charcoal/45">
              Not configured — no automatic cleanup runs. Cleanup is manual, from Sent.
            </span>
          </div>
        </div>

        <form action={updateRetentionDays} className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="retentionDays" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-charcoal/50">
              Set retention period
            </label>
            <select
              id="retentionDays"
              name="retentionDays"
              defaultValue={RETENTION_PRESETS.includes(retentionDays as (typeof RETENTION_PRESETS)[number]) ? retentionDays : "custom"}
              className="rounded-sm border border-charcoal/15 bg-white px-4 py-2.5 font-body text-sm text-charcoal focus:border-bronze"
            >
              {RETENTION_PRESETS.map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
              <option value={retentionDays}>Custom ({retentionDays} days)</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-sm bg-charcoal px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.08em] text-offwhite hover:bg-charcoal/85"
          >
            Save
          </button>
        </form>
        {updatedAt && (
          <p className="mt-2 font-body text-xs text-charcoal/40">
            Last changed {new Date(updatedAt).toLocaleString()}
          </p>
        )}
        <p className="mt-3 font-body text-xs leading-relaxed text-charcoal/45">
          Changing this only updates the default suggested when running cleanup on the Sent page —
          it does not delete anything by itself.
        </p>
      </div>

      <p className="mt-10 max-w-lg font-body text-xs leading-relaxed text-charcoal/45">
        Domain DNS (SPF/DKIM records Resend requires for
        ecostructdynamicsltd.com) is handled outside this application — see
        the README for what still needs to be configured manually.
      </p>
    </div>
  );
}
