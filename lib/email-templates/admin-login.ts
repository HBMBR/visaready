import { BRAND, STYLES, emailShell, ctaButton, heading, paragraph, mutedParagraph } from "./_shared";

export function adminLoginEmail({ loginUrl }: { loginUrl: string }) {
  const text = `Sign in to the VisaReady staff dashboard:

${loginUrl}

This link expires in 15 minutes. If you didn't request it, ignore this email — nobody can sign in without it.

— VisaReady
`;

  const body = `
    ${heading("Staff sign-in")}
    ${paragraph("Click below to open the VisaReady signups dashboard.")}
    ${ctaButton(loginUrl, "Sign In")}
    <p style="margin:24px 0 0;font-family:${STYLES.BODY_FONT};font-size:12.5px;color:${BRAND.inkMute};line-height:1.6;">
      Or paste this link into your browser:<br>
      <a href="${loginUrl}" style="color:${BRAND.blue};word-break:break-all;">${loginUrl}</a>
    </p>
    ${mutedParagraph("This link expires in <strong>15 minutes</strong>. If you didn't request it, ignore this email — nobody can sign in without it.")}
  `;

  return { subject: "Your VisaReady staff sign-in link", html: emailShell(body), text };
}
