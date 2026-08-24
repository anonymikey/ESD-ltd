import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

const PROTECTED_PREFIX = "/ecoadmin";
const LOGIN_PATH = "/ecoadmin/login";

/**
 * Runs on every request under middleware.ts. Refreshes the Supabase auth
 * cookie (required for SSR auth to keep working) and enforces the
 * authentication gate on /ecoadmin routes at the edge — before any admin
 * page or layout even renders. This is the server-side check the brief
 * asks for; page-level checks in app/ecoadmin/layout.tsx are a second,
 * defense-in-depth layer, not the only one.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith(PROTECTED_PREFIX) &&
    request.nextUrl.pathname !== LOGIN_PATH;
  const isLoginRoute = request.nextUrl.pathname === LOGIN_PATH;

  // Fail closed: if Supabase isn't configured yet, nobody can be treated as
  // authenticated. Protected routes redirect to login; login itself will
  // show a "not configured" notice instead of a broken sign-in form.
  if (!isSupabaseConfigured) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // IMPORTANT: getUser() re-validates the session against Supabase Auth on
  // every call — unlike reading a JWT out of the cookie directly, this
  // can't be spoofed by tampering with the cookie value client-side.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Network/config failure talking to Supabase — treat as unauthenticated
    // rather than letting the request through.
    user = null;
  }

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL(LOGIN_PATH, request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  return response;
}
