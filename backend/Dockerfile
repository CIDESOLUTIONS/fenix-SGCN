# ============================
# STAGE 1: Builder completo
# ============================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Librerías necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma

# Instalar TODAS las dependencias con versiones exactas
RUN npm install --legacy-peer-deps

# Generar Prisma Client con la versión instalada
RUN npm run prisma:generate

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# ============================
# STAGE 2: Producción
# ============================
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Librerías necesarias - INCLUIR libssl1.1 para Prisma
RUN apk add --no-cache bash openssl openssl1.1-compat libc6-compat

# Crear usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar node_modules completo del builder (incluye Prisma generado)
COPY --from=builder --chown=appuser:appgroup /usr/src/app/node_modules ./node_modules

# Copiar package.json
COPY --from=builder --chown=appuser:appgroup /usr/src/app/package*.json ./

# Copiar Prisma schema
COPY --from=builder --chown=appuser:appgroup /usr/src/app/prisma ./prisma

# Copiar build
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist

# Copiar entrypoint
COPY --chown=appuser:appgroup docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3001

USER appuser
EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
