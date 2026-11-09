# VisaReady — Landing Page

Pre-signup landing page for VisaReady, the visa-sponsored job platform.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS** for styling
- **PostgreSQL** + **Prisma ORM** for persistence
- **Nodemailer** for email (any SMTP provider)

## Quick Start

```bash
# 1. Install
npm install                        # postinstall runs `prisma generate`

# 2. Configure
cp .env.local.example .env.local   # fill in DATABASE_URL + SMTP creds

# 3. Migrate database
npm run db:migrate -- --name init  # creates schema in your Postgres

# 4. Run
npm run dev                        # http://localhost:3000
```

## Environment Variables

See `.env.local.example`. Required:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `NEXT_PUBLIC_SITE_URL` | Public origin used in email links (e.g. `https://visaready.co`). **Required in production** — email links are never built from request headers. |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `SMTP_FROM` | SMTP creds |
| `SIGNUP_TOKEN_SECRET` | 32+ random chars (`openssl rand -base64 48`). Encrypts the pending-signup details carried in the confirmation link. Rotating it invalidates every unclicked link. |

## Signup & Email Confirmation

Signup is free — there is no deposit. **Nothing is written to the database until the user clicks the
confirmation link.** Until then, the submitted details travel only inside that link, sealed with
AES-256-GCM (`lib/signup-token.ts`): encrypted, tamper-proof, and expiring after 48 hours.

### Migrating from the old paid flow

The schema dropped the Paystack and token columns and made `verifiedAt` required. Before running
`npm run db:migrate -- --name remove_deposit`, decide what to do with existing rows where
`"verifiedAt" IS NULL` (people who started — and possibly **paid** for — the old flow but never
verified). Export them first, especially any with `"paidAt"` set, since those columns are dropped.

## Database Hosting Options

- **Neon** (recommended for Vercel) — free 0.5 GB tier, auto-pauses
- **Supabase** — free 500 MB tier
- **Vercel Postgres** — Neon under the hood, one-click from Vercel dashboard
- **Railway** / **Render** — pay-as-you-go
- Self-hosted Postgres works fine too

## SMTP Setup

Works with any provider. After setting `SMTP_*` env vars, add DNS records for `visaready.co` at your registrar so emails don't go to spam:

- **SPF**: `TXT @ "v=spf1 include:_spf.yourprovider.com ~all"`
- **DKIM**: provider gives you the key
- **DMARC**: `TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:postmaster@visaready.co"`

## Project Structure

```
app/
├── page.tsx, learn-more/          # landing + about
├── faq/ blog/ disclaimer/ privacy/ terms/   # text pages (ContentPage layout)
├── verified/                      # "You're in!" (share links, ad sign-up event)
├── member/ member/login/          # member page (status + referral link), email-link sign-in
├── unsubscribe/                   # confirm-unsubscribe page
├── admin/                         # staff dashboard
└── api/
    ├── signup/      # POST — validate, email sealed confirmation link (no DB write)
    ├── verify/      # GET  — create row, referral, welcome email, sign member in
    ├── member/      # login (POST), callback (GET), logout (POST)
    ├── unsubscribe/ # POST — form or RFC 8058 one-click
    ├── admin/       # staff login/callback/logout/export
    └── health/      # setup checks
components/  Nav, Hero, ProcessStrip, HowItWorks, IndustryCards, SignupForm, Footer,
             ShareLinks, CookieConsent, SignupConversion, CardPage, ContentPage
lib/
├── destinations.ts   # destination dropdown + "the UK, Europe, …" phrase
├── referral.ts       # codes, links, self-referral rule, reward wording
├── pixels.ts         # Meta/TikTok pixels, consent-gated
├── signed-token.ts   # HMAC tokens (staff, member, unsubscribe)
├── member-auth.ts, admin-auth.ts, signup-token.ts, email.ts, email-templates/
prisma/  schema.prisma, migrations/
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run db:migrate` | Create / apply DB migrations |
| `npm run db:studio` | Visual DB browser at localhost:5555 |
| `bash scripts/security-check.sh` | Audit deps for known compromises |

## End-to-End Flow

1. User fills form → `POST /api/signup` validates → seals the details into an encrypted token → SMTP sends the confirmation link. **No database write.**
2. User clicks link → `GET /api/verify?token=...` → decrypts + checks expiry → serializable transaction with retry creates the `Signup` row, assigns the next founder number (sign-up order, no cap, staff-only) and a referral code, and records the referrer → welcome email (from "Darian from VisaReady") → signs the member in → `/verified`
3. `/verified` shows the referral link with WhatsApp/Facebook/X/Copy buttons and fires the ad "sign-up" event (`CompleteRegistration`) once, for new confirmations only.

Re-submitting an email that's already on the list sends nothing and shows "You're already on the VisaReady list" with a Sign In button (emails are compared lower-cased; the column is UNIQUE). Clicking a link twice is idempotent. `/api/signup` has a best-effort in-memory throttle (10/hour per IP, 3/hour per email); put a shared rate limiter in front of it for multi-instance deployments.

## Referrals, members and unsubscribe

- Every member gets a link `https://<site>/?ref=CODE`. The code is remembered for the visit and sent with the signup.
- A referral is **recorded** whenever the code is valid, but only **counted** if it doesn't look like a self-referral: not the same phone number as the referrer, and not confirmed from the referrer's IP within 24 hours of the referrer joining (`lib/referral.ts`). Staff see uncounted ones tagged "not counted".
- Members sign in at `/member/login` with an emailed link (30 min); the session lasts 30 days.
- The welcome email has an unsubscribe link and `List-Unsubscribe` headers. Unsubscribed members are tagged in the dashboard and left out of "Copy emails".

## Ad tracking

Set `NEXT_PUBLIC_META_PIXEL_ID` and/or `NEXT_PUBLIC_TIKTOK_PIXEL_ID` in Vercel and redeploy. A cookie banner then asks visitors; the pixels load only after "Accept". With neither set, nothing loads and no banner shows.

## Staff Dashboard (`/admin`)

For Marketing and Support. It shows signup totals, signups per day, breakdowns by nationality and role, and a searchable, filterable list with email, call and WhatsApp links. It also has a CSV export of the current filter.

- **Access:** set `ADMIN_EMAILS` to a comma-separated list of staff addresses. Staff go to `/admin`, enter their email, and get a sign-in link valid for 15 minutes. A session lasts 12 hours. Removing an address from `ADMIN_EMAILS` revokes access on that person's next page load. No passwords are stored.
- Requires working SMTP (sign-in links are emailed) and `SIGNUP_TOKEN_SECRET`, which also signs staff sessions; rotating it signs everyone out.
- Sign-ins and CSV exports are logged with the staff email (Vercel → Logs).
- The page is `noindex` and every request re-checks the session.

## Testing

- **Health check:** open `/api/health` on any deployment (or `localhost:3000/api/health`). It reports pass/fail for the database (connected + table migrated), `SIGNUP_TOKEN_SECRET`, SMTP login, and where email links will point. No setting values are shown; details are in the server logs.
- **Locally without SMTP:** leave `SMTP_*` empty and the confirmation email (with its link) is printed to the `npm run dev` terminal instead of sent.
- **Migrations:** Vercel runs `npm run vercel-build`, which applies pending migrations (`prisma migrate deploy`) before building. After changing `schema.prisma`, run `npm run db:migrate -- --name <change>` locally and commit the new folder in `prisma/migrations/`.

## Deployment (Vercel)

```bash
npm install -g vercel
vercel              # preview deploy
vercel --prod       # production
```

Set the same env vars in Vercel dashboard → Settings → Environment Variables.

For custom domain (visaready.co): Vercel dashboard → Project → Settings → Domains → add domain → follow DNS instructions.

## Brand Palette

| Token | Hex | Use |
|---|---|---|
| `brand-900` | `#1e3a8a` | Primary deep blue |
| `brand-600` | `#2563eb` | Mid-blue gradients |
| `gold-600` | `#d4af37` | Signature gold accent |
| `gold-400` | `#fcd34d` | Highlights |
