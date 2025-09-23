-- Agregar columna domain si no existe
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS domain TEXT;

-- Crear unique constraint en domain
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tenants_domain_key') THEN
        ALTER TABLE tenants ADD CONSTRAINT tenants_domain_key UNIQUE (domain);
    END IF;
END $$;

-- Actualizar tenants sin domain
UPDATE tenants SET domain = name || '.fenix-sgcn.com' WHERE domain IS NULL;

-- Agregar columnas de usuario
ALTER TABLE users ADD COLUMN IF NOT EXISTS "fullName" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Crear tipos ENUM si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubscriptionPlan') THEN
        CREATE TYPE "SubscriptionPlan" AS ENUM ('TRIAL', 'STANDARD', 'PROFESSIONAL', 'PREMIUM', 'ENTERPRISE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SubscriptionStatus') THEN
        CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED', 'DELETED');
    END IF;
END $$;

-- Agregar columnas de suscripción
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "subscriptionPlan" "SubscriptionPlan" DEFAULT 'TRIAL';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "subscriptionStatus" "SubscriptionStatus" DEFAULT 'ACTIVE';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "subscriptionEndsAt" TIMESTAMP(3);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "gracePeriodEndsAt" TIMESTAMP(3);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "lastBackupAt" TIMESTAMP(3);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "backupUrl" TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "scheduledDeletionAt" TIMESTAMP(3);

-- Actualizar valores por defecto para tenants existentes
UPDATE tenants SET "subscriptionPlan" = 'TRIAL' WHERE "subscriptionPlan" IS NULL;
UPDATE tenants SET "subscriptionStatus" = 'ACTIVE' WHERE "subscriptionStatus" IS NULL;

-- Crear tabla audit_logs si no existe
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    "entityId" TEXT,
    details JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

-- Agregar foreign key de audit_logs a tenants si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_tenantId_fkey') THEN
        ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_tenantId_fkey 
            FOREIGN KEY ("tenantId") REFERENCES tenants(id) ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Actualizar el ENUM UserRole si necesita AUDITOR
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'AUDITOR' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')) THEN
        ALTER TYPE "UserRole" ADD VALUE 'AUDITOR';
    END IF;
END $$;
