"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAdminTheme } from "@/app/ecoadmin/(admin)/settings/actions";
import type { AdminTheme, FontKey } from "@/lib/ecoadmin/theme";

type FontOption = { key: FontKey; label: string };

const COLOR_FIELDS: Array<{ key: keyof Pick<AdminTheme, "background" | "surface" | "sidebar" | "text" | "muted" | "accent" | "accentSoft" | "border">; label: string }> = [
  { key: "background", label: "Page background" },
  { key: "surface", label: "Cards and panels" },
  { key: "sidebar", label: "Sidebar" },
  { key: "text", label: "Main text" },
  { key: "muted", label: "Muted text" },
  { key: "accent", label: "Accent" },
  { key: "accentSoft", label: "Accent wash" },
  { key: "border", label: "Borders" },
];

const FONT_STACKS: Record<FontKey, { display: string; body: string; mono: string }> = {
  system: { display: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', body: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  editorial: { display: 'Georgia, "Times New Roman", serif', body: '"Trebuchet MS", Arial, sans-serif', mono: '"Courier New", Courier, monospace' },
  geometric: { display: 'Futura, "Century Gothic", "Trebuchet MS", sans-serif', body: '"Avenir Next", Avenir, "Segoe UI", sans-serif', mono: 'Consolas, "Liberation Mono", monospace' },
  humanist: { display: '"Gill Sans", "Trebuchet MS", sans-serif', body: "Verdana, Geneva, sans-serif", mono: '"Lucida Console", Monaco, monospace' },
  technical: { display: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif', body: "Arial, Helvetica, sans-serif", mono: '"Roboto Mono", "Courier New", monospace' },
};

export default function ThemeStudio({ initialTheme, presets, fonts }: { initialTheme: AdminTheme; presets: AdminTheme[]; fonts: FontOption[] }) {
  const router = useRouter();
  const [theme, setTheme] = useState<AdminTheme>(initialTheme);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewFonts = FONT_STACKS[theme.font];

  function update<K extends keyof AdminTheme>(key: K, value: AdminTheme[K]) {
    setTheme((current) => ({ ...current, [key]: value }));
    setStatus(null);
  }

  function save() {
    setStatus(null);
    startTransition(async () => {
      const result = await saveAdminTheme(theme);
      if (result.error) setStatus(result.error);
      else {
        setStatus("Theme saved for your admin account.");
        router.refresh();
      }
    });
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-charcoal">Theme Studio</h2>
          <p className="mt-1 max-w-2xl font-body text-sm text-charcoal/55">
            Change the EcoAdmin atmosphere without affecting the public website. Choose a direction, then fine-tune individual colors and typography.
          </p>
        </div>
        <button type="button" onClick={save} disabled={isPending} className="rounded-sm bg-charcoal px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.08em] text-offwhite hover:bg-charcoal/85 disabled:opacity-50">
          {isPending ? "Saving…" : "Save theme"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {presets.map((preset) => (
          <button key={preset.name} type="button" onClick={() => { setTheme(preset); setStatus(null); }} className={`overflow-hidden rounded-sm border text-left transition-transform hover:-translate-y-0.5 ${theme.name === preset.name ? "border-leaf ring-2 ring-leaf/20" : "border-charcoal/10"}`}>
            <span className="block h-16" style={{ background: `linear-gradient(135deg, ${preset.sidebar} 0 34%, ${preset.background} 34% 70%, ${preset.accent} 70%)` }} />
            <span className="block bg-white px-3 py-2 font-body text-xs font-semibold text-charcoal">{preset.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-sm border border-charcoal/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-charcoal">Custom colors</h3>
              <p className="mt-1 font-body text-xs text-charcoal/50">Use six-digit hex colors for precise control.</p>
            </div>
            <input aria-label="Theme name" value={theme.name} onChange={(event) => update("name", event.target.value)} className="w-40 rounded-sm border border-charcoal/15 px-3 py-2 font-body text-xs" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COLOR_FIELDS.map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between gap-3 rounded-sm border border-charcoal/10 px-3 py-2.5">
                <span className="font-body text-xs text-charcoal/70">{label}</span>
                <span className="flex items-center gap-2">
                  <input type="color" value={theme[key]} onChange={(event) => update(key, event.target.value.toUpperCase())} className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0" />
                  <span className="font-mono text-[10px] uppercase text-charcoal/45">{theme[key]}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal/10 bg-white p-5">
          <h3 className="font-display text-base font-semibold text-charcoal">Typography</h3>
          <p className="mt-1 font-body text-xs text-charcoal/50">Choose a font personality for headings, body copy, and technical labels.</p>
          <div className="mt-5 space-y-2">
            {fonts.map((font) => (
              <button key={font.key} type="button" onClick={() => update("font", font.key)} className={`flex w-full items-center justify-between rounded-sm border px-3 py-3 text-left ${theme.font === font.key ? "border-leaf bg-leaf/10" : "border-charcoal/10"}`}>
                <span className="font-body text-sm text-charcoal">{font.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-charcoal/40">{font.key}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-sm border border-charcoal/10" style={{ background: theme.background, color: theme.text, fontFamily: previewFonts.body }}>
        <div className="flex items-center gap-4 px-5 py-4" style={{ background: theme.sidebar, color: theme.sidebarText }}>
          <span className="h-8 w-8 rounded-full" style={{ background: theme.accent }} />
          <div><p className="text-base font-semibold" style={{ fontFamily: previewFonts.display }}>Live preview</p><p className="text-xs opacity-70">{theme.name} · {theme.font}</p></div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {[["SENT", "24"], ["FAILED", "0"], ["ACTIVE SENDERS", "4"]].map(([label, value]) => <div key={label} className="rounded-sm p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}><p className="font-mono text-[10px] tracking-[0.16em]" style={{ color: theme.muted }}>{label}</p><p className="mt-3 font-display text-2xl font-semibold">{value}</p></div>)}
        </div>
      </div>

      {status && <p role="status" className={`mt-3 font-body text-sm ${status.includes("saved") ? "text-emerald-700" : "text-[#C2483B]"}`}>{status}</p>}
    </section>
  );
}
