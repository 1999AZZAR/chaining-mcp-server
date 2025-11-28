import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { coreChainingTools } from './core-chaining-tools.js';
import { awesomeCopilotTools } from './awesome-copilot-tools.js';
import { sequentialThinkingTools } from './sequential-thinking-tools.js';
import { timeManagementTools } from './time-management-tools.js';
import { promptResourceTools } from './prompt-resource-tools.js';
import { validationAnalysisTools } from './validation-analysis-tools.js';

export const allTools: Tool[] = [
  ...coreChainingTools,
  ...awesomeCopilotTools,
  ...sequentialThinkingTools,
  ...timeManagementTools,
  ...promptResourceTools,
  ...validationAnalysisTools,
];

export {
  coreChainingTools,
  awesomeCopilotTools,
  sequentialThinkingTools,
  timeManagementTools,
  promptResourceTools,
  validationAnalysisTools,
};
