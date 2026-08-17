import "server-only";
import { escapeHtml } from "./validation";

/**
 * Table-based, inline-styled HTML so this renders consistently in Gmail,
 * Outlook and mobile clients — none of which reliably support the site's
 * own Tailwind/flex/grid CSS. Message content is plain text from the
 * composer; we escape it and convert newlines to <br> rather than trusting
 * raw HTML input (avoids XSS via a stored/forwarded message body).
 */
export function renderBrandedEmailHtml(params: {
  bodyText: string;
  senderDisplayName: string;
}): string {
  const safeBody = escapeHtml(params.bodyText).replace(/\n/g, "<br>");
  const safeName = escapeHtml(params.senderDisplayName);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>EcoStruct Dynamics Limited</title>
  </head>
  <body style="margin:0; padding:0; background-color:#EDE8DB; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EDE8DB; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:4px; overflow:hidden;">
            <tr>
              <td style="background-color:#14171A; padding:28px 32px;">
                <span style="display:block; font-size:14px; font-weight:bold; letter-spacing:2px; text-transform:uppercase; color:#F5F3EC;">
                  EcoStruct <span style="color:#A97A3B;">Dynamics</span>
                </span>
                <span style="display:block; margin-top:6px; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#A97A3B;">
                  Engineering Sustainable Solutions for People and Planet
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px; font-size:15px; line-height:1.6; color:#14171A;">
                ${safeBody}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; background-color:#F5F3EC; border-top:1px solid #e5e1d6;">
                <span style="display:block; font-size:12px; color:#767D85;">
                  Sent by ${safeName} on behalf of EcoStruct Dynamics Limited.
                </span>
                <span style="display:block; margin-top:4px; font-size:12px; color:#767D85;">
                  Hilltop Plaza, Kwashibu Road, Mwembe Tayari, Mombasa, Kenya
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
