FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_APP_BASE_API=https://www.crongcr7.xyz:8077
ENV VITE_APP_BASE_API=${VITE_APP_BASE_API}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

FROM node:22-alpine

LABEL maintainer="demand-cooking"

WORKDIR /app

ENV NODE_ENV=production \
    TZ=Asia/Shanghai \
    FRONTEND_PORT=8078

COPY --from=builder /app/dist ./dist
COPY docker/frontend-server.mjs ./frontend-server.mjs

EXPOSE 8078

CMD ["node", "frontend-server.mjs"]
