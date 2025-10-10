# Docker Configuration for Chaining MCP Server

This document explains how to configure the Chaining MCP Server to work with Docker in your `mcp.json` file.

## Configuration Options

### Option 1: Docker Run Command (Recommended)

```json
{
  "mcpServers": {
    "chaining": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/home/azzar/project/MCPservers/chaining-mcp-server/data:/app/data",
        "-v",
        "/home/azzar/.cursor/mcp.json:/home/mcpuser/.cursor/mcp.json:ro",
        "chaining-mcp-server"
      ],
      "env": {
        "NODE_ENV": "production",
        "MEMORY_FILE_PATH": "/app/data/memory.json",
        "SEQUENTIAL_THINKING_AVAILABLE": "true"
      }
    }
  }
}
```

### Option 2: Docker Compose (Alternative)

If you prefer to use docker-compose, you can run the container first and then connect to it:

```json
{
  "mcpServers": {
    "chaining": {
      "command": "docker",
      "args": [
        "exec",
        "-i",
        "chaining-mcp-server",
        "npm",
        "start"
      ],
      "env": {}
    }
  }
}
```

**Note:** For this option, you need to start the container first:
```bash
docker compose up -d
```

### Option 3: Local Development (Fallback)

If Docker is not available or you prefer local development:

```json
{
  "mcpServers": {
    "chaining": {
      "command": "node",
      "args": [
        "/home/azzar/project/MCPservers/chaining-mcp-server/dist/index.js"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/home/azzar/project/MCPservers/chaining-mcp-server/data/memory.json"
      }
    }
  }
}
```

## Setup Instructions

### 1. Build the Docker Image

First, build the Docker image:

```bash
cd /home/azzar/project/MCPservers/chaining-mcp-server
docker build -t chaining-mcp-server .
```

If you encounter network issues, you can try:

```bash
# Use a different registry or proxy
docker build --network=host -t chaining-mcp-server .
```

### 2. Create Data Directory

```bash
mkdir -p /home/azzar/project/MCPservers/chaining-mcp-server/data
```

### 3. Update mcp.json

Choose one of the configuration options above and update your `/home/azzar/.cursor/mcp.json` file.

### 4. Test the Configuration

Restart Cursor and test the MCP server connection.

## Volume Mounts Explained

- `/home/azzar/project/MCPservers/chaining-mcp-server/data:/app/data` - Persistent storage for memory and knowledge graph data
- `/home/azzar/.cursor/mcp.json:/home/mcpuser/.cursor/mcp.json:ro` - Read-only access to MCP configuration for server discovery

## Environment Variables

- `NODE_ENV=production` - Optimizes Node.js for production
- `MEMORY_FILE_PATH=/app/data/memory.json` - Path to memory storage file
- `SEQUENTIAL_THINKING_AVAILABLE=true` - Enables sequential thinking features

## Troubleshooting

### Docker Build Issues

If you encounter network issues during build:

1. **Check Docker daemon**: `docker ps`
2. **Try different network**: `docker build --network=host`
3. **Use local registry**: Build from a local Node.js image
4. **Check DNS**: Ensure internet connectivity

### Permission Issues

If you encounter permission issues:

```bash
# Fix data directory permissions
sudo chown -R $USER:$USER /home/azzar/project/MCPservers/chaining-mcp-server/data
chmod 755 /home/azzar/project/MCPservers/chaining-mcp-server/data
```

### Container Not Starting

Check container logs:

```bash
docker logs chaining-mcp-server
```

## Performance Considerations

- **Memory**: The container is configured with 512MB memory limit
- **CPU**: No CPU limits set by default
- **Storage**: Data is persisted in the host filesystem
- **Network**: Uses Docker's default bridge network

## Security Notes

- Container runs as non-root user (`mcpuser`)
- MCP configuration is mounted read-only
- No unnecessary ports exposed
- Resource limits applied to prevent resource exhaustion
