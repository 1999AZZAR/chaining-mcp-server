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

// Memory/Knowledge Graph Schemas
export const EntitySchema = z.object({
  name: z.string().describe('The name of the entity'),
  entityType: z.string().describe('The type of the entity'),
  observations: z.array(z.string()).describe('An array of observation contents associated with the entity'),
});

export const RelationSchema = z.object({
  from: z.string().describe('The name of the entity where the relation starts'),
  to: z.string().describe('The name of the entity where the relation ends'),
  relationType: z.string().describe('The type of the relation'),
});

export const CreateEntitiesSchema = z.object({
  entities: z.array(EntitySchema).describe('Array of entities to create'),
});

export const CreateRelationsSchema = z.object({
  relations: z.array(RelationSchema).describe('Array of relations to create'),
});

export const AddObservationsSchema = z.object({
  observations: z.array(z.object({
    entityName: z.string().describe('The name of the entity to add the observations to'),
    contents: z.array(z.string()).describe('An array of observation contents to add'),
  })).describe('Array of observations to add'),
});

export const DeleteEntitiesSchema = z.object({
  entityNames: z.array(z.string()).describe('An array of entity names to delete'),
});

export const DeleteObservationsSchema = z.object({
  deletions: z.array(z.object({
    entityName: z.string().describe('The name of the entity containing the observations'),
    observations: z.array(z.string()).describe('An array of observations to delete'),
  })).describe('Array of observations to delete'),
});

export const DeleteRelationsSchema = z.object({
  relations: z.array(RelationSchema).describe('An array of relations to delete'),
});

export const SearchNodesSchema = z.object({
  query: z.string().describe('The search query to match against entity names, types, and observation content'),
});

export const OpenNodesSchema = z.object({
  names: z.array(z.string()).describe('An array of entity names to retrieve'),
});

// Sequential Thinking Schemas
export const SequentialThinkingSchema = z.object({
  thought: z.string().describe('Your current thinking step'),
  nextThoughtNeeded: z.boolean().describe('Whether another thought step is needed'),
  thoughtNumber: z.number().min(1).describe('Current thought number'),
  totalThoughts: z.number().min(1).describe('Estimated total thoughts needed'),
  isRevision: z.boolean().optional().describe('Whether this revises previous thinking'),
  revisesThought: z.number().min(1).optional().describe('Which thought is being reconsidered'),
  branchFromThought: z.number().min(1).optional().describe('Branching point thought number'),
  branchId: z.string().optional().describe('Branch identifier'),
  needsMoreThoughts: z.boolean().optional().describe('If more thoughts are needed'),
});

// Time Schemas
export const GetCurrentTimeSchema = z.object({
  timezone: z.string().describe('IANA timezone name (e.g., America/New_York, Europe/London)'),
});

export const ConvertTimeSchema = z.object({
  source_timezone: z.string().describe('Source IANA timezone name'),
  time: z.string().describe('Time to convert in 24-hour format (HH:MM)'),
  target_timezone: z.string().describe('Target IANA timezone name'),
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

// Memory types
export type Entity = z.infer<typeof EntitySchema>;
export type Relation = z.infer<typeof RelationSchema>;
export type CreateEntitiesInput = z.infer<typeof CreateEntitiesSchema>;
export type CreateRelationsInput = z.infer<typeof CreateRelationsSchema>;
export type AddObservationsInput = z.infer<typeof AddObservationsSchema>;
export type DeleteEntitiesInput = z.infer<typeof DeleteEntitiesSchema>;
export type DeleteObservationsInput = z.infer<typeof DeleteObservationsSchema>;
export type DeleteRelationsInput = z.infer<typeof DeleteRelationsSchema>;
export type SearchNodesInput = z.infer<typeof SearchNodesSchema>;
export type OpenNodesInput = z.infer<typeof OpenNodesSchema>;

// Sequential thinking types
export type SequentialThinkingInput = z.infer<typeof SequentialThinkingSchema>;

// Time types
export type GetCurrentTimeInput = z.infer<typeof GetCurrentTimeSchema>;
export type ConvertTimeInput = z.infer<typeof ConvertTimeSchema>;
