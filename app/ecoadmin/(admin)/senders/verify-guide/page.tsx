import Link from "next/link";
import GuideIllustration from "@/components/ecoadmin/GuideIllustration";

export const dynamic = "force-dynamic";
export const metadata = { title: "How to verify in Cloudflare" };

const STEPS: {
  title: string;
  description: string;
  panelLabel?: string;
  highlightLabel: string;
  highlightPosition: "sidebar" | "topbar" | "center" | "button";
}[] = [
  {
    title: "Open the Cloudflare dashboard",
    description: "Sign in at dash.cloudflare.com with the account that manages ecostructdynamicsltd.com.",
    highlightLabel: "dash.cloudflare.com",
    highlightPosition: "topbar",
  },
  {
    title: "Select ecostructdynamicsltd.com",
    description: "From the account home, click into the ecostructdynamicsltd.com site.",
    highlightLabel: "ecostructdynamicsltd.com",
    highlightPosition: "center",
  },
  {
    title: "Open DNS → Records",
    description: "In the left-hand menu for the site, open the DNS section, then Records.",
    panelLabel: "DNS",
    highlightLabel: "DNS → Records",
    highlightPosition: "sidebar",
  },
  {
    title: "Click \"Add record\"",
    description: "On the Records screen, click the Add record button.",
    highlightLabel: "+ Add record",
    highlightPosition: "button",
  },
  {
    title: "Select the required record type",
    description: "Choose the record type the email provider specifies — commonly TXT, CNAME, or MX. Use exactly what they list, not a guess.",
    highlightLabel: "Type: (as specified by provider)",
    highlightPosition: "center",
  },
  {
    title: "Enter the provider-supplied Name / Content / Target",
    description: "Copy the Name (or Host) and Content (or Target/Value) fields character-for-character from the email provider's verification page.",
    highlightLabel: "Name / Content — copy exactly",
    highlightPosition: "center",
  },
  {
    title: "Save the record",
    description: "Save the record in Cloudflare. DNS changes can take a few minutes to propagate.",
    highlightLabel: "Save",
    highlightPosition: "button",
  },
  {
    title: "Return to the email provider to verify",
    description: "Back in the email provider's dashboard, run their domain verification check.",
    highlightLabel: "Verify domain",
    highlightPosition: "center",
  },
];

export default function CloudflareVerifyGuidePage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/ecoadmin/senders"
        className="mb-6 inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/50 hover:text-charcoal"
      >
        ← Back to Senders
      </Link>

      <h1 className="font-display text-2xl font-semibold text-charcoal">
        How to verify a sender in Cloudflare
      </h1>
      <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/60">
        These are simplified, generic illustrations of the Cloudflare dashboard layout — not
        literal screenshots. Cloudflare&rsquo;s actual interface may look slightly different;
        follow the on-screen labels in your own dashboard.
      </p>

      <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3">
        <p className="font-body text-sm font-semibold text-charcoal">
          Never guess DNS values. Use only the exact records supplied by the email provider.
        </p>
        <p className="mt-1 font-body text-xs text-charcoal/60">
          EcoAdmin does not know or store any DNS record values — the provider (Resend) generates
          them specifically for this domain, and they must be copied exactly as shown.
        </p>
      </div>

      <ol className="mt-8 space-y-10">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="flex shrink-0 items-start gap-3 sm:w-48">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-bronze font-mono text-xs text-bronze">
                {index + 1}
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-charcoal">{step.title}</p>
                <p className="mt-1 font-body text-xs leading-relaxed text-charcoal/55">{step.description}</p>
              </div>
            </div>
            <div className="max-w-xs sm:flex-1">
              <GuideIllustration
                panelLabel={step.panelLabel}
                highlightLabel={step.highlightLabel}
                highlightPosition={step.highlightPosition}
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-sm border border-charcoal/10 bg-white p-6">
        <p className="font-body text-sm text-charcoal/70">
          After the provider confirms verification, return to{" "}
          <Link href="/ecoadmin/senders" className="text-bronze underline underline-offset-2">
            Senders
          </Link>{" "}
          and use <strong className="font-semibold">Activate</strong> on the pending sender.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 font-body text-sm text-charcoal/60">
        <span>Need help?</span>
        <a href="mailto:anonymiketech@gmail.com" className="font-semibold text-bronze underline underline-offset-2">
          Contact the developer
        </a>
      </div>
    </div>
  );
}
