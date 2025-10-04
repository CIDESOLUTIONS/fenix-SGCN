# Script de Diagnóstico para SWOT Arrays Vacíos
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "DIAGNÓSTICO: SWOT Arrays Vacíos al Editar" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Verificando estructura de la tabla swot_analyses..." -ForegroundColor Yellow
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c "\d swot_analyses"

Write-Host ""
Write-Host "2. Verificando tipo de datos de las columnas..." -ForegroundColor Yellow
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c @"
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns 
WHERE table_name = 'swot_analyses' 
  AND column_name IN ('strengths', 'weaknesses', 'opportunities', 'threats')
ORDER BY column_name;
"@

Write-Host ""
Write-Host "3. Obteniendo datos de ejemplo..." -ForegroundColor Yellow
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c @"
SELECT 
  id,
  title,
  strengths,
  weaknesses,
  opportunities,
  threats
FROM swot_analyses 
LIMIT 1;
"@

Write-Host ""
Write-Host "4. Verificando si los arrays están vacíos o son NULL..." -ForegroundColor Yellow
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c @"
SELECT 
  id,
  title,
  CASE 
    WHEN strengths IS NULL THEN 'NULL'
    WHEN array_length(strengths, 1) IS NULL THEN 'EMPTY ARRAY'
    ELSE 'HAS DATA (' || array_length(strengths, 1) || ' items)'
  END as strengths_status,
  CASE 
    WHEN weaknesses IS NULL THEN 'NULL'
    WHEN array_length(weaknesses, 1) IS NULL THEN 'EMPTY ARRAY'
    ELSE 'HAS DATA (' || array_length(weaknesses, 1) || ' items)'
  END as weaknesses_status,
  CASE 
    WHEN opportunities IS NULL THEN 'NULL'
    WHEN array_length(opportunities, 1) IS NULL THEN 'EMPTY ARRAY'
    ELSE 'HAS DATA (' || array_length(opportunities, 1) || ' items)'
  END as opportunities_status,
  CASE 
    WHEN threats IS NULL THEN 'NULL'
    WHEN array_length(threats, 1) IS NULL THEN 'EMPTY ARRAY'
    ELSE 'HAS DATA (' || array_length(threats, 1) || ' items)'
  END as threats_status
FROM swot_analyses 
LIMIT 3;
"@

Write-Host ""
Write-Host "5. Contando registros con y sin datos..." -ForegroundColor Yellow
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c @"
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN array_length(strengths, 1) > 0 THEN 1 END) as with_strengths,
  COUNT(CASE WHEN array_length(weaknesses, 1) > 0 THEN 1 END) as with_weaknesses,
  COUNT(CASE WHEN array_length(opportunities, 1) > 0 THEN 1 END) as with_opportunities,
  COUNT(CASE WHEN array_length(threats, 1) > 0 THEN 1 END) as with_threats
FROM swot_analyses;
"@

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "DIAGNÓSTICO COMPLETADO" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ANÁLISIS:" -ForegroundColor Green
Write-Host "- Si ve 'text[]' en tipo de datos: Los arrays están correctamente definidos" -ForegroundColor White
Write-Host "- Si ve 'NULL': Los datos nunca se guardaron" -ForegroundColor White
Write-Host "- Si ve 'EMPTY ARRAY': Los datos se guardaron como array vacío" -ForegroundColor White
Write-Host "- Si ve 'HAS DATA': Los datos existen en la BD" -ForegroundColor White
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "Si los datos existen en BD pero no llegan al frontend:" -ForegroundColor White
Write-Host "  1. Revisar logs del backend: docker logs fenix_backend_prod" -ForegroundColor Gray
Write-Host "  2. Agregar console.log en SwotEditor useEffect" -ForegroundColor Gray
Write-Host "  3. Verificar response del API en Network tab del navegador" -ForegroundColor Gray
Write-Host ""
Write-Host "Presione Enter para continuar..." -ForegroundColor Yellow
Read-Host
