# Multi-stage build para optimizar el tamaño de la imagen
FROM node:18-alpine AS builder

# Instalar dependencias del sistema necesarias para compilar
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar todas las dependencias (incluyendo dev para compilar)
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN npm run build

# Stage de producción
FROM node:18-alpine AS production

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S appgroup \
    && adduser -S appuser -u 1001 -G appgroup

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción
COPY package*.json ./

# Copiar archivo de credenciales de Firebase
COPY src/config/firebase/firebase-service-account.json ./firebase-service-account.json

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos compilados desde el stage builder
COPY --from=builder /app/dist ./dist

# Cambiar ownership a appuser (coincide con el usuario creado)
RUN chown -R appuser:appgroup /app
USER appuser

# Exponer puerto
EXPOSE 3000

# Usar dumb-init como entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
