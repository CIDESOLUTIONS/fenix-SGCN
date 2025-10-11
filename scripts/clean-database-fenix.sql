-- ============================================
-- LIMPIEZA DE DATOS DE PRUEBA - FENIX-SGCN
-- Mantiene estructura, elimina solo datos
-- ============================================

-- Deshabilitar triggers temporalmente
SET session_replication_role = replica;

-- ORDEN IMPORTANTE: Eliminar primero tablas con foreign keys

-- 1. Tablas dependientes (sin FK hacia ellas)
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE documents CASCADE;

-- 2. Módulo 7: Mejora Continua
TRUNCATE TABLE corrective_actions CASCADE;
TRUNCATE TABLE findings CASCADE;

-- 3. Módulo 6: Pruebas
TRUNCATE TABLE exercises CASCADE;
TRUNCATE TABLE test_exercises CASCADE;

-- 4. Módulo 5: Planes
TRUNCATE TABLE continuity_plans CASCADE;

-- 5. Módulo 4: Estrategias
TRUNCATE TABLE continuity_strategies CASCADE;

-- 6. Módulo 3: BIA
TRUNCATE TABLE bia_assessments CASCADE;

-- 7. Módulo 2: Riesgos
TRUNCATE TABLE risk_assessments CASCADE;

-- 8. Módulo 1: Planeación
TRUNCATE TABLE raci_matrices CASCADE;
TRUNCATE TABLE sgcn_objectives CASCADE;
TRUNCATE TABLE sgcn_policies CASCADE;

-- 9. Base: Procesos y Compliance
TRUNCATE TABLE business_processes CASCADE;
TRUNCATE TABLE compliance_frameworks CASCADE;

-- 10. Usuarios (mantener solo usuarios del sistema si existen)
-- NO truncar 'tenants' para mantener configuración multi-tenant
DELETE FROM users WHERE email NOT LIKE '%@fenix-system.internal';

-- Rehabilitar triggers
SET session_replication_role = DEFAULT;

-- Resetear sequences
ALTER SEQUENCE IF EXISTS audit_logs_id_seq RESTART WITH 1;

-- Verificación
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename) as columns
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename NOT LIKE '_prisma%'
ORDER BY tablename;
