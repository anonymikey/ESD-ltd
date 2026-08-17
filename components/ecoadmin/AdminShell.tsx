"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/ecoadmin", label: "Dashboard" },
  { href: "/ecoadmin/compose", label: "Compose" },
  { href: "/ecoadmin/sent", label: "Sent" },
  { href: "/ecoadmin/templates", label: "Templates" },
  { href: "/ecoadmin/senders", label: "Senders" },
  { href: "/ecoadmin/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/ecoadmin") return pathname === "/ecoadmin";
  return pathname.startsWith(href);
}

export default function AdminShell({
  displayName,
  children,
}: {
  displayName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-offwhite-dim md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-charcoal/10 bg-charcoal text-offwhite md:flex">
        <div className="flex items-center gap-2.5 border-b border-offwhite/10 px-6 py-5">
          <Image src="/logo-mark.webp" alt="" width={56} height={37} className="h-8 w-auto" />
          <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-offwhite">
            EcoAdmin
          </span>
        </div>
        <nav className="flex-1 px-3 py-5" aria-label="Admin">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-sm px-3 py-2.5 font-body text-sm transition-colors duration-150 ${
                    isActive(pathname, item.href)
                      ? "bg-bronze/15 text-bronze"
                      : "text-offwhite/70 hover:bg-offwhite/5 hover:text-offwhite"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-offwhite/10 px-6 py-4">
          <p className="truncate font-mono text-[11px] uppercase tracking-[0.1em] text-offwhite/40">
            Signed in
          </p>
          <p className="mt-0.5 truncate font-body text-sm text-offwhite/80">{displayName}</p>
          <form action="/api/ecoadmin/logout" method="post">
            <button
              type="submit"
              className="mt-3 font-body text-xs font-semibold uppercase tracking-[0.1em] text-offwhite/50 transition-colors duration-150 hover:text-bronze"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="flex items-center justify-between border-b border-charcoal/10 bg-charcoal px-4 py-3 text-offwhite md:hidden">
        <div className="flex items-center gap-2">
          <Image src="/logo-mark.webp" alt="" width={48} height={32} className="h-6 w-auto" />
          <span className="font-display text-xs font-bold uppercase tracking-[0.14em]">EcoAdmin</span>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="ecoadmin-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-offwhite/20"
        >
          <span className="sr-only">Toggle menu</span>
          <div className="flex flex-col gap-[4px]">
            <span className="h-px w-5 bg-offwhite" />
            <span className="h-px w-5 bg-offwhite" />
            <span className="h-px w-5 bg-offwhite" />
          </div>
        </button>
      </header>

      {menuOpen && (
        <nav id="ecoadmin-mobile-nav" aria-label="Admin" className="border-b border-charcoal/10 bg-charcoal px-3 py-3 text-offwhite md:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-sm px-3 py-2.5 font-body text-sm ${
                    isActive(pathname, item.href) ? "bg-bronze/15 text-bronze" : "text-offwhite/75"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <form action="/api/ecoadmin/logout" method="post">
            <button
              type="submit"
              className="mt-3 px-3 font-body text-xs font-semibold uppercase tracking-[0.1em] text-offwhite/50"
            >
              Log out
            </button>
          </form>
        </nav>
      )}

      <div className="flex-1">
        <main className="mx-auto max-w-5xl px-4 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
  );
}
