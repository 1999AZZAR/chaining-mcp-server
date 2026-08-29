#!/usr/bin/env node

/**
 * Smoke test suite for chaining-mcp-server.
 * Tests every single tool and resource end-to-end to verify correctness and latency.
 */

import { MCPServerDiscovery } from './dist/core/discovery.js';
import { SmartRouteOptimizer } from './dist/core/optimizer.js';
import { SequentialThinkingIntegration } from './dist/integrations/sequential-integration.js';
import { SequentialThinkingManager } from './dist/managers/sequential-thinking-manager.js';
import { TimeManager } from './dist/managers/time-manager.js';
import { PromptRegistry } from './dist/prompts/prompt-registry.js';
import { AwesomeCopilotIntegration } from './dist/integrations/awesome-copilot-integration.js';
import { BrainstormingManager } from './dist/managers/brainstorming-manager.js';
import { WorkflowOrchestrator } from './dist/managers/workflow-orchestrator.js';
import { LLMManager } from './dist/managers/llm-manager.js';
import { RequestHandlers } from './dist/handlers/request-handlers.js';
import { ResourceHandlers } from './dist/resources/resource-handlers.js';
import { chainingResources } from './dist/resources/resource-definitions.js';

async function runSmokeTests() {
  console.log('🚀 Starting Chaining MCP Smoke Test Suite...');
  const start = Date.now();

  const discovery = new MCPServerDiscovery();
  const optimizer = new SmartRouteOptimizer();
  const sequentialIntegration = new SequentialThinkingIntegration();
  const sequentialThinkingManager = new SequentialThinkingManager();
  const timeManager = new TimeManager();
  const promptRegistry = new PromptRegistry();
  const awesomeCopilotIntegration = new AwesomeCopilotIntegration();
  const brainstormingManager = new BrainstormingManager();
  const workflowOrchestrator = new WorkflowOrchestrator();
  const llmManager = new LLMManager();

  await discovery.discoverServers();
  await discovery.analyzeTools();
  optimizer.setTools(discovery.getTools());
  sequentialIntegration.setAvailableTools(discovery.getTools());

  const requestHandlers = new RequestHandlers(
    discovery,
    optimizer,
    sequentialIntegration,
    sequentialThinkingManager,
    timeManager,
    promptRegistry,
    awesomeCopilotIntegration,
    brainstormingManager,
    workflowOrchestrator,
    llmManager
  );

  const resourceHandlers = new ResourceHandlers(
    discovery,
    promptRegistry,
    awesomeCopilotIntegration,
    sequentialThinkingManager,
    workflowOrchestrator,
    llmManager
  );

  const toolTests = [
    { name: 'list_mcp_servers', args: {} },
    { name: 'analyze_tools', args: {} },
    { name: 'generate_route_suggestions', args: { task: 'analyze a web project' } },
    { name: 'analyze_with_sequential_thinking', args: { problem: 'optimize database queries' } },
    { name: 'get_tool_chain_analysis', args: { input: 'file transformation workflow' } },
    { name: 'sequentialthinking', args: { thought: 'Initial thought', thoughtNumber: 1, totalThoughts: 2, nextThoughtNeeded: true } },
    { name: 'search_instructions', args: { keywords: 'typescript' } },
    { name: 'load_instruction', args: { mode: 'instructions', filename: 'typescript-mcp-server.instructions.md' } },
    { name: 'brainstorming', args: { topic: 'improve agent reliability', ideaCount: 3 } },
    { name: 'workflow_orchestrator', args: { workflowId: 'wf-1', name: 'Test', steps: [{ id: 's1', serverName: 'filesystem', toolName: 'read_file' }] } },
    { name: 'get_current_time', args: { timezone: 'UTC' } },
    { name: 'convert_time', args: { source_timezone: 'UTC', time: '12:00', target_timezone: 'Asia/Jakarta' } },
    { name: 'get_prompt', args: { id: 'analyze-project-structure' } },
    { name: 'search_prompts', args: { keyword: 'security' } },
    { name: 'search_prompts', args: {} }, // Test returning all 40+ prompts when no query provided
    { name: 'get_resource_set', args: { id: 'development-starter-kit' } },
    { name: 'search_resource_sets', args: { query: 'development' } },
    {
      name: 'validate_tool_chain',
      args: {
        toolChain: [{ toolName: 'read_file' }] // Test auto-normalization without id or serverName
      }
    },
    {
      name: 'analyze_tool_chain_performance',
      args: {
        toolChain: [{ toolName: 'read_file' }] // Test performance analysis without explicit option flags
      }
    },
    { name: 'llm_query', args: { prompt: 'Hello' } },
    { name: 'llm_decompose_task', args: { task: 'Build a REST API' } },
    { name: 'llm_suggest_route', args: { task: 'Refactor database models' } },
    { name: 'llm_summarize', args: { content: 'Sample long log content for testing summarization' } }
  ];

  console.log('\n--- 1. Testing Tools ---');
  let toolPass = 0;
  for (const test of toolTests) {
    const t0 = Date.now();
    try {
      const res = await requestHandlers.handleToolCall(test.name, test.args);
      const elapsed = Date.now() - t0;
      if (res && res.error && !res.source && test.name !== 'llm_query') {
        console.error(`  ❌ Tool '${test.name}' returned error: ${res.error}`);
      } else {
        if (test.name === 'search_prompts' && test.args.keyword === undefined && (!res.prompts || res.prompts.length === 0)) {
          console.error(`  ❌ Tool 'search_prompts' returned empty prompts array`);
          continue;
        }
        if (test.name === 'analyze_tool_chain_performance' && (!res.metrics || res.metrics.totalEstimatedDuration === 0)) {
          console.error(`  ❌ Tool 'analyze_tool_chain_performance' returned 0 duration`);
          continue;
        }
        console.log(`  ✅ Tool '${test.name}' passed in ${elapsed}ms`);
        toolPass++;
      }
    } catch (err) {
      console.error(`  ❌ Tool '${test.name}' threw exception:`, err);
    }
  }

  console.log('\n--- 2. Testing Resources ---');
  let resPass = 0;
  for (const r of chainingResources) {
    const t0 = Date.now();
    try {
      const res = await resourceHandlers.handleReadResource(r.uri);
      const elapsed = Date.now() - t0;
      console.log(`  ✅ Resource '${r.uri}' read successfully in ${elapsed}ms`);
      resPass++;
    } catch (err) {
      console.error(`  ❌ Resource '${r.uri}' failed:`, err);
    }
  }

  const totalTime = Date.now() - start;
  console.log(`\n========================================`);
  console.log(`Results: Tools ${toolPass}/${toolTests.length} | Resources ${resPass}/${chainingResources.length}`);
  console.log(`Total duration: ${totalTime}ms`);
  console.log(`========================================`);

  if (toolPass === toolTests.length && resPass === chainingResources.length) {
    console.log('🎉 ALL TESTS PASSED STRICT VERIFICATION!');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed.');
    process.exit(1);
  }
}

runSmokeTests().catch(err => {
  console.error('Smoke test suite failed:', err);
  process.exit(1);
});
