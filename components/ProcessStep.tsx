interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export default function ProcessStep({ number, title, description, isLast }: ProcessStepProps) {
  return (
    <div className="relative flex gap-6 md:flex-1 md:flex-col md:items-center md:gap-0 md:text-center">
      <div className="relative flex shrink-0 flex-col items-center md:w-full">
        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-bronze bg-offwhite font-mono text-sm text-bronze md:h-14 md:w-14">
          {number}
        </div>
        {!isLast && (
          <span
            className="process-line mt-0 h-full w-px flex-1 bg-charcoal/15 md:absolute md:left-1/2 md:top-7 md:h-px md:w-full md:origin-left md:translate-x-[10%]"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="pb-10 md:pb-0 md:pt-6">
        <h3 className="font-display text-xl font-semibold text-charcoal">{title}</h3>
        <p className="mt-2 max-w-[220px] font-body text-sm leading-relaxed text-charcoal/60 md:mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}
