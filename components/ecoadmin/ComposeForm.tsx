"use client";

import { useState, type FormEvent } from "react";
import type { Sender } from "@/lib/ecoadmin/senders";

const fieldClasses =
  "w-full rounded-sm border border-charcoal/15 bg-white px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal/35 transition-colors duration-200 focus:border-bronze";
const errorFieldClasses = "border-[#C2483B] focus:border-[#C2483B]";
const labelClasses = "mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-charcoal/50";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";

function parseAddresses(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ComposeForm({ senders }: { senders: Sender[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return; // prevent duplicate submissions

    const form = event.currentTarget;
    const data = new FormData(form);

    const fromEmail = String(data.get("fromEmail") || "");
    const to = parseAddresses(String(data.get("to") || ""));
    const cc = parseAddresses(String(data.get("cc") || ""));
    const bcc = parseAddresses(String(data.get("bcc") || ""));
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!fromEmail) nextErrors.fromEmail = "Choose a From address.";
    if (to.length === 0) nextErrors.to = "Add at least one recipient.";
    else if (to.some((a) => !EMAIL_RE.test(a))) nextErrors.to = "One or more To addresses look invalid.";
    if (cc.some((a) => !EMAIL_RE.test(a))) nextErrors.cc = "One or more CC addresses look invalid.";
    if (bcc.some((a) => !EMAIL_RE.test(a))) nextErrors.bcc = "One or more BCC addresses look invalid.";
    if (!subject) nextErrors.subject = "Subject is required.";
    if (!message) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      const res = await fetch("/api/ecoadmin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromEmail, to, cc, bcc, subject, message, idempotencyKey }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error ?? "Something went wrong sending this email.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setServerError("Network error — please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="fromEmail" className={labelClasses}>
          From
        </label>
        <select
          id="fromEmail"
          name="fromEmail"
          defaultValue=""
          className={`${fieldClasses} ${errors.fromEmail ? errorFieldClasses : ""}`}
        >
          <option value="" disabled>
            Select a sender
          </option>
          {senders.map((sender) => (
            <option key={sender.id} value={sender.email}>
              {sender.displayName} &lt;{sender.email}&gt;
            </option>
          ))}
        </select>
        {errors.fromEmail && <p className="mt-1.5 font-body text-xs text-[#C2483B]">{errors.fromEmail}</p>}
      </div>

      <div>
        <label htmlFor="to" className={labelClasses}>
          To
        </label>
        <input id="to" name="to" type="text" className={`${fieldClasses} ${errors.to ? errorFieldClasses : ""}`} placeholder="recipient@example.com, another@example.com" />
        {errors.to && <p className="mt-1.5 font-body text-xs text-[#C2483B]">{errors.to}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cc" className={labelClasses}>
            CC <span className="normal-case text-charcoal/30">(optional)</span>
          </label>
          <input id="cc" name="cc" type="text" className={`${fieldClasses} ${errors.cc ? errorFieldClasses : ""}`} placeholder="" />
          {errors.cc && <p className="mt-1.5 font-body text-xs text-[#C2483B]">{errors.cc}</p>}
        </div>
        <div>
          <label htmlFor="bcc" className={labelClasses}>
            BCC <span className="normal-case text-charcoal/30">(optional)</span>
          </label>
          <input id="bcc" name="bcc" type="text" className={`${fieldClasses} ${errors.bcc ? errorFieldClasses : ""}`} placeholder="" />
          {errors.bcc && <p className="mt-1.5 font-body text-xs text-[#C2483B]">{errors.bcc}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClasses}>
          Subject
        </label>
        <input id="subject" name="subject" type="text" className={`${fieldClasses} ${errors.subject ? errorFieldClasses : ""}`} placeholder="" />
        {errors.subject && <p className="mt-1.5 font-body text-xs text-[#C2483B]">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea id="message" name="message" rows={8} className={`${fieldClasses} resize-none ${errors.message ? errorFieldClasses : ""}`} placeholder="" />
        {errors.message && <p className="mt-1.5 font-body text-xs text-[#C2483B]">{errors.message}</p>}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-sm bg-charcoal px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite transition-colors duration-200 hover:bg-charcoal/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send Email"}
        </button>

        {status === "success" && (
          <p role="status" className="font-body text-sm text-emerald-700">
            Sent successfully.
          </p>
        )}
        {status === "error" && serverError && (
          <p role="alert" className="font-body text-sm text-[#C2483B]">
            {serverError}
          </p>
        )}
      </div>
    </form>
  );
}
