import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/lib/data";
import { escapeHtml } from "@/lib/ecoadmin/validation";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 8_000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

type RateEntry = { count: number; resetAt: number };
const rateStore = new Map<string, RateEntry>();

function getClientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-client";
}

function getRateLimit(key: string) {
  const now = Date.now();
  const current = rateStore.get(key);
  if (!current || current.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    rateStore.set(key, fresh);
    return fresh;
  }
  current.count += 1;
  return current;
}

function emailHtml(input: { name: string; email: string; phone: string; message: string }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#14171A">
      <div style="border-top:5px solid #4A8C2A;padding:28px 0 18px">
        <p style="margin:0;color:#4A8C2A;font-size:12px;letter-spacing:.14em;text-transform:uppercase">New website enquiry</p>
        <h1 style="margin:10px 0 0;font-size:26px">${escapeHtml(input.name)} sent a message</h1>
      </div>
      <div style="background:#F5F3EC;padding:20px 24px;border:1px solid #E3DED1">
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(input.phone || "Not provided")}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;line-height:1.65">${escapeHtml(input.message)}</p>
      </div>
      <p style="color:#767D85;font-size:12px;margin-top:18px">Submitted through ${site.domain}.</p>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 64 * 1024) return NextResponse.json({ error: "Request too large." }, { status: 413 });

  const rate = getRateLimit(getClientKey(request));
  if (rate.count > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json({ error: "Too many enquiries. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Quiet honeypot for unsophisticated bots. Return success so bots do not learn the field exists.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120) return NextResponse.json({ error: "Please enter a valid name." }, { status: 422 });
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  if (phone.length > 60) return NextResponse.json({ error: "Please check the phone number." }, { status: 422 });
  if (!message || message.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: "Please enter a message under 8,000 characters." }, { status: 422 });

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return NextResponse.json({ error: "Email delivery is not configured yet. Please email us directly." }, { status: 503 });

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: `Website enquiries <${site.emails.website}>`,
      to: [site.emails.website],
      replyTo: email,
      subject: `Website enquiry from ${name}`,
      html: emailHtml({ name, email, phone, message }),
    });

    if (result.error) return NextResponse.json({ error: "We could not send your enquiry. Please email us directly." }, { status: 502 });
    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch {
    return NextResponse.json({ error: "We could not send your enquiry. Please email us directly." }, { status: 502 });
  }
}
