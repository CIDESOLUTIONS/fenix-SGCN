#!/usr/bin/env pwsh
# Script para hacer build de Fenix-SGCN en producción

Write-Host "🚀 Iniciando build de Fenix-SGCN..." -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date

try {
    Set-Location "C:\Users\meciz\Documents\fenix-SGCN"
    
    Write-Host "📦 Limpiando imágenes antiguas..." -ForegroundColor Yellow
    docker compose -f docker-compose.prod.yml down --rmi all 2>$null
    
    Write-Host ""
    Write-Host "🔨 Construyendo imágenes (esto puede tomar 10-15 minutos)..." -ForegroundColor Yellow
    docker compose -f docker-compose.prod.yml build --no-cache --progress=plain
    
    if ($LASTEXITCODE -eq 0) {
        $duration = (Get-Date) - $startTime
        Write-Host ""
        Write-Host "✅ Build completado exitosamente en $($duration.TotalMinutes.ToString('F2')) minutos" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Para iniciar los servicios ejecuta:" -ForegroundColor Cyan
        Write-Host "   docker compose -f docker-compose.prod.yml up -d" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Build falló con código de salida: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error durante el build: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
