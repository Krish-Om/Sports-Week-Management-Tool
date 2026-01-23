# Build stage
FROM oven/bun:latest as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage - use Bun runtime
FROM oven/bun:latest

WORKDIR /app

# Install serve using bun
RUN bun add -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:5173').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

# Start the application
CMD ["bunx", "serve", "-s", "dist", "-l", "5173"]
