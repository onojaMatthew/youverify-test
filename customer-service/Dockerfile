# Use Node.js official image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY .babelrc ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the application while devDependencies are still available
RUN npm run build

# Verify the build was successful
RUN ls -la /app/build/ || echo "Build directory contents:"

# Remove devDependencies to reduce image size
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Change ownership of the app directory
RUN chown -R nodeuser:nodejs /app

USER nodeuser

# Expose port
EXPOSE 5200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5200/health || exit 1

# Start the application using the pre-built version
CMD ["node", "./build/server.js"]