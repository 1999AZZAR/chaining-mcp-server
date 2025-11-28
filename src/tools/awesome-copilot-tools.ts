import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const awesomeCopilotTools: Tool[] = [
  {
    name: 'awesome_copilot_list_collections',
    description: 'List all available awesome-copilot collections',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'awesome_copilot_search_collections',
    description: 'Search awesome-copilot collections by keywords',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query to match against collection names, descriptions, or tags' },
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
        id: { type: 'string', description: 'The collection ID to retrieve' },
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
        keywords: { type: 'string', description: 'Keywords to search for in instruction titles, descriptions, or tags' },
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
        mode: { type: 'string', description: 'The instruction mode (e.g., "instructions", "prompts")' },
        filename: { type: 'string', description: 'The filename of the instruction to load' },
      },
      required: ['mode', 'filename'],
    },
  },
  {
    name: 'awesome_copilot_get_integration_status',
    description: 'Get the status of awesome-copilot integration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
