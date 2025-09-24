#!/bin/sh
set -e

echo "🔄 Esperando a que la base de datos esté lista..."
sleep 5

echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "🌱 Ejecutando seed de datos iniciales (solo si es necesario)..."
# Simplemente ejecutar el seed, que ahora tiene la lógica para verificar si ya existen datos
if [ -f "dist/prisma/seed.js" ]; then
  node dist/prisma/seed.js || echo "⚠️  Seed completado con algunos errores (esto es normal si ya hay datos)"
elif [ -f "prisma/seed.js" ]; then
  node prisma/seed.js || echo "⚠️  Seed completado con algunos errores (esto es normal si ya hay datos)"
else
  echo "⚠️  No se encontró archivo seed compilado, saltando..."
fi

echo "✅ Base de datos lista"
echo "🚀 Iniciando aplicación NestJS..."
exec node dist/main
