@echo off
echo ========================================
echo FENIX-SGCN - REBUILD RAPIDO
echo ========================================
echo.

cd C:\Users\meciz\Documents\fenix-SGCN

echo [1/4] Deteniendo servicios...
docker compose -f docker-compose.prod.yml down

echo.
echo [2/4] Rebuild backend (AI + Settings)...
docker compose -f docker-compose.prod.yml build fenix_backend

echo.
echo [3/4] Iniciando servicios...
docker compose -f docker-compose.prod.yml up -d

echo.
echo [4/4] Mostrando logs...
timeout /t 3 /nobreak >nul
docker compose -f docker-compose.prod.yml logs -f fenix_backend fenix_frontend

pause
