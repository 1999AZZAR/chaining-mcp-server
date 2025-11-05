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
      },

      // MCP Ecosystem and Chaining Prompts
      {
        id: 'mcp-ecosystem-exploration',
        name: 'MCP Ecosystem Exploration',
        description: 'Discover and analyze the complete MCP server ecosystem available to you',
        category: 'mcp-ecosystem',
        tags: ['discovery', 'analysis', 'ecosystem', 'servers', 'capabilities'],
        complexity: 'medium',
        useCase: 'Understanding what MCP servers and tools are available for complex workflows',
        prompt: `Explore the MCP ecosystem to understand available capabilities:

1. **Server Discovery**: Identify all available MCP servers in your environment
2. **Capability Mapping**: Analyze what tools each server provides
3. **Integration Opportunities**: Find servers that can work together
4. **Workflow Planning**: Design multi-server workflows for complex tasks
5. **Resource Assessment**: Evaluate which servers to use for specific scenarios

Start by listing all MCP servers, then analyze their tools to understand the ecosystem's capabilities.`,
        expectedTools: ['list_mcp_servers', 'analyze_tools', 'generate_route_suggestions']
      },

      {
        id: 'cross-server-data-flow',
        name: 'Cross-Server Data Flow Design',
        description: 'Design data flows and orchestrations across multiple MCP servers',
        category: 'orchestration',
        tags: ['data-flow', 'orchestration', 'multi-server', 'integration', 'pipelines'],
        complexity: 'high',
        useCase: 'Creating complex workflows that span multiple MCP servers',
        prompt: `Design a cross-server data flow orchestration:

1. **Requirements Analysis**: Understand the data transformation needs
2. **Server Capability Matching**: Find servers with complementary capabilities
3. **Data Flow Mapping**: Design the sequence of operations across servers
4. **Error Handling**: Plan for failures in multi-server operations
5. **Optimization**: Ensure efficient data transfer between servers

Identify servers that can work together, design the data flow, and implement the orchestration.`,
        expectedTools: ['analyze_tools', 'generate_route_suggestions', 'get_tool_chain_analysis']
      },

      {
        id: 'awesome-copilot-integration-workflow',
        name: 'Awesome Copilot Integration Workflow',
        description: 'Leverage awesome-copilot resources for enhanced development workflows',
        category: 'integration',
        tags: ['awesome-copilot', 'integration', 'development', 'resources', 'guidance'],
        complexity: 'medium',
        useCase: 'Using curated development resources to enhance coding and development tasks',
        prompt: `Integrate awesome-copilot resources into your development workflow:

1. **Resource Discovery**: Explore available collections and instructions
2. **Relevance Assessment**: Find resources relevant to your current task
3. **Integration Planning**: Design how to incorporate these resources
4. **Workflow Enhancement**: Apply the guidance to improve your process
5. **Knowledge Transfer**: Learn from the curated development wisdom

Browse collections, search for relevant instructions, and apply them to enhance your development process.`,
        expectedTools: ['awesome_copilot_list_collections', 'awesome_copilot_search_collections', 'awesome_copilot_get_collection', 'awesome_copilot_search_instructions']
      },

      {
        id: 'time-sensitive-task-orchestration',
        name: 'Time-Sensitive Task Orchestration',
        description: 'Orchestrate tasks with time constraints and scheduling requirements',
        category: 'orchestration',
        tags: ['time-management', 'scheduling', 'deadlines', 'orchestration', 'planning'],
        complexity: 'high',
        useCase: 'Managing complex workflows with time constraints and dependencies',
        prompt: `Orchestrate time-sensitive tasks with precision:

1. **Time Analysis**: Understand timezone requirements and deadlines
2. **Task Sequencing**: Order operations based on time constraints
3. **Dependency Management**: Handle time-dependent task relationships
4. **Scheduling Optimization**: Optimize execution timing across timezones
5. **Progress Monitoring**: Track time-sensitive progress and adjustments

Convert between timezones, plan task sequences, and execute with time awareness.`,
        expectedTools: ['get_current_time', 'convert_time', 'sequentialthinking', 'generate_route_suggestions']
      },

      {
        id: 'multi-server-debugging-orchestration',
        name: 'Multi-Server Debugging Orchestration',
        description: 'Debug issues that span multiple MCP servers and systems',
        category: 'debugging',
        tags: ['debugging', 'multi-server', 'orchestration', 'tracing', 'cross-system'],
        complexity: 'high',
        useCase: 'Debugging complex issues that involve multiple MCP servers',
        prompt: `Orchestrate debugging across multiple MCP servers:

1. **Issue Scope Analysis**: Determine which servers are involved
2. **Server State Inspection**: Check the state of relevant servers
3. **Cross-Server Tracing**: Trace data flow and state changes across servers
4. **Root Cause Isolation**: Identify which server/component is causing the issue
5. **Coordinated Resolution**: Implement fixes that may span multiple servers

Systematically debug issues that involve multiple MCP servers working together.`,
        expectedTools: ['list_mcp_servers', 'analyze_tools', 'sequentialthinking', 'awesome_copilot_search_instructions']
      },

      {
        id: 'intelligent-route-optimization',
        name: 'Intelligent Route Optimization',
        description: 'Optimize execution routes for complex multi-step tasks',
        category: 'optimization',
        tags: ['optimization', 'routing', 'efficiency', 'planning', 'execution'],
        complexity: 'high',
        useCase: 'Finding the most efficient way to execute complex tasks across available tools',
        prompt: `Optimize routes for complex task execution:

1. **Task Decomposition**: Break down complex tasks into manageable steps
2. **Capability Analysis**: Understand what tools can perform each step
3. **Route Generation**: Generate multiple possible execution paths
4. **Efficiency Analysis**: Compare routes for performance and reliability
5. **Optimal Selection**: Choose the best route and execute it

Analyze available tools, generate route suggestions, and optimize for your specific task requirements.`,
        expectedTools: ['analyze_tools', 'generate_route_suggestions', 'get_tool_chain_analysis', 'sequentialthinking']
      },

      {
        id: 'server-capability-mapping',
        name: 'Server Capability Mapping',
        description: 'Create comprehensive maps of MCP server capabilities and relationships',
        category: 'analysis',
        tags: ['mapping', 'capabilities', 'analysis', 'relationships', 'planning'],
        complexity: 'medium',
        useCase: 'Understanding and planning with the full MCP server ecosystem',
        prompt: `Map MCP server capabilities comprehensively:

1. **Server Inventory**: Catalog all available MCP servers
2. **Tool Analysis**: Deep dive into each server's tool capabilities
3. **Relationship Mapping**: Identify how servers can complement each other
4. **Use Case Planning**: Design workflows leveraging multiple servers
5. **Capability Gaps**: Identify areas where additional servers would be beneficial

Create a complete understanding of your MCP ecosystem for better planning and execution.`,
        expectedTools: ['list_mcp_servers', 'analyze_tools', 'generate_route_suggestions', 'get_tool_chain_analysis']
      },

      {
        id: 'dynamic-workflow-adaptation',
        name: 'Dynamic Workflow Adaptation',
        description: 'Adapt workflows dynamically based on runtime conditions and server availability',
        category: 'orchestration',
        tags: ['dynamic', 'adaptation', 'workflows', 'flexibility', 'runtime'],
        complexity: 'high',
        useCase: 'Creating flexible workflows that adapt to changing conditions',
        prompt: `Design workflows that adapt to runtime conditions:

1. **Condition Analysis**: Identify factors that might change during execution
2. **Contingency Planning**: Design alternative paths for different scenarios
3. **Dynamic Routing**: Implement logic to choose paths based on current state
4. **Server Availability**: Handle cases where servers become unavailable
5. **Adaptive Execution**: Execute workflows that can pivot based on results

Create robust workflows that can adapt to changing MCP server conditions and requirements.`,
        expectedTools: ['list_mcp_servers', 'analyze_tools', 'generate_route_suggestions', 'sequentialthinking']
      },

      {
        id: 'knowledge-graph-enhanced-chaining',
        name: 'Knowledge Graph Enhanced Chaining',
        description: 'Leverage knowledge graphs for intelligent tool chaining decisions',
        category: 'integration',
        tags: ['knowledge-graph', 'intelligence', 'chaining', 'context', 'relationships'],
        complexity: 'high',
        useCase: 'Using structured knowledge to make better tool chaining decisions',
        prompt: `Enhance tool chaining with knowledge graph insights:

1. **Context Understanding**: Use knowledge graphs to understand task context
2. **Relationship Analysis**: Identify related entities and their connections
3. **Intelligent Routing**: Make chaining decisions based on knowledge relationships
4. **Context Preservation**: Maintain context across chained operations
5. **Learning Integration**: Incorporate past experiences into routing decisions

Combine knowledge management with tool chaining for more intelligent execution.`,
        expectedTools: ['get_tool_chain_analysis', 'generate_route_suggestions', 'sequentialthinking']
      },

      {
        id: 'collaborative-development-orchestration',
        name: 'Collaborative Development Orchestration',
        description: 'Orchestrate development tasks across team members and MCP servers',
        category: 'collaboration',
        tags: ['collaboration', 'team', 'orchestration', 'development', 'coordination'],
        complexity: 'high',
        useCase: 'Coordinating complex development tasks across team members and tools',
        prompt: `Orchestrate collaborative development workflows:

1. **Task Decomposition**: Break down complex features into manageable tasks
2. **Team Capability Mapping**: Understand team members' strengths and availability
3. **Tool Assignment**: Assign appropriate MCP servers/tools to each task
4. **Progress Coordination**: Track and coordinate progress across tasks
5. **Integration Planning**: Plan how individual contributions integrate together

Coordinate complex development efforts using multiple MCP servers and team capabilities.`,
        expectedTools: ['generate_route_suggestions', 'analyze_tools', 'sequentialthinking', 'get_tool_chain_analysis']
      },

      {
        id: 'automated-quality-assurance',
        name: 'Automated Quality Assurance Orchestration',
        description: 'Orchestrate comprehensive QA processes across multiple tools and servers',
        category: 'quality',
        tags: ['qa', 'testing', 'automation', 'quality', 'validation'],
        complexity: 'high',
        useCase: 'Running comprehensive quality assurance across multiple validation tools',
        prompt: `Orchestrate automated quality assurance processes:

1. **Test Planning**: Design comprehensive test suites across multiple dimensions
2. **Tool Coordination**: Coordinate multiple testing and validation tools
3. **Result Aggregation**: Collect and analyze results from multiple sources
4. **Issue Prioritization**: Identify and prioritize issues based on impact
5. **Remediation Planning**: Plan fixes and improvements based on findings

Execute comprehensive QA processes using multiple MCP servers and specialized tools.`,
        expectedTools: ['generate_route_suggestions', 'analyze_tools', 'sequentialthinking', 'awesome_copilot_search_instructions']
      },

      {
        id: 'intelligent-resource-discovery',
        name: 'Intelligent Resource Discovery',
        description: 'Discover and leverage resources across the MCP ecosystem intelligently',
        category: 'discovery',
        tags: ['discovery', 'resources', 'intelligence', 'exploration', 'learning'],
        complexity: 'medium',
        useCase: 'Finding and utilizing the best resources for specific development tasks',
        prompt: `Intelligently discover and leverage MCP ecosystem resources:

1. **Resource Inventory**: Catalog all available resources across servers
2. **Relevance Analysis**: Determine which resources are most relevant to your task
3. **Quality Assessment**: Evaluate resource quality and applicability
4. **Integration Planning**: Plan how to incorporate discovered resources
5. **Knowledge Synthesis**: Combine insights from multiple resource sources

Discover and utilize the full spectrum of resources available in your MCP ecosystem.`,
        expectedTools: ['list_mcp_servers', 'analyze_tools', 'awesome_copilot_list_collections', 'awesome_copilot_search_collections']
      },

      {
        id: 'predictive-workflow-optimization',
        name: 'Predictive Workflow Optimization',
        description: 'Optimize workflows based on predicted outcomes and historical patterns',
        category: 'optimization',
        tags: ['predictive', 'optimization', 'patterns', 'forecasting', 'efficiency'],
        complexity: 'high',
        useCase: 'Creating workflows that anticipate issues and optimize for success',
        prompt: `Implement predictive workflow optimization:

1. **Pattern Analysis**: Analyze historical execution patterns and outcomes
2. **Risk Prediction**: Identify potential failure points and bottlenecks
3. **Optimization Planning**: Design workflows that avoid predicted issues
4. **Contingency Integration**: Include fallback strategies for predicted problems
5. **Continuous Learning**: Update predictions based on new execution results

Create workflows that learn from past executions to optimize future performance.`,
        expectedTools: ['generate_route_suggestions', 'analyze_tools', 'sequentialthinking', 'get_tool_chain_analysis']
      },

      {
        id: 'enterprise-integration-orchestration',
        name: 'Enterprise Integration Orchestration',
        description: 'Orchestrate complex enterprise-level integrations across multiple systems',
        category: 'enterprise',
        tags: ['enterprise', 'integration', 'orchestration', 'systems', 'complexity'],
        complexity: 'high',
        useCase: 'Managing complex integrations across enterprise systems and MCP servers',
        prompt: `Orchestrate enterprise-level system integrations:

1. **System Analysis**: Understand all systems that need to be integrated
2. **Data Flow Design**: Design data flows between enterprise systems
3. **Integration Planning**: Plan integration points and transformation logic
4. **Error Handling**: Design robust error handling for enterprise environments
5. **Monitoring Setup**: Establish monitoring for integration health and performance

Manage complex enterprise integrations using coordinated MCP server capabilities.`,
        expectedTools: ['analyze_tools', 'generate_route_suggestions', 'sequentialthinking', 'get_tool_chain_analysis']
      },

      // Advanced Tool Chaining Prompts
      {
        id: 'comprehensive-project-assessment-chain',
        name: 'Comprehensive Project Assessment Chain',
        description: 'Execute complete project assessment using multiple analysis techniques',
        category: 'tool-chaining',
        tags: ['assessment', 'project', 'analysis', 'comprehensive', 'multi-tool'],
        complexity: 'high',
        useCase: 'Performing thorough project analysis using coordinated tool chains',
        prompt: `Execute a comprehensive project assessment using this tool chain:

**Chain Objective:** Provide complete project understanding through systematic analysis

**Required Tools:** list_dir, read_file, grep, run_terminal_cmd, analyze_tools

**Step-by-Step Execution:**

1. **Initial Structure Analysis**
   - Use list_dir to map project structure
   - Identify key directories and files
   - Note configuration files and entry points

2. **Configuration Deep Dive**
   - Read package.json/tsconfig.json for dependencies and scripts
   - Analyze build configurations and environment setups
   - Identify framework and tooling choices

3. **Code Pattern Analysis**
   - Use grep to find import patterns and dependencies
   - Analyze code organization and architecture
   - Identify main application flows

4. **Quality Assessment**
   - Check for linting and formatting issues
   - Analyze test coverage and structure
   - Identify potential security concerns

5. **Tool Ecosystem Evaluation**
   - Use analyze_tools to understand available capabilities
   - Identify integration opportunities
   - Plan optimization strategies

**Expected Outcomes:**
- Complete project structure map
- Dependency and configuration analysis
- Code quality assessment
- Integration recommendations
- Actionable improvement plan

**Success Metrics:**
- All major project components identified
- Clear understanding of architecture
- Identified strengths and improvement areas
- Actionable recommendations provided`,
        expectedTools: ['list_dir', 'read_file', 'grep', 'run_terminal_cmd', 'analyze_tools', 'todo_write']
      },

      {
        id: 'full-stack-feature-implementation-chain',
        name: 'Full-Stack Feature Implementation Chain',
        description: 'Complete feature implementation from design to deployment across the stack',
        category: 'tool-chaining',
        tags: ['implementation', 'full-stack', 'feature', 'deployment', 'end-to-end'],
        complexity: 'high',
        useCase: 'Implementing features across frontend, backend, and infrastructure',
        prompt: `Implement a full-stack feature using this comprehensive tool chain:

**Chain Objective:** Deliver production-ready features across the entire technology stack

**Required Tools:** read_file, grep, search_replace, run_terminal_cmd, todo_write

**Execution Phases:**

**Phase 1: Analysis & Planning**
1. Analyze existing code patterns and architecture
2. Identify integration points and dependencies
3. Plan feature implementation across all layers

**Phase 2: Backend Implementation**
1. Design and implement API endpoints
2. Add data models and database changes
3. Implement business logic and validation
4. Add comprehensive unit tests

**Phase 3: Frontend Implementation**
1. Create/update UI components
2. Implement state management
3. Add user interactions and validations
4. Ensure responsive design

**Phase 4: Integration & Testing**
1. Connect frontend to backend APIs
2. Implement end-to-end tests
3. Test cross-browser compatibility
4. Performance optimization

**Phase 5: Deployment & Monitoring**
1. Prepare deployment configurations
2. Set up monitoring and logging
3. Deploy to staging environment
4. Conduct final validation and deployment

**Quality Gates:**
- All tests passing (unit, integration, e2e)
- Code review completed
- Security review passed
- Performance benchmarks met
- Documentation updated

**Success Metrics:**
- Feature fully functional across all environments
- No production incidents post-deployment
- User acceptance criteria met
- Performance within acceptable limits`,
        expectedTools: ['read_file', 'grep', 'search_replace', 'run_terminal_cmd', 'todo_write', 'analyze_tools']
      },

      {
        id: 'production-debugging-orchestration',
        name: 'Production Debugging Orchestration',
        description: 'Systematic debugging of production issues using coordinated diagnostic tools',
        category: 'tool-chaining',
        tags: ['debugging', 'production', 'orchestration', 'diagnostics', 'incident-response'],
        complexity: 'high',
        useCase: 'Debugging complex production issues with minimal downtime',
        prompt: `Execute systematic production debugging using this orchestration chain:

**Chain Objective:** Resolve production issues quickly with minimal impact

**Required Tools:** grep, read_file, run_terminal_cmd, analyze_tools, sequentialthinking

**Emergency Response Protocol:**

**Step 1: Issue Triage & Assessment**
- Gather error logs and monitoring data
- Assess impact and urgency
- Notify stakeholders and prepare incident response

**Step 2: Diagnostic Data Collection**
- Collect application logs from affected systems
- Gather system metrics (CPU, memory, network)
- Review recent deployments and configuration changes
- Analyze error patterns and frequency

**Step 3: Root Cause Analysis**
- Reproduce issue in staging environment if possible
- Use sequential thinking to analyze error patterns
- Trace data flow through affected systems
- Identify potential causes (code, config, infrastructure)

**Step 4: Solution Development**
- Develop and test fix in isolated environment
- Prepare rollback plan and validation steps
- Coordinate with team for review and approval

**Step 5: Deployment & Validation**
- Deploy fix using blue-green or canary deployment
- Monitor system health and error rates
- Validate fix effectiveness and system stability
- Conduct post-mortem analysis

**Step 6: Prevention & Learning**
- Update monitoring and alerting rules
- Document incident and resolution
- Implement preventive measures
- Update runbooks and knowledge base

**Time-to-Resolution Targets:**
- Critical Issues: < 1 hour
- High Priority: < 4 hours
- Medium Priority: < 24 hours
- Low Priority: < 72 hours

**Communication Requirements:**
- Regular status updates to stakeholders
- Clear documentation of findings and actions
- Post-incident review and improvement recommendations`,
        expectedTools: ['grep', 'read_file', 'run_terminal_cmd', 'analyze_tools', 'sequentialthinking', 'todo_write']
      },

      {
        id: 'cross-server-data-pipeline-orchestration',
        name: 'Cross-Server Data Pipeline Orchestration',
        description: 'Build and manage data pipelines across multiple MCP servers',
        category: 'tool-chaining',
        tags: ['data-pipeline', 'orchestration', 'cross-server', 'etl', 'data-processing'],
        complexity: 'high',
        useCase: 'Creating automated data processing pipelines using multiple MCP servers',
        prompt: `Design and implement cross-server data pipeline orchestration:

**Chain Objective:** Create reliable data processing pipelines spanning multiple MCP servers

**Required Tools:** analyze_tools, generate_route_suggestions, workflow_orchestrator, get_tool_chain_analysis

**Pipeline Design Principles:**

**Step 1: Requirements Analysis**
- Define data sources and destinations
- Specify transformation requirements
- Identify performance and reliability needs
- Assess data volume and processing frequency

**Step 2: Server Capability Assessment**
- Analyze available MCP servers and their data tools
- Identify complementary capabilities
- Map data formats and protocols
- Evaluate server reliability and performance

**Step 3: Pipeline Architecture Design**
- Design data flow between servers
- Plan error handling and recovery
- Implement monitoring and alerting
- Define data validation and quality checks

**Step 4: Implementation & Testing**
- Build pipeline components incrementally
- Test each transformation step
- Validate data integrity throughout pipeline
- Performance testing under load

**Step 5: Deployment & Monitoring**
- Deploy pipeline to production environment
- Set up comprehensive monitoring
- Implement automated recovery procedures
- Establish performance baselines

**Step 6: Maintenance & Optimization**
- Monitor pipeline performance and reliability
- Optimize bottlenecks and resource usage
- Update pipeline for changing requirements
- Document and maintain runbooks

**Data Pipeline Best Practices:**
- Idempotent operations (safe to retry)
- Comprehensive error handling and logging
- Data validation at each step
- Graceful degradation on failures
- Automated testing and validation
- Clear monitoring and alerting

**Success Metrics:**
- Data processing accuracy > 99.9%
- Pipeline uptime > 99.5%
- Processing latency within SLAs
- Automated error recovery > 95% effective
- Clear monitoring and alerting coverage`,
        expectedTools: ['analyze_tools', 'generate_route_suggestions', 'workflow_orchestrator', 'get_tool_chain_analysis', 'sequentialthinking']
      },

      {
        id: 'ai-enhanced-development-workflow',
        name: 'AI-Enhanced Development Workflow',
        description: 'Leverage AI capabilities across development lifecycle using multiple MCP servers',
        category: 'tool-chaining',
        tags: ['ai-enhanced', 'development', 'workflow', 'automation', 'intelligence'],
        complexity: 'high',
        useCase: 'Using AI capabilities to enhance development productivity and quality',
        prompt: `Implement AI-enhanced development workflow using coordinated MCP servers:

**Chain Objective:** Maximize development productivity through intelligent tool orchestration

**Required Tools:** analyze_tools, generate_route_suggestions, awesome_copilot_search_instructions, brainstorming, sequentialthinking

**AI-Enhanced Development Phases:**

**Phase 1: Intelligent Planning**
1. Use brainstorming to explore solution approaches
2. Leverage awesome-copilot for best practice research
3. Apply sequential thinking for complex requirement analysis
4. Generate comprehensive implementation plans

**Phase 2: Smart Code Generation**
1. Analyze existing codebase patterns
2. Use awesome-copilot instructions for code generation
3. Apply intelligent routing for optimal tool selection
4. Generate context-aware code suggestions

**Phase 3: Automated Quality Assurance**
1. Implement comprehensive testing strategies
2. Use AI for test case generation and optimization
3. Automate code review and quality checks
4. Intelligent bug detection and fixing

**Phase 4: Continuous Learning & Improvement**
1. Capture development patterns and outcomes
2. Learn from successful implementations
3. Improve tool selection based on historical data
4. Evolve development processes through AI insights

**AI Integration Strategies:**
- **Context Awareness**: Understand project context and constraints
- **Pattern Recognition**: Learn from successful implementations
- **Intelligent Routing**: Select optimal tools for each task
- **Quality Enhancement**: Apply AI for code review and improvement
- **Knowledge Synthesis**: Combine insights from multiple sources

**Benefits Expected:**
- 40-60% reduction in development time
- Improved code quality and consistency
- Proactive issue identification
- Enhanced decision making
- Accelerated learning curve

**Implementation Guidelines:**
- Start with pilot projects to validate approach
- Establish clear success metrics and KPIs
- Provide training and documentation
- Monitor AI tool effectiveness and accuracy
- Continuously refine and improve the workflow`,
        expectedTools: ['analyze_tools', 'generate_route_suggestions', 'awesome_copilot_search_instructions', 'brainstorming', 'sequentialthinking', 'todo_write']
      },

      {
        id: 'enterprise-scale-architecture-orchestration',
        name: 'Enterprise-Scale Architecture Orchestration',
        description: 'Design and implement enterprise-scale systems using orchestrated MCP server capabilities',
        category: 'tool-chaining',
        tags: ['enterprise', 'architecture', 'orchestration', 'scalability', 'complex-systems'],
        complexity: 'high',
        useCase: 'Managing complex enterprise architecture using coordinated tool chains',
        prompt: `Orchestrate enterprise-scale architecture using comprehensive tool chains:

**Chain Objective:** Design and implement scalable enterprise systems with coordinated tools

**Required Tools:** analyze_tools, generate_route_suggestions, get_tool_chain_analysis, sequentialthinking, workflow_orchestrator

**Enterprise Architecture Framework:**

**Phase 1: Strategic Analysis**
1. Assess business requirements and constraints
2. Analyze existing system landscape
3. Identify architectural gaps and opportunities
4. Define architectural principles and standards

**Phase 2: System Design & Planning**
1. Design high-level system architecture
2. Define component interactions and interfaces
3. Plan scalability and performance requirements
4. Establish security and compliance frameworks

**Phase 3: Implementation Orchestration**
1. Break down architecture into implementable components
2. Coordinate development across multiple teams
3. Implement automated testing and validation
4. Establish continuous integration pipelines

**Phase 4: Deployment & Migration**
1. Plan deployment strategy and rollback procedures
2. Implement gradual migration approaches
3. Establish monitoring and observability
4. Validate system performance and reliability

**Phase 5: Operations & Evolution**
1. Implement operational procedures and runbooks
2. Establish performance monitoring and alerting
3. Plan for system evolution and scaling
4. Implement continuous improvement processes

**Enterprise Considerations:**
- **Scalability**: Design for growth and changing loads
- **Reliability**: Implement redundancy and fault tolerance
- **Security**: Comprehensive security across all layers
- **Compliance**: Meet regulatory and industry standards
- **Maintainability**: Design for long-term operational efficiency
- **Cost Optimization**: Balance performance with operational costs

**Success Metrics:**
- System availability > 99.9%
- Performance meets or exceeds SLAs
- Security compliance maintained
- Operational costs within budget
- Team productivity and satisfaction

**Governance & Control:**
- Architecture review boards and approval processes
- Standardized development and deployment processes
- Comprehensive documentation and knowledge management
- Regular architecture assessments and updates`,
        expectedTools: ['analyze_tools', 'generate_route_suggestions', 'get_tool_chain_analysis', 'sequentialthinking', 'workflow_orchestrator', 'todo_write']
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
      },

      // Advanced Tool Chaining Resource Sets
      {
        id: 'project-analysis-chain',
        name: 'Project Analysis Chain',
        description: 'Complete tool chain for comprehensive project analysis',
        category: 'tool-chaining',
        complexity: 'medium',
        tags: ['analysis', 'project', 'structure', 'dependencies', 'comprehensive'],
        resources: [
          {
            type: 'workflow',
            name: 'Project Analysis Chain',
            description: 'Step-by-step tool chain for analyzing new projects',
            content: `## Project Analysis Tool Chain

**Chain Purpose:** Perform comprehensive analysis of a new or unfamiliar project

**Execution Steps:**

1. **list_dir** (target: project root)
   - Purpose: Get high-level project structure
   - Expected Output: Directory listing with file types

2. **read_file** (target: package.json/tsconfig.json)
   - Purpose: Understand project configuration and dependencies
   - Expected Output: Project metadata and dependency information

3. **grep** (pattern: import|require|from, type: js|ts|jsx|tsx)
   - Purpose: Identify main entry points and module imports
   - Expected Output: Import statements showing code dependencies

4. **read_file** (target: main entry files)
   - Purpose: Understand application architecture
   - Expected Output: Core application structure and patterns

5. **analyze_tools** (category: filesystem)
   - Purpose: Discover additional analysis tools available
   - Expected Output: Tool capabilities for deeper analysis

6. **grep** (pattern: TODO|FIXME|BUG|HACK)
   - Purpose: Identify known issues and technical debt
   - Expected Output: Code quality indicators

**Success Criteria:**
- Clear understanding of project structure
- Identification of key components and dependencies
- Recognition of potential issues or areas needing attention`
          },
          {
            type: 'template',
            name: 'Project Analysis Report Template',
            description: 'Template for documenting project analysis results',
            content: `## Project Analysis Report

**Project:** [Project Name]
**Analysis Date:** [Date]
**Analyzer:** [Your Name/Role]

### Project Overview
- **Type:** [Web App, API, Library, etc.]
- **Language:** [Primary language(s)]
- **Framework:** [Framework(s) used]

### Directory Structure
\`\`\`
[Root directory structure]
\`\`\`

### Key Files Identified
- **Entry Point:** [Main application file]
- **Configuration:** [Config files found]
- **Build Scripts:** [Build/test/deployment scripts]

### Dependencies Analysis
- **Runtime Dependencies:** [Key packages and their purposes]
- **Development Dependencies:** [Build/test tools]
- **Potential Issues:** [Outdated packages, security concerns]

### Architecture Insights
- **Main Patterns:** [Architectural patterns observed]
- **Data Flow:** [How data moves through the application]
- **Integration Points:** [External services, APIs, databases]

### Code Quality Assessment
- **Strengths:** [Well-structured areas]
- **Areas for Improvement:** [Technical debt, code smells]
- **Known Issues:** [TODOs, FIXMEs, bugs identified]

### Recommendations
1. [Priority improvement areas]
2. [Suggested next steps]
3. [Risk mitigation strategies]

### Tool Chain Used
- [List of tools used in analysis]
- [Rationale for tool selection]
- [Effectiveness assessment]`
          },
          {
            type: 'example',
            name: 'React Project Analysis Chain',
            description: 'Specific chain for analyzing React applications',
            content: `React Project Analysis Chain:

1. **read_file** (package.json) - Check React version, scripts, dependencies
2. **list_dir** (src/) - Examine source structure
3. **grep** (pattern: import.*react, type: tsx|jsx) - Find React component imports
4. **read_file** (src/index.js|App.js) - Check main app structure
5. **grep** (pattern: useState|useEffect|useContext) - Identify hooks usage patterns
6. **list_dir** (src/components/) - Analyze component organization
7. **run_terminal_cmd** (npm run build) - Test build process
8. **run_terminal_cmd** (npm test) - Check test coverage

This chain provides complete React project understanding in 8 steps.`
          }
        ]
      },

      {
        id: 'code-implementation-chain',
        name: 'Code Implementation Chain',
        description: 'Tool chains for systematic code implementation and development',
        category: 'tool-chaining',
        complexity: 'high',
        tags: ['implementation', 'development', 'code-generation', 'testing', 'deployment'],
        resources: [
          {
            type: 'workflow',
            name: 'Feature Implementation Chain',
            description: 'Complete chain for implementing new features',
            content: `## Feature Implementation Tool Chain

**Chain Purpose:** Implement new features with quality assurance and testing

**Execution Steps:**

1. **read_file** (existing similar features)
   - Purpose: Understand current patterns and conventions
   - Expected Output: Code examples to follow

2. **grep** (pattern: interface|type|class, context: 2)
   - Purpose: Identify data structures and interfaces needed
   - Expected Output: Type definitions and contracts

3. **search_replace** (create new files/components)
   - Purpose: Implement the core functionality
   - Expected Output: New code following project conventions

4. **run_terminal_cmd** (lint/format check)
   - Purpose: Ensure code quality and style compliance
   - Expected Output: Clean, formatted code

5. **run_terminal_cmd** (unit tests)
   - Purpose: Validate functionality with automated tests
   - Expected Output: Passing test results

6. **run_terminal_cmd** (integration tests)
   - Purpose: Test feature in broader application context
   - Expected Output: Successful integration verification

7. **read_file** (documentation files)
   - Purpose: Update documentation for new feature
   - Expected Output: Updated docs reflecting changes

8. **run_terminal_cmd** (build/deploy verification)
   - Purpose: Ensure feature works in production environment
   - Expected Output: Successful deployment

**Quality Gates:**
- All tests pass
- Code coverage maintained
- Documentation updated
- No linting errors
- Build succeeds`
          },
          {
            type: 'workflow',
            name: 'API Development Chain',
            description: 'Chain for developing REST/gRPC APIs with proper testing',
            content: `## API Development Tool Chain

**Chain Purpose:** Develop robust APIs with comprehensive testing and documentation

**Execution Steps:**

1. **read_file** (existing API endpoints)
   - Purpose: Understand current API patterns and conventions
   - Expected Output: API structure examples

2. **grep** (pattern: router|route|endpoint)
   - Purpose: Identify routing patterns and middleware usage
   - Expected Output: Route definition patterns

3. **search_replace** (create API endpoint)
   - Purpose: Implement the new API endpoint
   - Expected Output: Functional API endpoint

4. **run_terminal_cmd** (API testing - Postman/cURL)
   - Purpose: Test basic endpoint functionality
   - Expected Output: Successful API responses

5. **search_replace** (add comprehensive tests)
   - Purpose: Create unit and integration tests
   - Expected Output: Complete test coverage

6. **run_terminal_cmd** (test execution)
   - Purpose: Run all tests and validate coverage
   - Expected Output: Passing tests with good coverage

7. **search_replace** (API documentation)
   - Purpose: Document the API endpoint
   - Expected Output: Updated API documentation

8. **run_terminal_cmd** (load testing)
   - Purpose: Verify performance under load
   - Expected Output: Performance metrics within acceptable ranges

**API Standards:**
- Proper HTTP status codes
- Input validation and sanitization
- Error handling and logging
- Authentication/authorization
- Rate limiting and security headers`
          },
          {
            type: 'template',
            name: 'Implementation Checklist',
            description: 'Comprehensive checklist for code implementation',
            content: `## Implementation Checklist

**Feature:** [Feature Name]
**Developer:** [Developer Name]
**Date Started:** [Start Date]

### Planning Phase
- [ ] Requirements reviewed and understood
- [ ] Technical design completed
- [ ] Dependencies identified
- [ ] Test scenarios defined
- [ ] Acceptance criteria established

### Development Phase
- [ ] Code structure planned
- [ ] Core functionality implemented
- [ ] Error handling added
- [ ] Input validation implemented
- [ ] Logging added where needed
- [ ] Code reviewed (self-review)

### Testing Phase
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Performance tested
- [ ] Security tested (if applicable)

### Quality Assurance
- [ ] Code linted and formatted
- [ ] No console errors/warnings
- [ ] Build passes successfully
- [ ] Documentation updated
- [ ] No breaking changes introduced

### Deployment Preparation
- [ ] Feature flag added (if needed)
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] Rollback plan prepared
- [ ] Monitoring/alerts configured

### Post-Deployment
- [ ] Feature deployed to staging
- [ ] Manual testing completed
- [ ] User acceptance testing passed
- [ ] Performance monitoring active
- [ ] Documentation published

### Sign-off
- [ ] Code review completed
- [ ] QA approval obtained
- [ ] Product owner approval obtained
- [ ] Ready for production deployment

**Notes/Issues:** [Any additional notes or unresolved issues]`
          }
        ]
      },

      {
        id: 'debugging-diagnostic-chain',
        name: 'Debugging & Diagnostic Chain',
        description: 'Comprehensive tool chains for debugging and diagnostics',
        category: 'tool-chaining',
        complexity: 'high',
        tags: ['debugging', 'diagnostics', 'troubleshooting', 'errors', 'performance'],
        resources: [
          {
            type: 'workflow',
            name: 'Error Investigation Chain',
            description: 'Systematic approach to investigating and resolving errors',
            content: `## Error Investigation Tool Chain

**Chain Purpose:** Systematically investigate, diagnose, and resolve application errors

**Execution Steps:**

1. **read_file** (error logs/application logs)
   - Purpose: Gather error details and context
   - Expected Output: Error messages, stack traces, timestamps

2. **grep** (pattern: error|exception|fail, context: 3)
   - Purpose: Find all related error occurrences
   - Expected Output: Pattern of errors and their frequency

3. **read_file** (code at error location)
   - Purpose: Examine the code where error occurs
   - Expected Output: Code context and potential issues

4. **grep** (pattern: variable|function from error context)
   - Purpose: Trace data flow and dependencies
   - Expected Output: Related code paths and data usage

5. **run_terminal_cmd** (reproduce error)
   - Purpose: Create minimal reproduction case
   - Expected Output: Consistent error reproduction

6. **search_replace** (add debugging/logging)
   - Purpose: Add diagnostic information
   - Expected Output: Enhanced error context and logging

7. **run_terminal_cmd** (test fix incrementally)
   - Purpose: Verify fix works and doesn't break other functionality
   - Expected Output: Error resolved, tests passing

8. **run_terminal_cmd** (regression testing)
   - Purpose: Ensure fix doesn't introduce new issues
   - Expected Output: All existing functionality preserved

**Debugging Principles:**
- Reproduce before investigating
- Isolate the problem
- Change one thing at a time
- Test thoroughly after fixes
- Document the root cause and solution`
          },
          {
            type: 'workflow',
            name: 'Performance Diagnostic Chain',
            description: 'Chain for diagnosing and resolving performance issues',
            content: `## Performance Diagnostic Tool Chain

**Chain Purpose:** Identify, analyze, and resolve performance bottlenecks

**Execution Steps:**

1. **run_terminal_cmd** (performance profiling)
   - Purpose: Establish performance baseline
   - Expected Output: CPU, memory, and timing metrics

2. **grep** (pattern: loop|iteration|query)
   - Purpose: Identify potential performance bottlenecks
   - Expected Output: Code locations with high algorithmic complexity

3. **run_terminal_cmd** (load testing)
   - Purpose: Test performance under realistic load
   - Expected Output: Performance degradation patterns

4. **read_file** (slow functions/methods)
   - Purpose: Analyze inefficient code patterns
   - Expected Output: Code optimization opportunities

5. **search_replace** (implement optimizations)
   - Purpose: Apply performance improvements
   - Expected Output: Optimized code with better algorithms

6. **run_terminal_cmd** (caching implementation)
   - Purpose: Add caching where beneficial
   - Expected Output: Reduced redundant operations

7. **run_terminal_cmd** (performance re-testing)
   - Purpose: Verify improvements and identify remaining issues
   - Expected Output: Measurable performance gains

8. **run_terminal_cmd** (memory leak detection)
   - Purpose: Check for memory-related performance issues
   - Expected Output: Memory usage patterns and leaks identified

**Performance Optimization Strategies:**
- Algorithm optimization (O(n²) → O(n))
- Database query optimization
- Caching implementation
- Memory management improvements
- Asynchronous processing
- Resource pooling`
          },
          {
            type: 'template',
            name: 'Debug Report Template',
            description: 'Standard template for documenting debugging sessions',
            content: `## Debug Report

**Issue:** [Brief description of the problem]
**Reported By:** [Who reported the issue]
**Date:** [Date of investigation]
**Investigator:** [Your name/role]

### Initial Assessment
**Severity:** [Critical/High/Medium/Low]
**Reproducibility:** [Always/Sometimes/Rarely/Never]
**Environment:** [Development/Staging/Production]

### Error Details
**Error Message:**
\`\`\`
[Full error message and stack trace]
\`\`\`

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

### Investigation Process
**Tools Used:**
- [Tool 1 and purpose]
- [Tool 2 and purpose]

**Key Findings:**
1. [Finding 1 and evidence]
2. [Finding 2 and evidence]
3. [Finding 3 and evidence]

**Root Cause:**
[Identified root cause with detailed explanation]

### Solution Implemented
**Changes Made:**
\`\`\`
[Code changes, file modifications, configuration updates]
\`\`\`

**Testing Performed:**
- [Test case 1 and result]
- [Test case 2 and result]
- [Test case 3 and result]

### Verification
**Before Fix:**
- [Performance/Error metrics before fix]

**After Fix:**
- [Performance/Error metrics after fix]

**Impact Assessment:**
- [How the fix affects other parts of the system]

### Prevention Measures
**Similar Issues Prevention:**
1. [Measure 1 - code review, testing, monitoring]
2. [Measure 2 - documentation, alerts, validation]

**Knowledge Base Updates:**
- [Documentation, runbooks, or KB articles updated]

### Follow-up Actions
- [ ] Monitor for similar issues
- [ ] Update error handling patterns
- [ ] Improve logging/monitoring
- [ ] Team training/knowledge sharing

**Status:** [Resolved/Fixed/Monitoring/In Progress]

**Resolution Time:** [Time spent on resolution]`
          }
        ]
      },

      {
        id: 'cross-server-orchestration',
        name: 'Cross-Server Orchestration Chain',
        description: 'Tool chains that orchestrate workflows across multiple MCP servers',
        category: 'tool-chaining',
        complexity: 'high',
        tags: ['orchestration', 'cross-server', 'multi-server', 'integration', 'workflow'],
        resources: [
          {
            type: 'workflow',
            name: 'Research & Analysis Chain',
            description: 'Cross-server chain for comprehensive research and analysis',
            content: `## Research & Analysis Orchestration Chain

**Chain Purpose:** Perform comprehensive research using multiple specialized servers

**Participating Servers:**
- google-search-mcp (web search and content analysis)
- wikipedia-mcp (factual information and background)
- filesystem-mcp (local documentation and notes)

**Execution Steps:**

1. **google-search-mcp: search** (topic research)
   - Purpose: Gather current information and trends
   - Expected Output: Recent articles, studies, and developments

2. **wikipedia-mcp: getPage** (background information)
   - Purpose: Get foundational knowledge and context
   - Expected Output: Comprehensive background information

3. **google-search-mcp: content_summarizer** (key findings)
   - Purpose: Extract and summarize important insights
   - Expected Output: Key points and conclusions from research

4. **filesystem-mcp: search_replace** (create research notes)
   - Purpose: Document findings and insights
   - Expected Output: Organized research notes and analysis

5. **google-search-mcp: fact_checker** (verify information)
   - Purpose: Validate key claims and facts
   - Expected Output: Fact-checking results and credibility assessment

6. **filesystem-mcp: read_file** (review compiled research)
   - Purpose: Review and synthesize all gathered information
   - Expected Output: Comprehensive research summary

**Data Flow:**
- Search results → Wikipedia context → Content summarization → Fact checking → Documentation

**Quality Assurance:**
- Multiple sources for validation
- Fact-checking of key claims
- Comprehensive documentation
- Cross-reference verification`
          },
          {
            type: 'workflow',
            name: 'Development Workflow Orchestration',
            description: 'Complete development workflow using multiple specialized servers',
            content: `## Development Workflow Orchestration Chain

**Chain Purpose:** Execute complete development lifecycle using specialized MCP servers

**Participating Servers:**
- filesystem-mcp (code management)
- terminal-mcp (build and deployment)
- google-search-mcp (documentation and research)

**Execution Steps:**

1. **filesystem-mcp: read_file** (analyze requirements)
   - Purpose: Understand project requirements and constraints
   - Expected Output: Clear requirements specification

2. **google-search-mcp: search** (research best practices)
   - Purpose: Find relevant patterns and solutions
   - Expected Output: Best practices and implementation approaches

3. **filesystem-mcp: search_replace** (implement solution)
   - Purpose: Create the implementation following best practices
   - Expected Output: Working code solution

4. **terminal-mcp: run_command** (run tests)
   - Purpose: Validate functionality with automated tests
   - Expected Output: Passing test results

5. **terminal-mcp: run_command** (lint and format)
   - Purpose: Ensure code quality and consistency
   - Expected Output: Clean, well-formatted code

6. **filesystem-mcp: grep** (check for issues)
   - Purpose: Identify any remaining issues or improvements
   - Expected Output: Code quality assessment

7. **terminal-mcp: run_command** (build deployment)
   - Purpose: Create production-ready build
   - Expected Output: Successful build artifacts

8. **terminal-mcp: run_command** (deploy to staging)
   - Purpose: Deploy to staging environment for testing
   - Expected Output: Successful deployment and basic functionality verification

**Workflow Stages:**
1. **Planning** - Requirements and research
2. **Implementation** - Code development and testing
3. **Quality Assurance** - Linting, testing, code review
4. **Deployment** - Build and deployment verification

**Success Metrics:**
- All tests passing
- Code quality standards met
- Successful deployment
- Documentation updated`
          },
          {
            type: 'workflow',
            name: 'Content Creation Chain',
            description: 'Cross-server chain for creating comprehensive content',
            content: `## Content Creation Orchestration Chain

**Chain Purpose:** Create high-quality content using multiple research and writing tools

**Participating Servers:**
- google-search-mcp (research and fact-checking)
- wikipedia-mcp (background information)
- filesystem-mcp (content management and editing)

**Execution Steps:**

1. **google-search-mcp: research_assistant** (topic research)
   - Purpose: Gather comprehensive information on the topic
   - Expected Output: Research data and key insights

2. **wikipedia-mcp: getPageSummary** (background context)
   - Purpose: Get foundational knowledge and definitions
   - Expected Output: Clear background information

3. **google-search-mcp: search_trends** (current trends)
   - Purpose: Understand current developments and trends
   - Expected Output: Trend analysis and current perspectives

4. **filesystem-mcp: search_replace** (create content outline)
   - Purpose: Structure the content based on research
   - Expected Output: Detailed content outline

5. **filesystem-mcp: search_replace** (write first draft)
   - Purpose: Create the initial content draft
   - Expected Output: Complete first draft

6. **google-search-mcp: fact_checker** (verify facts)
   - Purpose: Ensure all information is accurate
   - Expected Output: Fact-checking report with corrections

7. **filesystem-mcp: search_replace** (revise content)
   - Purpose: Incorporate fact-check corrections and improvements
   - Expected Output: Improved content draft

8. **filesystem-mcp: read_file** (final review)
   - Purpose: Final content review and quality check
   - Expected Output: Ready-to-publish content

**Content Quality Standards:**
- Factual accuracy (verified through fact-checking)
- Comprehensive coverage (multiple sources)
- Current relevance (trend analysis)
- Clear structure and organization
- Engaging and well-written presentation`
          },
          {
            type: 'template',
            name: 'Cross-Server Workflow Template',
            description: 'Template for designing workflows across multiple MCP servers',
            content: `## Cross-Server Workflow Design Template

**Workflow Name:** [Descriptive workflow name]
**Purpose:** [What this workflow accomplishes]
**Complexity:** [Low/Medium/High]

### Participating Servers
| Server | Purpose | Primary Tools |
|--------|---------|---------------|
| [Server 1] | [Purpose] | [Tool 1, Tool 2] |
| [Server 2] | [Purpose] | [Tool 1, Tool 2] |
| [Server 3] | [Purpose] | [Tool 1, Tool 2] |

### Data Flow Diagram
\`\`\`
[Server 1 Output] → [Server 2 Input Transformation] → [Server 3]
[Server 2 Output] → [Server 1 Additional Processing] → [Final Output]
\`\`\`

### Execution Steps
1. **Step 1: [Server.Tool]**
   - Input: [What goes in]
   - Processing: [What the tool does]
   - Output: [What comes out]
   - Success Criteria: [How to know it worked]

2. **Step 2: [Server.Tool]**
   - Input: [What goes in]
   - Processing: [What the tool does]
   - Output: [What comes out]
   - Success Criteria: [How to know it worked]

3. **Step 3: [Server.Tool]**
   - Input: [What goes in]
   - Processing: [What the tool does]
   - Output: [What comes out]
   - Success Criteria: [How to know it worked]

### Error Handling
- **Step Failure Recovery:** [How to handle individual step failures]
- **Alternative Paths:** [Backup approaches if primary path fails]
- **Data Validation:** [How to validate data between steps]

### Performance Considerations
- **Execution Time:** [Expected total duration]
- **Resource Usage:** [Server load and resource requirements]
- **Optimization Opportunities:** [Ways to improve performance]

### Quality Assurance
- **Validation Steps:** [How to verify workflow success]
- **Testing Strategy:** [How to test the workflow]
- **Monitoring:** [What to monitor during execution]

### Documentation Requirements
- [ ] Step-by-step execution guide
- [ ] Troubleshooting procedures
- [ ] Performance benchmarks
- [ ] Example use cases
- [ ] Maintenance procedures

### Risk Assessment
**High Risk Factors:**
- [Factor 1 and mitigation strategy]
- [Factor 2 and mitigation strategy]

**Contingency Plans:**
- [Plan for server unavailability]
- [Plan for data format changes]
- [Plan for performance issues]`
          }
        ]
      },

      {
        id: 'continuous-integration-chain',
        name: 'Continuous Integration Chain',
        description: 'Tool chains for CI/CD pipelines and automated workflows',
        category: 'tool-chaining',
        complexity: 'high',
        tags: ['ci', 'cd', 'automation', 'pipelines', 'deployment', 'testing'],
        resources: [
          {
            type: 'workflow',
            name: 'Automated Testing Pipeline',
            description: 'Complete automated testing pipeline with multiple validation stages',
            content: `## Automated Testing Pipeline Chain

**Chain Purpose:** Execute comprehensive automated testing across multiple dimensions

**Participating Servers:**
- terminal-mcp (test execution)
- filesystem-mcp (code analysis and reporting)
- google-search-mcp (test data generation and validation)

**Execution Steps:**

1. **terminal-mcp: run_command** (linting)
   - Purpose: Check code quality and style compliance
   - Expected Output: Clean code with no linting errors

2. **terminal-mcp: run_command** (unit tests)
   - Purpose: Test individual functions and components
   - Expected Output: All unit tests passing with coverage report

3. **terminal-mcp: run_command** (integration tests)
   - Purpose: Test component interactions and data flow
   - Expected Output: Successful integration test results

4. **terminal-mcp: run_command** (end-to-end tests)
   - Purpose: Test complete user workflows
   - Expected Output: All E2E scenarios passing

5. **filesystem-mcp: grep** (security scan)
   - Purpose: Check for security vulnerabilities in code
   - Expected Output: Security scan results and recommendations

6. **terminal-mcp: run_command** (performance tests)
   - Purpose: Validate performance requirements
   - Expected Output: Performance metrics within acceptable ranges

7. **filesystem-mcp: read_file** (generate test report)
   - Purpose: Compile comprehensive test results
   - Expected Output: Detailed test report with all findings

8. **terminal-mcp: run_command** (quality gate check)
   - Purpose: Verify all quality standards are met
   - Expected Output: Pass/fail decision for deployment

**Quality Gates:**
- Code coverage > 80%
- No critical security vulnerabilities
- All tests passing
- Performance within SLA
- No linting errors

**Test Types Coverage:**
- Unit Tests (function/component level)
- Integration Tests (component interaction)
- End-to-End Tests (user journey)
- Performance Tests (load and stress)
- Security Tests (vulnerability scanning)`
          },
          {
            type: 'workflow',
            name: 'Deployment Pipeline Chain',
            description: 'Automated deployment pipeline with staging and production releases',
            content: `## Deployment Pipeline Orchestration Chain

**Chain Purpose:** Automate the complete deployment process from build to production

**Participating Servers:**
- terminal-mcp (build and deployment)
- filesystem-mcp (configuration and artifact management)
- google-search-mcp (release notes and documentation)

**Execution Steps:**

1. **terminal-mcp: run_command** (build application)
   - Purpose: Create production-ready build artifacts
   - Expected Output: Optimized build artifacts ready for deployment

2. **terminal-mcp: run_command** (run pre-deployment tests)
   - Purpose: Validate build quality before deployment
   - Expected Output: All pre-deployment tests passing

3. **filesystem-mcp: search_replace** (update configuration)
   - Purpose: Configure application for target environment
   - Expected Output: Environment-specific configuration applied

4. **terminal-mcp: run_command** (deploy to staging)
   - Purpose: Deploy to staging environment for validation
   - Expected Output: Successful staging deployment

5. **terminal-mcp: run_command** (staging smoke tests)
   - Purpose: Perform basic functionality validation in staging
   - Expected Output: Core functionality verified in staging

6. **filesystem-mcp: read_file** (generate release notes)
   - Purpose: Document changes and updates in this release
   - Expected Output: Comprehensive release notes

7. **terminal-mcp: run_command** (deploy to production)
   - Purpose: Deploy to production environment
   - Expected Output: Successful production deployment

8. **terminal-mcp: run_command** (production validation)
   - Purpose: Validate production deployment and functionality
   - Expected Output: Production system fully operational

**Deployment Strategy:**
- **Blue-Green Deployment**: Maintain separate production environments
- **Canary Releases**: Gradual rollout with monitoring
- **Rollback Plan**: Automated rollback procedures for issues

**Monitoring & Alerting:**
- Health checks every 30 seconds post-deployment
- Error rate monitoring and alerting
- Performance monitoring and thresholds
- User impact assessment and communication`
          },
          {
            type: 'workflow',
            name: 'Code Quality Assurance Chain',
            description: 'Automated code quality checks and continuous improvement',
            content: `## Code Quality Assurance Chain

**Chain Purpose:** Maintain high code quality through automated checks and improvements

**Participating Servers:**
- terminal-mcp (linting, formatting, testing)
- filesystem-mcp (code analysis and documentation)
- google-search-mcp (best practices research)

**Execution Steps:**

1. **terminal-mcp: run_command** (multi-language linting)
   - Purpose: Check code quality across all languages used
   - Expected Output: Linting results with identified issues

2. **terminal-mcp: run_command** (code formatting)
   - Purpose: Ensure consistent code formatting and style
   - Expected Output: Formatted code following project standards

3. **terminal-mcp: run_command** (static analysis)
   - Purpose: Perform deep code analysis for potential issues
   - Expected Output: Static analysis report with recommendations

4. **filesystem-mcp: grep** (complexity analysis)
   - Purpose: Identify overly complex functions and methods
   - Expected Output: Code complexity metrics and hotspots

5. **google-search-mcp: search** (best practices check)
   - Purpose: Research current best practices for identified issues
   - Expected Output: Relevant best practices and solutions

6. **filesystem-mcp: search_replace** (automated fixes)
   - Purpose: Apply automatic fixes for common issues
   - Expected Output: Improved code following best practices

7. **terminal-mcp: run_command** (test coverage analysis)
   - Purpose: Ensure adequate test coverage for all code
   - Expected Output: Coverage report with gaps identified

8. **filesystem-mcp: read_file** (quality metrics report)
   - Purpose: Generate comprehensive quality assessment
   - Expected Output: Quality metrics and improvement recommendations

**Quality Metrics Tracked:**
- Code complexity (cyclomatic complexity)
- Test coverage percentage
- Technical debt ratio
- Code duplication percentage
- Security vulnerability count
- Performance benchmark scores

**Continuous Improvement:**
- Weekly quality trend analysis
- Monthly deep-dive reviews
- Automated refactoring suggestions
- Team training based on findings`
          },
          {
            type: 'template',
            name: 'CI/CD Pipeline Configuration',
            description: 'Template for configuring CI/CD pipelines',
            content: `## CI/CD Pipeline Configuration

**Pipeline Name:** [Pipeline Name]
**Repository:** [Git Repository URL]
**Branch:** [Target Branch]

### Pipeline Stages

#### 1. Build Stage
\`\`\`yaml
build:
  script:
    - [Build commands]
  artifacts:
    - [Artifacts to preserve]
  cache:
    - [Dependencies to cache]
\`\`\`

#### 2. Test Stage
\`\`\`yaml
test:
  script:
    - [Test commands]
  coverage: /[Coverage regex pattern]/
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
\`\`\`

#### 3. Quality Stage
\`\`\`yaml
quality:
  script:
    - [Quality check commands]
  artifacts:
    reports:
      codequality: gl-code-quality-report.json
\`\`\`

#### 4. Security Stage
\`\`\`yaml
security:
  script:
    - [Security scanning commands]
  artifacts:
    reports:
      sast: gl-sast-report.json
\`\`\`

#### 5. Deploy Stage
\`\`\`yaml
deploy:
  script:
    - [Deployment commands]
  environment:
    name: [Environment name]
    url: [Environment URL]
  only:
    - [Deployment triggers]
\`\`\`

### Pipeline Variables
\`\`\`yaml
variables:
  DOCKER_IMAGE: [Image name]
  DOCKER_TAG: [Tag strategy]
  ENVIRONMENT: [Target environment]
\`\`\`

### Rules and Conditions
- **Manual Deployments:** [When to require manual approval]
- **Automatic Triggers:** [When to run automatically]
- **Failure Handling:** [What to do on failures]

### Monitoring and Notifications
- **Success Notifications:** [Where to send success alerts]
- **Failure Notifications:** [Where to send failure alerts]
- **Metrics Collection:** [What metrics to track]

### Rollback Procedures
1. [Step 1: Identify the issue]
2. [Step 2: Stop the pipeline]
3. [Step 3: Rollback to previous version]
4. [Step 4: Verify rollback success]
5. [Step 5: Investigate root cause]

### Maintenance
- **Schedule:** [How often to review and update]
- **Owner:** [Who is responsible for maintenance]
- **Documentation:** [Where pipeline docs are kept]`
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
