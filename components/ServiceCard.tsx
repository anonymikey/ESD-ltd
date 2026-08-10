interface ServiceCardProps {
  letter: string;
  name: string;
  description: string;
}

export default function ServiceCard({ letter, name, description }: ServiceCardProps) {
  return (
    <div className="group relative flex h-full flex-col justify-between border border-offwhite/12 p-8 transition-colors duration-500 ease-engineer hover:border-bronze/50 md:p-9">
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
