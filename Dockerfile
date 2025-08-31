# ---------- STAGE 1: Build ----------
FROM node:current-alpine AS build

# Arbeitsverzeichnis
WORKDIR /

# Package-Dateien kopieren und Dependencies installieren
COPY package*.json ./
RUN npm ci --omit=dev

# Quellcode kopieren
COPY . .

# ---------- STAGE 2: Runtime ----------
FROM node:current-alpine AS runtime

# Arbeitsverzeichnis
WORKDIR /

# Nur Produktions-Dependencies und Build-Ergebnis übernehmen
COPY --from=build /node_modules ./node_modules
COPY --from=build /src ./src

# Port für Express.js
EXPOSE 3000

# Production Mode
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
