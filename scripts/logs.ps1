# ====================================
# SCRIPT DE LOGS - Fenix-SGCN
# ====================================

param(
    [string]$Service = "all"
)

$ErrorActionPreference = "Stop"

Write-Host "📝 Mostrando logs de Fenix-SGCN..." -ForegroundColor Cyan
Write-Host ""

if ($Service -eq "all") {
    Write-Host "Mostrando logs de TODOS los servicios..." -ForegroundColor Yellow
    Write-Host "Presiona Ctrl+C para salir" -ForegroundColor Gray
    Write-Host ""
    docker-compose -f docker-compose.prod.yml logs -f
}
elseif ($Service -eq "frontend") {
    Write-Host "Mostrando logs del FRONTEND..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml logs -f fenix_frontend
}
elseif ($Service -eq "backend") {
    Write-Host "Mostrando logs del BACKEND..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml logs -f fenix_backend
}
elseif ($Service -eq "db") {
    Write-Host "Mostrando logs de la BASE DE DATOS..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml logs -f fenix_db_master
}
elseif ($Service -eq "proxy") {
    Write-Host "Mostrando logs del PROXY (NGINX)..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml logs -f fenix_proxy
}
else {
    Write-Host "❌ Servicio no válido: $Service" -ForegroundColor Red
    Write-Host ""
    Write-Host "Servicios disponibles:" -ForegroundColor Yellow
    Write-Host "  all       - Todos los servicios" -ForegroundColor White
    Write-Host "  frontend  - Frontend (Next.js)" -ForegroundColor White
    Write-Host "  backend   - Backend (NestJS)" -ForegroundColor White
    Write-Host "  db        - Base de datos (PostgreSQL)" -ForegroundColor White
    Write-Host "  proxy     - Proxy (NGINX)" -ForegroundColor White
    Write-Host ""
    Write-Host "Ejemplo: .\logs.ps1 -Service backend" -ForegroundColor Gray
}
