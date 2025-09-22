# Workflow de Dependencias -- Fenix-SGCN

## 1. 🔄 Actualización de dependencias

Cuando quieras actualizar librerías en **frontend o backend**:

``` bash
# Para frontend
docker compose -f docker-compose.prod.yml exec -u root fenix_frontend npm update

# Para backend
docker compose -f docker-compose.prod.yml exec -u root fenix_backend npm update
```

Esto actualiza los paquetes según las restricciones del `package.json`.

------------------------------------------------------------------------

## 2. 🛠️ Revisión y reparación de vulnerabilidades

Después de cada `update`, ejecutar:

``` bash
# Frontend
docker compose -f docker-compose.prod.yml exec -u root fenix_frontend npm audit fix --force

# Backend
docker compose -f docker-compose.prod.yml exec -u root fenix_backend npm audit fix --force
```

Esto aplica parches de seguridad automáticamente.

------------------------------------------------------------------------

## 3. 🧹 Reconstrucción de contenedores

Para asegurarte de que no quedan residuos de versiones anteriores:

``` bash
rm -rf frontend/node_modules frontend/.next backend/node_modules backend/dist
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

------------------------------------------------------------------------

## 4. ✅ Verificación

Revisa los logs de cada servicio:

``` bash
docker compose -f docker-compose.prod.yml logs -f fenix_frontend
docker compose -f docker-compose.prod.yml logs -f fenix_backend
```

Confirma que **no hay errores de dependencias** y que la app arranca en
`http://localhost`.

------------------------------------------------------------------------

## 5. 🗂️ Commit y registro en Git

Una vez validado:

``` bash
git add frontend/package.json frontend/package-lock.json backend/package.json backend/package-lock.json
git commit -m "chore: actualización de dependencias seguras"
git push
```

------------------------------------------------------------------------

## 6. 🔖 Versionado del proyecto

Si la actualización es importante (ejemplo: cambio de Next.js o Prisma):

``` bash
git tag -a vX.Y.Z -m "Actualización dependencias críticas"
git push origin vX.Y.Z
```

------------------------------------------------------------------------

# 🚨 Reglas de oro

1.  **Nunca subir `node_modules`** (ya está en `.gitignore`).

2.  Siempre ejecutar `npm audit fix --force` tras un `update`.

3.  Si Prisma cambia versión → regenerar cliente:

    ``` bash
    docker compose -f docker-compose.prod.yml exec fenix_backend npx prisma generate
    ```

4.  Después de cambios mayores → correr migraciones y pruebas antes de
    commit.
