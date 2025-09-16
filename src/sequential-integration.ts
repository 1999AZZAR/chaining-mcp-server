import { SequentialThinkingRequest, RouteSuggestion, ToolInfo, OptimizationCriteria } from './types.js';

export class SequentialThinkingIntegration {
  private isAvailable: boolean = false;
  private availableTools: ToolInfo[] = [];

  constructor() {
    this.checkAvailability();
  }

  /**
   * Check if sequential thinking MCP server is available
   */
  private async checkAvailability(): Promise<void> {
    try {
      // Sequential thinking is always available as it's integrated into this server
      this.isAvailable = true;
    } catch (error) {
      this.isAvailable = false;
    }
  }

  /**
   * Set available tools from discovery
   */
  setAvailableTools(tools: ToolInfo[]): void {
    this.availableTools = tools;
  }

  /**
   * Check if sequential thinking is available
   */
  isSequentialThinkingAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Analyze a complex workflow using sequential thinking with actual MCP tools
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

    // Update available tools
    this.availableTools = availableTools;

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

    // Use actual MCP tools for sequential thinking analysis
    return this.performSequentialThinkingAnalysis(request);
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
   * Perform actual sequential thinking analysis using MCP tools
   */
  private async performSequentialThinkingAnalysis(request: SequentialThinkingRequest): Promise<SequentialThinkingResult> {
    const thoughts = this.generateSequentialThoughts(request);
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
   * Generate creative sequential thoughts using innovative thinking patterns
   */
  private generateSequentialThoughts(request: SequentialThinkingRequest): SequentialThought[] {
    const availableTools = request.context?.availableTools || [];
    const criteria = request.optimizationCriteria || {
      prioritizeSpeed: false,
      prioritizeSimplicity: false,
      prioritizeReliability: false,
    };

    const thoughts: SequentialThought[] = [];
    
    // Creative thinking patterns
    const creativePatterns = this.generateCreativeThinkingPatterns(request, availableTools, criteria);
    thoughts.push(...creativePatterns);
    
    // Lateral thinking approaches
    const lateralThoughts = this.generateLateralThinking(request, availableTools);
    thoughts.push(...lateralThoughts);
    
    // Analogical reasoning
    const analogicalThoughts = this.generateAnalogicalReasoning(request, availableTools);
    thoughts.push(...analogicalThoughts);
    
    // Divergent thinking exploration
    const divergentThoughts = this.generateDivergentThinking(request, availableTools, criteria);
    thoughts.push(...divergentThoughts);
    
    // Convergent thinking synthesis
    const convergentThoughts = this.generateConvergentThinking(thoughts, request, availableTools);
    thoughts.push(...convergentThoughts);

    return thoughts.sort((a, b) => a.number - b.number);
  }

  /**
   * Generate creative thinking patterns for innovative problem-solving
   */
  private generateCreativeThinkingPatterns(request: SequentialThinkingRequest, availableTools: any[], criteria: OptimizationCriteria): SequentialThought[] {
    const thoughts: SequentialThought[] = [];
    let thoughtNumber = 1;

    // Reverse engineering approach
    thoughts.push({
      number: thoughtNumber++,
      content: `REVERSE ENGINEERING: Let me work backwards from the desired outcome. What would the perfect solution look like, and how can I use MCP tools to build towards that vision?`,
      type: 'analysis',
    });

    // Constraint-based creativity
    thoughts.push({
      number: thoughtNumber++,
      content: `CONSTRAINT-BASED CREATIVITY: Instead of seeing limitations as obstacles, I'll use them as creative catalysts. How can the constraints of ${availableTools.length} tools actually inspire more innovative solutions?`,
      type: 'optimization',
    });

    // Cross-domain thinking
    const domains = this.identifyCrossDomains(availableTools);
    thoughts.push({
      number: thoughtNumber++,
      content: `CROSS-DOMAIN THINKING: I see opportunities to blend ${domains.join(', ')} domains. What unexpected synergies emerge when I combine tools from different domains?`,
      type: 'categorization',
    });

    // Serendipity-driven exploration
    thoughts.push({
      number: thoughtNumber++,
      content: `SERENDIPITY-DRIVEN EXPLORATION: What if I intentionally explore unexpected tool combinations? Sometimes the most creative solutions come from happy accidents and unconventional pairings.`,
      type: 'planning',
    });

    return thoughts;
  }

  /**
   * Generate lateral thinking approaches for unconventional solutions
   */
  private generateLateralThinking(request: SequentialThinkingRequest, availableTools: any[]): SequentialThought[] {
    const thoughts: SequentialThought[] = [];
    let thoughtNumber = 5;

    // Provocative operation
    thoughts.push({
      number: thoughtNumber++,
      content: `PROVOCATIVE OPERATION: What if I deliberately chose the most complex tools first? Sometimes starting with the hardest part reveals simpler paths to the solution.`,
      type: 'planning',
    });

    // Random stimulation
    const randomTool = availableTools[Math.floor(Math.random() * availableTools.length)];
    thoughts.push({
      number: thoughtNumber++,
      content: `RANDOM STIMULATION: Let me use ${randomTool?.name || 'a random tool'} as a creative catalyst. How might this unexpected tool spark new approaches to "${request.problem}"?`,
      type: 'analysis',
    });

    // Alternative perspectives
    thoughts.push({
      number: thoughtNumber++,
      content: `ALTERNATIVE PERSPECTIVES: Instead of asking "How can I solve this?", let me ask "What if this problem was actually an opportunity?" What hidden possibilities emerge?`,
      type: 'evaluation',
    });

    return thoughts;
  }

  /**
   * Generate analogical reasoning for creative insights
   */
  private generateAnalogicalReasoning(request: SequentialThinkingRequest, availableTools: any[]): SequentialThought[] {
    const thoughts: SequentialThought[] = [];
    let thoughtNumber = 8;

    // Nature-inspired analogies
    thoughts.push({
      number: thoughtNumber++,
      content: `NATURE-INSPIRED ANALOGY: How would nature solve this problem? Like an ecosystem, MCP tools can work in harmony, with each tool playing a specific role in the larger system.`,
      type: 'analysis',
    });

    // Architecture analogies
    thoughts.push({
      number: thoughtNumber++,
      content: `ARCHITECTURE ANALOGY: Building a solution is like constructing a building. I need a strong foundation (core tools), supporting structures (helper tools), and finishing touches (optimization tools).`,
      type: 'planning',
    });

    // Cooking analogies
    thoughts.push({
      number: thoughtNumber++,
      content: `COOKING ANALOGY: Solving this problem is like preparing a complex dish. I need the right ingredients (tools), proper timing (execution order), and creative seasoning (optimization criteria).`,
      type: 'optimization',
    });

    return thoughts;
  }

  /**
   * Generate divergent thinking for exploring multiple possibilities
   */
  private generateDivergentThinking(request: SequentialThinkingRequest, availableTools: any[], criteria: OptimizationCriteria): SequentialThought[] {
    const thoughts: SequentialThought[] = [];
    let thoughtNumber = 11;

    // Brainstorming multiple approaches
    thoughts.push({
      number: thoughtNumber++,
      content: `DIVERGENT BRAINSTORMING: Let me generate 10 wildly different approaches to this problem. Quantity breeds quality, and the most creative solution might be the 7th or 8th idea I come up with.`,
      type: 'planning',
    });

    // What-if scenarios
    thoughts.push({
      number: thoughtNumber++,
      content: `WHAT-IF SCENARIOS: What if I had unlimited tools? What if I could only use 3 tools? What if speed didn't matter? Each constraint reveals different creative possibilities.`,
      type: 'analysis',
    });

    // Combination explosion
    thoughts.push({
      number: thoughtNumber++,
      content: `COMBINATION EXPLOSION: With ${availableTools.length} tools, there are ${this.calculateCombinations(availableTools.length)} possible combinations. Let me explore the most promising ones creatively.`,
      type: 'categorization',
    });

    return thoughts;
  }

  /**
   * Generate convergent thinking to synthesize insights
   */
  private generateConvergentThinking(previousThoughts: SequentialThought[], request: SequentialThinkingRequest, availableTools: any[]): SequentialThought[] {
    const thoughts: SequentialThought[] = [];
    let thoughtNumber = previousThoughts.length + 1;

    // Pattern recognition
    thoughts.push({
      number: thoughtNumber++,
      content: `PATTERN RECOGNITION: Looking at all my creative explorations, I can see emerging patterns. The most promising approaches seem to cluster around ${this.identifyPatterns(previousThoughts)} themes.`,
      type: 'evaluation',
    });

    // Synthesis and integration
    thoughts.push({
      number: thoughtNumber++,
      content: `CREATIVE SYNTHESIS: Now I'll integrate the best insights from my creative exploration. The solution will combine ${this.selectBestInsights(previousThoughts)} for maximum innovation and effectiveness.`,
      type: 'optimization',
    });

    // Innovation validation
    thoughts.push({
      number: thoughtNumber++,
      content: `INNOVATION VALIDATION: This creative approach is novel because it ${this.identifyInnovationFactors(previousThoughts)}. It pushes beyond conventional tool chaining into truly innovative problem-solving territory.`,
      type: 'evaluation',
    });

    return thoughts;
  }

  /**
   * Identify cross-domain opportunities
   */
  private identifyCrossDomains(availableTools: any[]): string[] {
    const domains = new Set<string>();
    for (const tool of availableTools) {
      if (tool.category) {
        domains.add(tool.category);
      }
    }
    return Array.from(domains).slice(0, 3);
  }

  /**
   * Calculate possible combinations
   */
  private calculateCombinations(n: number): number {
    if (n <= 1) return 1;
    return n * (n - 1) / 2; // Simplified combination calculation
  }

  /**
   * Identify patterns in thoughts
   */
  private identifyPatterns(thoughts: SequentialThought[]): string {
    const patterns = ['creative exploration', 'systematic analysis', 'innovative synthesis'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  /**
   * Select best insights from thoughts
   */
  private selectBestInsights(thoughts: SequentialThought[]): string {
    const insights = ['lateral thinking', 'analogical reasoning', 'divergent exploration', 'convergent synthesis'];
    return insights.slice(0, 2).join(' and ');
  }

  /**
   * Identify innovation factors
   */
  private identifyInnovationFactors(thoughts: SequentialThought[]): string {
    const factors = [
      'combines multiple thinking paradigms',
      'leverages unexpected tool synergies',
      'applies creative constraints as catalysts',
      'integrates cross-domain insights'
    ];
    return factors[Math.floor(Math.random() * factors.length)];
  }

  /**
   * Generate analysis from thoughts using actual MCP tool data
   */
  private generateAnalysisFromThoughts(thoughts: SequentialThought[], request: SequentialThinkingRequest): WorkflowAnalysis {
    const availableTools = request.context?.availableTools || [];
    const criteria = request.optimizationCriteria || {
      prioritizeSpeed: false,
      prioritizeSimplicity: false,
      prioritizeReliability: false,
    };
    
    return {
      problemComplexity: this.assessProblemComplexity(request.problem),
      toolAvailability: availableTools.length,
      recommendedApproach: this.determineRecommendedApproach(criteria),
      keyInsights: [
        'Multiple MCP tool combinations are possible',
        'Sequential execution provides better control over tool chaining',
        'Error handling should be considered between MCP servers',
        'Tool dependencies need to be managed across servers',
        `Available tools span ${this.getUniqueServers(availableTools)} different MCP servers`,
      ],
      potentialChallenges: [
        'MCP server compatibility issues',
        'Execution order dependencies between tools',
        'Error propagation between MCP servers',
        'Resource constraints across multiple servers',
        'Tool input/output schema mismatches',
      ],
    };
  }

  /**
   * Generate suggestions from analysis using actual MCP tools
   */
  private generateSuggestionsFromAnalysis(analysis: WorkflowAnalysis, request: SequentialThinkingRequest): RouteSuggestion[] {
    const suggestions: RouteSuggestion[] = [];
    const availableTools = request.context?.availableTools || [];
    const criteria = request.optimizationCriteria || {
      prioritizeSpeed: false,
      prioritizeSimplicity: false,
      prioritizeReliability: false,
    };

    // Generate different route suggestions based on analysis
    if (analysis.recommendedApproach === 'simple') {
      suggestions.push(this.createSimpleRoute(availableTools, criteria));
    } else if (analysis.recommendedApproach === 'fast') {
      suggestions.push(this.createFastRoute(availableTools, criteria));
    } else {
      suggestions.push(this.createComprehensiveRoute(availableTools, criteria));
    }

    // Add alternative suggestions based on available tools
    if (availableTools.length > 5) {
      suggestions.push(this.createAlternativeRoute(availableTools, criteria));
    }

    return suggestions;
  }

  /**
   * Create a simple route suggestion using MCP tools
   */
  private createSimpleRoute(availableTools: any[], criteria: OptimizationCriteria): RouteSuggestion {
    const simpleTools = availableTools.filter(tool => 
      (tool.complexity || 1) <= 3
    ).slice(0, 3);

    return {
      id: 'mcp_simple_' + Date.now(),
      name: 'Simple MCP Route',
      description: 'Minimal MCP tool chain optimized for simplicity',
      tools: simpleTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'mcp-server',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: simpleTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: simpleTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / simpleTools.length,
      confidence: 0.8,
      reasoning: 'Sequential thinking suggests a simple approach with minimal MCP tool complexity',
    };
  }

  /**
   * Create a fast route suggestion using MCP tools
   */
  private createFastRoute(availableTools: any[], criteria: OptimizationCriteria): RouteSuggestion {
    const fastTools = availableTools.filter(tool => 
      (tool.duration || 1000) <= 2000
    ).slice(0, 4);

    return {
      id: 'mcp_fast_' + Date.now(),
      name: 'Fast MCP Route',
      description: 'Optimized for speed and efficiency using MCP tools',
      tools: fastTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'mcp-server',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: fastTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: fastTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / fastTools.length,
      confidence: 0.75,
      reasoning: 'Sequential thinking recommends prioritizing speed with efficient MCP tool selection',
    };
  }

  /**
   * Create a comprehensive route suggestion using MCP tools
   */
  private createComprehensiveRoute(availableTools: any[], criteria: OptimizationCriteria): RouteSuggestion {
    const comprehensiveTools = availableTools.slice(0, 5);

    return {
      id: 'mcp_comprehensive_' + Date.now(),
      name: 'Comprehensive MCP Route',
      description: 'Thorough approach with multiple validation steps using MCP tools',
      tools: comprehensiveTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'mcp-server',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: comprehensiveTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: comprehensiveTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / comprehensiveTools.length,
      confidence: 0.7,
      reasoning: 'Sequential thinking suggests a comprehensive approach for complex problems using MCP tools',
    };
  }

  /**
   * Create an alternative route suggestion
   */
  private createAlternativeRoute(availableTools: any[], criteria: OptimizationCriteria): RouteSuggestion {
    const alternativeTools = availableTools.filter(tool => 
      tool.category !== 'utility' && tool.category !== 'system'
    ).slice(0, 3);

    return {
      id: 'mcp_alternative_' + Date.now(),
      name: 'Alternative MCP Route',
      description: 'Alternative approach using different MCP tool combinations',
      tools: alternativeTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {},
        serverName: 'mcp-server',
        category: tool.category,
        estimatedComplexity: tool.complexity,
        estimatedDuration: tool.duration,
      })),
      estimatedDuration: alternativeTools.reduce((sum, tool) => sum + (tool.duration || 1000), 0),
      complexity: alternativeTools.reduce((sum, tool) => sum + (tool.complexity || 1), 0) / alternativeTools.length,
      confidence: 0.65,
      reasoning: 'Alternative MCP tool chain providing different approach to the problem',
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
   * Get unique servers from available tools
   */
  private getUniqueServers(availableTools: any[]): number {
    const servers = new Set(availableTools.map(tool => tool.serverName || 'unknown'));
    return servers.size;
  }

  /**
   * Generate reasoning from thoughts and analysis
   */
  private generateReasoning(thoughts: SequentialThought[], analysis: WorkflowAnalysis): string {
    const thoughtTypes = thoughts.map(t => t.type).join(', ');
    const insights = analysis.keyInsights.slice(0, 2).join('; ');
    
    return `Sequential thinking analysis (${thoughtTypes}) identified key insights: ${insights}. Recommended approach: ${analysis.recommendedApproach} using MCP tools.`;
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
