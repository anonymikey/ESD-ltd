"use client";

import { useState, type FormEvent } from "react";

const baseInput =
  "w-full rounded-sm border bg-transparent px-4 py-3.5 font-body text-sm text-offwhite placeholder:text-offwhite/35 transition-colors duration-300 ease-engineer focus:border-leaf";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverMessage, setServerMessage] = useState("");

  function fieldClasses(field: FieldName) {
    return `${baseInput} ${
      errors[field] ? "border-[#C2483B] focus:border-[#C2483B]" : "border-offwhite/20"
    }`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name) nextErrors.name = "Please enter your name.";
    if (!email) nextErrors.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!message) nextErrors.message = "Let us know what you need.";

    setErrors(nextErrors);
    setServerMessage("");

    if (Object.keys(nextErrors).length === 0) {
      setStatus("sending");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone: String(data.get("phone") || "").trim(),
            message,
            website: String(data.get("website") || ""),
          }),
        });
        const result = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) throw new Error(result.error || "We could not send your enquiry.");
        setStatus("submitted");
        form.reset();
      } catch (error) {
        setStatus("error");
        setServerMessage(error instanceof Error ? error.message : "We could not send your enquiry. Please email us directly.");
      }
    } else {
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" className={fieldClasses("name")} placeholder="Your full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && (
            <p id="name-error" className="mt-1.5 font-body text-xs text-[#E08476]">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={fieldClasses("email")} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && (
            <p id="email-error" className="mt-1.5 font-body text-xs text-[#E08476]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
          Phone <span className="normal-case text-offwhite/30">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={`${baseInput} border-offwhite/20`} placeholder="+254 ..." />
      </div>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${fieldClasses("message")} resize-none`}
          placeholder="Tell us about your project or enquiry"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 font-body text-xs text-[#E08476]">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-sm bg-leaf px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-all duration-300 ease-engineer hover:bg-leaf-light disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
        <p className="font-body text-xs leading-relaxed text-offwhite/45 sm:max-w-[220px]">
          Your enquiry will be sent securely to our primary enquiries address.
        </p>
      </div>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {status === "submitted" && <p className="font-body text-sm text-leaf-light">Thanks — your enquiry has been sent. We’ll be in touch soon.</p>}
        {status === "error" && <p className="font-body text-sm text-[#E08476]">{serverMessage}</p>}
      </div>
    </form>
  );
}
