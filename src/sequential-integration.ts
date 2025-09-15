import { SequentialThinkingRequest, RouteSuggestion, ToolInfo, OptimizationCriteria } from './types.js';

export class SequentialThinkingIntegration {
  private isAvailable: boolean = false;
  private serverInfo: any = null;

  constructor() {
    this.checkAvailability();
  }

  /**
   * Check if sequential thinking MCP server is available
   */
  private async checkAvailability(): Promise<void> {
    try {
      // In a real implementation, this would check for the sequential thinking MCP server
      // For now, we'll assume it's available if we can find it in the environment
      this.isAvailable = (process.env.SEQUENTIAL_THINKING_AVAILABLE === 'true') || 
                        (process.env.MCP_SERVERS?.includes('sequential-thinking') ?? false);
    } catch (error) {
      this.isAvailable = false;
    }
  }

  /**
   * Check if sequential thinking is available
   */
  isSequentialThinkingAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Analyze a complex workflow using sequential thinking
   */
  async analyzeWorkflow(
    problem: string,
    availableTools: ToolInfo[],
    criteria: OptimizationCriteria = {
      prioritizeSpeed: false,
      prioritizeSimplicity: false,
      prioritizeReliability: false,
    }
  ): Promise<SequentialThinkingResult> {
    if (!this.isAvailable) {
      throw new Error('Sequential thinking MCP server is not available');
    }

    const request: SequentialThinkingRequest = {
      problem: this.formatProblemForSequentialThinking(problem, availableTools, criteria),
      context: {
        availableTools: availableTools.map(tool => ({
          name: tool.name,
          description: tool.description,
          category: tool.category,
          complexity: tool.estimatedComplexity,
          duration: tool.estimatedDuration,
        })),
        optimizationCriteria: criteria,
      },
      maxThoughts: this.calculateOptimalThoughtCount(problem, availableTools),
      optimizationCriteria: criteria,
    };

    // In a real implementation, this would make an actual call to the sequential thinking MCP
    // For now, we'll simulate the response
    return this.simulateSequentialThinking(request);
  }

  /**
   * Format the problem for sequential thinking analysis
   */
  private formatProblemForSequentialThinking(
    problem: string,
    availableTools: ToolInfo[],
    criteria: OptimizationCriteria
  ): string {
    const toolSummary = availableTools
      .map(tool => `${tool.name}: ${tool.description}`)
      .join('\n');

    const criteriaSummary = this.formatCriteria(criteria);

    return `Problem: ${problem}

Available Tools:
${toolSummary}

Optimization Criteria:
${criteriaSummary}

Please analyze this problem and suggest the best approach for tool chaining, considering the available tools and optimization criteria.`;
  }

  /**
   * Format optimization criteria for sequential thinking
   */
  private formatCriteria(criteria: OptimizationCriteria): string {
    const parts: string[] = [];

    if (criteria.prioritizeSpeed) parts.push('Prioritize speed');
    if (criteria.prioritizeSimplicity) parts.push('Prioritize simplicity');
    if (criteria.prioritizeReliability) parts.push('Prioritize reliability');
    if (criteria.maxComplexity) parts.push(`Max complexity: ${criteria.maxComplexity}`);
    if (criteria.maxDuration) parts.push(`Max duration: ${criteria.maxDuration}ms`);
    if (criteria.requiredCapabilities?.length) {
      parts.push(`Required capabilities: ${criteria.requiredCapabilities.join(', ')}`);
    }
    if (criteria.excludedTools?.length) {
      parts.push(`Excluded tools: ${criteria.excludedTools.join(', ')}`);
    }

    return parts.length > 0 ? parts.join('\n') : 'No specific criteria';
  }

  /**
   * Calculate optimal number of thoughts for sequential thinking
   */
  private calculateOptimalThoughtCount(problem: string, availableTools: ToolInfo[]): number {
    let thoughts = 5; // Base thoughts

    // Add thoughts based on problem complexity
    const problemLength = problem.length;
    if (problemLength > 200) thoughts += 2;
    if (problemLength > 500) thoughts += 2;

    // Add thoughts based on number of available tools
    const toolCount = availableTools.length;
    if (toolCount > 5) thoughts += 1;
    if (toolCount > 10) thoughts += 1;

    // Add thoughts based on tool complexity
    const avgComplexity = availableTools.reduce((sum, tool) => 
      sum + (tool.estimatedComplexity || 1), 0) / availableTools.length;
    if (avgComplexity > 5) thoughts += 2;

    return Math.min(thoughts, 15); // Cap at 15 thoughts
  }

  /**
   * Simulate sequential thinking response (for development/testing)
   */
  private async simulateSequentialThinking(request: SequentialThinkingRequest): Promise<SequentialThinkingResult> {
    // Simulate thinking process
    await new Promise(resolve => setTimeout(resolve, 1000));

    const thoughts = this.generateSimulatedThoughts(request);
    const analysis = this.generateAnalysisFromThoughts(thoughts, request);
    const suggestions = this.generateSuggestionsFromAnalysis(analysis, request);

    return {
      thoughts,
      analysis,
      suggestions,
      confidence: this.calculateConfidence(thoughts, analysis),
      reasoning: this.generateReasoning(thoughts, analysis),
    };
  }

  /**
   * Generate simulated thoughts for development
   */
  private generateSimulatedThoughts(request: SequentialThinkingRequest): SequentialThought[] {
    const thoughts: SequentialThought[] = [
      {
        number: 1,
        content: `Analyzing the problem: "${request.problem}". I need to understand what tools are available and how they can be chained together effectively.`,
        type: 'analysis',
      },
      {
        number: 2,
        content: `Looking at the available tools: ${request.context?.availableTools?.length || 0} tools are available. I need to categorize them by functionality and complexity.`,
        type: 'categorization',
      },
      {
        number: 3,
        content: `Considering optimization criteria: ${this.formatCriteria(request.optimizationCriteria || {
          prioritizeSpeed: false,
          prioritizeSimplicity: false,
          prioritizeReliability: false,
        })}. This will help me prioritize the approach.`,
        type: 'optimization',
      },
      {
        number: 4,
        content: `Identifying potential tool chains: I can see several possible combinations that could solve this problem efficiently.`,
        type: 'planning',
      },
      {
        number: 5,
        content: `Evaluating trade-offs: Speed vs simplicity vs reliability. Based on the criteria, I'll recommend the most suitable approach.`,
        type: 'evaluation',
      },
    ];

    return thoughts;
  }

  /**
   * Generate analysis from thoughts
   */
  private generateAnalysisFromThoughts(thoughts: SequentialThought[], request: SequentialThinkingRequest): WorkflowAnalysis {
    const availableTools = request.context?.availableTools || [];
    
    return {
      problemComplexity: this.assessProblemComplexity(request.problem),
      toolAvailability: availableTools.length,
      recommendedApproach: this.determineRecommendedApproach(request.optimizationCriteria || {
        prioritizeSpeed: false,
        prioritizeSimplicity: false,
        prioritizeReliability: false,
      }),
      keyInsights: [
        'Multiple tool combinations are possible',
        'Sequential execution provides better control',
        'Error handling should be considered',
        'Tool dependencies need to be managed',
      ],
      potentialChallenges: [
        'Tool compatibility issues',
        'Execution order dependencies',
        'Error propagation between tools',
        'Resource constraints',
      ],
    };
  }

  /**
   * Generate suggestions from analysis
   */
  private generateSuggestionsFromAnalysis(analysis: WorkflowAnalysis, request: SequentialThinkingRequest): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];
    const availableTools = request.context?.availableTools || [];

    // Generate different route suggestions based on analysis
    if (analysis.recommendedApproach === 'simple') {
      suggestions.push(this.createSimpleRoute(availableTools));
    } else if (analysis.recommendedApproach === 'fast') {
      suggestions.push(this.createFastRoute(availableTools));
    } else {
      suggestions.push(this.createComprehensiveRoute(availableTools));
    }

    return suggestions;
  }

  /**
   * Create a simple route suggestion
   */
  private createSimpleRoute(availableTools: any[]): RouteSuggestion {
    const simpleTools = availableTools.filter(tool => 
      (tool.complexity || 1) <= 3
    ).slice(0, 2);

    return {
      id: 'sequential_simple_' + Date.now(),
      name: 'Simple Sequential Route',
      description: 'Minimal tool chain optimized for simplicity',
      tools: simpleTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'unknown',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: simpleTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: simpleTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / simpleTools.length,
      confidence: 0.8,
      reasoning: 'Sequential thinking suggests a simple approach with minimal tool complexity',
    };
  }

  /**
   * Create a fast route suggestion
   */
  private createFastRoute(availableTools: any[]): RouteSuggestion {
    const fastTools = availableTools.filter(tool => 
      (tool.duration || 1000) <= 2000
    ).slice(0, 3);

    return {
      id: 'sequential_fast_' + Date.now(),
      name: 'Fast Sequential Route',
      description: 'Optimized for speed and efficiency',
      tools: fastTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'unknown',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: fastTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: fastTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / fastTools.length,
      confidence: 0.75,
      reasoning: 'Sequential thinking recommends prioritizing speed with efficient tool selection',
    };
  }

  /**
   * Create a comprehensive route suggestion
   */
  private createComprehensiveRoute(availableTools: any[]): RouteSuggestion {
    const comprehensiveTools = availableTools.slice(0, 4);

    return {
      id: 'sequential_comprehensive_' + Date.now(),
      name: 'Comprehensive Sequential Route',
      description: 'Thorough approach with multiple validation steps',
      tools: comprehensiveTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'unknown',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: comprehensiveTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: comprehensiveTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / comprehensiveTools.length,
      confidence: 0.7,
      reasoning: 'Sequential thinking suggests a comprehensive approach for complex problems',
    };
  }

  /**
   * Assess problem complexity
   */
  private assessProblemComplexity(problem: string): 'low' | 'medium' | 'high' {
    const length = problem.length;
    const keywords = ['complex', 'multiple', 'analyze', 'comprehensive', 'thorough'];
    const keywordCount = keywords.filter(keyword => 
      problem.toLowerCase().includes(keyword)
    ).length;

    if (length > 300 || keywordCount >= 3) return 'high';
    if (length > 150 || keywordCount >= 1) return 'medium';
    return 'low';
  }

  /**
   * Determine recommended approach based on criteria
   */
  private determineRecommendedApproach(criteria: OptimizationCriteria): 'simple' | 'fast' | 'comprehensive' {
    if (criteria.prioritizeSimplicity) return 'simple';
    if (criteria.prioritizeSpeed) return 'fast';
    return 'comprehensive';
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(thoughts: SequentialThought[], analysis: WorkflowAnalysis): number {
    let confidence = 0.5;

    // Increase confidence based on number of thoughts
    confidence += Math.min(thoughts.length * 0.05, 0.3);

    // Increase confidence based on analysis completeness
    if (analysis.keyInsights.length >= 3) confidence += 0.1;
    if (analysis.potentialChallenges.length >= 2) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate reasoning from thoughts and analysis
   */
  private generateReasoning(thoughts: SequentialThought[], analysis: WorkflowAnalysis): string {
    const thoughtTypes = thoughts.map(t => t.type).join(', ');
    const insights = analysis.keyInsights.slice(0, 2).join('; ');
    
    return `Sequential thinking analysis (${thoughtTypes}) identified key insights: ${insights}. Recommended approach: ${analysis.recommendedApproach}.`;
  }
}

// Helper types
interface SequentialThought {
  number: number;
  content: string;
  type: 'analysis' | 'categorization' | 'optimization' | 'planning' | 'evaluation';
}

interface WorkflowAnalysis {
  problemComplexity: 'low' | 'medium' | 'high';
  toolAvailability: number;
  recommendedApproach: 'simple' | 'fast' | 'comprehensive';
  keyInsights: string[];
  potentialChallenges: string[];
}

interface SequentialThinkingResult {
  thoughts: SequentialThought[];
  analysis: WorkflowAnalysis;
  suggestions: RouteSuggestion[];
  confidence: number;
  reasoning: string;
}
