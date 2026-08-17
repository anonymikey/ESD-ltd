import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Nothing meaningfully "logged in" if Supabase is unreachable —
      // fall through to the redirect either way.
    }
  }
  return NextResponse.redirect(new URL("/ecoadmin/login", request.url));
}
