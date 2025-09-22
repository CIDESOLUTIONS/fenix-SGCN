#!/bin/sh
set -e

echo "🔄 Esperando a que la base de datos esté lista..."
sleep 5

echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "🌱 Ejecutando seed de datos..."
# Verificar si existe el archivo seed compilado
if [ -f "dist/prisma/seed.js" ]; then
  node dist/prisma/seed.js
elif [ -f "prisma/seed.js" ]; then
  node prisma/seed.js
else
  echo "⚠️  No se encontró archivo seed compilado, saltando..."
fi

echo "✅ Base de datos lista"
echo "🚀 Iniciando aplicación NestJS..."
exec node dist/main
