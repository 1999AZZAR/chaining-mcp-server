import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const promptResourceTools: Tool[] = [
  {
    name: 'get_prompt',
    description: 'Get a specific prebuilt prompt by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The ID of the prompt to retrieve' },
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
        query: { type: 'string', description: 'Search query to match against prompt names, descriptions, categories, or tags' },
        category: { type: 'string', enum: ['development', 'debugging', 'analysis', 'orchestration', 'monitoring', 'security'], description: 'Filter by category' },
        complexity: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Filter by complexity level' },
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
        id: { type: 'string', description: 'The ID of the resource set to retrieve' },
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
        query: { type: 'string', description: 'Search query to match against resource set names, descriptions, categories, or tags' },
        category: { type: 'string', enum: ['development', 'debugging', 'analysis', 'orchestration', 'monitoring', 'security'], description: 'Filter by category' },
        complexity: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Filter by complexity level' },
      },
      required: ['query'],
    },
  },
];
