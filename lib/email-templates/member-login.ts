import { BRAND, STYLES, emailShell, ctaButton, heading, paragraph, mutedParagraph, escapeHtml, textFooter } from "./_shared";

export function memberLoginEmail({ firstName, loginUrl }: { firstName: string; loginUrl: string }) {
  const text = `Hi ${firstName},

Here's your link to sign in to VisaReady and see your founding member status and referral link:

${loginUrl}

This link expires in 30 minutes. If you didn't ask for it, you can ignore this email.

— The VisaReady Team
${textFooter()}`;

  const body = `
    ${heading("Sign in,", escapeHtml(firstName))}
    ${paragraph("Click below to see your founding member status and your referral link.")}
    ${ctaButton(loginUrl, "Sign In")}
    <p style="margin:24px 0 0;font-family:${STYLES.BODY_FONT};font-size:12.5px;color:${BRAND.inkMute};line-height:1.6;">
      Or paste this link into your browser:<br>
      <a href="${loginUrl}" style="color:${BRAND.blue};word-break:break-all;">${loginUrl}</a>
    </p>
    ${mutedParagraph("This link expires in <strong>30 minutes</strong>. If you didn't ask for it, you can ignore this email.")}
  `;

  return { subject: "Your VisaReady sign-in link", html: emailShell(body), text };
}
