"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: boolean;
  delay?: number;
}

export default function RevealOnScroll({
  children,
  className = "",
  as: Tag = "div",
  stagger = false,
  delay = 0,
}: RevealOnScrollProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = window.setTimeout(() => setVisible(true), delay);
          observer.disconnect();
          return () => window.clearTimeout(timer);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={`${stagger ? "reveal-stagger" : "reveal"} ${className}`}
    >
      {children}
    </Tag>
  );
}
