import "server-only";
import { createClient } from "@/lib/supabase/server";

export const FONT_OPTIONS = {
  system: { label: "System / crisp", display: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', body: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  editorial: { label: "Editorial / refined", display: 'Georgia, "Times New Roman", serif', body: '"Trebuchet MS", Arial, sans-serif', mono: '"Courier New", Courier, monospace' },
  geometric: { label: "Geometric / modern", display: 'Futura, "Century Gothic", "Trebuchet MS", sans-serif', body: '"Avenir Next", Avenir, "Segoe UI", sans-serif', mono: 'Consolas, "Liberation Mono", monospace' },
  humanist: { label: "Humanist / warm", display: '"Gill Sans", "Trebuchet MS", sans-serif', body: 'Verdana, Geneva, sans-serif', mono: '"Lucida Console", Monaco, monospace' },
  technical: { label: "Technical / dense", display: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif', body: 'Arial, Helvetica, sans-serif', mono: '"Roboto Mono", "Courier New", monospace' },
} as const;

export type FontKey = keyof typeof FONT_OPTIONS;

export interface AdminTheme {
  name: string;
  background: string;
  surface: string;
  sidebar: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  border: string;
  sidebarText: string;
  font: FontKey;
}

export const THEME_PRESETS: AdminTheme[] = [
  { name: "EcoStruct Original", background: "#EDE8DB", surface: "#FFFFFF", sidebar: "#14171A", text: "#14171A", muted: "#767D85", accent: "#4A8C2A", accentSoft: "#DDEBD5", border: "#CFC8B8", sidebarText: "#F5F3EC", font: "system" },
  { name: "Forest Canopy", background: "#E8F0E6", surface: "#F8FCF7", sidebar: "#12352B", text: "#15352B", muted: "#587267", accent: "#2D8A5B", accentSoft: "#CDEBDD", border: "#B8D3C4", sidebarText: "#F3FFF7", font: "humanist" },
  { name: "Ocean Current", background: "#E6F1F5", surface: "#F9FCFD", sidebar: "#0B2D3A", text: "#102C36", muted: "#5C7782", accent: "#087E9B", accentSoft: "#D0EBF1", border: "#B8D5DD", sidebarText: "#F1FBFF", font: "geometric" },
  { name: "Sunset Clay", background: "#F5E7DE", surface: "#FFF9F5", sidebar: "#432D2A", text: "#382421", muted: "#876F68", accent: "#C45B3C", accentSoft: "#F5D5C8", border: "#E0C2B4", sidebarText: "#FFF8F2", font: "editorial" },
  { name: "Royal Plum", background: "#F0EAF4", surface: "#FCFAFD", sidebar: "#291A35", text: "#30213A", muted: "#7B6C86", accent: "#8B4DB2", accentSoft: "#E8D8F0", border: "#D3C2DD", sidebarText: "#FFF8FF", font: "editorial" },
  { name: "Midnight Electric", background: "#111827", surface: "#1F2937", sidebar: "#070B14", text: "#F3F4F6", muted: "#A7B0C0", accent: "#38BDF8", accentSoft: "#123A51", border: "#344155", sidebarText: "#F8FAFC", font: "technical" },
  { name: "Carbon Lime", background: "#1B211D", surface: "#262E28", sidebar: "#0D110E", text: "#F0F7EF", muted: "#A7B8A8", accent: "#B7E34A", accentSoft: "#354A20", border: "#435044", sidebarText: "#F6FFF1", font: "technical" },
  { name: "Paper & Ink", background: "#F7F4EE", surface: "#FFFEFA", sidebar: "#292722", text: "#2E2B26", muted: "#817A70", accent: "#A85A2A", accentSoft: "#F0DFD0", border: "#DDD6CA", sidebarText: "#FFFDF5", font: "editorial" },
  { name: "Cobalt Studio", background: "#E9EFFB", surface: "#FFFFFF", sidebar: "#172554", text: "#172554", muted: "#64748B", accent: "#2563EB", accentSoft: "#DCE8FF", border: "#C8D5EE", sidebarText: "#F5F8FF", font: "geometric" },
  { name: "Rose Quartz", background: "#F8ECF1", surface: "#FFF9FB", sidebar: "#40202E", text: "#3D2530", muted: "#8C6A78", accent: "#C83E72", accentSoft: "#F5D4E1", border: "#E6C4D2", sidebarText: "#FFF7FB", font: "humanist" },
];

export const DEFAULT_ADMIN_THEME = THEME_PRESETS[0];
const HEX_RE = /^#[0-9a-f]{6}$/i;
const FONT_KEYS = Object.keys(FONT_OPTIONS) as FontKey[];
const THEME_KEYS = ["background", "surface", "sidebar", "text", "muted", "accent", "accentSoft", "border", "sidebarText"] as const;

export function normalizeTheme(value: unknown): AdminTheme {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const merged = { ...DEFAULT_ADMIN_THEME, ...input } as Record<string, unknown>;
  const result = { ...DEFAULT_ADMIN_THEME } as AdminTheme;
  for (const key of THEME_KEYS) if (typeof merged[key] === "string" && HEX_RE.test(merged[key] as string)) result[key] = merged[key] as string;
  if (typeof merged.name === "string" && merged.name.trim()) result.name = merged.name.trim().slice(0, 60);
  if (typeof merged.font === "string" && FONT_KEYS.includes(merged.font as FontKey)) result.font = merged.font as FontKey;
  return result;
}

export async function getAdminTheme(adminId: string): Promise<AdminTheme> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("admin_preferences").select("theme").eq("admin_user_id", adminId).maybeSingle();
    return normalizeTheme(data?.theme);
  } catch {
    return DEFAULT_ADMIN_THEME;
  }
}
