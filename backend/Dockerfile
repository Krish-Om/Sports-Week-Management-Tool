# Single stage build with Bun runtime
FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code and entrypoint script
COPY . .
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:3001/api/health').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

# Start the application with entrypoint (runs migrations before starting)
ENTRYPOINT ["/app/docker-entrypoint.sh"]
