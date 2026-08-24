"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

// Only ever used from "use client" components. Uses the public anon key,
// which is safe to ship to the browser — access is governed by Row Level
// Security policies in Postgres, not by keeping this key secret.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
