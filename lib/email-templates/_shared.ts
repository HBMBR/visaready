// Shared email branding — keeps both templates in sync with the site.

import { getSiteUrl } from "@/lib/site";

export const EMAIL_DISCLAIMER =
  "VisaReady is not a recruitment agency or government body and does not guarantee a job or visa.";

/** Plain-text footer, matching the HTML one. */
export function textFooter(unsubscribeUrl?: string): string {
  const lines = [
    `${getSiteUrl().replace(/^https?:\/\//, "")} | support@visaready.co`,
    EMAIL_DISCLAIMER,
  ];
  if (unsubscribeUrl) lines.push(`Unsubscribe: ${unsubscribeUrl}`);
  return `\n--\n${lines.join("\n")}\n`;
}

export const BRAND = {
  blue: "#1e3a8a",
  blueDeep: "#16306f",
  gold: "#d4af37",
  goldSoft: "#ecc676",
  goldFaint: "#fef3c7",
  ink: "#0b1638",
  inkMute: "#5b6885",
  paper: "#ffffff",
  bg: "#f5f6fa",
  rule: "rgba(11, 22, 56, 0.10)",
};

// Bitter (display) + Inter (body). Most email clients fall back to serif/sans,
// but Apple Mail, Outlook for Mac, and modern Gmail web render the Google fonts.
const FONT_LINK = `<link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const DISPLAY_FONT = `'Bitter', 'Roboto Slab', Georgia, serif`;
const BODY_FONT = `'Inter', -apple-system, 'Segoe UI', Arial, sans-serif`;

/** HTML email shell with VisaReady header. Pass unsubscribeUrl on marketing/welcome mail. */
export function emailShell(body: string, opts: { unsubscribeUrl?: string } = {}): string {
  const site = getSiteUrl();
  const siteLabel = site.replace(/^https?:\/\//, "");
  const unsubscribe = opts.unsubscribeUrl
    ? `<p style="margin:6px 0;"><a href="${opts.unsubscribeUrl}" style="color:${BRAND.inkMute};text-decoration:underline;">Unsubscribe</a> from VisaReady emails</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VisaReady</title>
${FONT_LINK}
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:${BODY_FONT};color:${BRAND.ink};line-height:1.6;-webkit-font-smoothing:antialiased;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">

  <!-- Header card -->
  <div style="background:linear-gradient(135deg,${BRAND.blue} 0%,#2563eb 60%,${BRAND.blueDeep} 100%);padding:36px 30px;text-align:center;border-radius:14px 14px 0 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="vertical-align:middle;padding-right:12px;">
          <!-- V mark -->
          <div style="width:42px;height:42px;border-radius:50%;background:${BRAND.gold};color:${BRAND.ink};display:inline-block;line-height:42px;font-family:${DISPLAY_FONT};font-weight:700;font-style:italic;font-size:21px;text-align:center;">V</div>
        </td>
        <td style="vertical-align:middle;">
          <span style="font-family:${DISPLAY_FONT};font-weight:700;font-size:24px;letter-spacing:-0.02em;color:${BRAND.paper};">Visa<em style="font-style:italic;color:${BRAND.goldSoft};font-weight:600;">Ready</em></span>
        </td>
      </tr>
    </table>
    <p style="margin:14px 0 0;font-family:${BODY_FONT};color:rgba(251,247,237,0.78);font-size:13px;letter-spacing:0.01em;">Your talent. Their visa. Your future.</p>
  </div>

  <!-- Body card -->
  <div style="background:${BRAND.paper};padding:40px 32px;border:1px solid ${BRAND.rule};border-top:none;border-radius:0 0 14px 14px;">
    ${body}
  </div>

  <!-- Footer -->
  <div style="text-align:center;margin-top:24px;padding:0 16px;font-family:${BODY_FONT};font-size:12px;color:${BRAND.inkMute};line-height:1.6;">
    <p style="margin:6px 0;">
      <a href="${site}" style="color:${BRAND.blue};text-decoration:none;font-weight:600;">${siteLabel}</a>
      &nbsp;·&nbsp;
      <a href="mailto:support@visaready.co" style="color:${BRAND.blue};text-decoration:none;font-weight:600;">support@visaready.co</a>
    </p>
    <p style="margin:6px 0;">${EMAIL_DISCLAIMER}</p>
    ${unsubscribe}
    <p style="margin:6px 0;">© ${new Date().getFullYear()} VisaReady</p>
  </div>

</div>
</body>
</html>`;
}

/** Inline pill-style CTA button (deep blue bg, gold text — mirrors site .btn-fill flipped) */
export function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto;">
  <tr>
    <td style="border-radius:99px;background:${BRAND.ink};">
      <a href="${href}" style="display:inline-block;padding:15px 36px;font-family:${BODY_FONT};font-weight:700;font-size:15px;color:${BRAND.gold};text-decoration:none;border-radius:99px;letter-spacing:0.01em;">
        ${label} →
      </a>
    </td>
  </tr>
</table>`;
}

/** Heading style — Bitter serif with italic gold accent */
export function heading(text: string, accent?: string): string {
  const accentHtml = accent
    ? ` <em style="font-style:italic;color:${BRAND.blue};font-weight:600;">${accent}</em>`
    : "";
  return `<h1 style="margin:0 0 14px;font-family:${DISPLAY_FONT};font-weight:700;font-size:30px;line-height:1.15;letter-spacing:-0.025em;color:${BRAND.ink};">${text}${accentHtml}</h1>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-family:${BODY_FONT};font-size:15px;line-height:1.65;color:${BRAND.ink};">${text}</p>`;
}

export function mutedParagraph(text: string): string {
  return `<p style="margin:18px 0 0;font-family:${BODY_FONT};font-size:13px;line-height:1.55;color:${BRAND.inkMute};">${text}</p>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const STYLES = { DISPLAY_FONT, BODY_FONT };
