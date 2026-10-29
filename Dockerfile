# --- Етап 1: збірка клієнта ---
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# --- Етап 2: сервер, який віддає API та зібраний клієнт ---
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY server/package*.json ./server/
RUN npm ci --omit=dev --prefix server
COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:5000/api/health || exit 1
USER node
CMD ["node", "server/src/index.js"]
