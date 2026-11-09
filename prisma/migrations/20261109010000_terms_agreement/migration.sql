-- Record agreement to the Terms, Privacy Policy and Disclaimer: when the
-- sign-up form was sent with the box ticked, and which version (lib/legal.ts).
-- Nullable: people who joined before the box existed have no record.
ALTER TABLE "Signup" ADD COLUMN     "termsAgreedAt" TIMESTAMP(3),
ADD COLUMN     "termsVersion" VARCHAR(32);
