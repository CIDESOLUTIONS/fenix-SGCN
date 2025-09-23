#!/bin/bash

# ============================================
# COMANDOS RÁPIDOS - FENIX SGCN
# Sistema de i18n y Conversión de Monedas
# ============================================

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para imprimir con color
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Directorio base
BASE_DIR="/mnt/c/Users/meciz/Documents/fenix-sgcn"

# ============================================
# OPCIÓN 1: INSTALACIÓN COMPLETA
# ============================================
if [ "$1" == "install" ]; then
    print_header "INSTALACIÓN COMPLETA"
    
    cd $BASE_DIR/frontend
    print_info "Instalando dependencias de Node.js..."
    npm install
    
    print_info "Instalando Playwright..."
    npx playwright install chromium
    
    print_success "Instalación completada"
fi

# ============================================
# OPCIÓN 2: EJECUTAR PRUEBAS E2E
# ============================================
if [ "$1" == "test" ]; then
    print_header "EJECUTANDO PRUEBAS E2E"
    
    cd $BASE_DIR/frontend
    npm run test:e2e
fi

# ============================================
# OPCIÓN 3: PRUEBAS EN MODO UI
# ============================================
if [ "$1" == "test:ui" ]; then
    print_header "PRUEBAS E2E - MODO UI"
    
    cd $BASE_DIR/frontend
    npm run test:e2e:ui
fi

# ============================================
# OPCIÓN 4: VER REPORTE DE PRUEBAS
# ============================================
if [ "$1" == "report" ]; then
    print_header "REPORTE DE PRUEBAS"
    
    cd $BASE_DIR/frontend
    npm run test:e2e:report
fi

# ============================================
# OPCIÓN 5: BUILD FRONTEND
# ============================================
if [ "$1" == "build" ]; then
    print_header "CONSTRUYENDO FRONTEND"
    
    cd $BASE_DIR
    docker compose -f docker-compose.prod.yml build fenix_frontend
    
    print_success "Build completado"
fi

# ============================================
# OPCIÓN 6: DEPLOY COMPLETO
# ============================================
if [ "$1" == "deploy" ]; then
    print_header "DEPLOYMENT COMPLETO"
    
    cd $BASE_DIR
    
    print_info "Deteniendo servicios actuales..."
    docker compose -f docker-compose.prod.yml down
    
    print_info "Construyendo imágenes..."
    docker compose -f docker-compose.prod.yml build
    
    print_info "Iniciando servicios..."
    docker compose -f docker-compose.prod.yml up -d
    
    print_success "Deployment completado"
    
    print_info "Mostrando logs del frontend..."
    docker logs --tail 50 fenix_frontend
fi

# ============================================
# OPCIÓN 7: VER LOGS
# ============================================
if [ "$1" == "logs" ]; then
    print_header "LOGS DEL FRONTEND"
    
    docker logs -f fenix_frontend
fi

# ============================================
# OPCIÓN 8: RESTART SERVICIOS
# ============================================
if [ "$1" == "restart" ]; then
    print_header "REINICIANDO SERVICIOS"
    
    cd $BASE_DIR
    docker compose -f docker-compose.prod.yml restart
    
    print_success "Servicios reiniciados"
fi

# ============================================
# OPCIÓN 9: TODO (Test + Build + Deploy)
# ============================================
if [ "$1" == "all" ]; then
    print_header "PROCESO COMPLETO: TEST + BUILD + DEPLOY"
    
    # 1. Pruebas
    print_info "Paso 1/3: Ejecutando pruebas E2E..."
    cd $BASE_DIR/frontend
    npm run test:e2e
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Las pruebas fallaron. Abortando deployment.${NC}"
        exit 1
    fi
    
    print_success "Pruebas pasadas exitosamente"
    
    # 2. Build
    print_info "Paso 2/3: Construyendo frontend..."
    cd $BASE_DIR
    docker compose -f docker-compose.prod.yml build fenix_frontend
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build falló. Abortando deployment.${NC}"
        exit 1
    fi
    
    print_success "Build completado"
    
    # 3. Deploy
    print_info "Paso 3/3: Desplegando servicios..."
    docker compose -f docker-compose.prod.yml up -d
    
    print_success "¡TODO COMPLETADO EXITOSAMENTE!"
    
    # Mostrar logs
    print_info "Logs del frontend:"
    docker logs --tail 30 fenix_frontend
fi

# ============================================
# OPCIÓN 10: HELP
# ============================================
if [ "$1" == "help" ] || [ -z "$1" ]; then
    print_header "COMANDOS DISPONIBLES"
    
    echo ""
    echo "Uso: ./quick-commands.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo ""
    echo "  install     - Instalar dependencias (Node + Playwright)"
    echo "  test        - Ejecutar pruebas E2E"
    echo "  test:ui     - Ejecutar pruebas en modo UI (interactivo)"
    echo "  report      - Ver reporte de pruebas"
    echo "  build       - Construir imagen Docker del frontend"
    echo "  deploy      - Deploy completo (down + build + up)"
    echo "  logs        - Ver logs del frontend en tiempo real"
    echo "  restart     - Reiniciar servicios"
    echo "  all         - TODO: test + build + deploy"
    echo "  help        - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./quick-commands.sh install    # Primera vez"
    echo "  ./quick-commands.sh test       # Ejecutar pruebas"
    echo "  ./quick-commands.sh all        # Proceso completo"
    echo ""
fi
