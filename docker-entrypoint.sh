#!/bin/bash
set -e

# Function to log with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Chaining MCP Server..."

# Ensure data directory exists
mkdir -p /app/data

# Set proper permissions for data directory
chmod 755 /app/data

# Check if memory file exists, create if not
if [ ! -f "$MEMORY_FILE_PATH" ]; then
    log "Creating initial memory file at $MEMORY_FILE_PATH"
    echo '{"entities": {}, "relations": []}' > "$MEMORY_FILE_PATH"
    chmod 644 "$MEMORY_FILE_PATH"
fi

# Validate that the built application exists
if [ ! -f "/app/dist/index.js" ]; then
    log "ERROR: Built application not found. Please run 'npm run build' first."
    exit 1
fi

# Check Node.js version
log "Node.js version: $(node --version)"
log "NPM version: $(npm --version)"

# Log environment variables
log "Environment: $NODE_ENV"
log "Memory file path: $MEMORY_FILE_PATH"
log "Sequential thinking available: ${SEQUENTIAL_THINKING_AVAILABLE:-false}"

# Handle graceful shutdown
cleanup() {
    log "Received shutdown signal, cleaning up..."
    exit 0
}

trap cleanup SIGTERM SIGINT

# Start the application
log "Starting MCP server..."
exec "$@"
