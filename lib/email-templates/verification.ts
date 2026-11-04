import { BRAND, STYLES, emailShell, ctaButton, heading, paragraph, mutedParagraph, escapeHtml } from "./_shared";

interface VerificationEmailProps {
  firstName: string;
  verifyUrl: string;
}

export function verificationEmail({ firstName, verifyUrl }: VerificationEmailProps) {
  const safeName = escapeHtml(firstName);

  const text = `Hi ${firstName},

Thanks for signing up to VisaReady. One quick step to claim your founding seat (50% off for life): confirm your email by clicking the link below. We don't save your details until you do.

${verifyUrl}

This link expires in 48 hours. If you didn't sign up to VisaReady, you can safely ignore this email.

— The VisaReady Team
https://visaready.co
`;

  const body = `
    ${heading("One quick step,", safeName)}
    ${paragraph(`Thanks for signing up. To claim your <strong style="color:${BRAND.blue};">founding seat (50% off for life)</strong>, please confirm that this email is yours. We don't save your details until you do.`)}
    ${ctaButton(verifyUrl, "Confirm My Email")}
    <p style="margin:24px 0 0;font-family:${STYLES.BODY_FONT};font-size:12.5px;color:${BRAND.inkMute};line-height:1.6;">
      Or paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color:${BRAND.blue};word-break:break-all;">${verifyUrl}</a>
    </p>
    ${mutedParagraph(`This link expires in <strong>48 hours</strong>. If you didn't sign up to VisaReady, you can safely ignore this email.`)}
  `;

  return {
    subject: "Confirm your email to claim your VisaReady spot",
    html: emailShell(body),
    text,
  };
}
