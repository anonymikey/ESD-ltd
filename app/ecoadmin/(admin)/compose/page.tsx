import ComposeForm from "@/components/ecoadmin/ComposeForm";
import { getActiveSenders } from "@/lib/ecoadmin/senders";

export const dynamic = "force-dynamic";

export default async function ComposePage() {
  const senders = await getActiveSenders();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Compose</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">
        Send an email from an authorized EcoStruct Dynamics address.
      </p>

      <div className="mt-8 max-w-2xl">
        <ComposeForm senders={senders} />
      </div>
    </div>
  );
}
