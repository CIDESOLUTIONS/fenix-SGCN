#!/bin/bash

# Script de pruebas E2E y deployment
# Fenix-SGCN Frontend

echo "🚀 Iniciando proceso de pruebas y deployment..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/frontend

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

echo -e "${YELLOW}🎭 Instalando navegadores de Playwright...${NC}"
npx playwright install chromium

echo -e "${YELLOW}🧪 Ejecutando pruebas E2E...${NC}"
npm run test:e2e

# Verificar si las pruebas pasaron
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las pruebas pasaron exitosamente${NC}"
    
    echo -e "${YELLOW}🔨 Construyendo frontend...${NC}"
    cd /mnt/c/Users/meciz/Documents/fenix-sgcn
    
    docker compose -f docker-compose.prod.yml build fenix_frontend
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completado exitosamente${NC}"
        
        echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
        docker compose -f docker-compose.prod.yml up -d
        
        echo -e "${GREEN}✅ Servicios reiniciados${NC}"
        echo -e "${GREEN}🎉 Deployment completado con éxito${NC}"
        
        # Mostrar logs
        echo -e "${YELLOW}📋 Logs del frontend:${NC}"
        docker logs --tail 50 fenix_frontend
    else
        echo -e "${RED}❌ Error en el build${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Las pruebas E2E fallaron${NC}"
    echo -e "${YELLOW}📊 Generando reporte de pruebas...${NC}"
    npm run test:e2e:report
    exit 1
fi
