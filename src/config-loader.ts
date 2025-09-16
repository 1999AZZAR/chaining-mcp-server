import { readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { DiscoveryConfig, defaultDiscoveryConfig } from './discovery-config.js';

export class ConfigLoader {
  private config: DiscoveryConfig;

  constructor() {
    this.config = defaultDiscoveryConfig;
  }

  /**
   * Load configuration from file or environment variables
   */
  async loadConfig(): Promise<DiscoveryConfig> {
    // Try to load from environment variable first
    const envConfig = this.loadFromEnvironment();
    if (envConfig) {
      this.config = this.mergeConfigs(defaultDiscoveryConfig, envConfig);
      return this.config;
    }

    // Try to load from config file
    const configPaths = [
      join(process.cwd(), 'discovery-config.json'),
      join(process.cwd(), '.mcp', 'discovery-config.json'),
      join(homedir(), '.config', 'mcp', 'discovery-config.json'),
      join(homedir(), '.mcp', 'discovery-config.json'),
    ];

    for (const configPath of configPaths) {
      try {
        await access(configPath);
        const configContent = await readFile(configPath, 'utf-8');
        const fileConfig = JSON.parse(configContent);
        this.config = this.mergeConfigs(defaultDiscoveryConfig, fileConfig);
        return this.config;
      } catch (error) {
        // Config file doesn't exist or is invalid, continue
        continue;
      }
    }

    // Return default config if no custom config found
    return this.config;
  }

  /**
   * Load configuration from environment variables
   */
  private loadFromEnvironment(): Partial<DiscoveryConfig> | null {
    const config: Partial<DiscoveryConfig> = {};

    // Load config paths from environment
    const configPathsEnv = process.env.MCP_DISCOVERY_CONFIG_PATHS;
    if (configPathsEnv) {
      try {
        config.configPaths = JSON.parse(configPathsEnv);
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    // Load essential servers from environment
    const essentialServersEnv = process.env.MCP_ESSENTIAL_SERVERS;
    if (essentialServersEnv) {
      try {
        config.essentialServers = JSON.parse(essentialServersEnv);
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    // Load fallback tools from environment
    const fallbackToolsEnv = process.env.MCP_FALLBACK_TOOLS;
    if (fallbackToolsEnv) {
      try {
        config.fallbackTools = JSON.parse(fallbackToolsEnv);
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    // Load complexity rules from environment
    const complexityRulesEnv = process.env.MCP_COMPLEXITY_RULES;
    if (complexityRulesEnv) {
      try {
        config.complexityRules = JSON.parse(complexityRulesEnv);
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    // Load duration rules from environment
    const durationRulesEnv = process.env.MCP_DURATION_RULES;
    if (durationRulesEnv) {
      try {
        config.durationRules = JSON.parse(durationRulesEnv);
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    // Load category rules from environment
    const categoryRulesEnv = process.env.MCP_CATEGORY_RULES;
    if (categoryRulesEnv) {
      try {
        config.categoryRules = JSON.parse(categoryRulesEnv);
      } catch (error) {
        // Invalid JSON, ignore
      }
    }

    // Return config if any properties were loaded
    return Object.keys(config).length > 0 ? config : null;
  }

  /**
   * Merge two configuration objects
   */
  public mergeConfigs(defaultConfig: DiscoveryConfig, customConfig: Partial<DiscoveryConfig>): DiscoveryConfig {
    return {
      configPaths: customConfig.configPaths || defaultConfig.configPaths,
      essentialServers: customConfig.essentialServers || defaultConfig.essentialServers,
      fallbackTools: customConfig.fallbackTools || defaultConfig.fallbackTools,
      complexityRules: customConfig.complexityRules || defaultConfig.complexityRules,
      durationRules: customConfig.durationRules || defaultConfig.durationRules,
      categoryRules: customConfig.categoryRules || defaultConfig.categoryRules,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): DiscoveryConfig {
    return this.config;
  }

  /**
   * Expand configuration paths (resolve ~ and relative paths)
   */
  expandPaths(paths: string[]): string[] {
    return paths.map(path => {
      if (path.startsWith('~/')) {
        return join(homedir(), path.slice(2));
      }
      if (path.startsWith('./')) {
        return join(process.cwd(), path.slice(2));
      }
      return path;
    });
  }

  /**
   * Save current configuration to file
   */
  async saveConfig(configPath: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
  }
}
