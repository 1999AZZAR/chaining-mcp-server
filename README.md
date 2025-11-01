# Comprehensive Chaining MCP Server

A refined and unified Model Context Protocol (MCP) server that combines intelligent tool chaining, route optimization, sequential thinking, time management, and development guidance capabilities. This server discovers available MCP servers on your system, analyzes their tools, and provides a complete toolkit for complex task execution with enhanced reliability and awesome-copilot integration.

## Features

### Core Chaining Capabilities
- **Smart Server Discovery**: Automatically discovers MCP servers from `~/.cursor/mcp.json` and other configuration locations
- **Tool Analysis**: Analyzes available tools and their capabilities
- **Route Optimization**: Generates intelligent suggestions for tool chaining based on optimization criteria
- **Sequential Thinking Integration**: Works with sequential thinking MCP for complex workflow analysis

### Awesome Copilot Integration
- **Collections Access**: Browse and search development collections (TypeScript, Python, React, etc.)
- **Instructions Loading**: Access detailed development instructions and guides
- **Smart Caching**: Efficient storage and retrieval of development resources
- **Expert Guidance**: Direct access to curated development knowledge and best practices

### Reliability & Monitoring
- **Performance Metrics**: Track response times, error rates, and uptime
- **Health Monitoring**: Automated health checks and system status
- **Retry Logic**: Exponential backoff for failed operations
- **Enhanced Error Handling**: Context-aware error reporting with actionable suggestions

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
- **Enhanced Components**: Refined implementations of sequential thinking and time management
- **Robust Error Handling**: Improved validation and error handling across all components
- **Enhanced Time Management**: Better timezone handling with proper DST detection
- **Advanced Sequential Thinking**: Enhanced thought processing with branching and revision support
- **Awesome Copilot Integration**: Direct access to curated development collections and instructions
- **Reliability Monitoring**: Performance metrics and health checks with automatic recovery
- **Prebuilt Prompts & Resources**: Curated collection of prompts and resource sets for common development tasks
- **Intelligent Tool Guidance**: Structured guidance to help models effectively use available toolsets

## Prebuilt Prompts & Resource Sets

The chaining MCP server now includes a comprehensive collection of prebuilt prompts and resource sets designed to help models effectively use the available toolsets for development, debugging, analysis, and common workflows.

### Prebuilt Prompts

Prebuilt prompts provide structured guidance for specific development tasks:

- **Development Prompts**: Project analysis, feature implementation, code refactoring
- **Debugging Prompts**: Error tracing, performance optimization, security auditing
- **Analysis Prompts**: Dependency analysis, tool chaining basics
- **Awesome Copilot**: Access to development collections and instructions
- **Sequential Thinking**: Complex problem-solving workflows

Each prompt includes:
- Clear task description and objectives
- Step-by-step guidance
- Expected tools to use
- Complexity level (low/medium/high)
- Relevant tags for easy discovery

### Resource Sets

Resource sets are curated collections of prompts, workflows, templates, and examples for specific scenarios:

- **Development Starter Kit**: Essential resources for new development tasks
- **Debugging Toolbox**: Comprehensive debugging techniques and workflows
- **Performance Optimization Kit**: Tools for performance analysis and improvement
- **Tool Chaining Mastery**: Advanced techniques for complex tool orchestration
- **Awesome Copilot Collections**: Curated collections of development resources and instructions

Each resource set contains:
- Multiple resources (prompts, workflows, templates, examples)
- Complexity rating
- Category classification
- Descriptive tags

### Benefits for Models

These prebuilt prompts and resource sets help models:

1. **Understand Tool Capabilities**: Learn how to effectively combine and use available tools
2. **Follow Best Practices**: Apply proven workflows and techniques
3. **Handle Complex Tasks**: Break down complex problems into manageable steps
4. **Maintain Consistency**: Use standardized approaches across similar tasks
5. **Accelerate Learning**: Access expert guidance and best practices from awesome-copilot

## Installation

### Option 1: Docker (Recommended)

1. Clone or download this repository
2. Build and run with Docker Compose:
   ```bash
   docker compose up --build
   ```
   
   Or build and run manually:
   ```bash
   docker build -t chaining-mcp-server .
   docker run -d --name chaining-mcp-server -v ./data:/app/data chaining-mcp-server
   ```

### Option 2: Local Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Docker Configuration

### Docker Compose (Recommended)

The included `docker compose.yml` provides a complete setup with:

- **Automatic building**: Builds the image from source
- **Volume mounting**: Persistent data storage in `./data` directory
- **Health checks**: Monitors container health
- **Resource limits**: Memory limits for stability
- **Network isolation**: Dedicated Docker network

To use Docker Compose:

```bash
# Start the service
docker compose up -d

# View logs
docker compose logs -f

# Stop the service
docker compose down

# Rebuild and restart
docker compose up --build -d
```

### Convenience Scripts

Use the included `docker-scripts.sh` for easy management:

```bash
# Make script executable (first time only)
chmod +x docker-scripts.sh

# Build the image
./docker-scripts.sh build

# Start the service
./docker-scripts.sh start

# View logs
./docker-scripts.sh logs

# Check status
./docker-scripts.sh status

# Open shell in container
./docker-scripts.sh shell

# Stop the service
./docker-scripts.sh stop

# Restart the service
./docker-scripts.sh restart

# Clean up everything
./docker-scripts.sh clean

# Show help
./docker-scripts.sh help
```

### Docker Run Commands

For manual Docker deployment:

```bash
# Build the image
docker build -t chaining-mcp-server .

# Run with volume for data persistence
docker run -d \
  --name chaining-mcp-server \
  -v $(pwd)/data:/app/data \
  -e SEQUENTIAL_THINKING_AVAILABLE=true \
  -e AWESOME_COPILOT_ENABLED=true \
  -e RELIABILITY_MONITORING_ENABLED=true \
  chaining-mcp-server

# Run in interactive mode for debugging
docker run -it --rm \
  -v $(pwd)/data:/app/data \
  chaining-mcp-server /bin/bash
```

### Environment Variables

Configure the container with these environment variables:

- `NODE_ENV`: Set to `production` for optimized performance
- `SEQUENTIAL_THINKING_AVAILABLE`: Enable sequential thinking features (default: `true`)
- `AWESOME_COPILOT_ENABLED`: Enable awesome-copilot integration (default: `true`)
- `RELIABILITY_MONITORING_ENABLED`: Enable reliability monitoring (default: `true`)
- `DISABLE_THOUGHT_LOGGING`: Disable thought logging (default: `false`)

### Volume Mounts

The Docker setup includes these volume mounts:

- `./data:/app/data`: Persistent storage for server data and configurations
- `~/.cursor/mcp.json:/home/mcpuser/.cursor/mcp.json:ro`: Read-only access to MCP configuration

## Configuration

Add the chaining MCP server to your MCP client configuration:

### For Docker deployment:
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
        "/path/to/chaining-mcp-server/data:/app/data",
        "-v",
        "/path/to/.cursor/mcp.json:/home/mcpuser/.cursor/mcp.json:ro",
        "chaining-mcp-server"
      ],
      "env": {
        "NODE_ENV": "production",
        "SEQUENTIAL_THINKING_AVAILABLE": "true",
        "AWESOME_COPILOT_ENABLED": "true",
        "RELIABILITY_MONITORING_ENABLED": "true"
      }
    }
  }
}
```

**Note:** Replace `/path/to/` with your actual paths. For example:
- `/home/azzar/project/MCPservers/chaining-mcp-server/data` for data directory
- `/home/azzar/.cursor/mcp.json` for MCP configuration

### For local installation:
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

### Awesome Copilot Tools

#### 6. `awesome_copilot_list_collections`
List all available awesome-copilot collections.

**Input**: None

**Output**: JSON object containing collections with their metadata and items.

#### 7. `awesome_copilot_search_collections`
Search awesome-copilot collections by keywords.

**Input**:
- `query` (required): Search query to match against collection names, descriptions, or tags

**Output**: JSON object with matching collections and their metadata.

#### 8. `awesome_copilot_get_collection`
Get a specific awesome-copilot collection by ID.

**Input**:
- `id` (required): The collection ID to retrieve

**Output**: JSON object containing the complete collection with all its items.

#### 9. `awesome_copilot_search_instructions`
Search awesome-copilot instructions by keywords.

**Input**:
- `keywords` (required): Keywords to search for in instruction titles, descriptions, or tags

**Output**: JSON object with matching instructions and their metadata.

#### 10. `awesome_copilot_load_instruction`
Load a specific awesome-copilot instruction.

**Input**:
- `mode` (required): The instruction mode (e.g., "instructions", "prompts")
- `filename` (required): The filename of the instruction to load

**Output**: JSON object containing the instruction content and metadata.

#### 11. `awesome_copilot_get_integration_status`
Get the status of awesome-copilot integration.

**Input**: None

**Output**: JSON object with integration status, collections count, and last update time.

### Reliability Tools

#### 12. `reliability_get_metrics`
Get comprehensive reliability metrics and performance statistics.

**Input**: None

**Output**: JSON object with performance metrics, error rates, and request history.

#### 13. `reliability_health_check`
Perform a health check on the chaining server.

**Input**: None

**Output**: JSON object with health status, metrics, and recommendations.

#### 14. `reliability_reset_metrics`
Reset reliability metrics (useful for testing or after configuration changes).

**Input**: None

**Output**: Success message confirming metrics reset.

#### 15. `reliability_configure_retry`
Configure retry behavior for tool execution.

**Input**:
- `maxRetries` (optional): Maximum number of retry attempts (0-10)
- `backoffMultiplier` (optional): Exponential backoff multiplier (1-5)
- `initialDelay` (optional): Initial delay in milliseconds (100-10000)
- `maxDelay` (optional): Maximum delay in milliseconds (1000-120000)

**Output**: JSON object confirming the new retry configuration.

### Sequential Thinking Tool

#### 16. `sequentialthinking`
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

#### 17. `get_current_time`
Get current time in a specific timezone.

**Input**:
- `timezone` (required): IANA timezone name (e.g., 'America/New_York', 'Europe/London')

**Output**: JSON object with timezone, datetime, day of week, and DST status.

#### 18. `convert_time`
Convert time between timezones.

**Input**:
- `source_timezone` (required): Source IANA timezone name
- `time` (required): Time to convert in 24-hour format (HH:MM)
- `target_timezone` (required): Target IANA timezone name

**Output**: JSON object with source and target times, plus time difference.

#### 19. `get_prompt`
Get a specific prebuilt prompt by ID.

**Input**:
- `id` (required): The ID of the prompt to retrieve

**Output**: JSON object containing the complete prompt with its content and metadata.

#### 20. `search_prompts`
Search for prompts by keywords, category, or tags.

**Input**:
- `query` (required): Search query to match against prompt names, descriptions, categories, or tags
- `category` (optional): Filter by category (development, debugging, etc.)
- `complexity` (optional): Filter by complexity level (low, medium, high)

**Output**: JSON object with matching prompts and their metadata.

#### 21. `get_resource_set`
Get a specific resource set by ID.

**Input**:
- `id` (required): The ID of the resource set to retrieve

**Output**: JSON object containing the complete resource set with all its resources.

#### 22. `search_resource_sets`
Search for resource sets by keywords, category, or tags.

**Input**:
- `query` (required): Search query to match against resource set names, descriptions, categories, or tags
- `category` (optional): Filter by category (development, debugging, etc.)
- `complexity` (optional): Filter by complexity level (low, medium, high)

**Output**: JSON object with matching resource sets and their metadata.

## Available Resources

### `chaining://servers`
Returns a JSON list of all discovered MCP servers.

### `chaining://tools`
Returns a JSON list of all available tools from discovered servers.

### `chaining://analysis`
Returns a JSON summary of the current analysis state.

### `chaining://prompts`
Returns a JSON collection of all available prebuilt prompts for common development tasks.

### `chaining://resources`
Returns a JSON collection of curated resource sets for different development scenarios.

### `chaining://prompts/overview`
Returns a JSON overview of available prompts by category and complexity level.

### `chaining://awesome-copilot/collections`
Returns a JSON collection of all available awesome-copilot collections with their metadata.

### `chaining://awesome-copilot/instructions`
Returns a JSON collection of all available awesome-copilot instructions with their metadata.

### `chaining://awesome-copilot/status`
Returns a JSON object with the current status of awesome-copilot integration.

### `chaining://reliability/metrics`
Returns a JSON object with comprehensive reliability metrics and performance statistics.

### `chaining://reliability/health`
Returns a JSON object with the current health status of the chaining server.

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

### Awesome Copilot Integration
```javascript
// List all available collections
const collections = await mcpClient.callTool('awesome_copilot_list_collections', {});

// Search for TypeScript-related collections
const tsCollections = await mcpClient.callTool('awesome_copilot_search_collections', {
  query: 'typescript'
});

// Get a specific collection
const collection = await mcpClient.callTool('awesome_copilot_get_collection', {
  id: 'typescript-mcp-development'
});

// Search for development instructions
const instructions = await mcpClient.callTool('awesome_copilot_search_instructions', {
  keywords: 'mcp server'
});

// Load a specific instruction
const instruction = await mcpClient.callTool('awesome_copilot_load_instruction', {
  mode: 'instructions',
  filename: 'typescript-mcp-server.instructions.md'
});
```

### Reliability Monitoring
```javascript
// Get current reliability metrics
const metrics = await mcpClient.callTool('reliability_get_metrics', {});

// Perform a health check
const health = await mcpClient.callTool('reliability_health_check', {});

// Configure retry behavior
const config = await mcpClient.callTool('reliability_configure_retry', {
  maxRetries: 5,
  backoffMultiplier: 2,
  initialDelay: 500,
  maxDelay: 15000
});

// Reset metrics after configuration changes
await mcpClient.callTool('reliability_reset_metrics', {});
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

### Prebuilt Prompts & Resources

```javascript
// Get a specific prebuilt prompt
const prompt = await mcpClient.callTool('get_prompt', {
  id: 'analyze-project-structure'
});
console.log(prompt);

// Search for prompts by keyword
const searchResults = await mcpClient.callTool('search_prompts', {
  query: 'debugging',
  category: 'development',
  complexity: 'medium'
});
console.log(searchResults);

// Get a resource set
const resourceSet = await mcpClient.callTool('get_resource_set', {
  id: 'development-starter-kit'
});
console.log(resourceSet);

// Search for resource sets
const resourceSearch = await mcpClient.callTool('search_resource_sets', {
  query: 'performance',
  complexity: 'high'
});
console.log(resourceSearch);
```

### Accessing Resources

```javascript
// Get all available prompts
const allPrompts = await mcpClient.readResource('chaining://prompts');
console.log(allPrompts);

// Get all resource sets
const allResources = await mcpClient.readResource('chaining://resources');
console.log(allResources);

// Get prompts overview
const overview = await mcpClient.readResource('chaining://prompts/overview');
console.log(overview);

// Get awesome-copilot collections
const collections = await mcpClient.readResource('chaining://awesome-copilot/collections');
console.log(collections);

// Get awesome-copilot instructions
const instructions = await mcpClient.readResource('chaining://awesome-copilot/instructions');
console.log(instructions);

// Get awesome-copilot integration status
const status = await mcpClient.readResource('chaining://awesome-copilot/status');
console.log(status);

// Get reliability metrics
const metrics = await mcpClient.readResource('chaining://reliability/metrics');
console.log(metrics);

// Get health check
const health = await mcpClient.readResource('chaining://reliability/health');
console.log(health);
```

## Environment Variables

- `SEQUENTIAL_THINKING_AVAILABLE`: Set to 'true' to enable sequential thinking integration
- `MCP_SERVERS`: JSON string containing additional MCP server configurations
- `DISABLE_THOUGHT_LOGGING`: Set to 'true' to disable sequential thinking thought logging
- `AWESOME_COPILOT_ENABLED`: Set to 'false' to disable awesome-copilot integration
- `RELIABILITY_MONITORING_ENABLED`: Set to 'false' to disable reliability monitoring

## Development

### Docker Development Setup

For development with Docker, use the override file:

```bash
# Copy the example override file
cp docker compose.override.yml.example docker compose.override.yml

# Customize the override file as needed
# Then start with development configuration
docker compose up --build
```

### Project Structure
```
src/
├── index.ts                           # Main entry point
├── server.ts                          # MCP server implementation
├── discovery.ts                       # Server discovery logic
├── optimizer.ts                       # Route optimization algorithms
├── sequential-integration.ts          # Sequential thinking integration
├── sequential-thinking-manager.ts     # Sequential thinking processing
├── time-manager.ts                    # Time and timezone management
├── awesome-copilot-integration.ts     # Awesome Copilot integration
├── reliability-manager.ts             # Reliability monitoring and error handling
├── prompt-manager.ts                  # Prebuilt prompts and resource sets
├── schema-utils.ts                    # Schema utility functions
└── types.ts                           # Type definitions and Zod schemas
```

### Building
```bash
# Local development
npm run build    # Build TypeScript to JavaScript
npm run dev      # Watch mode for development
npm run clean    # Clean dist directory

# Docker development
./docker-scripts.sh build  # Build Docker image
./docker-scripts.sh start  # Start with Docker
```

### Testing

#### Local Testing
```bash
node dist/index.js
```

#### Docker Testing
```bash
# Build the image (if network issues, try with --network=host)
docker build -t chaining-mcp-server .

# Test the container
docker run --rm -it chaining-mcp-server npm start

# Or use docker-compose
docker compose up --build
```

#### Troubleshooting Docker Build Issues

If you encounter network issues during Docker build:

1. **Check Docker connectivity:**
   ```bash
   docker pull hello-world
   ```

2. **Try building with host network:**
   ```bash
   docker build --network=host -t chaining-mcp-server .
   ```

3. **Use a different base image:**
   ```dockerfile
   FROM node:18-slim
   # Instead of node:18-alpine
   ```

4. **Build without cache:**
   ```bash
   docker build --no-cache -t chaining-mcp-server .
   ```

## Integration with Other MCP Servers

This server is designed to work seamlessly with other MCP servers in your ecosystem:

### Sequential Thinking MCP Integration
When the sequential thinking MCP server is available, the chaining server can:
1. Use sequential thinking to analyze complex problems
2. Generate more intelligent route suggestions
3. Provide detailed reasoning for recommendations
4. Handle multi-step workflow planning

### Awesome Copilot Integration
The server integrates with awesome-copilot to provide:
1. Access to curated development collections and instructions
2. Expert guidance for various programming languages and frameworks
3. Best practices and development workflows
4. Structured learning resources for different skill levels

### Project-Guardian Integration
The chaining server complements Project-Guardian by:
1. Providing high-level coordination and orchestration
2. Offering development guidance and workflow management
3. Maintaining reliability monitoring and error recovery
4. Avoiding duplicate functionality (database operations are handled by Project-Guardian)

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
