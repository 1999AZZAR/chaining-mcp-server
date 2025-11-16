import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { MCPServerDiscovery } from './discovery.js';
import { SmartRouteOptimizer } from './optimizer.js';
import { SequentialThinkingIntegration } from './sequential-integration.js';
import { SequentialThinkingManager } from './sequential-thinking-manager.js';
import { TimeManager } from './time-manager.js';
import { PromptManager } from './prompt-manager.js';
import { AwesomeCopilotIntegration } from './awesome-copilot-integration.js';
import { BrainstormingManager } from './brainstorming-manager.js';
import { WorkflowOrchestrator } from './workflow-orchestrator.js';
import {
  OptimizationCriteriaSchema,
  SequentialThinkingRequestSchema,
  ToolChainAnalysisSchema,
  ListMCPServersSchema,
  AnalyzeToolsSchema,
  GenerateRouteSuggestionsSchema,
  AnalyzeWithSequentialThinkingSchema,
  GetToolChainAnalysisSchema,
  SequentialThinkingSchema,
  BrainstormingSchema,
  WorkflowOrchestratorSchema,
  GetCurrentTimeSchema,
  ConvertTimeSchema,
  ValidateToolChainSchema,
  AnalyzeToolChainPerformanceSchema,
} from './types.js';
import { getToolInputSchema } from './schema-utils.js';

export class ChainingMCPServer {
  private server: Server;
  private discovery: MCPServerDiscovery;
  private optimizer: SmartRouteOptimizer;
  private sequentialIntegration: SequentialThinkingIntegration;
  private sequentialThinkingManager: SequentialThinkingManager;
  private timeManager: TimeManager;
  private promptManager: PromptManager;
  private awesomeCopilotIntegration: AwesomeCopilotIntegration;
  private brainstormingManager: BrainstormingManager;
  private workflowOrchestrator: WorkflowOrchestrator;
  private isInitialized: boolean = false;

  constructor() {
    this.server = new Server(
      {
        name: 'chaining-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.discovery = new MCPServerDiscovery();
    this.optimizer = new SmartRouteOptimizer();
    this.sequentialIntegration = new SequentialThinkingIntegration();
    this.sequentialThinkingManager = new SequentialThinkingManager();
    this.timeManager = new TimeManager();
    this.promptManager = new PromptManager();
    this.awesomeCopilotIntegration = new AwesomeCopilotIntegration();
    this.brainstormingManager = new BrainstormingManager();
    this.workflowOrchestrator = new WorkflowOrchestrator();

    this.setupHandlers();
  }

  /**
   * Setup MCP server handlers
   */
  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Original chaining tools
          {
            name: 'list_mcp_servers',
            description: 'List all discovered MCP servers on the system',
            inputSchema: getToolInputSchema(ListMCPServersSchema),
          },
          {
            name: 'analyze_tools',
            description: 'Analyze available tools from discovered MCP servers',
            inputSchema: getToolInputSchema(AnalyzeToolsSchema),
          },
          {
            name: 'generate_route_suggestions',
            description: 'Generate optimal route suggestions for a given task',
            inputSchema: getToolInputSchema(GenerateRouteSuggestionsSchema),
          },
          {
            name: 'analyze_with_sequential_thinking',
            description: 'Analyze complex workflows using sequential thinking',
            inputSchema: getToolInputSchema(AnalyzeWithSequentialThinkingSchema),
          },
          {
            name: 'get_tool_chain_analysis',
            description: 'Get comprehensive analysis of available tools and suggested routes',
            inputSchema: getToolInputSchema(GetToolChainAnalysisSchema),
          },
          // Sequential Thinking tool
          {
            name: 'sequentialthinking',
            description: `A detailed tool for dynamic and reflective problem-solving through thoughts.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out

Key features:
- You can adjust total_thoughts up or down as you progress
- You can question or revise previous thoughts
- You can add more thoughts even after reaching what seemed like the end
- You can express uncertainty and explore alternative approaches
- Not every thought needs to build linearly - you can branch or backtrack
- Generates a solution hypothesis
- Verifies the hypothesis based on the Chain of Thought steps
- Repeats the process until satisfied
- Provides a correct answer`,
            inputSchema: getToolInputSchema(SequentialThinkingSchema),
          },
          // Brainstorming tool
          {
            name: 'brainstorming',
            description: `Generate creative ideas and solutions for problems using different brainstorming approaches.
This tool helps generate innovative ideas, evaluate their feasibility, and provide structured recommendations.

Approaches available:
- creative: Generate innovative and unconventional ideas
- analytical: Data-driven and logical solution generation
- practical: Realistic and implementable solutions
- innovative: Cutting-edge approaches combining multiple perspectives

Features:
- Multiple brainstorming approaches (creative, analytical, practical, innovative)
- Idea evaluation with feasibility, innovation, and effort metrics
- Constraint-aware idea generation
- Pros and cons analysis for each idea
- Top idea recommendations with evaluation criteria`,
            inputSchema: getToolInputSchema(BrainstormingSchema),
          },
          // Workflow Orchestrator tool
          {
            name: 'workflow_orchestrator',
            description: `Execute complex multi-server workflows across the MCP ecosystem with dependency management and error handling.
This tool orchestrates the execution of multiple tools across different MCP servers in a coordinated manner.

Key Features:
- Multi-server workflow execution with dependency management
- Automatic parameter passing between workflow steps
- Error handling and retry logic
- Progress tracking and status monitoring
- Timeout and cancellation support
- Global variable management across steps

Use Cases:
- Complex data processing pipelines across multiple services
- Automated research workflows combining search, analysis, and reporting
- Multi-step project management processes
- Cross-platform data synchronization
- Automated testing and deployment pipelines`,
            inputSchema: getToolInputSchema(WorkflowOrchestratorSchema),
          },
          // Time tools
          {
            name: 'get_current_time',
            description: 'Get current time in a specific timezone',
            inputSchema: getToolInputSchema(GetCurrentTimeSchema),
          },
          {
            name: 'convert_time',
            description: 'Convert time between timezones',
            inputSchema: getToolInputSchema(ConvertTimeSchema),
          },
          // Prompt and Resource tools
          {
            name: 'get_prompt',
            description: 'Get a specific prebuilt prompt by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The ID of the prompt to retrieve',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'search_prompts',
            description: 'Search for prompts by keywords, category, or tags',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query to match against prompt names, descriptions, categories, or tags',
                },
                category: {
                  type: 'string',
                  description: 'Optional: Filter by category (development, debugging, etc.)',
                },
                complexity: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Optional: Filter by complexity level',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_resource_set',
            description: 'Get a specific resource set by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The ID of the resource set to retrieve',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'search_resource_sets',
            description: 'Search for resource sets by keywords, category, or tags',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query to match against resource set names, descriptions, categories, or tags',
                },
                category: {
                  type: 'string',
                  description: 'Optional: Filter by category (development, debugging, etc.)',
                },
                complexity: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Optional: Filter by complexity level',
                },
              },
              required: ['query'],
            },
          },
          // Awesome Copilot tools
          {
            name: 'awesome_copilot_list_collections',
            description: 'List all available awesome-copilot collections',
            inputSchema: { type: 'object', properties: {} },
          },
          {
            name: 'awesome_copilot_search_collections',
            description: 'Search awesome-copilot collections by keywords',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query to match against collection names, descriptions, or tags',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'awesome_copilot_get_collection',
            description: 'Get a specific awesome-copilot collection by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The collection ID to retrieve',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'awesome_copilot_search_instructions',
            description: 'Search awesome-copilot instructions by keywords',
            inputSchema: {
              type: 'object',
              properties: {
                keywords: {
                  type: 'string',
                  description: 'Keywords to search for in instruction titles, descriptions, or tags',
                },
              },
              required: ['keywords'],
            },
          },
          {
            name: 'awesome_copilot_load_instruction',
            description: 'Load a specific awesome-copilot instruction',
            inputSchema: {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  description: 'The instruction mode (e.g., "instructions", "prompts")',
                },
                filename: {
                  type: 'string',
                  description: 'The filename of the instruction to load',
                },
              },
              required: ['mode', 'filename'],
            },
          },
          {
            name: 'awesome_copilot_get_integration_status',
            description: 'Get the status of awesome-copilot integration',
            inputSchema: { type: 'object', properties: {} },
          },
          // Tool Chain Verification tools
          {
            name: 'validate_tool_chain',
            description: 'Validate tool chains for correctness, dependencies, and potential issues. Checks for circular dependencies, tool availability, and parameter compatibility.',
            inputSchema: getToolInputSchema(ValidateToolChainSchema),
          },
          {
            name: 'analyze_tool_chain_performance',
            description: 'Analyze performance metrics and efficiency of tool chains. Provides execution time estimates, complexity analysis, and optimization suggestions.',
            inputSchema: getToolInputSchema(AnalyzeToolChainPerformanceSchema),
          },
        ],
      };
    });

    // List resources handler
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'chaining://servers',
            name: 'MCP Servers',
            description: 'List of discovered MCP servers',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://tools',
            name: 'Available Tools',
            description: 'List of available tools from all servers',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://analysis',
            name: 'Tool Chain Analysis',
            description: 'Analysis of tool chains and optimization suggestions',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://prompts',
            name: 'Prebuilt Prompts',
            description: 'Collection of prebuilt prompts for common development tasks',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://resources',
            name: 'Resource Sets',
            description: 'Curated resource sets for different development scenarios',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://prompts/overview',
            name: 'Prompts Overview',
            description: 'Overview of available prompts by category and complexity',
            mimeType: 'application/json',
          },
          // Awesome Copilot resources
          {
            uri: 'chaining://awesome-copilot/collections',
            name: 'Awesome Copilot Collections',
            description: 'Collections of development resources from awesome-copilot',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://awesome-copilot/instructions',
            name: 'Awesome Copilot Instructions',
            description: 'Development instructions and guides from awesome-copilot',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://awesome-copilot/status',
            name: 'Awesome Copilot Integration Status',
            description: 'Status and statistics of awesome-copilot integration',
            mimeType: 'application/json',
          },
          // Sequential thinking state resource
          {
            uri: 'chaining://sequential/state',
            name: 'Sequential Thinking State',
            description: 'Current state of sequential thinking sessions and thought history',
            mimeType: 'application/json',
          },
          // Workflow orchestrator status resource
          {
            uri: 'chaining://workflows/status',
            name: 'Workflow Orchestrator Status',
            description: 'Status of active and completed workflow orchestrations',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://tool-chains',
            name: 'Tool Chaining Resources',
            description: 'Comprehensive collection of prebuilt tool chains and orchestration patterns for development workflows',
            mimeType: 'application/json',
          },
          {
            uri: 'chaining://tool-chains/overview',
            name: 'Tool Chaining Overview',
            description: 'Overview of available tool chaining resources by category and complexity level',
            mimeType: 'application/json',
          },
        ],
      };
    });

    // Read resource handler
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'chaining://servers':
          await this.ensureInitialized();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(this.discovery.getServers(), null, 2),
              },
            ],
          };

        case 'chaining://tools':
          await this.ensureInitialized();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(this.discovery.getTools(), null, 2),
              },
            ],
          };

        case 'chaining://analysis':
          await this.ensureInitialized();
          const analysis = {
            totalServers: this.discovery.getServers().length,
            totalTools: this.discovery.getTools().length,
            categories: this.getToolCategories(),
            sequentialThinkingAvailable: this.sequentialIntegration.isSequentialThinkingAvailable(),
          };
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(analysis, null, 2),
              },
            ],
          };

        case 'chaining://prompts':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  prompts: this.promptManager.getAllPrompts().map(prompt => ({
                    id: prompt.id,
                    name: prompt.name,
                    description: prompt.description,
                    category: prompt.category,
                    tags: prompt.tags,
                    complexity: prompt.complexity,
                    useCase: prompt.useCase,
                    expectedTools: prompt.expectedTools,
                  })),
                  total: this.promptManager.getAllPrompts().length,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://resources':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  resourceSets: this.promptManager.getAllResourceSets().map(set => ({
                    id: set.id,
                    name: set.name,
                    description: set.description,
                    category: set.category,
                    tags: set.tags,
                    complexity: set.complexity,
                    resourceCount: set.resources.length,
                  })),
                  total: this.promptManager.getAllResourceSets().length,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://prompts/overview':
          const overview = this.promptManager.getResourceOverview();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  ...overview,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://awesome-copilot/collections':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  collections: this.awesomeCopilotIntegration.getCollections().map(collection => ({
                    id: collection.id,
                    name: collection.name,
                    description: collection.description,
                    tags: collection.tags,
                    itemCount: collection.items.length,
                  })),
                  total: this.awesomeCopilotIntegration.getCollections().length,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://awesome-copilot/instructions':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  instructions: this.awesomeCopilotIntegration.getInstructions().map(instruction => ({
                    mode: instruction.mode,
                    filename: instruction.filename,
                    title: instruction.metadata?.title || instruction.filename,
                    description: instruction.metadata?.description || '',
                    tags: instruction.metadata?.tags || [],
                    category: instruction.metadata?.category,
                  })),
                  total: this.awesomeCopilotIntegration.getInstructions().length,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://awesome-copilot/status':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  ...this.awesomeCopilotIntegration.getStatus(),
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://sequential/state':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  currentThought: null,
                  totalThoughts: null,
                  thoughts: [],
                  lastUpdated: new Date().toISOString(),
                  activeSession: false,
                  message: 'Sequential thinking state tracking not yet implemented',
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://workflows/status':
          const activeWorkflows = this.workflowOrchestrator.getActiveWorkflows();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  activeWorkflows: activeWorkflows.map(workflowId => {
                    const status = this.workflowOrchestrator.getWorkflowStatus(workflowId);
                    return status ? {
                      workflowId: status.workflowId,
                      status: status.status,
                      stepsCompleted: status.steps.filter(s => s.status === 'completed').length,
                      stepsTotal: status.steps.length,
                      executionTime: status.executionTime,
                      startedAt: status.startedAt,
                    } : null;
                  }).filter(Boolean),
                  totalActiveWorkflows: activeWorkflows.length,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://tool-chains':
          const toolChainingPrompts = this.promptManager.getPromptsByCategory('tool-chaining');
          const toolChainingResourceSets = this.promptManager.getResourceSetsByCategory('tool-chaining');
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  prompts: toolChainingPrompts.map(prompt => ({
                    id: prompt.id,
                    name: prompt.name,
                    description: prompt.description,
                    tags: prompt.tags,
                    complexity: prompt.complexity,
                    useCase: prompt.useCase,
                    expectedTools: prompt.expectedTools,
                  })),
                  resourceSets: toolChainingResourceSets.map(set => ({
                    id: set.id,
                    name: set.name,
                    description: set.description,
                    tags: set.tags,
                    complexity: set.complexity,
                    resourceCount: set.resources.length,
                  })),
                  totalPrompts: toolChainingPrompts.length,
                  totalResourceSets: toolChainingResourceSets.length,
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'chaining://tool-chains/overview':
          const toolChainPrompts = this.promptManager.getPromptsByCategory('tool-chaining');
          const toolChainResourceSets = this.promptManager.getResourceSetsByCategory('tool-chaining');

          const toolChainPromptCategories = toolChainPrompts.reduce((acc, prompt) => {
            acc[prompt.category] = (acc[prompt.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const toolChainResourceSetCategories = toolChainResourceSets.reduce((acc, set) => {
            acc[set.category] = (acc[set.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const toolChainPromptComplexity = toolChainPrompts.reduce((acc, prompt) => {
            acc[prompt.complexity] = (acc[prompt.complexity] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const toolChainResourceSetComplexity = toolChainResourceSets.reduce((acc, set) => {
            acc[set.complexity] = (acc[set.complexity] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  totalPrompts: toolChainPrompts.length,
                  totalResourceSets: toolChainResourceSets.length,
                  categories: {
                    prompts: toolChainPromptCategories,
                    resourceSets: toolChainResourceSetCategories,
                  },
                  complexity: {
                    prompts: toolChainPromptComplexity,
                    resourceSets: toolChainResourceSetComplexity,
                  },
                  timestamp: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      await this.ensureInitialized();

      try {
        switch (name) {
          // Original chaining tools
          case 'list_mcp_servers':
            return await this.handleListMCPServers();

          case 'analyze_tools':
            return await this.handleAnalyzeTools(args);

          case 'generate_route_suggestions':
            return await this.handleGenerateRouteSuggestions(args);

          case 'analyze_with_sequential_thinking':
            return await this.handleSequentialThinkingAnalysis(args);

          case 'get_tool_chain_analysis':
            return await this.handleToolChainAnalysis(args);


          // Sequential Thinking tool
          case 'sequentialthinking':
            return await this.handleSequentialThinking(args);

          // Brainstorming tool
          case 'brainstorming':
            return await this.handleBrainstorming(args);

          // Workflow Orchestrator tool
          case 'workflow_orchestrator':
            return await this.handleWorkflowOrchestrator(args);

          // Time tools
          case 'get_current_time':
            return await this.handleGetCurrentTime(args);

          case 'convert_time':
            return await this.handleConvertTime(args);

          // Prompt and Resource tools
          case 'get_prompt':
            return await this.handleGetPrompt(args);

          case 'search_prompts':
            return await this.handleSearchPrompts(args);

          case 'get_resource_set':
            return await this.handleGetResourceSet(args);

          case 'search_resource_sets':
            return await this.handleSearchResourceSets(args);

          // Awesome Copilot tools
          case 'awesome_copilot_list_collections':
            return await this.handleAwesomeCopilotListCollections();

          case 'awesome_copilot_search_collections':
            return await this.handleAwesomeCopilotSearchCollections(args);

          case 'awesome_copilot_get_collection':
            return await this.handleAwesomeCopilotGetCollection(args);

          case 'awesome_copilot_search_instructions':
            return await this.handleAwesomeCopilotSearchInstructions(args);

          case 'awesome_copilot_load_instruction':
            return await this.handleAwesomeCopilotLoadInstruction(args);

          case 'awesome_copilot_get_integration_status':
            return await this.handleAwesomeCopilotGetIntegrationStatus();

          // Tool Chain Verification tools
          case 'validate_tool_chain':
            return await this.handleValidateToolChain(args);

          case 'analyze_tool_chain_performance':
            return await this.handleAnalyzeToolChainPerformance(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = this.formatErrorMessage(error, name, args);
        console.error(`Tool execution error for ${name}:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: errorMessage,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Format error messages with enhanced information and suggestions
   */
  private formatErrorMessage(error: unknown, toolName: string, args: any): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Tool execution failed for '${toolName}': ${errorMessage}`;
  }

  /**
   * Ensure the server is initialized with robust error handling
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      try {
        console.log('Initializing chaining MCP server...');
        
        await this.discovery.discoverServers();
        console.log(`Discovered ${this.discovery.getServers().length} MCP servers`);
        
        await this.discovery.analyzeTools();
        console.log(`Analyzed ${this.discovery.getTools().length} tools`);
        
        this.optimizer.setTools(this.discovery.getTools());
        this.sequentialIntegration.setAvailableTools(this.discovery.getTools());
        
        this.isInitialized = true;
        console.log('Chaining MCP server initialization completed successfully');
      } catch (error) {
        console.error('Failed to initialize chaining MCP server:', error);
        throw new Error(`Server initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Handle list MCP servers request with robust error handling
   */
  private async handleListMCPServers() {
    try {
      const servers = this.discovery.getServers();
      
      if (!servers || servers.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                servers: [],
                total: 0,
                message: 'No MCP servers discovered. Please check your configuration.',
              }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              servers: servers.map(server => ({
                name: server.name || 'Unknown',
                command: server.command || 'Unknown',
                args: server.args || [],
                env: server.env || {},
                description: server.description || 'No description available',
                version: server.version || 'Unknown',
                capabilities: server.capabilities || {},
              })),
              total: servers.length,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list MCP servers: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle analyze tools request with robust validation and error handling
   */
  private async handleAnalyzeTools(args: any) {
    try {
      // Validate and sanitize input
      const validatedArgs = AnalyzeToolsSchema.parse(args);
      const { serverName, category } = validatedArgs;
      
      let tools = this.discovery.getTools();
      
      if (!tools || tools.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                tools: [],
                total: 0,
                message: 'No tools available for analysis. Please ensure MCP servers are properly configured.',
                timestamp: new Date().toISOString(),
              }, null, 2),
            },
          ],
        };
      }

      // Apply filters with validation
      if (serverName && typeof serverName === 'string') {
        const sanitizedServerName = serverName.trim();
        if (sanitizedServerName.length > 0) {
          tools = tools.filter(tool => 
            tool.serverName && tool.serverName.toLowerCase().includes(sanitizedServerName.toLowerCase())
          );
        }
      }

      if (category && typeof category === 'string') {
        const sanitizedCategory = category.trim();
        if (sanitizedCategory.length > 0) {
          tools = tools.filter(tool => 
            tool.category && tool.category.toLowerCase().includes(sanitizedCategory.toLowerCase())
          );
        }
      }

      const analysis = {
        tools: tools.map(tool => ({
          name: tool.name || 'Unknown',
          description: tool.description || 'No description available',
          serverName: tool.serverName || 'Unknown',
          category: tool.category || 'uncategorized',
          estimatedComplexity: tool.estimatedComplexity || 1,
          estimatedDuration: tool.estimatedDuration || 1000,
          dependencies: tool.dependencies || [],
        })),
        total: tools.length,
        byServer: this.groupToolsByServer(tools),
        byCategory: this.groupToolsByCategory(tools),
        filters: {
          serverName: serverName || null,
          category: category || null,
        },
        timestamp: new Date().toISOString(),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid parameters: ${error.message}. Please check your input format.`);
      }
      throw new Error(`Failed to analyze tools: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle generate route suggestions request
   */
  private async handleGenerateRouteSuggestions(args: any) {
    const validatedArgs = GenerateRouteSuggestionsSchema.parse(args);
    const { task, criteria = {} } = validatedArgs;
    
    // Validate criteria
    const validatedCriteria = OptimizationCriteriaSchema.parse(criteria);
    
    const suggestions = await this.optimizer.generateRoutes(task, validatedCriteria);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            task,
            criteria: validatedCriteria,
            suggestions: suggestions.map(suggestion => ({
              id: suggestion.id,
              name: suggestion.name,
              description: suggestion.description,
              tools: suggestion.tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                serverName: tool.serverName,
                category: tool.category,
              })),
              estimatedDuration: suggestion.estimatedDuration,
              complexity: suggestion.complexity,
              confidence: suggestion.confidence,
              reasoning: suggestion.reasoning,
            })),
            total: suggestions.length,
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle sequential thinking analysis request
   */
  private async handleSequentialThinkingAnalysis(args: any) {
    const validatedArgs = AnalyzeWithSequentialThinkingSchema.parse(args);
    const { problem, criteria = {}, maxThoughts = 10 } = validatedArgs;
    
    // Validate criteria
    const validatedCriteria = OptimizationCriteriaSchema.parse(criteria);
    
    const availableTools = this.discovery.getTools();
    const result = await this.sequentialIntegration.analyzeWorkflow(
      problem,
      availableTools,
      validatedCriteria
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            problem,
            criteria: validatedCriteria,
            sequentialThinkingResult: {
              thoughts: result.thoughts,
              analysis: result.analysis,
              suggestions: result.suggestions.map(suggestion => ({
                id: suggestion.id,
                name: suggestion.name,
                description: suggestion.description,
                tools: suggestion.tools.map(tool => ({
                  name: tool.name,
                  description: tool.description,
                  serverName: tool.serverName,
                  category: tool.category,
                })),
                estimatedDuration: suggestion.estimatedDuration,
                complexity: suggestion.complexity,
                confidence: suggestion.confidence,
                reasoning: suggestion.reasoning,
              })),
              confidence: result.confidence,
              reasoning: result.reasoning,
            },
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle tool chain analysis request
   */
  private async handleToolChainAnalysis(args: any) {
    const validatedArgs = GetToolChainAnalysisSchema.parse(args);
    const { input, criteria = {} } = validatedArgs;
    
    // Validate criteria
    const validatedCriteria = OptimizationCriteriaSchema.parse(criteria);
    
    const availableTools = this.discovery.getTools();
    const suggestions = await this.optimizer.generateRoutes(input, validatedCriteria);

    const analysis = {
      input,
      availableTools: availableTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        serverName: tool.serverName,
        category: tool.category,
        estimatedComplexity: tool.estimatedComplexity,
        estimatedDuration: tool.estimatedDuration,
      })),
      suggestedRoutes: suggestions.map(suggestion => ({
        id: suggestion.id,
        name: suggestion.name,
        description: suggestion.description,
        tools: suggestion.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          serverName: tool.serverName,
          category: tool.category,
        })),
        estimatedDuration: suggestion.estimatedDuration,
        complexity: suggestion.complexity,
        confidence: suggestion.confidence,
        reasoning: suggestion.reasoning,
      })),
      analysis: {
        totalToolsAvailable: availableTools.length,
        averageComplexity: availableTools.reduce((sum, tool) => 
          sum + (tool.estimatedComplexity || 1), 0) / availableTools.length,
        fastestRoute: suggestions.length > 0 ? suggestions[0].id : null,
        simplestRoute: suggestions.find(s => s.name.toLowerCase().includes('simple'))?.id || null,
        mostReliableRoute: suggestions.reduce((best, current) => 
          current.confidence > best.confidence ? current : best, suggestions[0])?.id || null,
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  /**
   * Group tools by server
   */
  private groupToolsByServer(tools: any[]): Record<string, any[]> {
    return tools.reduce((groups, tool) => {
      const server = tool.serverName;
      if (!groups[server]) {
        groups[server] = [];
      }
      groups[server].push(tool);
      return groups;
    }, {});
  }

  /**
   * Group tools by category
   */
  private groupToolsByCategory(tools: any[]): Record<string, any[]> {
    return tools.reduce((groups, tool) => {
      const category = tool.category || 'uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tool);
      return groups;
    }, {});
  }

  /**
   * Get tool categories
   */
  private getToolCategories(): string[] {
    const tools = this.discovery.getTools();
    const categories = new Set(tools.map(tool => tool.category).filter((category): category is string => Boolean(category)));
    return Array.from(categories);
  }



  /**
   * Handle sequential thinking request with robust validation and error handling
   */
  private async handleSequentialThinking(args: any) {
    try {
      // Validate and sanitize input
      const validatedArgs = SequentialThinkingSchema.parse(args);

      // Additional validation for thought content
      if (!validatedArgs.thought || typeof validatedArgs.thought !== 'string') {
        throw new Error('Thought content is required and must be a string');
      }

      if (validatedArgs.thought.trim().length === 0) {
        throw new Error('Thought content cannot be empty');
      }

      if (validatedArgs.thought.length > 10000) {
        throw new Error('Thought content is too long (maximum 10,000 characters)');
      }

      // Validate thought numbers
      if (validatedArgs.thoughtNumber < 1) {
        throw new Error('Thought number must be at least 1');
      }

      if (validatedArgs.totalThoughts < 1) {
        throw new Error('Total thoughts must be at least 1');
      }

      if (validatedArgs.thoughtNumber > validatedArgs.totalThoughts) {
        throw new Error('Current thought number cannot exceed total thoughts');
      }

      // Sanitize thought content
      const sanitizedArgs = {
        ...validatedArgs,
        thought: validatedArgs.thought.trim(),
      };

      console.log(`Processing sequential thought ${sanitizedArgs.thoughtNumber}/${sanitizedArgs.totalThoughts}`);

      const result = this.sequentialThinkingManager.processThought(sanitizedArgs);

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid sequential thinking parameters: ${error.message}. Please check your input format.`);
      }
      throw new Error(`Sequential thinking failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle brainstorming request with robust validation and error handling
   */
  private async handleBrainstorming(args: any) {
    try {
      // Validate input
      const validatedArgs = BrainstormingSchema.parse(args);

      // Additional validation
      if (!validatedArgs.topic || typeof validatedArgs.topic !== 'string') {
        throw new Error('Topic is required and must be a string');
      }

      if (validatedArgs.topic.trim().length === 0) {
        throw new Error('Topic cannot be empty');
      }

      if (validatedArgs.topic.length > 500) {
        throw new Error('Topic is too long (maximum 500 characters)');
      }

      // Validate constraints if provided
      if (validatedArgs.constraints) {
        validatedArgs.constraints.forEach((constraint, index) => {
          if (typeof constraint !== 'string') {
            throw new Error(`Constraint at index ${index} must be a string`);
          }
          if (constraint.length > 200) {
            throw new Error(`Constraint at index ${index} is too long (maximum 200 characters)`);
          }
        });
      }

      console.log(`Generating ${validatedArgs.ideaCount} ideas for topic: ${validatedArgs.topic} using ${validatedArgs.approach} approach`);

      const result = await this.brainstormingManager.generateIdeas(validatedArgs);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ...result,
              request: validatedArgs,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid brainstorming parameters: ${error.message}. Please check your input format.`);
      }
      throw new Error(`Brainstorming failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle workflow orchestrator request with robust validation and error handling
   */
  private async handleWorkflowOrchestrator(args: any) {
    try {
      // Validate input
      const validatedArgs = WorkflowOrchestratorSchema.parse(args);

      console.log(`Executing workflow: ${validatedArgs.name} (${validatedArgs.workflowId}) with ${validatedArgs.steps.length} steps`);

      // Validate that all referenced servers exist (if we're initialized)
      if (this.isInitialized) {
        const availableServers = this.discovery.getServers().map(s => s.name);
        const missingServers = validatedArgs.steps
          .map(step => step.serverName)
          .filter(serverName => !availableServers.includes(serverName));

        if (missingServers.length > 0) {
          throw new Error(`Workflow references unknown MCP servers: ${missingServers.join(', ')}. Available servers: ${availableServers.join(', ')}`);
        }

        // Validate that all tools exist on their respective servers
        for (const step of validatedArgs.steps) {
          const server = this.discovery.getServers().find(s => s.name === step.serverName);
          if (server) {
            const serverTools = this.discovery.getTools().filter(t => t.serverName === step.serverName);
            const toolExists = serverTools.some(t => t.name === step.toolName);
            if (!toolExists) {
              throw new Error(`Tool '${step.toolName}' not found on server '${step.serverName}'. Available tools: ${serverTools.map(t => t.name).join(', ')}`);
            }
          }
        }
      }

      // Execute the workflow
      const result = await this.workflowOrchestrator.executeWorkflow(validatedArgs);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ...result,
              workflowDefinition: validatedArgs,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid workflow orchestrator parameters: ${error.message}. Please check your workflow definition format.`);
      }
      throw new Error(`Workflow orchestration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle get current time request with robust validation and error handling
   */
  private async handleGetCurrentTime(args: any) {
    try {
      const validatedArgs = GetCurrentTimeSchema.parse(args);
      
      // Validate timezone format
      if (!validatedArgs.timezone || typeof validatedArgs.timezone !== 'string') {
        throw new Error('Timezone is required and must be a string');
      }
      
      const sanitizedTimezone = validatedArgs.timezone.trim();
      if (sanitizedTimezone.length === 0) {
        throw new Error('Timezone cannot be empty');
      }
      
      console.log(`Getting current time for timezone: ${sanitizedTimezone}`);
      
      const result = this.timeManager.getCurrentTime(sanitizedTimezone);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ...result,
              timestamp: new Date().toISOString(),
              requestTimezone: sanitizedTimezone,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid timezone parameter: ${error.message}. Please provide a valid IANA timezone (e.g., 'America/New_York', 'Europe/London').`);
      }
      throw new Error(`Failed to get current time: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle convert time request
   */
  private async handleConvertTime(args: any) {
    const validatedArgs = ConvertTimeSchema.parse(args);
    const result = this.timeManager.convertTime(
      validatedArgs.source_timezone,
      validatedArgs.time,
      validatedArgs.target_timezone
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * Handle get prompt request
   */
  private async handleGetPrompt(args: any) {
    const { id } = args;

    if (!id || typeof id !== 'string') {
      throw new Error('Prompt ID is required and must be a string');
    }

    const prompt = this.promptManager.getPrompt(id);
    if (!prompt) {
      throw new Error(`Prompt with ID '${id}' not found`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            prompt: {
              id: prompt.id,
              name: prompt.name,
              description: prompt.description,
              category: prompt.category,
              tags: prompt.tags,
              complexity: prompt.complexity,
              useCase: prompt.useCase,
              expectedTools: prompt.expectedTools,
              prompt: prompt.prompt,
            },
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle search prompts request
   */
  private async handleSearchPrompts(args: any) {
    const { query, category, complexity } = args;

    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required and must be a string');
    }

    let prompts = this.promptManager.searchPrompts(query);

    // Apply additional filters
    if (category && typeof category === 'string') {
      prompts = prompts.filter(prompt => prompt.category === category);
    }

    if (complexity && ['low', 'medium', 'high'].includes(complexity)) {
      prompts = prompts.filter(prompt => prompt.complexity === complexity);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query,
            filters: {
              category: category || null,
              complexity: complexity || null,
            },
            results: prompts.map(prompt => ({
              id: prompt.id,
              name: prompt.name,
              description: prompt.description,
              category: prompt.category,
              tags: prompt.tags,
              complexity: prompt.complexity,
              useCase: prompt.useCase,
              expectedTools: prompt.expectedTools,
            })),
            total: prompts.length,
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle get resource set request
   */
  private async handleGetResourceSet(args: any) {
    const { id } = args;

    if (!id || typeof id !== 'string') {
      throw new Error('Resource set ID is required and must be a string');
    }

    const resourceSet = this.promptManager.getResourceSet(id);
    if (!resourceSet) {
      throw new Error(`Resource set with ID '${id}' not found`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            resourceSet: {
              id: resourceSet.id,
              name: resourceSet.name,
              description: resourceSet.description,
              category: resourceSet.category,
              tags: resourceSet.tags,
              complexity: resourceSet.complexity,
              resources: resourceSet.resources,
            },
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle search resource sets request
   */
  private async handleSearchResourceSets(args: any) {
    const { query, category, complexity } = args;

    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required and must be a string');
    }

    let resourceSets = this.promptManager.searchResourceSets(query);

    // Apply additional filters
    if (category && typeof category === 'string') {
      resourceSets = resourceSets.filter(set => set.category === category);
    }

    if (complexity && ['low', 'medium', 'high'].includes(complexity)) {
      resourceSets = resourceSets.filter(set => set.complexity === complexity);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query,
            filters: {
              category: category || null,
              complexity: complexity || null,
            },
            results: resourceSets.map(set => ({
              id: set.id,
              name: set.name,
              description: set.description,
              category: set.category,
              tags: set.tags,
              complexity: set.complexity,
              resourceCount: set.resources.length,
            })),
            total: resourceSets.length,
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle awesome copilot list collections request
   */
  private async handleAwesomeCopilotListCollections() {
    try {
      const collections = this.awesomeCopilotIntegration.getCollections();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              collections: collections.map(collection => ({
                id: collection.id,
                name: collection.name,
                description: collection.description,
                tags: collection.tags,
                itemCount: collection.items.length,
                items: collection.items.map(item => ({
                  path: item.path,
                  kind: item.kind,
                })),
              })),
              total: collections.length,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list awesome-copilot collections: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle awesome copilot search collections request
   */
  private async handleAwesomeCopilotSearchCollections(args: any) {
    try {
      const { query } = args;

      if (!query || typeof query !== 'string') {
        throw new Error('Search query is required and must be a string');
      }

      const collections = this.awesomeCopilotIntegration.searchCollections(query.trim());

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query: query.trim(),
              results: collections.map(collection => ({
                id: collection.id,
                name: collection.name,
                description: collection.description,
                tags: collection.tags,
                itemCount: collection.items.length,
              })),
              total: collections.length,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search awesome-copilot collections: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle awesome copilot get collection request
   */
  private async handleAwesomeCopilotGetCollection(args: any) {
    try {
      const { id } = args;

      if (!id || typeof id !== 'string') {
        throw new Error('Collection ID is required and must be a string');
      }

      const collection = this.awesomeCopilotIntegration.getCollection(id.trim());

      if (!collection) {
        throw new Error(`Collection with ID '${id}' not found`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              collection: {
                id: collection.id,
                name: collection.name,
                description: collection.description,
                tags: collection.tags,
                items: collection.items.map(item => ({
                  path: item.path,
                  kind: item.kind,
                })),
              },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get awesome-copilot collection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle awesome copilot search instructions request
   */
  private async handleAwesomeCopilotSearchInstructions(args: any) {
    try {
      const { keywords } = args;

      if (!keywords || typeof keywords !== 'string') {
        throw new Error('Keywords are required and must be a string');
      }

      const results = this.awesomeCopilotIntegration.searchInstructions(keywords.trim());

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              keywords: keywords.trim(),
              results: results.map(result => ({
                filename: result.filename,
                title: result.title,
                description: result.description,
                tags: result.tags,
                category: result.category,
              })),
              total: results.length,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search awesome-copilot instructions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle awesome copilot load instruction request
   */
  private async handleAwesomeCopilotLoadInstruction(args: any) {
    try {
      const { mode, filename } = args;

      if (!mode || typeof mode !== 'string') {
        throw new Error('Mode is required and must be a string');
      }

      if (!filename || typeof filename !== 'string') {
        throw new Error('Filename is required and must be a string');
      }

      const instruction = this.awesomeCopilotIntegration.getInstruction(mode.trim(), filename.trim());

      if (!instruction) {
        throw new Error(`Instruction '${filename}' in mode '${mode}' not found`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              instruction: {
                mode: instruction.mode,
                filename: instruction.filename,
                content: instruction.content,
                metadata: instruction.metadata,
              },
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to load awesome-copilot instruction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle awesome copilot get integration status request
   */
  private async handleAwesomeCopilotGetIntegrationStatus() {
    try {
      const status = this.awesomeCopilotIntegration.getStatus();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ...status,
              timestamp: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get awesome-copilot integration status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle validate tool chain request
   */
  private async handleValidateToolChain(args: any) {
    try {
      // Validate input
      const validatedArgs = ValidateToolChainSchema.parse(args);
      const { toolChain, checkCircularDependencies, checkToolAvailability, checkParameterCompatibility } = validatedArgs;

      const validationResults = {
        isValid: true,
        errors: [] as string[],
        warnings: [] as string[],
        toolChain: toolChain,
        timestamp: new Date().toISOString(),
      };

      // Check for circular dependencies
      if (checkCircularDependencies) {
        const dependencyGraph = new Map<string, string[]>();
        toolChain.forEach(step => {
          dependencyGraph.set(step.toolName, step.dependsOn || []);
        });

        // Simple cycle detection using DFS
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const hasCycle = (toolName: string): boolean => {
          if (recursionStack.has(toolName)) return true;
          if (visited.has(toolName)) return false;

          visited.add(toolName);
          recursionStack.add(toolName);

          const dependencies = dependencyGraph.get(toolName) || [];
          for (const dep of dependencies) {
            if (hasCycle(dep)) return true;
          }

          recursionStack.delete(toolName);
          return false;
        };

        for (const step of toolChain) {
          if (hasCycle(step.toolName)) {
            validationResults.isValid = false;
            validationResults.errors.push(`Circular dependency detected involving tool: ${step.toolName}`);
            break;
          }
        }
      }

      // Check tool availability
      if (checkToolAvailability) {
        const availableTools = this.discovery.getTools();
        const availableToolNames = new Set(availableTools.map(t => `${t.serverName}:${t.name}`));

        for (const step of toolChain) {
          const toolKey = `${step.serverName}:${step.toolName}`;
          if (!availableToolNames.has(toolKey)) {
            validationResults.isValid = false;
            validationResults.errors.push(`Tool '${step.toolName}' not found on server '${step.serverName}'`);
          }
        }
      }

      // Check parameter compatibility (basic validation)
      if (checkParameterCompatibility) {
        const availableTools = this.discovery.getTools();

        for (const step of toolChain) {
          const toolInfo = availableTools.find(t => t.serverName === step.serverName && t.name === step.toolName);
          if (toolInfo) {
            // Basic parameter validation - could be enhanced with more sophisticated checks
            const requiredParams = this.extractRequiredParameters(toolInfo.inputSchema);
            const providedParams = Object.keys(step.parameters || {});

            for (const required of requiredParams) {
              if (!providedParams.includes(required)) {
                validationResults.warnings.push(`Tool '${step.toolName}' may be missing required parameter: ${required}`);
              }
            }
          }
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(validationResults, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid tool chain validation parameters: ${error.message}. Please check your tool chain definition format.`);
      }
      throw new Error(`Tool chain validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle analyze tool chain performance request
   */
  private async handleAnalyzeToolChainPerformance(args: any) {
    try {
      // Validate input
      const validatedArgs = AnalyzeToolChainPerformanceSchema.parse(args);
      const { toolChain, includeExecutionMetrics, includeComplexityAnalysis, includeOptimizationSuggestions } = validatedArgs;

      const analysisResults = {
        toolChain: toolChain,
        metrics: {} as any,
        complexity: {} as any,
        optimizationSuggestions: [] as string[],
        timestamp: new Date().toISOString(),
      };

      // Calculate execution metrics
      if (includeExecutionMetrics) {
        const availableTools = this.discovery.getTools();
        let totalEstimatedDuration = 0;
        let totalComplexity = 0;
        const toolMetrics = [] as any[];

        for (const step of toolChain) {
          const toolInfo = availableTools.find(t => t.serverName === step.serverName && t.name === step.toolName);
          if (toolInfo) {
            const estimatedDuration = toolInfo.estimatedDuration || 1000; // Default 1 second
            const complexity = toolInfo.estimatedComplexity || 1; // Default complexity 1

            totalEstimatedDuration += estimatedDuration;
            totalComplexity += complexity;

            toolMetrics.push({
              toolName: step.toolName,
              serverName: step.serverName,
              estimatedDuration,
              complexity,
            });
          }
        }

        analysisResults.metrics = {
          totalEstimatedDuration,
          averageComplexity: totalComplexity / toolChain.length,
          toolMetrics,
          sequentialExecutionTime: totalEstimatedDuration,
          parallelExecutionTime: Math.max(...toolMetrics.map(m => m.estimatedDuration)), // Assuming independent tools can run in parallel
        };
      }

      // Analyze complexity
      if (includeComplexityAnalysis) {
        const dependencyCount = toolChain.reduce((sum, step) => sum + (step.dependsOn?.length || 0), 0);
        const maxDependencies = Math.max(...toolChain.map(step => step.dependsOn?.length || 0));

        analysisResults.complexity = {
          totalSteps: toolChain.length,
          totalDependencies: dependencyCount,
          maxDependenciesPerStep: maxDependencies,
          averageDependenciesPerStep: dependencyCount / toolChain.length,
          complexityScore: toolChain.length + dependencyCount * 0.5, // Simple complexity formula
          riskLevel: this.calculateRiskLevel(toolChain.length, dependencyCount, maxDependencies),
        };
      }

      // Provide optimization suggestions
      if (includeOptimizationSuggestions) {
        const suggestions = [] as string[];

        // Check for parallel execution opportunities
        const independentSteps = toolChain.filter(step => !step.dependsOn || step.dependsOn.length === 0);
        if (independentSteps.length > 1) {
          suggestions.push(`Consider running ${independentSteps.length} independent steps in parallel to reduce execution time`);
        }

        // Check for complex dependencies
        const complexSteps = toolChain.filter(step => (step.dependsOn?.length || 0) > 2);
        if (complexSteps.length > 0) {
          suggestions.push(`Steps with many dependencies (${complexSteps.map(s => s.toolName).join(', ')}) may be bottlenecks - consider refactoring`);
        }

        // Check for long chains
        if (toolChain.length > 5) {
          suggestions.push('Long tool chains (>5 steps) may be error-prone - consider breaking into smaller, focused chains');
        }

        // Suggest caching for repeated tools
        const toolCounts = toolChain.reduce((counts, step) => {
          counts[step.toolName] = (counts[step.toolName] || 0) + 1;
          return counts;
        }, {} as Record<string, number>);

        const repeatedTools = Object.entries(toolCounts).filter(([, count]) => count > 1);
        if (repeatedTools.length > 0) {
          suggestions.push(`Tools used multiple times (${repeatedTools.map(([tool]) => tool).join(', ')}) - consider caching results`);
        }

        analysisResults.optimizationSuggestions = suggestions;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysisResults, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid tool chain performance analysis parameters: ${error.message}. Please check your tool chain definition format.`);
      }
      throw new Error(`Tool chain performance analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract required parameters from tool input schema
   */
  private extractRequiredParameters(inputSchema: any): string[] {
    try {
      if (inputSchema && inputSchema.properties && inputSchema.required) {
        return inputSchema.required;
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Calculate risk level based on tool chain metrics
   */
  private calculateRiskLevel(stepCount: number, dependencyCount: number, maxDependencies: number): string {
    const score = stepCount * 0.3 + dependencyCount * 0.4 + maxDependencies * 0.3;

    if (score < 2) return 'Low';
    if (score < 4) return 'Medium';
    if (score < 6) return 'High';
    return 'Very High';
  }


  /**
   * Start the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Chaining MCP Server started');
  }
}
