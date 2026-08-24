const STYLES: Record<string, string> = {
  sent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  queued: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-[#FBEAE7] text-[#B3402F] border-[#F3C9C0]",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  unverified: "bg-charcoal/5 text-charcoal/50 border-charcoal/10",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-charcoal/5 text-charcoal/50 border-charcoal/10",
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] ${
        STYLES[key] ?? "bg-charcoal/5 text-charcoal/50 border-charcoal/10"
      }`}
    >
      {status}
    </span>
  );
}
