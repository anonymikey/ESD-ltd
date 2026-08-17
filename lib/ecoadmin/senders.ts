import "server-only";
import { createClient } from "@/lib/supabase/server";

// Defense-in-depth: even if the `senders` table were ever misconfigured,
// nothing outside this domain can be used as a From address. This is a
// second, independent check — the database is still the primary source of
// truth for which specific addresses are active.
const ALLOWED_DOMAIN = "ecostructdynamicsltd.com";

export interface Sender {
  id: string;
  email: string;
  displayName: string;
  replyTo: string | null;
  isActive: boolean;
  verificationStatus: "verified" | "pending" | "unverified";
}

// Seed data mirrored from supabase/migrations — used only as a fallback so
// the composer's From dropdown and the send API still work the moment the
// app is deployed, before someone has run the migration / seed script. Once
// the `senders` table exists and is seeded, the database result below is
// what's actually used for authorization decisions.
const FALLBACK_SENDERS: Sender[] = [
  {
    id: "seed-info",
    email: "info@ecostructdynamicsltd.com",
    displayName: "Ecostruct Dynamics",
    replyTo: "info@ecostructdynamicsltd.com",
    isActive: true,
    verificationStatus: "verified",
  },
  {
    id: "seed-tony",
    email: "tony@ecostructdynamicsltd.com",
    displayName: "Tony",
    replyTo: "tony@ecostructdynamicsltd.com",
    isActive: true,
    verificationStatus: "verified",
  },
];

/**
 * The authoritative list of senders an admin is allowed to send as. Always
 * called server-side. Falls back to the two known-good addresses if the
 * `senders` table isn't reachable yet (e.g. migration not yet run) —
 * fails toward "only the two originally authorized addresses work" rather
 * than toward "nothing works" or "anything works".
 */
export async function getActiveSenders(): Promise<Sender[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("senders")
      .select("id, email, display_name, reply_to, is_active, verification_status")
      .eq("is_active", true)
      .eq("verification_status", "verified")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_SENDERS;
    }

    return data
      .filter((row) => row.email.endsWith(`@${ALLOWED_DOMAIN}`))
      .map((row) => ({
        id: row.id as string,
        email: row.email as string,
        displayName: row.display_name as string,
        replyTo: (row.reply_to as string | null) ?? null,
        isActive: row.is_active as boolean,
        verificationStatus: row.verification_status as Sender["verificationStatus"],
      }));
  } catch {
    return FALLBACK_SENDERS;
  }
}

/**
 * Validates a candidate From address against the authoritative allowlist.
 * Never trusts a From address supplied by the browser without this check —
 * called from the send API on every request.
 */
export async function resolveAuthorizedSender(email: string): Promise<Sender | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.endsWith(`@${ALLOWED_DOMAIN}`)) {
    return null;
  }

  const senders = await getActiveSenders();
  return senders.find((s) => s.email.toLowerCase() === normalized) ?? null;
}
