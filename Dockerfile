# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Set dummy DATABASE_URL for build time (Prisma generate needs it but doesn't connect)
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Set dummy DATABASE_URL for Prisma generate
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies and Prisma Client
RUN npm ci --omit=dev && npm install @prisma/client

# Generate Prisma Client
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/keys ./keys

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/src/main.js"]

