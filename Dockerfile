
# Builder stage: install deps, generate Prisma client, build app
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies and copy minimal files first for caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev) so we can run Prisma generate and build
RUN npm ci

# Copy rest of the source
COPY . .

# Ensure Prisma client is generated at build time
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Build the application (Nest.js build outputs to `dist`)
RUN npm run build

# Production stage: copy built artifacts and node_modules from builder
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what we need from builder to keep the image small
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/keys ./keys

# Expose default app port
EXPOSE 3000

# Use same start command as before
CMD ["node", "dist/src/main.js"]

