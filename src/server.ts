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
import { RouteOptimizer } from './optimizer.js';
import { SequentialThinkingIntegration } from './sequential-integration.js';
import {
  OptimizationCriteriaSchema,
  SequentialThinkingRequestSchema,
  ToolChainAnalysisSchema,
  ListMCPServersSchema,
  AnalyzeToolsSchema,
  GenerateRouteSuggestionsSchema,
  AnalyzeWithSequentialThinkingSchema,
  GetToolChainAnalysisSchema,
} from './types.js';
import { getToolInputSchema } from './schema-utils.js';

export class ChainingMCPServer {
  private server: Server;
  private discovery: MCPServerDiscovery;
  private optimizer: RouteOptimizer;
  private sequentialIntegration: SequentialThinkingIntegration;
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
    this.optimizer = new RouteOptimizer();
    this.sequentialIntegration = new SequentialThinkingIntegration();

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

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Ensure the server is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.discovery.discoverServers();
      await this.discovery.analyzeTools();
      this.optimizer.setTools(this.discovery.getTools());
      this.isInitialized = true;
    }
  }

  /**
   * Handle list MCP servers request
   */
  private async handleListMCPServers() {
    const servers = this.discovery.getServers();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            servers: servers.map(server => ({
              name: server.name,
              command: server.command,
              args: server.args,
              env: server.env,
              description: server.description,
              version: server.version,
              capabilities: server.capabilities,
            })),
            total: servers.length,
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Handle analyze tools request
   */
  private async handleAnalyzeTools(args: any) {
    const validatedArgs = AnalyzeToolsSchema.parse(args);
    const { serverName, category } = validatedArgs;
    let tools = this.discovery.getTools();

    if (serverName) {
      tools = tools.filter(tool => tool.serverName === serverName);
    }

    if (category) {
      tools = tools.filter(tool => tool.category === category);
    }

    const analysis = {
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        serverName: tool.serverName,
        category: tool.category,
        estimatedComplexity: tool.estimatedComplexity,
        estimatedDuration: tool.estimatedDuration,
        dependencies: tool.dependencies,
      })),
      total: tools.length,
      byServer: this.groupToolsByServer(tools),
      byCategory: this.groupToolsByCategory(tools),
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
   * Start the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Chaining MCP Server started');
  }
}
