import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  return (
    <div
      className={`${align === "center" ? "mx-auto text-center" : "text-left"} max-w-2xl ${className}`}
    >
      <span
        className={`mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] ${
          isLight ? "text-offwhite/60" : "text-steel"
        } ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="h-px w-8 bg-bronze" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2
        className={`text-balance font-display text-display-lg font-semibold ${
          isLight ? "text-offwhite" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-balance font-body text-base leading-relaxed md:text-lg ${
            isLight ? "text-offwhite/70" : "text-charcoal/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
