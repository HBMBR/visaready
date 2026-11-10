-- Ad tags (UTM) on each confirmed sign-up, and an anonymous record of every
-- sign-up form sent (for sign-up totals and confirmation rate per ad).
-- Additive only: safe while production still runs older code.

-- AlterTable
ALTER TABLE "Signup" ADD COLUMN     "utmCampaign" VARCHAR(100),
ADD COLUMN     "utmContent" VARCHAR(100),
ADD COLUMN     "utmSource" VARCHAR(100),
ADD COLUMN     "utmTerm" VARCHAR(100);

-- CreateTable
CREATE TABLE "SignupAttempt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailHash" VARCHAR(64) NOT NULL,
    "nationality" VARCHAR(8) NOT NULL,
    "desiredRole" VARCHAR(80) NOT NULL,
    "destination" VARCHAR(16),
    "utmSource" VARCHAR(100),
    "utmCampaign" VARCHAR(100),
    "utmContent" VARCHAR(100),
    "utmTerm" VARCHAR(100),

    CONSTRAINT "SignupAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SignupAttempt_createdAt_idx" ON "SignupAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "SignupAttempt_emailHash_idx" ON "SignupAttempt"("emailHash");

