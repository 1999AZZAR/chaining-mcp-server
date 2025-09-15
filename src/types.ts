import { z } from 'zod';

// MCP Server Information Schema
export const MCPServerInfoSchema = z.object({
  name: z.string(),
  command: z.string(),
  args: z.array(z.string()),
  env: z.record(z.string()).optional(),
  description: z.string().optional(),
  version: z.string().optional(),
  capabilities: z.object({
    tools: z.boolean().optional(),
    resources: z.boolean().optional(),
    prompts: z.boolean().optional(),
  }).optional(),
});

// Tool Information Schema
export const ToolInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.any()),
  serverName: z.string(),
  category: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  estimatedComplexity: z.number().min(1).max(10).optional(),
  estimatedDuration: z.number().optional(), // in milliseconds
});

// Route Suggestion Schema
export const RouteSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tools: z.array(ToolInfoSchema),
  estimatedDuration: z.number(),
  complexity: z.number().min(1).max(10),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

// Optimization Criteria Schema
export const OptimizationCriteriaSchema = z.object({
  prioritizeSpeed: z.boolean().default(false),
  prioritizeSimplicity: z.boolean().default(false),
  prioritizeReliability: z.boolean().default(false),
  maxComplexity: z.number().min(1).max(10).optional(),
  maxDuration: z.number().optional(), // in milliseconds
  requiredCapabilities: z.array(z.string()).optional(),
  excludedTools: z.array(z.string()).optional(),
});

// Sequential Thinking Integration Schema
export const SequentialThinkingRequestSchema = z.object({
  problem: z.string(),
  context: z.record(z.any()).optional(),
  maxThoughts: z.number().min(1).max(20).default(10),
  optimizationCriteria: OptimizationCriteriaSchema.optional(),
});

// Tool Chain Analysis Schema
export const ToolChainAnalysisSchema = z.object({
  input: z.string(),
  availableTools: z.array(ToolInfoSchema),
  suggestedRoutes: z.array(RouteSuggestionSchema),
  analysis: z.object({
    totalToolsAvailable: z.number(),
    averageComplexity: z.number(),
    fastestRoute: z.string().optional(),
    simplestRoute: z.string().optional(),
    mostReliableRoute: z.string().optional(),
  }),
});

// Tool Input Schemas for MCP Server
export const ListMCPServersSchema = z.object({
  // No parameters needed
});

export const AnalyzeToolsSchema = z.object({
  serverName: z.string().optional().describe('Optional: filter by specific server name'),
  category: z.string().optional().describe('Optional: filter by tool category'),
});

export const GenerateRouteSuggestionsSchema = z.object({
  task: z.string().describe('The task or problem to solve'),
  criteria: OptimizationCriteriaSchema.optional().describe('Optimization criteria'),
});

export const AnalyzeWithSequentialThinkingSchema = z.object({
  problem: z.string().describe('The problem to analyze'),
  criteria: OptimizationCriteriaSchema.optional().describe('Optimization criteria'),
  maxThoughts: z.number().min(1).max(20).default(10).describe('Maximum number of thoughts for sequential analysis'),
});

export const GetToolChainAnalysisSchema = z.object({
  input: z.string().describe('Input description for analysis'),
  criteria: OptimizationCriteriaSchema.optional().describe('Optimization criteria'),
});

// Type exports
export type MCPServerInfo = z.infer<typeof MCPServerInfoSchema>;
export type ToolInfo = z.infer<typeof ToolInfoSchema>;
export type RouteSuggestion = z.infer<typeof RouteSuggestionSchema>;
export type OptimizationCriteria = z.infer<typeof OptimizationCriteriaSchema>;
export type SequentialThinkingRequest = z.infer<typeof SequentialThinkingRequestSchema>;
export type ToolChainAnalysis = z.infer<typeof ToolChainAnalysisSchema>;
export type ListMCPServersInput = z.infer<typeof ListMCPServersSchema>;
export type AnalyzeToolsInput = z.infer<typeof AnalyzeToolsSchema>;
export type GenerateRouteSuggestionsInput = z.infer<typeof GenerateRouteSuggestionsSchema>;
export type AnalyzeWithSequentialThinkingInput = z.infer<typeof AnalyzeWithSequentialThinkingSchema>;
export type GetToolChainAnalysisInput = z.infer<typeof GetToolChainAnalysisSchema>;
