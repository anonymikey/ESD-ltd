import { NextResponse, type NextRequest } from "next/server";
import { checkAdmin } from "@/lib/ecoadmin/auth";
import { resolveAuthorizedSender } from "@/lib/ecoadmin/senders";
import { LIMITS, validateSendPayload } from "@/lib/ecoadmin/validation";
import { checkDuplicateSubmission, checkRateLimit } from "@/lib/ecoadmin/rateLimit";
import { renderBrandedEmailHtml } from "@/lib/ecoadmin/emailTemplate";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function splitAddresses(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[,;\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

export async function POST(request: NextRequest) {
  // 1. Authentication + authorization — never trust the browser.
  const admin = await checkAdmin();
  if (!admin.ok) {
    const status = admin.reason === "unauthenticated" || admin.reason === "unconfigured" ? 401 : 403;
    return NextResponse.json({ error: "Not authorized." }, { status });
  }

  // 2. Payload size guard, before doing any parsing work.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > LIMITS.maxTotalPayloadBytes) {
    return NextResponse.json({ error: "Request payload too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const idempotencyKey = typeof body.idempotencyKey === "string" ? body.idempotencyKey : null;
  if (!idempotencyKey) {
    return NextResponse.json({ error: "Missing idempotency key." }, { status: 400 });
  }

  // 3. Duplicate-submission guard (backstop — the composer UI also disables
  // the button while a request is in flight).
  if (await checkDuplicateSubmission(idempotencyKey)) {
    return NextResponse.json({ error: "This message has already been sent." }, { status: 409 });
  }

  // 4. Rate limit, DB-backed so it holds up across serverless invocations.
  const rateLimit = await checkRateLimit(admin.context.adminId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.reason }, { status: 429 });
  }

  const input = {
    fromSenderId: typeof body.fromEmail === "string" ? body.fromEmail : "",
    to: splitAddresses(body.to),
    cc: splitAddresses(body.cc),
    bcc: splitAddresses(body.bcc),
    subject: typeof body.subject === "string" ? body.subject : "",
    message: typeof body.message === "string" ? body.message : "",
  };

  // 5. Payload validation.
  const validation = validateSendPayload(input);
  if (!validation.valid) {
    return NextResponse.json({ error: "Validation failed.", fieldErrors: validation.errors }, { status: 422 });
  }

  // 6. Sender authorization — resolved server-side against the
  // authoritative allowlist. The browser only ever sent an email address;
  // it never gets to assert a display name or bypass this check.
  const sender = await resolveAuthorizedSender(input.fromSenderId);
  if (!sender) {
    return NextResponse.json({ error: "That From address is not authorized." }, { status: 403 });
  }

  const supabase = createClient();

  // 7. Resend not configured yet (expected pre-DNS-verification state) —
  // fail clearly rather than faking success.
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    await supabase.from("email_logs").insert({
      admin_user_id: admin.context.adminId,
      sender_id: sender.id.startsWith("seed-") ? null : sender.id,
      to_addresses: input.to,
      cc_addresses: input.cc,
      bcc_addresses: input.bcc,
      subject: input.subject,
      status: "failed",
      error_message: "RESEND_API_KEY is not configured.",
      idempotency_key: idempotencyKey,
    });

    return NextResponse.json(
      {
        error:
          "Outbound email is not available yet — RESEND_API_KEY and domain verification haven't been configured. Nothing was sent.",
      },
      { status: 503 }
    );
  }

  // 8. Send via Resend — the only place in the codebase that calls it.
  const { Resend } = await import("resend");
  const resend = new Resend(resendApiKey);

  const html = renderBrandedEmailHtml({ bodyText: input.message, senderDisplayName: sender.displayName });

  try {
    const result = await resend.emails.send({
      from: `${sender.displayName} <${sender.email}>`,
      to: input.to,
      cc: input.cc.length ? input.cc : undefined,
      bcc: input.bcc.length ? input.bcc : undefined,
      replyTo: sender.replyTo ?? sender.email,
      subject: input.subject,
      html,
    });

    if (result.error) {
      await supabase.from("email_logs").insert({
        admin_user_id: admin.context.adminId,
        sender_id: sender.id.startsWith("seed-") ? null : sender.id,
        to_addresses: input.to,
        cc_addresses: input.cc,
        bcc_addresses: input.bcc,
        subject: input.subject,
        status: "failed",
        error_message: result.error.message,
        idempotency_key: idempotencyKey,
      });
      return NextResponse.json({ error: result.error.message }, { status: 502 });
    }

    // Resend confirms acceptance/submission, not final mailbox delivery —
    // "sent" here means "handed off to Resend successfully", which is what
    // resend.emails.send() actually confirms.
    await supabase.from("email_logs").insert({
      admin_user_id: admin.context.adminId,
      sender_id: sender.id.startsWith("seed-") ? null : sender.id,
      to_addresses: input.to,
      cc_addresses: input.cc,
      bcc_addresses: input.bcc,
      subject: input.subject,
      resend_message_id: result.data?.id ?? null,
      status: "sent",
      idempotency_key: idempotencyKey,
    });

    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error calling Resend.";
    await supabase.from("email_logs").insert({
      admin_user_id: admin.context.adminId,
      sender_id: sender.id.startsWith("seed-") ? null : sender.id,
      to_addresses: input.to,
      cc_addresses: input.cc,
      bcc_addresses: input.bcc,
      subject: input.subject,
      status: "failed",
      error_message: message,
      idempotency_key: idempotencyKey,
    });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
