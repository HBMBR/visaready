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
  /** Overrides the display name of SMTP_FROM (the address stays the same). */
  fromName?: string;
  /** Adds List-Unsubscribe headers (one-click unsubscribe in Gmail/Apple Mail). */
  unsubscribeUrl?: string;
}

const DEFAULT_FROM = "VisaReady <hello@visaready.co>";

/** SMTP_FROM, optionally with a different display name. */
function fromHeader(fromName?: string): string {
  const configured = process.env.SMTP_FROM?.trim() || DEFAULT_FROM;
  if (!fromName) return configured;
  const address = configured.match(/<([^>]+)>/)?.[1] ?? configured;
  return `"${fromName.replace(/["\\]/g, "")}" <${address}>`;
}

export async function sendEmail({ to, subject, html, text, fromName, unsubscribeUrl }: SendEmailInput): Promise<void> {
  const from = fromHeader(fromName);
  const headers: Record<string, string> = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  // Local testing without an SMTP account: print the email (and its links) to
  // the terminal instead of failing. Never used in production / on Vercel.
  const smtpMissing = !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS;
  if (smtpMissing && process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    console.log(`\n[email:dev] SMTP not configured — not sent.\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    headers,
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
