const fieldClasses =
  "w-full rounded-sm border border-charcoal/15 bg-white px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze";
const labelClasses = "mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-charcoal/50";

export default function TemplateForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: { name: string; subject: string; body: string };
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="name" className={labelClasses}>
          Template name
        </label>
        <input id="name" name="name" type="text" required defaultValue={defaultValues?.name} className={fieldClasses} />
      </div>
      <div>
        <label htmlFor="subject" className={labelClasses}>
          Subject
        </label>
        <input id="subject" name="subject" type="text" required defaultValue={defaultValues?.subject} className={fieldClasses} />
      </div>
      <div>
        <label htmlFor="body" className={labelClasses}>
          Body
        </label>
        <textarea id="body" name="body" rows={10} required defaultValue={defaultValues?.body} className={`${fieldClasses} resize-none`} />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-sm bg-charcoal px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite hover:bg-charcoal/85"
      >
        {submitLabel}
      </button>
    </form>
  );
}
