interface TagPillProps {
  children: React.ReactNode;
  tone?: "dark" | "light";
}

export default function TagPill({ children, tone = "light" }: TagPillProps) {
  const isLight = tone === "light";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] ${
        isLight
          ? "border-offwhite/20 text-offwhite/75"
          : "border-charcoal/15 text-charcoal/70"
      }`}
    >
      {children}
    </span>
  );
}
