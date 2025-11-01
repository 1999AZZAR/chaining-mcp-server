/**
 * Prompt Manager for Chaining MCP Server
 *
 * Provides prebuilt prompts and resource sets to help models effectively use
 * the available toolsets for development, debugging, analysis, and common workflows.
 */

export interface PrebuiltPrompt {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
  expectedTools?: string[];
  complexity: 'low' | 'medium' | 'high';
  useCase: string;
}

export interface ResourceSet {
  id: string;
  name: string;
  description: string;
  category: string;
  resources: {
    type: 'prompt' | 'workflow' | 'template' | 'example';
    name: string;
    content: string;
    description: string;
  }[];
  tags: string[];
  complexity: 'low' | 'medium' | 'high';
}

export class PromptManager {
  private prompts: Map<string, PrebuiltPrompt> = new Map();
  private resourceSets: Map<string, ResourceSet> = new Map();

  constructor() {
    this.initializePrompts();
    this.initializeResourceSets();
  }

  /**
   * Initialize predefined prompts for common use cases
   */
  private initializePrompts(): void {
    const prompts: PrebuiltPrompt[] = [
      // Development Prompts
      {
        id: 'analyze-project-structure',
        name: 'Analyze Project Structure',
        description: 'Comprehensive analysis of project structure and dependencies',
        category: 'development',
        tags: ['analysis', 'structure', 'dependencies', 'overview'],
        complexity: 'medium',
        useCase: 'Understanding project architecture and organization',
        prompt: `Analyze this project's structure and provide insights about:

1. **Architecture Overview**: What type of project is this? What framework/pattern is used?
2. **Directory Structure**: Key directories and their purposes
3. **Dependencies**: Main dependencies and their roles
4. **Entry Points**: How does the application start?
5. **Configuration**: Important configuration files and settings

Use the available filesystem tools to explore the codebase systematically. Start with the root directory, then examine key configuration files (package.json, tsconfig.json, etc.), and finally look at main source directories.`,
        expectedTools: ['list_dir', 'read_file', 'grep']
      },

      {
        id: 'debug-error-tracing',
        name: 'Debug Error Tracing',
        description: 'Systematic approach to tracing and debugging errors',
        category: 'debugging',
        tags: ['debugging', 'errors', 'tracing', 'logs'],
        complexity: 'high',
        useCase: 'Finding and fixing bugs in the codebase',
        prompt: `Debug this error systematically:

1. **Error Analysis**: Parse the error message, stack trace, and context
2. **Code Location**: Find the exact file and line where the error occurs
3. **Root Cause**: Identify what caused the error (null reference, type mismatch, etc.)
4. **Dependencies**: Check related code that might be contributing
5. **Solution**: Propose and implement a fix

Steps to follow:
- Search for error-related keywords in the codebase
- Examine the specific file and function where error occurs
- Check imports and dependencies
- Look for similar patterns in working code
- Test the fix thoroughly`,
        expectedTools: ['grep', 'read_file', 'search_replace', 'run_terminal_cmd']
      },

      {
        id: 'performance-optimization',
        name: 'Performance Optimization',
        description: 'Identify and fix performance bottlenecks',
        category: 'optimization',
        tags: ['performance', 'optimization', 'bottlenecks', 'profiling'],
        complexity: 'high',
        useCase: 'Improving application performance and efficiency',
        prompt: `Optimize performance by:

1. **Performance Analysis**: Identify slow operations and bottlenecks
2. **Memory Usage**: Check for memory leaks and inefficient allocations
3. **Database Queries**: Optimize database operations if applicable
4. **Caching**: Implement appropriate caching strategies
5. **Code Efficiency**: Refactor inefficient algorithms and data structures

Analysis approach:
- Run performance profiling tools
- Identify the slowest functions/methods
- Check for N+1 queries or inefficient loops
- Look for memory-intensive operations
- Implement caching where beneficial
- Test performance improvements`,
        expectedTools: ['run_terminal_cmd', 'grep', 'read_file', 'search_replace']
      },

      // Workflow Prompts
      {
        id: 'feature-implementation',
        name: 'Feature Implementation',
        description: 'Complete workflow for implementing new features',
        category: 'development',
        tags: ['feature', 'implementation', 'workflow', 'planning'],
        complexity: 'high',
        useCase: 'Adding new functionality to the codebase',
        prompt: `Implement a new feature following this structured approach:

1. **Requirements Analysis**: Understand the feature requirements and constraints
2. **Design Planning**: Plan the implementation approach and architecture
3. **Code Implementation**: Write clean, testable code
4. **Integration**: Integrate with existing codebase
5. **Testing**: Write and run comprehensive tests
6. **Documentation**: Update documentation and comments

Implementation steps:
- Analyze existing similar features for patterns
- Plan the code structure and interfaces
- Implement incrementally with frequent testing
- Ensure proper error handling and edge cases
- Follow existing code conventions and patterns
- Write unit tests and integration tests`,
        expectedTools: ['read_file', 'grep', 'search_replace', 'run_terminal_cmd', 'todo_write']
      },

      {
        id: 'code-refactoring',
        name: 'Code Refactoring',
        description: 'Refactor code for better maintainability and performance',
        category: 'maintenance',
        tags: ['refactoring', 'maintainability', 'clean-code', 'improvement'],
        complexity: 'medium',
        useCase: 'Improving code quality and maintainability',
        prompt: `Refactor code following best practices:

1. **Code Analysis**: Identify code smells and improvement opportunities
2. **Refactoring Strategy**: Plan safe refactoring steps
3. **Incremental Changes**: Make small, testable changes
4. **Testing**: Ensure functionality remains intact
5. **Documentation**: Update comments and documentation

Refactoring focus areas:
- Extract methods/functions for complex logic
- Remove code duplication
- Improve variable and function names
- Add proper error handling
- Simplify conditional logic
- Improve code organization and structure`,
        expectedTools: ['read_file', 'grep', 'search_replace', 'run_terminal_cmd']
      },

      // Analysis Prompts
      {
        id: 'security-audit',
        name: 'Security Audit',
        description: 'Comprehensive security analysis of the codebase',
        category: 'security',
        tags: ['security', 'audit', 'vulnerabilities', 'review'],
        complexity: 'high',
        useCase: 'Identifying and fixing security vulnerabilities',
        prompt: `Perform a comprehensive security audit:

1. **Input Validation**: Check for proper input sanitization and validation
2. **Authentication & Authorization**: Review access controls and permissions
3. **Data Protection**: Ensure sensitive data is properly handled
4. **Dependencies**: Check for vulnerable third-party packages
5. **Configuration**: Review security-related configurations
6. **Common Vulnerabilities**: Look for SQL injection, XSS, CSRF, etc.

Audit checklist:
- Scan for hardcoded secrets and credentials
- Check input validation on all user inputs
- Review database queries for injection vulnerabilities
- Examine authentication and session management
- Check file upload and download security
- Review error messages for information disclosure
- Update vulnerable dependencies`,
        expectedTools: ['grep', 'read_file', 'run_terminal_cmd']
      },

      {
        id: 'dependency-analysis',
        name: 'Dependency Analysis',
        description: 'Analyze project dependencies and their impact',
        category: 'analysis',
        tags: ['dependencies', 'analysis', 'packages', 'maintenance'],
        complexity: 'medium',
        useCase: 'Understanding and managing project dependencies',
        prompt: `Analyze project dependencies comprehensively:

1. **Dependency Inventory**: List all dependencies and their versions
2. **Usage Analysis**: Determine which dependencies are actually used
3. **Security Check**: Identify vulnerable or outdated packages
4. **License Compliance**: Check license compatibility
5. **Optimization**: Identify unused or redundant dependencies

Analysis steps:
- Parse package.json and lock files
- Search codebase for import/require statements
- Check for security vulnerabilities (npm audit, Snyk, etc.)
- Review dependency licenses
- Identify opportunities for consolidation
- Update outdated packages safely`,
        expectedTools: ['read_file', 'grep', 'run_terminal_cmd']
      },

      // Tool-Specific Prompts
      {
        id: 'tool-chaining-basics',
        name: 'Tool Chaining Basics',
        description: 'Learn how to effectively chain multiple tools together',
        category: 'tool-usage',
        tags: ['tool-chaining', 'workflow', 'efficiency', 'basics'],
        complexity: 'low',
        useCase: 'Understanding how to combine tools effectively',
        prompt: `Master tool chaining basics:

1. **Tool Discovery**: Learn what tools are available
2. **Workflow Planning**: Plan multi-step operations
3. **Sequential Execution**: Execute tools in the right order
4. **Result Processing**: Use output from one tool as input for another
5. **Error Handling**: Handle failures and edge cases

Basic chaining patterns:
- File operations: read → modify → write
- Search operations: grep → analyze → modify
- Build operations: lint → test → build
- Deployment: build → test → deploy

Remember: Always check tool capabilities and requirements before chaining.`,
        expectedTools: ['list_mcp_servers', 'analyze_tools', 'generate_route_suggestions']
      },

      {
        id: 'memory-knowledge-management',
        name: 'Memory & Knowledge Management',
        description: 'Use the knowledge graph for persistent learning and context',
        category: 'knowledge',
        tags: ['memory', 'knowledge-graph', 'learning', 'context'],
        complexity: 'medium',
        useCase: 'Building and maintaining project knowledge over time',
        prompt: `Leverage the knowledge graph for persistent memory:

1. **Entity Creation**: Create entities for important concepts, people, and resources
2. **Relationship Mapping**: Define relationships between entities
3. **Observation Recording**: Add observations and learnings over time
4. **Knowledge Retrieval**: Search and retrieve relevant information
5. **Context Preservation**: Maintain context across sessions

Best practices:
- Create entities for projects, components, and key concepts
- Use consistent naming conventions
- Add detailed observations with timestamps
- Create meaningful relationships (depends_on, related_to, etc.)
- Regularly review and update knowledge

This enables the system to learn and provide better assistance over time.`,
        expectedTools: ['create_entities', 'create_relations', 'add_observations', 'search_nodes', 'read_graph']
      },

      {
        id: 'sequential-thinking-workflows',
        name: 'Sequential Thinking Workflows',
        description: 'Use sequential thinking for complex problem-solving',
        category: 'thinking',
        tags: ['sequential-thinking', 'problem-solving', 'analysis', 'planning'],
        complexity: 'high',
        useCase: 'Breaking down complex problems into manageable steps',
        prompt: `Apply sequential thinking to complex problems:

1. **Problem Decomposition**: Break complex problems into smaller, manageable parts
2. **Step-by-Step Analysis**: Think through each aspect systematically
3. **Hypothesis Testing**: Form and test hypotheses about solutions
4. **Course Correction**: Adjust approach based on new information
5. **Solution Synthesis**: Combine insights into comprehensive solutions

Sequential thinking workflow:
- Start with problem understanding and context gathering
- Break down into sub-problems and dependencies
- Analyze each component with available tools
- Synthesize findings and form conclusions
- Iterate and refine based on results

Use this approach for complex debugging, architecture decisions, and multi-step implementations.`,
        expectedTools: ['sequentialthinking', 'analyze_with_sequential_thinking']
      }
    ];

    prompts.forEach(prompt => this.prompts.set(prompt.id, prompt));
  }

  /**
   * Initialize predefined resource sets
   */
  private initializeResourceSets(): void {
    const resourceSets: ResourceSet[] = [
      {
        id: 'development-starter-kit',
        name: 'Development Starter Kit',
        description: 'Essential resources for getting started with development tasks',
        category: 'development',
        complexity: 'low',
        tags: ['starter', 'development', 'basics', 'workflow'],
        resources: [
          {
            type: 'prompt',
            name: 'Project Analysis Template',
            description: 'Template for analyzing new projects',
            content: 'Use the analyze-project-structure prompt to understand the codebase before making changes.'
          },
          {
            type: 'workflow',
            name: 'Code Review Checklist',
            description: 'Essential checks for code reviews',
            content: `- [ ] Code follows project conventions\n- [ ] Proper error handling\n- [ ] Unit tests added/updated\n- [ ] Documentation updated\n- [ ] No security vulnerabilities introduced`
          },
          {
            type: 'template',
            name: 'Feature Implementation Plan',
            description: 'Template for planning feature implementations',
            content: `## Feature Implementation Plan

**Feature:** [Feature Name]
**Priority:** [High/Medium/Low]
**Estimated Effort:** [Time estimate]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Implementation Steps
1. [ ] Step 1
2. [ ] Step 2

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

### Dependencies
- [ ] Dependency 1
- [ ] Dependency 2`
          },
          {
            type: 'example',
            name: 'Basic Tool Chaining',
            description: 'Simple example of chaining filesystem tools',
            content: `Example: Read a config file, modify it, and save it back

1. Use read_file to read the configuration
2. Use search_replace to modify specific values
3. Use run_terminal_cmd to validate the changes`
          }
        ]
      },

      {
        id: 'debugging-toolbox',
        name: 'Debugging Toolbox',
        description: 'Comprehensive debugging resources and techniques',
        category: 'debugging',
        complexity: 'medium',
        tags: ['debugging', 'troubleshooting', 'errors', 'logs'],
        resources: [
          {
            type: 'prompt',
            name: 'Error Investigation Framework',
            description: 'Structured approach to error investigation',
            content: 'Use the debug-error-tracing prompt for systematic error analysis.'
          },
          {
            type: 'workflow',
            name: 'Debugging Workflow',
            description: 'Step-by-step debugging process',
            content: `1. **Reproduce** the error consistently
2. **Isolate** the problem area
3. **Analyze** the error details and stack trace
4. **Hypothesize** potential causes
5. **Test** each hypothesis systematically
6. **Fix** the root cause
7. **Verify** the fix works and doesn't break other functionality`
          },
          {
            type: 'template',
            name: 'Bug Report Template',
            description: 'Standard template for reporting bugs',
            content: `## Bug Report

**Title:** [Clear, descriptive title]

**Description:**
[What happened and what was expected]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should have happened]

**Actual Behavior:**
[What actually happened]

**Environment:**
- OS: [OS version]
- Browser/Node: [Version]
- Other relevant info

**Additional Context:**
[Screenshots, logs, etc.]`
          },
          {
            type: 'example',
            name: 'Log Analysis Pattern',
            description: 'How to effectively analyze application logs',
            content: `Log analysis techniques:

1. **Filter by level**: Focus on ERROR and WARN first
2. **Search for patterns**: Look for recurring error messages
3. **Correlate events**: Find related log entries
4. **Check timestamps**: Understand the sequence of events
5. **Use grep**: Search for specific error codes or messages`
          }
        ]
      },

      {
        id: 'performance-optimization-kit',
        name: 'Performance Optimization Kit',
        description: 'Tools and techniques for performance analysis and optimization',
        category: 'optimization',
        complexity: 'high',
        tags: ['performance', 'optimization', 'profiling', 'efficiency'],
        resources: [
          {
            type: 'prompt',
            name: 'Performance Analysis Guide',
            description: 'Comprehensive performance analysis approach',
            content: 'Use the performance-optimization prompt for systematic performance improvements.'
          },
          {
            type: 'workflow',
            name: 'Performance Investigation Process',
            description: 'Structured approach to performance issues',
            content: `1. **Identify** performance bottlenecks
2. **Measure** current performance metrics
3. **Profile** application execution
4. **Analyze** profiling results
5. **Optimize** identified bottlenecks
6. **Test** performance improvements
7. **Monitor** for regressions`
          },
          {
            type: 'template',
            name: 'Performance Report',
            description: 'Template for performance analysis reports',
            content: `## Performance Analysis Report

**Date:** [Date]
**Application:** [Application name]
**Test Environment:** [Environment details]

### Current Performance Metrics
- **Response Time:** [Average/Median/P95]
- **Throughput:** [Requests per second]
- **Memory Usage:** [Peak/Average]
- **CPU Usage:** [Average/Peak]

### Identified Bottlenecks
1. **[Bottleneck 1]**: [Description and impact]
2. **[Bottleneck 2]**: [Description and impact]

### Optimization Recommendations
1. **[Recommendation 1]**: [Expected impact]
2. **[Recommendation 2]**: [Expected impact]

### Implementation Plan
[Step-by-step plan for implementing optimizations]`
          },
          {
            type: 'example',
            name: 'Memory Leak Detection',
            description: 'How to identify and fix memory leaks',
            content: `Memory leak detection process:

1. **Monitor memory usage** over time
2. **Take heap snapshots** at different intervals
3. **Compare snapshots** to identify growing objects
4. **Analyze reference chains** to find what's holding references
5. **Fix root causes** (closures, event listeners, caches)
6. **Verify fixes** with memory monitoring`
          }
        ]
      },

      {
        id: 'tool-chaining-mastery',
        name: 'Tool Chaining Mastery',
        description: 'Advanced techniques for effective tool chaining',
        category: 'tool-usage',
        complexity: 'high',
        tags: ['tool-chaining', 'advanced', 'workflow', 'efficiency'],
        resources: [
          {
            type: 'prompt',
            name: 'Advanced Tool Chaining',
            description: 'Master advanced tool chaining techniques',
            content: 'Use the tool-chaining-basics prompt as foundation, then explore complex chaining patterns.'
          },
          {
            type: 'workflow',
            name: 'Complex Workflow Orchestration',
            description: 'How to orchestrate complex multi-tool workflows',
            content: `Advanced tool chaining patterns:

1. **Parallel Execution**: Run independent tools simultaneously
2. **Conditional Branching**: Execute different tools based on results
3. **Data Transformation**: Transform output from one tool for another
4. **Error Recovery**: Handle failures and retry with alternative approaches
5. **State Management**: Maintain state across tool executions

Best practices:
- Plan workflows before execution
- Handle errors gracefully
- Validate inputs and outputs
- Document complex chains for reuse`
          },
          {
            type: 'template',
            name: 'Tool Chain Template',
            description: 'Template for designing tool chains',
            content: `## Tool Chain: [Chain Name]

**Purpose:** [What this chain accomplishes]

**Input:** [Required inputs]
**Output:** [Expected outputs]

### Chain Steps
1. **Tool 1**: [Tool name]
   - Input: [What it receives]
   - Processing: [What it does]
   - Output: [What it produces]

2. **Tool 2**: [Tool name]
   - Input: [From Tool 1 output]
   - Processing: [Transformations needed]
   - Output: [Final result]

### Error Handling
- [How to handle failures at each step]
- [Alternative paths if primary tools fail]

### Validation
- [How to validate each step's output]
- [Success criteria for the entire chain]`
          },
          {
            type: 'example',
            name: 'Code Generation Chain',
            description: 'Chain for generating, testing, and deploying code',
            content: `Code generation workflow:

1. **analyze_tools** - Discover available development tools
2. **read_file** - Read existing code patterns
3. **search_replace** - Generate new code following patterns
4. **run_terminal_cmd** - Run linter and tests
5. **run_terminal_cmd** - Build and deploy if tests pass

This chain ensures generated code follows project conventions and passes quality checks.`
          }
        ]
      },

      {
        id: 'knowledge-management-suite',
        name: 'Knowledge Management Suite',
        description: 'Tools for building and maintaining project knowledge',
        category: 'knowledge',
        complexity: 'medium',
        tags: ['knowledge', 'memory', 'learning', 'documentation'],
        resources: [
          {
            type: 'prompt',
            name: 'Knowledge Building Strategy',
            description: 'How to systematically build project knowledge',
            content: 'Use the memory-knowledge-management prompt to establish comprehensive project knowledge.'
          },
          {
            type: 'workflow',
            name: 'Knowledge Capture Process',
            description: 'Process for capturing and organizing knowledge',
            content: `Knowledge management workflow:

1. **Identify** valuable information and patterns
2. **Create** entities for key concepts and components
3. **Record** observations and learnings
4. **Establish** relationships between entities
5. **Search** and retrieve knowledge when needed
6. **Update** knowledge as project evolves

Regular maintenance:
- Review entities monthly
- Update outdated information
- Add new learnings and patterns
- Clean up irrelevant knowledge`
          },
          {
            type: 'template',
            name: 'Entity Documentation',
            description: 'Template for documenting knowledge entities',
            content: `## Entity: [Entity Name]

**Type:** [Entity Type]
**Created:** [Date]
**Last Updated:** [Date]

### Description
[Detailed description of what this entity represents]

### Key Observations
- [Important observation 1]
- [Important observation 2]
- [Important observation 3]

### Relationships
- **[Relation Type]** [Related Entity 1]: [Description]
- **[Relation Type]** [Related Entity 2]: [Description]

### Usage Context
[When and how this entity is typically used]

### Related Files/Resources
- [File/Resource 1]: [Description]
- [File/Resource 2]: [Description]`
          },
          {
            type: 'example',
            name: 'Project Learning Pattern',
            description: 'How the system learns from project interactions',
            content: `Knowledge accumulation patterns:

1. **Code Patterns**: Learn common code structures and conventions
2. **Error Patterns**: Track recurring issues and their solutions
3. **Decision Patterns**: Record architectural and design decisions
4. **Performance Patterns**: Note optimization techniques that work
5. **Integration Patterns**: Learn how components interact

This accumulated knowledge enables:
- Better code generation
- Proactive error prevention
- Faster problem resolution
- Consistent decision making`
          }
        ]
      }
    ];

    resourceSets.forEach(set => this.resourceSets.set(set.id, set));
  }

  /**
   * Get all available prompts
   */
  getAllPrompts(): PrebuiltPrompt[] {
    return Array.from(this.prompts.values());
  }

  /**
   * Get prompts by category
   */
  getPromptsByCategory(category: string): PrebuiltPrompt[] {
    return this.getAllPrompts().filter(prompt => prompt.category === category);
  }

  /**
   * Get prompts by tags
   */
  getPromptsByTags(tags: string[]): PrebuiltPrompt[] {
    return this.getAllPrompts().filter(prompt =>
      tags.some(tag => prompt.tags.includes(tag))
    );
  }

  /**
   * Get a specific prompt by ID
   */
  getPrompt(id: string): PrebuiltPrompt | undefined {
    return this.prompts.get(id);
  }

  /**
   * Search prompts by query
   */
  searchPrompts(query: string): PrebuiltPrompt[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPrompts().filter(prompt =>
      prompt.name.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.category.toLowerCase().includes(lowerQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      prompt.useCase.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all resource sets
   */
  getAllResourceSets(): ResourceSet[] {
    return Array.from(this.resourceSets.values());
  }

  /**
   * Get resource sets by category
   */
  getResourceSetsByCategory(category: string): ResourceSet[] {
    return this.getAllResourceSets().filter(set => set.category === category);
  }

  /**
   * Get a specific resource set by ID
   */
  getResourceSet(id: string): ResourceSet | undefined {
    return this.resourceSets.get(id);
  }

  /**
   * Search resource sets by query
   */
  searchResourceSets(query: string): ResourceSet[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllResourceSets().filter(set =>
      set.name.toLowerCase().includes(lowerQuery) ||
      set.description.toLowerCase().includes(lowerQuery) ||
      set.category.toLowerCase().includes(lowerQuery) ||
      set.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get prompts suitable for a specific complexity level
   */
  getPromptsByComplexity(complexity: 'low' | 'medium' | 'high'): PrebuiltPrompt[] {
    return this.getAllPrompts().filter(prompt => prompt.complexity === complexity);
  }

  /**
   * Get resource sets suitable for a specific complexity level
   */
  getResourceSetsByComplexity(complexity: 'low' | 'medium' | 'high'): ResourceSet[] {
    return this.getAllResourceSets().filter(set => set.complexity === complexity);
  }

  /**
   * Get recommended prompts for beginners
   */
  getBeginnerPrompts(): PrebuiltPrompt[] {
    return this.getPromptsByComplexity('low');
  }

  /**
   * Get recommended prompts for experts
   */
  getExpertPrompts(): PrebuiltPrompt[] {
    return this.getPromptsByComplexity('high');
  }

  /**
   * Get a comprehensive overview of available resources
   */
  getResourceOverview(): {
    totalPrompts: number;
    totalResourceSets: number;
    categories: {
      prompts: Record<string, number>;
      resourceSets: Record<string, number>;
    };
    complexity: {
      prompts: Record<string, number>;
      resourceSets: Record<string, number>;
    };
  } {
    const prompts = this.getAllPrompts();
    const resourceSets = this.getAllResourceSets();

    const promptCategories = prompts.reduce((acc, prompt) => {
      acc[prompt.category] = (acc[prompt.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resourceSetCategories = resourceSets.reduce((acc, set) => {
      acc[set.category] = (acc[set.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const promptComplexity = prompts.reduce((acc, prompt) => {
      acc[prompt.complexity] = (acc[prompt.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resourceSetComplexity = resourceSets.reduce((acc, set) => {
      acc[set.complexity] = (acc[set.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPrompts: prompts.length,
      totalResourceSets: resourceSets.length,
      categories: {
        prompts: promptCategories,
        resourceSets: resourceSetCategories,
      },
      complexity: {
        prompts: promptComplexity,
        resourceSets: resourceSetComplexity,
      },
    };
  }
}
