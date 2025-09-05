# ============================
# STAGE 1: Dependencias
# ============================
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Librerías necesarias para Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar dependencias
COPY --chown=appuser:appgroup package*.json ./ 
COPY --chown=appuser:appgroup prisma ./prisma

# Instalar dependencias
RUN npm install --legacy-peer-deps --unsafe-perm

# Generar Prisma Client
RUN npx prisma generate

# Corrección automática de vulnerabilidades
RUN npm audit fix --force || true

# ============================
# STAGE 2: Construcción
# ============================
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar dependencias desde deps
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma

# Copiar todo el código fuente
COPY --chown=appuser:appgroup . .

# 🔑 Corrección de permisos
RUN chown -R appuser:appgroup .

USER appuser

# Construir aplicación NestJS
RUN npm run build

# ============================
# STAGE 3: Producción
# ============================
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar node_modules y Prisma
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma

# Copiar build
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist
COPY --chown=appuser:appgroup package*.json ./

# Generar cliente de Prisma en la imagen final
RUN npx prisma generate

USER appuser

EXPOSE 3001
CMD ["node", "dist/main"]
