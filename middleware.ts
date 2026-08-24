import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Scoped narrowly to the admin area so this can never interfere with the
  // public marketing site's routing, caching or static generation.
  matcher: ["/ecoadmin/:path*"],
};
