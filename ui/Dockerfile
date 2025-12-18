ARG NODE_VERSION=22.0.0
FROM node:${NODE_VERSION}-slim as base
COPY package*.json ./
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
