import { z } from 'zod';

/**
 * Convert Zod schema to JSON Schema format for MCP tool definitions
 * This is a simplified approach that manually defines schemas for our specific use cases
 */
export function getToolInputSchema(zodSchema: z.ZodSchema): any {
  // For ListMCPServersSchema (empty object)
  if (zodSchema === z.object({})) {
    return {
      type: 'object',
      properties: {},
    };
  }
  
  // For AnalyzeToolsSchema
  if (zodSchema instanceof z.ZodObject && zodSchema.shape && 
      zodSchema.shape().serverName instanceof z.ZodOptional && 
      zodSchema.shape().category instanceof z.ZodOptional) {
    return {
      type: 'object',
      properties: {
        serverName: {
          type: 'string',
          description: 'Optional: filter by specific server name',
        },
        category: {
          type: 'string',
          description: 'Optional: filter by tool category',
        },
      },
    };
  }
  
  // For GenerateRouteSuggestionsSchema
  if (zodSchema instanceof z.ZodObject && zodSchema.shape && 
      zodSchema.shape().task instanceof z.ZodString) {
    return {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'The task or problem to solve',
        },
        criteria: {
          type: 'object',
          description: 'Optimization criteria',
          properties: {
            prioritizeSpeed: { type: 'boolean' },
            prioritizeSimplicity: { type: 'boolean' },
            prioritizeReliability: { type: 'boolean' },
            maxComplexity: { type: 'number' },
            maxDuration: { type: 'number' },
            requiredCapabilities: { type: 'array', items: { type: 'string' } },
            excludedTools: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      required: ['task'],
    };
  }
  
  // For AnalyzeWithSequentialThinkingSchema
  if (zodSchema instanceof z.ZodObject && zodSchema.shape && 
      zodSchema.shape().problem instanceof z.ZodString && 
      zodSchema.shape().maxThoughts instanceof z.ZodNumber) {
    return {
      type: 'object',
      properties: {
        problem: {
          type: 'string',
          description: 'The problem to analyze',
        },
        criteria: {
          type: 'object',
          description: 'Optimization criteria',
          properties: {
            prioritizeSpeed: { type: 'boolean' },
            prioritizeSimplicity: { type: 'boolean' },
            prioritizeReliability: { type: 'boolean' },
            maxComplexity: { type: 'number' },
            maxDuration: { type: 'number' },
            requiredCapabilities: { type: 'array', items: { type: 'string' } },
            excludedTools: { type: 'array', items: { type: 'string' } },
          },
        },
        maxThoughts: {
          type: 'number',
          description: 'Maximum number of thoughts for sequential analysis',
          minimum: 1,
          maximum: 20,
          default: 10,
        },
      },
      required: ['problem'],
    };
  }
  
  // For GetToolChainAnalysisSchema
  if (zodSchema instanceof z.ZodObject && zodSchema.shape && 
      zodSchema.shape().input instanceof z.ZodString) {
    return {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Input description for analysis',
        },
        criteria: {
          type: 'object',
          description: 'Optimization criteria',
          properties: {
            prioritizeSpeed: { type: 'boolean' },
            prioritizeSimplicity: { type: 'boolean' },
            prioritizeReliability: { type: 'boolean' },
            maxComplexity: { type: 'number' },
            maxDuration: { type: 'number' },
            requiredCapabilities: { type: 'array', items: { type: 'string' } },
            excludedTools: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      required: ['input'],
    };
  }
  
  // Fallback for unknown schemas
  return {
    type: 'object',
    properties: {},
  };
}
