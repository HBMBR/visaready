-- Rows created by code that doesn't set a referral code (e.g. production still
-- on the previous release while this schema is live) get one automatically,
-- instead of failing the NOT NULL constraint.
ALTER TABLE "Signup" ALTER COLUMN "referralCode" SET DEFAULT upper(substr(md5((random())::text || (clock_timestamp())::text), 1, 10));
