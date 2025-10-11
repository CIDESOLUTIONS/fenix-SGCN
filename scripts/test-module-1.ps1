# Script de prueba E2E - Modulo 1 con registro de usuario

$API_URL = "http://localhost"

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "PRUEBA E2E - MODULO 1" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# 1. Registrar usuario si no existe
Write-Host "`n[1] Registrando usuario de prueba..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "Test123!@#"
    fullName = "Usuario de Prueba"
    tenantName = "Empresa Test"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/signup" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "[OK] Usuario registrado exitosamente" -ForegroundColor Green
    $TOKEN = $registerResponse.token
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "[INFO] Usuario ya existe, procediendo a login..." -ForegroundColor Yellow
    } else {
        Write-Host "[ERROR] Error en registro: $_" -ForegroundColor Red
    }
}

# 2. Login
Write-Host "`n[2] Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/signin" -Method Post -Body $loginBody -ContentType "application/json"
    $TOKEN = $loginResponse.accessToken
    if (-not $TOKEN) { $TOKEN = $loginResponse.token }
    if (-not $TOKEN) { $TOKEN = $loginResponse.access_token }
    
    Write-Host "[OK] Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al hacer login: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

$headers = @{ "Authorization" = "Bearer $TOKEN" }

# 3. Crear Politica
Write-Host "`n[3] Crear Politica del SGCN..." -ForegroundColor Yellow
$policyBody = @{
    title = "Politica de Continuidad de Negocio - Test"
    content = @"
1. OBJETIVO
Esta politica establece el compromiso con la continuidad de las operaciones criticas.

2. ALCANCE
Aplica a todos los procesos criticos identificados en el BIA.

3. COMPROMISO DE LA DIRECCION
La alta direccion se compromete a:
- Proporcionar recursos adecuados
- Garantizar la mejora continua del SGCN
- Cumplir con los requisitos de ISO 22301:2019

4. OBJETIVOS
- Mantener RTO menor a 4 horas para procesos criticos
- Lograr 95% de exito en pruebas anuales
"@
    version = "1.0"
} | ConvertTo-Json

try {
    $policyResponse = Invoke-RestMethod -Uri "$API_URL/api/governance/policies" -Method Post -Body $policyBody -ContentType "application/json" -Headers $headers
    $POLICY_ID = $policyResponse.id
    Write-Host "[OK] Politica creada - ID: $POLICY_ID" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al crear politica: $_" -ForegroundColor Red
    Write-Host "StatusCode: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    exit 1
}

# 4. Obtener Politica
Write-Host "`n[4] Obtener Politica..." -ForegroundColor Yellow
try {
    $getPolicy = Invoke-RestMethod -Uri "$API_URL/api/governance/policies/$POLICY_ID" -Method Get -Headers $headers
    Write-Host "[OK] Politica obtenida: $($getPolicy.title)" -ForegroundColor Green
    Write-Host "    Estado: $($getPolicy.status)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Error al obtener politica: $_" -ForegroundColor Red
}

# 5. Listar todas las politicas
Write-Host "`n[5] Listar todas las politicas..." -ForegroundColor Yellow
try {
    $allPolicies = Invoke-RestMethod -Uri "$API_URL/api/governance/policies" -Method Get -Headers $headers
    Write-Host "[OK] Total de politicas: $($allPolicies.Count)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al listar politicas: $_" -ForegroundColor Red
}

# 6. Crear Objetivo SMART
Write-Host "`n[6] Crear Objetivo SMART..." -ForegroundColor Yellow
$objectiveBody = @{
    description = "Reducir el RTO promedio de procesos criticos a menos de 4 horas"
    measurementCriteria = "Promedio de RTO de los procesos criticos"
    targetDate = "2025-12-31"
    owner = "Gerente de TI"
} | ConvertTo-Json

try {
    $objectiveResponse = Invoke-RestMethod -Uri "$API_URL/api/governance/objectives" -Method Post -Body $objectiveBody -ContentType "application/json" -Headers $headers
    $OBJECTIVE_ID = $objectiveResponse.id
    Write-Host "[OK] Objetivo creado - ID: $OBJECTIVE_ID" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al crear objetivo: $_" -ForegroundColor Red
}

# 7. Listar Objetivos
Write-Host "`n[7] Listar Objetivos..." -ForegroundColor Yellow
try {
    $objectives = Invoke-RestMethod -Uri "$API_URL/api/governance/objectives" -Method Get -Headers $headers
    Write-Host "[OK] Total de objetivos: $($objectives.Count)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al listar objetivos: $_" -ForegroundColor Red
}

# 8. Crear Matriz RACI
Write-Host "`n[8] Crear Matriz RACI..." -ForegroundColor Yellow
$raciBody = @{
    processOrActivity = "Gestion de Incidentes Criticos"
    assignments = @(
        @{
            role = "Gerente de TI"
            responsibility = "Coordinar respuesta tecnica"
            raciType = "RESPONSIBLE"
        },
        @{
            role = "Director Ejecutivo"
            responsibility = "Aprobar decisiones"
            raciType = "ACCOUNTABLE"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $raciResponse = Invoke-RestMethod -Uri "$API_URL/api/governance/raci-matrix" -Method Post -Body $raciBody -ContentType "application/json" -Headers $headers
    $RACI_ID = $raciResponse.id
    Write-Host "[OK] Matriz RACI creada - ID: $RACI_ID" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al crear matriz RACI: $_" -ForegroundColor Red
}

# 9. Listar Matrices RACI
Write-Host "`n[9] Listar Matrices RACI..." -ForegroundColor Yellow
try {
    $raciList = Invoke-RestMethod -Uri "$API_URL/api/governance/raci-matrix" -Method Get -Headers $headers
    Write-Host "[OK] Total de matrices RACI: $($raciList.Count)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error al listar matrices RACI: $_" -ForegroundColor Red
}

# Resumen Final
Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE PRUEBA E2E" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Politica ID: $POLICY_ID" -ForegroundColor White
Write-Host "Objetivo ID: $OBJECTIVE_ID" -ForegroundColor White
Write-Host "Matriz RACI ID: $RACI_ID" -ForegroundColor White
Write-Host "`n[INFO] Accede a la aplicacion:" -ForegroundColor Yellow
Write-Host "URL: http://localhost/dashboard/planeacion" -ForegroundColor Cyan
Write-Host "Usuario: test@example.com" -ForegroundColor Cyan
Write-Host "Password: Test123!@#" -ForegroundColor Cyan
Write-Host "`n[OK] PRUEBA COMPLETADA" -ForegroundColor Green
