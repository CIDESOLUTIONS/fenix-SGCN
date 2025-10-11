#!/bin/bash
# Script de Rebuild Completo - Fenix-SGCN
# Elimina TODO el caché y reconstruye desde cero

echo "=========================================="
echo "REBUILD COMPLETO FENIX-SGCN"
echo "=========================================="
echo ""

# 1. Detener todos los servicios
echo "1. Deteniendo servicios..."
docker compose -f docker-compose.prod.yml down -v

# 2. Limpiar caché de Docker
echo ""
echo "2. Limpiando caché de Docker..."
docker system prune -af --volumes

# 3. Eliminar imágenes específicas de Fenix
echo ""
echo "3. Eliminando imágenes Fenix anteriores..."
docker rmi fenix-sgcn-fenix_frontend fenix-sgcn-fenix_backend 2>/dev/null || true

# 4. Limpiar node_modules y builds locales
echo ""
echo "4. Limpiando archivos locales de build..."
rm -rf frontend/.next
rm -rf frontend/node_modules/.cache
rm -rf backend/dist
rm -rf backend/node_modules/.cache

# 5. Rebuild completo sin caché
echo ""
echo "5. Rebuilding frontend (esto tomará varios minutos)..."
docker compose -f docker-compose.prod.yml build --no-cache --pull fenix_frontend

echo ""
echo "6. Rebuilding backend..."
docker compose -f docker-compose.prod.yml build --no-cache --pull fenix_backend

# 6. Iniciar servicios
echo ""
echo "7. Iniciando servicios..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "=========================================="
echo "REBUILD COMPLETADO"
echo "=========================================="
echo ""
echo "Espere 30 segundos para que los servicios inicien..."
sleep 30

echo ""
echo "Estado de los servicios:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "=========================================="
echo "INSTRUCCIONES FINALES:"
echo "=========================================="
echo "1. Abra el navegador en MODO INCÓGNITO"
echo "2. Vaya a http://localhost"
echo "3. Si ya estaba abierto, presione Ctrl+Shift+R para forzar recarga"
echo ""
