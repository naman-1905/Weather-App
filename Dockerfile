# ---------- 1) Base image for building deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

# For some native deps Next/SWC may need
RUN apk add --no-cache libc6-compat

# Copy only lockfiles & package manifests first (best layer caching)
# If you use yarn/pnpm, adjust the files accordingly.
COPY package.json package-lock.json* ./

# Install all deps for build (dev deps included)
# Use BuildKit cache mount for super-fast rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------- 2) Builder: compile Next.js ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Bring node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the source
COPY . .

# Build Next.js with standalone output (add to next.config.js if not default):
#   module.exports = { output: 'standalone' }
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Optionally prune dev deps (standalone doesn’t need them, but keep just in case you run any runtime deps)
RUN npm prune --omit=dev

# ---------- 3) Runtime: ultra-small image ----------
# You can use distroless for smallest footprint; switch to node:20-alpine if you need a shell.
# FROM gcr.io/distroless/nodejs20-debian12 AS runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy the standalone server and static assets produced by Next build
# .next/standalone contains server.js and all required node_modules for runtime
COPY --from=builder /app/.next/standalone ./ 
# Static assets must live under .next/static in the same path
COPY --from=builder /app/.next/static ./.next/static
# Public assets if you have any
COPY --from=builder /app/public ./public

# Healthcheck (uncomment if you keep alpine, distroless lacks curl/wget)
# RUN apk add --no-cache curl
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#   CMD curl -fsS http://127.0.0.1:${PORT}/ || exit 1

USER nextjs
EXPOSE 3000

# The standalone build exposes server.js as the entrypoint
CMD ["node", "server.js", "-H", "0.0.0.0"]
