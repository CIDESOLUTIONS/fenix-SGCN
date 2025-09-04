# ============================
# STAGE 1: Dependencias
# ============================
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Librería necesaria para Next.js en Alpine
RUN apk add --no-cache libc6-compat

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm install

# ============================
# STAGE 2: Construcción (Build)
# ============================
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# 🔑 Corrección de permisos
RUN chown -R appuser:appgroup .

USER appuser
RUN npm run build

# ============================
# STAGE 3: Producción Final
# ============================
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiamos solo lo necesario de la build
COPY --from=builder --chown=appuser:appgroup /usr/src/app/public ./public
COPY --from=builder --chown=appuser:appgroup /usr/src/app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /usr/src/app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /usr/src/app/package*.json ./

USER appuser

EXPOSE 3000
ENV PORT=3000

# Comando final para Next.js en modo prod
CMD ["node", "server.js"]
