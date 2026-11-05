#!/usr/bin/env bash
# Vercel runs `npm run vercel-build` instead of `npm run build` when it exists.
# Applies any pending Prisma migrations, then builds. Local `npm run build` is unaffected.
set -euo pipefail

# Migrations need a direct (non-pooled) connection on Neon / Vercel Postgres.
# Use the unpooled URL when the integration provides one.
MIGRATE_URL="${DATABASE_URL_UNPOOLED:-${POSTGRES_URL_NON_POOLING:-${DATABASE_URL:-}}}"

if [ -z "$MIGRATE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set for this Vercel environment ($VERCEL_ENV)." >&2
  echo "Add it under Project → Settings → Environment Variables." >&2
  exit 1
fi

echo "Applying database migrations ($VERCEL_ENV)…"
DATABASE_URL="$MIGRATE_URL" npx prisma migrate deploy

npx next build
