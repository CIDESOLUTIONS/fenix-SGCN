-- Manual migration to add aiApiKey column with proper casing
ALTER TABLE tenants DROP COLUMN IF EXISTS aiapikey;
ALTER TABLE tenants ADD COLUMN "aiApiKey" TEXT;
