# ============================
# STAGE 1: Dependencias
# ============================
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Librería necesaria para Next.js en Alpine
RUN apk add --no-cache libc6-compat

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar archivos de dependencias
COPY --chown=appuser:appgroup package*.json ./

# Instalar dependencias
RUN npm ci --only=production --ignore-scripts

# ============================
# STAGE 2: Construcción (Build)
# ============================
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar package files
COPY --chown=appuser:appgroup package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar node_modules de producción
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copiar todo el código fuente
COPY --chown=appuser:appgroup . .

# Asegurar permisos correctos
RUN chown -R appuser:appgroup .

USER appuser

# Build de Next.js en modo standalone
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ============================
# STAGE 3: Producción Final
# ============================
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Crear usuario seguro
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar archivos públicos
COPY --from=builder --chown=appuser:appgroup /usr/src/app/public ./public

# Copiar build standalone
COPY --from=builder --chown=appuser:appgroup /usr/src/app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /usr/src/app/.next/static ./.next/static

USER appuser

EXPOSE 3000

# Comando para Next.js standalone
CMD ["node", "server.js"]
