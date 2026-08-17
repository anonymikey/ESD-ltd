import Image from "next/image";

export interface Project {
  title: string;
  category: string;
  location?: string;
  year?: string;
  image: string;
  imageAlt: string;
}

// Renders a real project once the portfolio is available. Not used yet —
// Projects.tsx currently shows a "coming soon" state — but kept here so a
// real project list can be dropped in later without new component work.
export default function ProjectCard({ title, category, location, year, image, imageAlt }: Project) {
  return (
    <article className="group relative overflow-hidden rounded-sm bg-charcoal">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, 90vw"
          className="object-cover transition-transform duration-700 ease-engineer group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">
          {category}
        </span>
        <h3 className="mt-2 font-display text-xl font-semibold text-offwhite">{title}</h3>
        {(location || year) && (
          <p className="mt-1 font-body text-sm text-offwhite/60">
            {[location, year].filter(Boolean).join(" — ")}
          </p>
        )}
      </div>
    </article>
  );
}
