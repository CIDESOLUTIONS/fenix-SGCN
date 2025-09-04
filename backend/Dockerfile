# ============================
# STAGE 1: Dependencias
# ============================
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Librerías necesarias para Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup prisma ./prisma
RUN npm install
RUN npx prisma generate

# ============================
# STAGE 2: Construcción
# ============================
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiamos el código fuente y dependencias
COPY --chown=appuser:appgroup . .
COPY --from=deps /usr/src/app/node_modules ./node_modules

# 🔑 Corrección de permisos
RUN chown -R appuser:appgroup .

USER appuser
RUN npm run build

# ============================
# STAGE 3: Producción
# ============================
FROM node:18-alpine AS production
WORKDIR /usr/src/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiamos sólo lo necesario
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /usr/src/app/prisma ./prisma
COPY --chown=appuser:appgroup package*.json ./

# (Opcional) Prisma generate en prod, asegura engines correctos
RUN npx prisma generate

USER appuser
EXPOSE 3001
CMD ["node", "dist/main"]
