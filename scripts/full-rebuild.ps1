# Script de Rebuild Completo - Fenix-SGCN PowerShell
# Elimina TODO el caché y reconstruye desde cero

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "REBUILD COMPLETO FENIX-SGCN" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detener todos los servicios
Write-Host "1. Deteniendo servicios..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml down -v

# 2. Limpiar caché de Docker
Write-Host ""
Write-Host "2. Limpiando caché de Docker..." -ForegroundColor Yellow
docker system prune -af --volumes

# 3. Eliminar imágenes específicas de Fenix
Write-Host ""
Write-Host "3. Eliminando imágenes Fenix anteriores..." -ForegroundColor Yellow
docker rmi fenix-sgcn-fenix_frontend 2>$null
docker rmi fenix-sgcn-fenix_backend 2>$null

# 4. Limpiar node_modules y builds locales
Write-Host ""
Write-Host "4. Limpiando archivos locales de build..." -ForegroundColor Yellow
if (Test-Path "frontend\.next") { Remove-Item -Recurse -Force "frontend\.next" }
if (Test-Path "frontend\node_modules\.cache") { Remove-Item -Recurse -Force "frontend\node_modules\.cache" }
if (Test-Path "backend\dist") { Remove-Item -Recurse -Force "backend\dist" }
if (Test-Path "backend\node_modules\.cache") { Remove-Item -Recurse -Force "backend\node_modules\.cache" }

# 5. Rebuild completo sin caché
Write-Host ""
Write-Host "5. Rebuilding frontend (esto tomará varios minutos)..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml build --no-cache --pull fenix_frontend

Write-Host ""
Write-Host "6. Rebuilding backend..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml build --no-cache --pull fenix_backend

# 6. Iniciar servicios
Write-Host ""
Write-Host "7. Iniciando servicios..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml up -d

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "REBUILD COMPLETADO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Esperando 30 segundos para que los servicios inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Estado de los servicios:" -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "INSTRUCCIONES FINALES:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "1. Abra el navegador en MODO INCÓGNITO" -ForegroundColor Green
Write-Host "2. Vaya a http://localhost" -ForegroundColor Green
Write-Host "3. Si ya estaba abierto, presione Ctrl+Shift+R para forzar recarga" -ForegroundColor Green
Write-Host ""
Write-Host "Presione Enter para finalizar..." -ForegroundColor Yellow
Read-Host
