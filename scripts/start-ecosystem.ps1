# =================================================================
# FENIX ECOSYSTEM - Script de Inicio Unificado (PowerShell)
# =================================================================

Write-Host "🔥 FENIX ECOSYSTEM - Iniciando aplicaciones completas..." -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Verificando estructura de directorios..." -ForegroundColor Blue

# Verificar que fenix-admin existe
if (-not (Test-Path "..\fenix-admin")) {
    Write-Host "❌ Directorio fenix-admin no encontrado en la ruta esperada" -ForegroundColor Red
    Write-Host "   Se esperaba: ..\fenix-admin" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Estructura de directorios correcta" -ForegroundColor Green
Write-Host ""

# Cargar variables de entorno
if (Test-Path ".env.ecosystem") {
    Write-Host "📄 Cargando variables de entorno..." -ForegroundColor Blue
    Get-Content .env.ecosystem | ForEach-Object {
        if ($_ -match '^([^=]+)=(.+)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "✅ Variables cargadas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo .env.ecosystem no encontrado, usando valores por defecto" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🐳 Construyendo imágenes Docker..." -ForegroundColor Blue
docker compose -f docker-compose.ecosystem.yml build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la construcción de imágenes" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Imágenes construidas exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Levantando servicios..." -ForegroundColor Blue

docker compose -f docker-compose.ecosystem.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al levantar servicios" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Servicios iniciados" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Esperando que los servicios estén listos..." -ForegroundColor Blue

Start-Sleep -Seconds 10

# Verificar estado de servicios
Write-Host ""
Write-Host "📊 Estado de servicios:" -ForegroundColor Blue
docker compose -f docker-compose.ecosystem.yml ps

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ FENIX ECOSYSTEM INICIADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs de Acceso:" -ForegroundColor Blue
Write-Host ""
Write-Host "  FENIX-SGCN (Aplicación Principal):" -ForegroundColor Green
Write-Host "    Frontend: " -NoNewline; Write-Host "http://localhost" -ForegroundColor Yellow
Write-Host "    Backend:  " -NoNewline; Write-Host "http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "  FENIX-ADMIN (Panel de Administración):" -ForegroundColor Green
Write-Host "    Frontend: " -NoNewline; Write-Host "http://localhost:8080" -ForegroundColor Yellow
Write-Host "    Backend:  " -NoNewline; Write-Host "http://localhost:3101" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Bases de Datos:" -ForegroundColor Green
Write-Host "    PostgreSQL SGCN:  " -NoNewline; Write-Host "localhost:5432" -ForegroundColor Yellow
Write-Host "    PostgreSQL Admin: " -NoNewline; Write-Host "localhost:5433" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Infraestructura:" -ForegroundColor Green
Write-Host "    Dgraph UI:   " -NoNewline; Write-Host "http://localhost:8080" -ForegroundColor Yellow
Write-Host "    MinIO:       " -NoNewline; Write-Host "http://localhost:9001" -ForegroundColor Yellow
Write-Host "    Redis SGCN:  " -NoNewline; Write-Host "localhost:6379" -ForegroundColor Yellow
Write-Host "    Redis Admin: " -NoNewline; Write-Host "localhost:6380" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor Blue
Write-Host "  Ver logs:     " -NoNewline; Write-Host "docker compose -f docker-compose.ecosystem.yml logs -f" -ForegroundColor Yellow
Write-Host "  Detener:      " -NoNewline; Write-Host "docker compose -f docker-compose.ecosystem.yml down" -ForegroundColor Yellow
Write-Host "  Reiniciar:    " -NoNewline; Write-Host "docker compose -f docker-compose.ecosystem.yml restart" -ForegroundColor Yellow
Write-Host "  Estado:       " -NoNewline; Write-Host "docker compose -f docker-compose.ecosystem.yml ps" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
