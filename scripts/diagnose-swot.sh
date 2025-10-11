#!/bin/bash
# Script de Diagnóstico para SWOT Arrays Vacíos

echo "================================================"
echo "DIAGNÓSTICO: SWOT Arrays Vacíos al Editar"
echo "================================================"
echo ""

echo "1. Verificando estructura de la tabla swot_analyses..."
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c "\d swot_analyses"

echo ""
echo "2. Verificando tipo de datos de las columnas..."
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c "
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns 
WHERE table_name = 'swot_analyses' 
  AND column_name IN ('strengths', 'weaknesses', 'opportunities', 'threats')
ORDER BY column_name;"

echo ""
echo "3. Obteniendo datos de ejemplo..."
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c "
SELECT 
  id,
  title,
  strengths,
  weaknesses,
  opportunities,
  threats
FROM swot_analyses 
LIMIT 1;"

echo ""
echo "4. Verificando si los arrays están vacíos o son NULL..."
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c "
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
LIMIT 3;"

echo ""
echo "5. Contando registros con y sin datos..."
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn -c "
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN array_length(strengths, 1) > 0 THEN 1 END) as with_strengths,
  COUNT(CASE WHEN array_length(weaknesses, 1) > 0 THEN 1 END) as with_weaknesses,
  COUNT(CASE WHEN array_length(opportunities, 1) > 0 THEN 1 END) as with_opportunities,
  COUNT(CASE WHEN array_length(threats, 1) > 0 THEN 1 END) as with_threats
FROM swot_analyses;"

echo ""
echo "================================================"
echo "DIAGNÓSTICO COMPLETADO"
echo "================================================"
echo ""
echo "ANÁLISIS:"
echo "- Si ve 'text[]' en tipo de datos: Los arrays están correctamente definidos"
echo "- Si ve 'NULL': Los datos nunca se guardaron"
echo "- Si ve 'EMPTY ARRAY': Los datos se guardaron como array vacío"
echo "- Si ve 'HAS DATA': Los datos existen en la BD"
echo ""
echo "SIGUIENTE PASO:"
echo "Si los datos existen en BD pero no llegan al frontend:"
echo "  1. Revisar logs del backend: docker logs fenix_backend_prod"
echo "  2. Agregar console.log en SwotEditor useEffect"
echo "  3. Verificar response del API en Network tab del navegador"
