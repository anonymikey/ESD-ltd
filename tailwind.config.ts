import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#14171A",
          soft: "#1C2025",
          line: "#2A2F35",
        },
        offwhite: {
          DEFAULT: "#F5F3EC",
          dim: "#EDE8DB",
        },
        bronze: {
          DEFAULT: "#A97A3B",
          light: "#C89A5F",
          deep: "#7C5827",
        },
        steel: "#767D85",
      },
      fontFamily: {
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Segoe UI"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          '"SF Mono"',
          '"Roboto Mono"',
          '"IBM Plex Mono"',
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6.5vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        content: "1400px",
      },
      transitionTimingFunction: {
        engineer: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(245,243,236,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,236,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        draw: {
          to: { strokeDashoffset: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
