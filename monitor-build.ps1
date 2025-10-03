# Script de Monitoreo de Build
Write-Host "Monitoreando progreso del build..." -ForegroundColor Cyan
Write-Host "Presione Ctrl+C para detener el monitoreo (el build continuará)" -ForegroundColor Yellow
Write-Host ""

$counter = 0
while ($true) {
    $counter++
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "MONITOREO DE BUILD - Actualización #$counter" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Ver procesos de Docker
    Write-Host "Procesos de build activos:" -ForegroundColor Yellow
    docker ps -a --filter "name=fenix" --format "table {{.Names}}\t{{.Status}}" 2>$null
    
    Write-Host ""
    Write-Host "Imágenes Docker (las nuevas tendrán 'ago' en segundos/minutos):" -ForegroundColor Yellow
    docker images | Select-String "fenix|REPOSITORY"
    
    Write-Host ""
    Write-Host "Esperando 10 segundos antes de actualizar..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}
