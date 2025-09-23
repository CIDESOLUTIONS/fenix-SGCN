-- AlterTable
ALTER TABLE "tenants" ADD COLUMN "subscriptionPlan" TEXT NOT NULL DEFAULT 'TRIAL',
ADD COLUMN "subscriptionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "trialEndsAt" TIMESTAMP(3),
ADD COLUMN "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN "gracePeriodEndsAt" TIMESTAMP(3),
ADD COLUMN "lastBackupAt" TIMESTAMP(3),
ADD COLUMN "backupUrl" TEXT,
ADD COLUMN "scheduledDeletionAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
