-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ObjectiveStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED');

-- CreateTable
CREATE TABLE "sgcn_policies" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sgcn_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sgcn_objectives" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "measurementCriteria" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "status" "ObjectiveStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progress" INTEGER DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sgcn_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raci_matrices" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "processOrActivity" TEXT NOT NULL,
    "assignments" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raci_matrices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sgcn_policies" ADD CONSTRAINT "sgcn_policies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sgcn_objectives" ADD CONSTRAINT "sgcn_objectives_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raci_matrices" ADD CONSTRAINT "raci_matrices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "sgcn_policies_tenantId_idx" ON "sgcn_policies"("tenantId");

-- CreateIndex
CREATE INDEX "sgcn_policies_status_idx" ON "sgcn_policies"("status");

-- CreateIndex
CREATE INDEX "sgcn_objectives_tenantId_idx" ON "sgcn_objectives"("tenantId");

-- CreateIndex
CREATE INDEX "sgcn_objectives_status_idx" ON "sgcn_objectives"("status");

-- CreateIndex
CREATE INDEX "sgcn_objectives_owner_idx" ON "sgcn_objectives"("owner");

-- CreateIndex
CREATE INDEX "raci_matrices_tenantId_idx" ON "raci_matrices"("tenantId");
