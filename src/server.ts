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
import { KnowledgeGraphManager } from './memory-manager.js';
import { SequentialThinkingManager } from './sequential-thinking-manager.js';
import { TimeManager } from './time-manager.js';
import { PromptManager } from './prompt-manager.js';
import {
  OptimizationCriteriaSchema,
  SequentialThinkingRequestSchema,
  ToolChainAnalysisSchema,
  ListMCPServersSchema,
  AnalyzeToolsSchema,
  GenerateRouteSuggestionsSchema,
  AnalyzeWithSequentialThinkingSchema,
  GetToolChainAnalysisSchema,
  CreateEntitiesSchema,
  CreateRelationsSchema,
  AddObservationsSchema,
  DeleteEntitiesSchema,
  DeleteObservationsSchema,
  DeleteRelationsSchema,
  SearchNodesSchema,
  OpenNodesSchema,
  SequentialThinkingSchema,
  GetCurrentTimeSchema,
  ConvertTimeSchema,
} from './types.js';
import { getToolInputSchema } from './schema-utils.js';

export class ChainingMCPServer {
  private server: Server;
  private discovery: MCPServerDiscovery;
  private optimizer: SmartRouteOptimizer;
  private sequentialIntegration: SequentialThinkingIntegration;
  private memoryManager: KnowledgeGraphManager;
  private sequentialThinkingManager: SequentialThinkingManager;
  private timeManager: TimeManager;
  private promptManager: PromptManager;
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
    this.memoryManager = new KnowledgeGraphManager();
    this.sequentialThinkingManager = new SequentialThinkingManager();
    this.timeManager = new TimeManager();
    this.promptManager = new PromptManager();

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
          // Memory/Knowledge Graph tools
          {
            name: 'create_entities',
            description: 'Create multiple new entities in the knowledge graph',
            inputSchema: getToolInputSchema(CreateEntitiesSchema),
          },
          {
            name: 'create_relations',
            description: 'Create multiple new relations between entities in the knowledge graph. Relations should be in active voice',
            inputSchema: getToolInputSchema(CreateRelationsSchema),
          },
          {
            name: 'add_observations',
            description: 'Add new observations to existing entities in the knowledge graph',
            inputSchema: getToolInputSchema(AddObservationsSchema),
          },
          {
            name: 'delete_entities',
            description: 'Delete multiple entities and their associated relations from the knowledge graph',
            inputSchema: getToolInputSchema(DeleteEntitiesSchema),
          },
          {
            name: 'delete_observations',
            description: 'Delete specific observations from entities in the knowledge graph',
            inputSchema: getToolInputSchema(DeleteObservationsSchema),
          },
          {
            name: 'delete_relations',
            description: 'Delete multiple relations from the knowledge graph',
            inputSchema: getToolInputSchema(DeleteRelationsSchema),
          },
          {
            name: 'read_graph',
            description: 'Read the entire knowledge graph',
            inputSchema: { type: 'object', properties: {} },
          },
          {
            name: 'search_nodes',
            description: 'Search for nodes in the knowledge graph based on a query',
            inputSchema: getToolInputSchema(SearchNodesSchema),
          },
          {
            name: 'open_nodes',
            description: 'Open specific nodes in the knowledge graph by their names',
            inputSchema: getToolInputSchema(OpenNodesSchema),
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

          // Memory/Knowledge Graph tools
          case 'create_entities':
            return await this.handleCreateEntities(args);

          case 'create_relations':
            return await this.handleCreateRelations(args);

          case 'add_observations':
            return await this.handleAddObservations(args);

          case 'delete_entities':
            return await this.handleDeleteEntities(args);

          case 'delete_observations':
            return await this.handleDeleteObservations(args);

          case 'delete_relations':
            return await this.handleDeleteRelations(args);

          case 'read_graph':
            return await this.handleReadGraph();

          case 'search_nodes':
            return await this.handleSearchNodes(args);

          case 'open_nodes':
            return await this.handleOpenNodes(args);

          // Sequential Thinking tool
          case 'sequentialthinking':
            return await this.handleSequentialThinking(args);

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
   * Format error messages with detailed information
   */
  private formatErrorMessage(error: unknown, toolName: string, args: any): string {
    const timestamp = new Date().toISOString();
    const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    let details = '';
    if (error instanceof Error && error.stack) {
      details = `\nStack trace: ${error.stack}`;
    }
    
    return `[${timestamp}] Tool Error: ${toolName}
Error Type: ${errorType}
Message: ${errorMessage}
Arguments: ${JSON.stringify(args, null, 2)}${details}

Please check the tool parameters and try again.`;
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
   * Handle create entities request with robust validation and error handling
   */
  private async handleCreateEntities(args: any) {
    try {
      const validatedArgs = CreateEntitiesSchema.parse(args);
      
      // Additional validation
      if (!validatedArgs.entities || !Array.isArray(validatedArgs.entities)) {
        throw new Error('Entities must be provided as an array');
      }
      
      if (validatedArgs.entities.length === 0) {
        throw new Error('At least one entity must be provided');
      }
      
      if (validatedArgs.entities.length > 100) {
        throw new Error('Too many entities (maximum 100 per request)');
      }
      
      // Validate and sanitize each entity
      const sanitizedEntities = validatedArgs.entities.map((entity, index) => {
        if (!entity.name || typeof entity.name !== 'string') {
          throw new Error(`Entity ${index + 1}: name is required and must be a string`);
        }
        
        if (!entity.entityType || typeof entity.entityType !== 'string') {
          throw new Error(`Entity ${index + 1}: entityType is required and must be a string`);
        }
        
        if (!entity.observations || !Array.isArray(entity.observations)) {
          throw new Error(`Entity ${index + 1}: observations must be provided as an array`);
        }
        
        const sanitizedName = entity.name.trim();
        const sanitizedType = entity.entityType.trim();
        
        if (sanitizedName.length === 0) {
          throw new Error(`Entity ${index + 1}: name cannot be empty`);
        }
        
        if (sanitizedType.length === 0) {
          throw new Error(`Entity ${index + 1}: entityType cannot be empty`);
        }
        
        if (sanitizedName.length > 200) {
          throw new Error(`Entity ${index + 1}: name is too long (maximum 200 characters)`);
        }
        
        if (sanitizedType.length > 100) {
          throw new Error(`Entity ${index + 1}: entityType is too long (maximum 100 characters)`);
        }
        
        const sanitizedObservations = entity.observations
          .filter(obs => typeof obs === 'string' && obs.trim().length > 0)
          .map(obs => obs.trim())
          .slice(0, 50); // Limit to 50 observations per entity
        
        if (sanitizedObservations.length === 0) {
          throw new Error(`Entity ${index + 1}: at least one valid observation is required`);
        }
        
        return {
          name: sanitizedName,
          entityType: sanitizedType,
          observations: sanitizedObservations,
        };
      });
      
      console.log(`Creating ${sanitizedEntities.length} entities in knowledge graph`);
      
      const result = await this.memoryManager.createEntities(sanitizedEntities);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ...result,
              timestamp: new Date().toISOString(),
              entitiesCreated: sanitizedEntities.length,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`Invalid entity parameters: ${error.message}. Please check your input format.`);
      }
      throw new Error(`Failed to create entities: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle create relations request
   */
  private async handleCreateRelations(args: any) {
    const validatedArgs = CreateRelationsSchema.parse(args);
    const result = await this.memoryManager.createRelations(validatedArgs.relations);
    
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
   * Handle add observations request
   */
  private async handleAddObservations(args: any) {
    const validatedArgs = AddObservationsSchema.parse(args);
    const result = await this.memoryManager.addObservations(validatedArgs.observations);
    
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
   * Handle delete entities request
   */
  private async handleDeleteEntities(args: any) {
    const validatedArgs = DeleteEntitiesSchema.parse(args);
    await this.memoryManager.deleteEntities(validatedArgs.entityNames);
    
    return {
      content: [
        {
          type: 'text',
          text: 'Entities deleted successfully',
        },
      ],
    };
  }

  /**
   * Handle delete observations request
   */
  private async handleDeleteObservations(args: any) {
    const validatedArgs = DeleteObservationsSchema.parse(args);
    await this.memoryManager.deleteObservations(validatedArgs.deletions);
    
    return {
      content: [
        {
          type: 'text',
          text: 'Observations deleted successfully',
        },
      ],
    };
  }

  /**
   * Handle delete relations request
   */
  private async handleDeleteRelations(args: any) {
    const validatedArgs = DeleteRelationsSchema.parse(args);
    await this.memoryManager.deleteRelations(validatedArgs.relations);
    
    return {
      content: [
        {
          type: 'text',
          text: 'Relations deleted successfully',
        },
      ],
    };
  }

  /**
   * Handle read graph request
   */
  private async handleReadGraph() {
    const result = await this.memoryManager.readGraph();
    
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
   * Handle search nodes request
   */
  private async handleSearchNodes(args: any) {
    const validatedArgs = SearchNodesSchema.parse(args);
    const result = await this.memoryManager.searchNodes(validatedArgs.query);
    
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
   * Handle open nodes request
   */
  private async handleOpenNodes(args: any) {
    const validatedArgs = OpenNodesSchema.parse(args);
    const result = await this.memoryManager.openNodes(validatedArgs.names);
    
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
   * Start the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Chaining MCP Server started');
  }
}
