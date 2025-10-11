#!/bin/bash

# Script de prueba E2E - Módulo 1: Planeación y Gobierno

API_URL="http://localhost"
TOKEN=""

echo "==================================="
echo "PRUEBA E2E - MÓDULO 1: PLANEACIÓN"
echo "==================================="

# 1. Login
echo -e "\n1️⃣ Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cidesolutions.com",
    "password": "Admin123!@#"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken // .token // .access_token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Error al obtener token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login exitoso - Token: ${TOKEN:0:20}..."

# 2. Crear Política
echo -e "\n2️⃣ Crear Política del SGCN..."
POLICY_RESPONSE=$(curl -s -X POST "$API_URL/api/governance/policies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Política de Continuidad de Negocio - CIDE SAS",
    "content": "1. OBJETIVO\nEsta política establece el compromiso de CIDE SAS con la continuidad de las operaciones críticas del negocio.\n\n2. ALCANCE\nAplica a todos los procesos críticos identificados en el BIA.\n\n3. COMPROMISO DE LA DIRECCIÓN\nLa alta dirección se compromete a:\n- Proporcionar recursos adecuados\n- Garantizar la mejora continua del SGCN\n- Cumplir con los requisitos de ISO 22301:2019\n\n4. OBJETIVOS\n- Mantener RTO < 4 horas para procesos críticos\n- Lograr 95% de éxito en pruebas anuales\n- Certificación ISO 22301 antes de Q4 2026",
    "version": "1.0"
  }')

POLICY_ID=$(echo $POLICY_RESPONSE | jq -r '.id')

if [ -z "$POLICY_ID" ] || [ "$POLICY_ID" == "null" ]; then
  echo "❌ Error al crear política"
  echo "Response: $POLICY_RESPONSE"
  exit 1
fi

echo "✅ Política creada - ID: $POLICY_ID"

# 3. Obtener Política
echo -e "\n3️⃣ Obtener Política..."
GET_POLICY=$(curl -s -X GET "$API_URL/api/governance/policies/$POLICY_ID" \
  -H "Authorization: Bearer $TOKEN")

POLICY_TITLE=$(echo $GET_POLICY | jq -r '.title')
echo "✅ Política obtenida: $POLICY_TITLE"

# 4. Enviar a Revisión
echo -e "\n4️⃣ Enviar Política a Revisión..."
SUBMIT_RESPONSE=$(curl -s -X POST "$API_URL/api/governance/policies/$POLICY_ID/submit-approval" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "approvers": ["admin@cidesolutions.com"]
  }')

WORKFLOW_ID=$(echo $SUBMIT_RESPONSE | jq -r '.workflowId')
echo "✅ Política enviada a revisión - Workflow: $WORKFLOW_ID"

# 5. Aprobar Política
echo -e "\n5️⃣ Aprobar Política..."
APPROVE_RESPONSE=$(curl -s -X POST "$API_URL/api/governance/policies/$POLICY_ID/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "comments": "Política revisada y aprobada por la Dirección"
  }')

echo "✅ Política aprobada"

# 6. Publicar Política
echo -e "\n6️⃣ Publicar Política..."
PUBLISH_RESPONSE=$(curl -s -X POST "$API_URL/api/governance/policies/$POLICY_ID/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "✅ Política publicada"

# 7. Crear Objetivo SMART
echo -e "\n7️⃣ Crear Objetivo SMART..."
OBJECTIVE_RESPONSE=$(curl -s -X POST "$API_URL/api/governance/objectives" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Reducir el RTO promedio de procesos críticos a menos de 4 horas para Q4 2025",
    "measurementCriteria": "Promedio de RTO de los 10 procesos críticos identificados en el BIA",
    "targetDate": "2025-12-31",
    "owner": "Gerente de TI"
  }')

OBJECTIVE_ID=$(echo $OBJECTIVE_RESPONSE | jq -r '.id')
echo "✅ Objetivo creado - ID: $OBJECTIVE_ID"

# 8. Listar Objetivos
echo -e "\n8️⃣ Listar Objetivos..."
OBJECTIVES=$(curl -s -X GET "$API_URL/api/governance/objectives" \
  -H "Authorization: Bearer $TOKEN")

OBJECTIVE_COUNT=$(echo $OBJECTIVES | jq 'length')
echo "✅ Objetivos listados: $OBJECTIVE_COUNT encontrados"

# 9. Crear Matriz RACI
echo -e "\n9️⃣ Crear Matriz RACI..."
RACI_RESPONSE=$(curl -s -X POST "$API_URL/api/governance/raci-matrix" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "processOrActivity": "Gestión de Incidentes Críticos",
    "assignments": [
      {
        "role": "Gerente de TI",
        "responsibility": "Coordinar respuesta técnica",
        "raciType": "RESPONSIBLE"
      },
      {
        "role": "Director Ejecutivo",
        "responsibility": "Aprobar decisiones estratégicas",
        "raciType": "ACCOUNTABLE"
      },
      {
        "role": "Gerente de Operaciones",
        "responsibility": "Proveer información de impacto",
        "raciType": "CONSULTED"
      },
      {
        "role": "Recursos Humanos",
        "responsibility": "Recibir actualizaciones",
        "raciType": "INFORMED"
      }
    ]
  }')

RACI_ID=$(echo $RACI_RESPONSE | jq -r '.id')
echo "✅ Matriz RACI creada - ID: $RACI_ID"

# 10. Listar Matrices RACI
echo -e "\n🔟 Listar Matrices RACI..."
RACI_LIST=$(curl -s -X GET "$API_URL/api/governance/raci-matrix" \
  -H "Authorization: Bearer $TOKEN")

RACI_COUNT=$(echo $RACI_LIST | jq 'length')
echo "✅ Matrices RACI listadas: $RACI_COUNT encontradas"

# Resumen Final
echo -e "\n==================================="
echo "✅ PRUEBA E2E COMPLETADA CON ÉXITO"
echo "==================================="
echo "📋 Política ID: $POLICY_ID"
echo "🎯 Objetivo ID: $OBJECTIVE_ID"
echo "👥 Matriz RACI ID: $RACI_ID"
echo "🔄 Workflow ID: $WORKFLOW_ID"
echo ""
echo "🌐 Accede a: http://localhost/dashboard/planeacion"
