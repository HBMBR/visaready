import nodemailer, { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local"
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    // Port 465 = implicit TLS; everything else uses STARTTLS
    secure: port === 465,
    auth: { user, pass },
    // Reasonable timeouts so a hung SMTP doesn't hang a serverless function
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return cachedTransporter;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const from = process.env.SMTP_FROM ?? "VisaReady <noreply@visaready.co>";

  // Local testing without an SMTP account: print the email (and its links) to
  // the terminal instead of failing. Never used in production / on Vercel.
  const smtpMissing = !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS;
  if (smtpMissing && process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    console.log(`\n[email:dev] SMTP not configured — not sent.\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

/** Verify SMTP credentials work — call from a healthcheck or admin route */
export async function verifyTransport(): Promise<boolean> {
  try {
    await getTransporter().verify();
    return true;
  } catch (err) {
    console.error("[email] SMTP verify failed:", err);
    return false;
  }
}
