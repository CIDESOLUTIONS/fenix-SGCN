#!/bin/bash

# === CHEATSHEET DOCKER COMPOSE ===
# Proyecto: fenix-SGCN
# Autor: meciza

echo "========================================"
echo "   🚀 DOCKER CHEATSHEET - FENIX SGCN    "
echo "========================================"
echo "1) Ver contenedores activos"
echo "2) Ver todos los contenedores"
echo "3) Estado de docker-compose"
echo "4) Ver logs del proyecto"
echo "5) Ver logs en vivo (todos)"
echo "6) Ver logs de Postgres"
echo "7) Detener todo el stack"
echo "8) Reiniciar todo el stack"
echo "9) Reiniciar solo la base de datos"
echo "10) Conectarse a Postgres (psql)"
echo "11) Listar volúmenes"
echo "12) Inspeccionar volumen de Postgres"
echo "13) Eliminar volumen de Postgres ⚠️"
echo "0) Salir"
echo "========================================"
read -p "Seleccione una opción: " opcion

case $opcion in
  1) docker ps ;;
  2) docker ps -a ;;
  3) docker compose ps ;;
  4) docker compose logs ;;
  5) docker compose logs -f ;;
  6) docker compose logs -f fenix_db_master ;;
  7) docker compose down ;;
  8) docker compose restart ;;
  9) docker compose restart fenix_db_master ;;
  10) docker exec -it fenix_db_master psql -U meciza64 -d fenix_sgcn ;;
  11) docker volume ls ;;
  12) docker volume inspect fenix-sgcn_master_db_data ;;
  13) docker volume rm fenix-sgcn_master_db_data ;;
  0) echo "Saliendo..."; exit 0 ;;
  *) echo "Opción inválida" ;;
esac
