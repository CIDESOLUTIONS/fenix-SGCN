#!/bin/bash

# =================================================================
# FENIX ECOSYSTEM - Script de Inicio Unificado
# =================================================================

echo "🔥 FENIX ECOSYSTEM - Iniciando aplicaciones completas..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Verificando estructura de directorios...${NC}"

# Verificar que fenix-admin existe
if [ ! -d "../fenix-admin" ]; then
    echo -e "${RED}❌ Directorio fenix-admin no encontrado en la ruta esperada${NC}"
    echo "   Se esperaba: ../fenix-admin"
    exit 1
fi

echo -e "${GREEN}✅ Estructura de directorios correcta${NC}"
echo ""

# Cargar variables de entorno
if [ -f ".env.ecosystem" ]; then
    echo -e "${BLUE}📄 Cargando variables de entorno...${NC}"
    export $(cat .env.ecosystem | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Variables cargadas${NC}"
else
    echo -e "${YELLOW}⚠️  Archivo .env.ecosystem no encontrado, usando valores por defecto${NC}"
fi

echo ""
echo -e "${BLUE}🐳 Construyendo imágenes Docker...${NC}"
docker compose -f docker-compose.ecosystem.yml build --no-cache

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en la construcción de imágenes${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Imágenes construidas exitosamente${NC}"
echo ""
echo -e "${BLUE}🚀 Levantando servicios...${NC}"

docker compose -f docker-compose.ecosystem.yml up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al levantar servicios${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Servicios iniciados${NC}"
echo ""
echo -e "${BLUE}⏳ Esperando que los servicios estén listos...${NC}"

sleep 10

# Verificar estado de servicios
echo ""
echo -e "${BLUE}📊 Estado de servicios:${NC}"
docker compose -f docker-compose.ecosystem.yml ps

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ FENIX ECOSYSTEM INICIADO CORRECTAMENTE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}🌐 URLs de Acceso:${NC}"
echo ""
echo -e "  ${GREEN}FENIX-SGCN (Aplicación Principal):${NC}"
echo -e "    Frontend: ${YELLOW}http://localhost${NC}"
echo -e "    Backend:  ${YELLOW}http://localhost:3001${NC}"
echo ""
echo -e "  ${GREEN}FENIX-ADMIN (Panel de Administración):${NC}"
echo -e "    Frontend: ${YELLOW}http://localhost:8080${NC}"
echo -e "    Backend:  ${YELLOW}http://localhost:3101${NC}"
echo ""
echo -e "  ${GREEN}Bases de Datos:${NC}"
echo -e "    PostgreSQL SGCN:  ${YELLOW}localhost:5432${NC}"
echo -e "    PostgreSQL Admin: ${YELLOW}localhost:5433${NC}"
echo ""
echo -e "  ${GREEN}Infraestructura:${NC}"
echo -e "    Dgraph UI:   ${YELLOW}http://localhost:8080${NC}"
echo -e "    MinIO:       ${YELLOW}http://localhost:9001${NC}"
echo -e "    Redis SGCN:  ${YELLOW}localhost:6379${NC}"
echo -e "    Redis Admin: ${YELLOW}localhost:6380${NC}"
echo ""
echo -e "${BLUE}📝 Comandos útiles:${NC}"
echo -e "  Ver logs:     ${YELLOW}docker compose -f docker-compose.ecosystem.yml logs -f${NC}"
echo -e "  Detener:      ${YELLOW}docker compose -f docker-compose.ecosystem.yml down${NC}"
echo -e "  Reiniciar:    ${YELLOW}docker compose -f docker-compose.ecosystem.yml restart${NC}"
echo -e "  Estado:       ${YELLOW}docker compose -f docker-compose.ecosystem.yml ps${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
