interface ServiceCardProps {
  letter: string;
  name: string;
  description: string;
}

function CornerMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`pointer-events-none absolute h-5 w-5 opacity-0 transition-opacity duration-500 ease-engineer group-hover:opacity-100 ${className}`}
      aria-hidden="true"
    >
      <path d="M1 15 L1 1 L15 1" fill="none" stroke="#A97A3B" strokeWidth="1.25" />
    </svg>
  );
}

export default function ServiceCard({ letter, name, description }: ServiceCardProps) {
  return (
    <div className="group relative flex h-full flex-col justify-between border border-offwhite/12 p-8 transition-all duration-500 ease-engineer hover:-translate-y-1 hover:border-bronze/50 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] md:p-9">
      {/* Drafting-style corner marks, appear on hover */}
      <CornerMark className="left-3 top-3" />
      <CornerMark className="right-3 top-3 rotate-90" />
      <CornerMark className="bottom-3 right-3 rotate-180" />
      <CornerMark className="bottom-3 left-3 -rotate-90" />

      <div>
        <span className="font-mono text-sm text-bronze">{letter}</span>
        <h3 className="mt-5 font-display text-xl font-semibold text-offwhite md:text-2xl">
          {name}
        </h3>
        <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-offwhite/60">
          {description}
        </p>
      </div>

      <div className="mt-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-offwhite/50 transition-colors duration-300 group-hover:text-bronze">
        Learn more
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="transition-transform duration-300 ease-engineer group-hover:translate-x-1"
          aria-hidden="true"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        </svg>
      </div>

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-bronze transition-transform duration-500 ease-engineer group-hover:scale-x-100"
        aria-hidden="true"
      />
    </div>
  );
}
