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

# Instalar TODAS las dependencias
RUN npm install --legacy-peer-deps

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# ============================
# STAGE 2: Producción
# ============================
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Librerías necesarias
RUN apk add --no-cache bash openssl libc6-compat

# Crear usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar package.json
COPY --from=builder --chown=appuser:appgroup /usr/src/app/package*.json ./

# Instalar solo producción
RUN npm install --omit=dev --legacy-peer-deps

# Copiar Prisma schema
COPY --from=builder --chown=appuser:appgroup /usr/src/app/prisma ./prisma

# Generar Prisma Client en producción
RUN npx prisma generate

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
