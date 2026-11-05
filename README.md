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
visaready/
├── app/
│   ├── api/
│   │   ├── signup/route.ts     # POST — validate, email sealed confirmation link (no DB write)
│   │   ├── verify/route.ts     # GET  — open link, create row, assign founder #, send welcome
│   │   └── spots/route.ts      # GET  — verified spots count for the banner
│   ├── verified/page.tsx       # Landing page after clicking email link
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Hero.tsx
│   ├── Logo.tsx
│   ├── SignupForm.tsx
│   ├── LimitedTimeBanner.tsx
│   └── IndustryTiles.tsx
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── email.ts                # SMTP transporter
│   ├── email-templates/
│   │   ├── verification.ts
│   │   └── welcome.ts
│   ├── countries.ts            # 16 countries + pricing + USD fallback
│   └── signup-token.ts         # Encrypted, expiring pending-signup links
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── security-check.sh
└── package.json
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
2. User clicks link → `GET /api/verify?token=...` → decrypts + checks expiry → serializable transaction with retry creates the `Signup` row and assigns the next founder number (1..1000) → SMTP sends welcome email → redirects to `/verified`
3. `GET /api/spots` returns the count of signups (all stored signups are verified) for the live counter

Re-submitting with an already-registered email returns the same response but sends nothing, so the form can't be used to check who has signed up. Clicking a link twice is idempotent. `/api/signup` has a best-effort in-memory throttle (10/hour per IP, 3/hour per email); put a shared rate limiter in front of it for multi-instance deployments.

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
