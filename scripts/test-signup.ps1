# TEST SIGNUP ENDPOINT

Write-Host "🔍 DIAGNÓSTICO SIGNUP ERROR" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test 1: Verificar contenedores corriendo
Write-Host "1️⃣ Verificando contenedores..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml ps | Select-String "fenix"

# Test 2: Verificar logs backend
Write-Host "`n2️⃣ Últimas 20 líneas logs backend:" -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml logs --tail=20 fenix_backend

# Test 3: Verificar logs NGINX
Write-Host "`n3️⃣ Últimas 10 líneas logs NGINX:" -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml logs --tail=10 fenix_proxy

# Test 4: Test directo al backend (bypass NGINX)
Write-Host "`n4️⃣ Test directo a backend (puerto 3001):" -ForegroundColor Yellow
$payload = @{
    tenantName = "Test Company"
    email = "test@test.com"
    password = "test123456"
    fullName = "Test User"
    position = "CEO"
    phone = "+57 300 123 4567"
    subscriptionPlan = "TRIAL"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/signup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -ErrorAction Stop
    
    Write-Host "✅ Backend responde correctamente" -ForegroundColor Green
    Write-Host "Token recibido: $($response.token.Substring(0,20))..." -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️ Backend responde (error 400 - esperado si email duplicado)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Test a través de NGINX (puerto 80)
Write-Host "`n5️⃣ Test a través de NGINX (puerto 80):" -ForegroundColor Yellow
$payload2 = @{
    tenantName = "Test Company 2"
    email = "test2@test.com"
    password = "test123456"
    fullName = "Test User 2"
    position = "CEO"
    phone = "+57 300 123 4568"
    subscriptionPlan = "TRIAL"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost/api/auth/signup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload2 `
        -ErrorAction Stop
    
    Write-Host "✅ NGINX routing funciona correctamente" -ForegroundColor Green
    Write-Host "Token recibido: $($response2.token.Substring(0,20))..." -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️ NGINX OK (error 400 - esperado si email duplicado)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "StatusCode: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "- Si Test 4 pasa: Backend funciona ✅" -ForegroundColor White
Write-Host "- Si Test 5 pasa: NGINX routing funciona ✅" -ForegroundColor White
Write-Host "- Si Test 5 falla con 404: Problema en NGINX config ❌" -ForegroundColor White
Write-Host "- Si ambos fallan: Problema en backend ❌" -ForegroundColor White
