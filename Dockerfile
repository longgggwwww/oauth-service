###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Use the official Node.js image with Alpine for a smaller footprint
FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies using npm
# 'npm ci' is preferred over 'npm install' for reproducible builds
RUN npm ci

# Generate Prisma Client
# This is required to have the client available for the build step
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

# Set the environment to production
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
# This keeps the image size small
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./dist

# CRITICAL: Copy the generated Prisma Client from the development stage
# Because we pruned devDependencies (including the Prisma CLI), we cannot run 
# 'npx prisma generate' here. We must copy the generated files.
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=development /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Start the server using the production build
CMD ["node", "dist/src/main.js"]