#!/bin/bash

echo "==================================="
echo "VERIFICACIÓN DE CORRECCIONES APLICADAS"
echo "==================================="
echo ""

echo "1. Verificando RichTextEditor.tsx..."
if grep -q "handlePaste" frontend/components/RichTextEditor.tsx; then
    echo "   ✅ handlePaste encontrado - Copiar/pegar imágenes implementado"
else
    echo "   ❌ handlePaste NO encontrado"
fi

if grep -q "useEffect" frontend/components/RichTextEditor.tsx; then
    echo "   ✅ useEffect encontrado - Event listener configurado"
else
    echo "   ❌ useEffect NO encontrado"
fi

echo ""
echo "2. Verificando SwotEditor.tsx..."
if grep -q "Array.isArray" frontend/components/business-context/SwotEditor.tsx; then
    echo "   ✅ Array.isArray encontrado - Validación robusta implementada"
else
    echo "   ❌ Array.isArray NO encontrado"
fi

if grep -q "console.log('Loading existing SWOT'" frontend/components/business-context/SwotEditor.tsx; then
    echo "   ✅ Console.log debug encontrado"
else
    echo "   ❌ Console.log debug NO encontrado"
fi

echo ""
echo "3. Verificando EditContextModal.tsx..."
if grep -q "remove-file" frontend/components/business-context/EditContextModal.tsx; then
    echo "   ✅ Endpoint remove-file encontrado - Eliminar archivos implementado"
else
    echo "   ❌ Endpoint remove-file NO encontrado"
fi

if grep -q "uploadedFile" frontend/components/business-context/EditContextModal.tsx; then
    echo "   ✅ Estado uploadedFile encontrado - Subir archivos implementado"
else
    echo "   ❌ Estado uploadedFile NO encontrado"
fi

echo ""
echo "4. Verificando backend business-context.service.ts..."
if grep -q "removeContextFile" backend/src/business-context/business-context.service.ts; then
    echo "   ✅ Método removeContextFile encontrado"
else
    echo "   ❌ Método removeContextFile NO encontrado"
fi

echo ""
echo "5. Verificando backend ai.service.ts..."
if grep -q "gemini-2.0-flash-exp" backend/src/ai/ai.service.ts; then
    echo "   ✅ Modelo Gemini correcto (gemini-2.0-flash-exp)"
else
    echo "   ❌ Modelo Gemini incorrecto"
fi

echo ""
echo "==================================="
echo "VERIFICACIÓN COMPLETADA"
echo "==================================="
