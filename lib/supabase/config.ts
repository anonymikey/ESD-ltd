// Central place to read Supabase configuration. Using the standard
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY convention (the
// one most Supabase + Next.js starters use) so this slots into the project
// as-is if those variables already exist elsewhere. The anon key is safe to
// expose to the browser by design — it only grants what Row Level Security
// policies allow. RESEND_API_KEY and SUPABASE_SERVICE_ROLE_KEY are server-only
// and are never imported from a "use client" file.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
