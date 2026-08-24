import TemplateForm from "@/components/ecoadmin/TemplateForm";
import { createTemplate } from "../actions";

export const dynamic = "force-dynamic";

export default function NewTemplatePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">New Template</h1>
      <p className="mt-1 font-body text-sm text-charcoal/55">
        Generic wording only — no company claims, projects, or contact details.
      </p>
      <div className="mt-8">
        <TemplateForm action={createTemplate} submitLabel="Create Template" />
      </div>
    </div>
  );
}
