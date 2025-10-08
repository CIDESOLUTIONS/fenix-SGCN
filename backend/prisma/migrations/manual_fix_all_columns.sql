-- Manual migration to fix all missing columns

-- Fix users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'es';
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'COP';
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light';

-- Verify all tables exist
CREATE TABLE IF NOT EXISTS business_contexts (
    id TEXT PRIMARY KEY,
    "tenantId" TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "elaborationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS swot_analyses (
    id TEXT PRIMARY KEY,
    "tenantId" TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    "contextId" TEXT NOT NULL REFERENCES business_contexts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    strengths JSONB NOT NULL,
    weaknesses JSONB NOT NULL,
    opportunities JSONB NOT NULL,
    threats JSONB NOT NULL,
    strategies JSONB,
    "crossingAnalysis" TEXT,
    participants TEXT[],
    facilitator TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_configs (
    id TEXT PRIMARY KEY,
    "tenantId" TEXT NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    "openaiApiKey" TEXT,
    "claudeApiKey" TEXT,
    "geminiApiKey" TEXT,
    "defaultProvider" TEXT NOT NULL DEFAULT 'openai',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
