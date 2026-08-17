interface GuideIllustrationProps {
  /** Short label shown in the mock sidebar/tab area, e.g. "DNS" */
  panelLabel?: string;
  /** Label on the highlighted element the step is pointing at */
  highlightLabel: string;
  /** Position of the highlight box within the mock window */
  highlightPosition: "sidebar" | "topbar" | "center" | "button";
}

export default function GuideIllustration({ panelLabel, highlightLabel, highlightPosition }: GuideIllustrationProps) {
  const highlightRect = {
    sidebar: { x: 16, y: 70, w: 90, h: 24 },
    topbar: { x: 140, y: 16, w: 140, h: 24 },
    center: { x: 130, y: 90, w: 160, h: 60 },
    button: { x: 260, y: 150, w: 90, h: 28 },
  }[highlightPosition];

  return (
    <svg viewBox="0 0 420 220" className="h-auto w-full" role="img" aria-label={`Illustration: ${highlightLabel}`}>
      {/* Browser chrome */}
      <rect x="4" y="4" width="412" height="212" rx="6" fill="#F5F3EC" stroke="#E5E1D6" />
      <rect x="4" y="4" width="412" height="28" rx="6" fill="#EDE8DB" stroke="#E5E1D6" />
      <circle cx="20" cy="18" r="4" fill="#D8D2C2" />
      <circle cx="34" cy="18" r="4" fill="#D8D2C2" />
      <circle cx="48" cy="18" r="4" fill="#D8D2C2" />
      <rect x="70" y="12" width="220" height="12" rx="3" fill="#ffffff" stroke="#E5E1D6" />

      {/* Sidebar */}
      <rect x="12" y="42" width="100" height="166" fill="#ffffff" stroke="#E5E1D6" />
      <rect x="20" y="54" width="84" height="8" rx="2" fill="#D8D2C2" />
      <rect x="20" y="70" width="70" height="8" rx="2" fill="#D8D2C2" />
      <rect x="20" y="86" width="76" height="8" rx="2" fill="#D8D2C2" />
      <rect x="20" y="102" width="60" height="8" rx="2" fill="#D8D2C2" />
      {panelLabel && (
        <text x="20" y="200" fontSize="9" fill="#767D85" fontFamily="monospace">
          {panelLabel}
        </text>
      )}

      {/* Main content area */}
      <rect x="118" y="42" width="288" height="166" fill="#ffffff" stroke="#E5E1D6" />
      <rect x="132" y="58" width="140" height="10" rx="2" fill="#D8D2C2" />
      <rect x="132" y="78" width="260" height="1" fill="#EDE8DB" />
      <rect x="132" y="94" width="200" height="8" rx="2" fill="#EDE8DB" />
      <rect x="132" y="110" width="180" height="8" rx="2" fill="#EDE8DB" />
      <rect x="132" y="126" width="220" height="8" rx="2" fill="#EDE8DB" />

      {/* Highlight box + label pointing at the relevant UI area */}
      <rect
        x={highlightRect.x}
        y={highlightRect.y}
        width={highlightRect.w}
        height={highlightRect.h}
        rx="4"
        fill="none"
        stroke="#A97A3B"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <text
        x={highlightRect.x}
        y={highlightRect.y + highlightRect.h + 16}
        fontSize="11"
        fontWeight="600"
        fill="#A97A3B"
        fontFamily="monospace"
      >
        {highlightLabel}
      </text>
    </svg>
  );
}
