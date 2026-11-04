import { BRAND, STYLES, emailShell, ctaButton, heading, paragraph, escapeHtml } from "./_shared";

interface WelcomeEmailProps {
  firstName: string;
  founderNumber: number;
}

export function welcomeEmail({ firstName, founderNumber }: WelcomeEmailProps) {
  const safeName = escapeHtml(firstName);
  const seatPadded = String(founderNumber).padStart(4, "0");

  const text = `Welcome to VisaReady, ${firstName}.

You're founding member #${seatPadded} of 1,000 — your seat is locked in for life.

What you get as a founding member:
- First access to every visa-sponsored job, before anyone else
- Priority placement when employers review candidates
- 50% off for life — your locked-in rate, forever
- Full 30-day free trial when we launch
- Direct line to our visa team as you apply

What happens next:
We're adding 1,000+ verified visa-sponsored jobs across Tech, Finance, Engineering, Healthcare, Sales, Marketing and more. You'll get early-access credentials before public launch — 7 days ahead of everyone else.

Welcome aboard. Your international career starts here.

— The VisaReady Team
https://visaready.co | support@visaready.co
`;

  const body = `
    ${heading("Welcome,", `${safeName}.`)}
    ${paragraph(`<strong style="color:${BRAND.blue};">Your founding seat is locked in for life.</strong> You're part of an exclusive group getting first access to verified visa-sponsored opportunities around the world.`)}

    <!-- Founder seat badge -->
    <div style="background:linear-gradient(135deg,#fef3c7 0%,${BRAND.goldSoft} 100%);border:1px solid rgba(200,154,60,0.4);border-radius:14px;padding:22px 24px;margin:26px 0;text-align:center;">
      <p style="margin:0 0 4px;font-family:${STYLES.BODY_FONT};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.blueDeep};">Founding Member</p>
      <p style="margin:0;font-family:${STYLES.DISPLAY_FONT};font-weight:700;font-style:italic;font-size:42px;line-height:1;letter-spacing:-0.02em;color:${BRAND.ink};">#${seatPadded}</p>
      <p style="margin:6px 0 0;font-family:${STYLES.BODY_FONT};font-size:12px;color:${BRAND.blueDeep};letter-spacing:0.04em;">of 1,000</p>
    </div>

    <!-- Benefits -->
    <h2 style="margin:32px 0 14px;font-family:${STYLES.DISPLAY_FONT};font-weight:700;font-size:21px;letter-spacing:-0.02em;color:${BRAND.ink};">What you get</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-family:${STYLES.BODY_FONT};">
      ${benefitRow("First access", "Every visa-sponsored job, before anyone else sees it")}
      ${benefitRow("Priority placement", "Your profile sits at the top when employers review candidates")}
      ${benefitRow("50% off for life", "Your locked-in rate — forever")}
      ${benefitRow("Free 30-day trial", "Full platform access when we launch")}
      ${benefitRow("Visa team support", "Direct line as you apply")}
    </table>

    <!-- What's next -->
    <h2 style="margin:32px 0 14px;font-family:${STYLES.DISPLAY_FONT};font-weight:700;font-size:21px;letter-spacing:-0.02em;color:${BRAND.ink};">What happens next</h2>
    ${paragraph(`We're adding <strong>1,000+ verified visa-sponsored jobs</strong> across Tech, Finance, Engineering, Healthcare, Sales, Marketing and more. You'll get early-access credentials <strong>7 days before public launch</strong> — and your founding-member rate applies from day one.`)}

    ${ctaButton("https://visaready.co", "Visit VisaReady")}

    <p style="margin:32px 0 0;font-family:${STYLES.BODY_FONT};font-size:14px;color:${BRAND.ink};line-height:1.6;">
      Welcome aboard. Your international career starts here.
    </p>
    <p style="margin:6px 0 0;font-family:${STYLES.BODY_FONT};font-size:14px;color:${BRAND.ink};">
      — The VisaReady Team
    </p>
  `;

  return {
    subject: `Welcome to VisaReady, ${firstName} — you're founding member #${seatPadded}`,
    html: emailShell(body),
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
