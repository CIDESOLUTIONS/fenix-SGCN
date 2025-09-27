# Crear base de datos de pruebas
Write-Host "Creando BD de tests..."
docker exec fenix_db_master psql -U meciza64 -d postgres -c "DROP DATABASE IF EXISTS fenix_sgcn_test;"
docker exec fenix_db_master psql -U meciza64 -d postgres -c "CREATE DATABASE fenix_sgcn_test;"

# Configurar DATABASE_URL para tests
$env:DATABASE_URL = "postgresql://meciza64:sgcn2025@localhost:5432/fenix_sgcn_test?schema=public"
$env:NODE_ENV = "test"

Write-Host "Ejecutando migraciones Prisma..."
cd backend
npx prisma migrate deploy

Write-Host "Ejecutando tests E2E..."
npm run test:e2e
