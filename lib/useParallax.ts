"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to an element. While that element is near the
 * viewport, its `translateY` is nudged in proportion to scroll position,
 * producing a subtle depth/parallax effect. Disabled entirely when the
 * user has requested reduced motion.
 *
 * `speed` — negative moves slower than scroll (background layers),
 * positive moves faster (foreground layers). Small values (0.05–0.2) read
 * as "depth"; larger values read as gimmicky, so keep this subtle.
 */
export function useParallax<T extends HTMLElement>(speed = 0.12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      const offset = distanceFromCenter * speed * -1;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return ref;
}
