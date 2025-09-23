#!/bin/bash

echo "🔄 Actualizando Fenix-SGCN con sistema de suscripciones..."
echo ""

# Detener contenedores
echo "📊 PASO 1: Deteniendo contenedores..."
docker compose -f docker-compose.prod.yml down
echo "✅ Contenedores detenidos"
echo ""

# Reconstruir
echo "🔨 PASO 2: Reconstruyendo imágenes..."
docker compose -f docker-compose.prod.yml build fenix_backend fenix_frontend
echo "✅ Imágenes reconstruidas"
echo ""

# Levantar servicios
echo "🚀 PASO 3: Levantando servicios..."
docker compose -f docker-compose.prod.yml up -d
echo "✅ Servicios iniciados"
echo ""

# Esperar
echo "⏳ PASO 4: Esperando inicialización..."
sleep 10

# Migrar
echo "🗄️ PASO 5: Aplicando migraciones..."
docker exec fenix_backend npx prisma migrate deploy
echo "✅ Migraciones aplicadas"
echo ""

# Estado
echo "📝 PASO 6: Estado de servicios..."
docker compose -f docker-compose.prod.yml ps
echo ""

echo "✨ ¡Sistema actualizado con gestión de suscripciones!"
echo ""
echo "📋 Funcionalidades Agregadas:"
echo "  ✅ Período de prueba de 30 días automático"
echo "  ✅ Planes: TRIAL, STANDARD, PROFESSIONAL, PREMIUM, ENTERPRISE"
echo "  ✅ Período de gracia de 30 días después de vencimiento"
echo "  ✅ Backup automático antes de eliminar"
echo "  ✅ Exportación completa de datos"
echo "  ✅ Tarea CRON diaria (2 AM)"
echo "  ✅ Audit log completo"
echo ""
echo "🌐 Endpoints:"
echo "  GET  /api/tenants/subscription"
echo "  GET  /api/tenants/export"
echo "  POST /api/tenants/backup"
echo "  POST /api/tenants/subscription/update"
echo ""
echo "📱 http://localhost"
