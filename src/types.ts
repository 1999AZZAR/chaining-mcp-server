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

// Type exports
export type MCPServerInfo = z.infer<typeof MCPServerInfoSchema>;
export type ToolInfo = z.infer<typeof ToolInfoSchema>;
export type RouteSuggestion = z.infer<typeof RouteSuggestionSchema>;
export type OptimizationCriteria = z.infer<typeof OptimizationCriteriaSchema>;
export type SequentialThinkingRequest = z.infer<typeof SequentialThinkingRequestSchema>;
export type ToolChainAnalysis = z.infer<typeof ToolChainAnalysisSchema>;
