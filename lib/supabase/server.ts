import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * Use this in Server Components, Route Handlers and Server Actions.
 *
 * Server Components can't write cookies (Next.js will throw), so the
 * set/remove calls are wrapped in try/catch — the middleware is what
 * actually refreshes the session cookie on every request, this client
 * just needs to be able to *read* it. See lib/supabase/middleware.ts.
 *
 * Falls back to a syntactically valid placeholder URL when env vars are
 * unset, so construction itself never throws (an empty string fails
 * `new URL()` inside the Supabase client). Callers still get "unconfigured"
 * behavior — every real call this client makes will fail at the network
 * layer, which lib/ecoadmin/auth.ts and friends already catch and treat as
 * "no session" / fail closed. This only prevents a 500 from a malformed
 * client at *construction* time, not an actual working fallback.
 */
export function createClient() {
  const cookieStore = cookies();
  const url = isSupabaseConfigured ? supabaseUrl : "https://not-configured.invalid";
  const key = isSupabaseConfigured ? supabaseAnonKey : "not-configured";

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component — safe to ignore because the
          // middleware refreshes the session on every request.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Same as above.
        }
      },
    },
  });
}
