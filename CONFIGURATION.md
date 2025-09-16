# MCP Server Discovery Configuration

The MCP Server Discovery system is now fully configurable and no longer relies on hardcoded values. This document explains how to customize the discovery behavior.

## Configuration Sources

The system loads configuration from multiple sources in the following order:

1. **Environment Variables** (highest priority)
2. **Configuration Files**
3. **Default Configuration** (lowest priority)

## Environment Variables

You can configure the discovery system using environment variables:

```bash
# Configuration paths (JSON array)
export MCP_DISCOVERY_CONFIG_PATHS='["~/.cursor/mcp.json", "~/.config/mcp/servers.json"]'

# Essential servers (JSON array)
export MCP_ESSENTIAL_SERVERS='[{"name": "my-server", "command": "npx", "args": ["my-mcp-server"]}]'

# Fallback tools (JSON array)
export MCP_FALLBACK_TOOLS='[{"serverPattern": "my-server", "tools": [...]}]'

# Complexity rules (JSON array)
export MCP_COMPLEXITY_RULES='[{"pattern": "custom", "complexity": 7, "description": "Custom operations"}]'

# Duration rules (JSON array)
export MCP_DURATION_RULES='[{"pattern": "custom", "duration": 3000, "description": "Custom operations"}]'

# Category rules (JSON array)
export MCP_CATEGORY_RULES='[{"pattern": "custom", "category": "custom", "description": "Custom category"}]'
```

## Configuration Files

Create a `discovery-config.json` file in one of these locations:

- `./discovery-config.json` (project root)
- `./.mcp/discovery-config.json`
- `~/.config/mcp/discovery-config.json`
- `~/.mcp/discovery-config.json`

### Example Configuration File

```json
{
  "configPaths": [
    "~/.cursor/mcp.json",
    "~/.config/mcp/servers.json",
    "~/.mcp/servers.json",
    "./mcp-servers.json",
    "./.mcp/servers.json"
  ],
  "essentialServers": [
    {
      "name": "my-custom-server",
      "command": "npx",
      "args": ["-y", "@myorg/my-mcp-server"],
      "env": {},
      "description": "My custom MCP server",
      "version": "1.0.0",
      "capabilities": {
        "tools": true,
        "resources": false,
        "prompts": false
      }
    }
  ],
  "fallbackTools": [
    {
      "serverPattern": "my-server|custom",
      "tools": [
        {
          "name": "my_tool",
          "description": "My custom tool",
          "inputSchema": {
            "type": "object",
            "properties": {
              "param": { "type": "string", "description": "Parameter" }
            },
            "required": ["param"]
          },
          "category": "custom",
          "estimatedComplexity": 3,
          "estimatedDuration": 500
        }
      ]
    }
  ],
  "complexityRules": [
    { "pattern": "read|get|list", "complexity": 2, "description": "Simple read operations" },
    { "pattern": "write|create|update", "complexity": 3, "description": "Write operations" },
    { "pattern": "search|find|query", "complexity": 4, "description": "Search operations" },
    { "pattern": "execute|run|command", "complexity": 5, "description": "Command execution" },
    { "pattern": "thinking|analysis|complex", "complexity": 6, "description": "Complex analysis" },
    { "pattern": "custom", "complexity": 7, "description": "Custom operations" }
  ],
  "durationRules": [
    { "pattern": "read|get|list", "duration": 100, "description": "Fast read operations" },
    { "pattern": "write|create|update", "duration": 200, "description": "Medium write operations" },
    { "pattern": "search|find|query", "duration": 2000, "description": "Slow search operations" },
    { "pattern": "execute|run|command", "duration": 1000, "description": "Medium command execution" },
    { "pattern": "thinking|analysis", "duration": 1000, "description": "Analysis operations" },
    { "pattern": "custom", "duration": 3000, "description": "Custom operations" }
  ],
  "categoryRules": [
    { "pattern": "file|directory|path", "category": "filesystem", "description": "File system operations" },
    { "pattern": "search|web|url", "category": "web", "description": "Web operations" },
    { "pattern": "github|repository|commit", "category": "github", "description": "GitHub operations" },
    { "pattern": "terminal|command|execute", "category": "terminal", "description": "Terminal operations" },
    { "pattern": "wikipedia|knowledge|article", "category": "knowledge", "description": "Knowledge operations" },
    { "pattern": "thinking|analysis|reason", "category": "analysis", "description": "Analysis operations" },
    { "pattern": "custom", "category": "custom", "description": "Custom operations" }
  ]
}
```

## Configuration Components

### configPaths

Array of paths where MCP server configurations can be found. Supports:
- `~` for home directory
- Relative paths (relative to current working directory)
- Absolute paths

### essentialServers

Array of servers that are always available. These servers are added to the discovery list regardless of configuration files.

### fallbackTools

Array of fallback tool configurations. Each entry contains:
- `serverPattern`: Regex pattern to match server names
- `tools`: Array of tool definitions

### complexityRules

Rules for estimating tool complexity (1-10 scale):
- `pattern`: Text pattern to match in tool name/description
- `complexity`: Complexity score
- `description`: Human-readable description

### durationRules

Rules for estimating tool execution duration (in milliseconds):
- `pattern`: Text pattern to match in tool name/description
- `duration`: Duration in milliseconds
- `description`: Human-readable description

### categoryRules

Rules for categorizing tools:
- `pattern`: Text pattern to match in tool name/description
- `category`: Category name
- `description`: Human-readable description

## Runtime Configuration Updates

You can update the configuration at runtime using the discovery instance:

```typescript
const discovery = new MCPServerDiscovery();

// Reload configuration from files/environment
await discovery.reloadConfiguration();

// Update specific configuration
await discovery.updateConfiguration({
  complexityRules: [
    { pattern: "new-pattern", complexity: 8, description: "New rule" }
  ]
});

// Get current configuration
const config = discovery.getConfiguration();
```

## Migration from Hardcoded Values

The system now uses configuration instead of hardcoded values. If you were relying on specific hardcoded behavior, you can:

1. Copy the default configuration from `discovery-config.example.json`
2. Modify it to match your needs
3. Save it as `discovery-config.json` in your project root

This ensures backward compatibility while providing full configurability.
