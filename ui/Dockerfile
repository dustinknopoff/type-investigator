# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Copy dependency files first
COPY package.json bun.lock ./

# Install dependencies directly in the app directory
RUN bun install --frozen-lockfile --production

# Copy the rest of the app
COPY . .

# Fix permissions
RUN chown -R bun:bun /usr/src/app

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
