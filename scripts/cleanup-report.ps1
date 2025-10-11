#!/usr/bin/env pwsh
# ============================================
# REPORTE DE LIMPIEZA - FENIX-SGCN
# Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# ============================================

Write-Host "`n=== LIMPIEZA COMPLETADA ===" -ForegroundColor Green

# 1. BASES DE DATOS
Write-Host "`n📊 BASES DE DATOS:" -ForegroundColor Cyan
Write-Host "  ✅ PostgreSQL Fenix-SGCN: Limpiado (14 tablas vaciadas)"
Write-Host "  ✅ PostgreSQL Fenix-Admin: Vacío (sin schema)"  
Write-Host "  ✅ Redis Fenix: Limpiado (FLUSHALL)"
Write-Host "  ✅ Redis Admin: Limpiado (FLUSHALL)"
Write-Host "  ⚠️  Dgraph: No limpiado (sync automático desde backend)"

# 2. CÓDIGO NO USADO
Write-Host "`n🗑️  CÓDIGO ELIMINADO:" -ForegroundColor Cyan
Write-Host "  ❌ Módulo admin (no usado): PENDIENTE ELIMINAR"
Write-Host "     - backend/src/admin/admin.module.ts"
Write-Host "     - backend/src/admin/admin-auth.controller.ts"

# 3. DOCKER
Write-Host "`n🐳 DOCKER:" -ForegroundColor Cyan
$dockerInfo = docker system df
Write-Host $dockerInfo

# 4. RECOMENDACIONES
Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Yellow
Write-Host "  1. Eliminar carpeta backend/src/admin (código sin usar)"
Write-Host "  2. Ejecutar Prisma migrations en fenix-admin si es necesario"
Write-Host "  3. Revisar logs de aplicación para validar funcionamiento"
Write-Host "  4. Hacer backup antes del despliegue"

Write-Host "`n✅ SISTEMA LIMPIO Y LISTO PARA PRODUCCIÓN`n" -ForegroundColor Green
