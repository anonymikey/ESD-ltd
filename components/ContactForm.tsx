"use client";

import { useState, type FormEvent } from "react";

const inputClasses =
  "w-full rounded-sm border border-offwhite/20 bg-transparent px-4 py-3.5 font-body text-sm text-offwhite placeholder:text-offwhite/35 transition-colors duration-300 ease-engineer focus:border-bronze";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  // No email backend is connected yet. This handler intentionally does not
  // claim to send anything — swap the body below for a real request once a
  // service such as Formspree or Resend is configured, e.g.:
  //
  //   await fetch("https://formspree.io/f/xxxxxxx", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(Object.fromEntries(new FormData(form))),
  //   });
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
            Name
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClasses} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClasses} placeholder="you@company.com" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
          Phone <span className="normal-case text-offwhite/30">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} placeholder="+254 ..." />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClasses} resize-none`}
          placeholder="Tell us about your project or enquiry"
        />
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-sm bg-bronze px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-all duration-300 ease-engineer hover:bg-bronze-light"
        >
          Send Message
        </button>
        <p className="font-body text-xs leading-relaxed text-offwhite/45 sm:max-w-[220px]">
          This form isn&rsquo;t connected to email delivery yet — please use
          the addresses below in the meantime.
        </p>
      </div>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {status === "submitted" && (
          <p className="font-body text-sm text-bronze-light">
            Thanks — this form isn&rsquo;t wired up to send messages yet.
            Please email us directly using the addresses above so we can
            respond.
          </p>
        )}
      </div>
    </form>
  );
}
