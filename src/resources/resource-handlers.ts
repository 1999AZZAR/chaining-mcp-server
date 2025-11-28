import { MCPServerDiscovery } from '../core/discovery.js';
import { PromptRegistry } from '../prompts/prompt-registry.js';
import { AwesomeCopilotIntegration } from '../integrations/awesome-copilot-integration.js';
import { SequentialThinkingManager } from '../managers/sequential-thinking-manager.js';
import { WorkflowOrchestrator } from '../managers/workflow-orchestrator.js';

export class ResourceHandlers {
  constructor(
    private discovery: MCPServerDiscovery,
    private promptRegistry: PromptRegistry,
    private awesomeCopilotIntegration: AwesomeCopilotIntegration,
    private sequentialThinkingManager: SequentialThinkingManager,
    private workflowOrchestrator: WorkflowOrchestrator
  ) {}

  async handleReadResource(uri: string): Promise<any> {
    switch (uri) {
      case 'chaining://servers':
        const servers = this.discovery.getServers();
        return {
          servers: servers.map(server => ({
            name: server.name || 'Unknown',
            command: server.command,
            args: server.args,
            env: server.env,
            capabilities: server.capabilities,
          })),
          total: servers.length,
        };

      case 'chaining://tools':
        const tools = this.discovery.getTools();
        return {
          tools: tools.map(tool => ({
            name: tool.name || 'Unknown',
            description: tool.description,
            server: tool.serverName,
            category: tool.category,
            complexity: tool.estimatedComplexity || 1,
          })),
          total: tools.length,
          servers: [...new Set(tools.map(t => t.serverName))].length,
        };

      case 'chaining://analysis':
        const servers2 = this.discovery.getServers();
        const tools2 = this.discovery.getTools();
        return {
          totalServers: servers2.length,
          totalTools: tools2.length,
          categories: [...new Set(tools2.map(t => t.category))],
          lastUpdated: new Date().toISOString(),
        };

      case 'chaining://prompts':
        return {
          prompts: this.promptRegistry.getAllPrompts(),
          total: this.promptRegistry.getAllPrompts().length,
        };

      case 'chaining://resources':
        return {
          resourceSets: this.promptRegistry.getAllResourceSets(),
          total: this.promptRegistry.getAllResourceSets().length,
        };

      case 'chaining://prompts/overview':
        const prompts = this.promptRegistry.getAllPrompts();
        const categories = [...new Set(prompts.map(p => p.category || 'general'))];
        const complexities = [...new Set(prompts.map(p => p.complexity || 'medium'))];

        return {
          totalPrompts: prompts.length,
          categories: categories.map(cat => ({
            name: cat,
            count: prompts.filter(p => (p.category || 'general') === cat).length,
          })),
          complexities: complexities.map(comp => ({
            level: comp,
            count: prompts.filter(p => (p.complexity || 'medium') === comp).length,
          })),
        };

      case 'chaining://awesome-copilot/collections':
        const collections = this.awesomeCopilotIntegration.getCollections();
        return {
          collections: collections.map(c => ({
            name: c.name,
            description: c.description,
            items: c.items?.length || 0,
            tags: c.tags || [],
          })),
          total: collections.length,
        };

      case 'chaining://awesome-copilot/instructions':
        const instructions = this.awesomeCopilotIntegration.getInstructions();
        return {
          instructions: instructions.map(i => ({
            filename: i.filename,
            mode: (i as any).mode || 'unknown',
            description: (i as any).description || 'No description',
          })),
          total: instructions.length,
        };

      case 'chaining://awesome-copilot/status':
        const collections2 = this.awesomeCopilotIntegration.getCollections();
        const instructions2 = this.awesomeCopilotIntegration.getInstructions();
        return {
          collectionsCount: collections2.length,
          instructionsCount: instructions2.length,
          lastUpdate: new Date().toISOString(),
          status: 'active',
        };

      case 'chaining://sequential/state':
        // Simplified for modular version
        return {
          activeSessions: 0,
          totalSessions: 0,
          lastActivity: new Date().toISOString(),
        };

      case 'chaining://workflows/status':
        // Simplified for modular version
        return {
          activeWorkflows: 0,
          completedWorkflows: 0,
          failedWorkflows: 0,
          total: 0,
        };

      case 'chaining://tool-chains':
        return {
          prompts: this.promptRegistry.getAllPrompts().filter(p =>
            p.category === 'tool-chaining' || p.tags?.includes('tool-chaining')
          ),
          resourceSets: this.promptRegistry.getAllResourceSets().filter(rs =>
            rs.category === 'tool-chaining' || rs.tags?.includes('tool-chaining')
          ),
        };

      case 'chaining://tool-chains/overview':
        const toolChainPrompts = this.promptRegistry.getAllPrompts().filter(p =>
          p.category === 'tool-chaining' || p.tags?.includes('tool-chaining')
        );
        const toolChainResourceSets = this.promptRegistry.getAllResourceSets().filter(rs =>
          rs.category === 'tool-chaining' || rs.tags?.includes('tool-chaining')
        );

        return {
          totalToolChainResources: toolChainPrompts.length + toolChainResourceSets.length,
          prompts: toolChainPrompts.length,
          resourceSets: toolChainResourceSets.length,
          categories: ['analysis', 'implementation', 'debugging', 'orchestration', 'ci-cd'],
        };

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  }
}
