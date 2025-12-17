import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const awesomeCopilotTools: Tool[] = [
  {
    name: 'search_instructions',
    description: 'Searches custom instructions based on keywords in their descriptions',
    inputSchema: {
      type: 'object',
      properties: {
        keywords: { type: 'string', description: 'Keywords to search for in instruction descriptions' },
      },
      required: ['keywords'],
    },
  },
  {
    name: 'load_instruction',
    description: 'Loads a custom instruction from the repository',
    inputSchema: {
      type: 'object',
      properties: {
        mode: { type: 'string', description: 'Instruction mode (instructions, prompts, chatmodes)' },
        filename: { type: 'string', description: 'Filename of the instruction to load' },
      },
      required: ['mode', 'filename'],
    },
  },
];
