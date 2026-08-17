"use client";

import { useState, useTransition } from "react";
import { activateSender, deactivateSender } from "@/app/ecoadmin/(admin)/senders/actions";

export default function SenderActions({
  id,
  isActive,
  verificationStatus,
}: {
  id: string;
  isActive: boolean;
  verificationStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleActivate() {
    const confirmed = window.confirm(
      "Only activate this sender after you have verified it directly with the email provider (Resend) using the DNS records they supplied. Activating it here does not perform that verification — it only makes the sender selectable in Compose. Continue?"
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await activateSender(id);
      setError(result.error);
    });
  }

  function handleDeactivate() {
    const confirmed = window.confirm("Remove this sender from Compose? It will stay in the list and can be reactivated later.");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deactivateSender(id);
      setError(result.error);
    });
  }

  return (
    <div className="flex items-center gap-3">
      {!isActive && verificationStatus !== "verified" && (
        <button
          type="button"
          onClick={handleActivate}
          disabled={isPending}
          className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-bronze hover:underline disabled:cursor-not-allowed disabled:opacity-40"
        >
          Activate
        </button>
      )}
      {!isActive && verificationStatus === "verified" && (
        <button
          type="button"
          onClick={handleActivate}
          disabled={isPending}
          className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-bronze hover:underline disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reactivate
        </button>
      )}
      {isActive && (
        <button
          type="button"
          onClick={handleDeactivate}
          disabled={isPending}
          className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/40 hover:text-[#C2483B] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Deactivate
        </button>
      )}
      {error && <span className="font-body text-xs text-[#C2483B]">{error}</span>}
    </div>
  );
}
