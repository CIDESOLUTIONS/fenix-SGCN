# ====================================
# SCRIPT DE ACTUALIZACIÓN - SISTEMA DE SUSCRIPCIONES
# Fenix-SGCN
# ====================================

Write-Host "🔄 Actualizando sistema con gestión de suscripciones..." -ForegroundColor Cyan
Write-Host ""

# ====================================
Write-Host "📊 PASO 1: Detener contenedores..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

Write-Host ""
Write-Host "✅ Contenedores detenidos" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "🔨 PASO 2: Reconstruir backend..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build fenix_backend fenix_frontend

Write-Host ""
Write-Host "✅ Imágenes reconstruidas" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "🚀 PASO 3: Levantar servicios..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

Write-Host ""
Write-Host "✅ Servicios iniciados" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "⏳ PASO 4: Esperando inicialización..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# ====================================
Write-Host "🗄️ PASO 5: Ejecutar migraciones de Prisma..." -ForegroundColor Yellow
docker exec fenix_backend npx prisma migrate deploy

Write-Host ""
Write-Host "✅ Migraciones aplicadas" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "📝 PASO 6: Estado de servicios..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host ""
Write-Host "✨ ¡Sistema actualizado con gestión de suscripciones!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Funcionalidades Agregadas:" -ForegroundColor Cyan
Write-Host "  ✅ Período de prueba de 30 días automático" -ForegroundColor White
Write-Host "  ✅ Sistema de planes (TRIAL, STANDARD, PROFESSIONAL, PREMIUM, ENTERPRISE)" -ForegroundColor White
Write-Host "  ✅ Período de gracia de 30 días después de vencimiento" -ForegroundColor White
Write-Host "  ✅ Backup automático antes de eliminar" -ForegroundColor White
Write-Host "  ✅ Exportación completa de datos" -ForegroundColor White
Write-Host "  ✅ Tarea CRON diaria (2 AM) para gestión automática" -ForegroundColor White
Write-Host "  ✅ Audit log completo de todas las acciones" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Endpoints Disponibles:" -ForegroundColor Cyan
Write-Host "  GET  /api/tenants/subscription    - Info de suscripción" -ForegroundColor White
Write-Host "  GET  /api/tenants/export          - Exportar datos" -ForegroundColor White
Write-Host "  POST /api/tenants/backup          - Crear backup" -ForegroundColor White
Write-Host "  POST /api/tenants/subscription/update - Actualizar plan" -ForegroundColor White
Write-Host ""
Write-Host "📱 Aplicación:" -ForegroundColor Cyan
Write-Host "  http://localhost" -ForegroundColor Green
Write-Host ""
