# Script de Verificación de Correcciones
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "VERIFICACIÓN DE CORRECCIONES APLICADAS" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# 1. RichTextEditor
Write-Host "1. Verificando RichTextEditor.tsx..." -ForegroundColor Yellow
$content = Get-Content "frontend\components\RichTextEditor.tsx" -Raw
if ($content -match "handlePaste") {
    Write-Host "   ✓ handlePaste encontrado - Copiar/pegar imágenes implementado" -ForegroundColor Green
} else {
    Write-Host "   ✗ handlePaste NO encontrado" -ForegroundColor Red
}

if ($content -match "useEffect") {
    Write-Host "   ✓ useEffect encontrado - Event listener configurado" -ForegroundColor Green
} else {
    Write-Host "   ✗ useEffect NO encontrado" -ForegroundColor Red
}

# 2. SwotEditor
Write-Host ""
Write-Host "2. Verificando SwotEditor.tsx..." -ForegroundColor Yellow
$content = Get-Content "frontend\components\business-context\SwotEditor.tsx" -Raw
if ($content -match "Array\.isArray") {
    Write-Host "   ✓ Array.isArray encontrado - Validación robusta implementada" -ForegroundColor Green
} else {
    Write-Host "   ✗ Array.isArray NO encontrado" -ForegroundColor Red
}

if ($content -match "console\.log\('Loading existing SWOT'") {
    Write-Host "   ✓ Console.log debug encontrado" -ForegroundColor Green
} else {
    Write-Host "   ✗ Console.log debug NO encontrado" -ForegroundColor Red
}

# 3. EditContextModal
Write-Host ""
Write-Host "3. Verificando EditContextModal.tsx..." -ForegroundColor Yellow
$content = Get-Content "frontend\components\business-context\EditContextModal.tsx" -Raw
if ($content -match "remove-file") {
    Write-Host "   ✓ Endpoint remove-file encontrado - Eliminar archivos implementado" -ForegroundColor Green
} else {
    Write-Host "   ✗ Endpoint remove-file NO encontrado" -ForegroundColor Red
}

if ($content -match "uploadedFile") {
    Write-Host "   ✓ Estado uploadedFile encontrado - Subir archivos implementado" -ForegroundColor Green
} else {
    Write-Host "   ✗ Estado uploadedFile NO encontrado" -ForegroundColor Red
}

# 4. Backend service
Write-Host ""
Write-Host "4. Verificando backend business-context.service.ts..." -ForegroundColor Yellow
$content = Get-Content "backend\src\business-context\business-context.service.ts" -Raw
if ($content -match "removeContextFile") {
    Write-Host "   ✓ Método removeContextFile encontrado" -ForegroundColor Green
} else {
    Write-Host "   ✗ Método removeContextFile NO encontrado" -ForegroundColor Red
}

# 5. AI Service
Write-Host ""
Write-Host "5. Verificando backend ai.service.ts..." -ForegroundColor Yellow
$content = Get-Content "backend\src\ai\ai.service.ts" -Raw
if ($content -match "gemini-2\.0-flash-exp") {
    Write-Host "   ✓ Modelo Gemini correcto (gemini-2.0-flash-exp)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Modelo Gemini incorrecto" -ForegroundColor Red
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "VERIFICACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presione Enter para continuar..."
Read-Host
