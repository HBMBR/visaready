-- CreateTable
CREATE TABLE "Signup" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(60) NOT NULL,
    "lastName" VARCHAR(60) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "nationality" VARCHAR(8) NOT NULL,
    "desiredRole" VARCHAR(80) NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "founderNumber" INTEGER,
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Signup_email_key" ON "Signup"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Signup_founderNumber_key" ON "Signup"("founderNumber");

-- CreateIndex
CREATE INDEX "Signup_verifiedAt_idx" ON "Signup"("verifiedAt");

-- CreateIndex
CREATE INDEX "Signup_createdAt_idx" ON "Signup"("createdAt");

