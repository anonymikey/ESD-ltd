import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteTemplate } from "./actions";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const supabase = createClient();
  const { data: templates, error } = await supabase
    .from("templates")
    .select("id, name, subject, updated_at")
    .order("name", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Templates</h1>
          <p className="mt-1 font-body text-sm text-charcoal/55">
            Reusable starting points for Compose. Generic wording only — no company claims.
          </p>
        </div>
        <Link
          href="/ecoadmin/templates/new"
          className="inline-flex items-center justify-center rounded-sm bg-charcoal px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-[0.08em] text-offwhite hover:bg-charcoal/85"
        >
          New Template
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        {error && (
          <p className="p-6 font-body text-sm text-[#C2483B]">
            Could not load templates. If this is a fresh deployment, the `templates` table may not
            be migrated yet — see supabase/migrations.
          </p>
        )}

        {!error && (!templates || templates.length === 0) && (
          <div className="p-10 text-center">
            <p className="font-body text-sm text-charcoal/50">No templates yet.</p>
          </div>
        )}

        {!error &&
          templates?.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between gap-4 border-b border-charcoal/5 px-5 py-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-charcoal">{template.name}</p>
                <p className="truncate font-body text-xs text-charcoal/50">{template.subject}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/ecoadmin/templates/${template.id}`}
                  className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-bronze hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteTemplate}>
                  <input type="hidden" name="id" value={template.id} />
                  <button
                    type="submit"
                    className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/40 hover:text-[#C2483B]"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
