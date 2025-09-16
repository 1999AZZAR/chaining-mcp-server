# Comprehensive Chaining MCP Server

A refined and unified Model Context Protocol (MCP) server that combines intelligent tool chaining, route optimization, persistent memory, sequential thinking, and time management capabilities. This server discovers available MCP servers on your system, analyzes their tools, and provides a complete toolkit for complex task execution with enhanced implementations from the "add to chaining" components.

## Features

### Core Chaining Capabilities
- **Smart Server Discovery**: Automatically discovers MCP servers from `~/.cursor/mcp.json` and other configuration locations
- **Tool Analysis**: Analyzes available tools and their capabilities
- **Route Optimization**: Generates intelligent suggestions for tool chaining based on optimization criteria
- **Sequential Thinking Integration**: Works with sequential thinking MCP for complex workflow analysis

### Memory & Knowledge Management
- **Persistent Knowledge Graph**: Stores entities, relations, and observations across sessions
- **Entity Management**: Create, update, and delete entities with associated observations
- **Relationship Tracking**: Define and manage relationships between entities
- **Search & Retrieval**: Search across entities, types, and observations

### Advanced Thinking Capabilities
- **Sequential Thinking**: Dynamic problem-solving through structured thinking process
- **Thought Branching**: Support for alternative reasoning paths and revisions
- **Context Preservation**: Maintains thinking context across multiple steps

### Time Management
- **Timezone Support**: Get current time in any IANA timezone
- **Time Conversion**: Convert times between different timezones
- **DST Handling**: Automatic daylight saving time detection

### Technical Features
- **Comprehensive Validation**: Uses Zod schemas for robust data validation
- **Production Ready**: Clean project structure with proper `.gitignore` and build system
- **Unified Interface**: Single server providing all functionality
- **Enhanced Components**: Refined implementations of memory, sequential thinking, and time management
- **Robust Error Handling**: Improved validation and error handling across all components
- **Enhanced Time Management**: Better timezone handling with proper DST detection
- **Advanced Sequential Thinking**: Enhanced thought processing with branching and revision support

## Recent Refinements

This server has been refined to properly integrate and enhance the implementations from the "add to chaining" components:

### Memory Component Enhancements
- **Robust Knowledge Graph**: Enhanced entity and relation management
- **Improved Search**: Better search functionality across entities and observations
- **Persistent Storage**: Reliable file-based storage with proper error handling

### Sequential Thinking Enhancements
- **Enhanced Validation**: More robust input validation with detailed error messages
- **Advanced Features**: Added thought history, statistics, and branch management
- **Better Error Handling**: Improved error handling and recovery mechanisms

### Time Management Enhancements
- **Improved Timezone Handling**: Better timezone detection and conversion
- **Enhanced DST Detection**: More accurate daylight saving time detection
- **Additional Utilities**: Added common timezone list and local timezone detection

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

### Core Chaining Tools

#### 1. `list_mcp_servers`
Lists all discovered MCP servers on the system.

**Input**: None

**Output**: JSON object containing server information including name, command, args, environment variables, and capabilities.

#### 2. `analyze_tools`
Analyzes available tools from discovered MCP servers.

**Input**:
- `serverName` (optional): Filter by specific server name
- `category` (optional): Filter by tool category

**Output**: JSON object containing tool analysis, grouped by server and category.

#### 3. `generate_route_suggestions`
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

#### 4. `analyze_with_sequential_thinking`
Analyzes complex workflows using sequential thinking.

**Input**:
- `problem` (required): The problem to analyze
- `criteria` (optional): Optimization criteria
- `maxThoughts` (optional): Maximum number of thoughts (1-20, default: 10)

**Output**: JSON object containing sequential thinking analysis, thoughts, and suggestions.

#### 5. `get_tool_chain_analysis`
Gets comprehensive analysis of available tools and suggested routes.

**Input**:
- `input` (required): Input description for analysis
- `criteria` (optional): Optimization criteria

**Output**: JSON object containing comprehensive analysis including total tools, average complexity, and route recommendations.

### Memory & Knowledge Graph Tools

#### 6. `create_entities`
Create multiple new entities in the knowledge graph.

**Input**:
- `entities` (required): Array of entity objects with name, entityType, and observations

**Output**: JSON array of created entities.

#### 7. `create_relations`
Create multiple new relations between entities in the knowledge graph.

**Input**:
- `relations` (required): Array of relation objects with from, to, and relationType

**Output**: JSON array of created relations.

#### 8. `add_observations`
Add new observations to existing entities in the knowledge graph.

**Input**:
- `observations` (required): Array of observation objects with entityName and contents

**Output**: JSON array showing added observations per entity.

#### 9. `delete_entities`
Delete multiple entities and their associated relations from the knowledge graph.

**Input**:
- `entityNames` (required): Array of entity names to delete

**Output**: Success message.

#### 10. `delete_observations`
Delete specific observations from entities in the knowledge graph.

**Input**:
- `deletions` (required): Array of deletion objects with entityName and observations

**Output**: Success message.

#### 11. `delete_relations`
Delete multiple relations from the knowledge graph.

**Input**:
- `relations` (required): Array of relation objects to delete

**Output**: Success message.

#### 12. `read_graph`
Read the entire knowledge graph.

**Input**: None

**Output**: Complete knowledge graph with all entities and relations.

#### 13. `search_nodes`
Search for nodes in the knowledge graph based on a query.

**Input**:
- `query` (required): Search query to match against entity names, types, and observation content

**Output**: Filtered knowledge graph with matching entities and relations.

#### 14. `open_nodes`
Open specific nodes in the knowledge graph by their names.

**Input**:
- `names` (required): Array of entity names to retrieve

**Output**: Knowledge graph containing requested entities and their relations.

### Sequential Thinking Tool

#### 15. `sequentialthinking`
A detailed tool for dynamic and reflective problem-solving through thoughts.

**Input**:
- `thought` (required): Your current thinking step
- `nextThoughtNeeded` (required): Whether another thought step is needed
- `thoughtNumber` (required): Current thought number
- `totalThoughts` (required): Estimated total thoughts needed
- `isRevision` (optional): Whether this revises previous thinking
- `revisesThought` (optional): Which thought is being reconsidered
- `branchFromThought` (optional): Branching point thought number
- `branchId` (optional): Branch identifier
- `needsMoreThoughts` (optional): If more thoughts are needed

**Output**: JSON object with thought processing results and metadata.

### Time Management Tools

#### 16. `get_current_time`
Get current time in a specific timezone.

**Input**:
- `timezone` (required): IANA timezone name (e.g., 'America/New_York', 'Europe/London')

**Output**: JSON object with timezone, datetime, day of week, and DST status.

#### 17. `convert_time`
Convert time between timezones.

**Input**:
- `source_timezone` (required): Source IANA timezone name
- `time` (required): Time to convert in 24-hour format (HH:MM)
- `target_timezone` (required): Target IANA timezone name

**Output**: JSON object with source and target times, plus time difference.

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

### Memory Management
```javascript
// Create entities in knowledge graph
const entities = await mcpClient.callTool('create_entities', {
  entities: [
    {
      name: 'John_Smith',
      entityType: 'person',
      observations: ['Software engineer', 'Lives in San Francisco']
    }
  ]
});

// Create relations
const relations = await mcpClient.callTool('create_relations', {
  relations: [
    {
      from: 'John_Smith',
      to: 'TechCorp',
      relationType: 'works_at'
    }
  ]
});

// Search the knowledge graph
const searchResults = await mcpClient.callTool('search_nodes', {
  query: 'software engineer'
});
```

### Sequential Thinking
```javascript
// Use sequential thinking for complex problem solving
const thought1 = await mcpClient.callTool('sequentialthinking', {
  thought: 'I need to analyze this complex problem step by step',
  nextThoughtNeeded: true,
  thoughtNumber: 1,
  totalThoughts: 5
});

const thought2 = await mcpClient.callTool('sequentialthinking', {
  thought: 'Let me break down the problem into smaller components',
  nextThoughtNeeded: true,
  thoughtNumber: 2,
  totalThoughts: 5
});
```

### Time Management
```javascript
// Get current time in different timezones
const nyTime = await mcpClient.callTool('get_current_time', {
  timezone: 'America/New_York'
});

const londonTime = await mcpClient.callTool('get_current_time', {
  timezone: 'Europe/London'
});

// Convert time between timezones
const conversion = await mcpClient.callTool('convert_time', {
  source_timezone: 'America/New_York',
  time: '14:30',
  target_timezone: 'Asia/Tokyo'
});
```

## Environment Variables

- `SEQUENTIAL_THINKING_AVAILABLE`: Set to 'true' to enable sequential thinking integration
- `MCP_SERVERS`: JSON string containing additional MCP server configurations
- `MEMORY_FILE_PATH`: Path to the memory storage JSON file (default: `memory.json` in the server directory)
- `DISABLE_THOUGHT_LOGGING`: Set to 'true' to disable sequential thinking thought logging

## Development

### Project Structure
```
src/
├── index.ts                      # Main entry point
├── server.ts                     # MCP server implementation
├── discovery.ts                  # Server discovery logic
├── optimizer.ts                  # Route optimization algorithms
├── sequential-integration.ts     # Sequential thinking integration
├── memory-manager.ts             # Knowledge graph memory management
├── sequential-thinking-manager.ts # Sequential thinking processing
├── time-manager.ts               # Time and timezone management
├── schema-utils.ts               # Schema utility functions
└── types.ts                      # Type definitions and Zod schemas
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
