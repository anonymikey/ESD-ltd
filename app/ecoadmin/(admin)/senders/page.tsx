import Link from "next/link";
import StatusBadge from "@/components/ecoadmin/StatusBadge";
import SenderActions from "@/components/ecoadmin/SenderActions";
import { createClient } from "@/lib/supabase/server";
import { proposeSender } from "./actions";

export const dynamic = "force-dynamic";

const fieldClasses =
  "w-full rounded-sm border border-charcoal/15 bg-white px-4 py-2.5 font-body text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze";

const WORKFLOW_STEPS = [
  { title: "Add the sender", description: "Enter any @ecostructdynamicsltd.com address and submit." },
  { title: "It's live immediately", description: "ecostructdynamicsltd.com is already verified with our email provider, so a new address on the same domain doesn't need separate DNS work — it's created verified and active right away." },
  { title: "Use it in Compose", description: "The new address appears in the From dropdown as soon as it's added — no extra step, no deployment." },
  { title: "Disable it later if needed", description: "Use Deactivate on any sender to remove it from Compose without deleting its history. Reactivate brings it back." },
];

export default async function SendersPage() {
  const supabase = createClient();
  const { data: senders, error } = await supabase
    .from("senders")
    .select("id, email, display_name, is_active, verification_status, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Senders</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">
        Authorized From addresses. Only active senders appear in Compose.
      </p>

      <div className="mt-8 overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        {error && (
          <p className="p-6 font-body text-sm text-[#C2483B]">
            Could not load senders from the database — the built-in fallback list is used in
            Compose instead. If this is a fresh deployment, the `senders` table may not be
            migrated yet — see supabase/migrations.
          </p>
        )}

        {!error &&
          senders?.map((sender) => (
            <div
              key={sender.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/5 px-5 py-4 last:border-0"
            >
              <div>
                <p className="font-display text-sm font-semibold text-charcoal">{sender.display_name}</p>
                <p className="font-body text-xs text-charcoal/50">{sender.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={sender.verification_status} />
                <StatusBadge status={sender.is_active ? "active" : "inactive"} />
                <SenderActions
                  id={sender.id}
                  isActive={sender.is_active}
                  verificationStatus={sender.verification_status}
                />
              </div>
            </div>
          ))}

        {!error && senders?.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-body text-sm text-charcoal/50">No senders yet.</p>
          </div>
        )}
      </div>

      {/* What happens next? */}
      <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-charcoal">What happens next?</h2>
        <ol className="mt-4 space-y-4">
          {WORKFLOW_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-bronze font-mono text-xs text-bronze">
                {index + 1}
              </span>
              <div>
                <p className="font-body text-sm font-semibold text-charcoal">{step.title}</p>
                <p className="font-body text-xs text-charcoal/55">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 font-body text-xs leading-relaxed text-charcoal/50">
          This only applies to addresses on{" "}
          <strong className="font-semibold">ecostructdynamicsltd.com</strong>, which is already
          verified with our email provider. Only a signed-in, authorized admin can add a sender —
          and only for this domain, enforced at the database level regardless of who's asking.
          Adding an address on a <em>different or new</em> domain would need that domain verified
          with the provider first — see the DNS guide below if that ever comes up.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link
            href="/ecoadmin/senders/verify-guide"
            className="inline-flex items-center justify-center rounded-sm border border-charcoal/20 px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.08em] text-charcoal hover:border-charcoal"
          >
            New-domain DNS verification guide
          </Link>
          <a
            href="mailto:anonymiketech@gmail.com"
            className="font-body text-sm text-charcoal/60 underline underline-offset-2 hover:text-bronze"
          >
            Need help? Contact the developer
          </a>
        </div>
      </div>

      <div className="mt-10 max-w-lg">
        <h2 className="font-display text-lg font-semibold text-charcoal">Add a Sender</h2>
        <p className="mt-1 font-body text-sm text-charcoal/55">
          Must be an @ecostructdynamicsltd.com address. It becomes{" "}
          <strong className="font-semibold">active in Compose immediately</strong> — no manual
          activation step, no deployment. Use Deactivate afterward if you ever need to take it out
          of rotation.
        </p>

        <form action={proposeSender} className="mt-5 space-y-4">
          <div>
            <label htmlFor="displayName" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-charcoal/50">
              Display name
            </label>
            <input id="displayName" name="displayName" type="text" required className={fieldClasses} placeholder="e.g. Projects Team" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-charcoal/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              pattern=".+@ecostructdynamicsltd\.com"
              title="Must be an @ecostructdynamicsltd.com address"
              className={fieldClasses}
              placeholder="projects@ecostructdynamicsltd.com"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-sm border border-charcoal/20 px-6 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.08em] text-charcoal hover:border-charcoal"
          >
            Add Sender
          </button>
        </form>
      </div>
    </div>
  );
}
