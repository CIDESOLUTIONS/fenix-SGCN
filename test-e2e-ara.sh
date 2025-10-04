#!/bin/bash

# Test E2E Manual - Módulo 2 ARA
# Ejecutar desde el host

echo "🧪 INICIANDO TESTS E2E - MÓDULO 2 ARA"
echo "======================================="
echo ""

# Variables
API_URL="http://localhost:3001"
TOKEN=""
TENANT_ID=""
PROCESS_ID=""
RISK_ID=""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para test
run_test() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -e "${BLUE}▶ Test: ${test_name}${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$API_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -X $method "$API_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
}

# 1. LOGIN
echo "📝 1. Autenticación"
login_response=$(curl -s -X POST "$API_URL/auth/signin" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@fenix.com",
        "password": "admin123"
    }')

TOKEN=$(echo $login_response | jq -r '.access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Error en login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Login exitoso${NC}"
echo ""

# 2. CREAR PROCESO DE NEGOCIO
echo "📝 2. Crear Proceso de Negocio"
process_response=$(curl -s -X POST "$API_URL/business-processes" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Sistema de Pagos Online E2E",
        "processType": "MISIONAL",
        "description": "Proceso para test E2E",
        "includeInContinuityAnalysis": true,
        "prioritizationCriteria": {
            "strategic": 5,
            "operational": 5,
            "financial": 5,
            "regulatory": 4
        }
    }')

PROCESS_ID=$(echo $process_response | jq -r '.id')
echo $process_response | jq '.'

if [ "$PROCESS_ID" = "null" ] || [ -z "$PROCESS_ID" ]; then
    echo -e "${RED}❌ Error creando proceso${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Proceso creado: $PROCESS_ID${NC}"
echo ""

# 3. LISTAR PROCESOS DE CONTINUIDAD
run_test "Listar Procesos de Continuidad" "GET" "/business-processes/continuity/selected"

# 4. CREAR RIESGO
echo "📝 4. Crear Riesgo"
risk_response=$(curl -s -X POST "$API_URL/risk-assessments" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "processId": "'$PROCESS_ID'",
        "name": "Fallo de Servidor E2E",
        "description": "Test de fallo de servidor",
        "category": "TECHNOLOGICAL",
        "probabilityBefore": 4,
        "impactBefore": 5,
        "controls": ["Monitoreo 24/7", "Servidor de respaldo"],
        "probabilityAfter": 2,
        "impactAfter": 3
    }')

RISK_ID=$(echo $risk_response | jq -r '.id')
echo $risk_response | jq '.'

if [ "$RISK_ID" = "null" ] || [ -z "$RISK_ID" ]; then
    echo -e "${RED}❌ Error creando riesgo${NC}"
    exit 1
fi

SCORE_BEFORE=$(echo $risk_response | jq -r '.scoreBefore')
SCORE_AFTER=$(echo $risk_response | jq -r '.scoreAfter')

echo -e "${GREEN}✅ Riesgo creado: $RISK_ID${NC}"
echo "   Score Inicial: $SCORE_BEFORE (esperado: 26)"
echo "   Score Residual: $SCORE_AFTER (esperado: 7.8)"
echo ""

# 5. SIMULACIÓN MONTECARLO
echo "📝 5. Simulación Montecarlo"
montecarlo_response=$(curl -s -X POST "$API_URL/risk-assessments/$RISK_ID/monte-carlo" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "impactMin": 10000000,
        "impactMost": 50000000,
        "impactMax": 200000000,
        "probabilityMin": 0.1,
        "probabilityMax": 0.5,
        "iterations": 10000
    }')

echo $montecarlo_response | jq '.simulation.statistics'
echo ""
echo "Percentiles:"
echo $montecarlo_response | jq '.simulation.percentiles'
echo ""

MEAN=$(echo $montecarlo_response | jq -r '.simulation.statistics.mean')
P90=$(echo $montecarlo_response | jq -r '.simulation.percentiles.p90')

echo -e "${GREEN}✅ Montecarlo ejecutado${NC}"
echo "   Media: $MEAN COP"
echo "   P90: $P90 COP"
echo ""

# 6. MAPA DE CALOR
run_test "Mapa de Calor" "GET" "/risk-assessments/heatmap"

# 7. RIESGOS CRÍTICOS
run_test "Riesgos Críticos" "GET" "/risk-assessments/critical"

# 8. PLAN DE TRATAMIENTO
echo "📝 8. Plan de Tratamiento"
treatment_response=$(curl -s -X POST "$API_URL/risk-assessments/$RISK_ID/treatment-plan" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "strategy": "MITIGATE",
        "owner": "admin@fenix.com",
        "actions": [
            {
                "description": "Implementar respaldo redundante",
                "assignee": "admin@fenix.com",
                "dueDate": "2025-12-31"
            }
        ]
    }')

echo $treatment_response | jq '.'
echo ""

# 9. ACTUALIZAR RIESGO
echo "📝 9. Actualizar Riesgo"
update_response=$(curl -s -X PATCH "$API_URL/risk-assessments/$RISK_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "probabilityBefore": 5,
        "impactBefore": 5
    }')

NEW_SCORE=$(echo $update_response | jq -r '.scoreBefore')
echo "Score actualizado: $NEW_SCORE (esperado: 32.5)"
echo ""

# 10. ELIMINAR RIESGO
echo "📝 10. Eliminar Riesgo"
delete_response=$(curl -s -X DELETE "$API_URL/risk-assessments/$RISK_ID" \
    -H "Authorization: Bearer $TOKEN")

echo $delete_response | jq '.'
echo ""

# 11. ELIMINAR PROCESO
echo "📝 11. Limpiar - Eliminar Proceso"
curl -s -X DELETE "$API_URL/business-processes/$PROCESS_ID" \
    -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "======================================="
echo -e "${GREEN}✅ TESTS E2E COMPLETADOS${NC}"
echo "======================================="
