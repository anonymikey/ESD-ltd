"use client";

export default function BackToTop() {
  function scrollToTop() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="back-to-top mx-auto mt-6 inline-flex items-center gap-2 rounded-sm border border-offwhite/25 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.12em] text-offwhite/70 transition-colors duration-300 hover:border-leaf hover:text-leaf"
      aria-label="Back to top of page"
    >
      <span aria-hidden="true" className="text-base leading-none">↑</span>
      <span>Back to top</span>
    </button>
  );
}
