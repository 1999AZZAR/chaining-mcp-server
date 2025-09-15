import { glob } from 'glob';
import { readFile, readdir, stat, access } from 'fs/promises';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { spawn, ChildProcess } from 'child_process';
import { MCPServerInfo, ToolInfo, MCPServerInfoSchema } from './types.js';

export class MCPServerDiscovery {
  private servers: Map<string, MCPServerInfo> = new Map();
  private tools: Map<string, ToolInfo> = new Map();

  constructor() {}

  /**
   * Discover MCP servers from common configuration locations
   */
  async discoverServers(): Promise<MCPServerInfo[]> {
    const configPaths = [
      // Cursor MCP configuration (most common)
      join(homedir(), '.cursor', 'mcp.json'),
      // Other common MCP configuration locations
      join(homedir(), '.config', 'mcp', 'servers.json'),
      join(homedir(), '.mcp', 'servers.json'),
      join(process.cwd(), 'mcp-servers.json'),
      join(process.cwd(), '.mcp', 'servers.json'),
      // Look for package.json files that might contain MCP server configs
      ...(await this.findPackageJsonFiles()),
    ];

    const discoveredServers: MCPServerInfo[] = [];

    for (const configPath of configPaths) {
      try {
        const servers = await this.loadServersFromConfig(configPath);
        discoveredServers.push(...servers);
      } catch (error) {
        // Config file doesn't exist or is invalid, continue
        continue;
      }
    }

    // Also try to discover from environment variables
    const envServers = this.discoverFromEnvironment();
    discoveredServers.push(...envServers);

    // Add hardcoded essential servers (always available via npx)
    const hardcodedServers = this.getHardcodedServers();
    discoveredServers.push(...hardcodedServers);

    // Store discovered servers
    for (const server of discoveredServers) {
      this.servers.set(server.name, server);
    }

    return discoveredServers;
  }

  /**
   * Find package.json files that might contain MCP server configurations
   */
  private async findPackageJsonFiles(): Promise<string[]> {
    try {
      const patterns = [
        '**/package.json',
        '**/mcp-servers.json',
        '**/.mcp/servers.json',
      ];
      
      const files: string[] = [];
      for (const pattern of patterns) {
        const matches = await glob(pattern, {
          ignore: ['node_modules/**', 'dist/**', 'build/**'],
          cwd: process.cwd(),
        });
        files.push(...matches);
      }
      
      return files;
    } catch (error) {
      return [];
    }
  }

  /**
   * Load servers from a configuration file
   */
  private async loadServersFromConfig(configPath: string): Promise<MCPServerInfo[]> {
    try {
      const content = await readFile(configPath, 'utf-8');
      const config = JSON.parse(content);

      // Handle Cursor MCP configuration format
      if (config.mcpServers) {
        return Object.entries(config.mcpServers).map(([name, serverConfig]: [string, any]) => {
          return MCPServerInfoSchema.parse({
            name,
            command: serverConfig.command,
            args: serverConfig.args || [],
            env: serverConfig.env || {},
            description: `MCP server: ${name}`,
            version: '1.0.0',
            capabilities: {
              tools: true,
              resources: false,
              prompts: false,
            },
          });
        });
      }

      // Handle other config formats
      if (config.servers) {
        return config.servers.map((server: any) => MCPServerInfoSchema.parse(server));
      } else if (Array.isArray(config)) {
        return config.map((server: any) => MCPServerInfoSchema.parse(server));
      } else if (config.command) {
        return [MCPServerInfoSchema.parse(config)];
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Discover servers from environment variables
   */
  private discoverFromEnvironment(): MCPServerInfo[] {
    const servers: MCPServerInfo[] = [];
    
    // Look for MCP_SERVERS environment variable
    const mcpServers = process.env.MCP_SERVERS;
    if (mcpServers) {
      try {
        const parsed = JSON.parse(mcpServers);
        if (Array.isArray(parsed)) {
          servers.push(...parsed.map((server: any) => MCPServerInfoSchema.parse(server)));
        }
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    return servers;
  }

  /**
   * Get hardcoded essential servers that are always available via npx
   */
  private getHardcodedServers(): MCPServerInfo[] {
    const servers: MCPServerInfo[] = [];

    // Sequential Thinking Server - always available via npx
    servers.push({
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
    });

    return servers;
  }

  /**
   * Analyze tools from discovered servers
   */
  async analyzeTools(): Promise<ToolInfo[]> {
    const tools: ToolInfo[] = [];

    for (const [serverName, serverInfo] of this.servers) {
      try {
        const serverTools = await this.extractToolsFromServer(serverName, serverInfo);
        tools.push(...serverTools);
      } catch (error) {
        console.warn(`Failed to analyze tools from server ${serverName}:`, error);
        // Add fallback tools for known server types
        const fallbackTools = this.getFallbackTools(serverName, serverInfo);
        tools.push(...fallbackTools);
      }
    }

    // Store tools
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }

    return tools;
  }

  /**
   * Extract tools from a specific server
   */
  private async extractToolsFromServer(serverName: string, serverInfo: MCPServerInfo): Promise<ToolInfo[]> {
    const tools: ToolInfo[] = [];

    try {
      // Try to connect to the server and query its tools
      const serverTools = await this.queryServerTools(serverName, serverInfo);
      tools.push(...serverTools);
    } catch (error) {
      // If connection fails, use fallback tools based on server name/type
      const fallbackTools = this.getFallbackTools(serverName, serverInfo);
      tools.push(...fallbackTools);
    }

    return tools;
  }

  /**
   * Query a server for its tools using MCP protocol
   */
  private async queryServerTools(serverName: string, serverInfo: MCPServerInfo): Promise<ToolInfo[]> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout connecting to server ${serverName}`));
      }, 5000); // 5 second timeout

      try {
        const child = spawn(serverInfo.command, serverInfo.args, {
          env: { ...process.env, ...serverInfo.env },
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let output = '';
        let errorOutput = '';

        child.stdout?.on('data', (data) => {
          output += data.toString();
        });

        child.stderr?.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });

        child.on('close', (code) => {
          clearTimeout(timeout);
          if (code !== 0) {
            reject(new Error(`Server exited with code ${code}: ${errorOutput}`));
            return;
          }

          try {
            // Parse the MCP response to extract tools
            const tools = this.parseMCPToolsResponse(output, serverName);
            resolve(tools);
          } catch (parseError) {
            reject(parseError);
          }
        });

        // Send MCP list_tools request
        const request = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {},
        };

        child.stdin?.write(JSON.stringify(request) + '\n');
        child.stdin?.end();

      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Parse MCP tools response
   */
  private parseMCPToolsResponse(output: string, serverName: string): ToolInfo[] {
    const lines = output.split('\n').filter(line => line.trim());
    const tools: ToolInfo[] = [];

    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        if (response.result?.tools) {
          for (const tool of response.result.tools) {
            tools.push({
              name: tool.name,
              description: tool.description || `Tool from ${serverName}`,
              inputSchema: tool.inputSchema || {},
              serverName,
              category: this.inferCategory(tool.name, tool.description),
              estimatedComplexity: this.estimateComplexity(tool.name, tool.description),
              estimatedDuration: this.estimateDuration(tool.name, tool.description),
            });
          }
        }
      } catch (error) {
        // Skip invalid JSON lines
        continue;
      }
    }

    return tools;
  }

  /**
   * Get fallback tools for known server types
   */
  private getFallbackTools(serverName: string, serverInfo: MCPServerInfo): ToolInfo[] {
    const tools: ToolInfo[] = [];

    // Filesystem server tools
    if (serverName.includes('filesystem') || serverName.includes('file')) {
      tools.push(
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
          serverName,
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
          serverName,
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
          serverName,
          category: 'filesystem',
          estimatedComplexity: 2,
          estimatedDuration: 150,
        }
      );
    }

    // GitHub server tools
    if (serverName.includes('github')) {
      tools.push(
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
          serverName,
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
          serverName,
          category: 'github',
          estimatedComplexity: 3,
          estimatedDuration: 1000,
        }
      );
    }

    // Web search tools
    if (serverName.includes('search') || serverName.includes('web') || serverName.includes('google')) {
      tools.push({
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
        serverName,
        category: 'web',
        estimatedComplexity: 4,
        estimatedDuration: 2000,
      });
    }


    // Terminal tools
    if (serverName.includes('terminal')) {
      tools.push({
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
        serverName,
        category: 'terminal',
        estimatedComplexity: 5,
        estimatedDuration: 1000,
      });
    }

    // Wikipedia tools
    if (serverName.includes('wikipedia')) {
      tools.push(
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
          serverName,
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
          serverName,
          category: 'knowledge',
          estimatedComplexity: 3,
          estimatedDuration: 1000,
        }
      );
    }

    // Sequential thinking server tools
    if (serverName.includes('sequential-thinking') || serverName.includes('sequential')) {
      tools.push(
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
          serverName,
          category: 'analysis',
          estimatedComplexity: 5,
          estimatedDuration: 2000,
        }
      );
    }

    return tools;
  }

  /**
   * Infer tool category from name and description
   */
  private inferCategory(name: string, description?: string): string {
    const text = `${name} ${description || ''}`.toLowerCase();
    
    if (text.includes('file') || text.includes('directory') || text.includes('path')) return 'filesystem';
    if (text.includes('search') || text.includes('web') || text.includes('url')) return 'web';
    if (text.includes('github') || text.includes('repository') || text.includes('commit')) return 'github';
    if (text.includes('terminal') || text.includes('command') || text.includes('execute')) return 'terminal';
    if (text.includes('wikipedia') || text.includes('knowledge') || text.includes('article')) return 'knowledge';
    if (text.includes('thinking') || text.includes('analysis') || text.includes('reason')) return 'analysis';
    
    return 'utility';
  }

  /**
   * Estimate tool complexity
   */
  private estimateComplexity(name: string, description?: string): number {
    const text = `${name} ${description || ''}`.toLowerCase();
    
    if (text.includes('read') || text.includes('get') || text.includes('list')) return 2;
    if (text.includes('write') || text.includes('create') || text.includes('update')) return 3;
    if (text.includes('search') || text.includes('find') || text.includes('query')) return 4;
    if (text.includes('execute') || text.includes('run') || text.includes('command')) return 5;
    if (text.includes('thinking') || text.includes('analysis') || text.includes('complex')) return 6;
    
    return 3; // Default complexity
  }

  /**
   * Estimate tool duration
   */
  private estimateDuration(name: string, description?: string): number {
    const text = `${name} ${description || ''}`.toLowerCase();
    
    if (text.includes('read') || text.includes('get') || text.includes('list')) return 100;
    if (text.includes('write') || text.includes('create') || text.includes('update')) return 200;
    if (text.includes('search') || text.includes('find') || text.includes('query')) return 2000;
    if (text.includes('execute') || text.includes('run') || text.includes('command')) return 1000;
    if (text.includes('thinking') || text.includes('analysis')) return 1000;
    
    return 500; // Default duration
  }

  /**
   * Get all discovered servers
   */
  getServers(): MCPServerInfo[] {
    return Array.from(this.servers.values());
  }

  /**
   * Get all discovered tools
   */
  getTools(): ToolInfo[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: string): ToolInfo[] {
    return this.getTools().filter(tool => tool.category === category);
  }

  /**
   * Get tools by server
   */
  getToolsByServer(serverName: string): ToolInfo[] {
    return this.getTools().filter(tool => tool.serverName === serverName);
  }
}
