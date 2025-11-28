import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const validationAnalysisTools: Tool[] = [
  {
    name: 'validate_tool_chain',
    description: 'Validate tool chains for correctness, dependencies, and potential issues. Checks for circular dependencies, tool availability, and parameter compatibility',
    inputSchema: {
      type: 'object',
      properties: {
        toolChain: {
          type: 'array',
          description: 'Array of tool chain steps with server name, tool name, parameters, and dependencies',
          items: {
            type: 'object',
            properties: {
              serverName: { type: 'string', description: 'Name of the MCP server' },
              toolName: { type: 'string', description: 'Name of the tool' },
              parameters: { type: 'object', description: 'Parameters for the tool' },
              dependsOn: { type: 'array', items: { type: 'string' }, description: 'Dependencies on other steps' },
            },
            required: ['serverName', 'toolName', 'parameters'],
          },
        },
        checkCircularDependencies: { type: 'boolean', default: true, description: 'Whether to check for circular dependencies' },
        checkToolAvailability: { type: 'boolean', default: true, description: 'Whether to verify tools exist on their servers' },
        checkParameterCompatibility: { type: 'boolean', default: true, description: 'Whether to check parameter compatibility' },
      },
      required: ['toolChain'],
    },
  },
  {
    name: 'analyze_tool_chain_performance',
    description: 'Analyze performance metrics and efficiency of tool chains. Provides execution time estimates, complexity analysis, and optimization suggestions',
    inputSchema: {
      type: 'object',
      properties: {
        toolChain: {
          type: 'array',
          description: 'Array of tool chain steps to analyze',
          items: {
            type: 'object',
            properties: {
              serverName: { type: 'string', description: 'Name of the MCP server' },
              toolName: { type: 'string', description: 'Name of the tool' },
              parameters: { type: 'object', description: 'Parameters for the tool' },
            },
          },
        },
        includeExecutionMetrics: { type: 'boolean', default: true, description: 'Whether to include execution time estimates' },
        includeComplexityAnalysis: { type: 'boolean', default: true, description: 'Whether to analyze complexity metrics' },
        includeOptimizationSuggestions: { type: 'boolean', default: true, description: 'Whether to provide optimization suggestions' },
      },
      required: ['toolChain'],
    },
  },
];
