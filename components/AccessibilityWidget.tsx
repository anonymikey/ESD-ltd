"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "ecostruct-accessibility-preferences";
const DISMISSED_KEY = "ecostruct-accessibility-dismissed";

type Preferences = {
  textSize: 0 | 1 | 2 | 3;
  highContrast: boolean;
  darkMode: boolean;
  grayscale: boolean;
  readableFont: boolean;
  spacing: boolean;
  highlightLinks: boolean;
  largeCursor: boolean;
  reduceMotion: boolean;
  simplifyImages: boolean;
};
type ToggleKey = Exclude<keyof Preferences, "textSize">;

const DEFAULTS: Preferences = {
  textSize: 0,
  highContrast: false,
  darkMode: false,
  grayscale: false,
  readableFont: false,
  spacing: false,
  highlightLinks: false,
  largeCursor: false,
  reduceMotion: false,
  simplifyImages: false,
};

function loadPreferences(): Preferences {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return { ...DEFAULTS, ...(value && typeof value === "object" ? value : {}) };
  } catch {
    return DEFAULTS;
  }
}

function applyPreferences(preferences: Preferences) {
  const root = document.documentElement;
  root.dataset.a11yTextSize = String(preferences.textSize);
  root.classList.toggle("a11y-high-contrast", preferences.highContrast);
  root.classList.toggle("a11y-dark-mode", preferences.darkMode);
  root.classList.toggle("a11y-grayscale", preferences.grayscale);
  root.classList.toggle("a11y-readable-font", preferences.readableFont);
  root.classList.toggle("a11y-spacing", preferences.spacing);
  root.classList.toggle("a11y-highlight-links", preferences.highlightLinks);
  root.classList.toggle("a11y-large-cursor", preferences.largeCursor);
  root.classList.toggle("a11y-reduce-motion", preferences.reduceMotion);
  root.classList.toggle("a11y-simplify-images", preferences.simplifyImages);
}

function savePreferences(preferences: Preferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  applyPreferences(preferences);
}

export default function AccessibilityWidget() {
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/ecoadmin")) {
      applyPreferences(DEFAULTS);
      setReady(false);
      return;
    }
    const saved = loadPreferences();
    const isDismissed = window.localStorage.getItem(DISMISSED_KEY) === "true";
    setPreferences(saved);
    setDismissed(isDismissed);
    applyPreferences(saved);
    setReady(true);

    const restore = () => {
      setDismissed(false);
      setOpen(true);
      window.localStorage.removeItem(DISMISSED_KEY);
    };
    window.addEventListener("accessibility:restore", restore);
    return () => window.removeEventListener("accessibility:restore", restore);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    headingRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, input, [href], [tabindex]:not([tabindex=\"-1\"])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!ready || pathname?.startsWith("/ecoadmin")) return null;

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    savePreferences(next);
  }

  function reset() {
    setPreferences(DEFAULTS);
    savePreferences(DEFAULTS);
  }

  function dismiss() {
    setOpen(false);
    setDismissed(true);
    window.localStorage.setItem(DISMISSED_KEY, "true");
    window.dispatchEvent(new Event("accessibility:dismissed"));
  }

  const toggleItems: Array<{ key: ToggleKey; label: string; description: string }> = [
    { key: "highContrast", label: "High contrast", description: "Stronger color contrast for text and controls" },
    { key: "darkMode", label: "Dark reading mode", description: "A darker, softer reading surface" },
    { key: "grayscale", label: "Grayscale", description: "Reduce color intensity across the website" },
    { key: "readableFont", label: "Readable font", description: "Use a clear, highly legible sans-serif" },
    { key: "spacing", label: "Reading spacing", description: "Increase line and letter spacing" },
    { key: "highlightLinks", label: "Highlight links", description: "Make interactive links easier to find" },
    { key: "largeCursor", label: "Large cursor", description: "Increase the pointer size" },
    { key: "reduceMotion", label: "Reduce motion", description: "Pause decorative movement and transitions" },
    { key: "simplifyImages", label: "Simplify images", description: "Reduce distracting decorative imagery" },
  ];

  return (
    <>
      {!dismissed && (
        <button
          type="button"
          className="a11y-launcher"
          aria-label="Open accessibility features"
          aria-expanded={open}
          aria-controls="accessibility-panel"
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true" className="a11y-launcher-icon">◒</span>
          <span>Accessibility</span>
        </button>
      )}

      {open && (
        <div className="a11y-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <aside id="accessibility-panel" ref={panelRef} className="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="accessibility-heading">
            <div className="a11y-panel-header">
              <div>
                <p className="a11y-eyebrow">Inclusive browsing</p>
                <h2 id="accessibility-heading" ref={headingRef} tabIndex={-1}>Accessibility features</h2>
                <p className="a11y-panel-intro">Adjust this website to make reading, navigation, and interaction more comfortable for you.</p>
              </div>
              <button type="button" className="a11y-close" aria-label="Close accessibility features" onClick={() => setOpen(false)}>×</button>
            </div>

            <div className="a11y-panel-body">
              <fieldset className="a11y-group">
                <legend>Text size</legend>
                <div className="a11y-size-options" role="group" aria-label="Text size">
                  {([0, 1, 2, 3] as const).map((size) => <button key={size} type="button" aria-pressed={preferences.textSize === size} className={preferences.textSize === size ? "selected" : ""} onClick={() => update("textSize", size)}>{size === 0 ? "Default" : `${size === 1 ? "Larger" : size === 2 ? "Large" : "Largest"}`}</button>)}
                </div>
              </fieldset>

              <fieldset className="a11y-group">
                <legend>Display and reading</legend>
                <div className="a11y-toggle-list">
                  {toggleItems.map((item) => (
                    <label key={item.key} className="a11y-toggle">
                      <span><strong>{item.label}</strong><small>{item.description}</small></span>
                      <input type="checkbox" checked={Boolean(preferences[item.key])} onChange={(event) => update(item.key, event.target.checked)} />
                      <span className="a11y-switch" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="a11y-panel-footer">
              <button type="button" className="a11y-reset" onClick={reset}>Reset settings</button>
              <button type="button" className="a11y-dismiss" onClick={dismiss}>Move to footer</button>
              <button type="button" className="a11y-done" onClick={() => setOpen(false)}>Done</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
