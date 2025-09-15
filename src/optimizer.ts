import { ToolInfo, RouteSuggestion, OptimizationCriteria, SequentialThinkingRequest } from './types.js';

export class RouteOptimizer {
  private tools: Map<string, ToolInfo> = new Map();

  constructor(tools: ToolInfo[] = []) {
    this.setTools(tools);
  }

  /**
   * Set the available tools for optimization
   */
  setTools(tools: ToolInfo[]): void {
    this.tools.clear();
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  /**
   * Generate optimal routes for a given task
   */
  async generateRoutes(
    task: string,
    criteria: OptimizationCriteria = {
      prioritizeSpeed: false,
      prioritizeSimplicity: false,
      prioritizeReliability: false,
    }
  ): Promise<RouteSuggestion[]> {
    const suggestions: RouteSuggestion[] = [];

    // Analyze the task to understand requirements
    const taskAnalysis = this.analyzeTask(task);
    
    // Generate different route strategies
    const strategies = this.generateStrategies(taskAnalysis, criteria);
    
    for (const strategy of strategies) {
      const route = await this.buildRoute(strategy, criteria);
      if (route) {
        suggestions.push(route);
      }
    }

    // Sort suggestions by optimization criteria
    return this.sortSuggestions(suggestions, criteria);
  }

  /**
   * Analyze a task to understand its requirements
   */
  private analyzeTask(task: string): TaskAnalysis {
    const keywords = task.toLowerCase();
    
    return {
      requiresFileOperations: keywords.includes('file') || keywords.includes('read') || keywords.includes('write'),
      requiresWebSearch: keywords.includes('search') || keywords.includes('web') || keywords.includes('find'),
      requiresAnalysis: keywords.includes('analyze') || keywords.includes('think') || keywords.includes('reason'),
      requiresDataProcessing: keywords.includes('process') || keywords.includes('transform') || keywords.includes('convert'),
      complexity: this.estimateTaskComplexity(task),
      estimatedDuration: this.estimateTaskDuration(task),
    };
  }

  /**
   * Estimate task complexity based on keywords and length
   */
  private estimateTaskComplexity(task: string): number {
    let complexity = 1;
    
    // Base complexity from task length
    complexity += Math.min(task.length / 100, 3);
    
    // Add complexity for different operation types
    const operations = [
      'file', 'search', 'analyze', 'process', 'transform',
      'convert', 'generate', 'create', 'update', 'delete'
    ];
    
    for (const op of operations) {
      if (task.toLowerCase().includes(op)) {
        complexity += 1;
      }
    }
    
    return Math.min(Math.max(complexity, 1), 10);
  }

  /**
   * Estimate task duration based on complexity
   */
  private estimateTaskDuration(task: string): number {
    const complexity = this.estimateTaskComplexity(task);
    return complexity * 1000; // Base duration in milliseconds
  }

  /**
   * Generate different strategies for completing the task
   */
  private generateStrategies(analysis: TaskAnalysis, criteria: OptimizationCriteria): Strategy[] {
    const strategies: Strategy[] = [];

    // Simple strategy - minimal tools
    if (criteria.prioritizeSimplicity || analysis.complexity <= 3) {
      strategies.push({
        name: 'Simple',
        description: 'Minimal tool usage for straightforward execution',
        tools: this.selectMinimalTools(analysis),
        priority: criteria.prioritizeSimplicity ? 1 : 3,
      });
    }

    // Fast strategy - optimized for speed
    if (criteria.prioritizeSpeed || analysis.complexity <= 5) {
      strategies.push({
        name: 'Fast',
        description: 'Optimized for speed and efficiency',
        tools: this.selectFastTools(analysis),
        priority: criteria.prioritizeSpeed ? 1 : 2,
      });
    }

    // Comprehensive strategy - thorough execution
    if (analysis.complexity >= 4) {
      strategies.push({
        name: 'Comprehensive',
        description: 'Thorough execution with multiple validation steps',
        tools: this.selectComprehensiveTools(analysis),
        priority: 2,
      });
    }

    // Sequential thinking strategy for complex tasks
    if (analysis.requiresAnalysis && analysis.complexity >= 6) {
      strategies.push({
        name: 'Sequential Thinking',
        description: 'Uses sequential thinking for complex analysis',
        tools: this.selectSequentialThinkingTools(analysis),
        priority: 1,
      });
    }

    return strategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Select minimal tools for simple execution
   */
  private selectMinimalTools(analysis: TaskAnalysis): string[] {
    const tools: string[] = [];
    
    if (analysis.requiresFileOperations) {
      tools.push('read_file');
    }
    
    if (analysis.requiresWebSearch) {
      tools.push('web_search');
    }
    
    return tools.slice(0, 2); // Limit to 2 tools for simplicity
  }

  /**
   * Select tools optimized for speed
   */
  private selectFastTools(analysis: TaskAnalysis): string[] {
    const tools: string[] = [];
    
    // Select tools with lowest estimated duration
    const availableTools = Array.from(this.tools.values());
    const relevantTools = availableTools.filter(tool => 
      this.isToolRelevant(tool, analysis)
    );
    
    const sortedTools = relevantTools.sort((a, b) => 
      (a.estimatedDuration || 1000) - (b.estimatedDuration || 1000)
    );
    
    return sortedTools.slice(0, 3).map(tool => tool.name);
  }

  /**
   * Select comprehensive tools for thorough execution
   */
  private selectComprehensiveTools(analysis: TaskAnalysis): string[] {
    const tools: string[] = [];
    
    if (analysis.requiresFileOperations) {
      tools.push('read_file', 'write_file');
    }
    
    if (analysis.requiresWebSearch) {
      tools.push('web_search');
    }
    
    if (analysis.requiresAnalysis) {
      tools.push('sequential_thinking');
    }
    
    return tools;
  }

  /**
   * Select tools that work well with sequential thinking
   */
  private selectSequentialThinkingTools(analysis: TaskAnalysis): string[] {
    const tools: string[] = ['sequential_thinking'];
    
    // Add supporting tools
    if (analysis.requiresFileOperations) {
      tools.push('read_file');
    }
    
    if (analysis.requiresWebSearch) {
      tools.push('web_search');
    }
    
    return tools;
  }

  /**
   * Check if a tool is relevant to the task analysis
   */
  private isToolRelevant(tool: ToolInfo, analysis: TaskAnalysis): boolean {
    const category = tool.category?.toLowerCase() || '';
    
    if (analysis.requiresFileOperations && category.includes('filesystem')) {
      return true;
    }
    
    if (analysis.requiresWebSearch && category.includes('web')) {
      return true;
    }
    
    if (analysis.requiresAnalysis && category.includes('analysis')) {
      return true;
    }
    
    return false;
  }

  /**
   * Build a complete route from a strategy
   */
  private async buildRoute(strategy: Strategy, criteria: OptimizationCriteria): Promise<RouteSuggestion | null> {
    const tools: ToolInfo[] = [];
    let totalDuration = 0;
    let totalComplexity = 0;

    for (const toolName of strategy.tools) {
      const tool = this.tools.get(toolName);
      if (tool) {
        tools.push(tool);
        totalDuration += tool.estimatedDuration || 1000;
        totalComplexity += tool.estimatedComplexity || 1;
      }
    }

    if (tools.length === 0) {
      return null;
    }

    // Calculate confidence based on tool availability and criteria match
    const confidence = this.calculateConfidence(tools, criteria);
    
    // Generate reasoning for the route
    const reasoning = this.generateReasoning(strategy, tools, criteria);

    return {
      id: `route_${strategy.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: strategy.name,
      description: strategy.description,
      tools,
      estimatedDuration: totalDuration,
      complexity: Math.min(totalComplexity / tools.length, 10),
      confidence,
      reasoning,
    };
  }

  /**
   * Calculate confidence score for a route
   */
  private calculateConfidence(tools: ToolInfo[], criteria: OptimizationCriteria): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence if tools match criteria
    if (criteria.prioritizeSpeed) {
      const avgDuration = tools.reduce((sum, tool) => sum + (tool.estimatedDuration || 1000), 0) / tools.length;
      if (avgDuration < 1500) confidence += 0.2;
    }

    if (criteria.prioritizeSimplicity) {
      const avgComplexity = tools.reduce((sum, tool) => sum + (tool.estimatedComplexity || 1), 0) / tools.length;
      if (avgComplexity < 3) confidence += 0.2;
    }

    if (criteria.prioritizeReliability) {
      // Assume tools with lower complexity are more reliable
      const avgComplexity = tools.reduce((sum, tool) => sum + (tool.estimatedComplexity || 1), 0) / tools.length;
      if (avgComplexity < 4) confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate reasoning for a route suggestion
   */
  private generateReasoning(strategy: Strategy, tools: ToolInfo[], criteria: OptimizationCriteria): string {
    const reasons: string[] = [];

    reasons.push(`This route uses the ${strategy.name} strategy`);

    if (criteria.prioritizeSpeed) {
      const avgDuration = tools.reduce((sum, tool) => sum + (tool.estimatedDuration || 1000), 0) / tools.length;
      reasons.push(`optimized for speed (avg duration: ${avgDuration}ms)`);
    }

    if (criteria.prioritizeSimplicity) {
      const avgComplexity = tools.reduce((sum, tool) => sum + (tool.estimatedComplexity || 1), 0) / tools.length;
      reasons.push(`prioritizing simplicity (avg complexity: ${avgComplexity.toFixed(1)})`);
    }

    if (criteria.prioritizeReliability) {
      reasons.push('with focus on reliability');
    }

    reasons.push(`using ${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);

    return reasons.join(', ');
  }

  /**
   * Sort suggestions based on optimization criteria
   */
  private sortSuggestions(suggestions: RouteSuggestion[], criteria: OptimizationCriteria): RouteSuggestion[] {
    return suggestions.sort((a, b) => {
      // Primary sort by criteria
      if (criteria.prioritizeSpeed) {
        return a.estimatedDuration - b.estimatedDuration;
      }
      
      if (criteria.prioritizeSimplicity) {
        return a.complexity - b.complexity;
      }
      
      if (criteria.prioritizeReliability) {
        return b.confidence - a.confidence;
      }
      
      // Default sort by confidence
      return b.confidence - a.confidence;
    });
  }
}

// Helper types
interface TaskAnalysis {
  requiresFileOperations: boolean;
  requiresWebSearch: boolean;
  requiresAnalysis: boolean;
  requiresDataProcessing: boolean;
  complexity: number;
  estimatedDuration: number;
}

interface Strategy {
  name: string;
  description: string;
  tools: string[];
  priority: number;
}
