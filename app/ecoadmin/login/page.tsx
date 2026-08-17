import Image from "next/image";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signIn } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Enter both your email and password.",
  invalid: "Incorrect email or password.",
  unconfigured: "Admin sign-in is not configured in this environment yet.",
};

export default function EcoAdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo-mark.webp" alt="" width={80} height={53} className="h-10 w-auto" />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.24em] text-offwhite/50">
            EcoStruct Dynamics · EcoAdmin
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-sm border border-bronze/30 bg-bronze/10 px-4 py-3">
            <p className="font-body text-sm text-offwhite/80">
              Admin sign-in isn&rsquo;t configured yet. Set{" "}
              <code className="font-mono text-xs text-bronze">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono text-xs text-bronze">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              to enable it.
            </p>
          </div>
        )}

        <form action={signIn} className="space-y-4 rounded-sm border border-offwhite/12 p-7">
          <input type="hidden" name="next" value={searchParams.next ?? "/ecoadmin"} />

          <div>
            <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              disabled={!isSupabaseConfigured}
              className="w-full rounded-sm border border-offwhite/20 bg-transparent px-4 py-3 font-body text-sm text-offwhite placeholder:text-offwhite/35 transition-colors duration-300 focus:border-bronze disabled:opacity-40"
              placeholder="you@ecostructdynamicsltd.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={!isSupabaseConfigured}
              className="w-full rounded-sm border border-offwhite/20 bg-transparent px-4 py-3 font-body text-sm text-offwhite placeholder:text-offwhite/35 transition-colors duration-300 focus:border-bronze disabled:opacity-40"
              placeholder="••••••••"
            />
          </div>

          {errorMessage && (
            <p role="alert" className="font-body text-sm text-[#E08476]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!isSupabaseConfigured}
            className="w-full rounded-sm bg-bronze px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors duration-300 hover:bg-bronze-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-offwhite/35">
          Private administrative access only.
        </p>
      </div>
    </main>
  );
}
