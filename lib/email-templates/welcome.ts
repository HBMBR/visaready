import { BRAND, STYLES, emailShell, ctaButton, heading, paragraph, escapeHtml, textFooter } from "./_shared";
import { DESTINATIONS_PHRASE } from "@/lib/destinations";
import { REFERRAL_REWARD } from "@/lib/referral";
import { getSiteUrl } from "@/lib/site";

interface WelcomeEmailProps {
  firstName: string;
  referralLink: string;
  memberUrl: string;
  unsubscribeUrl: string;
}

// Copy from "VisaReady Landing Page — Edits for Han" (Nov 2026).

const BENEFITS: [string, string][] = [
  ["Early access", "in before the public launch"],
  ["50% off for life", "your founding rate, for as long as you stay a member"],
  ["30-day free trial", "full access when we launch"],
  ["Jobs from employers that sponsor visas", `in ${DESTINATIONS_PHRASE}`],
];

export function welcomeEmail({ firstName, referralLink, memberUrl, unsubscribeUrl }: WelcomeEmailProps) {
  const safeName = escapeHtml(firstName);
  const safeLink = escapeHtml(referralLink);
  const faqUrl = `${getSiteUrl()}/faq`;

  const text = `Welcome, ${firstName}.

Thanks for joining. You're now a VisaReady founding member, and your 50% discount is locked in for life.

FOUNDING MEMBER · 50% off for life

What you get
${BENEFITS.map(([t, d]) => `- ${t}: ${d}`).join("\n")}

What happens next
We're building VisaReady now. We'll email you before launch with your early-access link.

In the meantime, share VisaReady with friends who are looking for work abroad. ${REFERRAL_REWARD}

Your personal link: ${referralLink}
Share it from your member page: ${memberUrl}

Questions? Read our FAQ: ${faqUrl}

Speak soon,
Darian
Founder, VisaReady
${textFooter(unsubscribeUrl)}`;

  const body = `
    ${heading("Welcome,", `${safeName}.`)}
    ${paragraph(`Thanks for joining. You're now a VisaReady founding member, and your <strong style="color:${BRAND.blue};">50% discount is locked in for life</strong>.`)}

    <!-- Founding member card -->
    <div style="background:linear-gradient(135deg,#fef3c7 0%,${BRAND.goldSoft} 100%);border:1px solid rgba(200,154,60,0.4);border-radius:14px;padding:22px 24px;margin:26px 0;text-align:center;">
      <p style="margin:0 0 6px;font-family:${STYLES.BODY_FONT};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.blueDeep};">Founding Member</p>
      <p style="margin:0;font-family:${STYLES.DISPLAY_FONT};font-weight:700;font-style:italic;font-size:28px;line-height:1.15;letter-spacing:-0.02em;color:${BRAND.ink};">50% off for life</p>
    </div>

    <h2 style="margin:32px 0 14px;font-family:${STYLES.DISPLAY_FONT};font-weight:700;font-size:21px;letter-spacing:-0.02em;color:${BRAND.ink};">What you get</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-family:${STYLES.BODY_FONT};">
      ${BENEFITS.map(([t, d]) => benefitRow(t, d)).join("\n")}
    </table>

    <h2 style="margin:32px 0 14px;font-family:${STYLES.DISPLAY_FONT};font-weight:700;font-size:21px;letter-spacing:-0.02em;color:${BRAND.ink};">What happens next</h2>
    ${paragraph("We're building VisaReady now. We'll email you before launch with your early-access link.")}
    ${paragraph(`In the meantime, share VisaReady with friends who are looking for work abroad. ${REFERRAL_REWARD}`)}

    <p style="margin:18px 0 0;font-family:${STYLES.BODY_FONT};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.inkMute};">Your personal link</p>
    <p style="margin:6px 0 0;padding:12px 14px;background:${BRAND.bg};border:1px solid ${BRAND.rule};border-radius:10px;font-family:${STYLES.BODY_FONT};font-size:14px;word-break:break-all;">
      <a href="${safeLink}" style="color:${BRAND.blue};text-decoration:none;font-weight:600;">${safeLink}</a>
    </p>

    ${ctaButton(memberUrl, "Share my link")}

    ${paragraph(`Questions? Read our <a href="${escapeHtml(faqUrl)}" style="color:${BRAND.blue};font-weight:600;">FAQ</a>.`)}

    <p style="margin:32px 0 0;font-family:${STYLES.BODY_FONT};font-size:14px;color:${BRAND.ink};line-height:1.6;">Speak soon,</p>
    <p style="margin:6px 0 0;font-family:${STYLES.BODY_FONT};font-size:14px;color:${BRAND.ink};line-height:1.5;">
      Darian<br><span style="color:${BRAND.inkMute};">Founder, VisaReady</span>
    </p>
  `;

  return {
    subject: `Welcome to VisaReady, ${firstName} — you're a founding member`,
    html: emailShell(body, { unsubscribeUrl }),
    text,
  };
}

function benefitRow(title: string, desc: string): string {
  return `<tr>
    <td style="padding:8px 0;vertical-align:top;width:24px;">
      <div style="width:18px;height:18px;border-radius:50%;background:${BRAND.gold};text-align:center;line-height:18px;">
        <span style="color:${BRAND.ink};font-size:11px;font-weight:700;">✓</span>
      </div>
    </td>
    <td style="padding:8px 0 8px 10px;vertical-align:top;font-size:14px;line-height:1.55;color:${BRAND.ink};">
      <strong style="color:${BRAND.blue};">${title}</strong> — <span style="color:${BRAND.inkMute};">${desc}</span>
    </td>
  </tr>`;
}
