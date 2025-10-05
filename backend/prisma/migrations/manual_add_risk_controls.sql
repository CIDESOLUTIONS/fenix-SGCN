-- Migration: Add Risk Control Methodology (ISO 31000)
-- Date: 2025-10-04
-- Description: Adds detailed risk control tables and fields for ISO 31000 methodology

-- 1. Add new columns to risk_assessments table
ALTER TABLE risk_assessments 
ADD COLUMN IF NOT EXISTS risk_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS cause TEXT,
ADD COLUMN IF NOT EXISTS event TEXT,
ADD COLUMN IF NOT EXISTS consequence TEXT,
ADD COLUMN IF NOT EXISTS affected_processes JSONB DEFAULT '[]'::jsonb;

-- 2. Create control type enums
CREATE TYPE control_type AS ENUM ('PREVENTIVE', 'DETECTIVE', 'CORRECTIVE');
CREATE TYPE application_criteria AS ENUM ('ALWAYS', 'RANDOM');
CREATE TYPE documentation_level AS ENUM ('YES', 'PARTIAL', 'NO');
CREATE TYPE effectiveness_level AS ENUM ('EFFECTIVE', 'NEEDS_IMPROVEMENT', 'NOT_EFFECTIVE');
CREATE TYPE automation_level AS ENUM ('AUTOMATIC', 'MANUAL');

-- 3. Create risk_controls table
CREATE TABLE IF NOT EXISTS risk_controls (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  risk_assessment_id VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  control_type control_type NOT NULL,
  application_criteria application_criteria NOT NULL,
  is_documented documentation_level NOT NULL,
  effectiveness effectiveness_level NOT NULL,
  automation automation_level NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  reduction_quadrants INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_risk_controls_risk_assessment
    FOREIGN KEY (risk_assessment_id)
    REFERENCES risk_assessments(id)
    ON DELETE CASCADE
);

-- 4. Create indexes for performance
CREATE INDEX idx_risk_controls_risk_assessment ON risk_controls(risk_assessment_id);
CREATE INDEX idx_risk_assessments_risk_id ON risk_assessments(risk_id);

-- 5. Add comments for documentation
COMMENT ON COLUMN risk_assessments.risk_id IS 'Unique risk identifier (e.g., RC-001)';
COMMENT ON COLUMN risk_assessments.cause IS 'Root cause of the risk';
COMMENT ON COLUMN risk_assessments.event IS 'Potential event that could occur';
COMMENT ON COLUMN risk_assessments.consequence IS 'Consequence if risk materializes';
COMMENT ON COLUMN risk_assessments.affected_processes IS 'JSON array of affected process IDs';

COMMENT ON TABLE risk_controls IS 'Risk controls with ISO 31000 scoring methodology';
COMMENT ON COLUMN risk_controls.score IS 'Calculated score (0-100 points)';
COMMENT ON COLUMN risk_controls.reduction_quadrants IS 'Number of quadrants to reduce (0, 1, or 2)';
