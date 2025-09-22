# ====================================
# SCRIPT DE LIMPIEZA Y DESPLIEGUE
# Fenix-SGCN - Producción
# ====================================

Write-Host "🧹 PASO 1: Limpieza completa de Docker..." -ForegroundColor Cyan
Write-Host ""

# Detener y eliminar contenedores existentes
Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down -v --remove-orphans

# Limpiar imágenes antiguas del proyecto
Write-Host "Eliminando imágenes antiguas..." -ForegroundColor Yellow
docker rmi fenix-sgcn-fenix_frontend:latest -f 2>$null
docker rmi fenix-sgcn-fenix_backend:latest -f 2>$null

# Limpiar cache de build
Write-Host "Limpiando cache de Docker..." -ForegroundColor Yellow
docker builder prune -f

Write-Host ""
Write-Host "✅ Limpieza completada" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "🔨 PASO 2: Reconstruyendo imágenes..." -ForegroundColor Cyan
Write-Host ""

# Build con --no-cache para forzar reconstrucción completa
docker-compose -f docker-compose.prod.yml build --no-cache --progress=plain

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error en la construcción de imágenes" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Imágenes reconstruidas exitosamente" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "🚀 PASO 3: Levantando contenedores..." -ForegroundColor Cyan
Write-Host ""

# Levantar servicios
docker-compose -f docker-compose.prod.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al levantar contenedores" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Contenedores iniciados" -ForegroundColor Green
Write-Host ""

# ====================================
Write-Host "📊 PASO 4: Verificando estado..." -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 5

# Mostrar estado de contenedores
docker-compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host "📝 Ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
Write-Host ""

# ====================================
Write-Host "🌐 URLs de Acceso:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Landing Page:  http://localhost" -ForegroundColor Green
Write-Host "   API Backend:   http://localhost/api" -ForegroundColor Green
Write-Host "   MinIO Console: http://localhost:9001" -ForegroundColor Green
Write-Host ""
Write-Host "   Usuario MinIO: meciza64" -ForegroundColor Gray
Write-Host "   Password:      sgcn2025" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ ¡Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host ""
