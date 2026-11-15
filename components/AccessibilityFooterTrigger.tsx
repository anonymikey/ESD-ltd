"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "ecostruct-accessibility-dismissed";

export default function AccessibilityFooterTrigger() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(DISMISSED_KEY) === "true");
    const onDismissed = () => setVisible(true);
    const onRestored = () => setVisible(false);
    window.addEventListener("accessibility:dismissed", onDismissed);
    window.addEventListener("accessibility:restore", onRestored);
    return () => {
      window.removeEventListener("accessibility:dismissed", onDismissed);
      window.removeEventListener("accessibility:restore", onRestored);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="a11y-footer-trigger"
      onClick={() => {
        window.localStorage.removeItem(DISMISSED_KEY);
        window.dispatchEvent(new Event("accessibility:restore"));
      }}
    >
      Accessibility features
    </button>
  );
}
