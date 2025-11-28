# Enterprise Chaining MCP Server

A refined and unified Model Context Protocol (MCP) server that combines intelligent tool chaining, route optimization, sequential thinking, time management, development guidance, monitoring, analytics, security, and compliance capabilities. This server discovers available MCP servers on your system, analyzes their tools, validates tool chains, and provides a complete enterprise-grade toolkit for complex task execution with awesome-copilot integration.

## Features

### Core Chaining Capabilities

- **Smart Server Discovery**: Automatically discovers MCP servers from `~/.cursor/mcp.json` and other configuration locations
- **Tool Analysis**: Analyzes available tools and their capabilities
- **Route Optimization**: Generates intelligent suggestions for tool chaining based on optimization criteria
- **Sequential Thinking Integration**: Works with sequential thinking MCP for complex workflow analysis
- **Tool Chain Validation**: Validates tool chains for correctness, dependencies, and security issues
- **Performance Analysis**: Analyzes tool chain performance with optimization recommendations

### Awesome Copilot Integration

- **Collections Access**: Browse and search development collections (TypeScript, Python, React, etc.)
- **Instructions Loading**: Access detailed development instructions and guides
- **Smart Caching**: Efficient storage and retrieval of development resources
- **Expert Guidance**: Direct access to curated development knowledge and best practices

### Advanced Thinking Capabilities

- **Sequential Thinking**: Dynamic problem-solving through structured thinking process
- **Thought Branching**: Support for alternative reasoning paths and revisions
- **Context Preservation**: Maintains thinking context across multiple steps
- **Brainstorming**: Generate creative ideas using multiple approaches (creative, analytical, practical, innovative)
- **Idea Evaluation**: Automatic evaluation and prioritization of generated ideas
- **Workflow Orchestration**: Execute complex multi-server workflows with dependency management

### Time Management

- **Timezone Support**: Get current time in any IANA timezone
- **Time Conversion**: Convert times between different timezones
- **DST Handling**: Automatic daylight saving time detection

### Enterprise Capabilities

- **Monitoring & Analytics**: System health monitoring, performance bottleneck analysis, tool usage analytics
- **Security & Compliance**: Vulnerability assessment, compliance audit workflows, data privacy protection
- **Tool Chain Verification**: Validate tool chains for correctness, dependencies, and security issues
- **Performance Optimization**: Analyze and optimize tool chain performance with actionable recommendations

### Technical Features

- **Comprehensive Validation**: Uses Zod schemas for robust data validation
- **Production Ready**: Clean project structure with proper `.gitignore` and build system
- **Unified Interface**: Single server providing all functionality
- **Enhanced Components**: Refined implementations of sequential thinking and time management
- **Robust Error Handling**: Improved validation and error handling across all components
- **Enhanced Time Management**: Better timezone handling with proper DST detection
- **Advanced Sequential Thinking**: Enhanced thought processing with branching and revision support
- **Awesome Copilot Integration**: Direct access to curated development collections and instructions
- **40 Prompts & 12 Resource Sets**: Comprehensive collection covering development, orchestration, MCP ecosystem workflows, monitoring, analytics, security, and compliance guidance
- **Intelligent Tool Guidance**: Structured guidance to help models effectively use available toolsets

## Prebuilt Prompts & Resource Sets

The chaining MCP server now includes a comprehensive collection of **42 prebuilt prompts and 11 resource sets** designed to help models effectively use the available toolsets for development, debugging, orchestration, monitoring, analytics, security, and compliance workflows. The collection now includes extensive **tool-chaining resources** with ready-made chains for common development scenarios, plus enterprise-grade monitoring and security resources.

The prompts are organized into specialized categories including MCP ecosystem exploration, cross-server orchestration, time-sensitive operations, intelligent routing, collaborative development, and **advanced tool chaining**.

**Tool Chaining Resources:**

- **5 specialized resource sets** for tool chaining covering project analysis, implementation, debugging, cross-server orchestration, and CI/CD
- **6 advanced tool-chaining prompts** for complex workflows and enterprise-scale orchestration
- **Comprehensive chain templates** with step-by-step execution guides
- **Cross-server workflow patterns** leveraging multiple MCP servers
- **Production-ready orchestration** chains for enterprise environments

**Enterprise Resources:**

- **5 monitoring & analytics prompts** for system health, performance analysis, and optimization
- **5 security & compliance prompts** for vulnerability assessment, audit workflows, and incident response
- **Enterprise-grade resource sets** for observability, reliability, security assessment, and compliance management

### Prebuilt Prompts

Prebuilt prompts provide structured guidance for specific development tasks:

- **Development Prompts**: Project analysis, feature implementation, code refactoring
- **Debugging Prompts**: Error tracing, performance optimization, security auditing, multi-server debugging
- **Analysis Prompts**: Dependency analysis, tool chaining basics, capability mapping
- **MCP Ecosystem**: Server discovery, cross-server orchestration, intelligent routing
- **Orchestration**: Time-sensitive tasks, dynamic workflows, enterprise integration
- **Integration**: Awesome Copilot workflows, knowledge graph enhanced chaining
- **Collaboration**: Team development orchestration, quality assurance automation
- **Optimization**: Predictive workflows, intelligent resource discovery
- **Sequential Thinking**: Complex problem-solving and thought processing workflows
- **Monitoring & Analytics**: System health monitoring, performance bottleneck analysis, tool usage analytics, workflow reliability assessment, cost optimization
- **Security & Compliance**: Vulnerability assessment, compliance audit workflows, data privacy protection, access control audit, incident response planning

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
- **Awesome Copilot Collections**: Curated collections of development resources
- **Observability Suite**: Comprehensive monitoring and observability resources for MCP ecosystems
- **Analytics Toolkit**: Advanced analytics tools and resources for MCP ecosystem optimization
- **Reliability Engineering Kit**: Resources for building and maintaining reliable MCP server ecosystems
- **Security Assessment Suite**: Comprehensive security assessment and vulnerability management resources
- **Compliance Management Suite**: Resources for managing regulatory compliance and governance
- **Privacy Protection Framework**: Resources for implementing and maintaining data privacy protections
- **Incident Response Playbook**: Comprehensive incident response resources and procedures

Each resource set contains:

- Multiple resources (prompts, workflows, templates, examples)
- Complexity rating
- Category classification
- Descriptive tags

### Tool Chain Verification Examples

#### Tool Chain Validation

```javascript
// Validate a tool chain for correctness and security
const validation = await mcpClient.callTool('validate_tool_chain', {
  toolChain: [
    {
      serverName: 'filesystem-mcp',
      toolName: 'read_file',
      parameters: { path: 'config.json' }
    },
    {
      serverName: 'filesystem-mcp',
      toolName: 'search_replace',
      parameters: { path: 'config.json', old_string: '"debug": false', new_string: '"debug": true' },
      dependsOn: ['read_file']
    }
  ],
  checkCircularDependencies: true,
  checkToolAvailability: true,
  checkParameterCompatibility: true
});
console.log(validation);
```

#### Performance Analysis

```javascript
// Analyze tool chain performance and get optimization suggestions
const analysis = await mcpClient.callTool('analyze_tool_chain_performance', {
  toolChain: [
    {
      serverName: 'filesystem-mcp',
      toolName: 'list_dir',
      parameters: { path: 'src' }
    },
    {
      serverName: 'grep-mcp',
      toolName: 'grep',
      parameters: { pattern: 'TODO|FIXME', path: 'src' },
      dependsOn: ['list_dir']
    }
  ],
  includeExecutionMetrics: true,
  includeComplexityAnalysis: true,
  includeOptimizationSuggestions: true
});
console.log(analysis);
```

#### Monitoring & Analytics Prompts

```javascript
// Use the system health monitoring prompt
const healthPrompt = await mcpClient.callTool('get_prompt', {
  id: 'system-health-monitoring'
});

// Use the performance bottleneck analysis prompt
const perfPrompt = await mcpClient.callTool('get_prompt', {
  id: 'performance-bottleneck-analysis'
});
```

#### Security & Compliance Prompts

```javascript
// Use the security vulnerability assessment prompt
const securityPrompt = await mcpClient.callTool('get_prompt', {
  id: 'security-vulnerability-assessment'
});

// Use the compliance audit workflow prompt
const compliancePrompt = await mcpClient.callTool('get_prompt', {
  id: 'compliance-audit-workflow'
});
```

### Benefits for Models

These prebuilt prompts and resource sets help models:

1. **Understand Tool Capabilities**: Learn how to effectively combine and use available tools
2. **Follow Best Practices**: Apply proven workflows and techniques
3. **Handle Complex Tasks**: Break down complex problems into manageable steps
4. **Maintain Consistency**: Use standardized approaches across similar tasks
5. **Accelerate Learning**: Access expert guidance and best practices from awesome-copilot

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

Configuration

Add the chaining MCP server to your MCP client configuration:

```json
{
  "mcpServers": {
    "chaining": {
      "command": "node",
      "args": ["/path/to/chaining-mcp-server/dist/index.js"],
      "env": {
        "SEQUENTIAL_THINKING_AVAILABLE": "true",
        "AWESOME_COPILOT_ENABLED": "true",
        "RELIABILITY_MONITORING_ENABLED": "true"
      }
    }
  }
}
```

**Note:** Replace `/path/to/chaining-mcp-server` with your actual path to the chaining-mcp-server directory.

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

### Sequential Thinking Tool

#### 12. `sequentialthinking`

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

#### 13. `brainstorming`

Generate creative ideas and solutions for problems using different brainstorming approaches.

**Input**:

- `topic` (required): The topic or problem to brainstorm about
- `context` (optional): Additional context or background information
- `approach` (optional): The brainstorming approach ('creative', 'analytical', 'practical', 'innovative') - defaults to 'creative'
- `ideaCount` (optional): Number of ideas to generate (3-20) - defaults to 10
- `includeEvaluation` (optional): Whether to include evaluation and prioritization - defaults to true
- `constraints` (optional): Array of constraints or requirements to consider

**Output**: JSON object containing generated ideas with feasibility, innovation, and effort metrics, plus evaluation and recommendations.

**Approaches**:

- `creative`: Generate innovative and unconventional ideas
- `analytical`: Data-driven and logical solution generation
- `practical`: Realistic and implementable solutions
- `innovative`: Cutting-edge approaches combining multiple perspectives

#### 14. `workflow_orchestrator`

Execute complex multi-server workflows across the MCP ecosystem with dependency management and error handling.

**Input**:

- `workflowId` (required): Unique identifier for the workflow
- `name` (required): Human-readable name for the workflow
- `description` (optional): Description of what this workflow does
- `steps` (required): Array of workflow steps to execute
  - `id`: Unique identifier for this step
  - `serverName`: Name of the MCP server to execute on
  - `toolName`: Name of the tool to execute
  - `parameters`: Parameters to pass to the tool
  - `dependsOn` (optional): IDs of steps that must complete before this step
  - `outputMapping` (optional): Map outputs from this step to input parameters for dependent steps
  - `retryOnFailure` (optional): Whether to retry this step on failure
  - `maxRetries` (optional): Maximum number of retries
- `failFast` (optional): Whether to stop execution on first failure
- `timeout` (optional): Maximum execution time in milliseconds
- `variables` (optional): Global variables available to all steps

**Output**: JSON object containing workflow execution results, step-by-step status, execution time, and aggregated results.

**Key Features**:

- **Dependency Management**: Automatic handling of step dependencies and execution order
- **Parameter Passing**: Automatic passing of outputs from one step as inputs to dependent steps
- **Error Handling**: Configurable retry logic and failure handling strategies
- **Progress Tracking**: Real-time status monitoring of workflow execution
- **Timeout Support**: Configurable execution timeouts for long-running workflows
- **State Persistence**: Workflow state tracking and recovery capabilities

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

#### 23. `validate_tool_chain`

Validate tool chains for correctness, dependencies, and potential issues. Checks for circular dependencies, tool availability, and parameter compatibility.

**Input**:

- `toolChain` (required): Array of tool chain steps with server name, tool name, parameters, and dependencies
- `checkCircularDependencies` (optional): Whether to check for circular dependencies (default: true)
- `checkToolAvailability` (optional): Whether to verify tools exist on their servers (default: true)
- `checkParameterCompatibility` (optional): Whether to check parameter compatibility (default: true)

**Output**: JSON object with validation results including errors, warnings, and overall validity status.

#### 24. `analyze_tool_chain_performance`

Analyze performance metrics and efficiency of tool chains. Provides execution time estimates, complexity analysis, and optimization suggestions.

**Input**:

- `toolChain` (required): Array of tool chain steps to analyze
- `includeExecutionMetrics` (optional): Whether to include execution time estimates (default: true)
- `includeComplexityAnalysis` (optional): Whether to analyze complexity metrics (default: true)
- `includeOptimizationSuggestions` (optional): Whether to provide optimization suggestions (default: true)

**Output**: JSON object with performance metrics, complexity analysis, and optimization recommendations.

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

### `chaining://sequential/state`

Returns a JSON object with the current state of sequential thinking sessions, including thought history and active session status.

### `chaining://workflows/status`

Returns a JSON object with the status of active and completed workflow orchestrations, including execution progress and results.

### `chaining://tool-chains`

Returns a JSON collection of comprehensive tool chaining resources including prompts and resource sets specifically designed for complex development workflows and orchestration patterns.

### `chaining://tool-chains/overview`

Returns a JSON overview of available tool chaining resources organized by category and complexity level, providing insights into the tool chaining capabilities.

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

### Brainstorming

```javascript
// Generate creative ideas for a product feature
const creativeIdeas = await mcpClient.callTool('brainstorming', {
  topic: 'user onboarding experience',
  approach: 'creative',
  ideaCount: 8,
  constraints: ['must be mobile-friendly', 'budget under $50k']
});

// Generate practical solutions for a technical problem
const practicalSolutions = await mcpClient.callTool('brainstorming', {
  topic: 'database performance optimization',
  context: 'high-traffic e-commerce platform',
  approach: 'practical',
  ideaCount: 6,
  includeEvaluation: true
});

// Generate analytical approaches for data analysis
const analyticalIdeas = await mcpClient.callTool('brainstorming', {
  topic: 'customer churn prediction',
  approach: 'analytical',
  constraints: ['must use existing data', 'prediction accuracy > 85%']
});
```

### Workflow Orchestration

```javascript
// Execute a multi-server research workflow
const researchWorkflow = await mcpClient.callTool('workflow_orchestrator', {
  workflowId: 'research-workflow-001',
  name: 'AI Technology Research Pipeline',
  description: 'Comprehensive research on AI technologies using multiple MCP servers',
  steps: [
    {
      id: 'search-trends',
      serverName: 'google-search-mcp',
      toolName: 'search_trends',
      parameters: {
        topics: ['artificial intelligence', 'machine learning'],
        timeframe: '6M',
        includePredictions: true
      }
    },
    {
      id: 'academic-research',
      serverName: 'google-search-mcp',
      toolName: 'academic_search',
      parameters: {
        query: 'artificial intelligence trends 2024',
        maxResults: 5
      },
      dependsOn: ['search-trends']
    },
    {
      id: 'content-analysis',
      serverName: 'google-search-mcp',
      toolName: 'content_summarizer',
      parameters: {
        urls: ['output://academic-research.results'], // Using output mapping
        maxLength: 500
      },
      dependsOn: ['academic-research'],
      outputMapping: {
        'urls': 'academic-research.results.urls' // Map output to input
      }
    }
  ],
  failFast: false,
  timeout: 300000 // 5 minutes
});

// Check workflow status
const workflowStatus = await mcpClient.readResource('chaining://workflows/status');
console.log('Active workflows:', workflowStatus);
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

// Get sequential thinking state
const sequentialState = await mcpClient.readResource('chaining://sequential/state');
console.log(sequentialState);

// Get comprehensive tool chaining resources
const toolChains = await mcpClient.readResource('chaining://tool-chains');
console.log('Available tool chains:', toolChains);

// Get tool chaining overview
const toolChainsOverview = await mcpClient.readResource('chaining://tool-chains/overview');
console.log('Tool chaining overview:', toolChainsOverview);
```

## Environment Variables

- `SEQUENTIAL_THINKING_AVAILABLE`: Set to 'true' to enable sequential thinking integration
- `MCP_SERVERS`: JSON string containing additional MCP server configurations
- `DISABLE_THOUGHT_LOGGING`: Set to 'true' to disable sequential thinking thought logging
- `AWESOME_COPILOT_ENABLED`: Set to 'false' to disable awesome-copilot integration

## Development

### Project Structure

```
src/
├── index.ts                           # Main entry point
├── server.ts                          # Clean orchestrator (220 lines, fully modularized)
├── types.ts                           # Type definitions and Zod schemas
├── core/
│   ├── discovery.ts                   # Server discovery logic
│   └── optimizer.ts                   # Route optimization algorithms
├── managers/
│   ├── brainstorming-manager.ts       # Brainstorming functionality
│   ├── sequential-thinking-manager.ts # Sequential thinking processing
│   ├── workflow-orchestrator.ts       # Workflow orchestration
│   ├── reliability-manager.ts         # System reliability management
│   ├── time-manager.ts                # Time and timezone management
│   └── memory-manager.ts              # Memory and knowledge management
├── integrations/
│   ├── awesome-copilot-integration.ts # Awesome Copilot integration
│   └── sequential-integration.ts      # Sequential thinking integration
├── prompts/
│   ├── prompt-definitions.ts          # Prompt and resource set data definitions
│   ├── prompt-handlers.ts             # Dynamic prompt generation and validation logic
│   └── prompt-registry.ts             # Registry for managing prompts and resource sets (40 prompts, 12 resource sets)
├── config/
│   ├── config-loader.ts               # Configuration loading utilities
│   └── discovery-config.ts            # Discovery configuration
├── utils/
│   └── schema-utils.ts                # Schema utility functions
├── handlers/
│   └── request-handlers.ts            # Central tool execution dispatcher
├── tools/
│   ├── tool-registry.ts               # Tool definitions and listing (22 tools)
│   ├── core-chaining-tools.ts         # Core chaining tool schemas (6 tools)
│   ├── awesome-copilot-tools.ts       # Awesome Copilot tool schemas (6 tools)
│   ├── sequential-thinking-tools.ts   # Sequential thinking tool schemas (2 tools)
│   ├── time-management-tools.ts       # Time management tool schemas (2 tools)
│   ├── prompt-resource-tools.ts       # Prompt/resource tool schemas (4 tools)
│   └── validation-analysis-tools.ts   # Validation/analysis tool schemas (4 tools)
└── resources/
    ├── resource-registry.ts           # Resource definitions and handlers
    ├── resource-definitions.ts        # Static resource metadata (13 resources)
    └── resource-handlers.ts           # Dynamic resource content generation
```

### Building

```bash
npm run build    # Build TypeScript to JavaScript
npm run dev      # Watch mode for development
npm run clean    # Clean dist directory
```

### Testing

#### Local Testing

```bash
node dist/index.js
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
3. Avoiding duplicate functionality (database operations are handled by Project-Guardian)

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
