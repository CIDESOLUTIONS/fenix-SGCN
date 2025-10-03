-- Script para recrear usuarios de prueba
-- Contraseña para todos: Fenix2025!

-- Crear tenant principal si no existe
INSERT INTO tenants (id, name, "subdomain", status, "createdAt", "updatedAt")
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'CIDE Solutions', 'cide', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear usuarios
INSERT INTO users (id, email, password, "fullName", role, "tenantId", "createdAt", "updatedAt")
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'mcifuentesz@icetex.gov.co',
    '$2b$10$JB81xCAbk1qz2TJAY5sXC.jaxXyo7ubSOpDf1AZHYzgJpaLQdAQcO',
    'Mario Cifuentes',
    'ADMIN',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'vicky.delgado@cidesas.com',
    '$2b$10$JB81xCAbk1qz2TJAY5sXC.jaxXyo7ubSOpDf1AZHYzgJpaLQdAQcO',
    'Vicky Delgado',
    'ADMIN',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'test@example.com',
    '$2b$10$JB81xCAbk1qz2TJAY5sXC.jaxXyo7ubSOpDf1AZHYzgJpaLQdAQcO',
    'Usuario de Prueba',
    'ADMIN',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;

-- Verificar usuarios creados
SELECT email, "fullName", role FROM users;
