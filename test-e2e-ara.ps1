# Test E2E Manual - Módulo 2 ARA
# PowerShell Script

Write-Host "🧪 INICIANDO TESTS E2E - MÓDULO 2 ARA" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:3001"
$TOKEN = ""
$PROCESS_ID = ""
$RISK_ID = ""

# 1. LOGIN
Write-Host "📝 1. Autenticación" -ForegroundColor Yellow
$loginBody = @{
    email = "admin@fenix.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/signin" -Method Post -Body $loginBody -ContentType "application/json"
    $TOKEN = $loginResponse.access_token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error en login: $_" -ForegroundColor Red
    exit 1
}

# 2. CREAR PROCESO
Write-Host "📝 2. Crear Proceso de Negocio" -ForegroundColor Yellow
$processBody = @{
    name = "Sistema de Pagos Online E2E"
    processType = "MISIONAL"
    description = "Proceso para test E2E"
    includeInContinuityAnalysis = $true
    prioritizationCriteria = @{
        strategic = 5
        operational = 5
        financial = 5
        regulatory = 4
    }
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $TOKEN"
}

try {
    $processResponse = Invoke-RestMethod -Uri "$API_URL/business-processes" -Method Post -Body $processBody -ContentType "application/json" -Headers $headers
    $PROCESS_ID = $processResponse.id
    Write-Host "✅ Proceso creado: $PROCESS_ID" -ForegroundColor Green
    Write-Host "   Priority Score: $($processResponse.priorityScore)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error creando proceso: $_" -ForegroundColor Red
    exit 1
}

# 3. LISTAR PROCESOS DE CONTINUIDAD
Write-Host "📝 3. Listar Procesos de Continuidad" -ForegroundColor Yellow
try {
    $processes = Invoke-RestMethod -Uri "$API_URL/business-processes/continuity/selected" -Method Get -Headers $headers
    Write-Host "✅ Procesos encontrados: $($processes.Count)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️ Error listando procesos: $_" -ForegroundColor Yellow
    Write-Host ""
}

# 4. CREAR RIESGO
Write-Host "📝 4. Crear Riesgo" -ForegroundColor Yellow
$riskBody = @{
    processId = $PROCESS_ID
    name = "Fallo de Servidor E2E"
    description = "Test de fallo de servidor"
    category = "TECHNOLOGICAL"
    probabilityBefore = 4
    impactBefore = 5
    controls = @("Monitoreo 24/7", "Servidor de respaldo")
    probabilityAfter = 2
    impactAfter = 3
} | ConvertTo-Json

try {
    $riskResponse = Invoke-RestMethod -Uri "$API_URL/risk-assessments" -Method Post -Body $riskBody -ContentType "application/json" -Headers $headers
    $RISK_ID = $riskResponse.id
    Write-Host "✅ Riesgo creado: $RISK_ID" -ForegroundColor Green
    Write-Host "   Score Inicial: $($riskResponse.scoreBefore) (esperado: 26)" -ForegroundColor Gray
    Write-Host "   Score Residual: $($riskResponse.scoreAfter) (esperado: 7.8)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error creando riesgo: $_" -ForegroundColor Red
    exit 1
}

# 5. SIMULACIÓN MONTECARLO
Write-Host "📝 5. Simulación Montecarlo" -ForegroundColor Yellow
$montecarloBody = @{
    impactMin = 10000000
    impactMost = 50000000
    impactMax = 200000000
    probabilityMin = 0.1
    probabilityMax = 0.5
    iterations = 10000
} | ConvertTo-Json

try {
    $montecarloResponse = Invoke-RestMethod -Uri "$API_URL/risk-assessments/$RISK_ID/monte-carlo" -Method Post -Body $montecarloBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Simulación Montecarlo ejecutada" -ForegroundColor Green
    Write-Host "   Media: $($montecarloResponse.simulation.statistics.mean) COP" -ForegroundColor Gray
    Write-Host "   Mediana: $($montecarloResponse.simulation.statistics.median) COP" -ForegroundColor Gray
    Write-Host "   P90: $($montecarloResponse.simulation.percentiles.p90) COP" -ForegroundColor Gray
    Write-Host "   P99: $($montecarloResponse.simulation.percentiles.p99) COP" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error en Montecarlo: $_" -ForegroundColor Red
}

# 6. MAPA DE CALOR
Write-Host "📝 6. Mapa de Calor" -ForegroundColor Yellow
try {
    $heatmap = Invoke-RestMethod -Uri "$API_URL/risk-assessments/heatmap" -Method Get -Headers $headers
    $totalRisks = ($heatmap.PSObject.Properties | ForEach-Object { $_.Value.Count } | Measure-Object -Sum).Sum
    Write-Host "✅ Mapa de calor generado" -ForegroundColor Green
    Write-Host "   Total riesgos en matriz: $totalRisks" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️ Error en mapa de calor: $_" -ForegroundColor Yellow
    Write-Host ""
}

# 7. RIESGOS CRÍTICOS
Write-Host "📝 7. Riesgos Críticos" -ForegroundColor Yellow
try {
    $critical = Invoke-RestMethod -Uri "$API_URL/risk-assessments/critical" -Method Get -Headers $headers
    Write-Host "✅ Riesgos críticos consultados" -ForegroundColor Green
    Write-Host "   Cantidad: $($critical.count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️ Error consultando críticos: $_" -ForegroundColor Yellow
    Write-Host ""
}

# 8. PLAN DE TRATAMIENTO
Write-Host "📝 8. Plan de Tratamiento" -ForegroundColor Yellow
$treatmentBody = @{
    strategy = "MITIGATE"
    owner = "admin@fenix.com"
    actions = @(
        @{
            description = "Implementar respaldo redundante"
            assignee = "admin@fenix.com"
            dueDate = "2025-12-31"
        }
    )
} | ConvertTo-Json -Depth 3

try {
    $treatmentResponse = Invoke-RestMethod -Uri "$API_URL/risk-assessments/$RISK_ID/treatment-plan" -Method Post -Body $treatmentBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Plan de tratamiento creado" -ForegroundColor Green
    Write-Host "   Workflow ID: $($treatmentResponse.workflowId)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️ Error en tratamiento: $_" -ForegroundColor Yellow
    Write-Host ""
}

# 9. ACTUALIZAR RIESGO
Write-Host "📝 9. Actualizar Riesgo" -ForegroundColor Yellow
$updateBody = @{
    probabilityBefore = 5
    impactBefore = 5
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$API_URL/risk-assessments/$RISK_ID" -Method Patch -Body $updateBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Riesgo actualizado" -ForegroundColor Green
    Write-Host "   Nuevo Score: $($updateResponse.scoreBefore) (esperado: 32.5)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️ Error actualizando: $_" -ForegroundColor Yellow
    Write-Host ""
}

# 10. ELIMINAR RIESGO
Write-Host "📝 10. Eliminar Riesgo" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/risk-assessments/$RISK_ID" -Method Delete -Headers $headers | Out-Null
    Write-Host "✅ Riesgo eliminado" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️ Error eliminando riesgo: $_" -ForegroundColor Yellow
    Write-Host ""
}

# 11. ELIMINAR PROCESO
Write-Host "📝 11. Eliminar Proceso" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/business-processes/$PROCESS_ID" -Method Delete -Headers $headers | Out-Null
    Write-Host "✅ Proceso eliminado" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️ Error eliminando proceso: $_" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "✅ TESTS E2E COMPLETADOS" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
