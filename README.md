# Chaining MCP Server

A Model Context Protocol (MCP) server for intelligent tool chaining and route optimization. This server discovers available MCP servers on your system, analyzes their tools, and suggests optimal routes for completing complex tasks.

## Features

- **Smart Server Discovery**: Automatically discovers MCP servers from `~/.cursor/mcp.json` and other configuration locations
- **Tool Analysis**: Analyzes available tools and their capabilities
- **Route Optimization**: Generates intelligent suggestions for tool chaining based on optimization criteria
- **Sequential Thinking Integration**: Works with sequential thinking MCP for complex workflow analysis
- **Comprehensive Validation**: Uses Zod schemas for robust data validation
- **Production Ready**: Clean project structure with proper `.gitignore` and build system

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Add the chaining MCP server to your MCP client configuration:

```json
{
  "mcpServers": {
    "chaining-mcp": {
      "command": "node",
      "args": ["/path/to/chaining-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Available Tools

### 1. `list_mcp_servers`
Lists all discovered MCP servers on the system.

**Input**: None

**Output**: JSON object containing server information including name, command, args, environment variables, and capabilities.

### 2. `analyze_tools`
Analyzes available tools from discovered MCP servers.

**Input**:
- `serverName` (optional): Filter by specific server name
- `category` (optional): Filter by tool category

**Output**: JSON object containing tool analysis, grouped by server and category.

### 3. `generate_route_suggestions`
Generates optimal route suggestions for a given task.

**Input**:
- `task` (required): The task or problem to solve
- `criteria` (optional): Optimization criteria object

**Criteria Options**:
- `prioritizeSpeed`: Optimize for speed
- `prioritizeSimplicity`: Optimize for simplicity
- `prioritizeReliability`: Optimize for reliability
- `maxComplexity`: Maximum complexity level (1-10)
- `maxDuration`: Maximum duration in milliseconds
- `requiredCapabilities`: Array of required capabilities
- `excludedTools`: Array of tools to exclude

**Output**: JSON object containing suggested routes with tools, estimated duration, complexity, confidence, and reasoning.

### 4. `analyze_with_sequential_thinking`
Analyzes complex workflows using sequential thinking.

**Input**:
- `problem` (required): The problem to analyze
- `criteria` (optional): Optimization criteria
- `maxThoughts` (optional): Maximum number of thoughts (1-20, default: 10)

**Output**: JSON object containing sequential thinking analysis, thoughts, and suggestions.

### 5. `get_tool_chain_analysis`
Gets comprehensive analysis of available tools and suggested routes.

**Input**:
- `input` (required): Input description for analysis
- `criteria` (optional): Optimization criteria

**Output**: JSON object containing comprehensive analysis including total tools, average complexity, and route recommendations.

## Available Resources

### `chaining://servers`
Returns a JSON list of all discovered MCP servers.

### `chaining://tools`
Returns a JSON list of all available tools from discovered servers.

### `chaining://analysis`
Returns a JSON summary of the current analysis state.

## Usage Examples

### Basic Server Discovery
```javascript
// List all discovered MCP servers
const servers = await mcpClient.callTool('list_mcp_servers', {});
console.log(servers);
```

### Tool Analysis
```javascript
// Analyze tools by category
const analysis = await mcpClient.callTool('analyze_tools', {
  category: 'filesystem'
});
console.log(analysis);
```

### Route Generation
```javascript
// Generate route suggestions for a task
const routes = await mcpClient.callTool('generate_route_suggestions', {
  task: 'Read a file and search for specific content',
  criteria: {
    prioritizeSpeed: true,
    maxComplexity: 5
  }
});
console.log(routes);
```

### Sequential Thinking Analysis
```javascript
// Analyze complex workflow with sequential thinking
const analysis = await mcpClient.callTool('analyze_with_sequential_thinking', {
  problem: 'Design a complex data processing pipeline',
  criteria: {
    prioritizeReliability: true,
    maxDuration: 10000
  },
  maxThoughts: 15
});
console.log(analysis);
```

## Environment Variables

- `SEQUENTIAL_THINKING_AVAILABLE`: Set to 'true' to enable sequential thinking integration
- `MCP_SERVERS`: JSON string containing additional MCP server configurations

## Development

### Project Structure
```
src/
├── index.ts              # Main entry point
├── server.ts             # MCP server implementation
├── discovery.ts          # Server discovery logic
├── optimizer.ts          # Route optimization algorithms
├── sequential-integration.ts # Sequential thinking integration
└── types.ts              # Type definitions and Zod schemas
```

### Building
```bash
npm run build    # Build TypeScript to JavaScript
npm run dev      # Watch mode for development
npm run clean    # Clean dist directory
```

### Testing
The server can be tested by running it directly:
```bash
node dist/index.js
```

## Integration with Sequential Thinking MCP

This server is designed to work seamlessly with the sequential thinking MCP server. When both are available, the chaining server can:

1. Use sequential thinking to analyze complex problems
2. Generate more intelligent route suggestions
3. Provide detailed reasoning for recommendations
4. Handle multi-step workflow planning

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please create an issue in the repository.
