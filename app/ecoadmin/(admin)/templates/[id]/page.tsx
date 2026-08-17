import { notFound } from "next/navigation";
import TemplateForm from "@/components/ecoadmin/TemplateForm";
import { createClient } from "@/lib/supabase/server";
import { updateTemplate } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: template } = await supabase
    .from("templates")
    .select("id, name, subject, body")
    .eq("id", params.id)
    .maybeSingle();

  if (!template) notFound();

  const updateWithId = updateTemplate.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Edit Template</h1>
      <div className="mt-8">
        <TemplateForm
          action={updateWithId}
          submitLabel="Save Changes"
          defaultValues={{ name: template.name, subject: template.subject, body: template.body }}
        />
      </div>
    </div>
  );
}
