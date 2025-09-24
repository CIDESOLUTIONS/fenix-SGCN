# ============================
# STAGE 1: Dependencias
# ============================
FROM node:20-alpine AS deps
WORKDIR /usr/src/app

# Librerías necesarias para Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar archivos de dependencias
COPY --chown=appuser:appgroup package*.json ./ 
COPY --chown=appuser:appgroup prisma ./prisma

# Instalar dependencias de producción
RUN npm ci --only=production --legacy-peer-deps

# Generar Prisma Client
RUN npx prisma generate

# ============================
# STAGE 2: Builder - Dependencias de desarrollo y Build
# ============================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Librerías necesarias
RUN apk add --no-cache openssl libc6-compat

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar archivos de dependencias
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup prisma ./prisma

# Instalar TODAS las dependencias (incluyendo dev)
RUN npm ci --legacy-peer-deps

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY --chown=appuser:appgroup . .

# Corrección de permisos
RUN chown -R appuser:appgroup .

USER appuser

# Construir aplicación NestJS
RUN npm run build

# Compilar seed.ts si existe
RUN if [ -f "prisma/seed.ts" ]; then \
      npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --resolveJsonModule; \
    fi

# ============================
# STAGE 3: Producción
# ============================
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Instalar bash y openssl para el entrypoint y Prisma
RUN apk add --no-cache bash openssl libc6-compat

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar node_modules de producción y Prisma
COPY --from=deps --chown=appuser:appgroup /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=appuser:appgroup /usr/src/app/prisma ./prisma

# Copiar build de la aplicación
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /usr/src/app/package*.json ./

# Copiar entrypoint script
COPY --chown=appuser:appgroup docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Generar cliente de Prisma en la imagen final
RUN npx prisma generate

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

USER appuser

EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
