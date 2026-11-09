-- Destination, optional phone, referrals and unsubscribe.
-- Safe on a table that already has rows: referral codes are backfilled
-- before the column becomes NOT NULL.

ALTER TABLE "Signup" ALTER COLUMN "phone" DROP NOT NULL;

ALTER TABLE "Signup"
  ADD COLUMN "destination" VARCHAR(16),
  ADD COLUMN "referralCode" VARCHAR(16),
  ADD COLUMN "referredById" TEXT,
  ADD COLUMN "referralCounted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "unsubscribedAt" TIMESTAMP(3);

-- Give existing members a code (10 hex chars, upper-cased; unique per row).
UPDATE "Signup"
SET "referralCode" = upper(substr(md5("id" || clock_timestamp()::text || random()::text), 1, 10))
WHERE "referralCode" IS NULL;

ALTER TABLE "Signup" ALTER COLUMN "referralCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Signup_referralCode_key" ON "Signup"("referralCode");

-- CreateIndex
CREATE INDEX "Signup_referredById_idx" ON "Signup"("referredById");

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Signup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
