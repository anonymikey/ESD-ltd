import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: `${site.name} delivers integrated engineering, infrastructure, technology and sustainability solutions across the green and blue economy, creating value for clients and communities across Africa.`,
  keywords: [
    "EcoStruct Dynamics",
    "engineering company Kenya",
    "sustainable construction Mombasa",
    "infrastructure development",
    "green economy",
    "blue economy",
    "renewable energy Kenya",
  ],
  alternates: {
    canonical: site.url,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description:
      "One company, multiple capabilities, integrated solutions — across engineering, infrastructure, technology and sustainability.",
    url: site.url,
    siteName: site.name,
    type: "website",
    // Add an `images` entry here once a real 1200×630 OG image is placed in
    // /public — omitted for now rather than pointing at a placeholder file.
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description:
      "One company, multiple capabilities, integrated solutions — across engineering, infrastructure, technology and sustainability.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-offwhite font-body text-charcoal antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-charcoal focus:px-4 focus:py-3 focus:text-offwhite"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
