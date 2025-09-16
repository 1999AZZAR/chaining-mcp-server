export interface DiscoveryConfig {
  configPaths: string[];
  essentialServers: EssentialServerConfig[];
  fallbackTools: FallbackToolConfig[];
  complexityRules: ComplexityRule[];
  durationRules: DurationRule[];
  categoryRules: CategoryRule[];
}

export interface EssentialServerConfig {
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  description: string;
  version: string;
  capabilities: {
    tools: boolean;
    resources: boolean;
    prompts: boolean;
  };
}

export interface FallbackToolConfig {
  serverPattern: string;
  tools: ToolDefinition[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  category: string;
  estimatedComplexity: number;
  estimatedDuration: number;
}

export interface ComplexityRule {
  pattern: string;
  complexity: number;
  description: string;
}

export interface DurationRule {
  pattern: string;
  duration: number;
  description: string;
}

export interface CategoryRule {
  pattern: string;
  category: string;
  description: string;
}

export const defaultDiscoveryConfig: DiscoveryConfig = {
  configPaths: [
    // Cursor MCP configuration (most common)
    '~/.cursor/mcp.json',
    // Other common MCP configuration locations
    '~/.config/mcp/servers.json',
    '~/.mcp/servers.json',
    './mcp-servers.json',
    './.mcp/servers.json',
  ],
  
  essentialServers: [
    {
      name: 'sequential-thinking',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
      env: {},
      description: 'Sequential thinking analysis MCP server',
      version: '1.0.0',
      capabilities: {
        tools: true,
        resources: false,
        prompts: false
      }
    }
  ],

  fallbackTools: [
    {
      serverPattern: 'filesystem|file',
      tools: [
        {
          name: 'read_file',
          description: 'Read contents of a file',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Path to the file' }
            },
            required: ['path']
          },
          category: 'filesystem',
          estimatedComplexity: 2,
          estimatedDuration: 100,
        },
        {
          name: 'write_file',
          description: 'Write content to a file',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Path to the file' },
              content: { type: 'string', description: 'Content to write' }
            },
            required: ['path', 'content']
          },
          category: 'filesystem',
          estimatedComplexity: 3,
          estimatedDuration: 200,
        },
        {
          name: 'list_directory',
          description: 'List contents of a directory',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Path to the directory' }
            },
            required: ['path']
          },
          category: 'filesystem',
          estimatedComplexity: 2,
          estimatedDuration: 150,
        }
      ]
    },
    {
      serverPattern: 'github',
      tools: [
        {
          name: 'create_repository',
          description: 'Create a new GitHub repository',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Repository name' },
              description: { type: 'string', description: 'Repository description' },
              private: { type: 'boolean', description: 'Whether repository is private' }
            },
            required: ['name']
          },
          category: 'github',
          estimatedComplexity: 4,
          estimatedDuration: 2000,
        },
        {
          name: 'get_repository',
          description: 'Get information about a repository',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string', description: 'Repository owner' },
              repo: { type: 'string', description: 'Repository name' }
            },
            required: ['owner', 'repo']
          },
          category: 'github',
          estimatedComplexity: 3,
          estimatedDuration: 1000,
        }
      ]
    },
    {
      serverPattern: 'search|web|google',
      tools: [
        {
          name: 'web_search',
          description: 'Search the web for information',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
              limit: { type: 'number', description: 'Maximum number of results' }
            },
            required: ['query']
          },
          category: 'web',
          estimatedComplexity: 4,
          estimatedDuration: 2000,
        }
      ]
    },
    {
      serverPattern: 'terminal',
      tools: [
        {
          name: 'execute_command',
          description: 'Execute a terminal command',
          inputSchema: {
            type: 'object',
            properties: {
              command: { type: 'string', description: 'Command to execute' },
              workingDirectory: { type: 'string', description: 'Working directory' }
            },
            required: ['command']
          },
          category: 'terminal',
          estimatedComplexity: 5,
          estimatedDuration: 1000,
        }
      ]
    },
    {
      serverPattern: 'wikipedia',
      tools: [
        {
          name: 'search_wikipedia',
          description: 'Search Wikipedia for articles',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
              limit: { type: 'number', description: 'Maximum number of results' }
            },
            required: ['query']
          },
          category: 'knowledge',
          estimatedComplexity: 3,
          estimatedDuration: 1500,
        },
        {
          name: 'get_wikipedia_page',
          description: 'Get content from a Wikipedia page',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Page title' },
              lang: { type: 'string', description: 'Language code' }
            },
            required: ['title']
          },
          category: 'knowledge',
          estimatedComplexity: 3,
          estimatedDuration: 1000,
        }
      ]
    },
    {
      serverPattern: 'sequential-thinking|sequential',
      tools: [
        {
          name: 'sequentialthinking',
          description: 'A detailed tool for dynamic and reflective problem-solving through thoughts',
          inputSchema: {
            type: 'object',
            properties: {
              thought: { type: 'string', description: 'Your current thinking step' },
              nextThoughtNeeded: { type: 'boolean', description: 'Whether another thought step is needed' },
              thoughtNumber: { type: 'number', description: 'Current thought number' },
              totalThoughts: { type: 'number', description: 'Estimated total thoughts needed' },
              isRevision: { type: 'boolean', description: 'Whether this revises previous thinking' },
              revisesThought: { type: 'number', description: 'Which thought is being reconsidered' },
              branchFromThought: { type: 'number', description: 'Branching point thought number' },
              branchId: { type: 'string', description: 'Branch identifier' },
              needsMoreThoughts: { type: 'boolean', description: 'If more thoughts are needed' }
            },
            required: ['thought', 'nextThoughtNeeded', 'thoughtNumber', 'totalThoughts']
          },
          category: 'analysis',
          estimatedComplexity: 5,
          estimatedDuration: 2000,
        }
      ]
    }
  ],

  complexityRules: [
    { pattern: 'read|get|list', complexity: 2, description: 'Simple read operations' },
    { pattern: 'write|create|update', complexity: 3, description: 'Write operations' },
    { pattern: 'search|find|query', complexity: 4, description: 'Search operations' },
    { pattern: 'execute|run|command', complexity: 5, description: 'Command execution' },
    { pattern: 'thinking|analysis|complex', complexity: 6, description: 'Complex analysis' },
  ],

  durationRules: [
    { pattern: 'read|get|list', duration: 100, description: 'Fast read operations' },
    { pattern: 'write|create|update', duration: 200, description: 'Medium write operations' },
    { pattern: 'search|find|query', duration: 2000, description: 'Slow search operations' },
    { pattern: 'execute|run|command', duration: 1000, description: 'Medium command execution' },
    { pattern: 'thinking|analysis', duration: 1000, description: 'Analysis operations' },
  ],

  categoryRules: [
    { pattern: 'file|directory|path', category: 'filesystem', description: 'File system operations' },
    { pattern: 'search|web|url', category: 'web', description: 'Web operations' },
    { pattern: 'github|repository|commit', category: 'github', description: 'GitHub operations' },
    { pattern: 'terminal|command|execute', category: 'terminal', description: 'Terminal operations' },
    { pattern: 'wikipedia|knowledge|article', category: 'knowledge', description: 'Knowledge operations' },
    { pattern: 'thinking|analysis|reason', category: 'analysis', description: 'Analysis operations' },
  ]
};
