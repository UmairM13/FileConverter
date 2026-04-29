# ── Stage 1: Build frontend ───────────────────────────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /app/web
COPY apps/web/package*.json ./
RUN npm i
COPY apps/web .
RUN npm run build

# ── Stage 2: Build backend ────────────────────────────────────────────────────
FROM node:20-alpine AS backend
WORKDIR /app/api
COPY apps/api/package*.json ./
RUN npm i
COPY apps/api .
RUN npm run build

# ── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN apk add --no-cache qpdf

WORKDIR /app

# Copy built API
COPY --from=backend /app/api/dist ./dist
COPY --from=backend /app/api/node_modules ./node_modules
COPY --from=backend /app/api/package.json ./

# Copy built frontend into expected location
COPY --from=frontend /app/web/dist ./web/dist

ENV NODE_ENV=production
EXPOSE 8181

CMD ["node", "dist/server.js"]