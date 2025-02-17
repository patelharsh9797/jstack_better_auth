FROM oven/bun:alpine AS base
RUN apk add --no-cache libc6-compat

ARG WEB_PORT
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ARG EMAIL_VERIFICATION_CALLBACK_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG BASE_URL
ARG NEXT_PUBLIC_BASE_URL
ARG RESERND_API_KEY
ARG EMAIL_FROM

ENV WEB_PORT=${WEB_PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV NEXT_PUBLIC_BETTER_AUTH_URL=${NEXT_PUBLIC_BETTER_AUTH_URL}
ENV EMAIL_VERIFICATION_CALLBACK_URL=${EMAIL_VERIFICATION_CALLBACK_URL}
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ENV BASE_URL=${BASE_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV RESERND_API_KEY=${RESERND_API_KEY}
ENV EMAIL_FROM=${EMAIL_FROM}

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


FROM base AS migration
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["bun", "run", "dev"]

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3: Production server
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["bun", "run", "server.js"]