import "server-only";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  maxRecipientsPerField: 10,
  maxSubjectLength: 200,
  maxMessageLength: 20000, // ~20KB of message text
  maxTotalPayloadBytes: 2 * 1024 * 1024, // 2MB, headroom for future attachments
};

export interface SendEmailInput {
  fromSenderId: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof SendEmailInput, string>>;
}

function validateAddressList(list: string[], fieldLabel: string, required: boolean): string | null {
  if (required && list.length === 0) return `At least one ${fieldLabel} recipient is required.`;
  if (list.length > LIMITS.maxRecipientsPerField) {
    return `No more than ${LIMITS.maxRecipientsPerField} ${fieldLabel} recipients per email.`;
  }
  const invalid = list.find((addr) => !EMAIL_RE.test(addr.trim()));
  if (invalid) return `"${invalid}" is not a valid email address.`;
  return null;
}

/** Validates a compose payload server-side. Never trust client-side validation alone. */
export function validateSendPayload(input: SendEmailInput): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!input.fromSenderId) errors.fromSenderId = "A From address is required.";

  const toError = validateAddressList(input.to, "To", true);
  if (toError) errors.to = toError;

  const ccError = validateAddressList(input.cc, "CC", false);
  if (ccError) errors.cc = ccError;

  const bccError = validateAddressList(input.bcc, "BCC", false);
  if (bccError) errors.bcc = bccError;

  const subject = input.subject.trim();
  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length > LIMITS.maxSubjectLength) {
    errors.subject = `Subject must be under ${LIMITS.maxSubjectLength} characters.`;
  }

  const message = input.message.trim();
  if (!message) errors.message = "Message is required.";
  else if (message.length > LIMITS.maxMessageLength) {
    errors.message = `Message must be under ${LIMITS.maxMessageLength.toLocaleString()} characters.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Escapes user-supplied text before it's interpolated into the HTML email body. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
